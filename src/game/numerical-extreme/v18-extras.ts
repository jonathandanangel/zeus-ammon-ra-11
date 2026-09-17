/**
 * V18 extras for Numerical Extreme — graph-optimized x answers +
 * vibration / resonance ordered-sequence reasoning.
 * Ported from NumericalAnalysisToolbox_V18.
 */

import type { FunctionAnalysisResult, VibrationResult } from "./types";
import { compileScalar } from "./expr";

function formatNumber(value: number | null | undefined, digits = 6): string {
  if (value == null || !Number.isFinite(value)) return "—";
  if (Math.abs(value) !== 0 && (Math.abs(value) < 1e-4 || Math.abs(value) >= 1e6)) {
    return value.toExponential(Math.max(0, digits - 1));
  }
  return value.toPrecision(digits);
}

function medianPositiveDiff(x: number[]): number {
  const d0: number[] = [];
  const uniq = [...new Set(x)].sort((a, b) => a - b);
  for (let i = 1; i < uniq.length; i += 1) {
    const d = uniq[i]! - uniq[i - 1]!;
    if (Number.isFinite(d) && d > 0) d0.push(d);
  }
  if (!d0.length) return 1;
  d0.sort((a, b) => a - b);
  return d0[Math.floor(d0.length / 2)]!;
}

function safeEval(fn: (x: number) => number, x: number): number {
  try {
    const y = fn(x);
    return Number.isFinite(y) ? y : NaN;
  } catch {
    return NaN;
  }
}

function graphBisectionRefine(
  f: (x: number) => number,
  a: number,
  b: number,
  tol: number,
  maxit: number,
): { x: number; f: number } {
  let left = a;
  let right = b;
  let fa = safeEval(f, left);
  let fb = safeEval(f, right);
  let xbest = 0.5 * (left + right);
  let fbest = safeEval(f, xbest);
  if (!Number.isFinite(fa) || !Number.isFinite(fb) || fa * fb > 0) {
    return { x: xbest, f: fbest };
  }
  for (let k = 0; k < maxit; k += 1) {
    const m = 0.5 * (left + right);
    const fm = safeEval(f, m);
    if (!Number.isFinite(fm)) break;
    xbest = m;
    fbest = fm;
    if (Math.abs(fm) <= tol || Math.abs(right - left) <= tol * (1 + Math.abs(m))) break;
    if (fa * fm <= 0) {
      right = m;
      fb = fm;
    } else {
      left = m;
      fa = fm;
    }
  }
  return { x: xbest, f: fbest };
}

/**
 * Uses plotted x/f(x) samples as evidence, then refines and clusters candidate x answers.
 */
