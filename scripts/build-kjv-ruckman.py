#!/usr/bin/env python3
"""Extract 1611 KJV+Apocrypha verses and build Ruckman-cited pack for Numerology."""

from __future__ import annotations

import json
import os
import re
import sys
from collections import defaultdict

try:
    import fitz
except ImportError:
    print("Install PyMuPDF: pip install pymupdf", file=sys.stderr)
    raise SystemExit(1)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "kjv")
PDF_DEFAULT = os.path.expanduser("~/1611KjvW_apocrypha.pdf")

BOOK_ALIASES = {
    "genesis": "Genesis",
    "exodus": "Exodus",
    "leviticus": "Leviticus",
    "numbers": "Numbers",
    "deuteronomy": "Deuteronomy",
    "joshua": "Joshua",
    "judges": "Judges",
    "ruth": "Ruth",
    "1 samuel": "1 Samuel",
    "2 samuel": "2 Samuel",
    "1 kings": "1 Kings",
    "2 kings": "2 Kings",
    "1 chronicles": "1 Chronicles",
    "2 chronicles": "2 Chronicles",
    "ezra": "Ezra",
    "nehemiah": "Nehemiah",
    "esther": "Esther",
    "job": "Job",
    "psalms": "Psalms",
    "psalm": "Psalms",
    "proverbs": "Proverbs",
    "ecclesiastes": "Ecclesiastes",
    "song of solomon": "Song of Solomon",
    "isaiah": "Isaiah",
    "jeremiah": "Jeremiah",
    "lamentations": "Lamentations",
    "ezekiel": "Ezekiel",
    "daniel": "Daniel",
    "hosea": "Hosea",
    "joel": "Joel",
    "amos": "Amos",
    "obadiah": "Obadiah",
    "jonah": "Jonah",
    "micah": "Micah",
    "nahum": "Nahum",
    "habakkuk": "Habakkuk",
    "zephaniah": "Zephaniah",
    "haggai": "Haggai",
    "zechariah": "Zechariah",
    "malachi": "Malachi",
    "matthew": "Matthew",
    "mark": "Mark",
    "luke": "Luke",
    "john": "John",
    "acts": "Acts",
    "romans": "Romans",
    "1 corinthians": "1 Corinthians",
    "2 corinthians": "2 Corinthians",
    "galatians": "Galatians",
    "ephesians": "Ephesians",
    "philippians": "Philippians",
    "colossians": "Colossians",
    "1 thessalonians": "1 Thessalonians",
    "2 thessalonians": "2 Thessalonians",
    "1 timothy": "1 Timothy",
    "2 timothy": "2 Timothy",
    "titus": "Titus",
    "philemon": "Philemon",
    "hebrews": "Hebrews",
    "james": "James",
    "1 peter": "1 Peter",
    "2 peter": "2 Peter",
    "1 john": "1 John",
    "2 john": "2 John",
    "3 john": "3 John",
    "jude": "Jude",
    "revelation": "Revelation",
    "1 esdras": "1 Esdras",
    "2 esdras": "2 Esdras",
    "tobit": "Tobit",
    "judith": "Judith",
    "wisdom": "Wisdom",
    "ecclesiasticus": "Ecclesiasticus",
    "baruch": "Baruch",
    "susanna": "Susanna",
    "1 maccabees": "1 Maccabees",
    "2 maccabees": "2 Maccabees",
}

# Verses Ruckman cites or clearly references in the 1–9 glosses.
RUCKMAN_REFS: dict[int, list[tuple[str, str]]] = {
    1: [
        ("Deuteronomy", "6:4"),
        ("Genesis", "1:9"),
        ("Genesis", "2:24"),
        ("Ephesians", "4:4"),
        ("Ephesians", "4:5"),
    ],
    2: [
        ("Amos", "3:3"),
        ("Genesis", "1:16"),
        ("Genesis", "2:21"),
        ("Genesis", "2:22"),
    ],
    3: [],
    4: [
        ("Genesis", "8:22"),
        ("Ezekiel", "1:5"),
        ("Ezekiel", "1:10"),
    ],
    5: [
        ("Genesis", "5:5"),
        ("Genesis", "1:20"),
        ("Genesis", "1:23"),
        ("Exodus", "27:1"),
        ("2 Samuel", "2:23"),
    ],
    6: [
        ("Genesis", "1:26"),
        ("Genesis", "1:31"),
        ("Genesis", "7:6"),
        ("Revelation", "13:18"),
    ],
    7: [
        ("Genesis", "2:2"),
        ("Genesis", "2:3"),
        ("Leviticus", "23:3"),
        ("Leviticus", "25:8"),
        ("Revelation", "1:4"),
        ("Revelation", "1:20"),
    ],
    8: [
        ("1 Peter", "3:20"),
        ("Genesis", "17:12"),
        ("1 Samuel", "16:10"),
        ("1 Samuel", "16:11"),
        ("1 Samuel", "16:12"),
    ],
    9: [
        ("Galatians", "5:22"),
        ("Galatians", "5:23"),
        ("1 Corinthians", "12:8"),
        ("1 Corinthians", "12:9"),
        ("1 Corinthians", "12:10"),
        ("Romans", "4:19"),
        ("Romans", "4:20"),
    ],
}


