/**
 * ACM Collected Algorithms 618 / 619 / 740 — clean-room TypeScript port.
 *
 * Algorithm 618 — DSM / FDJS: consistent partitioning & sparse Jacobian estimation
 *   Coleman, Garbow, Moré — Argonne MINPACK, July 1983; TOMS 10(3), 1984, 346–347.
 *
 * Algorithm 619 — DLAINV: Durbin inverse Laplace + Wynn ε-extrapolation
 *   TOMS 10(3), 1984, 348–353; Wynn (1956).
 *
 * Algorithm 740 — Incomplete Cholesky (standard / column / row Jones–Plassmann)
 *   TOMS 21(1), 1995, 18–19.
 *
 * Port of ACMsPARSENumericsGUIINTEGRATIONV5 (Octave GUI V5 / rev 1.4, 2026-09-15):
 * bounded Wynn table (≤50), finite-value guards, ier 3/4, sparse COO storage.
 */

const REALMIN = Number.MIN_VALUE;
const REALMAX = Number.MAX_VALUE;
const EPS = Number.EPSILON;

// ——— Sparse COO / CSR helpers ———

export type SparseMatrix = {
  m: number;
  n: number;
  /** Row indices (0-based). */
  rows: number[];
  /** Column indices (0-based). */
  cols: number[];
  /** Optional nonzero values (default 1). */
  values: number[];
};

function emptySparse(m: number, n: number): SparseMatrix {
  return { m, n, rows: [], cols: [], values: [] };
}

function sparsePut(S: SparseMatrix, r: number, c: number, v = 1): void {
  S.rows.push(r);
  S.cols.push(c);
  S.values.push(v);
}

/** Deduplicate COO → unique (r,c) with value 1 (pattern). */
function spones(S: SparseMatrix): SparseMatrix {
  const map = new Map<string, number>();
  for (let k = 0; k < S.rows.length; k += 1) {
    map.set(`${S.rows[k]!},${S.cols[k]!}`, 1);
  }
  const out = emptySparse(S.m, S.n);
  for (const key of map.keys()) {
    const [r, c] = key.split(",").map(Number) as [number, number];
    sparsePut(out, r, c, 1);
  }
  return out;
}

function nnz(S: SparseMatrix): number {
  return S.rows.length;
}

function columnRowLists(S: SparseMatrix): number[][] {
  const cols: number[][] = Array.from({ length: S.n }, () => []);
  for (let k = 0; k < S.rows.length; k += 1) {
    cols[S.cols[k]!]!.push(S.rows[k]!);
  }
  return cols;
}

function rowCounts(S: SparseMatrix): number[] {
  const counts = new Array<number>(S.m).fill(0);
  for (const r of S.rows) counts[r]! += 1;
  return counts;
}

/** Dense mat-vec for pattern A with value 1: y = A x (plus optional +x). */
function patternMatVec(S: SparseMatrix, x: number[], addX: boolean): number[] {
  const y = addX ? x.slice() : new Array<number>(S.m).fill(0);
  if (!addX) {
    for (let i = 0; i < S.m; i += 1) y[i] = 0;
  }
  for (let k = 0; k < S.rows.length; k += 1) {
    y[S.rows[k]!]! += S.values[k]! * x[S.cols[k]!]!;
  }
  return y;
}

function frobeniusSparseDiff(A: SparseMatrix, B: SparseMatrix): number {
  const map = new Map<string, number>();
  for (let k = 0; k < A.rows.length; k += 1) {
    map.set(`${A.rows[k]},${A.cols[k]}`, A.values[k]!);
  }
  for (let k = 0; k < B.rows.length; k += 1) {
    const key = `${B.rows[k]},${B.cols[k]}`;
    map.set(key, (map.get(key) ?? 0) - B.values[k]!);
  }
  let sum = 0;
  for (const v of map.values()) sum += v * v;
  return Math.sqrt(sum);
}

function frobeniusSparse(S: SparseMatrix): number {
  let sum = 0;
  for (const v of S.values) sum += v * v;
  return Math.sqrt(sum);
}

function denseSymmetric(n: number, fill: (i: number, j: number) => number): number[][] {
  const A = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      const v = fill(i, j);
      A[i]![j] = v;
      A[j]![i] = v;
    }
  }
  return A;
}

function frobeniusLowerResidual(A: number[][], L: number[][]): number {
  const n = A.length;
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      let ll = 0;
      for (let k = 0; k <= j; k += 1) ll += L[i]![k]! * L[j]![k]!;
      const r = A[i]![j]! - ll;
      sum += r * r;
    }
  }
  return Math.sqrt(sum);
}

