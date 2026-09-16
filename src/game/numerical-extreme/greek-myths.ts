/** Robert Graves, The Greek Myths — anagram / scramble / similar-letter passage search. */

import { collectLetterMatchCandidates, normalizeWord } from "./letter-match";

export type GreekMythPassage = {
  id: number;
  page: number;
  text: string;
  matched: string[];
  reasons: string[];
  score: number;
};

type PassageRaw = { id: number; page: number; t: string };
type IndexBucket = { bucket: string; entries: Record<string, number[]> };
type SignatureBucket = { bucket: string; entries: Record<string, string[]> };
type LengthBucket = { length: number; words: string[] };
type Manifest = {
  source: string;
  pages: number;
  passageCount: number;
  chunkSize: number;
  chunkCount: number;
};

let manifestPromise: Promise<Manifest | null> | null = null;
const indexBuckets = new Map<string, Record<string, number[]>>();
const signatureBuckets = new Map<string, Record<string, string[]>>();
const lengthBuckets = new Map<number, string[]>();
const passageChunks = new Map<number, Map<number, PassageRaw>>();

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}`);
  return response.json() as Promise<T>;
}

export async function loadGreekMythsManifest(): Promise<Manifest | null> {
  if (!manifestPromise) {
    manifestPromise = fetchJson<Manifest>("/greek-myths/manifest.json").catch(() => null);
  }
  return manifestPromise;
}

async function loadWordIndex(letter: string): Promise<Record<string, number[]>> {
  const key = (letter[0] ?? "_").toLowerCase();
  const cached = indexBuckets.get(key);
  if (cached) return cached;
  try {
    const data = await fetchJson<IndexBucket>(`/greek-myths/index/${encodeURIComponent(key)}.json`);
    indexBuckets.set(key, data.entries);
    return data.entries;
  } catch {
    indexBuckets.set(key, {});
    return {};
  }
}

async function loadSignatures(letter: string): Promise<Record<string, string[]>> {
  const key = (letter[0] ?? "_").toLowerCase();
  const cached = signatureBuckets.get(key);
  if (cached) return cached;
  try {
    const data = await fetchJson<SignatureBucket>(
      `/greek-myths/signatures/${encodeURIComponent(key)}.json`,
    );
    signatureBuckets.set(key, data.entries);
    return data.entries;
  } catch {
    signatureBuckets.set(key, {});
    return {};
  }
}

async function loadLength(len: number): Promise<string[]> {
  const cached = lengthBuckets.get(len);
  if (cached) return cached;
  try {
    const data = await fetchJson<LengthBucket>(`/greek-myths/lengths/${len}.json`);
    lengthBuckets.set(len, data.words);
    return data.words;
  } catch {
    lengthBuckets.set(len, []);
    return [];
  }
}

async function loadPassage(id: number, chunkSize: number): Promise<PassageRaw | null> {
  const chunkIndex = Math.floor(id / chunkSize);
  let chunk = passageChunks.get(chunkIndex);
  if (!chunk) {
    try {
      const rows = await fetchJson<PassageRaw[]>(
        `/greek-myths/passages-${String(chunkIndex).padStart(3, "0")}.json`,
      );
      chunk = new Map(rows.map((row) => [row.id, row]));
      passageChunks.set(chunkIndex, chunk);
    } catch {
      return null;
    }
  }
  return chunk.get(id) ?? null;
}

export async function searchGreekMyths(query: {
  word: string;
  limit?: number;
}): Promise<{ passages: GreekMythPassage[]; source: string }> {
  const manifest = await loadGreekMythsManifest();
  if (!manifest) return { passages: [], source: "" };

  const word = normalizeWord(query.word);
  if (!word) return { passages: [], source: manifest.source };

  const candidates = await collectLetterMatchCandidates(word, {
    loadSignatures,
    loadLength,
  });
  if (!candidates.length) return { passages: [], source: manifest.source };

  const idMeta = new Map<number, { matched: Set<string>; reasons: Set<string>; score: number }>();

  for (const candidate of candidates) {
    const bucket = await loadWordIndex(candidate.word);
    for (const id of bucket[candidate.word] ?? []) {
      const meta = idMeta.get(id) ?? { matched: new Set(), reasons: new Set(), score: 0 };
      meta.matched.add(candidate.word);
      for (const reason of candidate.reasons) meta.reasons.add(reason);
      meta.score += candidate.score;
      idMeta.set(id, meta);
    }
  }

  const scored: GreekMythPassage[] = [];
  for (const [id, meta] of idMeta) {
    const raw = await loadPassage(id, manifest.chunkSize);
    if (!raw) continue;
    scored.push({
      id: raw.id,
      page: raw.page,
      text: raw.t,
      matched: [...meta.matched],
      reasons: [...meta.reasons],
      score: meta.score,
    });
  }

  scored.sort((a, b) => b.score - a.score || a.page - b.page);
  const seenPages = new Set<number>();
  const picked: GreekMythPassage[] = [];
  const limit = query.limit ?? 5;
  for (const row of scored) {
    if (seenPages.has(row.page) && picked.length >= 2) continue;
    seenPages.add(row.page);
    picked.push(row);
    if (picked.length >= limit) break;
  }

  return { passages: picked, source: manifest.source };
}
