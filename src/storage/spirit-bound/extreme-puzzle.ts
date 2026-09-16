import type { ExtremePuzzleResult } from "@/game/extreme-puzzle/assets";

const KEY = "trianglebound.extremePuzzle.v1";
const MAX_ATTEMPTS = 80;

export type ExtremePuzzleAttempt = ExtremePuzzleResult & {
  at: string; // ISO timestamp
};

export type ExtremePuzzleHistory = {
  attempts: ExtremePuzzleAttempt[];
};

const EMPTY: ExtremePuzzleHistory = { attempts: [] };

export function loadExtremePuzzleHistory(): ExtremePuzzleHistory {
  if (typeof window === "undefined") return { attempts: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { attempts: [] };
    const parsed = JSON.parse(raw) as Partial<ExtremePuzzleHistory>;
    const attempts = Array.isArray(parsed.attempts)
      ? parsed.attempts
          .filter(
            (a): a is ExtremePuzzleAttempt =>
              !!a &&
              typeof a === "object" &&
              typeof a.at === "string" &&
              typeof a.rawScore === "number" &&
              typeof a.total === "number",
          )
          .slice(0, MAX_ATTEMPTS)
      : [];
    return { attempts };
  } catch {
    return { attempts: [] };
  }
}

export function recordExtremePuzzleAttempt(result: ExtremePuzzleResult): ExtremePuzzleHistory {
  const prev = loadExtremePuzzleHistory();
  const entry: ExtremePuzzleAttempt = {
    ...result,
    at: new Date().toISOString(),
  };
  const next: ExtremePuzzleHistory = {
    attempts: [entry, ...prev.attempts].slice(0, MAX_ATTEMPTS),
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
  return next;
}

export function formatAttemptDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
