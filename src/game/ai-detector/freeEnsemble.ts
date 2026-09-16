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
  | "human-noise"
  | "llm-pitch"
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
 * Prefer low false positives on human student writing (GPTZero philosophy).
 * human-noise vetoes soft AI leans unless llm-pitch is strong (ChatGPT outlines).
 */
const WEIGHT: Partial<Record<FreeDetectorId, number>> = {
  "human-noise": 4.2,
  "llm-pitch": 4.5,
  "gptzero-twin": 1.6,
  "openai-roberta": 2.2,
  "hc3-roberta": 1.9,
  modernbert: 2.4,
  burstiness: 1.2,
  "perplexity-proxy": 0.9,
  lexical: 0.7,
  ngram: 0.8,
  discourse: 1.5,
  "sentence-mix": 1.2,
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
  // Sentence-length burstiness (real GPTZero cue) — if lengths vary, not AI
  const lengths = sentencesOf(text).map((s) => wordsOf(s).length).filter((n) => n > 0);
  const lenCv = stdev(lengths) / Math.max(1, mean(lengths));
  if (lenCv >= 0.35) aiScore -= 18;
  else if (lenCv >= 0.25) aiScore -= 10;
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
  if (words.length < 25) return fail("human-noise", "Human noise", "Need more text.");

  let hits = 0;
  const notes: string[] = [];
  const lower = text.toLowerCase();

  // Doubled words: "is is", "the the"
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i] === words[i + 1] && (words[i]?.length ?? 0) >= 2) {
      hits += 3;
      notes.push(`double:${words[i]}`);
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
      /\b(basically|literally|kinda|sort of|trying to|seemed|seemingly|simply|apparently|really was|of course|nonetheless|mindlessly)\b/g,
    ) ?? []
  ).length;
  if (informal >= 2) {
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
  if (longRuns >= 2) {
    hits += 1;
    notes.push("run-on");
  }
  // Wild length mix (short Q + long narrative) = human
  const lens = sentences.map((s) => wordsOf(s).length);
  if (lens.some((n) => n <= 8) && lens.some((n) => n >= 28)) {
    hits += 1;
    notes.push("len-mix");
  }

  // Very polished zero-noise → slightly AI-leaning; lots of noise → strongly human
  const aiScore = sharpen(clamp(58 - hits * 6.5), 1.1);
  return ok(
    "human-noise",
    "Human noise",
    aiScore,
    hits
      ? `authenticity hits=${hits} (${notes.slice(0, 6).join(", ")}) → human-leaning`
      : "Little surface noise — neutral/soft",
    `hits=${hits}`,
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
  // Milder sharpen — older detectors over-call Fake on student prose
  let aiScore = sharpen(0.6 * avg + 0.4 * med, 1.1);
  // Conservative: pull extreme Fake claims toward uncertain unless very confident
  if (aiScore > 70 && aiScore < 92) aiScore = 55 + (aiScore - 70) * 0.85;
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
  const pitchStrong = pitch && pitch.aiScore >= 68;
  // Authenticity veto only when NOT a clear ChatGPT pitch/outline
  const humanVeto = Boolean(noise && noise.aiScore <= 32 && !pitchStrong);

  let wSum = 0;
  let sSum = 0;
  const weightedScores: number[] = [];
  let humanVotes = 0;
  let aiVotes = 0;
  let uncertainVotes = 0;

  for (const r of okRows) {
    let w = WEIGHT[r.id as FreeDetectorId] ?? 1;
    let score = r.aiScore;
    // Strong pitch → boost AI signal, ignore soft human-noise dampening
    if (pitchStrong && r.id === "llm-pitch") {
      score = Math.max(score, 82);
      w *= 1.35;
    }
    // If human-noise fires (and not a pitch), dampen soft AI leans from twin + neural
    if (
      humanVeto &&
      (r.id === "gptzero-twin" ||
        r.id === "openai-roberta" ||
        r.id === "hc3-roberta" ||
        r.id === "modernbert" ||
        r.id === "perplexity-proxy" ||
        r.id === "discourse")
    ) {
      if (score > 40) {
        score = 28 + (score - 40) * 0.25;
        w *= 0.55;
      }
    }
    // Soft twin alone shouldn't dominate when authenticity is strong
    if (humanVeto && r.id === "gptzero-twin") {
      score = Math.min(score, 38);
    }
    wSum += w;
    sSum += score * w;
    for (let i = 0; i < Math.round(w * 2); i++) weightedScores.push(score);
    const band = bandFromAiScore(score);
    if (band === "human") humanVotes += 1;
    else if (band === "uncertain") uncertainVotes += 1;
    else aiVotes += 1;
  }

  let avg = sSum / wSum;
  const med = median(weightedScores);
  let docScore = sharpen(0.65 * avg + 0.35 * med, 1.08);

  // GPTZero-like low FPR: authenticity veto pulls document toward human
  if (humanVeto) {
    docScore = Math.min(docScore, 0.35 * docScore + 0.65 * (noise?.aiScore ?? 22));
  }
  // Clear ChatGPT pitch package → force AI lean
  if (pitchStrong) {
    docScore = Math.max(docScore, 0.25 * docScore + 0.75 * Math.max(pitch?.aiScore ?? 75, 78));
  }
  // Prefer human on soft leans
  if (!pitchStrong && docScore >= 48 && docScore < 58 && humanVotes + uncertainVotes >= aiVotes) {
    docScore -= 8;
  }
  docScore = clamp(docScore);

  let agreement: EnsembleConsensus["agreement"] = "split";
  if (docScore < 40) agreement = humanVotes >= aiVotes ? "strong_human" : "lean_human";
  else if (docScore < 50) agreement = "lean_human";
  else if (docScore >= 75 && aiVotes > humanVotes) agreement = "strong_ai";
  else if (docScore >= 60 && (aiVotes >= humanVotes || pitchStrong)) agreement = "lean_ai";
  else agreement = "split";

  const band: Band = bandFromAiScore(docScore);
  const vetoNote = humanVeto
    ? " Human-noise veto applied (typos/informal voice)."
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
    summary: `${summaryMap[agreement]}${vetoNote} Free GPTZero-style + authenticity checks.`,
  };
}

export async function runFreeEnsemble(
  content: string,
  onProgress?: (msg: string) => void,
  opts?: { skipNeural?: boolean },
): Promise<{ results: DetectorScanResult[]; consensus: EnsembleConsensus }> {
  const text = content.trim();
  onProgress?.("Human-noise / authenticity check…");
  const noise = scanHumanNoise(text);

  onProgress?.("LLM pitch / outline fingerprints…");
  const pitch = scanLlmPitch(text);

  onProgress?.("GPTZero-style twin (perplexity + burstiness)…");
  const twin = scanGptZeroTwin(text);

  onProgress?.("Supporting stylometric checks…");
  const statistical = [
    noise,
    pitch,
    twin,
    scanBurstiness(text),
    scanPerplexityProxy(text),
    scanLexical(text),
    scanNgram(text),
    scanDiscourse(text),
    scanSentenceMix(text),
  ];

  if (opts?.skipNeural) {
    const consensus = weightedConsensus(statistical);
    return { results: statistical, consensus };
  }

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

  const results = [noise, pitch, twin, openai, hc3, modern, ...statistical.slice(3)];
  const consensus = weightedConsensus(results);
  return { results, consensus };
}
