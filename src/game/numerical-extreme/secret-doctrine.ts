/** The Secret Doctrine (Blavatsky) passage search — loaded on demand by letter bucket. */

export type SecretDoctrinePassage = {
  id: number;
  page: number;
  text: string;
  /** Query term(s) that matched this passage. */
  matched: string[];
  /** Relevance score for ranking. */
  score: number;
};

type PassageRaw = { id: number; page: number; t: string };
type IndexBucket = { bucket: string; entries: Record<string, number[]> };
type Manifest = {
  source: string;
  pages: number;
  passageCount: number;
  chunkSize: number;
  chunkCount: number;
};

const NUMBER_RELATED: Record<number, string[]> = {
  1: ["one", "unity", "monad", "point", "logos", "beginning", "first"],
  2: ["two", "duality", "duad", "pair", "polarity", "binary"],
  3: ["three", "triad", "trinity", "triangle", "triune", "fohat"],
  4: ["four", "quaternary", "square", "cross", "tetrad", "cube"],
  5: ["five", "pentad", "microcosm", "man", "human"],
  6: ["six", "hexad", "hexagon", "nature", "double"],
  7: ["seven", "septenary", "septenate", "hebdomad", "hierarchy", "planes", "rounds"],
  8: ["eight", "ogdoad", "cube", "matter", "infinity"],
  9: ["nine", "ennead", "completion", "circle", "cycle", "manvantara"],
};

const STEM_CUTS = [/ies$/, /ing$/, /ied$/, /ed$/, /es$/, /s$/];

let manifestPromise: Promise<Manifest | null> | null = null;
const indexBuckets = new Map<string, Record<string, number[]>>();
const passageChunks = new Map<number, Map<number, PassageRaw>>();

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}`);
  return response.json() as Promise<T>;
}

export async function loadSecretDoctrineManifest(): Promise<Manifest | null> {
  if (!manifestPromise) {
    manifestPromise = fetchJson<Manifest>("/secret-doctrine/manifest.json").catch(() => null);
  }
  return manifestPromise;
}

async function loadIndexBucket(letter: string): Promise<Record<string, number[]>> {
  const key = (letter[0] ?? "_").toLowerCase();
  const cached = indexBuckets.get(key);
  if (cached) return cached;
  try {
    const data = await fetchJson<IndexBucket>(`/secret-doctrine/index/${encodeURIComponent(key)}.json`);
    indexBuckets.set(key, data.entries);
    return data.entries;
  } catch {
    indexBuckets.set(key, {});
    return {};
  }
}

async function loadPassage(id: number, chunkSize: number): Promise<PassageRaw | null> {
  const chunkIndex = Math.floor(id / chunkSize);
  let chunk = passageChunks.get(chunkIndex);
  if (!chunk) {
    try {
      const rows = await fetchJson<PassageRaw[]>(
        `/secret-doctrine/passages-${String(chunkIndex).padStart(3, "0")}.json`,
      );
      chunk = new Map(rows.map((row) => [row.id, row]));
      passageChunks.set(chunkIndex, chunk);
    } catch {
      return null;
    }
  }
  return chunk.get(id) ?? null;
}

function normalizeToken(word: string): string {
  return word.toLowerCase().replace(/[^a-z']/g, "");
}

function variantsFor(word: string): string[] {
  const key = normalizeToken(word);
  if (!key || key.length < 3) return [];
  const out = new Set<string>([key]);
  for (const cut of STEM_CUTS) {
    const stem = key.replace(cut, "");
    if (stem.length >= 3) out.add(stem);
  }
  // light related forms
  if (key.endsWith("y")) out.add(`${key.slice(0, -1)}ies`);
  if (key.endsWith("e")) out.add(`${key}d`);
  out.add(`${key}s`);
  out.add(`${key}ing`);
  return [...out];
}

function scorePassage(text: string, matched: string[], pathNumber: number | null): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const term of matched) {
    const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    const hits = lower.match(re)?.length ?? 0;
    score += hits * 3;
  }
  if (pathNumber) {
    for (const related of NUMBER_RELATED[pathNumber] ?? []) {
      if (lower.includes(related)) score += 2;
    }
  }
  // numerology / occult density
  for (const boost of [
    "number",
    "numbers",
    "septenary",
    "occult",
    "esoteric",
    "pythagoras",
    "kabala",
    "kabbalah",
    "fohat",
    "dzyan",
    "monad",
    "logos",
  ]) {
    if (lower.includes(boost)) score += 1;
  }
  return score;
}

export type SecretDoctrineQuery = {
  word: string;
  pathNumber?: number | null;
  limit?: number;
};

/**
 * Find Secret Doctrine passages for the typed word (and close stems),
 * ranked for relevance and lightly boosted by the word’s path number lore.
 */
export async function searchSecretDoctrine(query: SecretDoctrineQuery): Promise<{
  passages: SecretDoctrinePassage[];
  source: string;
}> {
  const manifest = await loadSecretDoctrineManifest();
  if (!manifest) return { passages: [], source: "" };

  const word = normalizeToken(query.word);
  if (!word) return { passages: [], source: manifest.source };

  const terms = new Set(variantsFor(word));
  // add a few path-number companions only when they co-occur with the word search pool
  const companions = (query.pathNumber ? NUMBER_RELATED[query.pathNumber] ?? [] : []).slice(0, 4);

  const idToMatched = new Map<number, Set<string>>();

  for (const term of terms) {
    const bucket = await loadIndexBucket(term);
    for (const id of bucket[term] ?? []) {
      const set = idToMatched.get(id) ?? new Set();
      set.add(term);
      idToMatched.set(id, set);
    }
  }

  // Companion terms: only keep passages that already matched the typed word (relevance gate)
  if (idToMatched.size > 0) {
    for (const term of companions) {
      const bucket = await loadIndexBucket(term);
      for (const id of bucket[term] ?? []) {
        if (!idToMatched.has(id)) continue;
        idToMatched.get(id)!.add(term);
      }
    }
  }

  const limit = query.limit ?? 5;
  const scored: SecretDoctrinePassage[] = [];

  for (const [id, matchedSet] of idToMatched) {
    const raw = await loadPassage(id, manifest.chunkSize);
    if (!raw) continue;
    const matched = [...matchedSet];
    const score = scorePassage(raw.t, matched, query.pathNumber ?? null);
    scored.push({
      id: raw.id,
      page: raw.page,
      text: raw.t,
      matched,
      score,
    });
  }

  scored.sort((a, b) => b.score - a.score || a.page - b.page);

  // diversify pages
  const seenPages = new Set<number>();
  const picked: SecretDoctrinePassage[] = [];
  for (const row of scored) {
    if (seenPages.has(row.page) && picked.length >= 2) continue;
    seenPages.add(row.page);
    picked.push(row);
    if (picked.length >= limit) break;
  }

  return { passages: picked, source: manifest.source };
}
