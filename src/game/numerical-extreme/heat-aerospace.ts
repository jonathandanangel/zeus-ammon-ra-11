/**
 * Heat Transfer Aerospace Numerical Toolbox V2 — TypeScript port.
 * Octave-native laboratories (rev 15 Sep 2026) plus sparse Krylov solvers.
 *
 * Fidelity: mathematical reimplementation / modern demos related to the ACM map
 * (FISHPAK, PDECOL, PDETWO, BDMG, BACOLR, LSQR, ITPACK, UMFPACK, GMRES,
 * L-BFGS-B, ADOL-C, IFISS). Not line-by-line Fortran ports.
 */

export type SparseCOO = {
  n: number;
  rows: number[];
  cols: number[];
  values: number[];
};

function spEmpty(n: number): SparseCOO {
  return { n, rows: [], cols: [], values: [] };
}

function spPut(A: SparseCOO, i: number, j: number, v: number): void {
  A.rows.push(i);
  A.cols.push(j);
  A.values.push(v);
}

function spNnz(A: SparseCOO): number {
  return A.values.length;
}

/** y = A x for COO (accumulates duplicates). */
function spMatVec(A: SparseCOO, x: number[]): number[] {
  const y = new Array<number>(A.n).fill(0);
  for (let k = 0; k < A.values.length; k += 1) {
    y[A.rows[k]!]! += A.values[k]! * x[A.cols[k]!]!;
  }
  return y;
}

function spMatVecT(A: SparseCOO, x: number[]): number[] {
  const y = new Array<number>(A.n).fill(0);
  for (let k = 0; k < A.values.length; k += 1) {
    y[A.cols[k]!]! += A.values[k]! * x[A.rows[k]!]!;
  }
  return y;
}

function denseFromSparse(A: SparseCOO): number[][] {
  const M = Array.from({ length: A.n }, () => new Array<number>(A.n).fill(0));
  for (let k = 0; k < A.values.length; k += 1) {
    M[A.rows[k]!]![A.cols[k]!]! += A.values[k]!;
  }
  return M;
}

function solveDense(A: number[][], b: number[]): number[] {
  const fact = luFactor(A);
  return luSolve(fact, b);
}

/** In-place LU with partial pivoting; returns factors + pivot vector. */
function luFactor(A: number[][]): { lu: number[][]; piv: number[] } {
  const n = A.length;
  const lu = A.map((row) => [...row]);
  const piv = Array.from({ length: n }, (_, i) => i);
  for (let col = 0; col < n; col += 1) {
    let pivRow = col;
    let maxAbs = Math.abs(lu[col]![col]!);
    for (let r = col + 1; r < n; r += 1) {
      const a = Math.abs(lu[r]![col]!);
      if (a > maxAbs) {
        maxAbs = a;
        pivRow = r;
      }
    }
    if (maxAbs < 1e-15) throw new Error("Singular matrix in LU factorization.");
    if (pivRow !== col) {
      const tmp = lu[col]!;
      lu[col] = lu[pivRow]!;
      lu[pivRow] = tmp;
      const tp = piv[col]!;
      piv[col] = piv[pivRow]!;
      piv[pivRow] = tp;
    }
    const diag = lu[col]![col]!;
    for (let r = col + 1; r < n; r += 1) {
      const f = lu[r]![col]! / diag;
      lu[r]![col] = f;
      for (let j = col + 1; j < n; j += 1) lu[r]![j]! -= f * lu[col]![j]!;
    }
  }
  return { lu, piv };
}

function luSolve(fact: { lu: number[][]; piv: number[] }, b: number[]): number[] {
  const n = b.length;
  const { lu, piv } = fact;
  const y = new Array<number>(n);
  for (let i = 0; i < n; i += 1) {
    let s = b[piv[i]!]!;
    for (let j = 0; j < i; j += 1) s -= lu[i]![j]! * y[j]!;
    y[i] = s;
  }
  const x = new Array<number>(n);
  for (let i = n - 1; i >= 0; i -= 1) {
    let s = y[i]!;
    for (let j = i + 1; j < n; j += 1) s -= lu[i]![j]! * x[j]!;
    x[i] = s / lu[i]![i]!;
  }
  return x;
}

function norm2(v: number[]): number {
  return Math.sqrt(v.reduce((s, x) => s + x * x, 0));
}

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i += 1) s += a[i]! * b[i]!;
  return s;
}

function axpy(a: number, x: number[], y: number[]): number[] {
  return y.map((yi, i) => a * x[i]! + yi);
}

