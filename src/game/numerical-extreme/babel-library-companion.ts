/**
 * Vendored companion: tools/the-babel-library (clcreuso, MIT).
 * Codex EPUB translator — not Basile’s Library of Babel.
 * Integrated with every NUMEROLOGY / Babel source as glossary seeds + offline EPUB pipeline.
 *
 * Upstream: https://github.com/clcreuso/the-babel-library
 * Local:    tools/the-babel-library/
 */

export const THE_BABEL_LIBRARY = {
  repo: "https://github.com/clcreuso/the-babel-library",
  localPath: "tools/the-babel-library",
  license: "MIT",
  kind: "EPUB translation pipeline (Python + Codex CLI)",
  entry: "tools/the-babel-library/epub_translate.py",
  glossaryDir: "tools/the-babel-library/glossaries",
  zeusGlossary: "tools/the-babel-library/glossaries/zeus-numerology-babel.md",
  publicGlossary: "/numerology/babel/epub-companion-glossary.md",
  publicGuide: "/numerology/babel/epub-library/README.md",
  note:
    "Translate only books you are legally allowed to modify. Generated books stay under tools/the-babel-library/books/ (gitignored). Glossaries keep domain terms consistent across Johnson, Blavatsky, Graves, Thought-Forms, KJV, philosophy, tarot, and Babelia.",
} as const;

/** One integrated lore / locate source that feeds Babel + optional EPUB translation. */
export type BabelIntegratedSource = {
  id: string;
  label: string;
  kind:
    | "keyword"
    | "path"
    | "thought-form"
    | "johnson"
    | "secret-doctrine"
    | "greek-myth"
    | "ruckman"
    | "philosophy"
    | "tarot"
    | "babelia"
    | "borges"
    | "antique-art"
    | "epub-pipeline";
  role: string;
  glossaryFile: string;
  seedTerms: string[];
  inAppVenue: string;
  epubHint: string;
};

