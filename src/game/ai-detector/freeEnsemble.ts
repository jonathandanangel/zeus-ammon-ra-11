/**
 * Free AI-detector ensemble — GPTZero-inspired, no API keys.
 *
 * Neural stack (in-browser ONNX via transformers.js):
 *  - HC3 RoBERTa (Hello-SimpleAI)
 *  - OpenAI RoBERTa detector
 *  - ModernBERT AI detector
 *
 * Plus GPTZero-style stylometrics: burstiness, predictability, lexical,
 * repetition, discourse markers, sentence-level variance.
 *
 * Neural votes are weighted higher in consensus (closer to GPTZero behavior).
 */
import {
  bandFromAiScore,
  labelFromBand,
  type Band,
  type DetectorScanResult,
  type EnsembleConsensus,
} from "./types";

export type FreeDetectorId =
  | "gptzero-twin"
  | "openai-roberta"
  | "hc3-roberta"
  | "modernbert"
  | "burstiness"
  | "perplexity-proxy"
  | "lexical"
  | "ngram"
  | "discourse"
  | "sentence-mix";

export const FREE_DETECTORS: { id: FreeDetectorId; name: string; blurb: string }[] = [
  {
    id: "gptzero-twin",
    name: "GPTZero-style twin",
    blurb: "Free perplexity + burstiness composite (same strategy family as GPTZero)",
  },
  {
    id: "openai-roberta",
    name: "OpenAI RoBERTa",
    blurb: "Classic OpenAI detector (ONNX) — strong Fake/Real split",
  },
  {
    id: "hc3-roberta",
    name: "HC3 RoBERTa",
    blurb: "Hello-SimpleAI ChatGPT detector · HC3-trained",
  },
  {
    id: "modernbert",
    name: "ModernBERT AI",
    blurb: "Newer ModernBERT AI-content classifier (ONNX)",
  },
  {
    id: "burstiness",
    name: "Burstiness",
    blurb: "Sentence-length / rhythm irregularity",
  },
  {
    id: "perplexity-proxy",
    name: "Predictability",
    blurb: "Local surprise proxy (smooth ≈ AI, jagged ≈ human)",
  },
  {
    id: "lexical",
    name: "Lexical diversity",
    blurb: "Type-token + hapax vs fluent LLM uniformity",
  },
  {
    id: "ngram",
    name: "Repetition",
    blurb: "Template-like repeated phrases / trigrams",
  },
  {
    id: "discourse",
    name: "LLM discourse",
    blurb: "ChatGPT-isms: however/furthermore/delve/tapestry…",
  },
  {
    id: "sentence-mix",
    name: "Sentence mix",
    blurb: "Per-sentence AI lean variance (mixed vs uniform)",
  },
];

/** Neural + GPTZero-twin dominate; stylometrics support. */
const WEIGHT: Partial<Record<FreeDetectorId, number>> = {
  "gptzero-twin": 3.5,
  "openai-roberta": 3.2,
  "hc3-roberta": 2.6,
  modernbert: 3.0,
  burstiness: 1.2,
  "perplexity-proxy": 1.2,
  lexical: 0.9,
  ngram: 1.0,
  discourse: 1.4,
  "sentence-mix": 1.5,
};

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
    .filter((s) => s.length > 8);
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

function median(xs: number[]) {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1]! + s[mid]!) / 2 : s[mid]!;
}

/** Stretch mid scores away from 50 so consensus is less mushy. */
function sharpen(score: number, power = 1.35): number {
  const x = (clamp(score) - 50) / 50;
  const y = Math.sign(x) * Math.pow(Math.abs(x), 1 / power);
  return clamp(50 + y * 50);
}

function sentenceSurprisals(text: string): number[] {
  const sents = sentencesOf(text);
  const out: number[] = [];
  for (const s of sents) {
    const words = wordsOf(s);
    if (words.length < 4) continue;
    const uni = new Map<string, number>();
    const bi = new Map<string, number>();
    for (const w of words) uni.set(w, (uni.get(w) ?? 0) + 1);
    for (let i = 0; i < words.length - 1; i++) {
      const g = `${words[i]} ${words[i + 1]}`;
      bi.set(g, (bi.get(g) ?? 0) + 1);
    }
    let surprise = 0;
    let n = 0;
    for (let i = 0; i < words.length - 1; i++) {
      const w0 = words[i]!;
      const g = `${w0} ${words[i + 1]}`;
      const p = ((bi.get(g) ?? 0) + 0.5) / ((uni.get(w0) ?? 0) + 0.5 * uni.size);
      surprise += -Math.log2(Math.max(1e-9, p));
      n += 1;
    }
    out.push(surprise / Math.max(1, n));
  }
  return out;
}

