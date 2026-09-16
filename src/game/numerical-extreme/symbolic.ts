/**
 * Lightweight elementary symbolic calculus (Octave `symbolic` / `int` demo subset).
 * Not a full CAS — covers polynomials, sin/cos/exp/log, linear compositions,
 * and tabular integration-by-parts for x^n·{sin,cos,exp}.
 */

import { ExpressionError, normalizeExpression } from "./expr";

export type SymNode =
  | { type: "num"; value: number }
  | { type: "const"; name: string }
  | { type: "var"; name: string }
  | { type: "unary"; op: "+" | "-"; arg: SymNode }
  | { type: "bin"; op: "+" | "-" | "*" | "/" | "^"; left: SymNode; right: SymNode }
  | { type: "call"; name: string; args: SymNode[] };

type Tok =
  | { kind: "num"; value: number }
  | { kind: "id"; value: string }
  | { kind: "op"; value: string }
  | { kind: "(" }
  | { kind: ")" }
  | { kind: "," };

const FUNCS = new Set([
  "sin",
  "cos",
  "tan",
  "exp",
  "log",
  "ln",
  "log10",
  "sqrt",
  "abs",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
]);

function applyImplicit(expression: string): string {
  let out = expression.replace(/\s+/g, "");
  out = out.replace(/(?<=[0-9)])(?=(?:x|y|z|t|pi|\())/gi, "*");
  out = out.replace(/(?<![A-Za-z0-9_])([xyzt])(?=\()/gi, "$1*");
  out = out.replace(/\)\(/g, ")*(");
  return out;
}

function tokenize(source: string): Tok[] {
  const tokens: Tok[] = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i]!;
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < source.length && /[0-9.]/.test(source[j]!)) j += 1;
      if (j < source.length && (source[j] === "e" || source[j] === "E")) {
        j += 1;
        if (j < source.length && (source[j] === "+" || source[j] === "-")) j += 1;
        while (j < source.length && /[0-9]/.test(source[j]!)) j += 1;
      }
      tokens.push({ kind: "num", value: Number(source.slice(i, j)) });
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i + 1;
      while (j < source.length && /[A-Za-z0-9_]/.test(source[j]!)) j += 1;
      tokens.push({ kind: "id", value: source.slice(i, j) });
      i = j;
      continue;
    }
    if ("+-*/^".includes(ch)) {
      tokens.push({ kind: "op", value: ch });
      i += 1;
      continue;
    }
    if (ch === "(") {
      tokens.push({ kind: "(" });
      i += 1;
      continue;
    }
    if (ch === ")") {
      tokens.push({ kind: ")" });
      i += 1;
      continue;
    }
    if (ch === ",") {
      tokens.push({ kind: "," });
      i += 1;
      continue;
    }
    throw new ExpressionError(`Unsupported character '${ch}'.`);
  }
  return tokens;
}

