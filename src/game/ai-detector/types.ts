/** Shared AI-detector types for the multi-scan bench. */

export type DetectorId =
  | "wasitai"
  | "gptzero"
  | "sapling"
  | "winston"
  | "zerogpt"
  | "originality";

export type Band = "human" | "uncertain" | "likely_ai" | "ai";

export type DetectorCard = {
  id: DetectorId;
  name: string;
  blurb: string;
  keyHint: string;
  signupUrl: string;
  docsUrl: string;
};

export const DETECTORS: DetectorCard[] = [
  {
    id: "wasitai",
    name: "WasItAIGenerated",
    blurb: "tropa-2 calibrated 0–100 score + depth bands",
    keyHint: "wai_…",
    signupUrl: "https://wasitaigenerated.com/sign-up",
    docsUrl: "https://wasitaigenerated.com/docs",
  },
  {
    id: "gptzero",
    name: "GPTZero",
    blurb: "HUMAN_ONLY / MIXED / AI_ONLY · sentence highlights",
    keyHint: "GPTZero x-api-key",
    signupUrl: "https://gptzero.me/",
    docsUrl: "https://gptzero.me/developers",
  },
  {
    id: "sapling",
    name: "Sapling",
    blurb: "0–1 AI probability · sentence scores",
    keyHint: "32-char Sapling key",
    signupUrl: "https://sapling.ai/",
    docsUrl: "https://sapling.ai/docs/api/detector/",
  },
  {
    id: "winston",
    name: "Winston AI",
    blurb: "Human score → inverted AI likelihood",
    keyHint: "Bearer token from dev.gowinston.ai",
    signupUrl: "https://dev.gowinston.ai/",
    docsUrl: "https://docs.gowinston.ai/api-reference/v2/ai-content-detection/post",
  },
  {
    id: "zerogpt",
    name: "ZeroGPT",
    blurb: "AI percentage + sentence analysis",
    keyHint: "Bearer YOUR_API_KEY",
    signupUrl: "https://zerogpt.org/api",
    docsUrl: "https://zerogpt.org/api",
  },
  {
    id: "originality",
    name: "Originality.ai",
    blurb: "Scan AI score for SEO / editorial pipelines",
    keyHint: "X-OAI-API-KEY",
    signupUrl: "https://originality.ai/",
    docsUrl: "https://docs.originality.ai/",
  },
];

export type DetectorScanResult = {
  id: DetectorId;
  name: string;
  ok: boolean;
  errorMessage: string;
  status: number | null;
  /** Normalized 0–100 probability the text is AI-generated. */
  aiScore: number;
  band: Band;
  label: string;
  rawClass: string;
  confidence: number;
  detail: string;
};

export type EnsembleConsensus = {
  scanned: number;
  failed: number;
  avgAiScore: number;
  medianAiScore: number;
  humanVotes: number;
  aiVotes: number;
  uncertainVotes: number;
  agreement: "strong_human" | "lean_human" | "split" | "lean_ai" | "strong_ai" | "insufficient";
  summary: string;
};

export type EnsembleInput = {
  content: string;
  keys: Partial<Record<DetectorId, string>>;
  enabled: DetectorId[];
};

export type EnsembleOutput = {
  results: DetectorScanResult[];
  consensus: EnsembleConsensus;
};

export function bandFromAiScore(score: number): Band {
  if (score < 40) return "human";
  if (score < 70) return "uncertain";
  if (score < 90) return "likely_ai";
  return "ai";
}

export function labelFromBand(band: Band): string {
  switch (band) {
    case "human":
      return "Human";
    case "uncertain":
      return "Uncertain";
    case "likely_ai":
      return "Likely AI";
    case "ai":
      return "AI-generated";
  }
}

export function toneForBand(band: Band): string {
  switch (band) {
    case "human":
      return "text-mint";
    case "uncertain":
      return "text-amber";
    case "likely_ai":
      return "text-orange-400";
    case "ai":
      return "text-[#ff4d6d]";
  }
}

export function buildConsensus(results: DetectorScanResult[]): EnsembleConsensus {
  const ok = results.filter((r) => r.ok);
  const failed = results.length - ok.length;
  if (ok.length === 0) {
    return {
      scanned: 0,
      failed,
      avgAiScore: 0,
      medianAiScore: 0,
      humanVotes: 0,
      aiVotes: 0,
      uncertainVotes: 0,
      agreement: "insufficient",
      summary: "No detectors returned a score. Add keys and retry.",
    };
  }
  const scores = ok.map((r) => r.aiScore).sort((a, b) => a - b);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const mid = Math.floor(scores.length / 2);
  const median =
    scores.length % 2 === 0 ? (scores[mid - 1]! + scores[mid]!) / 2 : scores[mid]!;
  let humanVotes = 0;
  let aiVotes = 0;
  let uncertainVotes = 0;
  for (const r of ok) {
    if (r.band === "human") humanVotes += 1;
    else if (r.band === "uncertain") uncertainVotes += 1;
    else aiVotes += 1;
  }
  let agreement: EnsembleConsensus["agreement"] = "split";
  if (humanVotes >= Math.ceil(ok.length * 0.75) && avg < 45) agreement = "strong_human";
  else if (aiVotes >= Math.ceil(ok.length * 0.75) && avg >= 70) agreement = "strong_ai";
  else if (humanVotes > aiVotes && avg < 55) agreement = "lean_human";
  else if (aiVotes > humanVotes && avg >= 55) agreement = "lean_ai";
  else agreement = "split";

  const summaryMap: Record<EnsembleConsensus["agreement"], string> = {
    strong_human: `Strong human consensus across ${ok.length} detectors (avg AI ${avg.toFixed(0)}%).`,
    lean_human: `Lean human — ${humanVotes} human / ${uncertainVotes} uncertain / ${aiVotes} AI (avg ${avg.toFixed(0)}%).`,
    split: `Split signal — treat as uncertain; route to a human reviewer (avg AI ${avg.toFixed(0)}%).`,
    lean_ai: `Lean AI — ${aiVotes} AI / ${uncertainVotes} uncertain / ${humanVotes} human (avg ${avg.toFixed(0)}%).`,
    strong_ai: `Strong AI consensus across ${ok.length} detectors (avg AI ${avg.toFixed(0)}%).`,
    insufficient: "Insufficient data.",
  };

  return {
    scanned: ok.length,
    failed,
    avgAiScore: avg,
    medianAiScore: median,
    humanVotes,
    aiVotes,
    uncertainVotes,
    agreement,
    summary: summaryMap[agreement],
  };
}
