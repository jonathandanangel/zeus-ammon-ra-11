/**
 * Free AI-detector ensemble — no API keys.
 * 1 neural (HC3 RoBERTa via transformers.js) + 5 GPTZero-style stylometric scanners.
 * Evidence only — not as current as commercial GPTZero/WasItAI, but works offline after model cache.
 */
import {
  bandFromAiScore,
  buildConsensus,
  labelFromBand,
  type DetectorScanResult,
  type EnsembleConsensus,
} from "./types";

export type FreeDetectorId =
  | "hc3-roberta"
  | "burstiness"
  | "perplexity-proxy"
  | "lexical"
  | "ngram"
  | "stylometry";

export const FREE_DETECTORS: { id: FreeDetectorId; name: string; blurb: string }[] = [
  {
    id: "hc3-roberta",
    name: "HC3 RoBERTa",
    blurb: "Open neural detector (Hello-SimpleAI / HC3) · runs in-browser",
  },
  {
    id: "burstiness",
    name: "Burstiness",
    blurb: "Sentence-length variance — GPTZero-style human irregularity signal",
  },
  {
    id: "perplexity-proxy",
    name: "Predictability",
    blurb: "Local n-gram surprise proxy (low surprise → more AI-like)",
  },
  {
    id: "lexical",
    name: "Lexical diversity",
    blurb: "Type-token + hapax rates vs human writing norms",
  },
  {
    id: "ngram",
    name: "Repetition",
    blurb: "Repeated phrases / template-like trigrams",
  },
  {
    id: "stylometry",
    name: "Stylometry stack",
    blurb: "Punctuation, hedges, listiness, uniformity blend",
  },
];

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

function ok(
  id: FreeDetectorId,
  name: string,
  aiScore: number,
  detail: string,
  rawClass = "",
): DetectorScanResult {
  const score = clamp(aiScore);
  const band = bandFromAiScore(score);
  return {
    id,
    name,
    ok: true,
    errorMessage: "",
    status: 200,
    aiScore: score,
    band,
    label: labelFromBand(band),
    rawClass,
    confidence: Math.min(1, Math.abs(score - 50) / 50),
    detail,
  };
}

function fail(id: FreeDetectorId, name: string, errorMessage: string): DetectorScanResult {
  return {
    id,
    name,
    ok: false,
    errorMessage,
    status: null,
    aiScore: 0,
    band: "uncertain",
    label: "Error",
    rawClass: "",
    confidence: 0,
    detail: "",
  };
}