class CleanParser {
  private pos = 0;
  constructor(
    private tokens: Tok[],
    private vars: Set<string>,
  ) {}
  private peek(): Tok | undefined {
    return this.tokens[this.pos];
  }
  private take(): Tok | undefined {
    return this.tokens[this.pos++];
  }
  parse(): SymNode {
    const n = this.expr();
    if (this.pos !== this.tokens.length) throw new ExpressionError("Trailing tokens.");
    return n;
  }
  private expr(): SymNode {
    let left = this.term();
    for (;;) {
      const t = this.peek();
      if (t?.kind === "op" && (t.value === "+" || t.value === "-")) {
        this.take();
        left = { type: "bin", op: t.value, left, right: this.term() };
      } else break;
    }
    return left;
  }
  private term(): SymNode {
    let left = this.power();
    for (;;) {
      const t = this.peek();
      if (t?.kind === "op" && (t.value === "*" || t.value === "/")) {
        this.take();
        left = { type: "bin", op: t.value, left, right: this.power() };
      } else break;
    }
    return left;
  }
  private power(): SymNode {
    let left = this.unary();
    const t = this.peek();
    if (t?.kind === "op" && t.value === "^") {
      this.take();
      left = { type: "bin", op: "^", left, right: this.unary() };
    }
    return left;
  }
  private unary(): SymNode {
    const t = this.peek();
    if (t?.kind === "op" && t.value === "+") {
      this.take();
      return this.unary();
    }
    if (t?.kind === "op" && t.value === "-") {
      this.take();
      return { type: "unary", op: "-", arg: this.unary() };
    }
    return this.primary();
  }
  private primary(): SymNode {
    const t = this.take();
    if (!t) throw new ExpressionError("Unexpected end of expression.");
    if (t.kind === "num") return { type: "num", value: t.value };
    if (t.kind === "(") {
      const inner = this.expr();
      if (this.take()?.kind !== ")") throw new ExpressionError("Missing ')'.");
      return inner;
    }
    if (t.kind === "id") {
      if (t.value === "pi" || t.value === "e" || t.value === "E") {
        return { type: "const", name: t.value === "E" ? "e" : t.value };
      }
      if (this.vars.has(t.value)) return { type: "var", name: t.value };
      if (FUNCS.has(t.value.toLowerCase()) && this.peek()?.kind === "(") {
        this.take();
        const args: SymNode[] = [];
        if (this.peek()?.kind !== ")") {
          args.push(this.expr());
          while (this.peek()?.kind === ",") {
            this.take();
            args.push(this.expr());
          }
        }
        if (this.take()?.kind !== ")") throw new ExpressionError(`Missing ')' after ${t.value}.`);
        return { type: "call", name: t.value.toLowerCase(), args };
      }
      throw new ExpressionError(`Unknown identifier '${t.value}'. Use syms ${[...this.vars].join(",")}.`);
    }
    throw new ExpressionError("Invalid expression.");
  }
}

export function parseSymbolic(raw: string, variable = "x"): SymNode {
  const normalized = applyImplicit(normalizeExpression(raw));
  return new CleanParser(tokenize(normalized), new Set([variable])).parse();
}

export function symToString(node: SymNode): string {
  switch (node.type) {
    case "num":
      return Number.isInteger(node.value) ? String(node.value) : String(node.value);
    case "const":
      return node.name;
    case "var":
      return node.name;
    case "unary":
      return node.op === "-" ? `(-${symToString(node.arg)})` : symToString(node.arg);
    case "bin": {
      const op = node.op === "^" ? "^" : ` ${node.op} `;
      return `(${symToString(node.left)}${op}${symToString(node.right)})`;
    }
    case "call":
      return `${node.name}(${node.args.map(symToString).join(", ")})`;
  }
}

/** Pretty string without excess outer parens for display. */
export function symPretty(node: SymNode): string {
  return stripOuter(symToString(simplify(node)));
}

function stripOuter(s: string): string {
  let out = s.trim();
  while (out.startsWith("(") && out.endsWith(")")) {
    let depth = 0;
    let ok = true;
    for (let i = 0; i < out.length; i += 1) {
      if (out[i] === "(") depth += 1;
      if (out[i] === ")") depth -= 1;
      if (depth === 0 && i < out.length - 1) {
        ok = false;
        break;
      }
    }
    if (!ok) break;
    out = out.slice(1, -1);
  }
  return out;
}

function num(v: number): SymNode {
  return { type: "num", value: v };
}
function v(name: string): SymNode {
  return { type: "var", name };
}
function mul(a: SymNode, b: SymNode): SymNode {
  return { type: "bin", op: "*", left: a, right: b };
}
function add(a: SymNode, b: SymNode): SymNode {
  return { type: "bin", op: "+", left: a, right: b };
}
function sub(a: SymNode, b: SymNode): SymNode {
  return { type: "bin", op: "-", left: a, right: b };
}
function div(a: SymNode, b: SymNode): SymNode {
  return { type: "bin", op: "/", left: a, right: b };
}
function pow(a: SymNode, b: SymNode): SymNode {
  return { type: "bin", op: "^", left: a, right: b };
}
function call(name: string, ...args: SymNode[]): SymNode {
  return { type: "call", name, args };
}
function neg(a: SymNode): SymNode {
  return { type: "unary", op: "-", arg: a };
}