/**
 * Classic GPTZero pairing: low average “perplexity” + low burstiness → AI.
 * High / irregular surprisal → human.
 */
function scanGptZeroTwin(text: string): DetectorScanResult {
  const surps = sentenceSurprisals(text);
  if (surps.length < 4) {
    return fail("gptzero-twin", "GPTZero-style twin", "Need 4+ sentences for perplexity+burstiness.");
  }
  const avgPpl = mean(surps);
  const burst = stdev(surps) / Math.max(0.35, avgPpl); // relative burstiness of surprisal
  // Low avgPpl + low burst → AI; map into 0–100
  const fromPpl = clamp(100 - (avgPpl - 2.0) * 24);
  const fromBurst = clamp(100 - burst * 95);
  const aiScore = sharpen(0.58 * fromPpl + 0.42 * fromBurst, 1.3);
  return ok(
    "gptzero-twin",
    "GPTZero-style twin",
    aiScore,
    `sent-ppl≈${avgPpl.toFixed(2)} · burst=${burst.toFixed(3)} · n=${surps.length} (perplexity+burstiness)`,
    `ppl=${avgPpl.toFixed(2)},burst=${burst.toFixed(3)}`,
  );
}

// ——— Stylometric scanners (GPTZero-inspired) ———

function scanBurstiness(text: string): DetectorScanResult {
  const sents = sentencesOf(text);
  const lengths = sents.map((s) => wordsOf(s).length).filter((n) => n > 0);
  if (lengths.length < 4) {
    return fail("burstiness", "Burstiness", "Need 4+ sentences for burstiness.");
  }
  const cv = stdev(lengths) / Math.max(1, mean(lengths));
  // GPTZero insight: humans are bursty; AI is smoother.
  // Map CV: 0.15→~85 AI, 0.45→~40, 0.70→~15
  const aiScore = sharpen(clamp(95 - cv * 115));
  return ok(
    "burstiness",
    "Burstiness",
    aiScore,
    `CV=${cv.toFixed(3)} · mean=${mean(lengths).toFixed(1)}w · σ=${stdev(lengths).toFixed(1)} · n=${lengths.length}`,
    `cv=${cv.toFixed(3)}`,
  );
}

function scanPerplexityProxy(text: string): DetectorScanResult {
  const norm = text.toLowerCase().replace(/\s+/g, " ").trim();
  if (norm.length < 100) return fail("perplexity-proxy", "Predictability", "Text too short.");

  // Word bigram surprisal (better proxy than char 3-gram for “LLM fluency”)
  const words = wordsOf(norm);
  if (words.length < 40) return fail("perplexity-proxy", "Predictability", "Need ~40+ words.");

  const uni = new Map<string, number>();
  const bi = new Map<string, number>();
  for (const w of words) uni.set(w, (uni.get(w) ?? 0) + 1);
  for (let i = 0; i < words.length - 1; i++) {
    const g = `${words[i]} ${words[i + 1]}`;
    bi.set(g, (bi.get(g) ?? 0) + 1);
  }
  let surprise = 0;
  let n = 0;
  for (let i = 0; i < words.length - 1; i++) {
    const w0 = words[i]!;
    const g = `${w0} ${words[i + 1]}`;
    const p = ((bi.get(g) ?? 0) + 0.5) / ((uni.get(w0) ?? 0) + 0.5 * uni.size);
    surprise += -Math.log2(Math.max(1e-9, p));
    n += 1;
  }
  const avg = surprise / Math.max(1, n);
  // Lower conditional surprisal → more predictable → AI-leaning
  // Empirical-ish: ~4–6 human-ish, ~2.5–4 AI-smooth on this crude proxy
  const aiScore = sharpen(clamp(100 - (avg - 2.2) * 22));
  return ok(
    "perplexity-proxy",
    "Predictability",
    aiScore,
    `bigram surprisal=${avg.toFixed(2)} bits/transition`,
    `surprisal=${avg.toFixed(2)}`,
  );
}

