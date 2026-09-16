import type { AchievementId } from "@/game/spirit-bound/shrine/scoring";

const KEY = "trianglebound.shrine.v1";

export type ShrineSave = {
  bestScore: number;
  bestMoves: number | null;
  completedPuzzles: number;
  achievements: AchievementId[];
  lastStars: number;
  bestSprint: number;
  bestEndless: number;
  bestExtreme: number;
  extremeUnlocked: boolean;
};

const EMPTY: ShrineSave = {
  bestScore: 0,
  bestMoves: null,
  completedPuzzles: 0,
  achievements: [],
  lastStars: 0,
  bestSprint: 0,
  bestEndless: 0,
  bestExtreme: 0,
  extremeUnlocked: false,
};

export function loadShrineSave(): ShrineSave {
  if (typeof window === "undefined") return { ...EMPTY, achievements: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY, achievements: [] };
    const parsed = JSON.parse(raw) as Partial<ShrineSave>;
    return {
      bestScore: typeof parsed.bestScore === "number" ? parsed.bestScore : 0,
      bestMoves: typeof parsed.bestMoves === "number" ? parsed.bestMoves : null,
      completedPuzzles: typeof parsed.completedPuzzles === "number" ? parsed.completedPuzzles : 0,
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      lastStars: typeof parsed.lastStars === "number" ? parsed.lastStars : 0,
      bestSprint: typeof parsed.bestSprint === "number" ? parsed.bestSprint : 0,
      bestEndless: typeof parsed.bestEndless === "number" ? parsed.bestEndless : 0,
      bestExtreme: typeof parsed.bestExtreme === "number" ? parsed.bestExtreme : 0,
      extremeUnlocked: parsed.extremeUnlocked === true,
    };
  } catch {
    return { ...EMPTY, achievements: [] };
  }
}

export function recordShrineResult(input: {
  score: number;
  moves: number;
  stars: number;
  achievements: AchievementId[];
}): ShrineSave {
  const prev = loadShrineSave();
  const next: ShrineSave = {
    bestScore: Math.max(prev.bestScore, input.score),
    bestMoves: prev.bestMoves === null ? input.moves : Math.min(prev.bestMoves, input.moves),
    completedPuzzles: prev.completedPuzzles + 1,
    achievements: Array.from(new Set([...prev.achievements, ...input.achievements])),
    lastStars: input.stars,
    bestSprint: prev.bestSprint,
    bestEndless: prev.bestEndless,
    bestExtreme: prev.bestExtreme,
    extremeUnlocked: prev.extremeUnlocked,
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
  return next;
}

export function recordArcadeRun(kind: "sprint" | "endless" | "extreme", score: number): ShrineSave {
  const prev = loadShrineSave();
  const next: ShrineSave = {
    ...prev,
    bestSprint: kind === "sprint" ? Math.max(prev.bestSprint, score) : prev.bestSprint,
    bestEndless: kind === "endless" ? Math.max(prev.bestEndless, score) : prev.bestEndless,
    bestExtreme: kind === "extreme" ? Math.max(prev.bestExtreme, score) : prev.bestExtreme,
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function unlockExtremePuzzle(): ShrineSave {
  const prev = loadShrineSave();
  const next: ShrineSave = { ...prev, extremeUnlocked: true };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}
