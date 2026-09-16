#!/usr/bin/env python3
"""Extract TRI-52 item pages + answer key into gitignored local assets.

Usage:
  python3 scripts/extract-tri52.py /path/to/704718590-TRI-52.pdf

Writes:
  public/extreme-puzzle/items/q01.png … q52.png
  public/extreme-puzzle/answers.json
  public/extreme-puzzle/manifest.json

Those paths are gitignored — do not commit copyrighted TRI-52 materials.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

try:
    import fitz
except ImportError as e:
    raise SystemExit("PyMuPDF (fitz) required: pip install pymupdf") from e

KNOWN_ANSWERS = {
    1: [3],
    2: [5],
    3: [2],
    4: [6],
    5: [4],
    6: [5],
    7: [1],
    8: [1],
    9: [6],
    10: [3],
    11: [5],
    12: [2],
    13: [5],
    14: [4],
    15: [4],
    16: [6],
    17: [4],
    18: [6],
    19: [5],
    20: [3],
    21: [1, 4],
    22: [3, 4],
    23: [4],
    24: [1],
    25: [6],
    26: [3],
    27: [1, 5],
    28: [6],
    29: [2, 4],
    30: [5],
    31: [5],
    32: [3],
    33: [1],
    34: [6],
    35: [1],
    36: [3],
    37: [6],
    38: [1],
    39: [5],
    40: [2],
    41: [1],
    42: [5],
    43: [2],
    44: [5],
    45: [3],
    46: [5],
    47: [3],
    48: [2],
    49: [6],
    50: [3],
    51: [5],
    52: [1],
}


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    pdf = Path(sys.argv[1]).expanduser().resolve()
    if not pdf.is_file():
        raise SystemExit(f"PDF not found: {pdf}")

    root = Path(__file__).resolve().parents[1] / "public" / "extreme-puzzle"
    items = root / "items"
    items.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(pdf)
    if doc.page_count < 59:
        raise SystemExit(f"Expected ≥59 pages, got {doc.page_count}")

    manifest = []
    for n in range(1, 53):
        page = doc[6 + n - 1]  # pages 7–58
        pix = page.get_pixmap(matrix=fitz.Matrix(2.5, 2.5), alpha=False)
        rel = f"items/q{n:02d}.png"
        pix.save(str(root / rel))
        manifest.append({"id": n, "image": f"/extreme-puzzle/{rel}", "page": 6 + n})
        print(f"q{n:02d} {pix.width}x{pix.height}")

    # Prefer page-59 parse; fall back to verified key
    text = doc[58].get_text() or ""
    parsed: dict[int, list[int]] = {}
    for m in re.finditer(r"(\d{1,2})\.\s*([0-9,\s]+)", text):
        n = int(m.group(1))
        if 1 <= n <= 52:
            parts = [int(x) for x in re.findall(r"\d+", m.group(2)) if 1 <= int(x) <= 6]
            if parts:
                parsed[n] = parts
    answers = {i: parsed.get(i, KNOWN_ANSWERS[i]) for i in range(1, 53)}

    (root / "answers.json").write_text(
        json.dumps({str(k): v for k, v in answers.items()}, indent=2) + "\n",
        encoding="utf-8",
    )
    (root / "manifest.json").write_text(
        json.dumps(
            {
                "count": 52,
                "items": manifest,
                "sourceNote": "Local private extract — do not redistribute TRI-52.",
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {root}")


if __name__ == "__main__":
    main()
