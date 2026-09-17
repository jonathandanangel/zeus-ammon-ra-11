/**
 * Ordered Spatial Reasoning — TypeScript port of NumericalAnalysisToolbox_V18.
 *
 * Two supplied sequence collections are used as structural reference profiles,
 * not answer lookup tables. The engine searches arithmetic, geometric,
 * finite-difference / polynomial, affine, recurrence, interleaved, palindrome /
 * digit, partition, and related interpretations.
 *
 * Predictions are hypotheses. They do not establish an IQ score and are not
 * marked officially verified without an external answer key.
 */

export type OsrConfidence = "High" | "Medium" | "Low" | "Indeterminate";

export type OsrCandidate = {
  name: string;
  family: string;
  prediction: string[];
  rule: string;
  operators: number;
  parameters: number;
  exceptions: number;
  coverage: number;
  holdout: number;
  complexity: number;
  score: number;
  clusterWeight: number;
  notes: string;
};

export type OsrConfig = {
  beamWidth: number;
  maxPeriod: number;
  maxPolyDegree: number;
  maxRecurrenceOrder: number;
  maxPartitionWidth: number;
  minCoverage: number;
  exactBonus: number;
  operatorPenalty: number;
  parameterPenalty: number;
  exceptionPenalty: number;
  polyPenalty: number;
  maxShown: number;
};

export type OsrResult = {
  tokens: string[];
  observed: number[];
  missing: number[];
  candidates: OsrCandidate[];
  suggestedBlanks: string[];
  confidence: OsrConfidence;
  predictionEntropy: number;
  report: string;
  officiallyVerified: false;
};

const DEFAULT_CFG: OsrConfig = {
  beamWidth: 500,
  maxPeriod: 4,
  maxPolyDegree: 3,
  maxRecurrenceOrder: 3,
  maxPartitionWidth: 3,
  minCoverage: 0.75,
  exactBonus: 1000,
  operatorPenalty: 8,
  parameterPenalty: 3,
  exceptionPenalty: 100,
  polyPenalty: 25,
  maxShown: 10,
};

const MISSING = new Set(["?", "_", "NaN", "null", "NULL"]);

function isMissing(s: string): boolean {
  return MISSING.has(s.trim());
}

export function tokenizeSequence(input: string | string[]): string[] {
  if (Array.isArray(input)) return input.map((t) => String(t).trim()).filter(Boolean);
  const raw = String(input)
    .replace(/\n/g, ",")
    .replace(/;/g, ",")
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  return raw;
}

function parseNum(s: string): { ok: boolean; v: number } {
  if (isMissing(s) || !/^[+-]?\d+(?:\.\d+)?$/.test(s.trim())) return { ok: false, v: NaN };
  const v = Number(s);
  return { ok: Number.isFinite(v), v };
}

function fmt(x: number): string {
  if (!Number.isFinite(x)) return "?";
  if (Math.abs(x - Math.round(x)) <= 1e-9 * (1 + Math.abs(x))) return String(Math.round(x));
  return String(Number(x.toPrecision(12)));
}

function equalToken(a: string, b: string): boolean {
  if (a === b) return true;
  const A = parseNum(a);
  const B = parseNum(b);
  return A.ok && B.ok && Math.abs(A.v - B.v) <= 1e-8 * (1 + Math.abs(B.v));
}

function candidate(
  name: string,
  family: string,
  prediction: string[],
  rule: string,
  operators: number,
  parameters: number,
  exceptions = 0,
): OsrCandidate {
  return {
    name,
    family,
    prediction,
    rule,
    operators,
    parameters,
    exceptions,
    coverage: 0,
    holdout: 0,
    complexity: 0,
    score: Number.NEGATIVE_INFINITY,
    clusterWeight: 0,
    notes: "",
  };
}

function numericObserved(tokens: string[]): { idx: number[]; v: number[]; ok: boolean } {
  const idx: number[] = [];
  const v: number[] = [];
  for (let i = 0; i < tokens.length; i += 1) {
    if (isMissing(tokens[i]!)) continue;
    const n = parseNum(tokens[i]!);
    if (!n.ok) return { idx, v, ok: false };
    idx.push(i + 1); // 1-based like MATLAB
    v.push(n.v);
  }
  return { idx, v, ok: true };
}

