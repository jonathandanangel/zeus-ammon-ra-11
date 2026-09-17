#!/usr/bin/env python3
"""
Build a tiny legal ZEUS Babel seed EPUB and translate EN→FR via the vendored
clcreuso pipeline *without* Codex (manual/glossary targets), then validate+build.

Full Codex AI translation: `codex login` then
  npm run babel:epub -- path/to/book.epub French --glossary tools/the-babel-library/glossaries/zeus-numerology-babel.md
"""

from __future__ import annotations

import json
import re
import shutil
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIB = ROOT / "tools" / "the-babel-library"
sys.path.insert(0, str(LIB))

import epub_translate as pipeline  # noqa: E402

BOOK_NAME = "ZEUS Babel Seed"
SOURCE_EPUB = LIB / "books" / "_fixtures" / "zeus-babel-seed.epub"
OUT_PUBLIC = ROOT / "public" / "numerology" / "babel" / "epub-library" / "samples"
GLOSSARY = LIB / "glossaries" / "zeus-numerology-babel.md"

# Ordered longest-first so multi-word phrases win. Avoid bare "seed" (breaks sentences).
PHRASE_MAP = [
    ("Library of Babel", "Bibliothèque de Babel"),
    ("Thought-Forms", "Formes-pensées"),
    ("Secret Doctrine", "Doctrine secrète"),
    ("hexagonal gallery", "galerie hexagonale"),
    ("digital root", "racine digitale"),
    ("path number", "nombre de chemin"),
    ("locate, do not invent", "localiser, ne pas inventer"),
    ("amber highlight", "surbrillance ambre"),
    ("Greek Myths", "Mythes grecs"),
    ("Johnson's Dictionary", "Dictionnaire de Johnson"),
    ("image archives", "archives d'images"),
    ("ZEUS Babel Seed", "Graine Babel ZEUS"),
    ("NUMEROLOGY", "NUMÉROLOGIE"),
    ("Babelia", "Babelia"),
    ("hexagon", "hexagone"),
]


def translate_text(source: str) -> str:
    # Whole-sentence / label fallbacks first
    replacements = {
        "A short seed book for the ZEUS AMMON-RA NUMEROLOGY Babel twin.": (
            "Un court livre-graine pour le jumeau Babel NUMÉROLOGIE de ZEUS AMMON-RA."
        ),
        "Pages are located, not authored.": "Les pages sont localisées, non rédigées.",
        "Every path word opens a hexagonal gallery in the Library of Babel idea.": (
            "Chaque mot de chemin ouvre une galerie hexagonale dans l'idée de la Bibliothèque de Babel."
        ),
        "Johnson's Dictionary, the Secret Doctrine, Greek Myths, and Thought-Forms "
        "supply amber highlight phrases.": (
            "Le Dictionnaire de Johnson, la Doctrine secrète, les Mythes grecs et les Formes-pensées "
            "fournissent les phrases en surbrillance ambre."
        ),
        "Babelia image archives regenerate plates from a location number — "
        "locate, do not invent.": (
            "Les archives d'images Babelia régénèrent les planches à partir d'un numéro de localisation — "
            "localiser, ne pas inventer."
        ),
        "The path number and digital root index the shelf.": (
            "Le nombre de chemin et la racine digitale indexent l'étagère."
        ),
        "Chapter One · Locate": "Chapitre un · Localiser",
        "Table of Contents": "Table des matières",
        "Cover": "Couverture",
        "ZEUS Babel Seed": "Graine Babel ZEUS",
        "ZEUS Babel Seed: Table of Contents": "Graine Babel ZEUS : Table des matières",
    }
    if source in replacements:
        return replacements[source]
    out = source
    for en, fr in replacements.items():
        out = out.replace(en, fr)
    for en, fr in PHRASE_MAP:
        out = re.sub(re.escape(en), fr, out, flags=re.IGNORECASE)
    return out