function isNum(n: SymNode, value?: number): n is SymNode & { type: "num" } {
  return n.type === "num" && (value === undefined || n.value === value);
}
function isVar(n: SymNode, name: string): boolean {
  return n.type === "var" && n.name === name;
}
function isConstIndep(n: SymNode, variable: string): boolean {
  switch (n.type) {
    case "num":
    case "const":
      return true;
    case "var":
      return n.name !== variable;
    case "unary":
      return isConstIndep(n.arg, variable);
    case "bin":
      return isConstIndep(n.left, variable) && isConstIndep(n.right, variable);
    case "call":
      return n.args.every((a) => isConstIndep(a, variable));
  }
}

/** Flatten +/− into signed terms. */
function flattenSum(node: SymNode): SymNode[] {
  if (node.type === "bin" && node.op === "+") {
    return [...flattenSum(node.left), ...flattenSum(node.right)];
  }
  if (node.type === "bin" && node.op === "-") {
    return [...flattenSum(node.left), ...flattenSum(neg(node.right))];
  }
  if (node.type === "unary" && node.op === "-") {
    return flattenSum(node.arg).map((t) =>
      t.type === "unary" && t.op === "-" ? t.arg : neg(t),
    );
  }
  return [node];
}

function simplify(node: SymNode): SymNode {
  switch (node.type) {
    case "num":
    case "const":
    case "var":
      return node;
    case "unary": {
      const a = simplify(node.arg);
      if (node.op === "+") return a;
      if (isNum(a)) return num(-a.value);
      if (a.type === "unary" && a.op === "-") return a.arg;
      return { type: "unary", op: "-", arg: a };
    }
    case "call":
      return { type: "call", name: node.name, args: node.args.map(simplify) };
    case "bin": {
      const L = simplify(node.left);
      const R = simplify(node.right);
      if (node.op === "+" && isNum(L, 0)) return R;
      if (node.op === "+" && isNum(R, 0)) return L;
      if (node.op === "-" && isNum(R, 0)) return L;
      if (node.op === "*" && (isNum(L, 0) || isNum(R, 0))) return num(0);
      if (node.op === "*" && isNum(L, 1)) return R;
      if (node.op === "*" && isNum(R, 1)) return L;
      if (node.op === "*" && isNum(L, -1)) return neg(R);
      if (node.op === "/" && isNum(R, 1)) return L;
      if (node.op === "^" && isNum(R, 1)) return L;
      if (node.op === "^" && isNum(R, 0)) return num(1);
      if (isNum(L) && isNum(R)) {
        switch (node.op) {
          case "+":
            return num(L.value + R.value);
          case "-":
            return num(L.value - R.value);
          case "*":
            return num(L.value * R.value);
          case "/":
            return R.value === 0 ? div(L, R) : num(L.value / R.value);
          case "^":
            return num(L.value ** R.value);
        }
      }
      return { type: "bin", op: node.op, left: L, right: R };
    }
  }
}

function asPowerOfVar(node: SymNode, variable: string): number | null {
  if (isVar(node, variable)) return 1;
  if (node.type === "bin" && node.op === "^" && isVar(node.left, variable) && isNum(node.right)) {
    return node.right.value;
  }
  return null;
}

