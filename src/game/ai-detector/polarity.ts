/**
 * AI-detector polarity — instant flip when readings look backwards.
 * "flipped" means every AI% becomes (100 − AI%) before consensus / display.
 * Shared by AI Detector Free/API and Library of Babel silent polish.
 */

export type AiDetectorPolarity = "standard" | "flipped";

const STORAGE_KEY = "zeus-ai-detector-polarity-v1";
export const AI_DETECTOR_POLARITY_EVENT = "zeus-ai-detector-polarity";

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
  try {
    window.dispatchEvent(
      new CustomEvent(AI_DETECTOR_POLARITY_EVENT, { detail: { polarity } }),
    );
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

/** Subscribe to polarity changes (AI Detector ↔ Babel). Returns unsubscribe. */
export function subscribeAiDetectorPolarity(
  onChange: (polarity: AiDetectorPolarity) => void,
): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<{ polarity?: AiDetectorPolarity }>).detail;
    const p = detail?.polarity ?? loadAiDetectorPolarity();
    onChange(p);
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) onChange(loadAiDetectorPolarity());
  };
  window.addEventListener(AI_DETECTOR_POLARITY_EVENT, handler);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(AI_DETECTOR_POLARITY_EVENT, handler);
    window.removeEventListener("storage", onStorage);
  };
}