function maxAbsLowerResidual(A: number[][], L: number[][]): number {
  const n = A.length;
  let mx = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      let ll = 0;
      for (let k = 0; k <= j; k += 1) ll += L[i]![k]! * L[j]![k]!;
      mx = Math.max(mx, Math.abs(A[i]![j]! - ll));
    }
  }
  return mx;
}

function nnzLower(L: number[][]): number {
  let count = 0;
  for (let i = 0; i < L.length; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      if (L[i]![j]! !== 0) count += 1;
    }
  }
  return count;
}

// ——— Complex arithmetic for Algorithm 619 ———

export type Complex = { re: number; im: number };

function c(re: number, im = 0): Complex {
  return { re, im };
}

function cAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}
function cSub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}
function cMul(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}
function cDiv(a: Complex, b: Complex): Complex {
  const d = b.re * b.re + b.im * b.im;
  if (d === 0) return { re: NaN, im: NaN };
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
}
function cPow(a: Complex, b: Complex): Complex {
  if (b.im === 0 && Number.isInteger(b.re) && b.re >= 0 && b.re <= 8) {
    let out = c(1);
    for (let i = 0; i < b.re; i += 1) out = cMul(out, a);
    return out;
  }
  const logMag = 0.5 * Math.log(a.re * a.re + a.im * a.im);
  const arg = Math.atan2(a.im, a.re);
  const mag = Math.exp(b.re * logMag - b.im * arg);
  const ang = b.im * logMag + b.re * arg;
  return { re: mag * Math.cos(ang), im: mag * Math.sin(ang) };
}
function cNeg(a: Complex): Complex {
  return { re: -a.re, im: -a.im };
}
function cIsFinite(z: Complex): boolean {
  return Number.isFinite(z.re) && Number.isFinite(z.im);
}

type CAst =
  | { type: "num"; value: Complex }
  | { type: "var" }
  | { type: "unary"; op: "+" | "-"; arg: CAst }
  | { type: "bin"; op: "+" | "-" | "*" | "/" | "^"; left: CAst; right: CAst }
  | { type: "call"; name: string; args: CAst[] };

function tokenizeComplexExpr(source: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i]!;
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let j = i;
      let sawDot = false;
      while (j < source.length && (/[0-9]/.test(source[j]!) || (!sawDot && source[j] === "."))) {
        if (source[j] === ".") sawDot = true;
        j += 1;
      }
      if (j < source.length && (source[j] === "e" || source[j] === "E")) {
        let k = j + 1;
        if (k < source.length && (source[k] === "+" || source[k] === "-")) k += 1;
        while (k < source.length && /[0-9]/.test(source[k]!)) k += 1;
        j = k;
      }
      tokens.push(source.slice(i, j));
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i + 1;
      while (j < source.length && /[A-Za-z0-9_]/.test(source[j]!)) j += 1;
      tokens.push(source.slice(i, j));
      i = j;
      continue;
    }
    if ("+-*/^(),".includes(ch)) {
      tokens.push(ch);
      i += 1;
      continue;
    }
    throw new Error(`Unexpected character '${ch}' in F(s).`);
  }
  return tokens;
}

function parseComplexAst(raw: string): CAst {
  let expr = raw
    .trim()
    .replace(/\s*\.\s*\^\s*/g, "^")
    .replace(/\s*\.\s*\*\s*/g, "*")
    .replace(/\s*\.\s*\/\s*/g, "/")
    .replace(/\*\*/g, "^");
  if (!expr) throw new Error("F(s) is empty.");
  const tokens = tokenizeComplexExpr(expr);
  let pos = 0;
  const peek = () => tokens[pos];
  const take = () => tokens[pos++];

  function parsePrimary(): CAst {
    const t = take();
    if (t === undefined) throw new Error("Unexpected end of F(s).");
    if (t === "(") {
      const inner = parseExpr();
      if (take() !== ")") throw new Error("Missing ')' in F(s).");
      return inner;
    }
    if (t === "+" || t === "-") {
      return { type: "unary", op: t, arg: parsePrimary() };
    }
    if (/^[0-9.]/.test(t)) {
      return { type: "num", value: c(Number(t)) };
    }
    if (t === "s" || t === "S") {
      return { type: "var" };
    }
    if (t === "i" || t === "I" || t === "j" || t === "J") {
      return { type: "num", value: c(0, 1) };
    }
    if (t === "pi" || t === "PI") {
      return { type: "num", value: c(Math.PI) };
    }
    if (t === "e" || t === "E") {
      return { type: "num", value: c(Math.E) };
    }
    if (peek() === "(") {
      take();
      const args: CAst[] = [];
      if (peek() !== ")") {
        args.push(parseExpr());
        while (peek() === ",") {
          take();
          args.push(parseExpr());
        }
      }
      if (take() !== ")") throw new Error(`Missing ')' after ${t}.`);
      return { type: "call", name: t.toLowerCase(), args };
    }
    throw new Error(`Unknown token '${t}' in F(s).`);
  }

  function parsePower(): CAst {
    let left = parsePrimary();
    while (peek() === "^") {
      take();
      const right = parsePrimary();
      left = { type: "bin", op: "^", left, right };
    }
    return left;
  }

  function parseTerm(): CAst {
    let left = parsePower();
    while (peek() === "*" || peek() === "/") {
      const op = take() as "*" | "/";
      left = { type: "bin", op, left, right: parsePower() };
    }
    return left;
  }

  function parseExpr(): CAst {
    let left = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = take() as "+" | "-";
      left = { type: "bin", op, left, right: parseTerm() };
    }
    return left;
  }

  const ast = parseExpr();
  if (pos !== tokens.length) throw new Error("Trailing tokens in F(s).");
  return ast;
}