/** Vandermonde least-squares polyfit (degree d). */
function polyfit(xs: number[], ys: number[], deg: number): number[] {
  const n = xs.length;
  const m = deg + 1;
  const A: number[][] = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < n; i += 1) {
    let p = 1;
    for (let j = m - 1; j >= 0; j -= 1) {
      A[i]![j] = p;
      p *= xs[i]!;
    }
  }
  // Normal equations AᵀA q = Aᵀy
  const ATA: number[][] = Array.from({ length: m }, () => Array(m).fill(0));
  const ATy = Array(m).fill(0) as number[];
  for (let i = 0; i < n; i += 1) {
    for (let r = 0; r < m; r += 1) {
      ATy[r]! += A[i]![r]! * ys[i]!;
      for (let c = 0; c < m; c += 1) ATA[r]![c]! += A[i]![r]! * A[i]![c]!;
    }
  }
  return solveLinear(ATA, ATy);
}

function polyval(coeffs: number[], x: number): number {
  let s = 0;
  for (const c of coeffs) s = s * x + c;
  return s;
}

function solveLinear(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]!]);
  for (let col = 0; col < n; col += 1) {
    let piv = col;
    for (let r = col + 1; r < n; r += 1) {
      if (Math.abs(M[r]![col]!) > Math.abs(M[piv]![col]!)) piv = r;
    }
    if (Math.abs(M[piv]![col]!) < 1e-14) return Array(n).fill(0);
    if (piv !== col) {
      const tmp = M[col]!;
      M[col] = M[piv]!;
      M[piv] = tmp;
    }
    const diag = M[col]![col]!;
    for (let c = col; c <= n; c += 1) M[col]![c]! /= diag;
    for (let r = 0; r < n; r += 1) {
      if (r === col) continue;
      const f = M[r]![col]!;
      for (let c = col; c <= n; c += 1) M[r]![c]! -= f * M[col]![c]!;
    }
  }
  return M.map((row) => row[n]!);
}

function leastSquares(rows: number[][], rhs: number[]): number[] {
  const m = rows[0]?.length ?? 0;
  const ATA: number[][] = Array.from({ length: m }, () => Array(m).fill(0));
  const ATy = Array(m).fill(0) as number[];
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i]!;
    for (let r = 0; r < m; r += 1) {
      ATy[r]! += row[r]! * rhs[i]!;
      for (let c = 0; c < m; c += 1) ATA[r]![c]! += row[r]! * row[c]!;
    }
  }
  return solveLinear(ATA, ATy);
}

function constantModels(tokens: string[]): OsrCandidate[] {
  const vals: number[] = [];
  for (const t of tokens) {
    const n = parseNum(t);
    if (n.ok) vals.push(n.v);
  }
  if (!vals.length || vals.some((v) => v !== vals[0])) return [];
  const pred = tokens.map((t) => (isMissing(t) ? fmt(vals[0]!) : t));
  return [candidate("Constant", "whole-number", pred, `a(n) = ${fmt(vals[0]!)}`, 1, 1)];
}

function arithmeticModels(tokens: string[]): OsrCandidate[] {
  const { idx, v, ok } = numericObserved(tokens);
  if (!ok || idx.length < 2) return [];
  const d = (v[v.length - 1]! - v[0]!) / (idx[idx.length - 1]! - idx[0]!);
  const base = v[0]! - d * idx[0]!;
  const pred = tokens.map((_, i) => fmt(base + d * (i + 1)));
  return [
    candidate(
      "Arithmetic progression",
      "whole-number",
      pred,
      `a(n)=${fmt(base)}${d >= 0 ? "+" : ""}${fmt(d)}*n`,
      1,
      2,
    ),
  ];
}

