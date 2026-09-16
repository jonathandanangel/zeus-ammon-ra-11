import * as React from "react";
import { Chart } from "@/components/game/numerical-extreme/Chart";
import {
  ErrorBanner,
  Field,
  GhostButton,
  Metric,
  NumberInput,
  Panel,
  RunButton,
  Select,
} from "@/components/game/numerical-extreme/ui";
import {
  downloadJson,
  formatNumber,
  HEAT_ACM_LABS,
  runAdolcDemo,
  runIsentropicNozzle,
  runLbfgsbDemo,
  runSparseLab,
  runStandardAtmosphere,
  runSteadyPlate,
  runStraightFin,
  runTransientPlate,
  type SparseMethod,
} from "@/game/numerical-extreme";
import { cn } from "@/lib/utils";

type LabMode =
  | "steady"
  | "transient"
  | "fin"
  | "atmosphere"
  | "nozzle"
  | "sparse"
  | "lbfgsb"
  | "adolc";

const LAB_OPTIONS: Array<{ id: LabMode; label: string }> = [
  { id: "steady", label: "Steady 2-D Plate Conduction" },
  { id: "transient", label: "Transient 2-D Plate Conduction" },
  { id: "fin", label: "Straight Fin" },
  { id: "atmosphere", label: "Standard Atmosphere" },
  { id: "nozzle", label: "Isentropic Nozzle" },
  { id: "sparse", label: "Sparse Solver Laboratory" },
  { id: "lbfgsb", label: "L-BFGS-B demo (bound min)" },
  { id: "adolc", label: "ADOL-C demo (derivatives)" },
];

