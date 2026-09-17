/**
 * Library of Babel pathfinder for the NUMEROLOGY tab.
 *
 * Idea (same as Borges / Basile + this tab’s lore stack):
 * nothing is written — pages are *located*. Numerology reduces a word to a path;
 * Johnson, Blavatsky, Graves, tarot, Thought-Forms, and philosophers supply the
 * secret phrases (exact · stem · anagram/scramble · similar letters). Those
 * phrases are embedded into a 29-letter Babel page so amber highlights work
 * exactly like Greek Myths / Secret Doctrine passage panels.
 *
 * Official LoB-API is empty (LICENSE only); multiprecision Basile PRNG isn’t
 * portable here. This is an educational bijection: same alphabet & page size,
 * deterministic addresses, deep-links to libraryofbabel.info search.
 */

import { letterOverlap, letterSignature, normalizeWord } from "./letter-match";
import { digitalRoot } from "./numerology";
import type { JohnsonSense, NumerologyResult } from "./numerology";
import type { SecretDoctrinePassage } from "./secret-doctrine";
import type { GreekMythPassage } from "./greek-myths";
import type { RuckmanVerse } from "./ruckman-kjv";
import { thoughtFormBundleForNumber } from "./thought-forms";

/** Basile / Borges library alphabet — 29 glyphs. */
export const BABEL_ALPHABET = "abcdefghijklmnopqrstuvwxyz, .";
export const BABEL_RADIX = 29n;
export const BABEL_LINES = 40;
export const BABEL_COLS = 80;
export const BABEL_PAGE_CHARS = BABEL_LINES * BABEL_COLS;

export const OFFICIAL_BABEL = {
  home: "https://libraryofbabel.info/",
  search: "https://libraryofbabel.info/search.html",
  browse: "https://libraryofbabel.info/browse.cgi",
  random: "https://libraryofbabel.info/random.cgi",
  about: "https://libraryofbabel.info/About.html",
  theory: "https://libraryofbabel.info/theory.html",
  referenceHex: "https://libraryofbabel.info/referencehex.html",
  babelia: "https://babelia.libraryofbabel.info/",
  algo: "https://github.com/librarianofbabel/libraryofbabel.info-algo",
  borgesPdf: "/university-projects/babel/library-of-babel-borges.pdf",
} as const;

const CHAR_INDEX: Record<string, number> = Object.fromEntries(
  [...BABEL_ALPHABET].map((ch, i) => [ch, i]),
);

export type BabelSourceKind =
  | "keyword"
  | "anagram"
  | "path"
  | "thought-form"
  | "johnson"
  | "johnson-expansion"
  | "secret-doctrine"
  | "greek-myth"
  | "ruckman"
  | "philosophy"
  | "tarot"
  | "synthesis";

export type BabelHighlightToken = {
  word: string;
  reason: string;
  kind: BabelSourceKind;
};

export type BabelSecretQuery = {
  id: string;
  kind: BabelSourceKind;
  label: string;
  phrase: string;
  note: string;
  /** Tokens to amber-highlight inside the located page (like Greek Myths). */
  highlight: BabelHighlightToken[];
};

export type BabelLocation = {
  hexagon: string;
  wall: number;
  shelf: number;
  volume: number;
  page: number;
  address: string;
  officialSearchUrl: string;
};

export type BabelPage = {
  location: BabelLocation;
  text: string;
  lines: string[];
  /** All words/phrases embedded for amber highlight. */
  matched: string[];
  matchReasons: string[];
  seedDigest: string;
};

export type BabelSecretFind = {
  query: BabelSecretQuery;
  page: BabelPage;
  pathNumber: number;
  baseDigit: number;
  colorHex: string;
  colorName: string;
  emotion: string;
  musicalNote: string;
};

export type BabelLibraryReport = {
  pathNumber: number;
  title: string;
  colorHex: string;
  colorName: string;
  emotion: string;
  finds: BabelSecretFind[];
  /** One assembled “new” page woven from every source (still located, not authored). */
  synthesis: BabelSecretFind | null;
  officialHome: string;
  theoryUrl: string;
  borgesPdf: string;
};

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function toBabelAlphabet(raw: string): string {
  return [...raw.toLowerCase()]
    .map((ch) => (CHAR_INDEX[ch] !== undefined ? ch : " "))
    .join("")
    .replace(/ +/g, " ")
    .trim();
}

function hashStringToSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pageTextToSeed(text: string): bigint {
  const padded = text.padEnd(BABEL_PAGE_CHARS, " ").slice(0, BABEL_PAGE_CHARS);
  let n = 0n;
  for (let i = 0; i < padded.length; i += 1) {
    n = n * BABEL_RADIX + BigInt(CHAR_INDEX[padded[i]!] ?? 26);
  }
  return n;
}

export function seedToPageText(seed: bigint): string {
  let n = seed < 0n ? -seed : seed;
  const chars: string[] = new Array(BABEL_PAGE_CHARS);
  for (let i = BABEL_PAGE_CHARS - 1; i >= 0; i -= 1) {
    chars[i] = BABEL_ALPHABET[Number(n % BABEL_RADIX)]!;
    n /= BABEL_RADIX;
  }
  return chars.join("");
}

function digestHex(seed: bigint): string {
  const hex = seed.toString(16);
  return hex.length <= 24 ? hex : `${hex.slice(0, 12)}…${hex.slice(-12)}`;
}

function hexagonNameFromSeed(seed: bigint, pathNumber: number): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let n = seed % 29n ** 18n;
  let name = "";
  for (let i = 0; i < 18; i += 1) {
    name += alphabet[Number(n % 26n)]!;
    n /= 26n;
  }
  return `${name}${pathNumber}`;
}

function locationFromSeed(seed: bigint, pathNumber: number, phrase: string): BabelLocation {
  const wall = Number((seed % 4n) + 1n);
  const shelf = Number((seed / 4n) % 5n) + 1;
  const volume = Number((seed / 20n) % 32n) + 1;
  const page = Number((seed / 640n) % 410n) + 1;
  const hexagon = hexagonNameFromSeed(seed, pathNumber);
  const find = encodeURIComponent(phrase.slice(0, 400));
  return {
    hexagon,
    wall,
    shelf,
    volume,
    page,
    address: `${hexagon} · w${wall} · s${shelf} · v${volume} · p${page}`,
    officialSearchUrl: `${OFFICIAL_BABEL.search}?find=${find}`,
  };
}

/** True anagram / scramble of letters (same signature, different order). */
export function isAnagramOf(a: string, b: string): boolean {
  const na = normalizeWord(a);
  const nb = normalizeWord(b);
  if (na.length < 3 || nb.length < 3 || na === nb) return false;
  return letterSignature(na) === letterSignature(nb);
}

function reasonForPair(query: string, candidate: string): string {
  const q = normalizeWord(query);
  const c = normalizeWord(candidate);
  if (!q || !c) return "related";
  if (q === c) return "exact";
  if (isAnagramOf(q, c)) return "anagram / scramble";
  if (c.includes(q) || q.includes(c)) return "stem / contain";
  const shared = letterOverlap(q, c);
  const need = Math.max(3, Math.ceil(Math.min(q.length, c.length) * 0.55));
  if (shared >= need && Math.abs(q.length - c.length) <= 2) {
    return "similar length · shared letters";
  }
  return "path source";
}

/**
 * Locate a Babel page that contains every highlight token (embedded into
 * deterministic filler). Matched list drives amber highlighting in the UI.
 */
export function locatePageWithHighlights(
  primaryPhrase: string,
  highlights: BabelHighlightToken[],
  pathNumber: number,
  salt = "babel-path",
): BabelPage {
  const phrase = toBabelAlphabet(primaryPhrase).slice(0, 280);
  const tokens = [
    phrase,
    ...highlights.map((h) => toBabelAlphabet(h.word)).filter((w) => w.length >= 2),
  ];
  const uniqueTokens = [...new Set(tokens)].sort((a, b) => b.length - a.length);
  if (!uniqueTokens.length) {
    throw new Error("No Babel-alphabet tokens to locate.");
  }

  const seedKey = hashStringToSeed(`${pathNumber}|${uniqueTokens.join("|")}|${salt}`);
  const rand = mulberry32(seedKey);
  const chars: string[] = new Array(BABEL_PAGE_CHARS);
  for (let i = 0; i < BABEL_PAGE_CHARS; i += 1) {
    chars[i] = BABEL_ALPHABET[Math.floor(rand() * 29)]!;
  }

  // Scatter tokens with word boundaries (spaces) so \\b highlight works.
  let cursor = Math.floor(rand() * 40) + 8;
  for (const token of uniqueTokens) {
    const padded = ` ${token} `;
    if (cursor + padded.length >= BABEL_PAGE_CHARS - 8) {
      cursor = Math.floor(rand() * 60) + 4;
    }
    for (let i = 0; i < padded.length; i += 1) {
      const ch = padded[i]!;
      chars[cursor + i] = CHAR_INDEX[ch] !== undefined ? ch : " ";
    }
    cursor += padded.length + 3 + Math.floor(rand() * 17);
  }

  const text = chars.join("");
  const seed = pageTextToSeed(text);
  const location = locationFromSeed(seed, pathNumber, phrase || uniqueTokens[0]!);
  const lines: string[] = [];
  for (let r = 0; r < BABEL_LINES; r += 1) {
    lines.push(text.slice(r * BABEL_COLS, (r + 1) * BABEL_COLS));
  }

  const matched = uniqueTokens
    .flatMap((t) => t.split(/\s+/))
    .map((w) => normalizeWord(w))
    .filter((w) => w.length >= 2);
  const matchReasons = [
    ...new Set(highlights.map((h) => h.reason).filter(Boolean)),
  ];

  return {
    location,
    text,
    lines,
    matched: [...new Set(matched)],
    matchReasons,
    seedDigest: digestHex(seed),
  };
}