/** All sources the Babel Secret Library + EPUB companion know about. */
export const BABEL_INTEGRATED_SOURCES: BabelIntegratedSource[] = [
  {
    id: "borges-basile",
    label: "Library of Babel (Borges · Basile)",
    kind: "borges",
    role: "Official locate target + theory; educational twin pages in-app",
    glossaryFile: "glossaries/zeus-numerology-babel.md",
    seedTerms: ["library", "babel", "hexagon", "gallery", "volume", "page", "librarian"],
    inAppVenue: "NUMEROLOGY · Babel Secret Library · libraryofbabel.info",
    epubHint: "Translate a legal Borges anthology EPUB with --glossary glossaries/zeus-numerology-babel.md",
  },
  {
    id: "babelia",
    label: "Babelia image archives",
    kind: "babelia",
    role: "12-bit location → pixel plates (seek / random / step / hierarchy)",
    glossaryFile: "glossaries/zeus-numerology-babel.md",
    seedTerms: ["babelia", "image", "plate", "archive", "pixel", "palette", "colour"],
    inAppVenue: "NUMEROLOGY · Babelia browser",
    epubHint: "Captions / catalogue EPUBs: preserve babelia URLs and plate IDs",
  },
  {
    id: "johnson",
    label: "Johnson’s Dictionary 1755 / 1773",
    kind: "johnson",
    role: "Headword + sense locate; expansions & anagrams",
    glossaryFile: "glossaries/johnson-lexicon.md",
    seedTerms: ["johnson", "dictionary", "lexicon", "definition", "sense", "headword"],
    inAppVenue: "NUMEROLOGY · Johnson panels",
    epubHint: "Lexicon notes / essays EPUB → glossary johnson-lexicon.md",
  },
  {
    id: "secret-doctrine",
    label: "Blavatsky · Secret Doctrine",
    kind: "secret-doctrine",
    role: "Passage match + amber highlights",
    glossaryFile: "glossaries/secret-doctrine.md",
    seedTerms: ["doctrine", "blavatsky", "dzyan", "septenary", "fohat", "secret"],
    inAppVenue: "NUMEROLOGY · Secret Doctrine",
    epubHint: "PD / licensed doctrine EPUB → glossary secret-doctrine.md",
  },
  {
    id: "greek-myths",
    label: "Graves · Greek Myths",
    kind: "greek-myth",
    role: "Myth passage anagram / letter-match",
    glossaryFile: "glossaries/greek-myths.md",
    seedTerms: ["myth", "graves", "hero", "oracle", "labyrinth", "gods"],
    inAppVenue: "NUMEROLOGY · Greek Myths",
    epubHint: "Myths EPUB → glossary greek-myths.md",
  },
  {
    id: "thought-forms",
    label: "Besant & Leadbeater · Thought-Forms",
    kind: "thought-form",
    role: "Colour ray / emotion plates for path + Babelia wash",
    glossaryFile: "glossaries/thought-forms.md",
    seedTerms: ["thought", "thought-form", "colour", "color", "emotion", "vibration", "astral"],
    inAppVenue: "NUMEROLOGY · Thought-Forms",
    epubHint: "Thought-Forms EPUB → glossary thought-forms.md",
  },
  {
    id: "ruckman-kjv",
    label: "Ruckman × 1611 KJV",
    kind: "ruckman",
    role: "Cited verses for path numbers",
    glossaryFile: "glossaries/ruckman-kjv.md",
    seedTerms: ["kjv", "bible", "verse", "scripture", "ruckman", "king"],
    inAppVenue: "NUMEROLOGY · Ruckman / KJV",
    epubHint: "Study notes EPUB only if legally allowed; preserve verse refs",
  },
  {
    id: "philosophy",
    label: "Path philosophy / sacred geometry",
    kind: "philosophy",
    role: "Sacred name, geometry, philosopher quotes",
    glossaryFile: "glossaries/zeus-numerology-babel.md",
    seedTerms: ["philosophy", "sacred", "geometry", "monad", "duad", "triad", "ray"],
    inAppVenue: "NUMEROLOGY · philosophy block",
    epubHint: "Philosophy EPUBs → zeus-numerology-babel.md path language section",
  },
  {
    id: "tarot",
    label: "Major Arcana path cards",
    kind: "tarot",
    role: "I–IX path cards + Johnson gloss",
    glossaryFile: "glossaries/zeus-numerology-babel.md",
    seedTerms: ["tarot", "arcana", "card", "major", "path"],
    inAppVenue: "NUMEROLOGY · tarot block",
    epubHint: "Preserve card names; expand via Johnson after translation",
  },
  {
    id: "antique-art",
    label: "Antique Babel plates (PD)",
    kind: "antique-art",
    role: "Bruegel / Kircher / Doré covers & hierarchy images",
    glossaryFile: "glossaries/zeus-numerology-babel.md",
    seedTerms: ["tower", "babel", "bruegel", "kircher", "dore", "turris"],
    inAppVenue: "public/numerology/babel/",
    epubHint: "Cover localization: --cover-image with PD plate from public/numerology/babel/",
  },
  {
    id: "epub-pipeline",
    label: "The Babel Library (EPUB pipeline)",
    kind: "epub-pipeline",
    role: "Offline multilingual source prep for locate seeds",
    glossaryFile: "glossaries/zeus-numerology-babel.md",
    seedTerms: ["translate", "epub", "glossary", "codex", "markup"],
    inAppVenue: "tools/the-babel-library · University Projects · Babel EPUB",
    epubHint:
      "python3 tools/the-babel-library/epub_translate.py BOOK.epub French --glossary tools/the-babel-library/glossaries/zeus-numerology-babel.md --profile fast",
  },
];

export type BabelGlossaryEntry = {
  term: string;
  expansions: string[];
  note?: string;
  sourceIds?: string[];
};