function evalComplexAst(node: CAst, s: Complex): Complex {
  switch (node.type) {
    case "num":
      return node.value;
    case "var":
      return s;
    case "unary":
      return node.op === "-" ? cNeg(evalComplexAst(node.arg, s)) : evalComplexAst(node.arg, s);
    case "bin": {
      const L = evalComplexAst(node.left, s);
      const R = evalComplexAst(node.right, s);
      if (node.op === "+") return cAdd(L, R);
      if (node.op === "-") return cSub(L, R);
      if (node.op === "*") return cMul(L, R);
      if (node.op === "/") return cDiv(L, R);
      return cPow(L, R);
    }
    case "call": {
      const args = node.args.map((a) => evalComplexAst(a, s));
      const z = args[0]!;
      if (node.name === "real") return c(z.re);
      if (node.name === "imag") return c(z.im);
      if (node.name === "abs") return c(Math.hypot(z.re, z.im));
      if (node.name === "conj") return c(z.re, -z.im);
      if (node.name === "exp") {
        const e = Math.exp(z.re);
        return c(e * Math.cos(z.im), e * Math.sin(z.im));
      }
      if (node.name === "sin") {
        return c(Math.sin(z.re) * Math.cosh(z.im), Math.cos(z.re) * Math.sinh(z.im));
      }
      if (node.name === "cos") {
        return c(Math.cos(z.re) * Math.cosh(z.im), -Math.sin(z.re) * Math.sinh(z.im));
      }
      if (node.name === "sqrt") return cPow(z, c(0.5));
      if (node.name === "log" || node.name === "ln") {
        return c(0.5 * Math.log(z.re * z.re + z.im * z.im), Math.atan2(z.im, z.re));
      }
      throw new Error(`Unsupported complex function '${node.name}'.`);
    }
  }
}

export type ComplexLaplaceFn = (s: Complex) => Complex;

export function compileComplexLaplace(expr: string): ComplexLaplaceFn {
  const ast = parseComplexAst(expr);
  return (s) => evalComplexAst(ast, s);
}

export function isDefaultSinTransform(expr: string): boolean {
  const compact = expr.replace(/\s+/g, "");
  return (
    compact === "1./(s.^2+1)" ||
    compact === "1/(s^2+1)" ||
    compact === "1./(s^2+1)" ||
    compact === "1/(s.^2+1)"
  );
}

// =========================================================================
// Algorithm 618 — DSM + FDJS
// =========================================================================

export type Acm618OrderingMode = 1 | 2 | 3 | 4;
/** 1 = best of SL/ID/LF, 2 = smallest-last, 3 = incidence-degree, 4 = largest-first */

export type Acm618Result = {
  n: number;
  nnz: number;
  densityPercent: number;
  mingrp: number;
  maxgrp: number;
  valid: boolean;
  evalsGrouped: number;
  evalsUngrouped: number;
  relativeFrobeniusError: number;
  dsmElapsedMs: number;
  fNorm: number;
  groupCounts: number[];
  log: string[];
};

function acm618NeutronPattern(n: number): SparseMatrix {
  if (n % 3 !== 0) {
    throw new Error("N must be divisible by 3 for the neutron test pattern.");
  }
  const L = n / 3;
  const S = emptySparse(n, n);
  const put = (r: number, c: number) => sparsePut(S, r, c, 1);
  for (let j = 0; j < n; j += 1) {
    put(j, j);
    if ((j + 1) % L !== 0) put(j + 1, j);
    if (j < 2 * L) {
      put(j + L, j);
      if (j % L !== 0) put(j - 1, j);
    }
    const r = j >= L ? j - L : j + 2 * L;
    put(r, j);
  }
  return spones(S);
}

