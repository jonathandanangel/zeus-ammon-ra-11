#!/usr/bin/env python3
"""Build Johnson dictionary assets from LEME XML + UCF zip facsimile scans."""

from __future__ import annotations

import gzip
import html
import json
import os
import re
import struct
import subprocess
import sys
from xml.etree import ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public", "johnson")
FAC = os.path.join(PUBLIC, "facsimile")
ZIP_DEFAULT = os.path.expanduser(
    "~/JohnsonDictionary/OneDrive_2026_06_04__1_.zip"
)


def strip_tags(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def norm_headword(form_text: str) -> str:
    text = strip_tags(form_text)
    text = re.sub(r"\s+", " ", text).strip()
    match = re.match(r"^(To\s+)?([^\.]+?)(?:\.\s*.*)?$", text, re.I)
    head = (match.group(2) if match else text.split(".")[0]).strip()
    return re.sub(r"[^A-Za-z']", "", head).upper()


def build_lexicon(xml_path: str) -> dict[str, dict]:
    lexicon: dict[str, dict] = {}
    for _, elem in ET.iterparse(xml_path, events=("end",)):
        if elem.tag != "wordentry":
            continue
        form = elem.find("form")
        xpln = elem.find("xpln")
        if form is None or xpln is None:
            elem.clear()
            continue
        form_html = ET.tostring(form, encoding="unicode")
        headword = norm_headword(form.text or form_html)
        if not headword:
            elem.clear()
            continue
        pos_match = re.search(r'<class type="pos">([^<]+)</class>', form_html)
        pos = strip_tags(pos_match.group(1)) if pos_match else ""
        sense = strip_tags(ET.tostring(xpln, encoding="unicode"))
        if len(sense) > 520:
            sense = sense[:517] + "…"
        entry = lexicon.setdefault(headword, {"p": pos, "s": []})
        if sense and sense not in entry["s"]:
            entry["s"].append(sense)
            entry["s"] = entry["s"][:5]
        elem.clear()
    return lexicon


def write_lexicon_buckets(lexicon: dict[str, dict]) -> None:
    bucket_dir = os.path.join(PUBLIC, "lexicon")
    os.makedirs(bucket_dir, exist_ok=True)
    buckets: dict[str, dict] = {}
    for key, value in lexicon.items():
        bucket = key[0] if key else "_"
        buckets.setdefault(bucket, {})[key] = value
    for bucket, entries in buckets.items():
        path = os.path.join(bucket_dir, f"{bucket}.json")
        with open(path, "w", encoding="utf-8") as handle:
            json.dump(
                {"bucket": bucket, "count": len(entries), "entries": entries},
                handle,
                separators=(",", ":"),
            )


def build_hocr_estimates(hocr_path: str, max_page: int) -> dict[str, int]:
    with gzip.open(hocr_path, "rt", encoding="utf-8", errors="replace") as handle:
        hocr = handle.read()
    words: dict[str, int] = {}
    for match in re.finditer(r"\bTo\s+([A-Z']+)\.", hocr):
        word = match.group(1).upper()
        ratio = match.start() / len(hocr)
        words[word] = max(1, min(max_page, int(1 + ratio * (max_page - 1))))
    return words


def find_entry_end(handle, data_start: int) -> tuple[int, int] | None:
    offset = 0
    handle.seek(data_start)
    while True:
        chunk = handle.read(4 * 1024 * 1024)
        if not chunk:
            return None
        pos = 0
        while True:
            idx = chunk.find(b"PK\x07\x08", pos)
            if idx < 0:
                break
            abs_pos = data_start + offset + idx
            handle.seek(abs_pos + 4)
            tail = handle.read(12)
            if len(tail) < 12:
                return None
            _, comp_size, uncomp_size = struct.unpack("<III", tail)
            data_len = abs_pos - data_start
            if comp_size == uncomp_size == data_len:
                return abs_pos + 16, data_len
            pos = idx + 1
        offset += len(chunk)


def build_page_index(zip_path: str) -> dict[int, dict]:
    pages: dict[int, dict] = {}
    pos = 0
    zip_size = os.path.getsize(zip_path)
    with open(zip_path, "rb") as handle:
        while pos < zip_size:
            handle.seek(pos)
            if handle.read(4) != b"PK\x03\x04":
                break
            rest = handle.read(26)
            (_, _, _, _, _, _, _, _, fn_len, extra_len) = struct.unpack(
                "<HHHHHIIIHH", rest
            )
            filename = handle.read(fn_len).decode("utf-8", "replace")
            if extra_len:
                handle.read(extra_len)
            data_start = handle.tell()
            end_info = find_entry_end(handle, data_start)
            if not end_info:
                break
            next_pos, data_len = end_info
            page_match = re.search(r"1755-v1-(\d+)\.tif$", filename, re.I)
            if page_match:
                page_num = int(page_match.group(1))
                pages[page_num] = {
                    "offset": data_start,
                    "length": data_len,
                    "path": filename,
                }
            pos = next_pos
    return pages


def extract_page(zip_path: str, page_index: dict[int, dict], page_num: int) -> bytes | None:
    meta = page_index.get(page_num)
    if not meta:
        return None
    with open(zip_path, "rb") as handle:
        handle.seek(meta["offset"])
        return handle.read(meta["length"])


def convert_tif_to_jpg(tif_path: str, jpg_path: str) -> bool:
    for cmd in (
        ["sips", "-s", "format", "jpeg", "-Z", "1400", tif_path, "--out", jpg_path],
        ["magick", tif_path, "-resize", "1400x1400>", jpg_path],
    ):
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            return True
    return False


def main() -> int:
    xml_path = os.path.join(PUBLIC, "johnson-1755.xml")
    hocr_path = os.path.join(PUBLIC, "johnson-hocr.txt.gz")
    zip_path = os.environ.get("JOHNSON_ZIP", ZIP_DEFAULT)
    os.makedirs(FAC, exist_ok=True)

    if not os.path.isfile(xml_path):
        print(f"Missing {xml_path}", file=sys.stderr)
        return 1

    print("Building LEME lexicon buckets…")
    lexicon = build_lexicon(xml_path)
    write_lexicon_buckets(lexicon)
    print(f"  {len(lexicon)} headwords")

    page_index: dict[int, dict] = {}
    if os.path.isfile(zip_path):
        print(f"Indexing UCF zip: {zip_path}")
        page_index = build_page_index(zip_path)
        with open(os.path.join(PUBLIC, "page-index.json"), "w", encoding="utf-8") as handle:
            json.dump(
                {
                    "source": "UCF Johnson 1755 OneDrive zip",
                    "pageCount": len(page_index),
                    "min": min(page_index) if page_index else None,
                    "max": max(page_index) if page_index else None,
                    "pages": {str(k): v for k, v in page_index.items()},
                },
                handle,
                indent=2,
            )
        print(f"  {len(page_index)} scan pages indexed")
    else:
        print(f"Zip not found ({zip_path}); skipping facsimile extraction.")

    max_page = max(page_index) if page_index else 2288
    if os.path.isfile(hocr_path):
        estimates = build_hocr_estimates(hocr_path, max_page)
        with open(os.path.join(PUBLIC, "hocr-page-estimates.json"), "w", encoding="utf-8") as handle:
            json.dump(
                {
                    "method": f"HOCR character ratio × {max_page} scans",
                    "maxPage": max_page,
                    "words": estimates,
                },
                handle,
                indent=2,
            )

    extracted_pages: list[int] = [1]
    if page_index:
        extracted_pages.append(max(2, min(max_page, 66)))
        for word in ("LOVE", "KING", "HOPE", "FAITH", "WISDOM"):
            est_path = os.path.join(PUBLIC, "hocr-page-estimates.json")
            if os.path.isfile(est_path):
                with open(est_path, encoding="utf-8") as handle:
                    words = json.load(handle).get("words", {})
                page = words.get(word)
                if page and page in page_index:
                    extracted_pages.append(page)

    manifest_pages: list[int] = []
    for page in sorted(set(extracted_pages)):
        if page not in page_index:
            continue
        data = extract_page(zip_path, page_index, page)
        if not data:
            continue
        tif_path = os.path.join(FAC, f"page-{page:04d}.tif")
        jpg_path = os.path.join(FAC, f"page-{page:04d}.jpg")
        with open(tif_path, "wb") as handle:
            handle.write(data)
        if convert_tif_to_jpg(tif_path, jpg_path):
            manifest_pages.append(page)
            print(f"  facsimile page {page}")
        os.remove(tif_path)

    with open(os.path.join(FAC, "manifest.json"), "w", encoding="utf-8") as handle:
        json.dump(
            {
                "source": "UCF high-res scans (OneDrive zip, partial archive)",
                "pages": manifest_pages,
                "files": [f"page-{p:04d}.jpg" for p in manifest_pages],
            },
            handle,
            indent=2,
        )

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
