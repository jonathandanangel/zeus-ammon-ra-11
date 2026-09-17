/**
 * Parser for MATLABProject-1.m style lab tables:
 *   line 3 = header tokens
 *   lines 5+ = whitespace-separated rows
 * Also accepts simple CSV / TSV / header-on-first-row tables.
 */

export type UniversityTable = {
  headers: string[];
  /** Column-major numeric data (NaN where unparsable). */
  columns: number[][];
  /** Raw string tokens per column. */
  rawColumns: string[][];
  rowCount: number;
  sourceFormat: "matlab-project" | "header-first" | "csv";
  warnings: string[];
};

function splitTokens(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed) return [];
  if (trimmed.includes("\t")) return trimmed.split(/\t+/).map((t) => t.trim()).filter(Boolean);
  if (trimmed.includes(",") && !trimmed.includes(" ")) {
    return trimmed.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return trimmed.split(/\s+/).filter(Boolean);
}

function toNumber(token: string): number {
  const n = Number(token.replace(/,/g, ""));
  return Number.isFinite(n) ? n : Number.NaN;
}

/** Prefer MATLABProject layout (header @ line 3, data @ 5+) when it looks structured. */
export function parseUniversityTable(text: string): UniversityTable {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const warnings: string[] = [];

  const line3 = lines[2] ? splitTokens(lines[2]) : [];
  const dataStart = 4; // 0-based index for MATLAB line 5
  const dataPreview = lines.slice(dataStart, dataStart + 8).map(splitTokens).filter((t) => t.length);
  const looksMatlab =
    line3.length >= 2 &&
    dataPreview.length >= 2 &&
    dataPreview.every((row) => row.length >= Math.min(2, line3.length));

  if (looksMatlab) {
    const headers = line3.map((h, i) => h || `col_${i + 1}`);
    const N = headers.length;
    const rawColumns: string[][] = Array.from({ length: N }, () => []);
    for (let i = dataStart; i < lines.length; i += 1) {
      const tokens = splitTokens(lines[i]!);
      if (!tokens.length) continue;
      for (let c = 0; c < N; c += 1) {
        rawColumns[c]!.push(tokens[c] ?? "");
      }
    }
    const columns = rawColumns.map((col) => col.map(toNumber));
    const rowCount = rawColumns[0]?.length ?? 0;
    if (rowCount === 0) warnings.push("No data rows after line 5.");
    return {
      headers,
      columns,
      rawColumns,
      rowCount,
      sourceFormat: "matlab-project",
      warnings,
    };
  }

  // Fallback: first non-empty line = header, rest = data
  let headerIdx = lines.findIndex((l) => splitTokens(l).length >= 2);
  if (headerIdx < 0) {
    throw new Error("Could not find a header row with at least two columns.");
  }
  const headers = splitTokens(lines[headerIdx]!).map((h, i) => h || `col_${i + 1}`);
  const N = headers.length;
  const rawColumns: string[][] = Array.from({ length: N }, () => []);
  const isCsv = lines[headerIdx]!.includes(",") && !lines[headerIdx]!.includes("\t");
  for (let i = headerIdx + 1; i < lines.length; i += 1) {
    const tokens = splitTokens(lines[i]!);
    if (!tokens.length) continue;
    // skip unit/meta rows that are all non-numeric when later rows are numeric
    const nums = tokens.map(toNumber);
    if (nums.every((n) => !Number.isFinite(n)) && rawColumns[0]!.length === 0) {
      warnings.push(`Skipped non-numeric row ${i + 1}.`);
      continue;
    }
    for (let c = 0; c < N; c += 1) {
      rawColumns[c]!.push(tokens[c] ?? "");
    }
  }
  const columns = rawColumns.map((col) => col.map(toNumber));
  const rowCount = rawColumns[0]?.length ?? 0;
  if (rowCount === 0) warnings.push("No numeric data rows found.");
  return {
    headers,
    columns,
    rawColumns,
    rowCount,
    sourceFormat: isCsv ? "csv" : "header-first",
    warnings,
  };
}

export function columnStats(values: number[]) {
  const finite = values.filter((v) => Number.isFinite(v));
  if (!finite.length) {
    return { count: 0, min: null as number | null, max: null, mean: null };
  }
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  const mean = finite.reduce((s, v) => s + v, 0) / finite.length;
  return { count: finite.length, min, max, mean };
}

/** Ordinary least-squares fit y ≈ a + b x on finite pairs. */
export function linearFit(xs: number[], ys: number[]) {
  const pts: Array<{ x: number; y: number }> = [];
  const n = Math.min(xs.length, ys.length);
  for (let i = 0; i < n; i += 1) {
    const x = xs[i]!;
    const y = ys[i]!;
    if (Number.isFinite(x) && Number.isFinite(y)) pts.push({ x, y });
  }
  if (pts.length < 2) return null;
  const mx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const my = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  let num = 0;
  let den = 0;
  for (const p of pts) {
    num += (p.x - mx) * (p.y - my);
    den += (p.x - mx) ** 2;
  }
  if (den === 0) return null;
  const b = num / den;
  const a = my - b * mx;
  return { a, b, n: pts.length };
}

export function pairsToCsv(points: Array<{ x: number; y: number }>): string {
  const rows = ["x,y", ...points.map((p) => `${p.x.toFixed(8)},${p.y.toFixed(8)}`)];
  return `${rows.join("\n")}\n`;
}