function pushQuery(
  out: BabelSecretQuery[],
  seen: Set<string>,
  q: Omit<BabelSecretQuery, "id">,
) {
  const phrase = toBabelAlphabet(q.phrase);
  if (phrase.length < 2) return;
  const key = `${q.kind}:${phrase.slice(0, 80)}`;
  if (seen.has(key)) return;
  seen.add(key);
  const highlight =
    q.highlight.length > 0
      ? q.highlight
      : [{ word: phrase, reason: "exact", kind: q.kind }];
  out.push({ ...q, phrase, highlight, id: key });
}

function wordsFromText(text: string, minLen = 4): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length >= minLen);
}

/** Harvest searchable secrets from every NUMEROLOGY source already on-panel. */
export function collectBabelSecrets(input: {
  result: NumerologyResult;
  johnsonWord?: JohnsonSense | null;
  johnsonWord1773?: JohnsonSense | null;
  secretPassages?: SecretDoctrinePassage[];
  mythPassages?: GreekMythPassage[];
  ruckmanVerses?: RuckmanVerse[];
}): BabelSecretQuery[] {
  const { result } = input;
  const bundle = thoughtFormBundleForNumber(result.number);
  const out: BabelSecretQuery[] = [];
  const seen = new Set<string>();
  const root = normalizeWord(result.normalized);

  pushQuery(out, seen, {
    kind: "keyword",
    label: `Typed word · “${result.normalized}”`,
    phrase: result.normalized,
    note: "Primary keyword — the Library already contains every spelling of this path.",
    highlight: [{ word: result.normalized, reason: "exact", kind: "keyword" }],
  });

  pushQuery(out, seen, {
    kind: "path",
    label: `Path ${result.number} · ${result.title}`,
    phrase: `${result.title} ${result.traits.slice(0, 3).join(" ")}`,
    note: result.note,
    highlight: [
      { word: result.title, reason: "path title", kind: "path" },
      ...result.traits.slice(0, 4).map((t) => ({
        word: t,
        reason: "path trait",
        kind: "path" as const,
      })),
    ],
  });

  pushQuery(out, seen, {
    kind: "thought-form",
    label: `Thought-Forms · ${bundle.colorName}`,
    phrase: `${bundle.colorName} ${bundle.primaryFigure.emotion}`,
    note: bundle.primaryFigure.quote.slice(0, 200),
    highlight: [
      { word: bundle.colorName, reason: "colour ray", kind: "thought-form" },
      ...wordsFromText(bundle.primaryFigure.emotion, 4).slice(0, 4).map((w) => ({
        word: w,
        reason: "emotion plate",
        kind: "thought-form" as const,
      })),
    ],
  });

  for (const key of bundle.colourKeys.slice(0, 2)) {
    pushQuery(out, seen, {
      kind: "thought-form",
      label: `Colour key · ${key.colorName}`,
      phrase: `${key.colorName} ${key.emotion}`,
      note: key.quote.slice(0, 160),
      highlight: [
        { word: key.colorName, reason: "colour key", kind: "thought-form" },
        { word: key.emotion, reason: "emotion", kind: "thought-form" },
      ],
    });
  }

  pushQuery(out, seen, {
    kind: "philosophy",
    label: result.philosophy.sacredName,
    phrase: `${result.philosophy.sacredName} ${result.philosophy.geometry.figure}`,
    note: result.philosophy.geometry.note.slice(0, 180),
    highlight: [
      { word: result.philosophy.sacredName, reason: "sacred name", kind: "philosophy" },
      { word: result.philosophy.geometry.figure, reason: "geometry", kind: "philosophy" },
      {
        word: result.philosophy.geometry.colorName,
        reason: "geometry colour",
        kind: "philosophy",
      },
    ],
  });

  for (const thought of result.philosophy.thoughts.slice(0, 4)) {
    const quoteWords = wordsFromText(thought.thought, 5).slice(0, 5);
    pushQuery(out, seen, {
      kind: "philosophy",
      label: thought.philosopher,
      phrase: thought.thought.slice(0, 140),
      note: thought.work,
      highlight: [
        { word: thought.philosopher.split(/\s+/).pop() ?? thought.philosopher, reason: "philosopher", kind: "philosophy" },
        ...quoteWords.map((w) => ({
          word: w,
          reason: reasonForPair(root, w),
          kind: "philosophy" as const,
        })),
      ],
    });
  }

  pushQuery(out, seen, {
    kind: "tarot",
    label: `Tarot · ${result.tarot.name}`,
    phrase: `${result.tarot.name} ${result.tarot.arcana}`,
    note: result.tarot.explanation.slice(0, 180),
    highlight: [
      { word: result.tarot.name, reason: "tarot name", kind: "tarot" },
      ...wordsFromText(result.tarot.arcana, 4).map((w) => ({
        word: w,
        reason: "arcana",
        kind: "tarot" as const,
      })),
    ],
  });

  for (const edition of [input.johnsonWord, input.johnsonWord1773]) {
    if (!edition) continue;
    const sense = edition.senses[0] ?? "";
    const senseWords = wordsFromText(sense, 5).slice(0, 4);
    pushQuery(out, seen, {
      kind: "johnson",
      label: `Johnson · ${edition.headword}`,
      phrase: `${edition.headword} ${sense.slice(0, 100)}`,
      note: sense.slice(0, 180) || edition.partOfSpeech,
      highlight: [
        { word: edition.headword, reason: "Johnson headword", kind: "johnson" },
        ...senseWords.map((w) => ({
          word: w,
          reason: reasonForPair(root, w),
          kind: "johnson" as const,
        })),
      ],
    });
  }

  for (const exp of result.johnsonExpansions.filter((e) => e.found).slice(0, 8)) {
    const anagramish = isAnagramOf(root, exp.word);
    pushQuery(out, seen, {
      kind: anagramish ? "anagram" : "johnson-expansion",
      label: anagramish ? `Anagram · ${exp.word}` : `Expansion · ${exp.word}`,
      phrase: exp.word,
      note: (exp.entry?.senses[0] ?? "Johnson headword on path lore.").slice(0, 160),
      highlight: [
        {
          word: exp.word,
          reason: anagramish ? "anagram / scramble" : "Johnson expansion",
          kind: anagramish ? "anagram" : "johnson-expansion",
        },
        ...(exp.entry?.senses[0]
          ? wordsFromText(exp.entry.senses[0], 5)
              .slice(0, 2)
              .map((w) => ({
                word: w,
                reason: "Johnson sense",
                kind: "johnson-expansion" as const,
              }))
          : []),
      ],
    });
  }

  for (const p of (input.secretPassages ?? []).slice(0, 4)) {
    const matched = p.matched.slice(0, 6);
    pushQuery(out, seen, {
      kind: "secret-doctrine",
      label: `Blavatsky · p.${p.page}`,
      phrase: matched.join(" ") || result.normalized,
      note: p.text.slice(0, 200),
      highlight: matched.map((w) => ({
        word: w,
        reason: (p.reasons[0] ?? reasonForPair(root, w)) as string,
        kind: "secret-doctrine" as const,
      })),
    });
  }

  for (const p of (input.mythPassages ?? []).slice(0, 4)) {
    const matched = p.matched.slice(0, 6);
    pushQuery(out, seen, {
      kind: "greek-myth",
      label: `Greek Myth · p.${p.page}`,
      phrase: matched.join(" ") || result.normalized,
      note: p.text.slice(0, 200),
      highlight: matched.map((w) => ({
        word: w,
        reason: (p.reasons[0] ?? reasonForPair(root, w)) as string,
        kind: "greek-myth" as const,
      })),
    });
  }

  for (const v of (input.ruckmanVerses ?? []).slice(0, 2)) {
    pushQuery(out, seen, {
      kind: "ruckman",
      label: `KJV · ${v.ref}`,
      phrase: v.ref.replace(/[^a-zA-Z ]/g, " "),
      note: v.text.slice(0, 180),
      highlight: [
        ...wordsFromText(v.ref, 3).map((w) => ({
          word: w,
          reason: "verse ref",
          kind: "ruckman" as const,
        })),
        ...wordsFromText(v.text, 5)
          .slice(0, 4)
          .map((w) => ({
            word: w,
            reason: "verse word",
            kind: "ruckman" as const,
          })),
      ],
    });
  }

  return out;
}

