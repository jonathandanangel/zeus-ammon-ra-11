export type MemoryGameId =
  | "grid-run"
  | "neon-maze"
  | "electric-recall"
  | "memory-gauntlet";

export type MemoryHighScores = Record<MemoryGameId, number>;

export const MEMORY_SCORE_KEY = "zeus.memory-extreme.scores.v1";

export const DEFAULT_MEMORY_SCORES: MemoryHighScores = {
  "grid-run": 0,
  "neon-maze": 0,
  "electric-recall": 0,
  "memory-gauntlet": 0,
};

export function loadMemoryHighScores(): MemoryHighScores {
  if (typeof window === "undefined") return { ...DEFAULT_MEMORY_SCORES };
  try {
    const raw = window.localStorage.getItem(MEMORY_SCORE_KEY);
    if (!raw) return { ...DEFAULT_MEMORY_SCORES };
    const parsed = JSON.parse(raw) as Partial<MemoryHighScores>;
    return { ...DEFAULT_MEMORY_SCORES, ...parsed };
  } catch {
    return { ...DEFAULT_MEMORY_SCORES };
  }
}

export function saveMemoryHighScore(id: MemoryGameId, score: number): MemoryHighScores {
  const next = loadMemoryHighScores();
  const value = Math.max(0, Math.floor(score));
  if (value > (next[id] ?? 0)) {
    next[id] = value;
    try {
      window.localStorage.setItem(MEMORY_SCORE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }
  return next;
}