function scale(a: number, x: number[]): number[] {
  return x.map((xi) => a * xi);
}

export type PlateParams = {
  nx: number;
  ny: number;
  Lx: number;
  Ly: number;
  k: number;
  Tl: number;
  Tr: number;
  Tb: number;
  Tinf: number;
  hconv: number;
};

export type PlateSystem = {
  A: SparseCOO;
  b: number[];
  xv: number[];
  yv: number[];
  nx: number;
  ny: number;
};

export function plateMatrix(p: PlateParams): PlateSystem {
  const { nx, ny, Lx, Ly, k, Tl, Tr, Tb, Tinf, hconv } = p;
  if (nx < 3 || ny < 3) throw new Error("Grid must be at least 3×3.");
  if (Lx <= 0 || Ly <= 0 || k <= 0 || hconv < 0) {
    throw new Error("Geometry/conductivity must be positive; h ≥ 0.");
  }
  const dx = Lx / (nx - 1);
  const dy = Ly / (ny - 1);
  const N = nx * ny;
  const A = spEmpty(N);
  const b = new Array<number>(N).fill(0);
  for (let jy = 0; jy < ny; jy += 1) {
    for (let ix = 0; ix < nx; ix += 1) {
      const pidx = ix + jy * nx;
      if (ix === 0) {
        spPut(A, pidx, pidx, 1);
        b[pidx] = Tl;
      } else if (ix === nx - 1) {
        spPut(A, pidx, pidx, 1);
        b[pidx] = Tr;
      } else if (jy === 0) {
        spPut(A, pidx, pidx, 1);
        b[pidx] = Tb;
      } else if (jy === ny - 1) {
        spPut(A, pidx, pidx, k / dy + hconv);
        spPut(A, pidx, pidx - nx, -k / dy);
        b[pidx] = hconv * Tinf;
      } else {
        const cx = 1 / (dx * dx);
        const cy = 1 / (dy * dy);
        spPut(A, pidx, pidx, 2 * cx + 2 * cy);
        spPut(A, pidx, pidx - 1, -cx);
        spPut(A, pidx, pidx + 1, -cx);
        spPut(A, pidx, pidx - nx, -cy);
        spPut(A, pidx, pidx + nx, -cy);
      }
    }
  }
  const xv = Array.from({ length: nx }, (_, i) => (i * Lx) / (nx - 1));
  const yv = Array.from({ length: ny }, (_, i) => (i * Ly) / (ny - 1));
  return { A, b, xv, yv, nx, ny };
}

export type SteadyPlateResult = {
  module: string;
  temperature: number[][];
  xv: number[];
  yv: number[];
  residual: number;
  elapsedMs: number;
  unknowns: number;
  nnz: number;
  log: string[];
};

export function runSteadyPlate(p: PlateParams): SteadyPlateResult {
  // Browser dense solve: keep grids modest (Octave allows up to 250).
  if (p.nx > 31 || p.ny > 31) throw new Error("Steady grid capped at 31×31 in the browser.");
  const sys = plateMatrix(p);
  const t0 = performance.now();
  const T = solveDense(denseFromSparse(sys.A), sys.b);
  const elapsedMs = performance.now() - t0;
  const r = spMatVec(sys.A, T).map((v, i) => v - sys.b[i]!);
  const residual = r.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  const temperature = Array.from({ length: sys.ny }, (_, j) =>
    Array.from({ length: sys.nx }, (_, i) => T[i + j * sys.nx]!),
  );
  const tMin = Math.min(...T);
  const tMax = Math.max(...T);
  return {
    module: "steady_plate",
    temperature,
    xv: sys.xv,
    yv: sys.yv,
    residual,
    elapsedMs,
    unknowns: T.length,
    nnz: spNnz(sys.A),
    log: [
      `Steady plate: ${sys.nx}×${sys.ny} grid`,
      `Unknowns: ${T.length}, nnz(A): ${spNnz(sys.A)}`,
      `Temperature range: ${tMin.toPrecision(6)} to ${tMax.toPrecision(6)} K`,
      `Algebraic residual ∞-norm: ${residual.toExponential(3)}`,
      `Solve time: ${(elapsedMs / 1000).toFixed(4)} s`,
    ],
  };
}

export type TransientPlateResult = {
  module: string;
  temperature: number[][];
  history: Array<{ t: number; meanT: number }>;
  xv: number[];
  yv: number[];
  log: string[];
};