export const BABEL_NUMEROLOGY_GLOSSARY: BabelGlossaryEntry[] = [
  {
    term: "library",
    expansions: ["library", "bibliotheque", "biblioteca", "hexagon", "gallery", "archive"],
    note: "Borges · Basile",
    sourceIds: ["borges-basile"],
  },
  {
    term: "babel",
    expansions: ["babel", "babylon", "confusion", "tongues", "turris", "tower"],
    sourceIds: ["borges-basile", "antique-art"],
  },
  {
    term: "hexagon",
    expansions: ["hexagon", "hexagonal", "gallery", "wall", "shelf", "volume"],
    sourceIds: ["borges-basile"],
  },
  {
    term: "page",
    expansions: ["page", "leaf", "folio", "sheet", "plate"],
    sourceIds: ["borges-basile", "babelia"],
  },
  {
    term: "thought",
    expansions: ["thought", "thought-form", "form", "colour", "color", "emotion", "vibration"],
    note: "Besant & Leadbeater",
    sourceIds: ["thought-forms"],
  },
  {
    term: "doctrine",
    expansions: ["doctrine", "secret", "blavatsky", "dzyan", "septenary", "fohat"],
    sourceIds: ["secret-doctrine"],
  },
  {
    term: "myth",
    expansions: ["myth", "graves", "hero", "oracle", "labyrinth"],
    sourceIds: ["greek-myths"],
  },
  {
    term: "johnson",
    expansions: ["johnson", "dictionary", "lexicon", "definition", "sense"],
    sourceIds: ["johnson"],
  },
  {
    term: "path",
    expansions: ["path", "number", "digit", "root", "ray", "monad", "duad", "triad"],
    sourceIds: ["philosophy", "tarot"],
  },
  {
    term: "image",
    expansions: ["image", "babelia", "plate", "archive", "pixel", "palette"],
    sourceIds: ["babelia"],
  },
  {
    term: "verse",
    expansions: ["verse", "scripture", "kjv", "bible", "ruckman", "king"],
    sourceIds: ["ruckman-kjv"],
  },
  {
    term: "tarot",
    expansions: ["tarot", "arcana", "major", "card", "fool", "magician"],
    sourceIds: ["tarot"],
  },
  {
    term: "philosophy",
    expansions: ["philosophy", "sacred", "geometry", "pythagoras", "plato"],
    sourceIds: ["philosophy"],
  },
];

/** Expand a seed word through the full integrated glossary. */
export function expandWithBabelGlossary(seed: string, limit = 16): string[] {
  const key = seed.toLowerCase().replace(/[^a-z\s-]/g, " ").trim();
  if (!key) return [];
  const out = new Set<string>();
  const push = (w: string) => {
    const n = w.toLowerCase().replace(/[^a-z-]/g, "");
    if (n.length >= 3) out.add(n);
  };
  push(key);
  for (const part of key.split(/\s+/)) push(part);

  for (const entry of BABEL_NUMEROLOGY_GLOSSARY) {
    const term = entry.term.toLowerCase();
    if (key === term || key.includes(term) || term.includes(key.replace(/\s+/g, ""))) {
      for (const exp of entry.expansions) push(exp);
    }
    if (entry.expansions.some((e) => e.toLowerCase() === key || key.includes(e.toLowerCase()))) {
      for (const exp of entry.expansions) push(exp);
      push(term);
    }
  }
  return [...out].slice(0, limit);
}

/** Flatten seed terms from every integrated source (+ glossary expansions). */
export function seedsFromAllIntegratedSources(limit = 48): string[] {
  const out = new Set<string>();
  for (const src of BABEL_INTEGRATED_SOURCES) {
    for (const t of src.seedTerms) {
      out.add(t.toLowerCase());
      for (const exp of expandWithBabelGlossary(t, 6)) out.add(exp);
    }
  }
  return [...out].slice(0, limit);
}

/** Expand a free-text phrase (passage / sense / verse) via glossary. */
export function expandPhraseWithBabelGlossary(phrase: string, limit = 12): string[] {
  const words = phrase
    .toLowerCase()
    .replace(/[^a-z\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4);
  const out = new Set<string>();
  for (const w of words.slice(0, 10)) {
    for (const exp of expandWithBabelGlossary(w, 4)) out.add(exp);
  }
  return [...out].slice(0, limit);
}

export function formatBabelLibraryCompanionBlurb(): string {
  return [
    `Companion: The Babel Library — vendored at ${THE_BABEL_LIBRARY.localPath} (${THE_BABEL_LIBRARY.kind}).`,
    THE_BABEL_LIBRARY.note,
    `Upstream: ${THE_BABEL_LIBRARY.repo}`,
    `Integrated sources: ${BABEL_INTEGRATED_SOURCES.map((s) => s.label).join("; ")}.`,
    "Workflow: translate legal EPUB → extract passages → NUMEROLOGY Babel locate / generate books.",
  ].join(" ");
}

export function formatEpubTranslateExample(epubPath = "BOOK.epub", lang = "French"): string {
  return [
    `cd ${THE_BABEL_LIBRARY.localPath}`,
    `python3 epub_translate.py "${epubPath}" ${lang} --glossary glossaries/zeus-numerology-babel.md --profile fast`,
  ].join(" && ");
}
