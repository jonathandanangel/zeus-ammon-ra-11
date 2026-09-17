/**
 * AI-detector polarity — instant flip when readings look backwards.
 * "flipped" means every AI% becomes (100 − AI%) before consensus / display.
 */

export type AiDetectorPolarity = "standard" | "flipped";

const STORAGE_KEY = "zeus-ai-detector-polarity-v1";

/** Default flipped: human writing was reading as AI (and vice versa). */
export const DEFAULT_AI_DETECTOR_POLARITY: AiDetectorPolarity = "flipped";

export function loadAiDetectorPolarity(): AiDetectorPolarity {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "standard" || raw === "flipped") return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_AI_DETECTOR_POLARITY;
}

export function saveAiDetectorPolarity(polarity: AiDetectorPolarity) {
  try {
    localStorage.setItem(STORAGE_KEY, polarity);
  } catch {
    /* ignore */
  }
}

export function flipAiPercent(score: number): number {
  const n = Number(score);
  if (!Number.isFinite(n)) return 50;
  return Math.max(0, Math.min(100, 100 - n));
}

export function applyPolarityToScore(score: number, polarity: AiDetectorPolarity): number {
  return polarity === "flipped" ? flipAiPercent(score) : score;
}