function scanLexical(text: string): DetectorScanResult {
  const words = wordsOf(text);
  if (words.length < 40) return fail("lexical", "Lexical diversity", "Need ~40+ words.");
  const unique = new Set(words);
  const ttr = unique.size / words.length;
  // Moving-window TTR (stabilizes long docs)
  const win = Math.min(50, words.length);
  const windowTtrs: number[] = [];
  for (let i = 0; i + win <= words.length; i += Math.max(10, Math.floor(win / 2))) {
    const slice = words.slice(i, i + win);
    windowTtrs.push(new Set(slice).size / slice.length);
  }
  const mtldProxy = mean(windowTtrs.length ? windowTtrs : [ttr]);
  const hapax = [...unique].filter((w) => words.filter((x) => x === w).length === 1).length / words.length;
  // Low diversity → AI
  const aiScore = sharpen(clamp(0.55 * (100 - mtldProxy * 160) + 0.45 * (100 - hapax * 260)));
  return ok(
    "lexical",
    "Lexical diversity",
    aiScore,
    `TTR=${ttr.toFixed(3)} · windowTTR=${mtldProxy.toFixed(3)} · hapax=${hapax.toFixed(3)}`,
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
  const vals = [...tri.values()];
  const repeats = vals.filter((c) => c >= 2).length;
  const maxRep = Math.max(...vals, 1);
  const repeatRatio = repeats / Math.max(1, tri.size);
  const aiScore = sharpen(clamp(repeatRatio * 380 + Math.min(25, (maxRep - 1) * 8)));
  return ok(
    "ngram",
    "Repetition",
    aiScore,
    `repeat tri=${repeats}/${tri.size} · max=${maxRep}`,
    `repeatRatio=${repeatRatio.toFixed(3)}`,
  );
}

const DISCOURSE = [
  "however",
  "therefore",
  "furthermore",
  "moreover",
  "additionally",
  "consequently",
  "nonetheless",
  "overall",
  "essentially",
  "notably",
  "importantly",
  "significantly",
  "various",
  "numerous",
  "crucial",
  "vital",
  "delve",
  "tapestry",
  "landscape",
  "underscore",
  "multifaceted",
  "nuanced",
  "robust",
  "comprehensive",
  "intricate",
  "pivotal",
  "showcase",
  "leverage",
  "utilize",
  "facilitate",
  "in conclusion",
  "it is important to note",
  "in today's world",
  "plays a crucial role",
  "a wide range of",
];

function scanDiscourse(text: string): DetectorScanResult {
  const lower = text.toLowerCase();
  const words = wordsOf(text);
  if (words.length < 40) return fail("discourse", "LLM discourse", "Need ~40+ words.");
  let hits = 0;
  const found: string[] = [];
  for (const phrase of DISCOURSE) {
    if (phrase.includes(" ")) {
      if (lower.includes(phrase)) {
        hits += 1;
        found.push(phrase);
      }
    } else if (words.includes(phrase)) {
      hits += 1;
      found.push(phrase);
    }
  }
  const rate = hits / Math.max(1, words.length / 40);
  const aiScore = sharpen(clamp(28 + hits * 9 + rate * 12));
  return ok(
    "discourse",
    "LLM discourse",
    aiScore,
    hits
      ? `markers=${hits}: ${found.slice(0, 6).join(", ")}${found.length > 6 ? "…" : ""}`
      : "No common LLM discourse markers",
    `hits=${hits}`,
  );
}

function scanSentenceMix(text: string): DetectorScanResult {
  const sents = sentencesOf(text);
  if (sents.length < 5) {
    return fail("sentence-mix", "Sentence mix", "Need 5+ sentences.");
  }
  // Cheap per-sentence AI lean from length uniformity + discourse density
  const scores = sents.map((s) => {
    const w = wordsOf(s);
    const len = w.length;
    let local = 50;
    // Very even mid-length sentences are AI-ish
    if (len >= 12 && len <= 22) local += 12;
    if (len < 6 || len > 35) local -= 14;
    const lower = s.toLowerCase();
    for (const p of DISCOURSE) {
      if (lower.includes(p)) local += 6;
    }
    if (/[!?]/.test(s)) local -= 8;
    return clamp(local);
  });
  const avg = mean(scores);
  const spread = stdev(scores);
  // Uniform high AI lean across sentences → stronger AI; mixed spread → human/mixed
  const aiScore = sharpen(clamp(avg - spread * 0.55));
  return ok(
    "sentence-mix",
    "Sentence mix",
    aiScore,
    `sent AI-lean avg=${avg.toFixed(0)} · σ=${spread.toFixed(1)} · n=${sents.length}`,
    `avg=${avg.toFixed(0)}`,
  );
}

// ——— Neural classifiers ———

type ClfRow = { label: string; score: number };
type Classifier = (text: string, opts?: { top_k?: number }) => Promise<ClfRow[] | ClfRow>;

const clfCache = new Map<string, Promise<Classifier>>();

async function getClassifier(modelId: string): Promise<Classifier> {
  let p = clfCache.get(modelId);
  if (!p) {
    p = (async () => {
      const { pipeline } = await import("@huggingface/transformers");
      return (await pipeline("text-classification", modelId)) as unknown as Classifier;
    })();
    clfCache.set(modelId, p);
  }
  return p;
}

function aiProbFromRows(rows: ClfRow[]): { ai: number; label: string } {
  const arr = rows.length ? rows : [{ label: "Unknown", score: 0.5 }];
  let bestAi = 0;
  let bestHuman = 0;
  let topLabel = arr[0]!.label;

  for (const row of arr) {
    const label = String(row.label ?? "");
    const s = Number(row.score) || 0;
    if (s >= (arr.find((r) => r.label === topLabel)?.score ?? 0)) topLabel = label;

    // OpenAI detector: Fake=AI, Real=Human
    // HC3: ChatGPT / Human
    // ModernBERT: often LABEL_0/LABEL_1 or AI/Human
    if (/fake|chatgpt|ai|generated|synthetic|machine|label_1/i.test(label)) {
      bestAi = Math.max(bestAi, s);
    } else if (/real|human|authentic|label_0/i.test(label)) {
      bestHuman = Math.max(bestHuman, s);
    }
  }

  if (bestAi === 0 && bestHuman === 0) {
    // Unknown label scheme: treat top score as AI if label looks AI-ish, else as human conf
    const top = arr.reduce((a, b) => (b.score > a.score ? b : a), arr[0]!);
    if (/fake|chatgpt|ai|generated|1/i.test(top.label)) {
      return { ai: top.score * 100, label: top.label };
    }
    return { ai: (1 - top.score) * 100, label: top.label };
  }

  if (bestAi > 0 && bestHuman > 0) {
    const sum = bestAi + bestHuman;
    return { ai: (bestAi / sum) * 100, label: topLabel };
  }
  if (bestAi > 0) return { ai: bestAi * 100, label: topLabel };
  return { ai: (1 - bestHuman) * 100, label: topLabel };
}

function chunkText(text: string, maxLen = 360): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return [clean];
  const chunks = [clean.slice(0, maxLen)];
  const mid = Math.max(0, Math.floor(clean.length / 2) - maxLen / 2);
  chunks.push(clean.slice(mid, mid + maxLen));
  chunks.push(clean.slice(-maxLen));
  // Also sample a few full sentences if available
  const sents = sentencesOf(clean);
  if (sents.length >= 3) {
    chunks.push(sents.slice(0, Math.min(3, sents.length)).join(" ").slice(0, maxLen));
    chunks.push(sents.slice(-Math.min(3, sents.length)).join(" ").slice(0, maxLen));
  }
  return [...new Set(chunks.filter((c) => c.length > 40))];
}