export function runTransientPlate(
  p: PlateParams & { rho: number; cp: number; T0: number; dt: number; tf: number },
): TransientPlateResult {
  // Dense O(n³) per step crashed the tab — factor M once + hard caps.
  if (p.nx > 17 || p.ny > 17) {
    throw new Error("Transient grid capped at 17×17 in the browser (was freezing the page).");
  }
  if (!(p.dt > 0 && p.tf > 0 && p.rho > 0 && p.cp > 0)) {
    throw new Error("rho, cp, dt, and final time must be positive.");
  }
  let dt = p.dt;
  let steps = Math.ceil(p.tf / dt);
  const MAX_STEPS = 48;
  if (steps > MAX_STEPS) {
    dt = p.tf / MAX_STEPS;
    steps = MAX_STEPS;
  }
  const sys = plateMatrix(p);
  const n = sys.b.length;
  const nx = sys.nx;
  const ny = sys.ny;
  const fixed = new Array<boolean>(n).fill(false);
  for (let i = 0; i < nx; i += 1) fixed[i] = true; // bottom
  for (let j = 0; j < ny; j += 1) {
    fixed[j * nx] = true;
    fixed[j * nx + nx - 1] = true;
  }
  const alpha = p.k / (p.rho * p.cp);
  const scale = alpha;
  const Ad = denseFromSparse(sys.A);
  const M = Ad.map((row, i) =>
    row.map((v, j) => (i === j ? 1 + dt * scale * v : dt * scale * v)),
  );
  // Dirichlet rows once (matches Octave identity rows on fixed DOFs).
  for (let i = 0; i < n; i += 1) {
    if (!fixed[i]) continue;
    for (let j = 0; j < n; j += 1) M[i]![j] = i === j ? 1 : 0;
  }
  const fact = luFactor(M);
  let T = new Array<number>(n).fill(p.T0);
  for (let i = 0; i < n; i += 1) if (fixed[i]) T[i] = sys.b[i]!;
  const history: TransientPlateResult["history"] = [
    { t: 0, meanT: T.reduce((s, v) => s + v, 0) / n },
  ];
  const rhs = new Array<number>(n);
  for (let it = 1; it <= steps; it += 1) {
    for (let i = 0; i < n; i += 1) {
      rhs[i] = fixed[i] ? sys.b[i]! : T[i]! + dt * scale * sys.b[i]!;
    }
    T = luSolve(fact, rhs);
    history.push({
      t: Math.min(it * dt, p.tf),
      meanT: T.reduce((s, v) => s + v, 0) / n,
    });
  }
  const temperature = Array.from({ length: ny }, (_, j) =>
    Array.from({ length: nx }, (_, i) => T[i + j * nx]!),
  );
  const note =
    dt !== p.dt
      ? ` (dt auto-adjusted ${p.dt} → ${dt.toPrecision(4)} for ≤${MAX_STEPS} steps)`
      : "";
  return {
    module: "transient_plate",
    temperature,
    history,
    xv: sys.xv,
    yv: sys.yv,
    log: [
      `Transient plate: ${steps} steps, α = ${alpha.toExponential(4)} m²/s${note}`,
      `Factored backward-Euler once (LU) — browser-safe`,
      `Final mean temperature: ${(T.reduce((s, v) => s + v, 0) / n).toPrecision(6)} K`,
    ],
  };
}

export type FinResult = {
  module: string;
  x: number[];
  temperature: number[];
  heatLoss: number[];
  heatRate: number;
  efficiency: number;
  m: number;
  log: string[];
};

export function runStraightFin(p: {
  L: number;
  k: number;
  Tb: number;
  Tinf: number;
  hconv: number;
  P: number;
  Ac: number;
}): FinResult {
  const { L, k, Tb, Tinf, hconv, P, Ac } = p;
  if ([L, k, hconv, P, Ac].some((v) => !(v > 0))) {
    throw new Error("L, k, h, perimeter, and area must be positive.");
  }
  const x = Array.from({ length: 250 }, (_, i) => (i * L) / 249);
  const m = Math.sqrt((hconv * P) / (k * Ac));
  const theta_b = Tb - Tinf;
  const temperature = x.map(
    (xi) => Tinf + (theta_b * Math.cosh(m * (L - xi))) / Math.cosh(m * L),
  );
  const heatLoss = temperature.map((T) => hconv * P * (T - Tinf));
  const heatRate = Math.sqrt(hconv * P * k * Ac) * theta_b * Math.tanh(m * L);
  const efficiency = Math.tanh(m * L) / (m * L);
  return {
    module: "straight_fin",
    x,
    temperature,
    heatLoss,
    heatRate,
    efficiency,
    m,
    log: [
      `Fin parameter m: ${m.toPrecision(6)} 1/m`,
      `Fin heat rate: ${heatRate.toPrecision(6)} W`,
      `Fin efficiency: ${efficiency.toFixed(6)}`,
      `Tip temperature: ${temperature[temperature.length - 1]!.toPrecision(6)} K`,
    ],
  };
}

