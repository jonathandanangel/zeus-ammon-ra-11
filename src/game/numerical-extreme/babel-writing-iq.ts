/**
 * Silent Babel prose preference — maximize Writing IQ (approach ~190) + low AI %.
 * Runs the same Free AI Detector ensemble as AiDetectorApp. Prefer AI ≤ 10%, then
 * push vocabulary / register toward Writing-to-IQ’s high band (~190; ~200 is rare).
 * Never surface scores in NUMEROLOGY UI.
 */

import { estimateWritingIqClient, writingIqWordCount } from "@/game/ai-detector/writingIq";
import { runFreeEnsemble } from "@/game/ai-detector/freeEnsemble";

const AI_TARGET_MAX = 10;
/** Hard clamp — Writing-to-IQ can report near 199; we do not require hitting 200. */
export const WRITING_IQ_PEAK = 200;
/** Soft approach target — maximize toward ~190 in practice. */
const WRITING_IQ_SOFT_TARGET = 190;

const STOP = new Set(
  "a an the of to in on for and or but with from by as is are was were be been being this that these those it its at so if then than into over under again further".split(
    " ",
  ),
);

/** Latinate / scholarly morphology — Writing-to-IQ rewards rare vocabulary heavily. */
const LATINATE =
  /(?:tion|sion|ment|ity|ous|ive|ical|ology|ophy|escence|itude|aneous|iferous|esque|ulum|esis|ysis|archy|cracy|graphy|metry|scape)$/i;

/** High-register connective frames — weave located words/colours without inventing facts. */
const ELEVATION_FRAMES: Array<(a: string, b: string, c: string, rest: string) => string> = [
  (a, b, c, rest) =>
    `The chromatic epistemology of ${a} crystallizes through ${b}, wherein ${c} articulates a phenomenological continuum${rest ? ` amid ${rest}` : ""}.`,
  (a, b, c, rest) =>
    `An hermeneutic of ${a} refracts ${b} into an ontological luminescence; ${c} becomes the axiological fulcrum${rest ? ` of ${rest}` : ""}.`,
  (a, b, c, rest) =>
    `Within the hexagon’s rare coherent leaf, ${a} and ${b} compose a synesthetic concordance; ${c} denotes the chromatic archetype${rest ? ` alongside ${rest}` : ""}.`,
  (a, b, c, rest) =>
    `The lexicographical density of ${a} elevates ${b} toward metaphysical precision, while ${c} sustains an erudite chromatic dialectic${rest ? ` with ${rest}` : ""}.`,
  (a, b, c, rest) =>
    `${a} — chromatic, phenomenological — interlaces ${b} and ${c} in a contemplative synthesis of colour, lexicon, and path${rest ? `; thence ${rest}` : ""}.`,
];

function contentWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

/**
 * Local vocabulary / fluency proxy mapped toward Writing-to-IQ’s high band (~190).
 * Emphasizes rare, long, Latinate tokens (words, colour rays, philosophy terms).
 */
export function localWritingIqScore(text: string): number {
  const words = contentWords(text);
  if (words.length < 4) return 82;
  const unique = new Set(words);
  const content = words.filter((w) => !STOP.has(w) && w.length >= 3);
  const uniqContent = new Set(content);
  if (!content.length) return 88;

  const avgLen = content.reduce((s, w) => s + w.length, 0) / content.length;
  const longRare = content.filter((w) => w.length >= 7).length;
  const veryLong = content.filter((w) => w.length >= 10).length;
  const latinates = content.filter((w) => LATINATE.test(w) || w.length >= 9).length;
  const diversity = uniqContent.size / content.length;
  const typeToken = unique.size / words.length;
  const stopShare = words.filter((w) => STOP.has(w)).length / words.length;
  const clauses = (text.match(/[,.;:—;—]/g) || []).length;
  const clauseRate = clauses / Math.max(1, words.length);
  const hyphenCompounds = (text.match(/\b[a-z]+-[a-z]+\b/gi) || []).length;

  // Tuned so strong rare-vocab samples can approach WRITING_IQ_PEAK locally
  let score =
    96 +
    diversity * 36 +
    typeToken * 22 +
    Math.min(22, (avgLen - 4.2) * 6.5) +
    Math.min(28, longRare * 2.4) +
    Math.min(18, veryLong * 3.2) +
    Math.min(24, latinates * 2.8) +
    Math.min(12, clauseRate * 55) +
    Math.min(8, hyphenCompounds * 2.5) -
    Math.min(16, stopShare * 28);

  const alphaNoise = (text.match(/[a-z]{14,}/gi) || []).length;
  score -= Math.min(18, alphaNoise * 3);

  // Length floor: Writing-to-IQ wants ≥50 words for API; reward denser samples locally
  if (words.length >= 50) score += 8;
  else if (words.length >= 28) score += 4;

  return Math.max(78, Math.min(WRITING_IQ_PEAK, Math.round(score)));
}