async function runNeural(
  id: FreeDetectorId,
  name: string,
  modelId: string,
  text: string,
): Promise<DetectorScanResult> {
  try {
    const clf = await getClassifier(modelId);
    const chunks = chunkText(text);
    const scores: number[] = [];
    let lastLabel = "";
    for (const chunk of chunks) {
      const raw = await clf(chunk, { top_k: 2 });
      const rows = Array.isArray(raw) ? raw : [raw];
      const { ai, label } = aiProbFromRows(rows);
      scores.push(ai);
      lastLabel = label;
    }
    const avg = mean(scores);
    const med = median(scores);
    // Blend mean/median; sharpen so we don't sit at 50 forever
    const aiScore = sharpen(0.65 * avg + 0.35 * med, 1.25);
    return ok(
      id,
      name,
      aiScore,
      `${name} · chunks=${scores.length} · raw≈${avg.toFixed(0)} · label=${lastLabel}`,
      lastLabel,
    );
  } catch (e) {
    clfCache.delete(modelId);
    return fail(
      id,
      name,
      e instanceof Error ? `Model failed: ${e.message}` : "Model failed to load.",
    );
  }
}

function weightedConsensus(results: DetectorScanResult[]): EnsembleConsensus {
  const okRows = results.filter((r) => r.ok);
  const failed = results.length - okRows.length;
  if (!okRows.length) {
    return {
      scanned: 0,
      failed,
      avgAiScore: 0,
      medianAiScore: 0,
      humanVotes: 0,
      aiVotes: 0,
      uncertainVotes: 0,
      agreement: "insufficient",
      summary: "No free detectors returned a score. Check network for first model download.",
    };
  }

  let wSum = 0;
  let sSum = 0;
  const weightedScores: number[] = [];
  let humanVotes = 0;
  let aiVotes = 0;
  let uncertainVotes = 0;

  for (const r of okRows) {
    const w = WEIGHT[r.id as FreeDetectorId] ?? 1;
    wSum += w;
    sSum += r.aiScore * w;
    for (let i = 0; i < Math.round(w * 2); i++) weightedScores.push(r.aiScore);
    if (r.band === "human") humanVotes += 1;
    else if (r.band === "uncertain") uncertainVotes += 1;
    else aiVotes += 1;
  }

  const avg = sSum / wSum;
  const med = median(weightedScores);
  // Final document score: neural-weighted average with slight sharpening
  const docScore = sharpen(0.7 * avg + 0.3 * med, 1.2);

  let agreement: EnsembleConsensus["agreement"] = "split";
  if (docScore < 38 && humanVotes >= aiVotes) agreement = "strong_human";
  else if (docScore < 48 && humanVotes > aiVotes) agreement = "lean_human";
  else if (docScore >= 72 && aiVotes >= humanVotes) agreement = "strong_ai";
  else if (docScore >= 55 && aiVotes > humanVotes) agreement = "lean_ai";
  else agreement = "split";

  const band: Band = bandFromAiScore(docScore);
  const summaryMap: Record<EnsembleConsensus["agreement"], string> = {
    strong_human: `Strong human signal (weighted AI ${docScore.toFixed(0)}% · ${labelFromBand(band)}).`,
    lean_human: `Lean human (weighted AI ${docScore.toFixed(0)}%). GPTZero-style: prefer human unless neural stack flips.`,
    split: `Uncertain / mixed (weighted AI ${docScore.toFixed(0)}%). Route to a human reviewer.`,
    lean_ai: `Lean AI (weighted AI ${docScore.toFixed(0)}%).`,
    strong_ai: `Strong AI signal (weighted AI ${docScore.toFixed(0)}%).`,
    insufficient: "Insufficient data.",
  };

  return {
    scanned: okRows.length,
    failed,
    avgAiScore: docScore,
    medianAiScore: med,
    humanVotes,
    aiVotes,
    uncertainVotes,
    agreement,
    summary: `${summaryMap[agreement]} Free GPTZero-style strategy: perplexity+burstiness twin + neural stack (no API key).`,
  };
}