function acm618IntersectionGraph(A: SparseMatrix): { adj: Set<number>[]; deg: number[] } {
  const n = A.n;
  const colRows = columnRowLists(A);
  const adj: Set<number>[] = Array.from({ length: n }, () => new Set<number>());
  // Columns that share a row are adjacent.
  const rowCols: number[][] = Array.from({ length: A.m }, () => []);
  for (let k = 0; k < A.rows.length; k += 1) {
    rowCols[A.rows[k]!]!.push(A.cols[k]!);
  }
  for (let r = 0; r < A.m; r += 1) {
    const cols = rowCols[r]!;
    for (let a = 0; a < cols.length; a += 1) {
      for (let b = a + 1; b < cols.length; b += 1) {
        adj[cols[a]!]!.add(cols[b]!);
        adj[cols[b]!]!.add(cols[a]!);
      }
    }
  }
  void colRows;
  const deg = adj.map((s) => s.size);
  return { adj, deg };
}

function acm618Slo(adj: Set<number>[]): number[] {
  const n = adj.length;
  const alive = new Array<boolean>(n).fill(true);
  const removal: number[] = [];
  for (let k = 0; k < n; k += 1) {
    let best = -1;
    let bestDeg = Infinity;
    for (let v = 0; v < n; v += 1) {
      if (!alive[v]) continue;
      let d = 0;
      for (const u of adj[v]!) if (alive[u]) d += 1;
      if (d < bestDeg) {
        bestDeg = d;
        best = v;
      }
    }
    removal.push(best);
    alive[best!] = false;
  }
  return removal.reverse();
}

function acm618Ido(adj: Set<number>[], deg: number[]): number[] {
  const n = adj.length;
  const chosen = new Array<boolean>(n).fill(false);
  const inc = new Array<number>(n).fill(0);
  const order: number[] = [];
  for (let k = 0; k < n; k += 1) {
    let best = -1;
    let bestKey = -Infinity;
    for (let v = 0; v < n; v += 1) {
      if (chosen[v]) continue;
      const key = inc[v]! * (n + 1) + deg[v]!;
      if (key > bestKey) {
        bestKey = key;
        best = v;
      }
    }
    order.push(best);
    chosen[best!] = true;
    for (const u of adj[best!]!) {
      if (!chosen[u]) inc[u]! += 1;
    }
  }
  return order;
}

function acm618Lf(deg: number[]): number[] {
  return Array.from({ length: deg.length }, (_, i) => i).sort((a, b) => deg[b]! - deg[a]!);
}

function acm618Seq(adj: Set<number>[], order: number[]): { group: number[]; maxgrp: number } {
  const n = order.length;
  const group = new Array<number>(n).fill(0);
  let maxgrp = 0;
  for (const v of order) {
    const used = new Set<number>();
    for (const u of adj[v!]!) {
      if (group[u]!) used.add(group[u]!);
    }
    let g = 1;
    while (used.has(g)) g += 1;
    group[v!] = g;
    maxgrp = Math.max(maxgrp, g);
  }
  return { group, maxgrp };
}

function acm618CheckColoring(adj: Set<number>[], group: number[]): boolean {
  for (let v = 0; v < adj.length; v += 1) {
    for (const u of adj[v]!) {
      if (u > v && group[u] === group[v]) return false;
    }
  }
  return true;
}

function acm618Dsm(
  A: SparseMatrix,
  mode: Acm618OrderingMode,
): {
  A: SparseMatrix;
  group: number[];
  maxgrp: number;
  mingrp: number;
  valid: boolean;
} {
  const counts = rowCounts(A);
  const mingrp = Math.max(0, ...counts);
  const { adj, deg } = acm618IntersectionGraph(A);
  const orders = [acm618Slo(adj), acm618Ido(adj, deg), acm618Lf(deg)];
  const groups = orders.map((o) => acm618Seq(adj, o));
  let pick = 0;
  if (mode === 1) {
    let best = groups[0]!.maxgrp;
    for (let k = 1; k < 3; k += 1) {
      if (groups[k]!.maxgrp < best) {
        best = groups[k]!.maxgrp;
        pick = k;
      }
    }
  } else {
    pick = Math.max(0, Math.min(2, mode - 2));
  }
  const chosen = groups[pick]!;
  return {
    A,
    group: chosen.group,
    maxgrp: chosen.maxgrp,
    mingrp,
    valid: acm618CheckColoring(adj, chosen.group),
  };
}

function acm618Fcn(x: number[], A: SparseMatrix): number[] {
  const s = patternMatVec(A, x, true);
  return s.map((v) => v * (1 + v) + 1);
}