/** Single-token rarity score used when ordering colour / glossary / path words. */
export function tokenWritingIqWeight(token: string): number {
  const w = token.toLowerCase().replace(/[^a-z'-]/g, "");
  if (w.length < 3) return 0;
  let s = w.length * 3.2;
  if (w.length >= 7) s += 8;
  if (w.length >= 10) s += 10;
  if (LATINATE.test(w)) s += 14;
  if (!STOP.has(w)) s += 4;
  return s;
}

/**
 * Build high-register candidate sentences from located parts (words, colours, quotes).
 * Frames elevate vocabulary density toward peak Writing IQ without inventing new facts.
 */
export function elevatePartsForPeakIq(parts: string[], limit = 12): string[] {
  const cleaned = parts
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length >= 2);
  if (!cleaned.length) return [];

  const ordered = orderTokensForWritingIq(cleaned);
  const a = ordered[0] ?? cleaned[0]!;
  const b = ordered[1] ?? ordered[0] ?? a;
  const c = ordered[2] ?? b;
  const rest = ordered.slice(3, 8).join(", ");

  const out = new Set<string>();
  for (const frame of ELEVATION_FRAMES) {
    out.add(frame(a, b, c, rest));
  }
  // Dense appositive cascade — Writing-to-IQ loves rare noun stacks
  out.add(
    `${ordered.slice(0, 10).join("; ")} — an epistemological, chromatic, lexicographical continuum of path-located signification.`,
  );
  out.add(
    `Phenomenological refraction of ${a}: ${ordered.slice(0, 8).join(", ")}; thence a contemplative ontology of colour and lexicon.`,
  );
  // Pad toward ≥50 words for live Writing-to-IQ API when possible
  const dense = `${ELEVATION_FRAMES[0]!(a, b, c, rest)} ${ELEVATION_FRAMES[1]!(b, c, a, rest)} The rare coherent leaf preserves these locutions as already-written hexagonal inventory — vocabulary maximized, invention refused.`;
  out.add(dense);

  return [...out].filter((c) => c.length >= 24).slice(0, limit);
}

/** Build several readable orderings; pick best local Writing-IQ proxy (toward peak 200). */
export function pickBestRelevantProse(
  parts: string[],
  limitCandidates = 12,
): { prose: string; score: number } {
  const cleaned = parts
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length >= 2);
  if (!cleaned.length) return { prose: "", score: 82 };

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
  for (const elev of elevatePartsForPeakIq(cleaned, 8)) candidates.add(elev);

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
    s: tokenWritingIqWeight(t) + localWritingIqScore(t) * 0.15 + Math.min(14, t.length),
  }));
  scored.sort((a, b) => b.s - a.s || b.t.length - a.t.length);
  return scored.map((x) => x.t);
}

export type SilentBabelProseScore = {
  text: string;
  writingIq: number;
  aiPercent: number;
  /** Higher is better: low AI + high IQ approaching ~190. */
  rank: number;
};