function sentencesOf(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function wordsOf(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
}

function mean(xs: number[]) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

function stdev(xs: number[]) {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
}

/** Low burstiness → more uniform sentence lengths → AI-leaning. */
function scanBurstiness(text: string): DetectorScanResult {
  const sents = sentencesOf(text);
  const lengths = sents.map((s) => wordsOf(s).length).filter((n) => n > 0);
  if (lengths.length < 3) {
    return fail("burstiness", "Burstiness", "Need several sentences for burstiness.");
  }
  const cv = stdev(lengths) / Math.max(1, mean(lengths)); // coefficient of variation
  // Humans often CV ~0.35–0.7; very smooth AI prose CV ~0.15–0.35
  const aiScore = clamp(100 - cv * 140);
  return ok(
    "burstiness",
    "Burstiness",
    aiScore,
    `sentence CV=${cv.toFixed(3)} · mean len=${mean(lengths).toFixed(1)} · n=${lengths.length}`,
    `cv=${cv.toFixed(3)}`,
  );
}

/** Character 3-gram surprisal proxy — smoother text scores more AI. */
function scanPerplexityProxy(text: string): DetectorScanResult {
  const norm = text.toLowerCase().replace(/\s+/g, " ").trim();
  if (norm.length < 80) return fail("perplexity-proxy", "Predictability", "Text too short.");
  const grams = new Map<string, number>();
  for (let i = 0; i < norm.length - 2; i++) {
    const g = norm.slice(i, i + 3);
    grams.set(g, (grams.get(g) ?? 0) + 1);
  }
  let surprise = 0;
  let n = 0;
  for (let i = 0; i < norm.length - 2; i++) {
    const g = norm.slice(i, i + 3);
    const p = (grams.get(g) ?? 1) / (norm.length - 2);
    surprise += -Math.log2(p);
    n += 1;
  }
  const avg = surprise / Math.max(1, n);
  // Higher surprise → more human-like; calibrate roughly into 0–100 AI
  const aiScore = clamp(100 - (avg - 4) * 18);
  return ok(
    "perplexity-proxy",
    "Predictability",
    aiScore,
    `avg 3-gram surprisal=${avg.toFixed(2)} bits`,
    `surprisal=${avg.toFixed(2)}`,
  );
}

function scanLexical(text: string): DetectorScanResult {
  const words = wordsOf(text);
  if (words.length < 40) return fail("lexical", "Lexical diversity", "Need ~40+ words.");
  const unique = new Set(words);
  const ttr = unique.size / words.length;
  const hapax = [...unique].filter((w) => words.filter((x) => x === w).length === 1).length;
  const hapaxRate = hapax / words.length;
  // AI often lower TTR/hapax on long formal text
  const aiFromTtr = clamp(100 - ttr * 220);
  const aiFromHapax = clamp(100 - hapaxRate * 280);
  const aiScore = clamp(0.6 * aiFromTtr + 0.4 * aiFromHapax);
  return ok(
    "lexical",
    "Lexical diversity",
    aiScore,
    `TTR=${ttr.toFixed(3)} · hapax=${hapaxRate.toFixed(3)} · types=${unique.size}`,
    `ttr=${ttr.toFixed(3)}`,
  );
}

function scanNgram(text: string): DetectorScanResult {
  const words = wordsOf(text);
  if (words.length < 50) return fail("ngram", "Repetition", "Need ~50+ words.");
  const tri = new Map<string, number>();
  for (let i = 0; i < words.length - 2; i++) {
    const g = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    tri.set(g, (tri.get(g) ?? 0) + 1);
  }
  const repeats = [...tri.values()].filter((c) => c >= 2).length;
  const repeatRatio = repeats / Math.max(1, tri.size);
  const aiScore = clamp(repeatRatio * 400);
  return ok(
    "ngram",
    "Repetition",
    aiScore,
    `repeated trigrams=${repeats}/${tri.size} (${(repeatRatio * 100).toFixed(1)}%)`,
    `repeatRatio=${repeatRatio.toFixed(3)}`,
  );
}

const HEDGES = new Set([
  "however",
  "therefore",
  "furthermore",
  "moreover",
  "additionally",
  "consequently",
  "overall",
  "essentially",
  "notably",
  "importantly",
  "various",
  "numerous",
  "significant",
  "crucial",
  "delve",
  "tapestry",
  "landscape",
  "underscore",
  "multifaceted",
]);

function scanStylometry(text: string): DetectorScanResult {
  const words = wordsOf(text);
  if (words.length < 40) return fail("stylometry", "Stylometry stack", "Need ~40+ words.");
  const hedgeHits = words.filter((w) => HEDGES.has(w)).length;
  const hedgeRate = hedgeHits / words.length;
  const commas = (text.match(/,/g) ?? []).length / Math.max(1, words.length);
  const semis = (text.match(/;/g) ?? []).length;
  const questions = (text.match(/\?/g) ?? []).length;
  const exclaims = (text.match(/!/g) ?? []).length;
  const listMarkers = (text.match(/^\s*[-*•]|\d+\.\s/gm) ?? []).length;
  // AI often: more hedges, fewer ?!, more orderly commas, occasional listiness
  let ai = 40;
  ai += hedgeRate * 900;
  ai += Math.min(20, commas * 80);
  ai += Math.min(10, listMarkers * 4);
  ai -= Math.min(15, questions * 5 + exclaims * 4);
  ai -= Math.min(8, semis * 3);
  const aiScore = clamp(ai);
  return ok(
    "stylometry",
    "Stylometry stack",
    aiScore,
    `hedges=${hedgeHits} · ,rate=${commas.toFixed(3)} · ?!=${questions + exclaims}`,
    `hedgeRate=${hedgeRate.toFixed(3)}`,
  );
}

type Classifier = (
  text: string,
  opts?: { top_k?: number },
) => Promise<Array<{ label: string; score: number }> | { label: string; score: number }>;

let classifierPromise: Promise<Classifier> | null = null;

async function getHc3Classifier(): Promise<Classifier> {
  if (!classifierPromise) {
    classifierPromise = (async () => {
      const { pipeline } = await import("@huggingface/transformers");
      return (await pipeline(
        "text-classification",
        "onnx-community/chatgpt-detector-roberta-ONNX",
      )) as unknown as Classifier;
    })();
  }
  return classifierPromise;
}

async function scanHc3Roberta(text: string): Promise<DetectorScanResult> {
  const name = "HC3 RoBERTa";
  try {
    const clf = await getHc3Classifier();
    // Model context is limited; score head + mid chunks and average.
    const chunks: string[] = [];
    const clean = text.replace(/\s+/g, " ").trim();
    const maxLen = 400;
    if (clean.length <= maxLen) chunks.push(clean);
    else {
      chunks.push(clean.slice(0, maxLen));
      const mid = Math.max(0, Math.floor(clean.length / 2) - maxLen / 2);
      chunks.push(clean.slice(mid, mid + maxLen));
      chunks.push(clean.slice(-maxLen));
    }
    const aiScores: number[] = [];
    let lastLabel = "";
    for (const chunk of chunks) {
      const raw = await clf(chunk, { top_k: 2 });
      const arr = Array.isArray(raw) ? raw : [raw];
      let ai = 0;
      for (const row of arr) {
        const label = String(row.label ?? "");
        lastLabel = label;
        const s = Number(row.score) || 0;
        if (/chatgpt|fake|ai|generated|label_1/i.test(label)) ai = Math.max(ai, s * 100);
        if (/human|real|label_0/i.test(label)) ai = Math.max(ai, (1 - s) * 100);
      }
      // If only one label returned
      if (arr.length === 1) {
        const row = arr[0]!;
        if (/chatgpt|fake|ai|generated|label_1/i.test(String(row.label))) ai = row.score * 100;
        else if (/human|real|label_0/i.test(String(row.label))) ai = (1 - row.score) * 100;
        else ai = row.score * 100;
      }
      aiScores.push(ai);
    }
    const avg = mean(aiScores);
    return ok(
      "hc3-roberta",
      name,
      avg,
      `HC3 RoBERTa in-browser · chunks=${aiScores.length} · label≈${lastLabel}`,
      lastLabel,
    );
  } catch (e) {
    classifierPromise = null;
    return fail(
      "hc3-roberta",
      name,
      e instanceof Error
        ? `Neural model failed: ${e.message}`
        : "Neural model failed to load (network/cache).",
    );
  }
}

export async function runFreeEnsemble(
  content: string,
  onProgress?: (msg: string) => void,
): Promise<{ results: DetectorScanResult[]; consensus: EnsembleConsensus }> {
  const text = content.trim();
  onProgress?.("Running stylometric free detectors…");
  const statistical = [
    scanBurstiness(text),
    scanPerplexityProxy(text),
    scanLexical(text),
    scanNgram(text),
    scanStylometry(text),
  ];
  onProgress?.("Loading HC3 RoBERTa (first run downloads the model)…");
  const neural = await scanHc3Roberta(text);
  const results = [neural, ...statistical];
  const consensus = buildConsensus(results);
  if (consensus.agreement !== "insufficient") {
    consensus.summary = `${consensus.summary} Free mode — no API keys; neural model is HC3-era (ChatGPT-focused).`;
  }
  return { results, consensus };
}
