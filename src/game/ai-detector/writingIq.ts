/**
 * Writing to IQ — vocabulary-based IQ estimate (curiosity tool).
 *
 * Source: https://www.writingtoiq.com/
 * Public GET (no API key): https://www.writingtoiq.com/background_process?textsample=…
 * Response: { "result": "Estimated IQ: 143 (genius)" }
 * Not an AI-detector vote — companion insight only.
 */
import { createServerFn } from "@tanstack/react-start";

/** Canonical public source for the Writing to IQ estimator. */
export const WRITING_IQ_SOURCE = {
  name: "Writing to IQ",
  siteUrl: "https://www.writingtoiq.com/",
  endpointUrl: "https://www.writingtoiq.com/background_process",
  about:
    "Vocabulary-based IQ estimate from writingtoiq.com — cleans text, scores vocabulary, maps to an IQ-like band for curiosity (not a standardized test).",
} as const;

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

const MAX_CHARS = 3500;

function wordCount(text: string): number {
  return (text.trim().match(/\S+/g) || []).length;
}

function failResult(opts: {
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

export const estimateWritingIq = createServerFn({ method: "POST" })
  .inputValidator((input: { content: string }) => {
    const content = typeof input?.content === "string" ? input.content.trim() : "";
    if (wordCount(content) < 50) {
      throw new Error("Writing to IQ needs at least 50 words.");
    }
    return { content: content.slice(0, MAX_CHARS) };
  })
  .handler(async ({ data }): Promise<WritingIqResult> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);
    try {
      const url = `${WRITING_IQ_SOURCE.endpointUrl}?${new URLSearchParams({
        textsample: data.content,
      })}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "ZEUS-AMMON-RA-11-AiDetector/1.0",
        },
        signal: controller.signal,
      });
      const text = await res.text();
      let json: { result?: string } = {};
      try {
        json = text ? (JSON.parse(text) as { result?: string }) : {};
      } catch {
        return failResult({
          errorMessage: `Writing to IQ returned non-JSON (HTTP ${res.status}).`,
          status: res.status,
        });
      }
      if (!res.ok) {
        return failResult({ errorMessage: `HTTP ${res.status}`, status: res.status });
      }
      const result = typeof json.result === "string" ? json.result : "";
      if (
        result === "Text too short for IQ estimation" ||
        result === "Not enough data or not enough variance to estimate IQ"
      ) {
        return failResult({ errorMessage: result, status: res.status, resultText: result });
      }
      const match = result.match(/^Estimated IQ:\s*(\d+)\s*\(([^)]+)\)$/i);
      if (!match) {
        return failResult({
          errorMessage: result || "Unexpected Writing to IQ response.",
          status: res.status,
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
        status: res.status,
        sourceUrl: WRITING_IQ_SOURCE.siteUrl,
        endpointUrl: WRITING_IQ_SOURCE.endpointUrl,
      };
    } catch (e) {
      return failResult({
        errorMessage: e instanceof Error ? e.message : "Network error",
        status: null,
      });
    } finally {
      clearTimeout(timer);
    }
  });