function geometricModels(tokens: string[]): OsrCandidate[] {
  const { idx, v, ok } = numericObserved(tokens);
  if (!ok || idx.length < 2 || v.some((x) => x === 0)) return [];
  const gap = idx[idx.length - 1]! - idx[0]!;
  const ratio = v[v.length - 1]! / v[0]!;
  if (!(ratio > 0) || gap <= 0) return [];
  const r = ratio ** (1 / gap);
  const A = v[0]! / r ** idx[0]!;
  const pred = tokens.map((_, i) => fmt(A * r ** (i + 1)));
  return [
    candidate(
      "Geometric progression",
      "whole-number",
      pred,
      `a(n)=${fmt(A)}*(${fmt(r)})^n`,
      1,
      2,
    ),
  ];
}

function polynomialModels(tokens: string[], cfg: OsrConfig): OsrCandidate[] {
  const { idx, v, ok } = numericObserved(tokens);
  if (!ok) return [];
  const out: OsrCandidate[] = [];
  for (let deg = 2; deg <= Math.min(cfg.maxPolyDegree, idx.length - 1); deg += 1) {
    if (idx.length < deg + 1) continue;
    const q = polyfit(idx, v, deg);
    const pred = tokens.map((_, i) => fmt(polyval(q, i + 1)));
    out.push(
      candidate(
        `Polynomial degree ${deg}`,
        "polynomial-fallback",
        pred,
        `degree-${deg} polynomial fallback; coefficients=[${q.map((c) => fmt(c)).join(", ")}]`,
        deg + 1,
        deg + 1,
      ),
    );
  }
  return out;
}

function affineModels(tokens: string[]): OsrCandidate[] {
  const { idx, v, ok } = numericObserved(tokens);
  if (!ok || idx.length < 3) return [];
  const pairs: number[][] = [];
  const rhs: number[] = [];
  for (let j = 1; j < idx.length; j += 1) {
    if (idx[j] === idx[j - 1]! + 1) {
      pairs.push([v[j - 1]!, 1]);
      rhs.push(v[j]!);
    }
  }
  if (pairs.length < 2) return [];
  const theta = leastSquares(pairs, rhs);
  const pred = [...tokens];
  for (let pass = 0; pass < tokens.length; pass += 1) {
    for (let i = 1; i < tokens.length; i += 1) {
      if (isMissing(pred[i]!) && !isMissing(pred[i - 1]!)) {
        const n = parseNum(pred[i - 1]!);
        if (n.ok) pred[i] = fmt(theta[0]! * n.v + theta[1]!);
      }
    }
  }
  return [
    candidate(
      "Affine recurrence",
      "recursive",
      pred,
      `a(n)=${fmt(theta[0]!)}*a(n-1)${theta[1]! >= 0 ? "+" : ""}${fmt(theta[1]!)}`,
      2,
      2,
    ),
  ];
}

function linearRecurrenceModels(tokens: string[], cfg: OsrConfig): OsrCandidate[] {
  const { ok } = numericObserved(tokens);
  if (!ok) return [];
  const out: OsrCandidate[] = [];
  for (let ord = 2; ord <= cfg.maxRecurrenceOrder; ord += 1) {
    const rows: number[][] = [];
    const rhs: number[] = [];
    for (let i = ord; i < tokens.length; i += 1) {
      const x: number[] = [];
      let good = true;
      for (let j = 1; j <= ord; j += 1) {
        const n = parseNum(tokens[i - j]!);
        if (!n.ok) {
          good = false;
          break;
        }
        x.push(n.v);
      }
      const y = parseNum(tokens[i]!);
      if (!good || !y.ok) continue;
      rows.push(x);
      rhs.push(y.v);
    }
    if (rows.length < ord) continue;
    const q = leastSquares(rows, rhs);
    const pred = [...tokens];
    for (let i = ord; i < tokens.length; i += 1) {
      if (!isMissing(pred[i]!)) continue;
      const x: number[] = [];
      let good = true;
      for (let j = 1; j <= ord; j += 1) {
        const n = parseNum(pred[i - j]!);
        if (!n.ok) {
          good = false;
          break;
        }
        x.push(n.v);
      }
      if (good) pred[i] = fmt(x.reduce((s, xi, k) => s + xi * q[k]!, 0));
    }
    out.push(
      candidate(
        `Linear recurrence order ${ord}`,
        "recursive",
        pred,
        `a(n)=dot([${q.map(fmt).join(", ")}],[a(n-1)..a(n-${ord})])`,
        ord,
        ord,
      ),
    );
  }
  return out;
}

