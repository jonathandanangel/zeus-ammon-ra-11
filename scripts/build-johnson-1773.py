#!/usr/bin/env python3
"""Build Johnson 1773 lexicon buckets from the StarDict DSL (Internet Archive johnson_1773)."""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.request
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public", "johnson")
SRC_DIR = os.path.join(PUBLIC, "1773-src")
OUT_DIR = os.path.join(PUBLIC, "lexicon-1773")
DSL_URL = "https://archive.org/download/johnson_1773/johnson_1773.dsl"


def strip_dsl_markup(text: str) -> str:
    text = re.sub(r"\[/?[^\]]*\]", " ", text)
    text = re.sub(r"\{\{[^}]*\}\}", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def norm_hw(headword: str) -> str:
    headword = strip_dsl_markup(headword)
    headword = re.sub(r"^(to\s+)", "", headword, flags=re.I)
    headword = headword.split(",")[0].strip()
    return re.sub(r"[^A-Za-z']", "", headword).upper()


def ensure_dsl(path: str) -> None:
    if os.path.isfile(path) and os.path.getsize(path) > 1_000_000:
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    print(f"Downloading {DSL_URL} …")
    urllib.request.urlretrieve(DSL_URL, path)


def parse_dsl(path: str) -> dict[str, dict]:
    raw = open(path, "rb").read()
    text = raw.decode("utf-16") if raw[1:2] == b"\x00" or raw.startswith(b"\xff\xfe") else raw.decode(
        "utf-8", errors="replace"
    )
    text = text.lstrip("\ufeff")
    lines = text.splitlines()
    i = 0
    while i < len(lines) and (
        lines[i].startswith("#") or not lines[i].strip() or lines[i].strip().startswith("{{")
    ):
        i += 1

    lexicon: dict[str, dict] = {}
    while i < len(lines):
        line = lines[i]
        if not line.strip() or line.startswith("\t") or line.startswith(" "):
            i += 1
            continue
        hw_raw = line.strip()
        i += 1
        body: list[str] = []
        while i < len(lines) and (lines[i].startswith("\t") or (lines[i].startswith(" ") and lines[i].strip())):
            body.append(lines[i].lstrip("\t "))
            i += 1
        if not body:
            continue
        body_text = " ".join(body)
        pos = ""
        first = strip_dsl_markup(body[0])
        match = re.match(r"^([^,\[]+),\s*([^.\[]+\.)?", first)
        if match and match.group(2):
            pos = match.group(2).strip()
        senses: list[str] = []
        for sense_match in re.finditer(
            r"(?:\[m\d+\])?\s*(\d+)\.\s*(.*?)(?=(?:\[m\d+\])?\s*\d+\.|$)",
            body_text,
            re.S,
        ):
            sense = strip_dsl_markup(sense_match.group(2))
            if len(sense) > 20:
                senses.append(sense[:517] + "…" if len(sense) > 520 else sense)
        if not senses:
            sense = strip_dsl_markup(body_text)
            if len(sense) > 40:
                senses.append(sense[:517] + "…" if len(sense) > 520 else sense)
        headword = norm_hw(hw_raw)
        if not headword or not senses:
            continue
        entry = lexicon.setdefault(headword, {"p": pos, "s": []})
        if pos and not entry["p"]:
            entry["p"] = pos
        for sense in senses:
            if sense not in entry["s"]:
                entry["s"].append(sense)
            if len(entry["s"]) >= 5:
                break
    return lexicon


def main() -> int:
    dsl_path = os.path.join(SRC_DIR, "johnson_1773.dsl")
    ensure_dsl(dsl_path)
    print("Parsing 1773 DSL…")
    lexicon = parse_dsl(dsl_path)
    os.makedirs(OUT_DIR, exist_ok=True)
    buckets: dict[str, dict] = defaultdict(dict)
    for key, value in lexicon.items():
        buckets[key[0] if key else "_"][key] = value
    for bucket, entries in buckets.items():
        with open(os.path.join(OUT_DIR, f"{bucket}.json"), "w", encoding="utf-8") as handle:
            json.dump(
                {"bucket": bucket, "edition": "1773", "count": len(entries), "entries": entries},
                handle,
                separators=(",", ":"),
                ensure_ascii=False,
            )
    with open(os.path.join(PUBLIC, "lexicon-1773-manifest.json"), "w", encoding="utf-8") as handle:
        json.dump(
            {
                "source": "Samuel Johnson, Dictionary of the English Language, 4th ed. (1773) · via johnsonsdictionaryonline.com / LEME CC BY 4.0 · StarDict DSL (Alex Laemmle / Internet Archive johnson_1773)",
                "edition": "1773",
                "count": len(lexicon),
                "bucketDir": "lexicon-1773",
            },
            handle,
            indent=2,
        )
    print(f"Wrote {len(lexicon)} headwords to {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