export function optimizeGraphXOutputs(result: FunctionAnalysisResult): string {
  const lines: string[] = [
    "=== SUGGESTED GRAPH-OPTIMIZED X OUTPUT ANSWERS ===",
    "Evidence source: plotted finite x/f(x) samples plus local refinement.",
  ];

  const pairs = result.plot.x
    .map((x, i) => ({ x, f: result.plot.y[i] }))
    .filter(
      (p): p is { x: number; f: number } =>
        Number.isFinite(p.x) && typeof p.f === "number" && Number.isFinite(p.f),
    )
    .sort((a, b) => a.x - b.x);

  if (!pairs.length) {
    lines.push("No finite graph samples were available.");
    return lines.join("\n");
  }

  let fn: (x: number) => number;
  try {
    fn = compileScalar(result.expression.normalized);
  } catch {
    fn = (x: number) => {
      const i = pairs.findIndex((p) => Math.abs(p.x - x) < 1e-12);
      return i >= 0 ? pairs[i]!.f : NaN;
    };
  }

  const xs = pairs.map((p) => p.x);
  const fs = pairs.map((p) => p.f);
  const candX: number[] = [];
  const candF: number[] = [];
  const source: string[] = [];

  const order = fs.map((f, i) => ({ i, a: Math.abs(f) })).sort((a, b) => a.a - b.a);
  for (const { i } of order.slice(0, 12)) {
    candX.push(xs[i]!);
    candF.push(safeEval(fn, xs[i]!));
    source.push("nearest plotted sample");
  }

  const tol = 1e-6;
  const maxit = 200;

  for (let i = 0; i < xs.length - 1; i += 1) {
    if (fs[i] === 0) {
      candX.push(xs[i]!);
      candF.push(fs[i]!);
      source.push("exact plotted zero");
    } else if (fs[i]! * fs[i + 1]! < 0) {
      const refined = graphBisectionRefine(fn, xs[i]!, xs[i + 1]!, tol, maxit);
      candX.push(refined.x);
      candF.push(refined.f);
      source.push("sign-change bisection");
    }
  }

  const AF = fs.map(Math.abs);
  for (let i = 1; i < xs.length - 1; i += 1) {
    if (AF[i]! <= AF[i - 1]! && AF[i]! <= AF[i + 1]!) {
      // Golden-section-ish local |f| min on [x_{i-1}, x_{i+1}]
      let lo = xs[i - 1]!;
      let hi = xs[i + 1]!;
      for (let k = 0; k < 40; k += 1) {
        const m1 = lo + (hi - lo) * 0.382;
        const m2 = lo + (hi - lo) * 0.618;
        if (Math.abs(safeEval(fn, m1)) < Math.abs(safeEval(fn, m2))) hi = m2;
        else lo = m1;
      }
      const xm = 0.5 * (lo + hi);
      candX.push(xm);
      candF.push(safeEval(fn, xm));
      source.push("local |f| graph minimum");
    }
  }

  const valid = candX
    .map((x, i) => ({ x, f: candF[i]!, s: source[i]! }))
    .filter(
      (c) =>
        Number.isFinite(c.x) &&
        Number.isFinite(c.f) &&
        c.x >= Math.min(...xs) &&
        c.x <= Math.max(...xs),
    )
    .sort((a, b) => a.x - b.x);

  if (!valid.length) {
    lines.push("No candidate x answers could be refined.");
    return lines.join("\n");
  }

  const scale = Math.max(1, Math.max(...xs.map(Math.abs)));
  const clusterTol = Math.max(10 * tol, 1e-10 * scale, 0.25 * medianPositiveDiff(xs));

  type Cluster = {
    x: number;
    bestF: number;
    count: number;
    sources: string[];
    spread: number;
    score: number;
  };
  const clusters: Cluster[] = [];
  let k = 0;
  while (k < valid.length) {
    let j = k;
    while (j < valid.length - 1 && Math.abs(valid[j + 1]!.x - valid[j]!.x) <= clusterTol) j += 1;
    const ids = valid.slice(k, j + 1);
    const weights = ids.map((c) => 1 / Math.max(Math.abs(c.f), Number.EPSILON));
    const wSum = weights.reduce((a, b) => a + b, 0);
    const xc = ids.reduce((s, c, i) => s + c.x * weights[i]!, 0) / wSum;
    let bestAbs = Infinity;
    let fc = ids[0]!.f;
    for (const c of ids) {
      if (Math.abs(c.f) < bestAbs) {
        bestAbs = Math.abs(c.f);
        fc = c.f;
      }
    }
    const src = [...new Set(ids.map((c) => c.s))];
    const spread = Math.max(...ids.map((c) => c.x)) - Math.min(...ids.map((c) => c.x));
    const methodBonus = 6 * src.length + 3 * ids.length;
    const bracketBonus =
      12 * Number(src.includes("sign-change bisection")) +
      12 * Number(src.includes("bracketed fzero"));
    const residualScore = -Math.log10(Math.max(bestAbs, Number.MIN_VALUE));
    const score = methodBonus + bracketBonus + 8 * residualScore - (2 * spread) / Math.max(clusterTol, Number.EPSILON);
    clusters.push({ x: xc, bestF: fc, count: ids.length, sources: src, spread, score });
    k = j + 1;
  }

  clusters.sort((a, b) => b.score - a.score);
  const best = clusters[0]!;
  lines.push(
    `Graph domain: [${formatNumber(Math.min(...xs), 12)}, ${formatNumber(Math.max(...xs), 12)}], samples=${xs.length}`,
    `Candidate evaluations: ${valid.length}, clusters=${clusters.length}, cluster tolerance=${formatNumber(clusterTol, 3)}`,
    "Ranking model: residual accuracy + cross-method agreement + bracket evidence - cluster spread.",
    "",
  );
  for (let i = 0; i < Math.min(6, clusters.length); i += 1) {
    const c = clusters[i]!;
    lines.push(
      `${i + 1}) x ~= ${formatNumber(c.x, 15)}`,
      `   f(x)=${formatNumber(c.bestF, 6)}, |f(x)|=${formatNumber(Math.abs(c.bestF), 6)}`,
      `   agreement=${c.count}, spread=${formatNumber(c.spread, 3)}, score=${formatNumber(c.score, 3)}`,
      `   sources: ${c.sources.join(", ")}`,
    );
  }
  const conf =
    Math.abs(best.bestF) <= tol
      ? "High numerical confidence"
      : Math.abs(best.bestF) <= 10 * tol
        ? "Medium numerical confidence"
        : "Low numerical confidence; graph minimum may not be a root";
  lines.push(
    "",
    `Suggested best-fit x answer: ${formatNumber(best.x, 15)}`,
    `Best validated residual: |f(x)|=${formatNumber(Math.abs(best.bestF), 6)}`,
    `Confidence: ${conf}`,
    "This x answer is inferred from the graph and numerical residual, not from an IQ-sequence answer key.",
    "",
    "=== SUGGESTED SPATIAL TEMPORAL INDUCTIVE REASONING FROM NUMERICAL OUTPUT ===",
    "Treat successive numerical-method x estimates as an ordered convergence sequence.",
    "Prefer the cluster supported by independent methods and the smallest validated |f(x)|.",
    "Use graph position as spatial evidence and iteration order as temporal evidence.",
    "Do not select a visually central point when its residual is inferior.",
    "",
    "Notes / security: analysis runs locally in your browser. Do not paste secrets or credentials",
    "into expressions. Heuristic numerical evidence only — not a legal or academic verdict.",
  );
  return lines.join("\n");
}