export type AtmosphereResult = {
  module: string;
  altitude: number[];
  temperature: number[];
  pressure: number[];
  density: number[];
  soundSpeed: number[];
  log: string[];
};

export function runStandardAtmosphere(H: number): AtmosphereResult {
  if (!(H >= 0 && H <= 84852)) throw new Error("Altitude must be from 0 to 84852 m.");
  const hs = Array.from({ length: 300 }, (_, i) => (i * H) / 299);
  const { T, p, rho, a } = atmosphere(hs);
  return {
    module: "standard_atmosphere",
    altitude: hs,
    temperature: T,
    pressure: p,
    density: rho,
    soundSpeed: a,
    log: [
      `Altitude: ${(H / 1000).toFixed(3)} km`,
      `Temperature: ${T[T.length - 1]!.toPrecision(6)} K`,
      `Pressure: ${p[p.length - 1]!.toPrecision(6)} Pa`,
      `Density: ${rho[rho.length - 1]!.toPrecision(6)} kg/m³`,
      `Speed of sound: ${a[a.length - 1]!.toPrecision(6)} m/s`,
    ],
  };
}

function atmosphere(h: number[]): {
  T: number[];
  p: number[];
  rho: number[];
  a: number[];
} {
  const Hb = [0, 11000, 20000, 32000, 47000, 51000, 71000, 84852];
  const L = [-0.0065, 0, 0.001, 0.0028, 0, -0.0028, -0.002];
  const Tbase = new Array<number>(Hb.length).fill(0);
  const pbase = new Array<number>(Hb.length).fill(0);
  Tbase[0] = 288.15;
  pbase[0] = 101325;
  const g = 9.80665;
  const R = 287.05287;
  for (let i = 0; i < 7; i += 1) {
    Tbase[i + 1] = Tbase[i]! + L[i]! * (Hb[i + 1]! - Hb[i]!);
    if (L[i] === 0) {
      pbase[i + 1] = pbase[i]! * Math.exp((-g * (Hb[i + 1]! - Hb[i]!)) / (R * Tbase[i]!));
    } else {
      pbase[i + 1] = pbase[i]! * (Tbase[i]! / Tbase[i + 1]!) ** (g / (R * L[i]!));
    }
  }
  const T = new Array<number>(h.length);
  const p = new Array<number>(h.length);
  for (let j = 0; j < h.length; j += 1) {
    let i = 0;
    for (let k = 0; k < Hb.length; k += 1) if (h[j]! >= Hb[k]!) i = k;
    i = Math.min(i, 6);
    T[j] = Tbase[i]! + L[i]! * (h[j]! - Hb[i]!);
    if (L[i] === 0) {
      p[j] = pbase[i]! * Math.exp((-g * (h[j]! - Hb[i]!)) / (R * Tbase[i]!));
    } else {
      p[j] = pbase[i]! * (Tbase[i]! / T[j]!) ** (g / (R * L[i]!));
    }
  }
  const rho = p.map((pj, j) => pj / (R * T[j]!));
  const a = T.map((Tj) => Math.sqrt(1.4 * R * Tj));
  return { T, p, rho, a };
}

export type NozzleResult = {
  module: string;
  gamma: number;
  areaRatio: number;
  Msub: number;
  Msup: number;
  Ms: number[];
  Afr: number[];
  Mplot: number[];
  pr: number[];
  tr: number[];
  log: string[];
};

function areaMach(M: number, g: number): number {
  return (1 / M) * ((2 / (g + 1)) * (1 + ((g - 1) / 2) * M * M)) ** ((g + 1) / (2 * (g - 1)));
}

function bisect(
  fun: (x: number) => number,
  a: number,
  b: number,
  tol: number,
  nmax: number,
): number {
  let fa = fun(a);
  let fb = fun(b);
  if (!(Number.isFinite(fa) && Number.isFinite(fb)) || fa * fb > 0) {
    throw new Error("Root is not bracketed.");
  }
  let lo = a;
  let hi = b;
  let x = 0.5 * (lo + hi);
  for (let i = 0; i < nmax; i += 1) {
    x = 0.5 * (lo + hi);
    const fx = fun(x);
    if (Math.abs(fx) < tol || Math.abs(hi - lo) < tol) return x;
    if (fa * fx <= 0) {
      hi = x;
      fb = fx;
    } else {
      lo = x;
      fa = fx;
    }
  }
  void fb;
  return x;
}