function interleavedModels(tokens: string[], cfg: OsrConfig): OsrCandidate[] {
  const out: OsrCandidate[] = [];
  const maxP = Math.min(cfg.maxPeriod, Math.max(2, Math.floor(tokens.length / 2)));
  for (let period = 2; period <= maxP; period += 1) {
    const pred = [...tokens];
    const rules: string[] = [];
    let valid = true;
    let pars = 0;
    for (let phase = 0; phase < period; phase += 1) {
      const pos: number[] = [];
      for (let i = phase; i < tokens.length; i += period) pos.push(i);
      const sub = pos.map((i) => tokens[i]!);
      const A = arithmeticModels(sub);
      if (!A.length) {
        valid = false;
        break;
      }
      for (let k = 0; k < pos.length; k += 1) pred[pos[k]!] = A[0]!.prediction[k]!;
      rules.push(A[0]!.rule);
      pars += A[0]!.parameters;
    }
    if (valid) {
      out.push(
        candidate(
          `Interleaved arithmetic period ${period}`,
          "interleaved",
          pred,
          `period ${period}: ${rules.join(" | ")}`,
          period + 1,
          pars,
        ),
      );
    }
  }
  return out;
}

function digitModels(tokens: string[], cfg: OsrConfig): OsrCandidate[] {
  const out: OsrCandidate[] = [];
  const obs = tokens.map((t, i) => (isMissing(t) ? -1 : i)).filter((i) => i >= 0);
  if (obs.length < 2) return out;

  let good = 0;
  let total = 0;
  for (let j = 1; j < obs.length; j += 1) {
    if (obs[j] === obs[j - 1]! + 1) {
      total += 1;
      if ([...tokens[obs[j - 1]!]!].reverse().join("") === tokens[obs[j]!]) good += 1;
    }
  }
  if (total > 0 && good / total >= cfg.minCoverage) {
    const pred = [...tokens];
    for (let i = 1; i < pred.length; i += 1) {
      if (isMissing(pred[i]!) && !isMissing(pred[i - 1]!)) {
        pred[i] = [...pred[i - 1]!].reverse().join("");
      }
    }
    out.push(
      candidate(
        "Repeated digit reversal",
        "digit",
        pred,
        "a(n)=reverse(a(n-1))",
        1,
        0,
        total - good,
      ),
    );
  }

  const sums: number[] = [];
  for (const i of obs) {
    const s = tokens[i]!;
    if (!/^\d+$/.test(s)) {
      sums.length = 0;
      break;
    }
    sums.push([...s].reduce((a, ch) => a + (ch.charCodeAt(0) - 48), 0));
  }
  if (sums.length && sums.every((s) => s === sums[0])) {
    out.push(
      candidate(
        "Invariant digit sum",
        "digit",
        [...tokens],
        `digit_sum(term)=${sums[0]}; not uniquely predictive`,
        1,
        1,
      ),
    );
  }
  return out;
}