export async function runFreeEnsemble(
  content: string,
  onProgress?: (msg: string) => void,
): Promise<{ results: DetectorScanResult[]; consensus: EnsembleConsensus }> {
  const text = content.trim();
  onProgress?.("GPTZero-style twin (perplexity + burstiness)…");
  const twin = scanGptZeroTwin(text);

  onProgress?.("Supporting stylometric checks…");
  const statistical = [
    twin,
    scanBurstiness(text),
    scanPerplexityProxy(text),
    scanLexical(text),
    scanNgram(text),
    scanDiscourse(text),
    scanSentenceMix(text),
  ];

  onProgress?.("Loading OpenAI RoBERTa detector (cached after first run)…");
  const openai = await runNeural(
    "openai-roberta",
    "OpenAI RoBERTa",
    "onnx-community/roberta-base-openai-detector-ONNX",
    text,
  );

  onProgress?.("Loading HC3 RoBERTa…");
  const hc3 = await runNeural(
    "hc3-roberta",
    "HC3 RoBERTa",
    "onnx-community/chatgpt-detector-roberta-ONNX",
    text,
  );

  onProgress?.("Loading ModernBERT AI detector…");
  const modern = await runNeural(
    "modernbert",
    "ModernBERT AI",
    "onnx-community/answerdotai-ModernBERT-base-ai-detector-ONNX",
    text,
  );

  const results = [twin, openai, hc3, modern, ...statistical.slice(1)];
  const consensus = weightedConsensus(results);
  return { results, consensus };
}