function acm618ExactJacobian(x: number[], A: SparseMatrix): SparseMatrix {
  // J = diag(1+2s) * (A + I), s = A x + x
  const s = patternMatVec(A, x, true);
  const scale = s.map((v) => 1 + 2 * v);
  const acc = new Map<string, number>();
  for (let k = 0; k < A.rows.length; k += 1) {
    const r = A.rows[k]!;
    const c = A.cols[k]!;
    acc.set(`${r},${c}`, (acc.get(`${r},${c}`) ?? 0) + scale[r]!);
  }
  for (let i = 0; i < A.n; i += 1) {
    acc.set(`${i},${i}`, (acc.get(`${i},${i}`) ?? 0) + scale[i]!);
  }
  const out = emptySparse(A.m, A.n);
  for (const [key, v] of acc) {
    const [r, c] = key.split(",").map(Number) as [number, number];
    sparsePut(out, r, c, v);
  }
  return out;
}

function acm618Fdjs(
  fun: (x: number[]) => number[],
  x: number[],
  S: SparseMatrix,
  group: number[],
  h: number,
): { J: SparseMatrix; evals: number } {
  const m = S.m;
  const n = S.n;
  const ng = Math.max(...group);
  const f0 = fun(x);
  let evals = 1;
  const colRows = columnRowLists(S);
  const J = emptySparse(m, n);
  for (let g = 1; g <= ng; g += 1) {
    const cols: number[] = [];
    for (let j = 0; j < n; j += 1) if (group[j] === g) cols.push(j);
    const d = new Array<number>(n).fill(0);
    for (const j of cols) d[j] = h;
    const xp = x.map((v, i) => v + d[i]!);
    const df = fun(xp).map((v, i) => v - f0[i]!);
    evals += 1;
    for (const j of cols) {
      for (const r of colRows[j]!) {
        sparsePut(J, r, j, df[r]! / h);
      }
    }
  }
  return { J, evals };
}

export function runAcm618(
  n: number,
  h: number,
  ordering: Acm618OrderingMode,
  validate = true,
): Acm618Result {
  if (!Number.isInteger(n) || n < 3) throw new Error("N must be an integer ≥ 3.");
  if (!(h > 0)) throw new Error("Difference step must be positive.");
  const pattern = acm618NeutronPattern(n);
  const t0 = performance.now();
  const R = acm618Dsm(pattern, ordering);
  const elapsed = performance.now() - t0;
  const x = Array.from({ length: n }, (_, i) => (i + 1) / n);
  const f0 = acm618Fcn(x, R.A);
  const { J: Jfd, evals } = acm618Fdjs((z) => acm618Fcn(z, R.A), x, R.A, R.group, h);
  let relerr = NaN;
  if (validate) {
    const Jex = acm618ExactJacobian(x, R.A);
    const num = frobeniusSparseDiff(Jfd, Jex);
    const den = Math.max(frobeniusSparse(Jex), REALMIN);
    relerr = num / den;
  }
  const groupCounts = new Array<number>(R.maxgrp).fill(0);
  for (const g of R.group) groupCounts[g - 1]! += 1;
  const log = [
    "=== ACM ALGORITHM 618: DSM + FDJS ===",
    `N=${n}, M=${n}, NNZ=${nnz(R.A)}, density=${((100 * nnz(R.A)) / (n * n)).toFixed(6)}%`,
    `MINGRP=${R.mingrp}, MAXGRP=${R.maxgrp}, coloring valid=${R.valid ? 1 : 0}`,
    `Function evaluations: grouped=${evals} versus ungrouped=${n + 1}`,
    `Relative Frobenius Jacobian error=${relerr.toExponential(6)}`,
    `DSM elapsed time=${(elapsed / 1000).toPrecision(6)} s`,
    `||F(x)||_2=${Math.hypot(...f0).toExponential(6)}`,
  ];
  return {
    n,
    nnz: nnz(R.A),
    densityPercent: (100 * nnz(R.A)) / (n * n),
    mingrp: R.mingrp,
    maxgrp: R.maxgrp,
    valid: R.valid,
    evalsGrouped: evals,
    evalsUngrouped: n + 1,
    relativeFrobeniusError: relerr,
    dsmElapsedMs: elapsed,
    fNorm: Math.hypot(...f0),
    groupCounts,
    log,
  };
}

export function runAcm618Suite(): {
  ns: number[];
  nnz: number[];
  maxgrp: number[];
  log: string[];
} {
  const ns = [300, 600, 900, 1200];
  const nnzArr: number[] = [];
  const maxgrp: number[] = [];
  const log = ["=== ACM 618 ORIGINAL-SCALE TEST SUITE ==="];
  for (const n of ns) {
    // Cap browser cost: pattern + coloring only (no FDJS) for large N.
    const pattern = acm618NeutronPattern(n);
    const R = acm618Dsm(pattern, 1);
    nnzArr.push(nnz(R.A));
    maxgrp.push(R.maxgrp);
    log.push(
      `N=${String(n).padStart(4)} NNZ=${String(nnz(R.A)).padStart(5)} density=${((100 * nnz(R.A)) / (n * n)).toFixed(4).padStart(8)}% MINGRP=${R.mingrp} MAXGRP=${R.maxgrp} valid=${R.valid ? 1 : 0}`,
    );
  }
  return { ns, nnz: nnzArr, maxgrp, log };
}

