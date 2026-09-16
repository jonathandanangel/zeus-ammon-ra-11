#!/usr/bin/env python3
"""Build Secret Doctrine passage index from Blavatsky PDF (public domain)."""

from __future__ import annotations

import json
import os
import re
import sys
from collections import defaultdict

try:
    import fitz  # PyMuPDF
except ImportError:
    print("Install PyMuPDF: pip install pymupdf", file=sys.stderr)
    raise SystemExit(1)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "secret-doctrine")
PDF_DEFAULT = os.path.expanduser("~/The-Secret-Doctrine-by-H.P.-BlavatskyTrue.pdf")

NUM_BOOST = {
    "number",
    "numbers",
    "numerology",
    "numerical",
    "numeral",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "unity",
    "duality",
    "triad",
    "trinity",
    "quaternary",
    "septenary",
    "septenate",
    "hebdomad",
    "monad",
    "duad",
    "triune",
    "circle",
    "triangle",
    "square",
    "cube",
    "fohat",
    "dzyan",
    "kosmos",
    "cosmos",
    "logos",
    "manvantara",
    "hierarchy",
    "hierarchies",
    "vibration",
    "occult",
    "esoteric",
    "pythagoras",
    "pythagorean",
    "kabala",
    "kabbalah",
}

STOP = set(
    """a an the and or of to in on for with by as is are be that this it its into from at not no but
which who whom whose what when where why how all any each every both few more most other some such
than then too very can will just also only own same so than too very vol page pages ibid etc cf
blavatsky secret doctrine theosophical university press online edition cosmogenesis anthropogenesis
""".split()
)


def clean_text(text: str) -> str:
    text = text.replace("\u00ad", "")
    text = re.sub(r"\[\[[^\]]*\]\]", " ", text)
    text = re.sub(r"The Secret Doctrine by H\. P\. Blavatsky[^\n]*\n?", "", text)
    text = re.sub(r"Theosophical University Press Online Edition\n?", "", text)
    return re.sub(r"\s+", " ", text).strip()


def main() -> int:
    pdf = os.environ.get("SECRET_DOCTRINE_PDF", PDF_DEFAULT)
    if not os.path.isfile(pdf):
        print(f"Missing PDF: {pdf}", file=sys.stderr)
        return 1

    os.makedirs(OUT, exist_ok=True)
    doc = fitz.open(pdf)
    passages: list[dict] = []
    min_len, max_len = 120, 720

    for page_index in range(doc.page_count):
        text = clean_text(doc[page_index].get_text())
        if len(text) < 80:
            continue
        chunks = re.split(r"(?<=[.!?])\s+(?=[A-Z\"“(])", text)
        buf = ""
        page_num = page_index + 1
        for sent in chunks:
            if not sent.strip():
                continue
            if len(buf) + len(sent) < max_len:
                buf = (buf + " " + sent).strip() if buf else sent.strip()
            else:
                if len(buf) >= min_len:
                    passages.append({"id": len(passages), "page": page_num, "t": buf[:max_len]})
                buf = sent.strip()
                while len(buf) > max_len:
                    passages.append({"id": len(passages), "page": page_num, "t": buf[:max_len]})
                    buf = buf[max_len:].lstrip()
        if len(buf) >= min_len:
            passages.append({"id": len(passages), "page": page_num, "t": buf[:max_len]})

    word_hits: dict[str, list[tuple[int, int]]] = defaultdict(list)
    for passage in passages:
        counts: dict[str, int] = defaultdict(int)
        for word in re.findall(r"[a-zA-Z']+", passage["t"].lower()):
            if len(word) < 3 or word in STOP:
                continue
            counts[word] += 1
        boost = sum(1 for word in counts if word in NUM_BOOST)
        for word, count in counts.items():
            score = count + (2 if word in NUM_BOOST else 0) + min(boost, 3)
            word_hits[word].append((passage["id"], score))

    index: dict[str, list[int]] = {}
    for word, hits in word_hits.items():
        hits.sort(key=lambda item: (-item[1], item[0]))
        seen_pages: set[int] = set()
        chosen: list[int] = []
        for passage_id, _ in hits:
            page = passages[passage_id]["page"]
            if page in seen_pages and len(chosen) >= 4:
                continue
            chosen.append(passage_id)
            seen_pages.add(page)
            if len(chosen) >= 12:
                break
        index[word] = chosen

    chunk_size = 500
    chunk_count = (len(passages) + chunk_size - 1) // chunk_size
    for i in range(chunk_count):
        chunk = passages[i * chunk_size : (i + 1) * chunk_size]
        path = os.path.join(OUT, f"passages-{i:03d}.json")
        with open(path, "w", encoding="utf-8") as handle:
            json.dump(chunk, handle, separators=(",", ":"), ensure_ascii=False)

    idx_dir = os.path.join(OUT, "index")
    os.makedirs(idx_dir, exist_ok=True)
    buckets: dict[str, dict[str, list[int]]] = defaultdict(dict)
    for word, ids in index.items():
        bucket = word[0] if word and word[0].isalpha() else "_"
        buckets[bucket][word] = ids
    for bucket, entries in buckets.items():
        with open(os.path.join(idx_dir, f"{bucket}.json"), "w", encoding="utf-8") as handle:
            json.dump({"bucket": bucket, "entries": entries}, handle, separators=(",", ":"))

    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as handle:
        json.dump(
            {
                "source": "H. P. Blavatsky, The Secret Doctrine (public domain · Theosophical University Press Online Edition)",
                "pdf": os.path.basename(pdf),
                "pages": doc.page_count,
                "passageCount": len(passages),
                "chunkSize": chunk_size,
                "chunkCount": chunk_count,
                "wordCount": len(index),
            },
            handle,
            indent=2,
        )

    print(f"passages={len(passages)} words={len(index)} chunks={chunk_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