function linearArg(node: SymNode, variable: string): { a: number; b: number } | null {
  // a*x + b
  if (isVar(node, variable)) return { a: 1, b: 0 };
  if (isConstIndep(node, variable)) return { a: 0, b: NaN }; // constant — not linear in x for trig scale
  if (node.type === "bin" && node.op === "*" && isNum(node.left) && isVar(node.right, variable)) {
    return { a: node.left.value, b: 0 };
  }
  if (node.type === "bin" && node.op === "*" && isNum(node.right) && isVar(node.left, variable)) {
    return { a: node.right.value, b: 0 };
  }
  if (node.type === "bin" && node.op === "+" && isVar(node.left, variable) && isNum(node.right)) {
    return { a: 1, b: node.right.value };
  }
  if (node.type === "bin" && node.op === "-" && isVar(node.left, variable) && isNum(node.right)) {
    return { a: 1, b: -node.right.value };
  }
  return null;
}

function integrateNode(node: SymNode, variable: string): SymNode {
  node = simplify(node);

  if (isConstIndep(node, variable)) {
    return mul(node, v(variable));
  }

  const power = asPowerOfVar(node, variable);
  if (power !== null) {
    if (power === -1) return call("log", call("abs", v(variable)));
    return div(pow(v(variable), num(power + 1)), num(power + 1));
  }

  if (node.type === "unary" && node.op === "-") {
    return neg(integrateNode(node.arg, variable));
  }

  if (node.type === "bin" && (node.op === "+" || node.op === "-")) {
    const terms = flattenSum(node);
    let acc: SymNode | null = null;
    for (const term of terms) {
      const I = integrateNode(term, variable);
      acc = acc ? add(acc, I) : I;
    }
    return acc ?? num(0);
  }

  if (node.type === "bin" && node.op === "*" && isConstIndep(node.left, variable)) {
    return mul(node.left, integrateNode(node.right, variable));
  }
  if (node.type === "bin" && node.op === "*" && isConstIndep(node.right, variable)) {
    return mul(node.right, integrateNode(node.left, variable));
  }

  if (node.type === "bin" && node.op === "/") {
    if (isConstIndep(node.right, variable)) {
      return div(integrateNode(node.left, variable), node.right);
    }
    // 1/x
    if (isNum(node.left, 1) && isVar(node.right, variable)) {
      return call("log", call("abs", v(variable)));
    }
  }

  if (node.type === "call" && node.args.length === 1) {
    const arg = node.args[0]!;
    const lin = linearArg(arg, variable);
    if (lin && lin.b === 0 && Number.isFinite(lin.a) && lin.a !== 0) {
      const a = lin.a;
      const u = a === 1 ? v(variable) : mul(num(a), v(variable));
      const scale = (body: SymNode) => (a === 1 ? body : div(body, num(a)));
      switch (node.name) {
        case "sin":
          return scale(neg(call("cos", u)));
        case "cos":
          return scale(call("sin", u));
        case "exp":
          return scale(call("exp", u));
        case "sinh":
          return scale(call("cosh", u));
        case "cosh":
          return scale(call("sinh", u));
        default:
          break;
      }
    }
    if (isVar(arg, variable)) {
      switch (node.name) {
        case "sin":
          return neg(call("cos", v(variable)));
        case "cos":
          return call("sin", v(variable));
        case "tan":
          return neg(call("log", call("abs", call("cos", v(variable)))));
        case "exp":
          return call("exp", v(variable));
        case "sinh":
          return call("cosh", v(variable));
        case "cosh":
          return call("sinh", v(variable));
        case "log":
        case "ln":
          return sub(mul(v(variable), call("log", call("abs", v(variable)))), v(variable));
        case "sqrt":
          return mul(num(2 / 3), pow(v(variable), num(1.5)));
        default:
          break;
      }
    }
  }

  // Integration by parts: x^n * sin/cos/exp(x)
  const parts = tryIntegrationByParts(node, variable);
  if (parts) return parts;

  throw new ExpressionError(
    `No elementary antiderivative rule for '${symPretty(node)}'. Try a simpler integrand (poly, sin/cos/exp, x*sin/cos/exp, …).`,
  );
}