/** Weave one reasonable “new” page from all sources — still a located Babel page. */
export function buildSynthesisQuery(input: {
  result: NumerologyResult;
  johnsonWord?: JohnsonSense | null;
  secretPassages?: SecretDoctrinePassage[];
  mythPassages?: GreekMythPassage[];
}): BabelSecretQuery {
  const { result } = input;
  const bundle = thoughtFormBundleForNumber(result.number);
  const johnsonHead = input.johnsonWord?.headword ?? result.normalized;
  const johnsonSense = (input.johnsonWord?.senses[0] ?? result.note).slice(0, 90);
  const blavatsky = input.secretPassages?.[0];
  const myth = input.mythPassages?.[0];
  const phil = result.philosophy.thoughts[0];

  const clauses = [
    `in the hexagon of path ${result.number} the word ${result.normalized} reduces to ${result.title}`,
    `colour ${bundle.colorName} sounds as ${bundle.musicalNote} and shapes ${bundle.primaryFigure.emotion}`,
    `johnson names ${johnsonHead} as ${johnsonSense}`,
    phil
      ? `${phil.philosopher} wrote that ${phil.thought.slice(0, 100)}`
      : `sacred name ${result.philosophy.sacredName}`,
    blavatsky
      ? `blavatsky on page ${blavatsky.page} yields ${blavatsky.matched.slice(0, 3).join(" ")}`
      : "",
    myth
      ? `graves on page ${myth.page} yields ${myth.matched.slice(0, 3).join(" ")}`
      : "",
    `tarot ${result.tarot.name} seals the shelf`,
  ]
    .filter(Boolean)
    .join(". ");

  const highlight: BabelHighlightToken[] = [
    { word: result.normalized, reason: "exact", kind: "keyword" },
    { word: result.title, reason: "path title", kind: "path" },
    { word: bundle.colorName, reason: "colour ray", kind: "thought-form" },
    { word: johnsonHead, reason: "Johnson headword", kind: "johnson" },
    { word: result.tarot.name, reason: "tarot", kind: "tarot" },
    { word: result.philosophy.sacredName, reason: "sacred name", kind: "philosophy" },
    ...(blavatsky?.matched.slice(0, 3).map((w) => ({
      word: w,
      reason: "anagram / scramble · Blavatsky",
      kind: "secret-doctrine" as const,
    })) ?? []),
    ...(myth?.matched.slice(0, 3).map((w) => ({
      word: w,
      reason: "anagram / scramble · Greek Myth",
      kind: "greek-myth" as const,
    })) ?? []),
  ];

  return {
    id: `synthesis:${result.number}:${normalizeWord(result.normalized)}`,
    kind: "synthesis",
    label: `Synthesis · path ${result.number} catalogue leaf`,
    phrase: toBabelAlphabet(clauses).slice(0, 900),
    note: "Assembled from Johnson, Blavatsky, Graves, tarot, Thought-Forms, and the seven traditions — then located as one Babel page. Amber marks every source token.",
    highlight,
  };
}