def normalize_book(name: str) -> str | None:
    n = re.sub(r"\s+", " ", name.strip().lower())
    n = re.sub(r"^the ", "", n)
    n = re.sub(r"^book of ", "", n)
    return BOOK_ALIASES.get(n)


def extract_verses(pdf: str) -> dict[str, dict[str, str]]:
    doc = fitz.open(pdf)
    by_book: dict[str, dict[str, str]] = defaultdict(dict)
    current: str | None = None
    verse_re = re.compile(r"\{(\d+):(\d+)\}")

    for page_index in range(doc.page_count):
        page = doc[page_index].get_text().replace("\u00ad", "")
        for line in page.splitlines():
            line = line.strip()
            if not line or re.match(r"^Page\s+\d+$", line, re.I):
                continue
            book = normalize_book(line)
            if book and len(line) < 40:
                current = book
                continue
            m = re.match(r"The Gospel According to Saint (\w+)", line, re.I)
            if m:
                current = normalize_book(m.group(1)) or m.group(1).title()
                continue
            if re.match(r"The Acts of the Apostles", line, re.I):
                current = "Acts"
                continue
            if re.match(r"The Revelation of (?:Saint )?John", line, re.I):
                current = "Revelation"
                continue

        if not current:
            continue

        parts = list(verse_re.finditer(page))
        for j, match in enumerate(parts):
            ch, vs = int(match.group(1)), int(match.group(2))
            start = match.end()
            end = parts[j + 1].start() if j + 1 < len(parts) else len(page)
            body = re.sub(r"\s+", " ", page[start:end]).strip()
            body = body.replace("[", "").replace("]", "")
            body = re.sub(r"\s+(Genesis|Exodus|Matthew|Page \d+).*$", "", body)
            if len(body) < 3:
                continue
            key = f"{ch}:{vs}"
            if key not in by_book[current]:
                by_book[current][key] = body[:800]
    return by_book


def main() -> int:
    pdf = os.environ.get("KJV_PDF", PDF_DEFAULT)
    if not os.path.isfile(pdf):
        print(f"Missing PDF: {pdf}", file=sys.stderr)
        return 1

    os.makedirs(OUT, exist_ok=True)
    print("Extracting verses…")
    by_book = extract_verses(pdf)
    print(f"  books={len(by_book)} verses={sum(len(v) for v in by_book.values())}")

    cited: dict[str, list[dict]] = {}
    for number, refs in RUCKMAN_REFS.items():
        items = []
        for book, cv in refs:
            text = by_book.get(book, {}).get(cv)
            if not text:
                print(f"  missing {book} {cv}", file=sys.stderr)
                continue
            items.append({"ref": f"{book} {cv}", "book": book, "cv": cv, "text": text})
        cited[str(number)] = items

    with open(os.path.join(OUT, "ruckman-cited.json"), "w", encoding="utf-8") as handle:
        json.dump(
            {
                "source": "King James Version with Apocrypha (1611 text · davince.com/bible)",
                "note": "Verses cited or clearly referenced in Dr. Peter S. Ruckman, Bible Numerics (1981), for digits 1–9 only.",
                "byNumber": cited,
            },
            handle,
            indent=2,
            ensure_ascii=False,
        )

    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as handle:
        json.dump(
            {
                "source": "King James Version with Apocrypha (1611 text · davince.com/bible)",
                "pdf": os.path.basename(pdf),
                "citedOnly": True,
                "numbers": sorted(int(k) for k in cited),
            },
            handle,
            indent=2,
        )

    print("Wrote public/kjv/ruckman-cited.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