def write_epub(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    files = {
        "META-INF/container.xml": """<?xml version="1.0"?>
<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">
  <rootfiles><rootfile full-path="content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>""",
        "content.opf": """<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="book-id">zeus-babel-seed</dc:identifier>
    <dc:title>ZEUS Babel Seed</dc:title>
    <dc:language>en</dc:language>
    <dc:creator>ZEUS AMMON-RA 11</dc:creator>
    <dc:description>A short seed book for the ZEUS AMMON-RA NUMEROLOGY Babel twin.</dc:description>
    <meta name="cover" content="cover"/>
  </metadata>
  <manifest>
    <item id="chapter" href="OEBPS/ch01.xhtml" media-type="application/xhtml+xml"/>
    <item id="css" href="OEBPS/book.css" media-type="text/css"/>
    <item id="nav" href="OEBPS/nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="cover" href="OEBPS/cover.jpg" media-type="image/jpeg"/>
  </manifest>
  <spine toc="ncx"><itemref idref="chapter"/></spine>
</package>""",
        "OEBPS/ch01.xhtml": """<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head><title>ZEUS Babel Seed</title><link href="book.css" rel="stylesheet" type="text/css"/></head>
<body class="book">
<h1 id="chapter-one">Chapter One · Locate</h1>
<p>A short seed book for the ZEUS AMMON-RA NUMEROLOGY Babel twin.</p>
<p>Pages are located, not authored.</p>
<p>Every path word opens a hexagonal gallery in the Library of Babel idea.</p>
<p>Johnson's Dictionary, the Secret Doctrine, Greek Myths, and Thought-Forms supply amber highlight phrases.</p>
<p>Babelia image archives regenerate plates from a location number — locate, do not invent.</p>
<p>The path number and digital root index the shelf.</p>
</body></html>""",
        "OEBPS/nav.xhtml": """<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head><title>ZEUS Babel Seed: Table of Contents</title></head><body>
<nav><h1>Table of Contents</h1><ol>
<li><a href="ch01.xhtml">Chapter One · Locate</a></li>
<li><a href="cover.jpg">Cover</a></li>
</ol></nav>
</body></html>""",
        "toc.ncx": """<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" xml:lang="en" version="2005-1">
<head/><docTitle><text>ZEUS Babel Seed</text></docTitle><navMap>
<navPoint id="n1" playOrder="1"><navLabel><text>Chapter One · Locate</text></navLabel><content src="OEBPS/ch01.xhtml"/></navPoint>
</navMap></ncx>""",
        "OEBPS/book.css": b"body.book { color: #222; background-color: #f7f2e8; }\n",
        "OEBPS/cover.jpg": b"\xff\xd8\xff\xd9",  # minimal JPEG
    }
    with zipfile.ZipFile(path, "w") as archive:
        archive.writestr("mimetype", b"application/epub+zip", compress_type=zipfile.ZIP_STORED)
        for name, content in files.items():
            data = content if isinstance(content, (bytes, bytearray)) else content.encode("utf-8")
            archive.writestr(name, data, compress_type=zipfile.ZIP_DEFLATED)


def main() -> int:
    write_epub(SOURCE_EPUB)
    paths = pipeline.project_paths(SOURCE_EPUB, "fr", BOOK_NAME)
    # Fresh project
    if paths["root"].exists():
        shutil.rmtree(paths["root"])

    prepare = pipeline.prepare(
        SOURCE_EPUB, "French", "fr", paths, force=True, resume=False, glossary_path=GLOSSARY,
    )
    print(json.dumps({"stage": "prepare", **{k: prepare[k] for k in prepare if k != "paths"}}, default=str))

    segments = pipeline.read_jsonl(paths["jobs"] / "segments.jsonl")
    translations = []
    for segment in segments:
        translations.append(
            {
                "id": segment["id"],
                "target": translate_text(segment["source"]),
                "source": "zeus-glossary-demo",
            }
        )
    pipeline.write_jsonl(paths["jobs"] / "translations.jsonl", translations)
    print(json.dumps({"stage": "translate-demo", "segments": len(translations)}))

    applied = pipeline.apply(paths)
    print(json.dumps({"stage": "apply", **applied}, default=str))

    editorial_dir = paths["jobs"] / "editorial"
    editorial_dir.mkdir(parents=True, exist_ok=True)
    decision = {
        "title": "Graine Babel ZEUS",
        "subtitle": "NUMÉROLOGIE · localiser",
        "full_title": "Graine Babel ZEUS",
        "title_sort": "Graine Babel ZEUS",
        "creators": ["ZEUS AMMON-RA 11"],
        "publisher": "ZEUS educational",
        "publication_date": "2026-09-16",
        "description": "Un court livre-graine pour le jumeau Babel NUMÉROLOGIE.",
        "subjects": ["Babel", "Numérologie", "Bibliothèque de Babel"],
        "cover_text": {
            "title": "Graine Babel ZEUS",
            "subtitle": "NUMÉROLOGIE",
            "author": "ZEUS AMMON-RA 11",
            "contributor": "",
        },
        "front_matter_replacements": [
            {"source": "ZEUS Babel Seed", "target": "Graine Babel ZEUS"},
            {"source": "Cover", "target": "Couverture"},
            {"source": "Table of Contents", "target": "Table des matières"},
        ],
        "notes": ["Glossary-assisted demo translation (Codex not logged in)."],
    }
    decision_path = editorial_dir / "metadata_decision.json"
    pipeline.write_json_atomic(decision_path, decision)

    style_dir = paths["jobs"] / "style"
    style_dir.mkdir(parents=True, exist_ok=True)
    style_path = style_dir / "style_decision.json"
    pipeline.write_json_atomic(
        style_path,
        {
            "summary": "No CSS transformations required for the ZEUS seed book demo.",
            "changes": [],
            "observations": ["Educational fixture uses minimal stylesheet."],
        },
    )

    editorial = pipeline.editorial(
        paths,
        "medium",
        resume=True,
        cover_image=None,
        target_name="French",
        target_code="fr",
        timeout=60,
        decision_source=decision_path,
    )
    print(json.dumps({"stage": "editorial", **editorial}, default=str))

    styled = pipeline.style(
        paths,
        "medium",
        resume=True,
        target_name="French",
        target_code="fr",
        timeout=60,
        decision_source=style_path,
    )
    print(json.dumps({"stage": "style", **styled}, default=str))

    validation = pipeline.validate(paths)
    print(json.dumps({"stage": "validate", **validation}, default=str))
    if validation.get("errors"):
        return 1

    built = pipeline.build(paths)
    print(json.dumps({"stage": "build", **built}, default=str))

    OUT_PUBLIC.mkdir(parents=True, exist_ok=True)
    dest_en = OUT_PUBLIC / "zeus-babel-seed.epub"
    dest_fr = OUT_PUBLIC / "zeus-babel-seed-fr.epub"
    shutil.copy2(SOURCE_EPUB, dest_en)
    shutil.copy2(paths["final"], dest_fr)

    # Extract French prose for NUMEROLOGY seed paste
    with zipfile.ZipFile(paths["final"]) as archive:
        chapter = archive.read("OEBPS/ch01.xhtml").decode("utf-8")
    text = re.sub(r"<[^>]+>", " ", chapter)
    text = re.sub(r"\s+", " ", text).strip()
    seeds = {
        "title": "Graine Babel ZEUS",
        "language": "fr",
        "method": "glossary-assisted demo (Codex offline)",
        "epub": "/numerology/babel/epub-library/samples/zeus-babel-seed-fr.epub",
        "excerpt": text[:800],
        "locateSeeds": [
            "bibliotheque",
            "babel",
            "hexagone",
            "localiser",
            "coherence",
            "ambre",
            "doctrine",
            "mythes",
            "formes",
            "johnson",
        ],
    }
    (OUT_PUBLIC / "zeus-babel-seed-fr.seeds.json").write_text(
        json.dumps(seeds, ensure_ascii=False, indent=2) + "\n", encoding="utf-8",
    )
    print(json.dumps({"status": "ok", "en": str(dest_en), "fr": str(dest_fr), "project": str(paths["root"])}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