function Heatmap({
  grid,
  title,
}: {
  grid: number[][];
  title: string;
}) {
  const flat = grid.flat().filter((v) => Number.isFinite(v));
  const lo = flat.length ? Math.min(...flat) : 0;
  const hi = flat.length ? Math.max(...flat) : 1;
  const ny = grid.length;
  const nx = grid[0]?.length ?? 0;
  return (
    <Panel title={title} eyebrow="Field">
      <div
        className="mx-auto w-full max-w-md overflow-hidden rounded-lg border border-cyan/30"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${nx}, minmax(0, 1fr))`,
          aspectRatio: `${nx} / ${Math.max(ny, 1)}`,
        }}
      >
        {grid.map((row, j) =>
          row.map((v, i) => {
            const t = hi === lo ? 0.5 : (v - lo) / (hi - lo);
            const hue = 220 - t * 180;
            return (
              <div
                key={`${j}-${i}`}
                title={`${formatNumber(v, 4)} K`}
                style={{ backgroundColor: `hsl(${hue} 85% ${28 + t * 42}%)` }}
              />
            );
          }),
        )}
      </div>
      <p className="mt-2 font-mono text-[10px] text-muted-foreground">
        {formatNumber(lo, 4)} → {formatNumber(hi, 4)} (cool → warm)
      </p>
    </Panel>
  );
}

export function HeatAerospacePanel() {
  const [lab, setLab] = React.useState<LabMode>("steady");
  const [error, setError] = React.useState("");
  const [log, setLog] = React.useState(
    "Heat Transfer Aerospace Numerical Toolbox V2 ready.\nRevision 15 September 2026 · Octave-native labs in TypeScript.",
  );
  const [chartX, setChartX] = React.useState<number[]>([]);
  const [chartSeries, setChartSeries] = React.useState<
    Array<{ key: string; label: string; values: Array<number | null>; color: string }>
  >([]);
  const [heatmap, setHeatmap] = React.useState<{ grid: number[][]; title: string } | null>(
    null,
  );
  const [metrics, setMetrics] = React.useState<Array<{ label: string; value: string }>>([]);
  const [exportPayload, setExportPayload] = React.useState<unknown>(null);

  const [nx, setNx] = React.useState(21);
  const [ny, setNy] = React.useState(21);
  const [Lx, setLx] = React.useState(1);
  const [Ly, setLy] = React.useState(1);
  const [k, setK] = React.useState(15);
  const [rho, setRho] = React.useState(7800);
  const [cp, setCp] = React.useState(500);
  const [T0, setT0] = React.useState(300);
  const [Tl, setTl] = React.useState(400);
  const [Tr, setTr] = React.useState(300);
  const [Tb, setTb] = React.useState(350);
  const [Tinf, setTinf] = React.useState(290);
  const [hconv, setHconv] = React.useState(25);
  const [dt, setDt] = React.useState(0.5);
  const [tf, setTf] = React.useState(20);
  const [finP, setFinP] = React.useState(0.04);
  const [finAc, setFinAc] = React.useState(0.0001);
  const [altitude, setAltitude] = React.useState(10000);
  const [gamma, setGamma] = React.useState(1.4);
  const [areaRatio, setAreaRatio] = React.useState(2);
  const [matrixOrder, setMatrixOrder] = React.useState(400);
  const [tol, setTol] = React.useState(1e-8);
  const [maxit, setMaxit] = React.useState(500);
  const [solver, setSolver] = React.useState<SparseMethod>("backslash");

  function clearViz() {
    setChartX([]);
    setChartSeries([]);
    setHeatmap(null);
    setMetrics([]);
    setExportPayload(null);
  }

  function applyAcmLab(id: (typeof HEAT_ACM_LABS)[number]["id"]) {
    const map: Partial<Record<(typeof HEAT_ACM_LABS)[number]["id"], LabMode>> = {
      fishpak: "steady",
      ifiss: "steady",
      pdecol: "transient",
      pdetwo: "transient",
      bdmg: "transient",
      bacolr: "transient",
      lsqr: "sparse",
      itpack: "sparse",
      umfpack: "sparse",
      gmres: "sparse",
      lbfgsb: "lbfgsb",
      adolc: "adolc",
      fin: "fin",
      atmosphere: "atmosphere",
      nozzle: "nozzle",
    };
    const next = map[id];
    if (next) {
      setLab(next);
      if (id === "lsqr") setSolver("lsqr");
      if (id === "itpack") setSolver("pcg");
      if (id === "umfpack") setSolver("backslash");
      if (id === "gmres") setSolver("gmres");
    }
  }

  function run() {
    setError("");
    clearViz();
    try {
      if (lab === "steady") {
        const r = runSteadyPlate({
          nx,
          ny,
          Lx,
          Ly,
          k,
          Tl,
          Tr,
          Tb,
          Tinf,
          hconv,
        });
        setLog(r.log.join("\n"));
        setHeatmap({ grid: r.temperature, title: "Steady temperature field" });
        setMetrics([
          { label: "Unknowns", value: String(r.unknowns) },
          { label: "nnz(A)", value: String(r.nnz) },
          { label: "‖r‖∞", value: r.residual.toExponential(3) },
          { label: "Time (s)", value: (r.elapsedMs / 1000).toFixed(4) },
        ]);
        setExportPayload(r);
        return;
      }
      if (lab === "transient") {
        const r = runTransientPlate({
          nx,
          ny,
          Lx,
          Ly,
          k,
          rho,
          cp,
          T0,
          Tl,
          Tr,
          Tb,
          Tinf,
          hconv,
          dt,
          tf,
        });
        setLog(r.log.join("\n"));
        setHeatmap({ grid: r.temperature, title: "Final transient temperature" });
        setChartX(r.history.map((h) => h.t));
        setChartSeries([
          {
            key: "meanT",
            label: "Mean T (K)",
            values: r.history.map((h) => h.meanT),
            color: "#22d3ee",
          },
        ]);
        setMetrics([
          { label: "Steps", value: String(r.history.length - 1) },
          {
            label: "Final mean T",
            value: formatNumber(r.history[r.history.length - 1]?.meanT, 6),
          },
        ]);
        setExportPayload(r);
        return;
      }
      if (lab === "fin") {
        const r = runStraightFin({
          L: Lx,
          k,
          Tb: T0,
          Tinf,
          hconv,
          P: finP,
          Ac: finAc,
        });
        setLog(r.log.join("\n"));
        setChartX(r.x);
        setChartSeries([
          { key: "T", label: "T (K)", values: r.temperature, color: "#22d3ee" },
          { key: "q", label: "q′ (W/m)", values: r.heatLoss, color: "#fbbf24" },
        ]);
        setMetrics([
          { label: "m (1/m)", value: formatNumber(r.m, 6) },
          { label: "q (W)", value: formatNumber(r.heatRate, 6) },
          { label: "η", value: r.efficiency.toFixed(6) },
        ]);
        setExportPayload(r);
        return;
      }
      if (lab === "atmosphere") {
        const r = runStandardAtmosphere(altitude);
        setLog(r.log.join("\n"));
        const km = r.altitude.map((h) => h / 1000);
        setChartX(km);
        setChartSeries([
          { key: "T", label: "T (K)", values: r.temperature, color: "#22d3ee" },
          {
            key: "p",
            label: "p (Pa) / 1e3",
            values: r.pressure.map((p) => p / 1000),
            color: "#a78bfa",
          },
        ]);
        setMetrics([
          { label: "T", value: formatNumber(r.temperature.at(-1), 6) },
          { label: "p", value: formatNumber(r.pressure.at(-1), 6) },
          { label: "ρ", value: formatNumber(r.density.at(-1), 6) },
          { label: "a", value: formatNumber(r.soundSpeed.at(-1), 6) },
        ]);
        setExportPayload(r);
        return;
      }
      if (lab === "nozzle") {
        const r = runIsentropicNozzle(gamma, areaRatio);
        setLog(r.log.join("\n"));
        setChartX(r.Ms);
        setChartSeries([
          { key: "AR", label: "A/A*", values: r.Afr, color: "#22d3ee" },
        ]);
        setMetrics([
          { label: "M_sub", value: formatNumber(r.Msub, 10) },
          { label: "M_sup", value: formatNumber(r.Msup, 10) },
        ]);
        setExportPayload(r);
        return;
      }
      if (lab === "sparse") {
        const r = runSparseLab(
          Math.max(3, Math.round(Math.sqrt(matrixOrder))),
          solver,
          tol,
          maxit,
        );
        setLog(r.log.join("\n"));
        setHeatmap({ grid: r.solutionGrid, title: `${r.method} solution` });
        setChartX(r.history.map((_, i) => i));
        setChartSeries([
          {
            key: "res",
            label: "‖r‖",
            values: r.history,
            color: "#34d399",
          },
        ]);
        setMetrics([
          { label: "Order", value: String(r.n) },
          { label: "Iters", value: String(r.iterations) },
          { label: "Rel res", value: r.relativeResidual.toExponential(3) },
          { label: "Flag", value: String(r.flag) },
        ]);
        setExportPayload(r);
        return;
      }
      if (lab === "lbfgsb") {
        const r = runLbfgsbDemo();
        setLog(r.log.join("\n"));
        setChartX(r.history.map((h) => h.k));
        setChartSeries([
          { key: "f", label: "f(x)", values: r.history.map((h) => h.f), color: "#fbbf24" },
          { key: "x", label: "x", values: r.history.map((h) => h.x), color: "#22d3ee" },
        ]);
        setMetrics([{ label: "x*", value: formatNumber(r.x, 8) }]);
        setExportPayload(r);
        return;
      }
      const r = runAdolcDemo();
      setLog(r.log.join("\n"));
      setMetrics([
        { label: "analytic", value: formatNumber(r.analytic, 12) },
        { label: "FD", value: formatNumber(r.fd, 12) },
        { label: "complex", value: formatNumber(r.complexStep, 12) },
      ]);
      setExportPayload(r);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "HTANT run failed.");
    }
  }

  const showPlate = lab === "steady" || lab === "transient";
  const showTransient = lab === "transient";
  const showFin = lab === "fin";
  const showAtmo = lab === "atmosphere";
  const showNozzle = lab === "nozzle";
  const showSparse = lab === "sparse";

  return (
    <div className="space-y-3">
      <Panel title="Heat Transfer Aerospace Numerical Toolbox V2" eyebrow="HTANT · 15 Sep 2026">
        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
          Octave-native laboratories for plate conduction, fins, atmosphere, nozzles, and sparse
          Krylov solvers — with an ACM reference map (FISHPAK → IFISS). Fidelity tags A–D match the
          V2 contract: related demos, not line-by-line Fortran ports.
        </p>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-[minmax(240px,340px)_minmax(0,1fr)]">
        <div className="space-y-3">
          <Panel title="Laboratory" eyebrow="Mode">
            <div className="space-y-3">
              <Field label="Module">
                <Select
                  value={lab}
                  onChange={(e) => {
                    setLab(e.target.value as LabMode);
                    clearViz();
                    setError("");
                  }}
                >
                  {LAB_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>

              {showPlate && (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Grid Nx">
                    <NumberInput value={nx} min={3} max={80} onChange={(e) => setNx(Number(e.target.value))} />
                  </Field>
                  <Field label="Grid Ny">
                    <NumberInput value={ny} min={3} max={80} onChange={(e) => setNy(Number(e.target.value))} />
                  </Field>
                  <Field label="Length X (m)">
                    <NumberInput value={Lx} step="any" onChange={(e) => setLx(Number(e.target.value))} />
                  </Field>
                  <Field label="Length Y (m)">
                    <NumberInput value={Ly} step="any" onChange={(e) => setLy(Number(e.target.value))} />
                  </Field>
                  <Field label="Conductivity k">
                    <NumberInput value={k} step="any" onChange={(e) => setK(Number(e.target.value))} />
                  </Field>
                  <Field label="Left T">
                    <NumberInput value={Tl} step="any" onChange={(e) => setTl(Number(e.target.value))} />
                  </Field>
                  <Field label="Right T">
                    <NumberInput value={Tr} step="any" onChange={(e) => setTr(Number(e.target.value))} />
                  </Field>
                  <Field label="Bottom T">
                    <NumberInput value={Tb} step="any" onChange={(e) => setTb(Number(e.target.value))} />
                  </Field>
                  <Field label="Top ambient T">
                    <NumberInput value={Tinf} step="any" onChange={(e) => setTinf(Number(e.target.value))} />
                  </Field>
                  <Field label="Top convection h">
                    <NumberInput value={hconv} step="any" onChange={(e) => setHconv(Number(e.target.value))} />
                  </Field>
                </div>
              )}

              {showTransient && (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Density ρ">
                    <NumberInput value={rho} step="any" onChange={(e) => setRho(Number(e.target.value))} />
                  </Field>
                  <Field label="Heat capacity cp">
                    <NumberInput value={cp} step="any" onChange={(e) => setCp(Number(e.target.value))} />
                  </Field>
                  <Field label="Initial T">
                    <NumberInput value={T0} step="any" onChange={(e) => setT0(Number(e.target.value))} />
                  </Field>
                  <Field label="Time step (s)">
                    <NumberInput value={dt} step="any" onChange={(e) => setDt(Number(e.target.value))} />
                  </Field>
                  <Field label="Final time (s)">
                    <NumberInput value={tf} step="any" onChange={(e) => setTf(Number(e.target.value))} />
                  </Field>
                </div>
              )}

              {showFin && (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Fin length L (m)">
                    <NumberInput value={Lx} step="any" onChange={(e) => setLx(Number(e.target.value))} />
                  </Field>
                  <Field label="Conductivity k">
                    <NumberInput value={k} step="any" onChange={(e) => setK(Number(e.target.value))} />
                  </Field>
                  <Field label="Base T">
                    <NumberInput value={T0} step="any" onChange={(e) => setT0(Number(e.target.value))} />
                  </Field>
                  <Field label="Ambient T">
                    <NumberInput value={Tinf} step="any" onChange={(e) => setTinf(Number(e.target.value))} />
                  </Field>
                  <Field label="Convection h">
                    <NumberInput value={hconv} step="any" onChange={(e) => setHconv(Number(e.target.value))} />
                  </Field>
                  <Field label="Perimeter">
                    <NumberInput value={finP} step="any" onChange={(e) => setFinP(Number(e.target.value))} />
                  </Field>
                  <Field label="Cross-section Ac">
                    <NumberInput value={finAc} step="any" onChange={(e) => setFinAc(Number(e.target.value))} />
                  </Field>
                </div>
              )}

              {showAtmo && (
                <Field label="Altitude (m)">
                  <NumberInput
                    value={altitude}
                    min={0}
                    max={84852}
                    step="any"
                    onChange={(e) => setAltitude(Number(e.target.value))}
                  />
                </Field>
              )}

              {showNozzle && (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Gamma">
                    <NumberInput value={gamma} step="any" onChange={(e) => setGamma(Number(e.target.value))} />
                  </Field>
                  <Field label="Area ratio A/A*">
                    <NumberInput
                      value={areaRatio}
                      step="any"
                      onChange={(e) => setAreaRatio(Number(e.target.value))}
                    />
                  </Field>
                </div>
              )}

              {showSparse && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Matrix order ≈ n">
                      <NumberInput
                        value={matrixOrder}
                        min={9}
                        max={1600}
                        onChange={(e) => setMatrixOrder(Number(e.target.value))}
                      />
                    </Field>
                    <Field label="Tolerance">
                      <NumberInput value={tol} step="any" onChange={(e) => setTol(Number(e.target.value))} />
                    </Field>
                    <Field label="Max iterations">
                      <NumberInput
                        value={maxit}
                        min={1}
                        max={5000}
                        onChange={(e) => setMaxit(Number(e.target.value))}
                      />
                    </Field>
                  </div>
                  <Field label="Solver">
                    <Select
                      value={solver}
                      onChange={(e) => setSolver(e.target.value as SparseMethod)}
                    >
                      <option value="backslash">Sparse backslash (dense direct)</option>
                      <option value="pcg">PCG / CG</option>
                      <option value="gmres">GMRES</option>
                      <option value="lsqr">Internal LSQR</option>
                    </Select>
                  </Field>
                </div>
              )}

              {(lab === "lbfgsb" || lab === "adolc") && (
                <p className="font-mono text-[10px] text-amber/90">
                  Type-D historical demo — fixed illustrative parameters (see engine log).
                </p>
              )}

              <RunButton type="button" onClick={run}>
                RUN
              </RunButton>
              {exportPayload != null && (
                <GhostButton
                  type="button"
                  onClick={() => downloadJson(`HTANT_V2_${lab}.json`, exportPayload)}
                >
                  Export Results
                </GhostButton>
              )}
              {error && <ErrorBanner message={error} />}
              {metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {metrics.map((m) => (
                    <Metric key={m.label} label={m.label} value={m.value} />
                  ))}
                </div>
              )}
            </div>
          </Panel>

          <Panel title="ACM reference map" eyebrow="Historical">
            <div className="flex max-h-64 flex-wrap gap-1.5 overflow-auto">
              {HEAT_ACM_LABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  title={item.blurb}
                  onClick={() => applyAcmLab(item.id)}
                  className={cn(
                    "rounded border border-cyan/30 bg-black/40 px-2 py-1 font-mono text-[9px] uppercase tracking-wide text-cyan transition hover:border-amber/50 hover:text-amber",
                  )}
                >
                  {item.label} · {item.algo}
                  <span className="ml-1 text-muted-foreground">({item.fidelity})</span>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-3">
          {heatmap && <Heatmap grid={heatmap.grid} title={heatmap.title} />}
          {chartX.length > 0 && chartSeries.length > 0 && (
            <Chart x={chartX} series={chartSeries} height={280} />
          )}
          <Panel title="Output log" eyebrow="HTANT V2">
            <pre className="max-h-80 overflow-auto rounded-lg border border-cyan/20 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-mint whitespace-pre-wrap">
              {log}
            </pre>
          </Panel>
        </div>
      </div>
    </div>
  );
}