export function searchBabelSecrets(input: {
  result: NumerologyResult;
  johnsonWord?: JohnsonSense | null;
  johnsonWord1773?: JohnsonSense | null;
  secretPassages?: SecretDoctrinePassage[];
  mythPassages?: GreekMythPassage[];
  ruckmanVerses?: RuckmanVerse[];
  limit?: number;
}): BabelLibraryReport {
  const bundle = thoughtFormBundleForNumber(input.result.number);
  const queries = collectBabelSecrets(input).slice(0, input.limit ?? 16);
  const finds: BabelSecretFind[] = [];

  for (const query of queries) {
    try {
      const page = locatePageWithHighlights(
        query.phrase,
        query.highlight,
        input.result.number,
        query.kind,
      );
      finds.push({
        query,
        page,
        pathNumber: input.result.number,
        baseDigit: bundle.baseDigit,
        colorHex: bundle.hex,
        colorName: bundle.colorName,
        emotion: bundle.primaryFigure.emotion,
        musicalNote: bundle.musicalNote,
      });
    } catch {
      // skip empty collapses
    }
  }

  let synthesis: BabelSecretFind | null = null;
  try {
    const synQuery = buildSynthesisQuery(input);
    const page = locatePageWithHighlights(
      synQuery.phrase,
      synQuery.highlight,
      input.result.number,
      "synthesis",
    );
    synthesis = {
      query: synQuery,
      page,
      pathNumber: input.result.number,
      baseDigit: bundle.baseDigit,
      colorHex: bundle.hex,
      colorName: bundle.colorName,
      emotion: bundle.primaryFigure.emotion,
      musicalNote: bundle.musicalNote,
    };
  } catch {
    synthesis = null;
  }

  return {
    pathNumber: input.result.number,
    title: input.result.title,
    colorHex: bundle.hex,
    colorName: bundle.colorName,
    emotion: bundle.primaryFigure.emotion,
    finds,
    synthesis,
    officialHome: OFFICIAL_BABEL.home,
    theoryUrl: OFFICIAL_BABEL.theory,
    borgesPdf: OFFICIAL_BABEL.borgesPdf,
  };
}