/** V18 advanced vibration / resonance + ordered peak-sequence reasoning. */
export function buildVibrationV18Analysis(result: VibrationResult): string {
  const lines: string[] = [
    "=== V18 SUGGESTED VIBRATION AND RESONANCE OUTPUT ===",
  ];
  const wn = result.naturalFrequency;
  const z = result.dampingRatio;
  const cc = result.parameters.criticalDamping;
  lines.push(`critical damping cc = ${formatNumber(cc, 12)} N*s/m`);
  const cls =
    z === 0
      ? "Undamped"
      : z < 1
        ? "Underdamped"
        : Math.abs(z - 1) < 1e-10
          ? "Critically damped"
          : "Overdamped";
  lines.push(`classification = ${cls}; zeta = ${formatNumber(z, 12)}`);
  lines.push(`wn = ${formatNumber(wn, 12)} rad/s; fn = ${formatNumber(wn / (2 * Math.PI), 12)} Hz`);
  if (z < 1) {
    const wd = wn * Math.sqrt(1 - z * z);
    lines.push(`wd = ${formatNumber(wd, 12)} rad/s; Td = ${formatNumber((2 * Math.PI) / wd, 12)} s`);
  }

  if (result.mode === "forced") {
    const Mfun = (r: number) =>
      1 / Math.sqrt((1 - r * r) ** 2 + (2 * z * r) ** 2);
    const rgrid = (
      (result.plot["ratioGrid"] ?? result.plot["frequencyRatio"] ?? []) as number[]
    ).filter((v): v is number => typeof v === "number" && Number.isFinite(v));
    const Mgrid = (
      (result.plot["magnificationGrid"] ?? result.plot["magnification"] ?? []) as number[]
    ).map((v) => (typeof v === "number" ? v : NaN));
    let Mg = -Infinity;
    let rg = 0;
    for (let i = 0; i < Mgrid.length; i += 1) {
      if (Number.isFinite(Mgrid[i]) && Mgrid[i]! > Mg) {
        Mg = Mgrid[i]!;
        rg = rgrid[i] ?? 0;
      }
    }
    // Refine peak on [0, max r]
    const rmax = rgrid.length ? Math.max(...rgrid.filter(Number.isFinite)) : 3;
    let rr = rg;
    let Mr = Mg;
    let lo = 0;
    let hi = rmax;
    for (let k = 0; k < 48; k += 1) {
      const m1 = lo + (hi - lo) * 0.382;
      const m2 = lo + (hi - lo) * 0.618;
      if (Mfun(m1) > Mfun(m2)) hi = m2;
      else lo = m1;
    }
    rr = 0.5 * (lo + hi);
    Mr = Mfun(rr);

    if (z < Math.SQRT1_2) {
      const ra = Math.sqrt(Math.max(0, 1 - 2 * z * z));
      lines.push(
        `analytical displacement peak: r=${formatNumber(ra, 12)}, omega=${formatNumber(ra * wn, 12)} rad/s, M=${formatNumber(Mfun(ra), 12)}`,
      );
    } else {
      lines.push("No nonzero displacement-resonance peak for zeta >= 1/sqrt(2).");
    }
    lines.push(
      `sampled graph peak: r=${formatNumber(rg, 12)}, omega=${formatNumber(rg * wn, 12)} rad/s, M=${formatNumber(Mg, 12)}`,
      `refined graph peak: r=${formatNumber(rr, 12)}, omega=${formatNumber(rr * wn, 12)} rad/s, M=${formatNumber(Mr, 12)}`,
    );
    const ruser = result.forcing?.frequencyRatio ?? 0;
    const Muser = Mfun(ruser);
    lines.push(
      `operating point: r=${formatNumber(ruser, 12)}, M=${formatNumber(Muser, 12)}, X=${formatNumber(result.amplitude, 12)} m`,
      `response proximity to refined peak = ${formatNumber(Muser / Math.max(Mr, Number.EPSILON), 6)}`,
    );
    const band =
      Math.abs(ruser - rr) <= 0.1 * Math.max(rr, Number.EPSILON)
        ? "Near resonance"
        : ruser < rr
          ? "Below resonance"
          : "Above resonance";
    lines.push(`operating region = ${band}`);
    const seq = z < Math.SQRT1_2 ? [rg, rr, Math.sqrt(Math.max(0, 1 - 2 * z * z))] : [rg, rr];
    lines.push(
      `ordered peak-candidate sequence = [${seq.map((s) => formatNumber(s, 12)).join(", ")}]`,
      "sequence reasoning: prefer the repeated/clustered peak supported by sampled, refined, and analytical models.",
    );
  } else {
    const t = (result.plot["time"] ?? []) as number[];
    const x = (result.plot["displacement"] ?? []) as number[];
    const peaks: Array<{ t: number; x: number }> = [];
    for (let i = 1; i < x.length - 1; i += 1) {
      if (x[i]! >= x[i - 1]! && x[i]! > x[i + 1]! && x[i]! > 0) {
        peaks.push({ t: t[i]!, x: x[i]! });
      }
    }
    lines.push(`graph feature extraction: ${peaks.length} positive peaks detected`);
    if (peaks.length >= 2) {
      const periods = peaks.slice(1).map((p, i) => p.t - peaks[i]!.t);
      const decrements = peaks
        .slice(0, -1)
        .map((p, i) => Math.log(Math.abs(p.x / peaks[i + 1]!.x)));
      const wdSeq = periods.map((P) => (2 * Math.PI) / P);
      const zSeq = decrements.map(
        (d) => d / Math.sqrt(4 * Math.PI * Math.PI + d * d),
      );
      const med = (arr: number[]) => {
        const a = arr.filter(Number.isFinite).sort((u, v) => u - v);
        return a.length ? a[Math.floor(a.length / 2)]! : NaN;
      };
      lines.push(
        `peak-time sequence = [${peaks
          .slice(0, 8)
          .map((p) => formatNumber(p.t, 8))
          .join(", ")}]`,
        `peak-amplitude sequence = [${peaks
          .slice(0, 8)
          .map((p) => formatNumber(p.x, 8))
          .join(", ")}]`,
        `sequence-estimated wd median = ${formatNumber(med(wdSeq), 12)} rad/s`,
        `sequence-estimated zeta median = ${formatNumber(med(zSeq), 12)}`,
        "sequence reasoning: repeated peak spacing estimates period; repeated amplitude ratios estimate damping.",
      );
    }
    let mx = 0;
    let tm = 0;
    for (let i = 0; i < x.length; i += 1) {
      if (Math.abs(x[i]!) > mx) {
        mx = Math.abs(x[i]!);
        tm = t[i] ?? 0;
      }
    }
    lines.push(`maximum |x(t)| = ${formatNumber(mx, 12)} m at t = ${formatNumber(tm, 12)} s`);
  }

  lines.push(
    "Interpretation warning: response optimization is not a mechanical safety certification.",
    "",
    "Notes / security: vibration analysis runs locally. Do not paste secrets into parameters.",
  );
  return lines.join("\n");
}