function tryIntegrationByParts(node: SymNode, variable: string): SymNode | null {
  if (node.type !== "bin" || node.op !== "*") return null;

  const factors = [node.left, node.right];
  let poly: SymNode | null = null;
  let trig: SymNode | null = null;
  for (const f of factors) {
    const p = asPowerOfVar(f, variable);
    if (p !== null && p >= 0 && Number.isInteger(p)) poly = f;
    else if (
      f.type === "call" &&
      (f.name === "sin" || f.name === "cos" || f.name === "exp") &&
      f.args.length === 1 &&
      isVar(f.args[0]!, variable)
    ) {
      trig = f;
    }
  }
  // Also accept (x)*(cos(x)) already covered; (x*x)*sin via power
  if (!poly || !trig || trig.type !== "call") {
    // Try x * cos(x) where left is var
    if (isVar(node.left, variable) && node.right.type === "call") {
      poly = node.left;
      trig = node.right;
    } else if (isVar(node.right, variable) && node.left.type === "call") {
      poly = node.right;
      trig = node.left;
    } else return null;
  }
  if (trig.type !== "call") return null;

  const n = asPowerOfVar(poly, variable) ?? (isVar(poly, variable) ? 1 : null);
  if (n === null || n < 0 || n > 4) return null;

  // Tabular / recursive IBP
  return integrateByPartsPolyTrig(n, trig.name, variable);
}

function integrateByPartsPolyTrig(n: number, fname: string, variable: string): SymNode {
  // ∫ x^n sin(x) / cos(x) / exp(x) dx
  if (n === 0) {
    if (fname === "sin") return neg(call("cos", v(variable)));
    if (fname === "cos") return call("sin", v(variable));
    return call("exp", v(variable));
  }
  const xn = n === 1 ? v(variable) : pow(v(variable), num(n));
  if (fname === "sin") {
    // u=x^n dv=sin → −x^n cos − ∫ −n x^{n-1} cos = −x^n cos + n ∫ x^{n-1} cos
    return add(
      neg(mul(xn, call("cos", v(variable)))),
      mul(num(n), integrateByPartsPolyTrig(n - 1, "cos", variable)),
    );
  }
  if (fname === "cos") {
    // u=x^n dv=cos → x^n sin − n ∫ x^{n-1} sin
    return sub(
      mul(xn, call("sin", v(variable))),
      mul(num(n), integrateByPartsPolyTrig(n - 1, "sin", variable)),
    );
  }
  // exp: u=x^n dv=exp → x^n exp − n ∫ x^{n-1} exp
  return sub(
    mul(xn, call("exp", v(variable))),
    mul(num(n), integrateByPartsPolyTrig(n - 1, "exp", variable)),
  );
}

export type SymbolicIntegralResult = {
  variable: string;
  integrand: string;
  integrandPretty: string;
  antiderivative: string;
  antiderivativePretty: string;
  definite: null | {
    lower: number;
    upper: number;
    value: number;
    display: string;
  };
  sessionLog: string;
  octaveEcho: string;
};

