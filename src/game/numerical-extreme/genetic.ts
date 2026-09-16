/**
 * Genetic Algorithm root approximation from NumericalAnalysisToolbox_V11.
 * Fitness = 1 / (|f(x)| + ε); blend crossover; Gaussian mutation; box bounds [a,b].
 */

import { compileScalar } from "./expr";

export type GeneticRootParams = {
  expression: string;
  a: number;
  b: number;
  populationSize?: number;
  generations?: number;
  mutationRate?: number;
  mutationStep?: number;
  seed?: number;
};

export type GeneticRootResult = {
  x: number;
  f: number;
  absoluteError: number;
  populationSize: number;
  generations: number;
  mutationRate: number;
  mutationStep: number;
  seed: number;
  history: Array<{ generation: number; bestX: number; bestAbsF: number }>;
  log: string[];
};

/** Mulberry32 — deterministic stream for reproducible GA runs. */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randn(rng: () => number): number {
  const u = Math.max(rng(), 1e-12);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function safeEval(f: (x: number) => number, x: number): number {
  try {
    const y = f(x);
    return Number.isFinite(y) ? y : Number.NaN;
  } catch {
    return Number.NaN;
  }
}

/**
 * V11 GUI-integrated GA root finder on [a, b].
 * Defaults match the Octave block: pop=50, gens=100, mutRate=0.10, mutStep=0.05.
 */
export function runGeneticRootFinder(params: GeneticRootParams): GeneticRootResult {
  const {
    expression,
    a,
    b,
    populationSize = 50,
    generations = 100,
    mutationRate = 0.1,
    mutationStep = 0.05,
    seed = 1234,
  } = params;

  if (!(Number.isFinite(a) && Number.isFinite(b) && a < b)) {
    throw new Error("Interval must satisfy a < b.");
  }
  if (!Number.isInteger(populationSize) || populationSize < 4) {
    throw new Error("Population size must be an integer ≥ 4.");
  }
  if (!Number.isInteger(generations) || generations < 1) {
    throw new Error("Generations must be a positive integer.");
  }
  if (!(mutationRate >= 0 && mutationRate <= 1)) {
    throw new Error("Mutation rate must be in [0, 1].");
  }
  if (!(mutationStep >= 0)) {
    throw new Error("Mutation step must be ≥ 0.");
  }

  const f = compileScalar(expression);
  const rng = mulberry32(seed);
  let pop = Array.from({ length: populationSize }, () => a + (b - a) * rng());
  const history: GeneticRootResult["history"] = [];

  let bestX = pop[0]!;
  let bestAbs = Number.POSITIVE_INFINITY;
  let lastErr = new Array<number>(populationSize).fill(Number.POSITIVE_INFINITY);

  for (let g = 1; g <= generations; g += 1) {
    const vals = pop.map((x) => safeEval(f, x));
    const err = vals.map((y) => (Number.isFinite(y) ? Math.abs(y) : Number.POSITIVE_INFINITY));
    lastErr = err;
    const fitness = err.map((e) => 1 / (e + 1e-8));
    const sumFit = fitness.reduce((s, v) => s + v, 0);
    const prob = fitness.map((v) => v / sumFit);
    const cum: number[] = [];
    let running = 0;
    for (const p of prob) {
      running += p;
      cum.push(running);
    }

    const pick = () => {
      const r = rng();
      const idx = cum.findIndex((c) => c >= r);
      return pop[idx < 0 ? populationSize - 1 : idx]!;
    };

    const newPop = new Array<number>(populationSize);
    for (let i = 0; i < populationSize; i += 2) {
      const p1 = pick();
      const p2 = pick();
      const alpha = rng();
      newPop[i] = alpha * p1 + (1 - alpha) * p2;
      if (i + 1 < populationSize) {
        newPop[i + 1] = alpha * p2 + (1 - alpha) * p1;
      }
    }

    for (let i = 0; i < populationSize; i += 1) {
      if (rng() < mutationRate) {
        newPop[i]! += randn(rng) * mutationStep;
      }
      newPop[i] = Math.max(a, Math.min(b, newPop[i]!));
    }
    pop = newPop;

    let genBest = 0;
    for (let i = 1; i < populationSize; i += 1) {
      if (err[i]! < err[genBest]!) genBest = i;
    }
    // Re-evaluate on current pop after mutation for history (use pre-mutation err of survivors is ok;
    // V11 reported min(err) from last fitness eval before replacement — we recompute on new pop).
    const postVals = pop.map((x) => safeEval(f, x));
    const postErr = postVals.map((y) => (Number.isFinite(y) ? Math.abs(y) : Number.POSITIVE_INFINITY));
    let bi = 0;
    for (let i = 1; i < populationSize; i += 1) {
      if (postErr[i]! < postErr[bi]!) bi = i;
    }
    if (postErr[bi]! < bestAbs) {
      bestAbs = postErr[bi]!;
      bestX = pop[bi]!;
    }
    if (g === 1 || g === generations || g % Math.max(1, Math.floor(generations / 10)) === 0) {
      history.push({ generation: g, bestX: pop[bi]!, bestAbsF: postErr[bi]! });
    }
  }

  // Final best from last population (matches V11 min(err) on last fitness vector intent)
  const finalVals = pop.map((x) => safeEval(f, x));
  const finalErr = finalVals.map((y) => (Number.isFinite(y) ? Math.abs(y) : Number.POSITIVE_INFINITY));
  let idx = 0;
  for (let i = 1; i < populationSize; i += 1) {
    if (finalErr[i]! < finalErr[idx]!) idx = i;
  }
  const xGA = pop[idx]!;
  const fGA = finalVals[idx]!;
  void lastErr;

  const log = [
    "=== Genetic Algorithm (GA) Root Approximation ===",
    `f(x) = ${expression}`,
    `interval = [${a}, ${b}]`,
    `popSize=${populationSize}, generations=${generations}`,
    `mutationRate=${mutationRate}, mutationStep=${mutationStep}, seed=${seed}`,
    "GA result:",
    `    x ≈ ${xGA}`,
    `    f(x) ≈ ${Number.isFinite(fGA) ? fGA.toExponential(3) : "NaN"}`,
    `    |f(x)| ≈ ${Number.isFinite(fGA) ? Math.abs(fGA).toExponential(3) : "Inf"}`,
  ];

  return {
    x: xGA,
    f: fGA,
    absoluteError: Math.abs(fGA),
    populationSize,
    generations,
    mutationRate,
    mutationStep,
    seed,
    history,
    log,
  };
}
