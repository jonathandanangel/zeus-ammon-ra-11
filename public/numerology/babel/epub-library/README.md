# ZEUS AMMON-RA · The Babel Library (vendored)

Snapshot of [clcreuso/the-babel-library](https://github.com/clcreuso/the-babel-library) (MIT),
copied into this monorepo under `tools/the-babel-library/` (nested `.git` removed).

**This is an EPUB translator (Python + Codex CLI), not Jonathan Basile’s Library of Babel.**
ZEUS already locates educational 29-letter pages client-side and deep-links libraryofbabel.info.

## Integrate with NUMEROLOGY sources

| Source | Glossary | In-app |
| --- | --- | --- |
| Borges / Basile LoB | `glossaries/zeus-numerology-babel.md` | Babel Secret Library |
| Babelia | same | Babelia browser |
| Johnson 1755/1773 | `glossaries/johnson-lexicon.md` | Johnson panels |
| Secret Doctrine | `glossaries/secret-doctrine.md` | Blavatsky passages |
| Greek Myths | `glossaries/greek-myths.md` | Graves passages |
| Thought-Forms | `glossaries/thought-forms.md` | colour / emotion |
| Ruckman × KJV | `glossaries/ruckman-kjv.md` | cited verses |
| Philosophy / tarot / PD art | `zeus-numerology-babel.md` | path blocks + covers |

## Quick translate (legal EPUBs only)

```sh
cd tools/the-babel-library
python3 epub_translate.py "/path/to/book.epub" French \
  --glossary glossaries/zeus-numerology-babel.md \
  --profile fast
```

Requires Python ≥ 3.10 and authenticated [Codex CLI](https://developers.openai.com/codex/cli/).

Generated projects land in `books/` (gitignored). Then paste keywords / passages into
NUMEROLOGY → Babel Secret Library.

## Upstream docs

See `README.md`, `translate_epub.md`, and `glossary.example.md` in this folder.
