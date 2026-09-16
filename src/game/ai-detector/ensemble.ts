/**
 * Multi-detector ensemble — WasItAI, GPTZero, Sapling, Winston, ZeroGPT, Originality.
 * Keys are supplied per request (session-only) and never hardcoded.
 */
import { createServerFn } from "@tanstack/react-start";
import {
  DETECTORS,
  bandFromAiScore,
  buildConsensus,
  labelFromBand,
  type DetectorId,
  type DetectorScanResult,
  type EnsembleInput,
  type EnsembleOutput,
} from "./types";

function asNumber(v: unknown, fallback = NaN): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function fail(
  id: DetectorId,
  name: string,
  errorMessage: string,
  status: number | null = null,
): DetectorScanResult {
  return {
    id,
    name,
    ok: false,
    errorMessage,
    status,
    aiScore: 0,
    band: "uncertain",
    label: "Error",
    rawClass: "",
    confidence: 0,
    detail: "",
  };
}

function okResult(
  id: DetectorId,
  name: string,
  aiScore: number,
  opts: {
    status: number;
    rawClass?: string;
    confidence?: number;
    detail?: string;
  },
): DetectorScanResult {
  const score = Math.max(0, Math.min(100, aiScore));
  const band = bandFromAiScore(score);
  return {
    id,
    name,
    ok: true,
    errorMessage: "",
    status: opts.status,
    aiScore: score,
    band,
    label: labelFromBand(band),
    rawClass: opts.rawClass ?? "",
    confidence: opts.confidence ?? score / 100,
    detail: opts.detail ?? "",
  };
}

async function fetchJson(
  url: string,
  init: RequestInit,
  timeoutMs = 30_000,
): Promise<{ status: number; json: Record<string, unknown>; text: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    const text = await res.text();
    let json: Record<string, unknown> = {};
    try {
      json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    } catch {
      json = {};
    }
    return { status: res.status, json, text };
  } finally {
    clearTimeout(timer);
  }
}

async function scanWasitai(key: string, content: string): Promise<DetectorScanResult> {
  const name = "WasItAIGenerated";
  try {
    const { status, json } = await fetchJson("https://wasitaigenerated.com/api/v1/detect/text", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ content, mode: "depth", model: "tropa-2" }),
    });
    if (status !== 200) {
      return fail(
        "wasitai",
        name,
        asString(json["message"]) || asString(json["error"]) || `HTTP ${status}`,
        status,
      );
    }
    const score = asNumber(json["score"], NaN);
    if (!Number.isFinite(score)) return fail("wasitai", name, "Missing score in response.", status);
    return okResult("wasitai", name, score, {
      status,
      rawClass: asString(json["verdict"]),
      confidence: asNumber(json["confidence"], score / 100),
      detail: asString((json["analysis"] as Record<string, unknown> | undefined)?.["reasoning"]),
    });
  } catch (e) {
    return fail("wasitai", name, e instanceof Error ? e.message : "Network error");
  }
}

