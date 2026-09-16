/**
 * WasItAIGenerated.com proxy via TanStack Start server function.
 * API key is supplied per request by the user — never hardcoded.
 * Docs: https://wasitaigenerated.com/docs · OpenAPI: /openapi.json
 */
import { createServerFn } from "@tanstack/react-start";

const API_BASE = "https://wasitaigenerated.com";

export type AiVerdict = "human" | "uncertain" | "likely_ai" | "ai";

export type TextSentenceScore = {
  text: string;
  isAI: boolean;
  confidence: number;
  scores: { ai?: number; human?: number };
};

export type TextDetectResult = {
  ok: boolean;
  errorMessage: string;
  status: number | null;
  isAI: boolean;
  confidence: number;
  score: number;
  verdict: AiVerdict | "";
  model: string;
  patterns: string[];
  analysis: { likelihood?: string; reasoning?: string };
  sentences: TextSentenceScore[];
  humanizedHint: string;
  inputAnomalies: Record<string, number> | null;
  subclassProbs: Record<string, number> | null;
};

export type ImageDetectResult = {
  ok: boolean;
  errorMessage: string;
  status: number | null;
  isAI: boolean;
  confidence: number;
  verified: boolean;
  patterns: string[];
  analysis: { likelihood?: string; reasoning?: string };
  provenance: Record<string, unknown> | null;
  c2pa: Record<string, unknown> | null;
  detailed: { scores?: { ai?: number; human?: number }; model?: string } | null;
};

export type TextDetectInput = {
  apiKey: string;
  content: string;
  mode?: "depth";
  model?: "tropa-2" | "tropa-1";
};

export type ImageDetectInput = {
  apiKey: string;
  /** Raw base64 without data: prefix, or with prefix (stripped server-side). */
  imageBase64: string;
  mimeType?: string;
  fileName?: string;
};

function asNumber(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function parseError(json: Record<string, unknown>, status: number): string {
  const message = asString(json["message"]);
  const error = asString(json["error"]);
  const hint = asString(json["hint"]);
  const parts = [error || `HTTP ${status}`, message, hint].filter(Boolean);
  return parts.join(" — ") || `HTTP ${status}`;
}

function emptyTextResult(partial?: Partial<TextDetectResult>): TextDetectResult {
  return {
    ok: false,
    errorMessage: "",
    status: null,
    isAI: false,
    confidence: 0,
    score: 0,
    verdict: "",
    model: "",
    patterns: [],
    analysis: {},
    sentences: [],
    humanizedHint: "",
    inputAnomalies: null,
    subclassProbs: null,
    ...partial,
  };
}

function emptyImageResult(partial?: Partial<ImageDetectResult>): ImageDetectResult {
  return {
    ok: false,
    errorMessage: "",
    status: null,
    isAI: false,
    confidence: 0,
    verified: false,
    patterns: [],
    analysis: {},
    provenance: null,
    c2pa: null,
    detailed: null,
    ...partial,
  };
}

function parseSentences(raw: unknown): TextSentenceScore[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const s = (item ?? {}) as Record<string, unknown>;
    const scores = (s["scores"] ?? {}) as Record<string, unknown>;
    return {
      text: asString(s["text"]),
      isAI: Boolean(s["isAI"]),
      confidence: asNumber(s["confidence"]),
      scores: {
        ai: asNumber(scores["ai"], NaN),
        human: asNumber(scores["human"], NaN),
      },
    };
  });
}

export const wasitaiDetectText = createServerFn({ method: "POST" })
  .inputValidator((input: TextDetectInput) => {
    if (!input || typeof input !== "object") throw new Error("Invalid payload.");
    const apiKey = input.apiKey?.trim() ?? "";
    const content = input.content?.trim() ?? "";
    if (!apiKey) throw new Error("API key is required.");
    if (!/^wai_/i.test(apiKey)) {
      throw new Error("Key should start with wai_ (from wasitaigenerated.com/dashboard).");
    }
    if (content.length < 80) {
      throw new Error("Paste at least ~50 words for a reliable tropa-2 score.");
    }
    if (content.length > 100_000) throw new Error("Text exceeds 100,000 characters.");
    return {
      apiKey,
      content,
      mode: input.mode === "depth" ? ("depth" as const) : ("depth" as const),
      model: input.model === "tropa-1" ? ("tropa-1" as const) : ("tropa-2" as const),
    };
  })
  .handler(async ({ data }): Promise<TextDetectResult> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);
    try {
      const res = await fetch(`${API_BASE}/api/v1/detect/text`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          content: data.content,
          mode: data.mode,
          model: data.model,
        }),
        signal: controller.signal,
      });
      let json: Record<string, unknown> = {};
      try {
        json = (await res.json()) as Record<string, unknown>;
      } catch {
        json = {};
      }
      if (!res.ok) {
        return emptyTextResult({
          status: res.status,
          errorMessage: parseError(json, res.status),
        });
      }
      const analysis = (json["analysis"] ?? {}) as Record<string, unknown>;
      const anomalies = json["inputAnomalies"];
      const subclass = json["subclassProbs"];
      const verdictRaw = asString(json["verdict"]);
      const verdict = (["human", "uncertain", "likely_ai", "ai"].includes(verdictRaw)
        ? verdictRaw
        : "") as AiVerdict | "";
      return {
        ok: true,
        errorMessage: "",
        status: res.status,
        isAI: Boolean(json["isAI"]),
        confidence: asNumber(json["confidence"]),
        score: asNumber(json["score"]),
        verdict,
        model: asString(json["model"]) || "tropa-2",
        patterns: Array.isArray(json["patterns"])
          ? json["patterns"].filter((p): p is string => typeof p === "string")
          : [],
        analysis: {
          ...(asString(analysis["likelihood"])
            ? { likelihood: asString(analysis["likelihood"]) }
            : {}),
          ...(asString(analysis["reasoning"])
            ? { reasoning: asString(analysis["reasoning"]) }
            : {}),
        },
        sentences: parseSentences(json["sentences"]),
        humanizedHint: asString(json["humanizedHint"]),
        inputAnomalies:
          anomalies && typeof anomalies === "object"
            ? (anomalies as Record<string, number>)
            : null,
        subclassProbs:
          subclass && typeof subclass === "object"
            ? (subclass as Record<string, number>)
            : null,
      };
    } catch (err) {
      const msg =
        err instanceof Error && err.name === "AbortError"
          ? "Detector timed out (30s). Retry with a shorter passage."
          : err instanceof Error
            ? err.message
            : "Network error calling WasItAIGenerated.";
      return emptyTextResult({ errorMessage: msg });
    } finally {
      clearTimeout(timer);
    }
  });

/** UI helper — band labels matching calibrated score thresholds. */
export function verdictLabel(verdict: string, score: number): string {
  if (verdict === "human" || score < 40) return "Human";
  if (verdict === "uncertain" || score < 70) return "Uncertain";
  if (verdict === "likely_ai" || score < 90) return "Likely AI";
  return "AI-generated";
}

export function verdictTone(verdict: string, score: number): string {
  if (verdict === "human" || score < 40) return "text-mint";
  if (verdict === "uncertain" || score < 70) return "text-amber";
  if (verdict === "likely_ai" || score < 90) return "text-orange-400";
  return "text-[#ff4d6d]";
}