export function runIsentropicNozzle(gamma: number, AR: number): NozzleResult {
  if (!(gamma > 1 && AR >= 1)) throw new Error("Gamma must exceed 1 and A/A* ≥ 1.");
  const Ms = Array.from({ length: 1000 }, (_, i) => 0.02 + ((5 - 0.02) * i) / 999);
  const Afr = Ms.map((M) => areaMach(M, gamma));
  const Msub = bisect((M) => areaMach(M, gamma) - AR, 1e-8, 0.999999, 1e-11, 200);
  const Msup = AR === 1 ? 1 : bisect((M) => areaMach(M, gamma) - AR, 1.000001, 50, 1e-11, 300);
  const pr = (M: number) => (1 + ((gamma - 1) / 2) * M * M) ** (-gamma / (gamma - 1));
  const tr = (M: number) => (1 + ((gamma - 1) / 2) * M * M) ** -1;
  const Mplot = Array.from({ length: 400 }, (_, i) => (5 * i) / 399);
  return {
    module: "isentropic_nozzle",
    gamma,
    areaRatio: AR,
    Msub,
    Msup,
    Ms,
    Afr,
    Mplot,
    pr: Mplot.map(pr),
    tr: Mplot.map(tr),
    log: [
      `Subsonic Mach: ${Msub}`,
      `Supersonic Mach: ${Msup}`,
      `Subsonic p/p0: ${pr(Msub).toPrecision(6)}`,
      `Supersonic p/p0: ${pr(Msup).toPrecision(6)}`,
    ],
  };
}

export type SparseMethod = "backslash" | "pcg" | "gmres" | "lsqr";

export type SparseLabResult = {
  module: string;
  method: string;
  n: number;
  nnz: number;
  flag: number;
  iterations: number;
  relativeResidual: number;
  history: number[];
  solutionGrid: number[][];
  elapsedMs: number;
  log: string[];
};

function poisson2d(ngrid: number): { A: SparseCOO; b: number[] } {
  const n = ngrid * ngrid;
  const A = spEmpty(n);
  const b = new Array<number>(n).fill(1);
  const idx = (i: number, j: number) => i + j * ngrid;
  for (let j = 0; j < ngrid; j += 1) {
    for (let i = 0; i < ngrid; i += 1) {
      const p = idx(i, j);
      spPut(A, p, p, 4);
      if (i > 0) spPut(A, p, idx(i - 1, j), -1);
      if (i + 1 < ngrid) spPut(A, p, idx(i + 1, j), -1);
      if (j > 0) spPut(A, p, idx(i, j - 1), -1);
      if (j + 1 < ngrid) spPut(A, p, idx(i, j + 1), -1);
    }
  }
  return { A, b };
}

function cgSolve(
  A: SparseCOO,
  b: number[],
  tol: number,
  maxit: number,
): { x: number[]; flag: number; relres: number; iter: number; rv: number[] } {
  const n = b.length;
  let x = new Array<number>(n).fill(0);
  let r = b.slice();
  let p = r.slice();
  let rsold = dot(r, r);
  const bnorm = Math.sqrt(rsold) || 1;
  const rv = [Math.sqrt(rsold)];
  let flag = 1;
  let iter = 0;
  for (let k = 1; k <= maxit; k += 1) {
    const Ap = spMatVec(A, p);
    const alpha = rsold / Math.max(dot(p, Ap), 1e-30);
    x = axpy(alpha, p, x);
    r = axpy(-alpha, Ap, r);
    const rsnew = dot(r, r);
    rv.push(Math.sqrt(rsnew));
    iter = k;
    if (Math.sqrt(rsnew) <= tol * bnorm) {
      flag = 0;
      break;
    }
    p = axpy(rsnew / rsold, p, r);
    rsold = rsnew;
  }
  const relres = norm2(axpy(-1, b, spMatVec(A, x))) / bnorm;
  return { x, flag, relres, iter, rv };
}