export function formatBabelFindReport(find: BabelSecretFind): string {
  const { query, page, pathNumber, colorName, emotion } = find;
  return [
    `BABEL SECRET · path ${pathNumber} · ${colorName} · ${emotion}`,
    `source: ${query.kind} · ${query.label}`,
    `phrase: ${query.phrase.slice(0, 200)}`,
    `highlight: ${page.matched.slice(0, 12).join(", ")}`,
    `reasons: ${page.matchReasons.join(" · ") || "—"}`,
    `address: ${page.location.address}`,
    `seed: ${page.seedDigest}`,
    `official: ${page.location.officialSearchUrl}`,
    "",
    page.lines.slice(0, 14).join("\n"),
    "…",
  ].join("\n");
}

export function babelPathMetrics(result: NumerologyResult) {
  const { number: path } = digitalRoot(result.sumPositions);
  const bundle = thoughtFormBundleForNumber(result.number);
  const sample = locatePageWithHighlights(
    result.normalized || "a",
    [{ word: result.normalized || "a", reason: "exact", kind: "keyword" }],
    result.number,
  );
  return {
    path,
    pageChars: BABEL_PAGE_CHARS,
    alphabetSize: Number(BABEL_RADIX),
    colorHex: bundle.hex,
    colorName: bundle.colorName,
    sampleAddress: sample.location.address,
    sampleSeed: sample.seedDigest,
  };
}

/* ── Generated books (multi-page volumes from foundational sources) ── */

export type BabelArtwork = {
  id: string;
  src: string;
  title: string;
  artist: string;
  year: string;
  credit: string;
};

/** Local antique plates shipped under /numerology/babel/. */
export const BABEL_ARTWORK: BabelArtwork[] = [
  {
    id: "bruegel-vienna",
    src: "/numerology/babel/bruegel-vienna.jpg",
    title: "The Tower of Babel (Vienna)",
    artist: "Pieter Bruegel the Elder",
    year: "1563",
    credit: "Kunsthistorisches Museum · public domain",
  },
  {
    id: "bruegel-rotterdam",
    src: "/numerology/babel/bruegel-rotterdam.jpg",
    title: "The Tower of Babel (Rotterdam)",
    artist: "Pieter Bruegel the Elder",
    year: "c. 1563–65",
    credit: "Museum Boijmans Van Beuningen · public domain",
  },
  {
    id: "kircher-turris",
    src: "/numerology/babel/kircher-turris-babel.jpg",
    title: "Turris Babel",
    artist: "Coenraet Decker for Athanasius Kircher",
    year: "1679",
    credit: "Amsterdam engraving · public domain",
  },
  {
    id: "dore-babel",
    src: "/numerology/babel/dore-tower-babel.jpg",
    title: "The Tower of Babel",
    artist: "Gustave Doré",
    year: "1866",
    credit: "La Grande Bible de Tours · public domain",
  },
  {
    id: "confusion-tongues",
    src: "/numerology/babel/confusion-of-tongues.png",
    title: "Confusion of Tongues",
    artist: "Gustave Doré (plate)",
    year: "19th c.",
    credit: "Wikimedia Commons · public domain",
  },
];

export type BabelBookPage = {
  index: number;
  title: string;
  sourceKind: BabelSourceKind;
  page: BabelPage;
  highlight: BabelHighlightToken[];
  excerpt: string;
};

export type BabelGeneratedBook = {
  id: string;
  title: string;
  subtitle: string;
  pathNumber: number;
  seedWord: string;
  combination: string[];
  colorHex: string;
  colorName: string;
  emotion: string;
  coverArt: BabelArtwork;
  pages: BabelBookPage[];
  /** Amber tokens across the whole volume. */
  allMatched: string[];
  officialSearchUrl: string;
  blurb: string;
};