function partitionModels(tokens: string[], cfg: OsrConfig): OsrCandidate[] {
  const out: OsrCandidate[] = [];
  const obs = tokens.map((t, i) => (isMissing(t) ? -1 : i)).filter((i) => i >= 0);
  if (!obs.length) return out;
  const lens = obs.map((i) => tokens[i]!.length);
  if (lens.some((L) => L < 3)) return out;

  for (let width = 1; width <= cfg.maxPartitionWidth; width += 1) {
    if (lens.some((L) => L % width !== 0)) continue;
    const counts = lens.map((L) => L / width);
    if (counts.some((c) => c !== counts[0])) continue;
    const m = counts[0]!;
    const mat: number[][] = [];
    let good = true;
    for (const oi of obs) {
      const s = tokens[oi]!;
      const row: number[] = [];
      for (let j = 0; j < m; j += 1) {
        const part = s.slice(j * width, (j + 1) * width);
        if (!/^\d+$/.test(part)) {
          good = false;
          break;
        }
        row.push(Number(part));
      }
      if (!good) break;
      mat.push(row);
    }
    if (!good || obs.length < 2) continue;

    const slopes = Array(m).fill(0) as number[];
    const bases = Array(m).fill(0) as number[];
    const i0 = obs[0]! + 1;
    const i1 = obs[obs.length - 1]! + 1;
    for (let j = 0; j < m; j += 1) {
      slopes[j] = (mat[mat.length - 1]![j]! - mat[0]![j]!) / (i1 - i0);
      bases[j] = mat[0]![j]! - slopes[j]! * i0;
    }
    const pred = [...tokens];
    for (let i = 0; i < tokens.length; i += 1) {
      if (!isMissing(pred[i]!)) continue;
      const parts: string[] = [];
      for (let j = 0; j < m; j += 1) {
        const val = Math.round(bases[j]! + slopes[j]! * (i + 1));
        parts.push(String(Math.max(0, val)).padStart(width, "0"));
      }
      pred[i] = parts.join("");
    }
    out.push(
      candidate(
        `Partitioned component arithmetic w=${width}`,
        "partitioned",
        pred,
        `split into ${m} components of width ${width}; component slopes=[${slopes.map(fmt).join(", ")}]`,
        m + 1,
        2 * m,
      ),
    );
  }
  return out;
}

function evaluate(c: OsrCandidate, tokens: string[], cfg: OsrConfig): OsrCandidate {
  const obs = tokens.map((t, i) => (isMissing(t) ? -1 : i)).filter((i) => i >= 0);
  let matches = 0;
  for (const i of obs) {
    if (i < c.prediction.length && !isMissing(c.prediction[i]!)) {
      if (equalToken(c.prediction[i]!, tokens[i]!)) matches += 1;
    }
  }
  c.coverage = obs.length ? matches / obs.length : 0;
  c.exceptions = obs.length - matches;
  c.complexity = c.operators + c.parameters;
  const poly = c.family === "polynomial-fallback";
  c.score =
    cfg.exactBonus * c.coverage -
    cfg.operatorPenalty * c.operators -
    cfg.parameterPenalty * c.parameters -
    cfg.exceptionPenalty * c.exceptions -
    cfg.polyPenalty * (poly ? 1 : 0);
  c.holdout = c.coverage;
  return c;
}

function clusterPredictions(candidates: OsrCandidate[]): OsrCandidate[] {
  if (!candidates.length) return candidates;
  const keys = candidates.map((c) => c.prediction.join("|"));
  const unique = [...new Set(keys)];
  const raw = unique.map((key) => {
    const ix = keys.map((k, i) => (k === key ? i : -1)).filter((i) => i >= 0);
    const m = Math.max(...ix.map((i) => candidates[i]!.score));
    return Math.exp(Math.min(60, m / 40));
  });
  const sum = raw.reduce((a, b) => a + b, 0) || 1;
  for (let i = 0; i < candidates.length; i += 1) {
    const j = unique.indexOf(keys[i]!);
    candidates[i]!.clusterWeight = raw[j]! / sum;
  }
  return candidates;
}

function confidenceOf(candidates: OsrCandidate[]): { label: OsrConfidence; entropy: number } {
  if (!candidates.length) return { label: "Indeterminate", entropy: 0 };
  const top = candidates[0]!;
  const margin = candidates.length === 1 ? Infinity : top.score - candidates[1]!.score;
  const weights = [...new Set(candidates.map((c) => c.clusterWeight))].filter((w) => w > 0);
  const entropy = weights.length
    ? -weights.reduce((s, w) => s + w * Math.log(w), 0)
    : 0;
  let label: OsrConfidence;
  if (top.coverage === 1 && top.clusterWeight >= 0.8 && margin >= 25) label = "High";
  else if (top.coverage === 1 && top.clusterWeight >= 0.55) label = "Medium";
  else if (top.coverage >= 0.8) label = "Low";
  else label = "Indeterminate";
  return { label, entropy };
}