function gmresSolve(
  A: SparseCOO,
  b: number[],
  tol: number,
  maxit: number,
  restart = 30,
): { x: number[]; flag: number; relres: number; iter: number; rv: number[] } {
  const n = b.length;
  let x = new Array<number>(n).fill(0);
  const bnorm = norm2(b) || 1;
  const rv: number[] = [];
  let flag = 1;
  let iter = 0;
  const m = Math.min(restart, maxit);
  for (let outer = 0; outer < Math.ceil(maxit / m); outer += 1) {
    let r = axpy(-1, spMatVec(A, x), b);
    let beta = norm2(r);
    rv.push(beta);
    if (beta <= tol * bnorm) {
      flag = 0;
      break;
    }
    const V: number[][] = [scale(1 / beta, r)];
    const H: number[][] = [];
    const cs: number[] = [];
    const sn: number[] = [];
    const g = new Array<number>(m + 1).fill(0);
    g[0] = beta;
    let solved = false;
    for (let j = 0; j < m; j += 1) {
      let w = spMatVec(A, V[j]!);
      const hCol = new Array<number>(j + 2).fill(0);
      for (let i = 0; i <= j; i += 1) {
        hCol[i] = dot(w, V[i]!);
        w = axpy(-hCol[i]!, V[i]!, w);
      }
      hCol[j + 1] = norm2(w);
      if (hCol[j + 1]! > 1e-14) V.push(scale(1 / hCol[j + 1]!, w));
      else V.push(new Array<number>(n).fill(0));
      // Apply previous Givens
      for (let i = 0; i < j; i += 1) {
        const temp = cs[i]! * hCol[i]! + sn[i]! * hCol[i + 1]!;
        hCol[i + 1] = -sn[i]! * hCol[i]! + cs[i]! * hCol[i + 1]!;
        hCol[i] = temp;
      }
      const rho = Math.hypot(hCol[j]!, hCol[j + 1]!);
      cs[j] = rho === 0 ? 1 : hCol[j]! / rho;
      sn[j] = rho === 0 ? 0 : hCol[j + 1]! / rho;
      hCol[j] = cs[j]! * hCol[j]! + sn[j]! * hCol[j + 1]!;
      hCol[j + 1] = 0;
      H.push(hCol);
      g[j + 1] = -sn[j]! * g[j]!;
      g[j] = cs[j]! * g[j]!;
      rv.push(Math.abs(g[j + 1]!));
      iter += 1;
      if (Math.abs(g[j + 1]!) <= tol * bnorm) {
        // backsolve
        const y = new Array<number>(j + 1).fill(0);
        for (let i = j; i >= 0; i -= 1) {
          let s = g[i]!;
          for (let k = i + 1; k <= j; k += 1) s -= H[k]![i]! * y[k]!;
          y[i] = s / H[i]![i]!;
        }
        for (let i = 0; i <= j; i += 1) x = axpy(y[i]!, V[i]!, x);
        flag = 0;
        solved = true;
        break;
      }
    }
    if (solved) break;
    // Update x from full restart cycle
    const j = m - 1;
    const y = new Array<number>(j + 1).fill(0);
    for (let i = j; i >= 0; i -= 1) {
      let s = g[i]!;
      for (let k = i + 1; k <= j; k += 1) s -= (H[k]?.[i] ?? 0) * y[k]!;
      y[i] = s / (H[i]?.[i] ?? 1);
    }
    for (let i = 0; i <= j; i += 1) x = axpy(y[i]!, V[i]!, x);
  }
  const relres = norm2(axpy(-1, b, spMatVec(A, x))) / bnorm;
  return { x, flag, relres, iter, rv };
}

/** Paige–Saunders LSQR (Algorithm 583 inspired; internal Octave V2 port). */
export function internalLsqr(
  A: SparseCOO,
  b: number[],
  tol: number,
  maxit: number,
): { x: number[]; flag: number; relres: number; iter: number; rv: number[] } {
  const n = A.n;
  let x = new Array<number>(n).fill(0);
  let u = b.slice();
  let beta = norm2(u);
  if (beta === 0) return { x, flag: 0, relres: 0, iter: 0, rv: [0] };
  u = scale(1 / beta, u);
  let v = spMatVecT(A, u);
  let alpha = norm2(v);
  if (alpha === 0) return { x, flag: 0, relres: 1, iter: 0, rv: [beta] };
  v = scale(1 / alpha, v);
  let w = v.slice();
  let phibar = beta;
  let rhobar = alpha;
  const bnorm = beta;
  const rv = [beta];
  let flag = 1;
  let iter = 0;
  for (let it = 1; it <= maxit; it += 1) {
    u = axpy(-alpha, u, spMatVec(A, v));
    beta = norm2(u);
    if (beta > 0) u = scale(1 / beta, u);
    v = axpy(-beta, v, spMatVecT(A, u));
    alpha = norm2(v);
    if (alpha > 0) v = scale(1 / alpha, v);
    const rho = Math.hypot(rhobar, beta);
    const c = rhobar / rho;
    const s = beta / rho;
    const theta = s * alpha;
    rhobar = -c * alpha;
    const phi = c * phibar;
    phibar = s * phibar;
    x = axpy(phi / rho, w, x);
    w = axpy(-theta / rho, w, v);
    rv.push(Math.abs(phibar));
    iter = it;
    if (Math.abs(phibar) <= tol * bnorm) {
      flag = 0;
      break;
    }
  }
  const relres = norm2(axpy(-1, b, spMatVec(A, x))) / bnorm;
  return { x, flag, relres, iter, rv };
}