async function scanGptZero(key: string, content: string): Promise<DetectorScanResult> {
  const name = "GPTZero";
  try {
    const { status, json } = await fetchJson("https://api.gptzero.me/v2/predict/text", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ document: content }),
    });
    if (status !== 200) {
      return fail(
        "gptzero",
        name,
        asString(json["error"]) || asString(json["message"]) || `HTTP ${status}`,
        status,
      );
    }
    const docs = json["documents"];
    const doc = Array.isArray(docs) ? (docs[0] as Record<string, unknown> | undefined) : undefined;
    const root = doc ?? json;
    const probs = (root["class_probabilities"] ?? {}) as Record<string, unknown>;
    const aiProb = asNumber(probs["ai"], NaN);
    const completely = asNumber(root["completely_generated_prob"], NaN);
    const predicted = asString(root["predicted_class"] || root["document_classification"]);
    let score = Number.isFinite(aiProb)
      ? aiProb * 100
      : Number.isFinite(completely)
        ? completely * 100
        : NaN;
    if (!Number.isFinite(score)) {
      if (/AI_ONLY/i.test(predicted)) score = 92;
      else if (/MIXED/i.test(predicted)) score = 55;
      else if (/HUMAN/i.test(predicted)) score = 18;
    }
    if (!Number.isFinite(score)) return fail("gptzero", name, "Could not parse GPTZero score.", status);
    const confCat = asString(root["confidence_category"]);
    return okResult("gptzero", name, score, {
      status,
      rawClass: predicted,
      confidence: confCat === "high" ? 0.95 : confCat === "medium" ? 0.7 : 0.5,
      detail: `class_probabilities ai=${asNumber(probs["ai"], 0).toFixed(2)} human=${asNumber(probs["human"], 0).toFixed(2)}`,
    });
  } catch (e) {
    return fail("gptzero", name, e instanceof Error ? e.message : "Network error");
  }
}

async function scanSapling(key: string, content: string): Promise<DetectorScanResult> {
  const name = "Sapling";
  try {
    const { status, json } = await fetchJson("https://api.sapling.ai/api/v1/aidetect", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ key, text: content, sent_scores: true }),
    });
    if (status < 200 || status >= 300) {
      return fail(
        "sapling",
        name,
        asString(json["msg"]) || asString(json["message"]) || `HTTP ${status}`,
        status,
      );
    }
    const score01 = asNumber(json["score"], NaN);
    if (!Number.isFinite(score01)) return fail("sapling", name, "Missing Sapling score.", status);
    return okResult("sapling", name, score01 * 100, {
      status,
      rawClass: score01 >= 0.5 ? "ai" : "human",
      confidence: Math.abs(score01 - 0.5) * 2,
      detail: `score=${score01.toFixed(3)} (0=human … 1=AI)`,
    });
  } catch (e) {
    return fail("sapling", name, e instanceof Error ? e.message : "Network error");
  }
}

async function scanWinston(key: string, content: string): Promise<DetectorScanResult> {
  const name = "Winston AI";
  try {
    const { status, json } = await fetchJson("https://api.gowinston.ai/v2/ai-content-detection", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ text: content, sentences: true, language: "en" }),
    });
    if (status !== 200) {
      return fail(
        "winston",
        name,
        asString(json["description"]) || asString(json["error"]) || `HTTP ${status}`,
        status,
      );
    }
    // Winston human score: high = human. Convert to AI likelihood 0–100.
    const human =
      asNumber(json["score"], NaN) ||
      asNumber(json["human_score"], NaN) ||
      asNumber((json["result"] as Record<string, unknown> | undefined)?.["score"], NaN);
    if (!Number.isFinite(human)) {
      return fail("winston", name, "Missing Winston human score.", status);
    }
    const aiScore = human <= 1 ? (1 - human) * 100 : 100 - human;
    return okResult("winston", name, aiScore, {
      status,
      rawClass: `human_score=${human}`,
      confidence: Math.min(1, Math.abs(aiScore - 50) / 50),
      detail: `Winston human score ${human} → AI ${aiScore.toFixed(1)}`,
    });
  } catch (e) {
    return fail("winston", name, e instanceof Error ? e.message : "Network error");
  }
}