type FeatureFlags = {
  n: number;
  missing: number;
  leadingZero: boolean;
  signed: boolean;
  decimal: boolean;
  symbolic: boolean;
  variableWidth: boolean;
  palindrome: boolean;
  repeatedDigits: boolean;
  longToken: boolean;
  negativeEmbedded: boolean;
  alternation: boolean;
  partitionLikely: boolean;
};

function featuresOf(tokens: string[]): FeatureFlags {
  const known = tokens.filter((t) => !isMissing(t));
  const f: FeatureFlags = {
    n: tokens.length,
    missing: tokens.length - known.length,
    leadingZero: false,
    signed: false,
    decimal: false,
    symbolic: false,
    variableWidth: false,
    palindrome: false,
    repeatedDigits: false,
    longToken: false,
    negativeEmbedded: false,
    alternation: tokens.length >= 5,
    partitionLikely: false,
  };
  const widths: number[] = [];
  for (const s of known) {
    widths.push(s.length);
    f.leadingZero ||= /^0\d/.test(s);
    f.signed ||= /^[+-]/.test(s);
    f.decimal ||= s.includes(".");
    f.symbolic ||= /[A-Za-zX]/.test(s);
    f.palindrome ||= s.length > 2 && s === [...s].reverse().join("");
    f.repeatedDigits ||= /(\d)\1\1/.test(s);
    f.longToken ||= s.length >= 6;
    f.negativeEmbedded ||= /\d-\d/.test(s);
  }
  if (widths.length) f.variableWidth = widths.some((w) => w !== widths[0]);
  f.partitionLikely = f.longToken || f.variableWidth || f.leadingZero || f.negativeEmbedded;
  return f;
}

function featureText(f: FeatureFlags): string {
  const a: string[] = [];
  if (f.leadingZero) a.push("leading zeros");
  if (f.signed) a.push("signed terms");
  if (f.decimal) a.push("decimal terms");
  if (f.symbolic) a.push("symbolic tokens");
  if (f.variableWidth) a.push("variable widths");
  if (f.palindrome) a.push("palindromic terms");
  if (f.repeatedDigits) a.push("repeated-digit blocks");
  if (f.longToken) a.push("concatenated long tokens");
  if (f.negativeEmbedded) a.push("embedded signs/separators");
  return a.length ? a.join(", ") : "plain numeric tokens";
}

function referenceMatches(f: FeatureFlags): string[] {
  const r = [
    "whole-number progression",
    "finite differences",
    "affine/recursive models",
  ];
  if (f.alternation) r.push("odd-even and periodic lanes");
  if (f.partitionLikely) r.push("lossless partition beam search");
  if (f.palindrome) r.push("palindromic expansion/contraction");
  if (f.repeatedDigits) r.push("run-length and repeated-block construction");
  if (f.symbolic) r.push("symbol permutation and X interpretation");
  if (f.leadingZero) r.push("fixed-width positional transforms");
  if (f.signed || f.negativeEmbedded) r.push("signed component arithmetic");
  if (f.decimal) r.push("rational/decimal lane analysis");
  if (f.variableWidth) r.push("insertion, deletion, and concatenation");
  return [...new Set(r)];
}

function searchOrder(f: FeatureFlags): string[] {
  const order = ["token preservation", "simple arithmetic", "interleaved lanes"];
  if (f.partitionLikely) order.push("partition beam");
  if (f.palindrome || f.repeatedDigits || f.variableWidth) order.push("digit/block transforms");
  if (f.symbolic) order.push("symbolic permutations");
  order.push("recurrences", "holdout validation", "MDL ranking", "prediction clustering");
  return order;
}

