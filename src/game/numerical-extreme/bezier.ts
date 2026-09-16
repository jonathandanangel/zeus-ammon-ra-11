/**
 * Program 3.7 — Freehand cubic Bézier splines (Sauer-style).
 * Horner's method evaluation of the cubic Bernstein form.
 */

export type Point2 = { x: number; y: number };

export type BezierSegment = {
  /** P0, P1 (control), P2 (control), P3 */
  points: [Point2, Point2, Point2, Point2];
  /** Sampled curve (Horner). */
  curve: Point2[];
};

/** Cubic Bézier coefficients matching Program 3.7. */
export function bezierCoefficients(p0: Point2, p1: Point2, p2: Point2, p3: Point2) {
  const bx = 3 * (p1.x - p0.x);
  const by = 3 * (p1.y - p0.y);
  const cx = 3 * (p2.x - p1.x) - bx;
  const cy = 3 * (p2.y - p1.y) - by;
  const dx = p3.x - p0.x - bx - cx;
  const dy = p3.y - p0.y - by - cy;
  return { bx, by, cx, cy, dx, dy };
}

/** Horner's method: P(t) = P0 + t*(b + t*(c + t*d)), t ∈ [0,1]. */
export function evaluateBezierHorner(
  p0: Point2,
  p1: Point2,
  p2: Point2,
  p3: Point2,
  tSamples: number[] = linspace01(51),
): Point2[] {
  const { bx, by, cx, cy, dx, dy } = bezierCoefficients(p0, p1, p2, p3);
  return tSamples.map((t) => ({
    x: p0.x + t * (bx + t * (cx + t * dx)),
    y: p0.y + t * (by + t * (cy + t * dy)),
  }));
}

export function buildBezierSegment(
  p0: Point2,
  p1: Point2,
  p2: Point2,
  p3: Point2,
  samples = 51,
): BezierSegment {
  return {
    points: [p0, p1, p2, p3],
    curve: evaluateBezierHorner(p0, p1, p2, p3, linspace01(samples)),
  };
}

function linspace01(count: number): number[] {
  if (count < 2) return [0];
  return Array.from({ length: count }, (_, i) => i / (count - 1));
}

export function formatBezierLog(segments: BezierSegment[]): string {
  if (!segments.length) return "(no segments yet — click to place the first point)";
  const lines = [
    "=== PROGRAM 3.7 — FREEHAND BÉZIER SPLINES ===",
    `segments = ${segments.length}`,
    "",
  ];
  for (const [i, seg] of segments.entries()) {
    const [a, b, c, d] = seg.points;
    const coef = bezierCoefficients(a, b, c, d);
    lines.push(
      `--- segment ${i + 1} ---`,
      `  P0=(${fmt(a.x)}, ${fmt(a.y)})  P1=(${fmt(b.x)}, ${fmt(b.y)})`,
      `  P2=(${fmt(c.x)}, ${fmt(c.y)})  P3=(${fmt(d.x)}, ${fmt(d.y)})`,
      `  b=(${fmt(coef.bx)}, ${fmt(coef.by)})  c=(${fmt(coef.cx)}, ${fmt(coef.cy)})  d=(${fmt(coef.dx)}, ${fmt(coef.dy)})`,
    );
  }
  return lines.join("\n");
}

function fmt(v: number): string {
  return Number(v.toPrecision(6)).toString();
}