async function scanZeroGpt(key: string, content: string): Promise<DetectorScanResult> {
  const name = "ZeroGPT";
  try {
    const { status, json } = await fetchJson("https://api.zerogpt.org/api/v1/developer/detect", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ text: content }),
    });
    if (status !== 200) {
      return fail(
        "zerogpt",
        name,
        asString(json["message"]) || asString(json["error"]) || `HTTP ${status}`,
        status,
      );
    }
    const data = (json["data"] ?? json) as Record<string, unknown>;
    const pct = asNumber(data["aiPercentage"] ?? data["ai_percentage"] ?? data["fakePercentage"], NaN);
    if (!Number.isFinite(pct)) {
      return fail("zerogpt", name, "Missing ZeroGPT aiPercentage.", status);
    }
    return okResult("zerogpt", name, pct, {
      status,
      rawClass: data["isAI"] ? "ai" : "human",
      confidence: asString(data["confidence"]) === "high" ? 0.9 : 0.65,
      detail: asString(data["confidence"]) ? `confidence=${asString(data["confidence"])}` : "",
    });
  } catch (e) {
    return fail("zerogpt", name, e instanceof Error ? e.message : "Network error");
  }
}

async function scanOriginality(key: string, content: string): Promise<DetectorScanResult> {
  const name = "Originality.ai";
  try {
    const { status, json } = await fetchJson("https://api.originality.ai/api/v1/scan/ai", {
      method: "POST",
      headers: {
        "X-OAI-API-KEY": key,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        content,
        title: "ZEUS multi-scan",
        storeScan: false,
      }),
    });
    if (status !== 200) {
      return fail(
        "originality",
        name,
        asString(json["error"]) || asString(json["message"]) || `HTTP ${status}`,
        status,
      );
    }
    const scoreObj = (json["score"] ?? json["results"] ?? json) as Record<string, unknown>;
    const ai =
      asNumber(scoreObj["ai"], NaN) ||
      asNumber(scoreObj["aiScore"], NaN) ||
      asNumber((scoreObj["original"] as Record<string, unknown> | undefined)?.["ai"], NaN);
    // Originality often returns 0–1
    const aiScore = Number.isFinite(ai) ? (ai <= 1 ? ai * 100 : ai) : NaN;
    if (!Number.isFinite(aiScore)) {
      return fail("originality", name, "Could not parse Originality AI score.", status);
    }
    return okResult("originality", name, aiScore, {
      status,
      rawClass: aiScore >= 50 ? "ai" : "human",
      confidence: Math.min(1, Math.abs(aiScore - 50) / 50),
      detail: `originality ai=${ai}`,
    });
  } catch (e) {
    return fail("originality", name, e instanceof Error ? e.message : "Network error");
  }
}

const SCANNERS: Record<
  DetectorId,
  (key: string, content: string) => Promise<DetectorScanResult>
> = {
  wasitai: scanWasitai,
  gptzero: scanGptZero,
  sapling: scanSapling,
  winston: scanWinston,
  zerogpt: scanZeroGpt,
  originality: scanOriginality,
};

export const runAiDetectorEnsemble = createServerFn({ method: "POST" })
  .inputValidator((input: EnsembleInput) => {
    if (!input || typeof input !== "object") throw new Error("Invalid payload.");
    const content = input.content?.trim() ?? "";
    if (content.length < 80) {
      throw new Error("Paste at least ~50 words (~80+ characters) for reliable multi-scan.");
    }
    if (content.length > 100_000) throw new Error("Text exceeds 100,000 characters.");
    const enabled = (input.enabled ?? []).filter((id): id is DetectorId =>
      DETECTORS.some((d) => d.id === id),
    );
    if (enabled.length === 0) throw new Error("Enable at least one detector.");
    const keys: Partial<Record<DetectorId, string>> = {};
    for (const id of enabled) {
      const k = input.keys?.[id]?.trim() ?? "";
      if (!k) throw new Error(`Missing API key for ${id}.`);
      if (/^paste/i.test(k)) throw new Error(`Replace placeholder key for ${id}.`);
      keys[id] = k;
    }
    return { content, keys, enabled };
  })
  .handler(async ({ data }): Promise<EnsembleOutput> => {
    const jobs = data.enabled.map(async (id) => {
      const key = data.keys[id]!;
      return SCANNERS[id](key, data.content);
    });
    const results = await Promise.all(jobs);
    return { results, consensus: buildConsensus(results) };
  });
