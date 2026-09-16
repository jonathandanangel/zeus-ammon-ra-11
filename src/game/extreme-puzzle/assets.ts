export type ExtremePuzzleAnswers = Record<string, number[]>;

export type ExtremePuzzleResult = {
  rawScore: number;
  total: number;
  ageYears: number;
  ageMonths: number;
  ageBandLabel: string;
  ageReferencedScore: number | null;
};

export async function loadExtremePuzzleAnswers(): Promise<ExtremePuzzleAnswers | null> {
  try {
    const res = await fetch("/extreme-puzzle/answers.json", { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as ExtremePuzzleAnswers;
  } catch {
    return null;
  }
}

export function itemImageUrl(n: number): string {
  return `/extreme-puzzle/items/q${String(n).padStart(2, "0")}.png`;
}