function renderReport(
  tokens: string[],
  observed: number[],
  missing: number[],
  candidates: OsrCandidate[],
  cfg: OsrConfig,
  combined: boolean,
): { report: string; confidence: OsrConfidence; entropy: number; suggested: string[] } {
  const lines: string[] = [
    "=== SUGGESTED SPATIAL TEMPORAL INDUCTIVE REASONING SEQUENCES AND PATTERNS ===",
    `Input: ${tokens.join(", ")}`,
    `Observed positions: [${observed.join(", ")}]`,
    `Missing positions: [${missing.join(", ")}]`,
    "Interpretation policy: lossless strings; leading zeros preserved.",
    "Warning: generated continuations are hypotheses, not official ground truth.",
    "",
  ];

  if (!candidates.length) {
    lines.push(
      "No candidate met the minimum structural coverage.",
      "Confidence: Indeterminate",
    );
    return {
      report: lines.join("\n"),
      confidence: "Indeterminate",
      entropy: 0,
      suggested: [],
    };
  }

  const shown = Math.min(cfg.maxShown, candidates.length);
  for (let k = 0; k < shown; k += 1) {
    const c = candidates[k]!;
    const blanks =
      missing.length === 0
        ? "(none)"
        : missing.map((i) => c.prediction[i - 1] ?? "?").join(", ");
    lines.push(
      `${k + 1}) ${c.name} [${c.family}]`,
      `   Rule: ${c.rule}`,
      `   Predicted blanks: ${blanks}`,
      `   Coverage=${c.coverage.toFixed(3)}  holdout-proxy=${c.holdout.toFixed(3)}  complexity=${c.complexity}  exceptions=${c.exceptions}`,
      `   Score=${c.score.toFixed(3)}  prediction-cluster weight=${c.clusterWeight.toFixed(3)}`,
    );
  }

  const { label, entropy } = confidenceOf(candidates);
  const suggested = missing.map((i) => candidates[0]!.prediction[i - 1] ?? "?");
  lines.push(
    "",
    `Suggested result: ${suggested.join(", ") || "(none)"}`,
    `Confidence: ${label}  (prediction entropy ${entropy.toFixed(3)})`,
    "Selection basis: exact coverage, compactness, exceptions, and prediction consensus.",
  );

  if (combined) {
    const f = featuresOf(tokens);
    lines.push(
      "",
      "=== COMBINED REFERENCE STYLE ACTIVATION ===",
      "Reference profile A: strict high-range sequence reasoning.",
      "Reference profile B: ordered spatial-temporal sequence reasoning.",
      "Policy: references activate operator families only; answers are not stored.",
      `Detected token features: ${featureText(f)}`,
      `Suggested reference families: ${referenceMatches(f).join(", ")}`,
      "",
      "=== SUGGESTED PART FOR EACH NUMERICAL METHOD USED ===",
      "1) Lossless tokenization — ACTIVE — Preserve every term before numeric conversion.",
      "2) Finite differences — ACTIVE FOR NUMERIC LANES — Apply to whole sequence and interleaved lanes.",
      "3) Interleaving and ordered lanes — ACTIVE — Test odd/even and periods 3–4.",
      `4) Partition beam search — ${f.partitionLikely ? "ACTIVE" : "AVAILABLE"} — Fixed/variable component boundaries.`,
      `5) Digit and block transforms — ${f.palindrome || f.repeatedDigits || f.variableWidth ? "ACTIVE" : "AVAILABLE"} — Reverse/rotate/repeat.`,
      "6) Affine / linear recurrence — ACTIVE — Low-parameter temporal models.",
      "7) Polynomial/Taylor fallback — LOW PRIORITY — Only when discrete models fail.",
      "8) Prediction clustering and MDL ranking — ACTIVE — Compact fit + consensus.",
      "",
      "=== SUGGESTED SPATIAL TEMPORAL INDUCTIVE REASONING SEQUENCES AND PATTERNS ===",
      `Primary search order: ${searchOrder(f).join(" -> ")}`,
      `Recommended discrete beam width: ${300 + 150 * Number(f.variableWidth) + 150 * Number(f.longToken) + 100 * Number(f.symbolic)}`,
      "Return multiple continuations when compact exact hypotheses disagree.",
      "Keep suggested_answer, confidence, and officially_verified as separate fields.",
      "Officially verified: false",
      "",
      "Notes / security: sequence text is scored locally in your browser. Do not paste secrets,",
      "passwords, or private credentials. Hypotheses only — not a legal, academic, or IQ verdict.",
    );
  }

  return { report: lines.join("\n"), confidence: label, entropy, suggested };
}

