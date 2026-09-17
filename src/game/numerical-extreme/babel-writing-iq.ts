/**
 * Silent Babel prose preference — high Writing IQ + low AI %.
 * Runs the workable free detector suite (+ Writing to IQ when possible)
 * in the background. Never surface scores in NUMEROLOGY UI.
 */

import { estimateWritingIqClient, writingIqWordCount } from "@/game/ai-detector/writingIq";
import { runFreeEnsemble } from "@/game/ai-detector/freeEnsemble";

const AI_TARGET_MAX = 10;

const STOP = new Set(
  "a an the of to in on for and or but with from by as is are was were be been being this that these those it its at so if then than into over under again further".split(
    " ",
  ),
);

/** Local vocabulary / fluency proxy mapped toward a ~75–155 IQ-like band. */
export function localWritingIqScore(text: string): number {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
  if (words.length < 4) return 78;
  const unique = new Set(words);
  const content = words.filter((w) => !STOP.has(w) && w.length >= 3);
  const uniqContent = new Set(content);
  const avgLen =
    content.reduce((s, w) => s + w.length, 0) / Math.max(1, content.length);
  const longRare = content.filter((w) => w.length >= 7).length;
  const diversity = uniqContent.size / Math.max(1, content.length);
  const typeToken = unique.size / words.length;
  const clauses = (text.match(/[,.;:—]/g) || []).length;
  const clauseRate = clauses / Math.max(1, words.length);

  let score =
    88 +
    diversity * 28 +
    typeToken * 18 +
    Math.min(14, (avgLen - 4) * 4) +
    Math.min(12, longRare * 1.6) +
    Math.min(8, clauseRate * 40);

  const alphaNoise = (text.match(/[a-z]{10,}/gi) || []).length;
  score -= Math.min(20, alphaNoise * 4);

  return Math.max(72, Math.min(155, Math.round(score)));
}

/** Build several readable orderings; pick best local Writing-IQ proxy. */
export function pickBestRelevantProse(
  parts: string[],
  limitCandidates = 8,
): { prose: string; score: number } {
  const cleaned = parts
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length >= 2);
  if (!cleaned.length) return { prose: "", score: 78 };

  const candidates = new Set<string>();
  candidates.add(cleaned.join(". "));
  candidates.add(cleaned.join(" — "));
  candidates.add([...cleaned].reverse().join(". "));
  if (cleaned.length >= 2) {
    candidates.add(`${cleaned[0]}. ${cleaned.slice(1).join(" ")}`);
    candidates.add(`${cleaned.slice(1).join(". ")}. ${cleaned[0]}`);
  }
  if (cleaned.length >= 3) {
    const mid = [...cleaned];
    const pivot = mid.splice(1, 1)[0]!;
    candidates.add(`${pivot}. ${mid.join(". ")}`);
  }
  const byLen = [...cleaned].sort((a, b) => b.length - a.length);
  candidates.add(byLen.join(". "));

  let best = { prose: cleaned.join(". "), score: 0 };
  let n = 0;
  for (const c of candidates) {
    if (n >= limitCandidates) break;
    n += 1;
    const score = localWritingIqScore(c);
    if (score > best.score) best = { prose: c, score };
  }
  return best;
}

export function orderTokensForWritingIq(tokens: string[]): string[] {
  const scored = tokens.map((t) => ({
    t,
    s: localWritingIqScore(t) + Math.min(12, t.length),
  }));
  scored.sort((a, b) => b.s - a.s || b.t.length - a.t.length);
  return scored.map((x) => x.t);
}

export type SilentBabelProseScore = {
  text: string;
  writingIq: number;
  aiPercent: number;
  /** Higher is better: low AI + high IQ. */
  rank: number;
};

function rankScore(writingIq: number, aiPercent: number): number {
  // Prefer AI ≤ 10% hard; then maximize writing IQ; then minimize AI.
  const underTarget = aiPercent <= AI_TARGET_MAX ? 1 : 0;
  return underTarget * 10_000 + writingIq * 10 - aiPercent;
}

/**
 * Entire workable suite for one sample (silent):
 * Writing to IQ (when long enough) + free AI detector ensemble (stylometric + neural).
 */
export async function silentlyScoreBabelProse(
  text: string,
  opts?: { skipNeural?: boolean },
): Promise<SilentBabelProseScore> {
  const sample = text.trim();
  let writingIq = localWritingIqScore(sample);

  if (writingIqWordCount(sample) >= 50) {
    try {
      const iq = await estimateWritingIqClient(sample);
      if (iq.ok && iq.iq != null) writingIq = iq.iq;
    } catch {
      // keep local
    }
  }

  let aiPercent = 55;
  try {
    const { consensus } = await runFreeEnsemble(sample, undefined, {
      skipNeural: opts?.skipNeural ?? false,
    });
    if (consensus.scanned > 0) {
      aiPercent = consensus.avgAiScore;
    }
  } catch {
    // soft fallback: local stylometric lean from writing quirks
    aiPercent = Math.max(8, Math.min(70, 160 - writingIq));
  }

  return {
    text: sample,
    writingIq,
    aiPercent,
    rank: rankScore(writingIq, aiPercent),
  };
}

/**
 * Among candidates, pick the one that best passes the workable tests:
 * prefer AI &lt; 10%, then highest Writing IQ. Never throws.
 */
export async function silentlyPickBestBabelProse(
  candidates: string[],
  opts?: { skipNeural?: boolean; maxCandidates?: number },
): Promise<string> {
  const cleaned = [...new Set(candidates.map((c) => c.trim()).filter((c) => c.length >= 12))];
  if (!cleaned.length) return "";
  if (cleaned.length === 1) return cleaned[0]!;

  // Pre-filter by local IQ so we don't run full neural on every permutation
  const pre = cleaned
    .map((text) => ({ text, local: localWritingIqScore(text) }))
    .sort((a, b) => b.local - a.local)
    .slice(0, opts?.maxCandidates ?? 4);

  const scored: SilentBabelProseScore[] = [];
  for (const row of pre) {
    try {
      scored.push(await silentlyScoreBabelProse(row.text, opts));
    } catch {
      scored.push({
        text: row.text,
        writingIq: row.local,
        aiPercent: 50,
        rank: rankScore(row.local, 50),
      });
    }
  }
  scored.sort((a, b) => b.rank - a.rank);
  return scored[0]?.text ?? cleaned[0]!;
}

/** Expand source parts into candidate coherent blocks for locate/weave. */
export function babelProseCandidates(parts: string[]): string[] {
  const base = pickBestRelevantProse(parts, 10);
  const cleaned = parts.map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
  const out = new Set<string>();
  if (base.prose) out.add(base.prose);
  if (cleaned.length) {
    out.add(cleaned.join(". "));
    out.add(cleaned.join(" — "));
    out.add([...cleaned].reverse().join(". "));
    // Slightly uneven human cadence (helps low AI %)
    out.add(`${cleaned[0]}. ${cleaned.slice(1).join("; ")}.`);
    if (cleaned.length >= 2) {
      out.add(`${cleaned[1]}. ${cleaned[0]}. ${cleaned.slice(2).join(". ")}`.trim());
    }
  }
  return [...out].filter((c) => c.length >= 12);
}
