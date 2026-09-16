/** Shared letter-signature matching: exact, anagram/scramble, similar length + shared letters. */

export type WordMatchCandidate = {
  word: string;
  score: number;
  reasons: string[];
};

export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z]/g, "");
}

export function letterSignature(word: string): string {
  return [...normalizeWord(word)].sort().join("");
}

export function letterOverlap(a: string, b: string): number {
  const counts = new Map<string, number>();
  for (const ch of a) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  let shared = 0;
  for (const ch of b) {
    const n = counts.get(ch) ?? 0;
    if (n > 0) {
      shared += 1;
      counts.set(ch, n - 1);
    }
  }
  return shared;
}

const STEM_CUTS = [/ies$/, /ing$/, /ied$/, /ed$/, /es$/, /s$/];

export function stemVariants(word: string): string[] {
  const key = normalizeWord(word);
  if (key.length < 3) return [];
  const out = new Set<string>([key]);
  for (const cut of STEM_CUTS) {
    const stem = key.replace(cut, "");
    if (stem.length >= 3) out.add(stem);
  }
  if (key.endsWith("y")) out.add(`${key.slice(0, -1)}ies`);
  if (key.endsWith("e")) out.add(`${key}d`);
  out.add(`${key}s`);
  out.add(`${key}ing`);
  return [...out];
}

type Loaders = {
  loadSignatures: (firstLetter: string) => Promise<Record<string, string[]>>;
  loadLength: (len: number) => Promise<string[]>;
};

/**
 * Rank candidate vocabulary words related to the query by:
 * exact match, stem forms, anagram/scramble, similar letter-count with shared letters.
 */
export async function collectLetterMatchCandidates(
  query: string,
  loaders: Loaders,
  limit = 24,
): Promise<WordMatchCandidate[]> {
  const q = normalizeWord(query);
  if (q.length < 3) return [];
  const sig = letterSignature(q);
  const out = new Map<string, WordMatchCandidate>();

  const bump = (word: string, score: number, reason: string) => {
    if (!word || word.length < 3) return;
    if (word === q && reason !== "exact" && reason !== "stem") return;
    const prev = out.get(word);
    if (prev) {
      prev.score += score;
      if (!prev.reasons.includes(reason)) prev.reasons.push(reason);
    } else {
      out.set(word, { word, score, reasons: [reason] });
    }
  };

  bump(q, 120, "exact");
  for (const stem of stemVariants(q)) {
    if (stem !== q) bump(stem, 70, "stem");
  }

  const sigBucket = await loaders.loadSignatures(sig[0] ?? "_");
  for (const peer of sigBucket[sig] ?? []) {
    bump(peer, peer === q ? 0 : 100, peer === q ? "exact" : "anagram / scramble");
  }

  for (const delta of [0, 1, -1, 2, -2]) {
    const len = q.length + delta;
    if (len < 3) continue;
    const words = await loaders.loadLength(len);
    const needShared = Math.max(3, Math.ceil(Math.min(q.length, len) * 0.55));
    for (const word of words) {
      if (word === q) continue;
      const shared = letterOverlap(q, word);
      if (shared < needShared) continue;
      const lengthBonus = delta === 0 ? 18 : Math.abs(delta) === 1 ? 12 : 6;
      bump(word, shared * 4 + lengthBonus, "similar length · shared letters");
    }
  }

  return [...out.values()].sort((a, b) => b.score - a.score).slice(0, limit);
}