// =========================================================================
// Algorithm 619 — DLAINV
// =========================================================================

export type Acm619Point = {
  t: number;
  result: number;
  exact: number | null;
  error: number | null;
  esterr: number;
  num: number;
  ier: number;
  history: number[];
};

export type Acm619Result = {
  points: Acm619Point[];
  log: string[];
  isDefault: boolean;
};

function acm619WynnBounded(seqIn: number[]): number {
  const seq = seqIn.slice(-50);
  const n = seq.length;
  let prevprev = new Array<number>(n + 1).fill(0);
  let prev = [...seq, NaN];
  const candidates = [seq[n - 1]!];
  for (let order = 1; order < n; order += 1) {
    const len = n - order;
    const cur = new Array<number>(n + 1).fill(NaN);
    for (let i = 0; i < len; i += 1) {
      const den = prev[i + 1]! - prev[i]!;
      const tol = EPS * Math.max(1, Math.abs(prev[i + 1]!) + Math.abs(prev[i]!));
      if (Number.isFinite(den) && Math.abs(den) > tol) {
        cur[i] = prevprev[i + 1]! + 1 / den;
      }
    }
    if (order % 2 === 0 && Number.isFinite(cur[0]!)) candidates.push(cur[0]!);
    prevprev = prev;
    prev = cur;
  }
  return candidates[candidates.length - 1]!;
}

export function acm619Dlainv(
  F: ComplexLaplaceFn,
  t: number,
  cAbs: number,
  epsre: number,
  epsab: number,
  maxblkIn: number,
): { result: number; esterr: number; num: number; ier: number; hist: number[] } {
  if (t <= 0) return { result: 0, esterr: 1, num: 0, ier: 2, hist: [] };
  let maxblk = Math.max(3, Math.min(maxblkIn, 2000));
  const pid16 = Math.atan(1) / 4;
  const si = new Array<number>(32).fill(0);
  si[7] = 1;
  si[15] = 0;
  for (let k = 1; k <= 7; k += 1) {
    si[k - 1] = Math.sin(k * pid16);
    si[16 - k - 1] = si[k - 1]!;
  }
  for (let k = 17; k <= 32; k += 1) si[k - 1] = -si[k - 16 - 1]!;

  const arg = pid16 / t;
  const are = cAbs + 2 / t;
  const scaleExponent = are * t - Math.log(16 * t);
  if (scaleExponent > Math.log(REALMAX) - 2) {
    return { result: NaN, esterr: Infinity, num: 0, ier: 3, hist: [] };
  }
  const bb = Math.exp(scaleExponent);
  let aim = 0;
  const ff0 = F(c(are, 0));
  if (!cIsFinite(ff0)) {
    return { result: NaN, esterr: Infinity, num: 1, ier: 4, hist: [] };
  }
  let r = 0.5 * ff0.re;
  let num = 1;
  let kc = 8;
  let ks = 0;
  const seq: number[] = [];
  const hist: number[] = [];
  let result = r * bb;
  let esterr = Infinity;
  let ier = 1;
  const lastResults: number[] = [];

  for (let ib = 1; ib <= maxblk; ib += 1) {
    const mm = ib === 1 ? 12 : 8;
    for (let k = 0; k < mm; k += 1) {
      aim += arg;
      kc += 1;
      ks += 1;
      if (kc > 32) kc = 1;
      if (ks > 32) ks = 1;
      const ff = F(c(are, aim));
      num += 1;
      if (!cIsFinite(ff)) {
        return { result, esterr, num, ier: 4, hist };
      }
      r += ff.re * si[kc - 1]! - ff.im * si[ks - 1]!;
    }
    seq.push(r);
    if (seq.length > 50) seq.splice(0, seq.length - 50);
    if (seq.length >= 3) {
      const raw = acm619WynnBounded(seq);
      const candidate = raw * bb;
      if (Number.isFinite(candidate)) {
        lastResults.push(candidate);
        if (lastResults.length > 4) lastResults.splice(0, lastResults.length - 4);
        result = candidate;
        if (lastResults.length >= 4) {
          esterr =
            Math.abs(result - lastResults[0]!) +
            Math.abs(result - lastResults[1]!) +
            Math.abs(result - lastResults[2]!);
        } else {
          esterr = Infinity;
        }
        esterr = Math.max(esterr, 5 * EPS * Math.abs(result));
        hist.push(esterr);
        if (
          lastResults.length >= 4 &&
          esterr <= Math.max(epsab, epsre * Math.abs(result)) &&
          Math.abs(r * bb - result) <= 0.5 * Math.max(Math.abs(result), REALMIN)
        ) {
          ier = 0;
          return { result, esterr, num, ier, hist };
        }
      }
    }
  }
  return { result, esterr, num, ier, hist };
}

