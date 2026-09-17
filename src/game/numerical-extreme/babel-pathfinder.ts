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
import { expandPhraseWithBabelGlossary, expandWithBabelGlossary } from "./babel-library-companion";
import {
  babelProseCandidates,
  orderTokensForWritingIq,
  pickBestRelevantProse,
  silentlyPickBestBabelProse,
} from "./babel-writing-iq";

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
  /** EPUB translator (Codex) — vendored at tools/the-babel-library; not Basile LoB. */
  epubCompanion: "https://github.com/clcreuso/the-babel-library",
  epubCompanionLocal: "/numerology/babel/epub-library/README.md",
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

/** Build a BabelPage from a full 3200-char woven text (Library locate). */
export function pageFromWovenText(
  text: string,
  pathNumber: number,
  highlightWords: string[],
  searchPhrase: string,
): BabelPage {
  const full = text.padEnd(BABEL_PAGE_CHARS, " ").slice(0, BABEL_PAGE_CHARS);
  const seed = pageTextToSeed(full);
  const location = locationFromSeed(seed, pathNumber, toBabelAlphabet(searchPhrase).slice(0, 200));
  const lines: string[] = [];
  for (let r = 0; r < BABEL_LINES; r += 1) {
    lines.push(full.slice(r * BABEL_COLS, (r + 1) * BABEL_COLS));
  }
  const matched = [
    ...new Set(
      highlightWords
        .map((w) => normalizeWord(w))
        .filter((w) => w.length >= 2),
    ),
  ];
  return {
    location,
    text: full,
    lines,
    matched,
    matchReasons: ["located in library", "coherence weave"],
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

  // EPUB companion glossary — widen every active source with multilingual / sibling seeds
  const glossarySeeds = [
    ...expandWithBabelGlossary(result.normalized, 8),
    ...expandPhraseWithBabelGlossary(
      [
        result.title,
        result.philosophy.sacredName,
        result.tarot.name,
        input.johnsonWord?.headword,
        input.secretPassages?.[0]?.matched.join(" "),
        input.mythPassages?.[0]?.matched.join(" "),
        input.ruckmanVerses?.[0]?.text,
      ]
        .filter(Boolean)
        .join(" "),
      10,
    ),
  ];
  const uniqueGlossary = [...new Set(glossarySeeds.map((w) => normalizeWord(w)).filter((w) => w.length >= 3))];
  if (uniqueGlossary.length) {
    pushQuery(out, seen, {
      kind: "synthesis",
      label: "EPUB glossary · all sources",
      phrase: uniqueGlossary.slice(0, 8).join(" "),
      note: "clcreuso/the-babel-library companion — glossary expansions across Johnson, doctrine, myths, Thought-Forms, KJV, philosophy, tarot.",
      highlight: uniqueGlossary.slice(0, 8).map((w) => ({
        word: w,
        reason: "glossary expansion",
        kind: "synthesis" as const,
      })),
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

/** Local antique + retro plates shipped under /numerology/babel/. */
export const BABEL_ARTWORK: BabelArtwork[] = [
  {
    id: "retro-grimoire",
    src: "/numerology/babel/retro-grimoire.png",
    title: "Retro Grimoire (pixel)",
    artist: "Path hexagon press · ZEUS",
    year: "—",
    credit: "Entry tome for Babel Secret Library",
  },
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
  /** Readable “new” leaf text woven from foundational sources (not only Babel noise). */
  bodyText: string;
  /** 0–100 · most accurate foundational match first; fades as you turn pages. */
  accuracy: number;
  accuracyLabel: string;
  accuracyWhy: string;
};

/** Bibliographic card — “new book information” for a located volume. */
export type BabelBookInfo = {
  callNumber: string;
  hexagon: string;
  wall: number;
  shelf: number;
  volume: number;
  pageCount: number;
  publisher: string;
  imprintYear: number;
  language: string;
  subjects: string[];
  contents: string[];
  dedication: string;
  isbnLike: string;
  officialSearchUrl: string;
  theoryUrl: string;
  babeliaUrl: string;
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
  info: BabelBookInfo;
};

function artworkForPath(pathNumber: number): BabelArtwork {
  const idx = Math.abs(pathNumber - 1) % BABEL_ARTWORK.length;
  return BABEL_ARTWORK[idx]!;
}

function combinationTokens(result: NumerologyResult, extras: string[]): string[] {
  const glossary = expandWithBabelGlossary(result.normalized, 12);
  const phraseExtra = expandPhraseWithBabelGlossary(extras.join(" "), 8);
  const base = [
    result.normalized,
    ...result.traits.slice(0, 3),
    result.philosophy.sacredName,
    result.tarot.name,
    ...extras,
    ...glossary,
    ...phraseExtra,
  ]
    .map((w) => normalizeWord(w))
    .filter((w) => w.length >= 3);
  return orderTokensForWritingIq([...new Set(base)]).slice(0, 16);
}

type ChapterDraft = {
  title: string;
  kind: BabelSourceKind;
  phrase: string;
  highlight: BabelHighlightToken[];
  excerpt: string;
  bodyText: string;
  accuracy: number;
  accuracyLabel: string;
  accuracyWhy: string;
};

/** Rank: exact word/path/Johnson > Thought-Forms > philosophy/tarot > Blavatsky > Graves > expansions/anagrams > synthesis. */
function accuracyForKind(
  kind: BabelSourceKind,
  opts?: { exactJohnson?: boolean; passageScore?: number; anagram?: boolean },
): { accuracy: number; label: string; why: string } {
  switch (kind) {
    case "keyword":
    case "path":
      return {
        accuracy: 98,
        label: "Foundational · exact",
        why: "Typed word → letter-sum path — the primary key of this volume.",
      };
    case "johnson":
      return {
        accuracy: opts?.exactJohnson ? 94 : 86,
        label: opts?.exactJohnson ? "Foundational · Johnson headword" : "Strong · Johnson sense",
        why: "Samuel Johnson defines the word (or a path expansion) directly.",
      };
    case "thought-form":
      return {
        accuracy: 90,
        label: "Foundational · Thought-Forms",
        why: "Besant/Leadbeater colour–emotion plate for this path ray.",
      };
    case "philosophy":
      return {
        accuracy: 82,
        label: "Strong · tradition quote",
        why: "Primary-source philosopher card tied to the path digit.",
      };
    case "tarot":
      return {
        accuracy: 78,
        label: "Strong · tarot arcana",
        why: "Major Arcana mapped to the same path number.",
      };
    case "ruckman":
      return {
        accuracy: 74,
        label: "Cited · KJV verse",
        why: "Ruckman citation for this path number (1611 text).",
      };
    case "secret-doctrine": {
      const boost = Math.min(12, Math.floor((opts?.passageScore ?? 40) / 8));
      return {
        accuracy: 58 + boost,
        label: "Probable · Blavatsky match",
        why: "Secret Doctrine passage via exact / stem / anagram / scramble / similar letters.",
      };
    }
    case "greek-myth": {
      const boost = Math.min(12, Math.floor((opts?.passageScore ?? 40) / 8));
      return {
        accuracy: 52 + boost,
        label: "Probable · Graves match",
        why: "Greek Myths passage via exact / stem / anagram / scramble / similar letters.",
      };
    }
    case "anagram":
    case "johnson-expansion":
      return {
        accuracy: opts?.anagram ? 48 : 44,
        label: opts?.anagram ? "Weaker · anagram / scramble" : "Weaker · expansion",
        why: "Letter-signature neighbour — related, not the typed headword itself.",
      };
    case "synthesis":
      return {
        accuracy: 28,
        label: "Least likely · combination leaf",
        why: "Assembled combo of many sources — speculative catalogue leaf.",
      };
    default:
      return { accuracy: 35, label: "Peripheral", why: "Lower-confidence source leaf." };
  }
}

function composeFoundationalBody(args: {
  rank: number;
  total: number;
  accuracy: number;
  label: string;
  why: string;
  kind: BabelSourceKind;
  seedWord: string;
  pathNumber: number;
  title: string;
  excerpt: string;
  highlights: string[];
  location?: { hexagon: string; wall: number; shelf: number; volume: number; page: number };
}): string {
  // Borges / Basile: almost every page is noise; coherence is rare. Accuracy ≈
  // how much signal this located page carries from the foundational database.
  const babelFrame =
    args.accuracy >= 85
      ? "Among the indefinite hexagonal galleries, this is one of the rare coherent pages — a clear reading already waiting on the shelf. Nothing was written; the address was found."
      : args.accuracy >= 65
        ? "A readable page in a wing of near-matches. The Library still holds the sense, but neighbouring volumes blur into similar letter-counts and stems."
        : args.accuracy >= 45
          ? "Most of this leaf is the Library’s usual dust: a–z, space, comma, period in no order. A few amber tokens survive from Blavatsky / Graves / expansions."
          : "Typical Babel. The combination was located, not composed — nearly all noise, with your search phrase buried somewhere in the hexagon.";

  const loc = args.location
    ? `Address: hexagon ${args.location.hexagon} · wall ${args.location.wall} · shelf ${args.location.shelf} · volume ${args.location.volume} · page ${args.location.page}.`
    : "Address: pending location in the universal library.";

  const tokens = args.highlights.filter(Boolean).slice(0, 8).join(", ");
  const signalNote =
    args.accuracy >= 70
      ? `Signal ratio ~${args.accuracy}% — foundational database (Johnson, Thought-Forms, path lore) dominates this page.`
      : `Signal ratio ~${args.accuracy}% — Babel noise dominates; foundational tokens are sparse.`;

  return [
    `[Located leaf ${args.rank}/${args.total} · coherence ${args.accuracy}% · ${args.label}]`,
    `By this art you may contemplate the variation of the 29 letters.`,
    ``,
    loc,
    `Search key: “${args.seedWord}”. Path ${args.pathNumber}. Source class: ${args.kind}.`,
    args.why,
    ``,
    babelFrame,
    signalNote,
    ``,
    `— ${args.title} —`,
    ``,
    args.excerpt.trim(),
    ``,
    tokens ? `Amber tokens located on this page: ${tokens}.` : "",
    ``,
    `Progress the volume as you would walk the Library: first the pages that still mean, then the pages that only contain a scrap of your search, then the shelves of pure permutation.`,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

/**
 * Mix coherent source text with Babel-alphabet noise.
 * High coherence → mostly source. Low coherence → mostly noise (true Babel).
 */
export function weaveBabelPageText(
  coherent: string,
  pathNumber: number,
  salt: string,
  coherencePct: number,
): string {
  const babelCoherent = toBabelAlphabet(coherent);
  const target = BABEL_PAGE_CHARS;
  const signalBudget = Math.max(
    40,
    Math.min(target - 80, Math.floor((target * Math.max(5, Math.min(98, coherencePct))) / 100)),
  );
  const signal = babelCoherent.slice(0, signalBudget);
  const seed = hashStringToSeed(`${pathNumber}|${salt}|weave`);
  const rand = mulberry32(seed);
  const chars: string[] = new Array(target);
  for (let i = 0; i < target; i += 1) {
    chars[i] = BABEL_ALPHABET[Math.floor(rand() * 29)]!;
  }
  // Plant the coherent block at a reproducible offset (search-locate)
  const maxStart = Math.max(0, target - signal.length - 4);
  const start = Math.floor(rand() * (maxStart + 1));
  const block = ` ${signal} `;
  for (let i = 0; i < block.length && start + i < target; i += 1) {
    const ch = block[i]!;
    chars[start + i] = CHAR_INDEX[ch] !== undefined ? ch : " ";
  }
  return chars.join("");
}

/**
 * Generate a multi-page book whose leaves run most → least accurate
 * against the foundational source database (Johnson, Thought-Forms,
 * philosophy, Blavatsky, Graves, tarot, combinations).
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
        "Leaves ordered most → least accurate: path & Johnson first, then Thought-Forms, traditions, Blavatsky/Graves matches, combinations last.",
    },
    {
      id: "lexicon-hex",
      title: `Johnson Hexagon on “${result.normalized}”`,
      combo: combinationTokens(result, johnsonExtras),
      blurb:
        "Lexicon-first volume — exact Johnson senses lead; expansions and scrambles trail toward the back.",
    },
    {
      id: "doctrine-myth",
      title: `Blavatsky × Graves · letter scrambles`,
      combo: combinationTokens(result, [...doctrineMatches, ...mythMatches]),
      blurb:
        "Doctrine and myth letter-matches ranked by passage score; weakest combinations close the book.",
    },
  ];

  for (const spec of combos.slice(0, maxBooks)) {
    const drafts: ChapterDraft[] = [];

    {
      const meta = accuracyForKind("path");
      drafts.push({
        title: "The word and its path",
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
        bodyText: "",
        ...meta,
        accuracyLabel: meta.label,
        accuracyWhy: meta.why,
      });
    }

    if (input.johnsonWord || input.johnsonWord1773) {
      const edition = input.johnsonWord ?? input.johnsonWord1773!;
      const sense = edition.senses[0] ?? "";
      const meta = accuracyForKind("johnson", { exactJohnson: true });
      drafts.push({
        title: `Johnson · ${edition.headword}`,
        kind: "johnson",
        phrase: `${edition.headword} ${sense}`,
        highlight: [
          { word: edition.headword, reason: "Johnson headword", kind: "johnson" },
          ...wordsFromText(sense, 5)
            .slice(0, 4)
            .map((w) => ({
              word: w,
              reason: reasonForPair(result.normalized, w),
              kind: "johnson" as const,
            })),
        ],
        excerpt: sense.slice(0, 280) || edition.partOfSpeech,
        bodyText: "",
        ...meta,
        accuracyLabel: meta.label,
        accuracyWhy: meta.why,
      });
    }

    {
      const meta = accuracyForKind("thought-form");
      drafts.push({
        title: `Thought-Forms · ${bundle.colorName}`,
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
        excerpt: bundle.primaryFigure.quote.slice(0, 280),
        bodyText: "",
        ...meta,
        accuracyLabel: meta.label,
        accuracyWhy: meta.why,
      });
    }

    {
      const meta = accuracyForKind("tarot");
      drafts.push({
        title: `Tarot · ${result.tarot.name}`,
        kind: "tarot",
        phrase: `${result.tarot.name} ${result.tarot.arcana} ${result.tarot.explanation}`,
        highlight: [
          { word: result.tarot.name, reason: "tarot name", kind: "tarot" },
          ...wordsFromText(result.tarot.arcana, 4).map((w) => ({
            word: w,
            reason: "arcana",
            kind: "tarot" as const,
          })),
        ],
        excerpt: result.tarot.explanation.slice(0, 280),
        bodyText: "",
        ...meta,
        accuracyLabel: meta.label,
        accuracyWhy: meta.why,
      });
    }

    for (const t of result.philosophy.thoughts.slice(0, 3)) {
      const meta = accuracyForKind("philosophy");
      drafts.push({
        title: t.philosopher,
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
        excerpt: `${t.work} — ${t.thought}`.slice(0, 320),
        bodyText: "",
        ...meta,
        accuracyLabel: meta.label,
        accuracyWhy: meta.why,
      });
    }

    for (const v of (input.ruckmanVerses ?? []).slice(0, 2)) {
      const meta = accuracyForKind("ruckman");
      drafts.push({
        title: `KJV · ${v.ref}`,
        kind: "ruckman",
        phrase: `${v.ref} ${v.text}`,
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
        excerpt: v.text.slice(0, 280),
        bodyText: "",
        ...meta,
        accuracyLabel: meta.label,
        accuracyWhy: meta.why,
      });
    }

    const doctrineSorted = [...(input.secretPassages ?? [])].sort((a, b) => b.score - a.score);
    for (const p of doctrineSorted.slice(0, 3)) {
      const meta = accuracyForKind("secret-doctrine", { passageScore: p.score });
      drafts.push({
        title: `Blavatsky · p.${p.page}`,
        kind: "secret-doctrine",
        phrase: `${p.matched.join(" ")} ${p.text.slice(0, 220)}`,
        highlight: p.matched.slice(0, 6).map((w) => ({
          word: w,
          reason: p.reasons[0] ?? "anagram / scramble",
          kind: "secret-doctrine" as const,
        })),
        excerpt: p.text.slice(0, 320),
        bodyText: "",
        ...meta,
        accuracyLabel: meta.label,
        accuracyWhy: `${meta.why} Match score ${p.score}.`,
      });
    }

    const mythSorted = [...(input.mythPassages ?? [])].sort((a, b) => b.score - a.score);
    for (const p of mythSorted.slice(0, 3)) {
      const meta = accuracyForKind("greek-myth", { passageScore: p.score });
      drafts.push({
        title: `Graves · p.${p.page}`,
        kind: "greek-myth",
        phrase: `${p.matched.join(" ")} ${p.text.slice(0, 220)}`,
        highlight: p.matched.slice(0, 6).map((w) => ({
          word: w,
          reason: p.reasons[0] ?? "anagram / scramble",
          kind: "greek-myth" as const,
        })),
        excerpt: p.text.slice(0, 320),
        bodyText: "",
        ...meta,
        accuracyLabel: meta.label,
        accuracyWhy: `${meta.why} Match score ${p.score}.`,
      });
    }

    for (const exp of result.johnsonExpansions.filter((e) => e.found).slice(0, 5)) {
      const ana = isAnagramOf(result.normalized, exp.word);
      const meta = accuracyForKind(ana ? "anagram" : "johnson-expansion", { anagram: ana });
      drafts.push({
        title: ana ? `Anagram · ${exp.word}` : `Expansion · ${exp.word}`,
        kind: ana ? "anagram" : "johnson-expansion",
        phrase: `${exp.word} ${exp.entry?.senses[0] ?? ""}`,
        highlight: [
          {
            word: exp.word,
            reason: ana ? "anagram / scramble" : "Johnson expansion",
            kind: ana ? "anagram" : "johnson-expansion",
          },
        ],
        excerpt: (exp.entry?.senses[0] ?? "Path-lore expansion.").slice(0, 240),
        bodyText: "",
        ...meta,
        accuracyLabel: meta.label,
        accuracyWhy: meta.why,
      });
    }

    {
      const meta = accuracyForKind("synthesis");
      drafts.push({
        title: "Combination leaf · least likely",
        kind: "synthesis",
        phrase: `combination ${spec.combo.join(" ")} for path ${result.number} in the library of babel`,
        highlight: spec.combo.map((w) => ({
          word: w,
          reason: reasonForPair(result.normalized, w),
          kind: "synthesis" as const,
        })),
        excerpt: spec.blurb,
        bodyText: "",
        ...meta,
        accuracyLabel: meta.label,
        accuracyWhy: meta.why,
      });
    }

    // Most accurate → least likely
    drafts.sort((a, b) => b.accuracy - a.accuracy || a.title.localeCompare(b.title));

    const pages: BabelBookPage[] = [];
    const allMatched: string[] = [];
    const total = drafts.length;

    for (const [index, ch] of drafts.entries()) {
      // Silent local preference: denser prose combination for the coherent island
      const coherentBlock = pickBestRelevantProse(
        [ch.title, ch.excerpt, ch.phrase],
        8,
      ).prose || `${ch.title}. ${ch.excerpt}. ${ch.phrase}`;
      const woven = weaveBabelPageText(
        coherentBlock,
        result.number,
        `${spec.id}-${ch.kind}-${index}`,
        ch.accuracy,
      );
      const page = pageFromWovenText(
        woven,
        result.number,
        [result.normalized, ...ch.highlight.map((h) => h.word)],
        ch.phrase,
      );

      const bodyText = composeFoundationalBody({
        rank: index + 1,
        total,
        accuracy: ch.accuracy,
        label: ch.accuracyLabel,
        why: ch.accuracyWhy,
        kind: ch.kind,
        seedWord: result.normalized,
        pathNumber: result.number,
        title: ch.title,
        excerpt: ch.excerpt,
        highlights: ch.highlight.map((h) => h.word),
        location: {
          hexagon: page.location.hexagon,
          wall: page.location.wall,
          shelf: page.location.shelf,
          volume: page.location.volume,
          page: page.location.page,
        },
      });

      pages.push({
        index: index + 1,
        title: `${ch.accuracy}% · ${ch.title}`,
        sourceKind: ch.kind,
        page,
        highlight: ch.highlight,
        excerpt: ch.excerpt,
        bodyText,
        accuracy: ch.accuracy,
        accuracyLabel: ch.accuracyLabel,
        accuracyWhy: ch.accuracyWhy,
      });
      allMatched.push(...page.matched);
    }
    if (!pages.length) continue;

    const coverArt = artworkForPath(result.number + books.length);
    const searchPhrase = toBabelAlphabet(spec.combo.join(" ")).slice(0, 200);
    const firstLoc = pages[0]!.page.location;
    const seedNum = Number.parseInt(
      pages[0]!.page.seedDigest.replace(/[^0-9a-f]/gi, "").slice(0, 8) || "1",
      16,
    );
    const imprintYear = 1600 + (seedNum % 400);
    const isbnLike = `978-0-${String(result.number).padStart(2, "0")}-${String(seedNum % 1_000_000).padStart(6, "0")}-${seedNum % 10}`;
    const subjects = [
      result.title,
      bundle.colorName,
      result.tarot.name,
      result.philosophy.sacredName,
      "Library of Babel",
      "accuracy hierarchy",
      ...spec.combo.slice(0, 3),
    ];
    books.push({
      id: `${spec.id}-${normalizeWord(result.normalized)}-${result.number}`,
      title: spec.title,
      subtitle: `Path ${result.number} · located in the Library · coherent→noise`,
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
      blurb: `${spec.blurb} Borges/Basile: pages are located, not written — early leaves keep foundational signal; later leaves return to Babel noise.`,
      info: {
        callNumber: `BABEL ${result.number}.${normalizeWord(result.normalized).slice(0, 6).toUpperCase()} ${spec.id.slice(0, 4).toUpperCase()}`,
        hexagon: firstLoc.hexagon,
        wall: firstLoc.wall,
        shelf: firstLoc.shelf,
        volume: firstLoc.volume,
        pageCount: pages.length,
        publisher: "Universal Library of Babel · Hexagon Press",
        imprintYear,
        language: "29-letter Babel alphabet (a–z, space, comma, period)",
        subjects: [...new Set(subjects)],
        contents: pages.map((p) => p.title),
        dedication: `For seekers of “${result.normalized}” — read front to back as accuracy falls from foundational sources to least-likely combinations.`,
        isbnLike,
        officialSearchUrl: `${OFFICIAL_BABEL.search}?find=${encodeURIComponent(searchPhrase)}`,
        theoryUrl: OFFICIAL_BABEL.theory,
        babeliaUrl: OFFICIAL_BABEL.babelia,
      },
    });
  }

  return books;
}

/**
 * Background polish: re-locate leaf coherent islands using Writing IQ + AI checks
 * (prefer AI &lt; 10%). Silent — do not show scores in UI.
 * `light: true` skips neural models and only polishes the first leaf (typing/scroll safe).
 */
export async function quietlyPolishBabelBooks(
  books: BabelGeneratedBook[],
  opts?: { light?: boolean },
): Promise<BabelGeneratedBook[]> {
  if (!books.length) return books;
  const light = opts?.light !== false;
  const out: BabelGeneratedBook[] = [];
  const booksToTouch = light ? books.slice(0, 1) : books;

  const yieldMain = () =>
    new Promise<void>((resolve) => {
      const ric = (
        window as Window & { requestIdleCallback?: (cb: () => void) => number }
      ).requestIdleCallback;
      if (ric) ric(() => resolve());
      else window.setTimeout(() => resolve(), 0);
    });

  for (const book of booksToTouch) {
    const pages: BabelBookPage[] = [...book.pages];
    const leafLimit = light ? Math.min(1, pages.length) : Math.min(3, pages.length);

    for (let i = 0; i < leafLimit; i += 1) {
      await yieldMain();
      const leaf = pages[i]!;
      const parts = [
        leaf.title.replace(/^\d+%\s*·\s*/, ""),
        leaf.excerpt,
        ...leaf.highlight.map((h) => h.word).slice(0, 6),
      ];
      const candidates = babelProseCandidates(parts).slice(0, 3);
      const bodyPad = leaf.bodyText
        .split("\n")
        .filter((l) => l.trim().length > 40 && !l.startsWith("["))
        .slice(0, 3)
        .join(" ");
      const padded = candidates.map((c) => `${c} ${bodyPad}`.trim());

      let coherent = candidates[0] ?? leaf.excerpt;
      try {
        coherent = await silentlyPickBestBabelProse(padded.length ? padded : candidates, {
          neural: light ? "none" : "modernbert",
          localOnly: light,
          maxCandidates: light ? 2 : 3,
        });
      } catch {
        coherent = pickBestRelevantProse(parts, 4).prose || leaf.excerpt;
      }

      const woven = weaveBabelPageText(
        coherent,
        book.pathNumber,
        `${book.id}-polish-${i}`,
        leaf.accuracy,
      );
      const page = pageFromWovenText(
        woven,
        book.pathNumber,
        [book.seedWord, ...leaf.highlight.map((h) => h.word)],
        coherent.slice(0, 200),
      );
      pages[i] = { ...leaf, page, excerpt: leaf.excerpt };
    }

    out.push({ ...book, pages });
  }

  // Keep remaining books untouched
  for (let i = booksToTouch.length; i < books.length; i += 1) {
    out.push(books[i]!);
  }

  return out;
}
