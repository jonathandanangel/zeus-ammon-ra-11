import * as React from "react";
import { formatNumber } from "@/game/numerical-extreme";
import { Panel } from "@/components/game/numerical-extreme/ui";

function tempColor(t: number, lo: number, hi: number): string {
  const u = hi === lo ? 0.5 : (t - lo) / (hi - lo);
  const hue = 220 - u * 180;
  return `hsl(${hue} 85% ${28 + u * 42}%)`;
}

function rangeOf(grid: number[][]): { lo: number; hi: number } {
  let lo = Infinity;
  let hi = -Infinity;
  for (const row of grid) {
    for (const v of row) {
      if (!Number.isFinite(v)) continue;
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
  }
  if (!Number.isFinite(lo)) return { lo: 0, hi: 1 };
  return { lo, hi };
}

/** Octave-style imagesc field (canvas, not DOM cells). */
export function Field2D({
  grid,
  title,
  xLabel = "x",
  yLabel = "y",
}: {
  grid: number[][];
  title: string;
  xLabel?: string;
  yLabel?: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const { lo, hi } = rangeOf(grid);
  const ny = grid.length;
  const nx = grid[0]?.length ?? 0;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nx < 1 || ny < 1) return;
    const w = canvas.width;
    const h = canvas.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#051018";
    ctx.fillRect(0, 0, w, h);
    const cellW = w / nx;
    const cellH = h / ny;
    for (let j = 0; j < ny; j += 1) {
      for (let i = 0; i < nx; i += 1) {
        ctx.fillStyle = tempColor(grid[j]![i]!, lo, hi);
        // YDir normal like Octave imagesc after set(gca,'YDir','normal')
        ctx.fillRect(i * cellW, (ny - 1 - j) * cellH, cellW + 0.5, cellH + 0.5);
      }
    }
  }, [grid, nx, ny, lo, hi]);

  return (
    <Panel title={title} eyebrow="imagesc">
      <canvas
        ref={canvasRef}
        width={360}
        height={300}
        className="h-auto w-full rounded border border-cyan/30 bg-[#051018]"
      />
      <p className="mt-2 font-mono text-[10px] text-muted-foreground">
        {xLabel} × {yLabel} · {formatNumber(lo, 4)} → {formatNumber(hi, 4)} K
      </p>
    </Panel>
  );
}

type Pt = { x: number; y: number; z: number; depth: number };

/**
 * Octave axSurf equivalent: surf(...,'EdgeColor','none'); view(38,30).
 * Azimuth 38°, elevation 30° — filled facets, painter's algorithm.
 */
export function Surface3D({
  xv,
  yv,
  grid,
  title,
}: {
  xv: number[];
  yv: number[];
  grid: number[][];
  title: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const { lo, hi } = rangeOf(grid);
  const ny = grid.length;
  const nx = grid[0]?.length ?? 0;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nx < 2 || ny < 2) return;
    const w = canvas.width;
    const h = canvas.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#051018";
    ctx.fillRect(0, 0, w, h);

    const az = (38 * Math.PI) / 180;
    const el = (30 * Math.PI) / 180;
    const cosA = Math.cos(az);
    const sinA = Math.sin(az);
    const cosE = Math.cos(el);
    const sinE = Math.sin(el);

    const xMin = xv[0] ?? 0;
    const xMax = xv[nx - 1] ?? 1;
    const yMin = yv[0] ?? 0;
    const yMax = yv[ny - 1] ?? 1;
    const zMin = lo;
    const zMax = hi === lo ? lo + 1 : hi;

    const project = (xi: number, yi: number, zi: number): Pt => {
      const xn = (2 * (xi - xMin)) / (xMax - xMin || 1) - 1;
      const yn = (2 * (yi - yMin)) / (yMax - yMin || 1) - 1;
      const zn = (2 * (zi - zMin)) / (zMax - zMin || 1) - 1;
      // MATLAB/Octave-style view projection
      const sx = xn * cosA + yn * sinA;
      const sy = -xn * sinA * sinE + yn * cosA * sinE + zn * cosE;
      const depth = xn * sinA * cosE - yn * cosA * cosE + zn * sinE;
      return {
        x: w * 0.5 + sx * w * 0.38,
        y: h * 0.55 - sy * h * 0.38,
        z: zi,
        depth,
      };
    };

    type Quad = { pts: [Pt, Pt, Pt, Pt]; zAvg: number; depth: number };
    const quads: Quad[] = [];
    for (let j = 0; j < ny - 1; j += 1) {
      for (let i = 0; i < nx - 1; i += 1) {
        const z00 = grid[j]![i]!;
        const z10 = grid[j]![i + 1]!;
        const z01 = grid[j + 1]![i]!;
        const z11 = grid[j + 1]![i + 1]!;
        const p00 = project(xv[i]!, yv[j]!, z00);
        const p10 = project(xv[i + 1]!, yv[j]!, z10);
        const p01 = project(xv[i]!, yv[j + 1]!, z01);
        const p11 = project(xv[i + 1]!, yv[j + 1]!, z11);
        quads.push({
          pts: [p00, p10, p11, p01],
          zAvg: 0.25 * (z00 + z10 + z01 + z11),
          depth: 0.25 * (p00.depth + p10.depth + p01.depth + p11.depth),
        });
      }
    }
    quads.sort((a, b) => a.depth - b.depth);

    for (const q of quads) {
      ctx.beginPath();
      ctx.moveTo(q.pts[0].x, q.pts[0].y);
      ctx.lineTo(q.pts[1].x, q.pts[1].y);
      ctx.lineTo(q.pts[2].x, q.pts[2].y);
      ctx.lineTo(q.pts[3].x, q.pts[3].y);
      ctx.closePath();
      ctx.fillStyle = tempColor(q.zAvg, lo, hi);
      ctx.fill();
      ctx.strokeStyle = "rgba(8,20,36,0.35)";
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(165,243,252,0.75)";
    ctx.font = "11px ui-monospace, monospace";
    ctx.fillText("T", 12, 18);
    ctx.fillText("view(38,30)", w - 88, 18);
  }, [grid, xv, yv, nx, ny, lo, hi]);

  return (
    <Panel title={title} eyebrow="surf · view(38,30)">
      <canvas
        ref={canvasRef}
        width={420}
        height={320}
        className="h-auto w-full rounded border border-cyan/30 bg-[#051018]"
      />
      <p className="mt-2 font-mono text-[10px] text-muted-foreground">
        Temperature surface · {formatNumber(lo, 4)} → {formatNumber(hi, 4)} K
      </p>
    </Panel>
  );
}