export function runAcm619(
  expr: string,
  tValues: number[],
  cAbs: number,
  epsre: number,
  epsab: number,
  maxblk: number,
): Acm619Result {
  if (!tValues.length) throw new Error("Provide at least one positive t value.");
  if (tValues.some((t) => !(t > 0) || !Number.isFinite(t))) {
    throw new Error("t values must be positive finite numbers.");
  }
  if (!(epsre > 0) || !(epsab > 0)) throw new Error("Tolerances must be positive.");
  if (!Number.isInteger(maxblk) || maxblk < 3) throw new Error("Maximum blocks must be an integer ≥ 3.");

  const F = compileComplexLaplace(expr);
  const isDefault = isDefaultSinTransform(expr);
  const points: Acm619Point[] = [];
  const log = ["=== ACM ALGORITHM 619: DLAINV ==="];

  for (const t of tValues) {
    const out = acm619Dlainv(F, t, cAbs, epsre, epsab, maxblk);
    const exact = isDefault ? Math.sin(t) : null;
    const error = exact !== null ? Math.abs(exact - out.result) : null;
    points.push({
      t,
      result: out.result,
      exact,
      error,
      esterr: out.esterr,
      num: out.num,
      ier: out.ier,
      history: out.hist,
    });
    log.push(
      `t=${t.toPrecision(9).padStart(9)} result=${out.result.toExponential(12)} exact=${
        exact === null ? "NaN".padStart(16) : exact.toExponential(12)
      } error=${error === null ? "NaN" : error.toExponential(2)} est=${out.esterr.toExponential(2)} num=${out.num} ier=${out.ier}`,
    );
  }
  return { points, log, isDefault };
}

// =========================================================================
// Algorithm 740 — Incomplete Cholesky
// =========================================================================

export type Acm740MatrixKind = 1 | 2 | 3 | 4;

export type Acm740Row = {
  name: string;
  code: number;
  fro: number;
  maxabs: number;
  timeMs: number;
  nnzL: number;
};

export type Acm740Result = {
  n: number;
  nnzA: number;
  rows: Acm740Row[];
  summary: string[];
  log: string[];
};

export function acm740Matrix(kind: Acm740MatrixKind, n: number, band: number): number[][] {
  if (kind === 1) {
    let b = band;
    if (b >= n) b = n - 1;
    return denseSymmetric(n, (i, j) => {
      const d = Math.abs(i - j);
      if (d === 0) return 4 * b + 1;
      if (d <= b) return -1;
      return 0;
    });
  }
  if (kind === 2) {
    const b = Math.min(band, n - 1);
    const A = denseSymmetric(n, () => 0);
    for (let i = 0; i < n; i += 1) A[i]![i] = b / n + 1;
    A[0]![0] = n;
    for (let i = 1; i < n; i += 1) {
      A[i]![0] = -1;
      A[0]![i] = -1;
    }
    for (let i = 1; i < n - b; i += 1) {
      for (let j = i + 1; j < Math.min(n, i + b + 1); j += 1) {
        A[i]![j] = 1 / n;
        A[j]![i] = 1 / n;
      }
    }
    return A;
  }
  if (kind === 3) {
    const ln = n;
    const N = ln * ln;
    const A = Array.from({ length: N }, () => new Array<number>(N).fill(0));
    const idx = (r: number, c: number) => r * ln + c;
    for (let r = 0; r < ln; r += 1) {
      for (let c = 0; c < ln; c += 1) {
        const i = idx(r, c);
        A[i]![i] = 4;
        if (c > 0) A[i]![idx(r, c - 1)] = -1;
        if (c + 1 < ln) A[i]![idx(r, c + 1)] = -1;
        if (r > 0) A[i]![idx(r - 1, c)] = -1;
        if (r + 1 < ln) A[i]![idx(r + 1, c)] = -1;
      }
    }
    return A;
  }
  // Original 4×4 failure case
  return [
    [4, 0, 1, 2],
    [0, 5, 0, 0.1],
    [1, 0, 6, 0],
    [2, 0.1, 0, 1],
  ];
}