export function runSparseLab(
  ngrid: number,
  method: SparseMethod,
  tol: number,
  maxit: number,
): SparseLabResult {
  const ng = Math.max(3, Math.min(35, Math.round(ngrid)));
  const { A, b } = poisson2d(ng);
  const n = b.length;
  const t0 = performance.now();
  let x: number[];
  let flag: number;
  let relres: number;
  let iter: number;
  let rv: number[];
  let name: string;
  if (method === "backslash") {
    x = solveDense(denseFromSparse(A), b);
    flag = 0;
    relres = norm2(axpy(-1, b, spMatVec(A, x))) / (norm2(b) || 1);
    iter = 1;
    rv = [norm2(b), norm2(axpy(-1, b, spMatVec(A, x)))];
    name = "Sparse backslash (dense direct)";
  } else if (method === "pcg") {
    ({ x, flag, relres, iter, rv } = cgSolve(A, b, tol, maxit));
    name = "PCG / CG (ITPACK-related)";
  } else if (method === "gmres") {
    ({ x, flag, relres, iter, rv } = gmresSolve(A, b, tol, maxit));
    name = "GMRES (Alg 842/881-related)";
  } else {
    ({ x, flag, relres, iter, rv } = internalLsqr(A, b, tol, maxit));
    name = "Internal LSQR (Alg 583)";
  }
  const elapsedMs = performance.now() - t0;
  const solutionGrid = Array.from({ length: ng }, (_, j) =>
    Array.from({ length: ng }, (_, i) => x[i + j * ng]!),
  );
  return {
    module: "sparse_solver",
    method: name,
    n,
    nnz: spNnz(A),
    flag,
    iterations: iter,
    relativeResidual: relres,
    history: rv,
    solutionGrid,
    elapsedMs,
    log: [
      `Method: ${name}`,
      `Order: ${n}, nnz(A): ${spNnz(A)}`,
      `Flag: ${flag}, iterations: ${iter}`,
      `Relative residual: ${relres.toExponential(3)}`,
      `Time: ${(elapsedMs / 1000).toFixed(4)} s`,
    ],
  };
}

/** Tiny L-BFGS-B–style demo: minimize (x-c)² on [lo,hi] with projected gradient. */
export function runLbfgsbDemo(lo = -2, hi = 3, c = 1.25): {
  module: string;
  history: Array<{ k: number; x: number; f: number }>;
  x: number;
  log: string[];
} {
  let x = 0.5 * (lo + hi);
  const history: Array<{ k: number; x: number; f: number }> = [];
  for (let k = 0; k < 40; k += 1) {
    const g = 2 * (x - c);
    const step = 0.4;
    x = Math.max(lo, Math.min(hi, x - step * g));
    const f = (x - c) ** 2;
    history.push({ k, x, f });
    if (Math.abs(g) < 1e-10) break;
  }
  return {
    module: "lbfgsb_demo",
    history,
    x,
    log: [
      "L-BFGS-B–related demo (type D): bound-constrained quadratic min (x−c)²",
      `bounds=[${lo},${hi}], target c=${c}`,
      `x* ≈ ${x}, f* ≈ ${(x - c) ** 2}`,
      "Not a direct port of Algorithm 778 — projected-gradient illustration only.",
    ],
  };
}