function artworkForPath(pathNumber: number): BabelArtwork {
  const idx = Math.abs(pathNumber - 1) % BABEL_ARTWORK.length;
  return BABEL_ARTWORK[idx]!;
}

function combinationTokens(result: NumerologyResult, extras: string[]): string[] {
  const base = [
    result.normalized,
    ...result.traits.slice(0, 3),
    result.philosophy.sacredName,
    result.tarot.name,
    ...extras,
  ]
    .map((w) => normalizeWord(w))
    .filter((w) => w.length >= 3);
  return [...new Set(base)].slice(0, 10);
}

/**
 * Generate a multi-page “new” book located in Babel from the typed word and
 * combinations drawn from Johnson, Blavatsky, Graves, philosophy, tarot,
 * Thought-Forms — one chapter per foundational source.
 */
export function generateBabelBooks(input: {
  result: NumerologyResult;
  johnsonWord?: JohnsonSense | null;
  johnsonWord1773?: JohnsonSense | null;
  secretPassages?: SecretDoctrinePassage[];
  mythPassages?: GreekMythPassage[];
  ruckmanVerses?: RuckmanVerse[];
  maxBooks?: number;
}): BabelGeneratedBook[] {
  const { result } = input;
  const bundle = thoughtFormBundleForNumber(result.number);
  const books: BabelGeneratedBook[] = [];
  const maxBooks = input.maxBooks ?? 3;

  const mythMatches = (input.mythPassages ?? []).flatMap((p) => p.matched).slice(0, 6);
  const doctrineMatches = (input.secretPassages ?? []).flatMap((p) => p.matched).slice(0, 6);
  const johnsonExtras = [
    input.johnsonWord?.headword,
    input.johnsonWord1773?.headword,
    ...result.johnsonExpansions.filter((e) => e.found).slice(0, 4).map((e) => e.word),
  ].filter(Boolean) as string[];

  const combos: Array<{ id: string; title: string; combo: string[]; blurb: string }> = [
    {
      id: "path-codex",
      title: `Codex of ${result.normalized}`,
      combo: combinationTokens(result, [bundle.colorName, bundle.primaryFigure.emotion]),
      blurb:
        "Path digit, Thought-Forms colour/emotion, sacred geometry, and tarot — woven into one located volume.",
    },
    {
      id: "lexicon-hex",
      title: `Johnson Hexagon on “${result.normalized}”`,
      combo: combinationTokens(result, johnsonExtras),
      blurb:
        "Samuel Johnson headwords and brute-force expansions for this path — definitions already waiting on a shelf.",
    },
    {
      id: "doctrine-myth",
      title: `Blavatsky × Graves · letter scrambles`,
      combo: combinationTokens(result, [...doctrineMatches, ...mythMatches]),
      blurb:
        "Anagram / scramble / similar-letter hits from The Secret Doctrine and The Greek Myths — amber tokens mark every match.",
    },
  ];

  for (const spec of combos.slice(0, maxBooks)) {
    const chapters: Array<{
      title: string;
      kind: BabelSourceKind;
      phrase: string;
      highlight: BabelHighlightToken[];
      excerpt: string;
    }> = [];

    chapters.push({
      title: "I · The word and its path",
      kind: "path",
      phrase: `${result.normalized} ${result.title} ${result.traits.join(" ")} ${result.note}`,
      highlight: [
        { word: result.normalized, reason: "exact", kind: "keyword" },
        { word: result.title, reason: "path title", kind: "path" },
        ...result.traits.slice(0, 4).map((t) => ({
          word: t,
          reason: "path trait",
          kind: "path" as const,
        })),
      ],
      excerpt: result.note,
    });

    chapters.push({
      title: "II · Thought-Forms colour",
      kind: "thought-form",
      phrase: `${bundle.colorName} ${bundle.musicalNote} ${bundle.primaryFigure.emotion} ${bundle.primaryFigure.quote}`,
      highlight: [
        { word: bundle.colorName, reason: "colour ray", kind: "thought-form" },
        ...wordsFromText(bundle.primaryFigure.emotion, 4).slice(0, 4).map((w) => ({
          word: w,
          reason: "emotion",
          kind: "thought-form" as const,
        })),
      ],
      excerpt: bundle.primaryFigure.quote.slice(0, 220),
    });

    if (input.johnsonWord || result.johnsonExpansions.some((e) => e.found)) {
      const head = input.johnsonWord?.headword ?? result.normalized;
      const sense = input.johnsonWord?.senses[0] ?? "";
      chapters.push({
        title: "III · Johnson’s lexicon",
        kind: "johnson",
        phrase: `${head} ${sense} ${johnsonExtras.join(" ")}`,
        highlight: [
          { word: head, reason: "Johnson headword", kind: "johnson" },
          ...johnsonExtras.slice(0, 5).map((w) => ({
            word: w,
            reason: isAnagramOf(result.normalized, w) ? "anagram / scramble" : "Johnson expansion",
            kind: (isAnagramOf(result.normalized, w) ? "anagram" : "johnson-expansion") as BabelSourceKind,
          })),
        ],
        excerpt: sense.slice(0, 220) || "Johnson expansions for path lore.",
      });
    }

    for (const [i, p] of (input.secretPassages ?? []).slice(0, 2).entries()) {
      chapters.push({
        title: `IV.${i + 1} · Blavatsky p.${p.page}`,
        kind: "secret-doctrine",
        phrase: `${p.matched.join(" ")} ${p.text.slice(0, 200)}`,
        highlight: p.matched.slice(0, 6).map((w) => ({
          word: w,
          reason: p.reasons[0] ?? "anagram / scramble",
          kind: "secret-doctrine" as const,
        })),
        excerpt: p.text.slice(0, 220),
      });
    }

    for (const [i, p] of (input.mythPassages ?? []).slice(0, 2).entries()) {
      chapters.push({
        title: `V.${i + 1} · Graves p.${p.page}`,
        kind: "greek-myth",
        phrase: `${p.matched.join(" ")} ${p.text.slice(0, 200)}`,
        highlight: p.matched.slice(0, 6).map((w) => ({
          word: w,
          reason: p.reasons[0] ?? "anagram / scramble",
          kind: "greek-myth" as const,
        })),
        excerpt: p.text.slice(0, 220),
      });
    }

    const phil = result.philosophy.thoughts.slice(0, 2);
    for (const [i, t] of phil.entries()) {
      chapters.push({
        title: `VI.${i + 1} · ${t.philosopher}`,
        kind: "philosophy",
        phrase: `${t.philosopher} ${t.thought}`,
        highlight: [
          {
            word: t.philosopher.split(/\s+/).pop() ?? t.philosopher,
            reason: "philosopher",
            kind: "philosophy",
          },
          ...wordsFromText(t.thought, 5).slice(0, 5).map((w) => ({
            word: w,
            reason: reasonForPair(result.normalized, w),
            kind: "philosophy" as const,
          })),
        ],
        excerpt: t.thought.slice(0, 220),
      });
    }

    // Combination leaf — the “new” book spine from search combos
    chapters.push({
      title: "VII · Combination leaf",
      kind: "synthesis",
      phrase: `combination ${spec.combo.join(" ")} for path ${result.number} in the library of babel`,
      highlight: spec.combo.map((w) => ({
        word: w,
        reason: reasonForPair(result.normalized, w),
        kind: "synthesis" as const,
      })),
      excerpt: spec.blurb,
    });

    const pages: BabelBookPage[] = [];
    const allMatched: string[] = [];
    for (const [index, ch] of chapters.entries()) {
      try {
        const page = locatePageWithHighlights(
          ch.phrase,
          ch.highlight,
          result.number,
          `${spec.id}-p${index}`,
        );
        pages.push({
          index: index + 1,
          title: ch.title,
          sourceKind: ch.kind,
          page,
          highlight: ch.highlight,
          excerpt: ch.excerpt,
        });
        allMatched.push(...page.matched);
      } catch {
        // skip
      }
    }
    if (!pages.length) continue;

    const coverArt = artworkForPath(result.number + books.length);
    const searchPhrase = toBabelAlphabet(spec.combo.join(" ")).slice(0, 200);
    books.push({
      id: `${spec.id}-${normalizeWord(result.normalized)}-${result.number}`,
      title: spec.title,
      subtitle: `Path ${result.number} · ${result.title} · ${bundle.colorName}`,
      pathNumber: result.number,
      seedWord: result.normalized,
      combination: spec.combo,
      colorHex: bundle.hex,
      colorName: bundle.colorName,
      emotion: bundle.primaryFigure.emotion,
      coverArt,
      pages,
      allMatched: [...new Set(allMatched)],
      officialSearchUrl: `${OFFICIAL_BABEL.search}?find=${encodeURIComponent(searchPhrase)}`,
      blurb: spec.blurb,
    });
  }

  return books;
}