function acm740Ic0(A: number[][]): { L: number[][]; code: number } {
  const n = A.length;
  const P = A.map((row, i) => row.map((v, j) => (j <= i && v !== 0 ? 1 : 0)));
  const L = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let k = 0; k < n; k += 1) {
    const prev: number[] = [];
    for (let j = 0; j < k; j += 1) if (P[k]![j]) prev.push(j);
    let d = A[k]![k]!;
    for (const j of prev) d -= L[k]![j]! ** 2;
    if (!Number.isFinite(d) || d <= 0) {
      L[k]![k] = -1;
      return { L, code: -(k + 1) };
    }
    L[k]![k] = Math.sqrt(d);
    for (let i = k + 1; i < n; i += 1) {
      if (!P[i]![k]) continue;
      const common: number[] = [];
      for (let j = 0; j < k; j += 1) if (P[i]![j] && P[k]![j]) common.push(j);
      let sum = A[i]![k]!;
      for (const j of common) sum -= L[i]![j]! * L[k]![j]!;
      L[i]![k] = sum / L[k]![k]!;
    }
  }
  return { L, code: 0 };
}

function acm740ThresholdIc(
  A: number[][],
  budget: number[],
  orient: "column" | "row",
): { L: number[][]; code: number } {
  const n = A.length;
  const L = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let k = 0; k < n; k += 1) {
    let d = A[k]![k]!;
    for (let j = 0; j < k; j += 1) d -= L[k]![j]! ** 2;
    if (!Number.isFinite(d) || d <= 0) {
      L[k]![k] = -1;
      return { L, code: -(k + 1) };
    }
    L[k]![k] = Math.sqrt(d);
    const cand = new Array<number>(n - k - 1);
    for (let i = k + 1; i < n; i += 1) {
      let sum = A[i]![k]!;
      for (let j = 0; j < k; j += 1) sum -= L[i]![j]! * L[k]![j]!;
      cand[i - k - 1] = sum / L[k]![k]!;
    }
    const keep = Math.max(0, budget[k]! - 1);
    const ord = Array.from({ length: cand.length }, (_, i) => i).sort(
      (a, b) => Math.abs(cand[b]!) - Math.abs(cand[a]!),
    );
    let selected = ord.slice(0, Math.min(keep, ord.length));
    if (orient === "row") selected = selected.slice().sort((a, b) => a - b);
    for (const o of selected) {
      L[k + 1 + o]![k] = cand[o]!;
    }
  }
  return { L, code: 0 };
}

function acm740Compare(A: number[][]): { rows: Acm740Row[]; summary: string[] } {
  const n = A.length;
  const budget = A.map((row, k) => row.filter((v, j) => j <= k && v !== 0).length);
  const names = ["Standard", "Column", "Row"] as const;
  const rows: Acm740Row[] = [];
  for (let k = 0; k < 3; k += 1) {
    const t0 = performance.now();
    const { L, code } =
      k === 0
        ? acm740Ic0(A)
        : acm740ThresholdIc(A, budget, k === 1 ? "column" : "row");
    const tm = performance.now() - t0;
    rows.push({
      name: names[k]!,
      code,
      fro: frobeniusLowerResidual(A, L),
      maxabs: maxAbsLowerResidual(A, L),
      timeMs: tm,
      nnzL: nnzLower(L),
    });
  }
  const summary = rows.map(
    (r) =>
      `${r.name.padEnd(8)} code=${String(r.code).padStart(4)}  F-norm=${r.fro.toExponential(3).padStart(10)}  maxabs=${r.maxabs.toExponential(3).padStart(10)}  nnz(L)=${r.nnzL}  time=${(r.timeMs / 1000).toPrecision(6)} s`,
  );
  return { rows, summary };
}

export function runAcm740(kind: Acm740MatrixKind, n: number, band: number): Acm740Result {
  if (!Number.isInteger(n) || n < 1) throw new Error("N / LN must be a positive integer.");
  if (!Number.isInteger(band) || band < 0) throw new Error("Semi-bandwidth must be a non-negative integer.");
  const A = acm740Matrix(kind, n, band);
  const { rows, summary } = acm740Compare(A);
  const nnzA = A.reduce(
    (acc, row) => acc + row.reduce((s, v) => s + (v !== 0 ? 1 : 0), 0),
    0,
  );
  return {
    n: A.length,
    nnzA,
    rows,
    summary,
    log: ["=== ACM ALGORITHM 740 ===", ...summary],
  };
}

export function runAcm740Suite(): {
  labels: string[];
  frobenius: number[][];
  log: string[];
} {
  const configs: Array<[Acm740MatrixKind, number, number, string]> = [
    [1, 50, 25, "Banded"],
    [2, 20, 6, "Arrowhead"],
    [3, 5, 0, "2-D Laplacian"],
    [4, 4, 0, "Original failure"],
  ];
  const log = ["=== ACM 740 FOUR-PROBLEM DRIVER ==="];
  const frobenius: number[][] = [];
  const labels: string[] = [];
  for (const [kind, n, band, label] of configs) {
    const A = acm740Matrix(kind, n, band);
    const { rows, summary } = acm740Compare(A);
    labels.push(label);
    frobenius.push(rows.map((r) => r.fro));
    log.push(`--- ${label} ---`, ...summary);
  }
  return { labels, frobenius, log };
}