function evalSym(node: SymNode, env: Record<string, number>): number {
  switch (node.type) {
    case "num":
      return node.value;
    case "const":
      return node.name === "pi" ? Math.PI : Math.E;
    case "var": {
      const v0 = env[node.name];
      if (v0 === undefined) return Number.NaN;
      return v0;
    }
    case "unary":
      return node.op === "-" ? -evalSym(node.arg, env) : evalSym(node.arg, env);
    case "bin": {
      const L = evalSym(node.left, env);
      const R = evalSym(node.right, env);
      switch (node.op) {
        case "+":
          return L + R;
        case "-":
          return L - R;
        case "*":
          return L * R;
        case "/":
          return L / R;
        case "^":
          return L ** R;
      }
      break;
    }
    case "call": {
      const args = node.args.map((a) => evalSym(a, env));
      const x = args[0]!;
      switch (node.name) {
        case "sin":
          return Math.sin(x);
        case "cos":
          return Math.cos(x);
        case "tan":
          return Math.tan(x);
        case "exp":
          return Math.exp(x);
        case "log":
        case "ln":
          return Math.log(Math.abs(x));
        case "log10":
          return Math.log10(Math.abs(x));
        case "sqrt":
          return Math.sqrt(x);
        case "abs":
          return Math.abs(x);
        case "asin":
          return Math.asin(x);
        case "acos":
          return Math.acos(x);
        case "atan":
          return Math.atan(x);
        case "sinh":
          return Math.sinh(x);
        case "cosh":
          return Math.cosh(x);
        case "tanh":
          return Math.tanh(x);
        default:
          return Number.NaN;
      }
    }
  }
  return Number.NaN;
}

export function symbolicIntegrate(
  expression: string,
  variable = "x",
  lower?: number | null,
  upper?: number | null,
): SymbolicIntegralResult {
  const integrandAst = parseSymbolic(expression, variable);
  const antiAst = simplify(integrateNode(integrandAst, variable));
  const antiPretty = symPretty(antiAst);
  const integrandPretty = symPretty(integrandAst);

  let definite: SymbolicIntegralResult["definite"] = null;
  if (
    lower !== undefined &&
    lower !== null &&
    upper !== undefined &&
    upper !== null &&
    Number.isFinite(lower) &&
    Number.isFinite(upper)
  ) {
    const Fb = evalSym(antiAst, { [variable]: upper });
    const Fa = evalSym(antiAst, { [variable]: lower });
    const value = Fb - Fa;
    definite = {
      lower,
      upper,
      value,
      display: Number.isFinite(value) ? value.toPrecision(12) : "NaN",
    };
  }

  const octaveEcho = [
    "pkg load symbolic      % Ensure the symbolic package is loaded",
    `syms ${variable}`,
    `f = ${integrandPretty};`,
    "",
    "% Perform symbolic integration with respect to " + variable,
    "% To do a definite integral, use: int(f, x, lower_limit, upper_limit)",
    definite
      ? `integral_f = int(f, ${variable}, ${definite.lower}, ${definite.upper});`
      : `integral_f = int(f, ${variable});`,
    "",
    "disp('Original function f:')",
    "disp(f)",
    definite
      ? "disp('Definite integral:')"
      : "disp('Indefinite integral of f with respect to x:')",
    "disp(integral_f)",
  ].join("\n");

  const sessionLog = [
    "=== SYMBOLIC SESSION (browser elementary CAS) ===",
    `syms ${variable}`,
    `f = ${integrandPretty}`,
    definite
      ? `int(f, ${variable}, ${definite.lower}, ${definite.upper}) = ${definite.display}`
      : `int(f, ${variable}) = ${antiPretty} + C`,
    "",
    "Original function f:",
    `  ${integrandPretty}`,
    definite ? "Definite integral:" : "Indefinite integral:",
    definite ? `  ${definite.display}` : `  ${antiPretty} + C`,
  ].join("\n");

  return {
    variable,
    integrand: expression,
    integrandPretty,
    antiderivative: symToString(antiAst),
    antiderivativePretty: antiPretty,
    definite,
    sessionLog,
    octaveEcho,
  };
}

export const SYMBOLIC_PRESETS: Array<{ label: string; expr: string }> = [
  { label: "x·cos(x)", expr: "x*cos(x)" },
  { label: "x·sin(x)", expr: "x*sin(x)" },
  { label: "cos(x)", expr: "cos(x)" },
  { label: "x^2", expr: "x^2" },
  { label: "exp(x)", expr: "exp(x)" },
  { label: "1/x", expr: "1/x" },
  { label: "x·exp(x)", expr: "x*exp(x)" },
];
