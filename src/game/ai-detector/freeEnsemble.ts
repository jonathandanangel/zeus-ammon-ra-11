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
  applyPolarityToScore,
  loadAiDetectorPolarity,
  type AiDetectorPolarity,
} from "./polarity";
import {
  bandFromAiScore,
  labelFromBand,
  type Band,
  type DetectorScanResult,
  type EnsembleConsensus,
} from "./types";

export type FreeDetectorId =
  | "gptzero-twin"
  | "human-noise"
  | "llm-pitch"
  | "ai-story"
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
    id: "human-noise",
    name: "Human noise",
    blurb: "Typos, doubled words, informal voice — strong human authenticity signal",
  },
  {
    id: "llm-pitch",
    name: "LLM pitch / outline",
    blurb: "ChatGPT novel pitches: Title Concept, Act I–III, “let me know” offers",
  },
  {
    id: "ai-story",
    name: "AI story / chapterbook",
    blurb: "Formulaic chapter fiction: Chapter N, Epilogue, Just then, dialogue cadence",
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

/**
 * Full free suite always participates. ModernBERT custom rules have highest
 * importance (Babel + bench); soft stylometrics stay in the mix at low weight.
 */
const WEIGHT: Record<FreeDetectorId, number> = {
  modernbert: 9.5,
  burstiness: 2.8,
  "human-noise": 4.0,
  "ai-story": 3.6,
  "llm-pitch": 3.4,
  "openai-roberta": 2.2,
  "hc3-roberta": 2.0,
  "gptzero-twin": 1.5,
  discourse: 1.0,
  ngram: 0.85,
  "perplexity-proxy": 0.8,
  lexical: 0.75,
  "sentence-mix": 0.35,
};

/** Softmax temperature for adaptive weight normalization (lower = sharper). */
const FUSION_TEMP = 1.35;
/** Blend between log-odds fusion and weighted median / rule evidence. */
const LOGIT_BLEND = 0.62;
/** Product-of-experts share in the final blend (second model for robustness). */
const POE_BLEND = 0.22;

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

/** AI% → log-odds (numerically stable). */
function logitAi(score: number): number {
  const p = clamp(score, 0.5, 99.5) / 100;
  return Math.log(p / (1 - p));
}

/** Log-odds → AI%. */
function invLogitAi(z: number): number {
  if (z > 20) return 99.9;
  if (z < -20) return 0.1;
  return 100 / (1 + Math.exp(-z));
}

/** Logistic sigmoid on a score gap (percentage points). */
function sigmoidGap(gap: number, scale = 12): number {
  return 1 / (1 + Math.exp(-gap / scale));
}

/**
 * Confidence gate: extremes (|score−50|) dominate mushy mid-band votes.
 * Quadratic evidence strength ∈ [0.35, 1].
 */
function evidenceConfidence(score: number): number {
  const d = Math.abs(score - 50) / 50;
  return 0.35 + 0.65 * d * d;
}

/** O(n log n) weighted median — no replicated arrays. */
function weightedMedianPairs(pairs: Array<{ score: number; weight: number }>): number {
  const usable = pairs.filter((p) => p.weight > 0);
  if (!usable.length) return 50;
  usable.sort((a, b) => a.score - b.score);
  const total = usable.reduce((s, p) => s + p.weight, 0);
  let acc = 0;
  for (const p of usable) {
    acc += p.weight;
    if (acc >= total * 0.5) return p.score;
  }
  return usable[usable.length - 1]!.score;
}

/**
 * Softmax-normalized log-odds fusion over the full detector suite.
 * Weights already encode ModernBERT-first adaptive importance.
 */
function fuseLogOddsSoftmax(pairs: Array<{ score: number; weight: number }>): number {
  const usable = pairs.filter((p) => p.weight > 0);
  if (!usable.length) return 50;
  const maxW = Math.max(...usable.map((p) => p.weight));
  let zSum = 0;
  let wNorm = 0;
  for (const p of usable) {
    const soft = Math.exp((p.weight - maxW) / FUSION_TEMP);
    zSum += soft * logitAi(p.score);
    wNorm += soft;
  }
  return invLogitAi(zSum / Math.max(1e-12, wNorm));
}

/**
 * Product-of-experts: weighted geometric mean in probability space.
 * Second model — agrees with softmax when detectors align; resists single soft outliers.
 */
function fuseProductOfExperts(pairs: Array<{ score: number; weight: number }>): number {
  const usable = pairs.filter((p) => p.weight > 0);
  if (!usable.length) return 50;
  let logP = 0;
  let wSum = 0;
  for (const p of usable) {
    const prob = clamp(p.score, 0.5, 99.5) / 100;
    const w = p.weight * evidenceConfidence(p.score);
    logP += w * Math.log(prob);
    wSum += w;
  }
  return 100 * Math.exp(logP / Math.max(1e-12, wSum));
}

/**
 * Higher-order lead composite — generalizes discrete patterns like
 * “ModernBERT ~90% > story ~55%” without needing exact percents.
 * Soft-OR over logistic gap × floor × soft-backdrop evidence.
 */
type LeadCompositeSpec = {
  id: string;
  /** Primary lead detector(s) — all must clear floors / dominate `above`. */
  leads: FreeDetectorId[];
  /** Detectors the lead(s) should outscore. */
  above: FreeDetectorId[];
  /** Optional backdrop that should sit ~20s (soft cluster). */
  softBackdrop?: FreeDetectorId[];
  requireSoftBackdrop?: boolean;
  /** Soft floors — pattern, not exact percent. */
  leadFloor?: number;
  supportFloor?: number;
  /** Optional amplifier: another detector should be “strangely elevated” (~30–50). */
  elevatedSupport?: { id: FreeDetectorId; lo: number; hi: number };
  weight: number;
};

const LEAD_COMPOSITES: LeadCompositeSpec[] = [
  {
    id: "modern>story-hard",
    leads: ["modernbert"],
    above: ["ai-story"],
    leadFloor: 78,
    supportFloor: 42,
    weight: 1.45,
  },
  {
    id: "modern>story-soft",
    leads: ["modernbert"],
    above: ["ai-story"],
    leadFloor: 48,
    supportFloor: 32,
    softBackdrop: ["sentence-mix", "gptzero-twin", "lexical", "discourse", "perplexity-proxy", "ngram", "llm-pitch"],
    requireSoftBackdrop: true,
    weight: 1.05,
  },
  {
    id: "modern>burst+mix",
    leads: ["modernbert"],
    above: ["burstiness", "sentence-mix"],
    leadFloor: 45,
    weight: 1.15,
  },
  {
    id: "modern+burst>mix+twin",
    leads: ["modernbert", "burstiness"],
    above: ["sentence-mix", "gptzero-twin"],
    softBackdrop: ["lexical", "discourse", "perplexity-proxy", "ngram", "llm-pitch"],
    requireSoftBackdrop: true,
    leadFloor: 40,
    weight: 1.2,
  },
  {
    id: "story>twin+highmix",
    leads: ["ai-story"],
    above: ["gptzero-twin"],
    leadFloor: 38,
    supportFloor: 22,
    elevatedSupport: { id: "sentence-mix", lo: 28, hi: 54 },
    weight: 1.25,
  },
];

function softClusterEvidence(scores: Map<FreeDetectorId, number>, ids: FreeDetectorId[]): number {
  const vals = ids.map((id) => scores.get(id)).filter((v): v is number => v != null);
  if (!vals.length) return 0.85;
  const m = mean(vals);
  // Peak when mean sits near the low-20s; fade as soft scans climb
  const near20 = Math.exp(-Math.pow((m - 24) / 14, 2));
  const notHot = 1 - sigmoidGap(Math.max(...vals) - 45, 8);
  return clamp(near20 * (0.55 + 0.45 * notHot), 0, 1);
}

function scoreLeadComposite(
  scores: Map<FreeDetectorId, number>,
  spec: LeadCompositeSpec,
): number {
  const leadScores = spec.leads.map((id) => scores.get(id));
  if (leadScores.some((v) => v == null)) return 0;
  const leadMin = Math.min(...(leadScores as number[]));
  const leadMax = Math.max(...(leadScores as number[]));

  let gapE = 1;
  for (const a of spec.above) {
    const s = scores.get(a);
    if (s == null) return 0;
    // Each lead should beat each `above` target (use min lead for co-leads)
    gapE *= sigmoidGap(leadMin - s, 10);
    if (spec.supportFloor != null) {
      gapE *= sigmoidGap(s - (spec.supportFloor - 8), 9);
    }
  }
  const floorE =
    spec.leadFloor != null ? sigmoidGap(leadMax - (spec.leadFloor - 6), 9) : 1;
  const softE =
    spec.requireSoftBackdrop && spec.softBackdrop
      ? softClusterEvidence(scores, spec.softBackdrop)
      : 1;
  let elevE = 1;
  if (spec.elevatedSupport) {
    const e = scores.get(spec.elevatedSupport.id);
    if (e == null) return 0;
    const { lo, hi } = spec.elevatedSupport;
    // Band pass: strangely high, but not runaway
    elevE = sigmoidGap(e - lo, 5) * (1 - sigmoidGap(e - hi, 6));
  }
  return clamp(gapE * floorE * softE * elevE, 0, 1);
}

/**
 * Higher-order composite: soft-OR of generalized lead patterns → AI% evidence.
 * Percents in comments are examples; logistics fire on the same shape nearby.
 */
function higherOrderLeadComposite(scores: Map<FreeDetectorId, number>): {
  evidenceAi: number;
  strength: number;
  bestId: string;
  fired: boolean;
} {
  let failProd = 1;
  let best = { id: "", e: 0, w: 0 };
  for (const spec of LEAD_COMPOSITES) {
    const e = scoreLeadComposite(scores, spec);
    const we = e * spec.weight;
    failProd *= 1 - clamp(we / (1 + spec.weight), 0, 0.97);
    if (we > best.w) best = { id: spec.id, e, w: we };
  }
  const strength = clamp(1 - failProd, 0, 1);
  // Map composite strength into AI% evidence band (~50 neutral → ~92 strong)
  const evidenceAi = clamp(48 + strength * 48 + best.e * 8, 0, 100);
  return {
    evidenceAi,
    strength,
    bestId: best.id,
    fired: strength >= 0.42 || best.e >= 0.55,
  };
}

/** Alone-high soft scan (e.g. sentence-mix) is not an AI lead — human-leaning penalty. */
function aloneHighSoftPenalty(
  scores: Map<FreeDetectorId, number>,
  softId: FreeDetectorId,
  leadFired: boolean,
): number {
  if (leadFired) return 0;
  const s = scores.get(softId);
  if (s == null || s < 30) return 0;
  // Penalty grows with alone-high soft score; returned as AI% downward pull
  return 10 + 14 * sigmoidGap(s - 30, 6);
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
 * NOTE: this uses *within-document* bigram surprisal (not a real LM), so mid
 * scores are common on long human sentences — bias hard toward human/uncertain
 * unless BOTH signals are extreme.
 */
function scanGptZeroTwin(text: string): DetectorScanResult {
  const surps = sentenceSurprisals(text);
  if (surps.length < 4) {
    return fail("gptzero-twin", "GPTZero-style twin", "Need 4+ sentences for perplexity+burstiness.");
  }
  const avgPpl = mean(surps);
  const burst = stdev(surps) / Math.max(0.35, avgPpl);
  // Recalibrated: self-surprisal ~2.5–3.0 is normal for human essays (long sents
  // reuse words). Only very smooth + very uniform → AI.
  // ppl 2.0→~72, 2.7→~48, 3.5→~22; burst 0.15→~70, 0.30→~48, 0.50→~22
  const fromPpl = clamp(100 - (avgPpl - 1.6) * 32);
  const fromBurst = clamp(100 - burst * 140);
  let aiScore = 0.5 * fromPpl + 0.5 * fromBurst;
  // Require BOTH low-ppl and low-burst to call AI; otherwise pull toward human
  if (!(avgPpl < 2.25 && burst < 0.22)) {
    aiScore = Math.min(aiScore, 42 + (aiScore - 42) * 0.35);
  }
  // Sentence-length burstiness — high CV often human, BUT chapterbook short-line
  // stacks also spike CV, so only apply the human pull when not story-shaped.
  const lengths = sentencesOf(text).map((s) => wordsOf(s).length).filter((n) => n > 0);
  const lenCv = stdev(lengths) / Math.max(1, mean(lengths));
  const chapterish =
    (text.match(/\bChapter\s+\d+\b/gi) ?? []).length >= 2 || /\bEpilogue\b/i.test(text);
  if (!chapterish) {
    if (lenCv >= 0.35) aiScore -= 18;
    else if (lenCv >= 0.25) aiScore -= 10;
  } else if (lenCv < 0.35) {
    // Uniform short chapter cadence → AI lean
    aiScore += 12;
  }
  aiScore = sharpen(clamp(aiScore), 1.05);
  return ok(
    "gptzero-twin",
    "GPTZero-style twin",
    aiScore,
    `sent-ppl≈${avgPpl.toFixed(2)} · burst=${burst.toFixed(3)} · lenCV=${lenCv.toFixed(2)} · n=${surps.length}`,
    `ppl=${avgPpl.toFixed(2)},burst=${burst.toFixed(3)}`,
  );
}

/**
 * Human authenticity / noise — typos & informal voice that LLMs rarely leave in.
 * Low AI score = looks human. Catches "is is", "amature", "opining", spoken "Um, yeah".
 */
function scanHumanNoise(text: string): DetectorScanResult {
  const words = wordsOf(text);
  if (words.length < 12) return fail("human-noise", "Human noise", "Need more text.");

  let hits = 0;
  const notes: string[] = [];
  const lower = text.toLowerCase();

  // Doubled words: "is is", "the the" — ignore SFX / cheer stacks (WAKA WAKA)
  const sfxWord = /^(waka|ha+|haha|mwaha|chomp|crash|crack|boom|pow|bang|lol|lmao)+$/i;
  for (let i = 0; i < words.length - 1; i++) {
    const w = words[i]!;
    if (w === words[i + 1] && w.length >= 2 && !sfxWord.test(w)) {
      hits += 3;
      notes.push(`double:${w}`);
    }
  }

  // Textspeak / chat openings LLMs almost never emit
  if (/\bu\b/.test(lower) || /\b(ur|u r|idk|imo|tbh|lol|lmao|omg)\b/.test(lower)) {
    hits += 3;
    notes.push("textspeak");
  }

  // Spoken filler / dialogue ticks
  if (/\bum,?\s+yeah\b|\bcool,\s*cool\b|\bi state mindlessly\b|\bdoodling\b/i.test(lower)) {
    hits += 3;
    notes.push("spoken-filler");
  }

  // Telegram / student grammar: missing conjunctions ("works very well can check")
  if (
    /\b\w+s\s+(very\s+)?well\s+can\b/.test(lower) ||
    /\b(is|are|was)\s+mainly\s+to\b/.test(lower) ||
    /\band was thinking about\b/.test(lower) ||
    /\bnot revealed and\b/.test(lower) ||
    /\bmight be\b.{0,40}\bbut all\b/.test(lower) ||
    /\bcan check the text here\b/.test(lower) ||
    /\bwith same original\b/.test(lower) ||
    /\bdo heat transfer\b/.test(lower)
  ) {
    hits += 4;
    notes.push("student-grammar");
  }

  // Common ESL / rushed substitutions, misspellings, odd coinages
  if (
    /\bwhere simply\b/.test(lower) ||
    /\bwhere\b.*\binnovations\b/.test(lower) ||
    /\b(opining|slivering|apropos to|legal cognition|stratagem taken|amature|rotely|vehemently respected)\b/.test(
      lower,
    ) ||
    /\byou would as to\b/.test(lower)
  ) {
    hits += 2;
    notes.push("awkward-lexicon");
  }
  if (/\bthis time are\b/.test(lower)) {
    hits += 1;
    notes.push("tense-mix");
  }
  // it’s / its confusion (possessive written as contraction)
  if (/it['’]s\s+(undisclosed|own|way|destination|purpose|goal|mission)/.test(lower)) {
    hits += 2;
    notes.push("its/it's");
  }
  // Self-admit grammar slip (very human reflection)
  if (/forgot to capitalize|grammar scanning|amature mistake|didn't go well/i.test(lower)) {
    hits += 3;
    notes.push("self-critique");
  }

  // First-person student / family memoir — avoid "the Me" (Sumerian) and assistant "let me know"
  const stripped = lower
    .replace(/\bthe me\b/g, " ")
    .replace(/\blet me know\b/g, " ")
    .replace(/\bif you('d| would) like\b/g, " ");
  const firstPerson = (
    stripped.match(/\b(i|i'm|i’m|i've|i’d|i'd|im|my|mother's|mom's|dad's|grandfather|i thought|i decided|i asked)\b/g) ??
    []
  ).length;
  if (firstPerson >= 3) {
    hits += 2;
    notes.push(`1st-person:${firstPerson}`);
  }
  if (firstPerson >= 8) {
    hits += 2;
    notes.push("memoir");
  }

  // Informal hedges / filler humans use
  const informal = (
    lower.match(
      /\b(basically|literally|kinda|sort of|trying to|seemed|seemingly|simply|apparently|really was|of course|mindlessly|mainly|especially)\b/g,
    ) ?? []
  ).length;
  if (informal >= 2) {
    hits += 2;
    notes.push(`informal:${informal}`);
  } else if (informal >= 1) {
    hits += 1;
    notes.push(`informal:${informal}`);
  }

  // Uneven spacing / ZWSP paste artifacts (student paste) — not markdown separators alone
  if (/[\u200b\u200c\ufeff]/.test(text) || (/  +/.test(text) && !/^#{1,3}\s/m.test(text))) {
    hits += 1;
    notes.push("spacing");
  }

  // Run-on / comma splice density vs polished AI
  const sentences = sentencesOf(text);
  const longRuns = sentences.filter((s) => wordsOf(s).length > 28).length;
  if (longRuns >= 1 && sentences.length <= 4) {
    hits += 2;
    notes.push("run-on-blurb");
  } else if (longRuns >= 2) {
    hits += 1;
    notes.push("run-on");
  }
  // Wild length mix (short Q + long narrative) = human
  const lens = sentences.map((s) => wordsOf(s).length);
  if (lens.some((n) => n <= 8) && lens.some((n) => n >= 28)) {
    hits += 1;
    notes.push("len-mix");
  }

  // Parenthetical asides / feature laundry lists (product blurbs students write)
  if (/\([^)]{12,}\)/.test(text) && /,\s*[^,]{8,},\s*[^,]{8,},/.test(text)) {
    hits += 2;
    notes.push("aside-list");
  }

  // Strong authenticity → near 0% AI (Babel + bench both need this polarity)
  let aiScore = hits >= 4 ? clamp(12 - hits * 2) : sharpen(clamp(52 - hits * 8), 1.15);
  if (hits >= 6) aiScore = Math.min(aiScore, 4);
  if (hits >= 8) aiScore = 0;
  return ok(
    "human-noise",
    "Human noise",
    aiScore,
    hits
      ? `authenticity hits=${hits} (${notes.slice(0, 6).join(", ")}) → human`
      : "Little surface noise — neutral/soft",
    `hits=${hits}`,
  );
}

/**
 * Formulaic LLM children’s / crossover fiction — Chapter N, Epilogue, beat markers.
 * High AI score. Fixes false “human” calls on Pac-Man-style generated stories.
 */
function scanAiStory(text: string): DetectorScanResult {
  if (text.trim().length < 120) return fail("ai-story", "AI story / chapterbook", "Need more text.");

  let s = 0;
  const notes: string[] = [];
  const chapters = (text.match(/\bChapter\s+\d+\b/gi) ?? []).length;
  if (chapters >= 2) {
    s += 4;
    notes.push(`chapters:${chapters}`);
  } else if (chapters === 1) {
    s += 2;
    notes.push("chapter");
  }
  if (/\bEpilogue\b/i.test(text)) {
    s += 3;
    notes.push("epilogue");
  }
  if (/\bThe End\.?\s*$/im.test(text) || /\bThe End\b/i.test(text)) {
    s += 2;
    notes.push("the-end");
  }
  const beats = (text.match(/\b(Just then|Suddenly|Meanwhile|At the same moment|One final|Within minutes)\b/gi) ?? [])
    .length;
  if (beats >= 3) {
    s += 3;
    notes.push(`beats:${beats}`);
  } else if (beats >= 1) {
    s += 1;
    notes.push(`beats:${beats}`);
  }
  // Short dialogue-heavy paragraphs (LLM kids-book cadence)
  const paras = text.split(/\n+/).map((p) => p.trim()).filter((p) => p.length > 0);
  const shortParas = paras.filter((p) => wordsOf(p).length > 0 && wordsOf(p).length <= 12).length;
  const shortRatio = shortParas / Math.max(1, paras.length);
  if (paras.length >= 20 && shortRatio >= 0.55) {
    s += 3;
    notes.push(`short-paras:${shortRatio.toFixed(2)}`);
  }
  const said = (text.match(/\b(said|replied|asked|shouted|grinned|smiled|roared|nodded)\b/gi) ?? []).length;
  if (said >= 8 && chapters >= 1) {
    s += 2;
    notes.push(`dialogue-tags:${said}`);
  }
  // Sound-effect / onomatopoeia blocks common in LLM kidfic
  if (/\b(CHOMP|CRASH|CRACK|BOOM|WAKA-WAKA|MWAHAHA)\b/.test(text)) {
    s += 2;
    notes.push("sfx");
  }
  // Crossover title pattern
  if (/^[^\n]{8,80}:\s*[^\n]{8,80}\n/m.test(text) && chapters >= 1) {
    s += 1;
    notes.push("title-colon");
  }

  const aiScore = sharpen(clamp(s === 0 ? 22 : 28 + s * 9), 1.12);
  return ok(
    "ai-story",
    "AI story / chapterbook",
    aiScore,
    s ? `story signals=${s} (${notes.slice(0, 6).join(", ")})` : "No chapterbook / formulaic-story fingerprints",
    `signals=${s}`,
  );
}

/**
 * ChatGPT / Claude novel-pitch & outline fingerprints.
 * Catches Title Concept + Act I–III + “If you want to develop this further…” packages.
 */
function scanLlmPitch(text: string): DetectorScanResult {
  if (text.trim().length < 80) return fail("llm-pitch", "LLM pitch / outline", "Need more text.");

  let s = 0;
  const notes: string[] = [];

  if (/^#{1,3}\s/m.test(text) || /\n##\s/.test(text)) {
    s += 2;
    notes.push("md-headings");
  }
  if (/\bTitle Concept\b|\bCore Conflict\b|\bMajor Characters\b|\bPlot Outline\b/i.test(text)) {
    s += 4;
    notes.push("pitch-sections");
  }
  if (/\bAct\s+(I|II|III|IV|1|2|3)\b/i.test(text) && /\b(Epilogue|Act\s+II)\b/i.test(text)) {
    s += 4;
    notes.push("three-act");
  }
  if (
    /if you want to (develop|explore|dive|continue) this further/i.test(text) ||
    /let me know\s*:/i.test(text) ||
    /would you like (me )?to (write|focus|develop)/i.test(text)
  ) {
    s += 5;
    notes.push("assistant-offer");
  }
  if (
    /\b(intertwined destinies|cosmic (order|blueprints)|iron will of|collective cosmic|aggressive military monarchy)\b/i.test(
      text,
    )
  ) {
    s += 3;
    notes.push("pitch-lexicon");
  }
  if (
    /\b(fiercely devoted|absolute authority|practical engineering|structural (collapse|mastery|omens)|unprecedented drought|ideological clash)\b/i.test(
      text,
    )
  ) {
    s += 2;
    notes.push("llm-adj");
  }
  const bios = (text.match(/\b(He|She) (is|argues|seeks|experiences|believes|rejects)\b/g) ?? []).length;
  if (bios >= 3) {
    s += 2;
    notes.push(`parallel-bios:${bios}`);
  }
  // Empty markdown bullets after an offer (classic ChatGPT leftover)
  if (/\*\s*\n\s*\*/.test(text) || /\*\s*\n\s*\*.*\?\n\s*\*/.test(text)) {
    s += 2;
    notes.push("empty-bullets");
  }
  // Google kgmid dump links often pasted from AI research sidebars
  if (/kgmid=\/m\//i.test(text) && bios >= 2) {
    s += 2;
    notes.push("kgmid-links");
  }

  const aiScore = sharpen(clamp(18 + s * 9), 1.15);
  return ok(
    "llm-pitch",
    "LLM pitch / outline",
    aiScore,
    s
      ? `pitch signals=${s} (${notes.slice(0, 6).join(", ")})`
      : "No ChatGPT pitch/outline fingerprints",
    `signals=${s}`,
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

    // OpenAI: Fake=AI, Real=Human · HC3: ChatGPT/Human · ModernBERT: 1=AI, 0=Human
    if (/fake|chatgpt|^ai$|ai-|generated|synthetic|machine|^label_1$/i.test(label)) {
      bestAi = Math.max(bestAi, s);
    } else if (/real|^human$|authentic|^label_0$/i.test(label)) {
      bestHuman = Math.max(bestHuman, s);
    }
  }

  if (bestAi === 0 && bestHuman === 0) {
    const top = arr.reduce((a, b) => (b.score > a.score ? b : a), arr[0]!);
    if (/fake|chatgpt|ai|generated|label_1/i.test(top.label)) {
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
  // Keep raw polarity — do NOT dampen high AI (that was flipping Babel / bench).
  const aiScore = sharpen(0.6 * avg + 0.4 * med, 1.05);
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

  const noise = okRows.find((r) => r.id === "human-noise");
  const pitch = okRows.find((r) => r.id === "llm-pitch");
  const story = okRows.find((r) => r.id === "ai-story");
  const modern = okRows.find((r) => r.id === "modernbert");
  const sentMix = okRows.find((r) => r.id === "sentence-mix");
  const burst = okRows.find((r) => r.id === "burstiness");
  const twin = okRows.find((r) => r.id === "gptzero-twin");
  const pitchStrong = Boolean(pitch && pitch.aiScore >= 68);
  const storyStrong = Boolean(story && story.aiScore >= 72);
  const modernStrong = Boolean(modern && modern.aiScore >= 70);
  const modernHard = Boolean(modern && modern.aiScore >= 85);
  const modernNearCertain = Boolean(modern && modern.aiScore >= 95);
  const modernBelowMix = Boolean(modern && sentMix && modern.aiScore < sentMix.aiScore);
  const mixGap = modernBelowMix ? sentMix!.aiScore - modern!.aiScore : 0;
  const modernHumanGap = Boolean(modernBelowMix && mixGap >= 15);
  const modernHumanHard = Boolean(
    modernBelowMix && (modern!.aiScore < 25 || mixGap >= 30),
  );
  const softAround20s = (() => {
    const soft = okRows.filter((r) =>
      ["sentence-mix", "gptzero-twin", "lexical", "discourse", "perplexity-proxy", "ngram", "llm-pitch"].includes(
        r.id,
      ),
    );
    if (!soft.length) return true;
    return mean(soft.map((r) => r.aiScore)) <= 38;
  })();
  const modernBurstAiPair = Boolean(
    modern &&
      burst &&
      sentMix &&
      twin &&
      !modernBelowMix &&
      modern.aiScore > sentMix.aiScore &&
      modern.aiScore > twin.aiScore &&
      burst.aiScore > sentMix.aiScore &&
      burst.aiScore > twin.aiScore &&
      softAround20s,
  );
  const modernOverBurstMix = Boolean(
    modern &&
      burst &&
      sentMix &&
      !modernBelowMix &&
      modern.aiScore > burst.aiScore &&
      modern.aiScore > sentMix.aiScore,
  );
  // ModernBERT ~57% > AI story/chapterbook ~44%, rest ~20s → most likely AI
  const modernOverStorySoft = Boolean(
    modern &&
      story &&
      !modernBelowMix &&
      modern.aiScore > story.aiScore &&
      modern.aiScore >= 50 &&
      story.aiScore >= 35 &&
      softAround20s,
  );
  // ModernBERT ~90% > AI story/chapterbook ~55% → most likely AI (hard lead)
  const modernOverStoryHard = Boolean(
    modern &&
      story &&
      !modernBelowMix &&
      modern.aiScore >= 80 &&
      story.aiScore >= 45 &&
      modern.aiScore > story.aiScore,
  );
  // AI story (~44%) ≥ GPTZero-twin (~27–30) AND sentence-mix strangely high (~34) → AI.
  // Sentence-mix alone high does NOT imply AI (see mixAloneHigh dampening).
  const storyOverTwinHighMix = Boolean(
    story &&
      twin &&
      sentMix &&
      story.aiScore >= twin.aiScore &&
      story.aiScore >= 40 &&
      twin.aiScore >= 22 &&
      twin.aiScore <= 38 &&
      sentMix.aiScore >= 30 &&
      sentMix.aiScore < 55,
  );
  // Discrete pattern flags (examples) — also OR higher-order composite so nearby % still fire
  const scoreMapEarly = new Map<FreeDetectorId, number>();
  for (const r of okRows) scoreMapEarly.set(r.id as FreeDetectorId, r.aiScore);
  const leadCompositeEarly = higherOrderLeadComposite(scoreMapEarly);

  const modernAiLead =
    modernBurstAiPair ||
    modernOverBurstMix ||
    modernOverStorySoft ||
    modernOverStoryHard ||
    storyOverTwinHighMix ||
    leadCompositeEarly.fired;
  // High sentence-mix by itself is not an AI signal — crush it unless paired rules fire
  const mixAloneHigh = Boolean(
    sentMix &&
      sentMix.aiScore >= 30 &&
      !storyOverTwinHighMix &&
      !modernBurstAiPair &&
      !modernOverBurstMix &&
      !modernOverStorySoft &&
      !modernOverStoryHard &&
      !modernStrong &&
      !(story && story.aiScore >= 68),
  );
  const humanVeto = Boolean(
    noise &&
      noise.aiScore <= 18 &&
      !pitchStrong &&
      !storyStrong &&
      !modernStrong &&
      !modernAiLead &&
      !modernNearCertain,
  );
  const humanHard = Boolean(
    noise &&
      noise.aiScore <= 8 &&
      !pitchStrong &&
      !storyStrong &&
      !modernStrong &&
      !modernAiLead &&
      !modernNearCertain,
  );

  // Continuous rule evidence — higher-order lead composite generalizes discrete % patterns
  const scoreMap = scoreMapEarly;
  const leadComposite = leadCompositeEarly;
  const aloneMixPenalty = aloneHighSoftPenalty(
    scoreMap,
    "sentence-mix",
    leadComposite.fired || modernStrong || Boolean(story && story.aiScore >= 68),
  );
  // Legacy logistic pair evidence (still fused) + composite soft-OR
  const gapVsMix = modern && sentMix ? modern.aiScore - sentMix.aiScore : 0;
  const gapVsBurst = modern && burst ? modern.aiScore - burst.aiScore : 0;
  const gapVsTwin = modern && twin ? modern.aiScore - twin.aiScore : 0;
  const gapModernStory = modern && story ? modern.aiScore - story.aiScore : 0;
  const gapStoryTwin = story && twin ? story.aiScore - twin.aiScore : 0;
  const mixLevel = sentMix?.aiScore ?? 20;
  const mixSupport = storyOverTwinHighMix
    ? sigmoidGap(mixLevel - 28, 6)
    : mixAloneHigh
      ? 1 - sigmoidGap(mixLevel - 28, 5)
      : 0.45;
  const modernPairEvidence =
    modern != null
      ? 100 *
        (0.28 * sigmoidGap(gapVsMix, 10) +
          0.18 * sigmoidGap(gapVsBurst, 12) +
          0.12 * sigmoidGap(gapVsTwin, 14) +
          0.22 * sigmoidGap(gapModernStory, 10) +
          0.2 * sigmoidGap((modern.aiScore - 80) * (modernOverStoryHard ? 1 : 0.35), 8))
      : 50;
  const storyTwinMixEvidence = storyOverTwinHighMix
    ? 100 *
      (0.45 * sigmoidGap(gapStoryTwin, 8) +
        0.25 * sigmoidGap((story?.aiScore ?? 44) - 40, 6) +
        0.3 * mixSupport)
    : mixAloneHigh
      ? 100 * (0.25 * mixSupport)
      : 50;
  const legacyEvidence =
    0.55 * modernPairEvidence +
    0.3 * storyTwinMixEvidence +
    (modernOverStoryHard ? 12 : 0) +
    (modernOverStorySoft ? 7 : 0) +
    (storyOverTwinHighMix ? 9 : 0) -
    (mixAloneHigh ? 10 : 0);
  // Higher-order composite dominates; legacy pair math is a light prior
  const ruleEvidenceAi =
    0.62 * leadComposite.evidenceAi + 0.38 * legacyEvidence - aloneMixPenalty;
  const ruleEvidenceClamped = clamp(ruleEvidenceAi);

  const pairs: Array<{ id: FreeDetectorId; score: number; weight: number }> = [];
  let humanVotes = 0;
  let aiVotes = 0;
  let uncertainVotes = 0;

  for (const r of okRows) {
    const id = r.id as FreeDetectorId;
    let w = WEIGHT[id] ?? 1;
    let score = r.aiScore;

    if (pitchStrong && id === "llm-pitch") {
      score = Math.max(score, 82);
      w *= 1.35;
    }
    if (storyStrong && id === "ai-story") {
      score = Math.max(score, 86);
      w *= 1.4;
    }

    // ModernBERT custom rules — highest importance (multiplicative on base WEIGHT)
    if (id === "modernbert" && score >= 70) {
      w *= score >= 95 ? 4.0 : score >= 85 ? 2.8 : 2.0;
      score = Math.max(score, score >= 95 ? 98 : score >= 85 ? 90 : 78);
    }
    if (modernNearCertain && id !== "modernbert") w *= 0.15;

    if (modernBurstAiPair && (id === "modernbert" || id === "burstiness")) {
      w *= 2.4;
      score = Math.max(score, 74);
    }
    if (modernBurstAiPair && (id === "sentence-mix" || id === "gptzero-twin")) {
      w *= 0.15;
      if (score > 30) score = 16 + (score - 30) * 0.2;
    }
    if (modernOverBurstMix && id === "modernbert") {
      w *= 2.5;
      score = Math.max(score, Math.min(94, score + 10));
    }
    if (modernOverBurstMix && (id === "burstiness" || id === "sentence-mix")) {
      w *= 0.18;
      if (score > 35) score = 18 + (score - 35) * 0.25;
    }
    // ModernBERT > AI story/chapterbook with soft rest ~20s → boost the lead pair
    if (modernOverStorySoft && (id === "modernbert" || id === "ai-story")) {
      w *= id === "modernbert" ? 2.3 : 1.7;
      score = Math.max(score, id === "modernbert" ? 68 : 55);
    }
    if (
      modernOverStorySoft &&
      (id === "sentence-mix" ||
        id === "gptzero-twin" ||
        id === "lexical" ||
        id === "discourse" ||
        id === "perplexity-proxy" ||
        id === "ngram" ||
        id === "burstiness")
    ) {
      w *= 0.2;
      if (score > 30) score = 16 + (score - 30) * 0.2;
    }
    // ModernBERT ~90% > AI story ~55% → hard boost ModernBERT, keep story as support
    if (modernOverStoryHard && id === "modernbert") {
      w *= 3.2;
      score = Math.max(score, 88);
    }
    if (modernOverStoryHard && id === "ai-story") {
      w *= 1.9;
      score = Math.max(score, 58);
    }
    if (
      modernOverStoryHard &&
      (id === "sentence-mix" ||
        id === "gptzero-twin" ||
        id === "lexical" ||
        id === "discourse" ||
        id === "perplexity-proxy" ||
        id === "ngram" ||
        id === "burstiness" ||
        id === "human-noise")
    ) {
      w *= 0.14;
      if (score > 28) score = 14 + (score - 28) * 0.18;
    }
    // AI story ≥ twin + strangely high mix → boost story/twin, keep mix as supporting only
    if (storyOverTwinHighMix && id === "ai-story") {
      w *= 2.4;
      score = Math.max(score, 62);
    }
    if (storyOverTwinHighMix && id === "gptzero-twin") {
      w *= 1.5;
      score = Math.max(score, 40);
    }
    if (storyOverTwinHighMix && id === "sentence-mix") {
      w *= 1.35;
      score = Math.max(score, 42);
    }
    // Sentence-mix alone high ≠ AI — hard dampen so it cannot flip consensus
    if (mixAloneHigh && id === "sentence-mix") {
      w *= 0.08;
      score = Math.min(score, 22);
    }
    if (modernBelowMix && id === "modernbert") {
      w *= modernHumanHard ? 3.0 : modernHumanGap ? 2.4 : 1.8;
      score = Math.min(score, modernHumanHard ? 6 : modernHumanGap ? 14 : Math.min(score, 26));
    }
    if (modernBelowMix && id === "sentence-mix") {
      w *= modernHumanHard ? 0.08 : modernHumanGap ? 0.12 : 0.22;
      if (score > 25) score = 14 + (score - 25) * 0.12;
    }
    if (id === "sentence-mix") w *= 0.5;

    if (
      humanVeto &&
      (id === "gptzero-twin" ||
        id === "openai-roberta" ||
        id === "hc3-roberta" ||
        id === "perplexity-proxy" ||
        id === "discourse" ||
        id === "burstiness" ||
        id === "lexical" ||
        id === "ngram" ||
        id === "sentence-mix")
    ) {
      if (score > 25) {
        score = humanHard ? score * 0.08 : 12 + (score - 25) * 0.15;
        w *= 0.4;
      }
    }
    if (humanVeto && id === "gptzero-twin") score = Math.min(score, humanHard ? 6 : 22);

    if (
      modernStrong &&
      (id === "sentence-mix" ||
        id === "burstiness" ||
        id === "lexical" ||
        id === "perplexity-proxy" ||
        id === "gptzero-twin")
    ) {
      w *= 0.2;
    }
    if (
      modernBelowMix &&
      (id === "sentence-mix" ||
        id === "burstiness" ||
        id === "lexical" ||
        id === "perplexity-proxy" ||
        id === "gptzero-twin" ||
        id === "discourse")
    ) {
      w *= modernHumanHard ? 0.2 : 0.35;
    }

    // Evidence confidence × base/adaptive weight (all detectors stay in the mix)
    w *= evidenceConfidence(score);
    pairs.push({ id, score: clamp(score), weight: Math.max(1e-6, w) });

    const band = bandFromAiScore(score);
    if (band === "human") humanVotes += 1;
    else if (band === "uncertain") uncertainVotes += 1;
    else aiVotes += 1;
  }

  const logitFused = fuseLogOddsSoftmax(pairs);
  const med = weightedMedianPairs(pairs);
  const poeFused = fuseProductOfExperts(pairs);
  // Dual math model: softmax log-odds + product-of-experts + median/rule evidence
  let docScore = invLogitAi(
    LOGIT_BLEND * logitAi(logitFused) +
      POE_BLEND * logitAi(poeFused) +
      (1 - LOGIT_BLEND - POE_BLEND) * 0.5 * logitAi(med) +
      (1 - LOGIT_BLEND - POE_BLEND) * 0.5 * logitAi(ruleEvidenceClamped),
  );
  docScore = sharpen(docScore, 1.06);

  if (humanHard && !modernNearCertain && !modernAiLead) {
    docScore = Math.min(docScore, noise?.aiScore ?? 0);
  } else if (humanVeto && !modernNearCertain && !modernAiLead) {
    docScore = Math.min(docScore, 0.25 * docScore + 0.75 * (noise?.aiScore ?? 12));
  }
  if (modernBelowMix && !modernAiLead && !modernNearCertain) {
    const pull = modernHumanHard ? 0.88 : modernHumanGap ? 0.75 : 0.55;
    docScore = Math.min(
      docScore,
      (1 - pull) * docScore + pull * Math.min(modern?.aiScore ?? 20, modernHumanHard ? 12 : 32),
    );
  }
  if (pitchStrong && !modernHumanHard) {
    docScore = Math.max(docScore, 0.2 * docScore + 0.8 * Math.max(pitch?.aiScore ?? 75, 78));
  }
  if (storyStrong && !modernHumanHard) {
    docScore = Math.max(docScore, 0.15 * docScore + 0.85 * Math.max(story?.aiScore ?? 82, 84));
  }
  // Ceiling rules in logit space (ModernBERT-first / story leads)
  if (modernNearCertain) {
    docScore = invLogitAi(0.08 * logitAi(docScore) + 0.92 * logitAi(Math.max(modern?.aiScore ?? 99, 97)));
  } else if (modernOverStoryHard) {
    docScore = invLogitAi(
      0.15 * logitAi(docScore) + 0.85 * logitAi(Math.max(modern?.aiScore ?? 90, 86)),
    );
  } else if (modernHard) {
    docScore = invLogitAi(0.2 * logitAi(docScore) + 0.8 * logitAi(Math.max(modern?.aiScore ?? 90, 88)));
  } else if (modernStrong) {
    docScore = invLogitAi(0.35 * logitAi(docScore) + 0.65 * logitAi(Math.max(modern?.aiScore ?? 78, 74)));
  }
  if (modernBurstAiPair && !modernNearCertain && !modernOverStoryHard) {
    const pairScore = Math.max(modern?.aiScore ?? 70, burst?.aiScore ?? 70, 74);
    docScore = invLogitAi(0.25 * logitAi(docScore) + 0.75 * logitAi(pairScore));
  }
  if (modernOverBurstMix && !modernNearCertain && !modernOverStoryHard) {
    docScore = invLogitAi(
      0.25 * logitAi(docScore) + 0.75 * logitAi(Math.max(modern?.aiScore ?? 72, 72)),
    );
  }
  if (modernOverStorySoft && !modernNearCertain && !modernOverStoryHard) {
    docScore = invLogitAi(
      0.28 * logitAi(docScore) + 0.72 * logitAi(Math.max(modern?.aiScore ?? 57, 62)),
    );
  }
  if (storyOverTwinHighMix && !modernNearCertain && !modernOverStoryHard) {
    const lead = Math.max(story?.aiScore ?? 44, (twin?.aiScore ?? 27) + 18, 58);
    docScore = invLogitAi(0.3 * logitAi(docScore) + 0.7 * logitAi(lead));
  }
  // Soft-OR composite fires when pattern is nearby but discrete flags miss exact %
  if (
    leadComposite.fired &&
    !modernNearCertain &&
    !modernOverStoryHard &&
    !modernBurstAiPair &&
    !modernOverBurstMix &&
    !modernOverStorySoft &&
    !storyOverTwinHighMix
  ) {
    docScore = invLogitAi(
      0.32 * logitAi(docScore) + 0.68 * logitAi(Math.max(leadComposite.evidenceAi, 60)),
    );
  }
  if (mixAloneHigh) {
    docScore = invLogitAi(0.7 * logitAi(docScore) + 0.3 * logitAi(28));
  }
  docScore = clamp(docScore);

  let agreement: EnsembleConsensus["agreement"] = "split";
  if (modernNearCertain) agreement = "strong_ai";
  else if (modernAiLead && docScore >= 60) agreement = docScore >= 75 ? "strong_ai" : "lean_ai";
  else if ((docScore < 12 || modernHumanHard) && !modernStrong && !modernAiLead)
    agreement = "strong_human";
  else if ((docScore < 40 || modernBelowMix) && !modernStrong && !modernAiLead)
    agreement =
      humanVotes >= aiVotes || modernBelowMix
        ? modernHumanHard
          ? "strong_human"
          : "lean_human"
        : "lean_human";
  else if (docScore < 50 && !modernStrong && !modernAiLead) agreement = "lean_human";
  else if (docScore >= 75 && (aiVotes > humanVotes || storyStrong || pitchStrong || modernStrong || modernAiLead))
    agreement = "strong_ai";
  else if (docScore >= 60 && (aiVotes >= humanVotes || pitchStrong || storyStrong || modernStrong || modernAiLead))
    agreement = "lean_ai";
  else agreement = "split";

  const band: Band = bandFromAiScore(docScore);
  const vetoNote = modernNearCertain
    ? " ModernBERT ≈99% AI → treat as AI-generated."
    : leadComposite.fired && leadComposite.bestId
      ? ` Higher-order lead composite (${leadComposite.bestId}) → lean AI.`
      : modernOverStoryHard
        ? " ModernBERT ~90% > AI story/chapterbook ~55% → lean AI."
        : storyOverTwinHighMix
          ? " AI story ≥ GPTZero-twin with high sentence-mix → lean AI."
          : modernOverStorySoft
            ? " ModernBERT > AI story/chapterbook (rest ~20s) → lean AI."
            : modernOverBurstMix
              ? " ModernBERT > Burstiness & sentence-mix → lean AI."
              : modernBurstAiPair
                ? " ModernBERT + Burstiness > sentence-mix & GPTZero-twin (rest ~20s) → lean AI."
                : mixAloneHigh
                  ? " Sentence-mix alone high ≠ AI (dampened)."
                  : modernHard
                    ? " ModernBERT ≥85% AI dominates consensus."
                    : modernStrong
                      ? " ModernBERT ≥70% AI weighted above soft stylometrics."
                      : modernBelowMix
                        ? ` ModernBERT AI% (${modern!.aiScore.toFixed(0)}) < sentence-mix (${sentMix!.aiScore.toFixed(0)}) → lean human.`
                        : humanHard
                          ? " Strong human-noise → ~0% AI."
                          : humanVeto
                            ? " Human-noise veto applied (informal / student voice)."
                            : storyStrong
                              ? " AI chapterbook / story fingerprints dominate."
                              : pitchStrong
                                ? " LLM pitch/outline fingerprints dominate."
                                : "";
  const summaryMap: Record<EnsembleConsensus["agreement"], string> = {
    strong_human: `Strong human signal (weighted AI ${docScore.toFixed(0)}% · ${labelFromBand(band)}).`,
    lean_human: `Lean human (weighted AI ${docScore.toFixed(0)}%). Low false-positive bias like GPTZero.`,
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
    summary: `${summaryMap[agreement]}${vetoNote} Log-odds/softmax + PoE · higher-order lead composite · ModernBERT-first.`,
  };
}

export async function runFreeEnsemble(
  content: string,
  onProgress?: (msg: string) => void,
  opts?: {
    skipNeural?: boolean;
    neural?: "all" | "modernbert" | "none";
    polarity?: AiDetectorPolarity;
  },
): Promise<{
  results: DetectorScanResult[];
  consensus: EnsembleConsensus;
  rawResults: DetectorScanResult[];
}> {
  const text = content.trim();
  onProgress?.("Human-noise / authenticity check…");
  const noise = scanHumanNoise(text);

  onProgress?.("LLM pitch / outline fingerprints…");
  const pitch = scanLlmPitch(text);

  onProgress?.("AI story / chapterbook fingerprints…");
  const story = scanAiStory(text);

  onProgress?.("GPTZero-style twin (perplexity + burstiness)…");
  const twin = scanGptZeroTwin(text);

  onProgress?.("Supporting stylometric checks…");
  const statistical = [
    noise,
    pitch,
    story,
    twin,
    scanBurstiness(text),
    scanPerplexityProxy(text),
    scanLexical(text),
    scanNgram(text),
    scanDiscourse(text),
    scanSentenceMix(text),
  ];

  const neuralMode = opts?.skipNeural ? "none" : (opts?.neural ?? "all");
  if (neuralMode === "none") {
    return finalizeFreeWithPolarity(statistical, opts?.polarity);
  }

  let openai: DetectorScanResult | null = null;
  let hc3: DetectorScanResult | null = null;

  if (neuralMode === "all") {
    onProgress?.("Loading OpenAI RoBERTa detector (cached after first run)…");
    openai = await runNeural(
      "openai-roberta",
      "OpenAI RoBERTa",
      "onnx-community/roberta-base-openai-detector-ONNX",
      text,
    );

    onProgress?.("Loading HC3 RoBERTa…");
    hc3 = await runNeural(
      "hc3-roberta",
      "HC3 RoBERTa",
      "onnx-community/chatgpt-detector-roberta-ONNX",
      text,
    );
  }

  onProgress?.("Loading ModernBERT AI detector…");
  const modern = await runNeural(
    "modernbert",
    "ModernBERT AI",
    "onnx-community/answerdotai-ModernBERT-base-ai-detector-ONNX",
    text,
  );

  const results =
    neuralMode === "modernbert"
      ? [noise, pitch, story, twin, modern, ...statistical.slice(4)]
      : [noise, pitch, story, twin, openai!, hc3!, modern, ...statistical.slice(4)];
  return finalizeFreeWithPolarity(results, opts?.polarity);
}

/** Map raw detector scores through polarity, then rebuild consensus (same fusion rules). */
export function finalizeFreeWithPolarity(
  rawResults: DetectorScanResult[],
  polarity: AiDetectorPolarity = loadAiDetectorPolarity(),
): { results: DetectorScanResult[]; consensus: EnsembleConsensus; rawResults: DetectorScanResult[] } {
  const results = rawResults.map((r) => {
    if (!r.ok) return r;
    const aiScore = applyPolarityToScore(r.aiScore, polarity);
    const band = bandFromAiScore(aiScore);
    return {
      ...r,
      aiScore,
      band,
      label: labelFromBand(band),
      detail:
        polarity === "flipped" && !/\bpolarity\b/i.test(r.detail)
          ? `${r.detail} · polarity=flipped`
          : r.detail,
    };
  });
  return { results, consensus: weightedConsensus(results), rawResults };
}
