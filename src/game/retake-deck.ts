/**
 * Retake deck ordering for trivia quizzes.
 *
 * After a score report, the next run:
 *  1. Leads with previously missed questions (learning-first)
 *  2. Orders each block by ascending difficulty (1→5) when possible
 *  3. Quantum-shuffles within each difficulty band (ANU QRNG / CSPRNG fallback)
 *     so the sequence is not mechanistically predictable
 *
 * Memory Gauntlet behaviour is unchanged.
 */

import { prefetchAnuQrng, randomFloat } from "@/lib/anu-qrng";

export { prefetchAnuQrng };

type Difficulable = { id: string; difficulty?: number; points?: number; globalNumber?: number };

/** In-place Fisher–Yates using ANU quantum (or local) entropy. */
export function quantumShuffle<T>(items: T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.min(i, Math.floor(randomFloat() * (i + 1)));
    const tmp = out[i]!;
    out[i] = out[j]!;
    out[j] = tmp;
  }
  return out;
}

function difficultyRank(q: Difficulable): number {
  if (typeof q.difficulty === "number" && Number.isFinite(q.difficulty)) return q.difficulty;
  // Fallback proxies when a bank omits difficulty
  if (typeof q.points === "number" && Number.isFinite(q.points)) return Math.min(5, Math.max(1, Math.round(q.points / 50)));
  if (typeof q.globalNumber === "number") return Math.min(5, Math.max(1, Math.ceil(q.globalNumber / 70)));
  return 3;
}

/**
 * Ascending difficulty; within each difficulty band, quantum-shuffle
 * so ties are not a fixed mechanical order.
 */
export function orderAscendingDifficultyQuantum<T extends Difficulable>(items: T[]): T[] {
  if (items.length <= 1) return items.slice();
  void prefetchAnuQrng();
  const byDiff = new Map<number, T[]>();
  for (const q of items) {
    const d = difficultyRank(q);
    const bucket = byDiff.get(d);
    if (bucket) bucket.push(q);
    else byDiff.set(d, [q]);
  }
  const ranks = [...byDiff.keys()].sort((a, b) => a - b);
  const out: T[] = [];
  for (const rank of ranks) {
    out.push(...quantumShuffle(byDiff.get(rank)!));
  }
  return out;
}

/**
 * Build a retake order: missed first (ascending difficulty + quantum within band),
 * then the rest the same way. If nothing was missed, ascending-difficulty quantum
 * order for the full pool.
 */
export function buildRetakeDeck<T extends Difficulable>(
  pool: T[],
  missedIds: readonly string[],
): T[] {
  if (!pool.length) return [];
  void prefetchAnuQrng();

  const missedSet = new Set(missedIds);
  const missed = pool.filter((q) => missedSet.has(q.id));
  const rest = pool.filter((q) => !missedSet.has(q.id));

  if (!missed.length) return orderAscendingDifficultyQuantum(pool);
  return [
    ...orderAscendingDifficultyQuantum(missed),
    ...orderAscendingDifficultyQuantum(rest),
  ];
}

/** Quantum-shuffle a list of question ids (e.g. Review missed-only runs). */
export function quantumShuffleIds(ids: readonly string[]): string[] {
  void prefetchAnuQrng();
  return quantumShuffle([...ids]);
}