/** ADOL-C–related demo: analytic vs forward FD vs complex-step for f(x)=x*cos(x). */
export function runAdolcDemo(x0 = 1.2): {
  module: string;
  analytic: number;
  fd: number;
  complexStep: number;
  log: string[];
} {
  const analytic = Math.cos(x0) - x0 * Math.sin(x0);
  const h = 1e-6;
  const fd = ((x0 + h) * Math.cos(x0 + h) - (x0 - h) * Math.cos(x0 - h)) / (2 * h);
  const hc = 1e-20;
  // complex-step: Im(f(x+ih))/h with f=z*cos(z)
  const zr = x0;
  const zi = hc;
  // cos(z)=cos(x)cosh(y)-i sin(x)sinh(y); z*cos(z) imag part
  const cosr = Math.cos(zr) * Math.cosh(zi);
  const cosi = -Math.sin(zr) * Math.sinh(zi);
  const fr = zr * cosr - zi * cosi;
  const fi = zr * cosi + zi * cosr;
  void fr;
  const complexStep = fi / hc;
  return {
    module: "adolc_demo",
    analytic,
    fd,
    complexStep,
    log: [
      "ADOL-C–related demo (type D): derivative comparison for f(x)=x·cos(x)",
      `x0 = ${x0}`,
      `analytic f' = ${analytic}`,
      `central FD   = ${fd}`,
      `complex-step = ${complexStep}`,
      "Not a direct port of Algorithm 755 — operator-overloading AD not implemented.",
    ],
  };
}

export type HeatAcmLabId =
  | "fishpak"
  | "pdecol"
  | "pdetwo"
  | "bdmg"
  | "bacolr"
  | "lsqr"
  | "itpack"
  | "umfpack"
  | "gmres"
  | "lbfgsb"
  | "adolc"
  | "ifiss"
  | "fin"
  | "atmosphere"
  | "nozzle";

export const HEAT_ACM_LABS: Array<{
  id: HeatAcmLabId;
  label: string;
  algo: string;
  fidelity: "A" | "B" | "C" | "D";
  blurb: string;
}> = [
  {
    id: "fishpak",
    label: "FISHPAK",
    algo: "541",
    fidelity: "D",
    blurb: "Separable elliptic PDEs — steady 2-D plate conduction demo.",
  },
  {
    id: "pdecol",
    label: "PDECOL",
    algo: "540",
    fidelity: "D",
    blurb: "1-D time-dependent PDE collocation domain — transient plate demo.",
  },
  {
    id: "pdetwo",
    label: "PDETWO",
    algo: "565",
    fidelity: "D",
    blurb: "1-D time-dependent PDE systems — transient plate demo.",
  },
  {
    id: "bdmg",
    label: "BDMG",
    algo: "621",
    fidelity: "D",
    blurb: "Multigrid parabolic time integration — transient plate demo.",
  },
  {
    id: "bacolr",
    label: "BACOLR",
    algo: "874",
    fidelity: "D",
    blurb: "Adaptive B-spline collocation — transient plate related demo.",
  },
  {
    id: "lsqr",
    label: "LSQR",
    algo: "583",
    fidelity: "B",
    blurb: "Paige–Saunders LSQR — internal Golub–Kahan iteration.",
  },
  {
    id: "itpack",
    label: "ITPACK",
    algo: "586",
    fidelity: "D",
    blurb: "Iterative sparse methods — CG/PCG laboratory.",
  },
  {
    id: "umfpack",
    label: "UMFPACK",
    algo: "832",
    fidelity: "C",
    blurb: "Sparse LU lineage — browser dense direct (backslash analog).",
  },
  {
    id: "gmres",
    label: "GMRES",
    algo: "842/881",
    fidelity: "B",
    blurb: "Restarted GMRES for nonsymmetric / SPD Poisson test.",
  },
  {
    id: "lbfgsb",
    label: "L-BFGS-B",
    algo: "778",
    fidelity: "D",
    blurb: "Bound-constrained quasi-Newton — projected-gradient demo.",
  },
  {
    id: "adolc",
    label: "ADOL-C",
    algo: "755",
    fidelity: "D",
    blurb: "Automatic differentiation lineage — FD vs complex-step.",
  },
  {
    id: "ifiss",
    label: "IFISS",
    algo: "866",
    fidelity: "D",
    blurb: "FE / incompressible-flow PDE tools — plate elliptic demo.",
  },
  {
    id: "fin",
    label: "FIN",
    algo: "V2",
    fidelity: "B",
    blurb: "Straight-fin temperature & efficiency (HTANT V2).",
  },
  {
    id: "atmosphere",
    label: "ATMOS",
    algo: "V2",
    fidelity: "B",
    blurb: "1976-style standard atmosphere to 84.852 km.",
  },
  {
    id: "nozzle",
    label: "NOZZLE",
    algo: "V2",
    fidelity: "B",
    blurb: "Isentropic nozzle area–Mach relations.",
  },
];