export type OrderedSpatialOptions = Partial<OsrConfig> & { combined?: boolean };

/**
 * Run Ordered Spatial Reasoning on a comma-separated sequence (? = missing).
 * Combined mode (default) adds V18 reference-style activation + method advice.
 */
export function runOrderedSpatialReasoning(
  sequenceText: string | string[],
  options: OrderedSpatialOptions = {},
): OsrResult {
  const cfg: OsrConfig = { ...DEFAULT_CFG, ...options };
  const combined = options.combined !== false;
  const tokens = tokenizeSequence(sequenceText);
  if (!tokens.length) {
    throw new Error("No sequence terms were found.");
  }

  const observed = tokens
    .map((t, i) => (isMissing(t) ? -1 : i + 1))
    .filter((i) => i > 0);
  const missing = tokens
    .map((t, i) => (isMissing(t) ? i + 1 : -1))
    .filter((i) => i > 0);

  let candidates: OsrCandidate[] = [
    ...constantModels(tokens),
    ...arithmeticModels(tokens),
    ...geometricModels(tokens),
    ...polynomialModels(tokens, cfg),
    ...affineModels(tokens),
    ...linearRecurrenceModels(tokens, cfg),
    ...interleavedModels(tokens, cfg),
    ...digitModels(tokens, cfg),
    ...partitionModels(tokens, cfg),
  ];

  candidates = candidates.map((c) => evaluate(c, tokens, cfg));
  candidates = candidates.filter((c) => c.coverage >= cfg.minCoverage);
  candidates.sort((a, b) => b.score - a.score);
  candidates = candidates.slice(0, cfg.beamWidth);
  candidates = clusterPredictions(candidates);
  candidates.sort((a, b) => b.score - a.score);

  const rendered = renderReport(tokens, observed, missing, candidates, cfg, combined);
  return {
    tokens,
    observed,
    missing,
    candidates,
    suggestedBlanks: rendered.suggested,
    confidence: rendered.confidence,
    predictionEntropy: rendered.entropy,
    report: rendered.report,
    officiallyVerified: false,
  };
}

/**
 * Score an ordered list of locate/path tokens for Babel high-variance recall.
 * Higher = more structured / lower entropy under OSR (prefer coherent islands).
 */
export function scoreSequenceStructure(parts: string[]): {
  score: number;
  confidence: OsrConfidence;
  reportSnippet: string;
} {
  const cleaned = parts.map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
  if (cleaned.length < 2) {
    return { score: 0, confidence: "Indeterminate", reportSnippet: "" };
  }
  // Encode as a numeric-ish token sequence when possible; else digit lengths / hashes
  const tokens = cleaned.map((p) => {
    const digits = p.replace(/[^0-9]/g, "");
    if (digits.length >= 1) return digits.slice(0, 12);
    return String(p.length);
  });
  try {
    const result = runOrderedSpatialReasoning(tokens, {
      combined: false,
      maxShown: 3,
      beamWidth: 80,
    });
    const top = result.candidates[0];
    const confBoost =
      result.confidence === "High"
        ? 40
        : result.confidence === "Medium"
          ? 24
          : result.confidence === "Low"
            ? 10
            : 0;
    const score = (top?.coverage ?? 0) * 60 + (top?.clusterWeight ?? 0) * 30 + confBoost;
    return {
      score,
      confidence: result.confidence,
      reportSnippet: top ? `${top.name}: ${top.rule}` : "",
    };
  } catch {
    return { score: 0, confidence: "Indeterminate", reportSnippet: "" };
  }
}
