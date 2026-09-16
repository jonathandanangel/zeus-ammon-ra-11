/**
 * Writing to IQ — vocabulary-based IQ estimate (curiosity tool).
 *
 * Source: https://www.writingtoiq.com/
 * Public GET (no API key): https://www.writingtoiq.com/background_process?textsample=…
 * Response: { "result": "Estimated IQ: 143 (genius)" }
 * Not an AI-detector vote — companion insight only.
 */
/** Canonical public source for the Writing to IQ estimator. */
export const WRITING_IQ_SOURCE = {
  name: "Writing to IQ",
  siteUrl: "https://www.writingtoiq.com/",
  endpointUrl: "https://www.writingtoiq.com/background_process",
  endpointUrlAlt: "https://texttoiq.herokuapp.com/background_process",
  about:
    "Vocabulary-based IQ estimate from writingtoiq.com — cleans text, scores vocabulary, maps to an IQ-like band for curiosity (not a standardized test).",
} as const;

export const WRITING_IQ_DISCLAIMER = "High writing IQ does not mean AI generated!";

export type WritingIqResult = {
  ok: boolean;
  iq: number | null;
  bandLabel: string;
  resultText: string;
  errorMessage: string;
  status: number | null;
  sourceUrl: string;
  endpointUrl: string;
};

/** Site allows 3500; keep GET query under typical proxy URL limits. */
const MAX_CHARS = 1800;
const MIN_WORDS = 50;

export function writingIqWordCount(text: string): number {
  return (text.trim().match(/\S+/g) || []).length;
}

export function failWritingIq(opts: {
  errorMessage: string;
  status: number | null;
  resultText?: string;
}): WritingIqResult {
  return {
    ok: false,
    iq: null,
    bandLabel: "",
    resultText: opts.resultText ?? "",
    errorMessage: opts.errorMessage,
    status: opts.status,
    sourceUrl: WRITING_IQ_SOURCE.siteUrl,
    endpointUrl: WRITING_IQ_SOURCE.endpointUrl,
  };
}

function parseIqPayload(result: string, status: number): WritingIqResult {
  if (
    result === "Text too short for IQ estimation" ||
    result === "Not enough data or not enough variance to estimate IQ"
  ) {
    return failWritingIq({ errorMessage: result, status, resultText: result });
  }
  const match = result.match(/^Estimated IQ:\s*(\d+)\s*\(([^)]+)\)$/i);
  if (!match) {
    return failWritingIq({
      errorMessage: result || "Unexpected Writing to IQ response.",
      status,
      resultText: result,
    });
  }
  const iq = Number(match[1]);
  return {
    ok: true,
    iq: Number.isFinite(iq) ? iq : null,
    bandLabel: match[2]!.trim(),
    resultText: result,
    errorMessage: "",
    status,
    sourceUrl: WRITING_IQ_SOURCE.siteUrl,
    endpointUrl: WRITING_IQ_SOURCE.endpointUrl,
  };
}

async function getJson(
  url: string,
  signal: AbortSignal,
): Promise<{ status: number; text: string; json: { result?: string } }> {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (compatible; ZEUS-AMMON-RA-11; +https://www.writingtoiq.com/)",
      Referer: WRITING_IQ_SOURCE.siteUrl,
    },
    signal,
    redirect: "follow",
  });
  const text = await res.text();
  let json: { result?: string } = {};
  try {
    json = text ? (JSON.parse(text) as { result?: string }) : {};
  } catch {
    json = {};
  }
  return { status: res.status, text, json };
}

/** Server-side call to Writing to IQ (API routes / server fns only). */
export async function analyzeWritingIq(rawContent: string): Promise<WritingIqResult> {
  const content = rawContent.trim().slice(0, MAX_CHARS);
  if (writingIqWordCount(content) < MIN_WORDS) {
    return failWritingIq({
      errorMessage: `Writing to IQ needs at least ${MIN_WORDS} words.`,
      status: null,
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  const params = new URLSearchParams({ textsample: content });
  const primary = `${WRITING_IQ_SOURCE.endpointUrl}?${params}`;
  const alt = `${WRITING_IQ_SOURCE.endpointUrlAlt}?${params}`;

  try {
    let { status, text, json } = await getJson(primary, controller.signal);
    if (status >= 500 || (status === 200 && typeof json.result !== "string")) {
      try {
        ({ status, text, json } = await getJson(alt, controller.signal));
      } catch {
        // keep primary outcome
      }
    }
    if (status !== 200) {
      return failWritingIq({
        errorMessage: `Writing to IQ HTTP ${status}${text ? `: ${text.slice(0, 120)}` : ""}`,
        status,
      });
    }
    if (typeof json.result !== "string") {
      return failWritingIq({
        errorMessage: `Writing to IQ returned non-JSON (HTTP ${status}).`,
        status,
      });
    }
    return parseIqPayload(json.result, status);
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.name === "AbortError"
          ? "Writing to IQ timed out. Try a shorter sample."
          : e.message === "Failed to fetch"
            ? "Could not reach writingtoiq.com. Try again, or open https://www.writingtoiq.com/ directly."
            : e.message
        : "Network error";
    return failWritingIq({ errorMessage: msg, status: null });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Browser entry: same-origin POST /api/writing-iq (no CSRF, no CORS).
 */
export async function estimateWritingIqClient(content: string): Promise<WritingIqResult> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}/api/writing-iq`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ content: content.trim().slice(0, MAX_CHARS) }),
    });
    const text = await res.text();
    let json: WritingIqResult | null = null;
    try {
      json = text ? (JSON.parse(text) as WritingIqResult) : null;
    } catch {
      json = null;
    }
    if (json && typeof json === "object" && typeof json.ok === "boolean") {
      return {
        ...json,
        sourceUrl: json.sourceUrl || WRITING_IQ_SOURCE.siteUrl,
        endpointUrl: json.endpointUrl || WRITING_IQ_SOURCE.endpointUrl,
      };
    }
    return failWritingIq({
      errorMessage: `Writing to IQ proxy HTTP ${res.status}. Source: ${WRITING_IQ_SOURCE.siteUrl}`,
      status: res.status,
    });
  } catch (e) {
    return failWritingIq({
      errorMessage:
        e instanceof Error
          ? e.message === "Failed to fetch"
            ? `Writing to IQ unavailable right now. Source: ${WRITING_IQ_SOURCE.siteUrl}`
            : e.message
          : "Writing to IQ failed.",
      status: null,
    });
  }
}