function rankScore(writingIq: number, aiPercent: number): number {
  // Prefer AI ≤ 10%; then maximize Writing IQ toward ~190; then minimize AI.
  const underTarget = aiPercent <= AI_TARGET_MAX ? 1 : 0;
  const iq = Math.min(WRITING_IQ_PEAK, Math.max(0, writingIq));
  const nearPeak =
    iq >= WRITING_IQ_SOFT_TARGET
      ? 900 + (iq - WRITING_IQ_SOFT_TARGET) * 35
      : iq >= 175
        ? 500
        : iq >= 160
          ? 280
          : 0;
  return underTarget * 50_000 + iq * 120 + nearPeak - aiPercent * 2;
}

/**
 * Entire Free AI Detector suite for one sample (silent):
 * Writing to IQ (when long enough) + runFreeEnsemble with the same consensus rules
 * as Free multi-scan. Selection approaches ~190 Writing IQ under the AI ≤ 10% gate.
 */
export async function silentlyScoreBabelProse(
  text: string,
  opts?: { skipNeural?: boolean; localOnly?: boolean; neural?: "all" | "modernbert" | "none" },
): Promise<SilentBabelProseScore> {
  const sample = text.trim();
  let writingIq = localWritingIqScore(sample);

  if (!opts?.localOnly && writingIqWordCount(sample) >= 50) {
    try {
      const iq = await estimateWritingIqClient(sample);
      if (iq.ok && iq.iq != null) {
        // Trust live Writing-to-IQ; still clamp display/rank band to peak
        writingIq = Math.min(WRITING_IQ_PEAK, Math.max(writingIq, iq.iq));
      }
    } catch {
      // keep local
    }
  }

  let aiPercent = Math.max(8, Math.min(55, 160 - writingIq * 0.55));
  if (!opts?.localOnly) {
    try {
      const { consensus } = await runFreeEnsemble(sample, undefined, {
        ...(opts?.skipNeural
          ? { skipNeural: true, neural: "none" as const }
          : { neural: opts?.neural ?? "modernbert" }),
      });
      if (consensus.scanned > 0) {
        aiPercent = consensus.avgAiScore;
      }
    } catch {
      // keep heuristic
    }
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
 * prefer AI &lt; 10%, then highest Writing IQ approaching ~190. Never throws.
 */
export async function silentlyPickBestBabelProse(
  candidates: string[],
  opts?: {
    skipNeural?: boolean;
    maxCandidates?: number;
    localOnly?: boolean;
    neural?: "all" | "modernbert" | "none";
  },
): Promise<string> {
  const cleaned = [...new Set(candidates.map((c) => c.trim()).filter((c) => c.length >= 12))];
  if (!cleaned.length) return "";
  if (cleaned.length === 1) return cleaned[0]!;

  if (opts?.localOnly) {
    return pickBestRelevantProse(cleaned, opts.maxCandidates ?? 8).prose || cleaned[0]!;
  }

  const pre = cleaned
    .map((text) => ({ text, local: localWritingIqScore(text) }))
    .sort((a, b) => b.local - a.local)
    .slice(0, opts?.maxCandidates ?? 6);

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
  scored.sort((a, b) => b.rank - a.rank || b.writingIq - a.writingIq);
  return scored[0]?.text ?? cleaned[0]!;
}

/** Expand source parts into candidate coherent blocks for locate/weave — IQ-maximizing. */
export function babelProseCandidates(parts: string[]): string[] {
  const base = pickBestRelevantProse(parts, 14);
  const cleaned = parts.map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
  const out = new Set<string>();
  if (base.prose) out.add(base.prose);
  if (cleaned.length) {
    out.add(cleaned.join(". "));
    out.add(cleaned.join(" — "));
    out.add([...cleaned].reverse().join(". "));
    out.add(`${cleaned[0]}. ${cleaned.slice(1).join("; ")}.`);
    if (cleaned.length >= 2) {
      out.add(`${cleaned[1]}. ${cleaned[0]}. ${cleaned.slice(2).join(". ")}`.trim());
    }
    for (const elev of elevatePartsForPeakIq(cleaned, 10)) out.add(elev);
  }
  // Prefer higher local IQ candidates first when callers slice()
  return [...out]
    .filter((c) => c.length >= 12)
    .sort((a, b) => localWritingIqScore(b) - localWritingIqScore(a));
}
