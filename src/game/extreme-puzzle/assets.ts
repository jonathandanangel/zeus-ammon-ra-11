import { BUNDLED_ANSWER_KEY } from "@/game/extreme-puzzle/answer-key";

export type ExtremePuzzleAnswers = Record<string, number[]>;

export type ExtremePuzzleResult = {
  rawScore: number;
  total: number;
  ageYears: number;
  ageMonths: number;
  ageBandLabel: string;
  ageReferencedScore: number | null;
};

function isValidAnswers(data: unknown): data is ExtremePuzzleAnswers {
  if (!data || typeof data !== "object") return false;
  return Object.keys(data as object).length >= 40;
}

/** Prefer local answers.json when present; always fall back to bundled key. */
export async function loadExtremePuzzleAnswers(): Promise<ExtremePuzzleAnswers> {
  try {
    const res = await fetch("/extreme-puzzle/answers.json", { cache: "no-store" });
    if (res.ok) {
      const data: unknown = await res.json();
      if (isValidAnswers(data)) return data;
    }
  } catch {
    /* use bundled */
  }
  return { ...BUNDLED_ANSWER_KEY };
}

/**
 * Neon exact-geometry remasters (same layout as originals, bright cyan ink).
 * Fallback to originals if neon pack is absent.
 */
export function itemImageUrl(n: number): string {
  const pad = String(n).padStart(2, "0");
  return `/extreme-puzzle/items-neon/q${pad}.png`;
}

export function itemImageUrlOriginal(n: number): string {
  const pad = String(n).padStart(2, "0");
  return `/extreme-puzzle/items/q${pad}.png`;
}
