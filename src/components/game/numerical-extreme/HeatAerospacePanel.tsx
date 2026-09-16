import * as React from "react";
import { Chart } from "@/components/game/numerical-extreme/Chart";
import { Field2D, Surface3D } from "@/components/game/numerical-extreme/HeatViz";
import {
  ErrorBanner,
  Field,
  GhostButton,
  Metric,
  NumberInput,
  BoundNumberInput,
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

type FieldViz = {
  grid: number[][];
  xv: number[];
  yv: number[];
  title2d: string;
  title3d: string;
  showSurf: boolean;
};

export function HeatAerospacePanel() {
  const [lab, setLab] = React.useState<LabMode>("steady");
  const [status, setStatus] = React.useState("READY");
  const [error, setError] = React.useState("");
  const [log, setLog] = React.useState(
    "Heat Transfer Aerospace Numerical Toolbox V2 ready.\nRevision 15 September 2026 · Octave-native labs in TypeScript.",
  );
  const [chartX, setChartX] = React.useState<number[]>([]);
  const [chartSeries, setChartSeries] = React.useState<
    Array<{ key: string; label: string; values: Array<number | null>; color: string }>
  >([]);
  const [field, setField] = React.useState<FieldViz | null>(null);
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
  const [matrixOrder, setMatrixOrder] = React.useState(225);
  const [tol, setTol] = React.useState(1e-8);
  const [maxit, setMaxit] = React.useState(200);
  const [solver, setSolver] = React.useState<SparseMethod>("backslash");

  function clearViz() {
    setChartX([]);
    setChartSeries([]);
    setField(null);
    setMetrics([]);
    setExportPayload(null);
  }

  function selectLab(next: LabMode) {
    setLab(next);
    clearViz();
    setError("");
    setStatus("READY");
    // Browser-safe defaults when switching into transient / plate modes
    if (next === "transient") {
      setNx(11);
      setNy(11);
      setDt(1);
      setTf(20);
    } else if (next === "steady") {
      setNx(21);
      setNy(21);
    }
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
      selectLab(next);
      if (id === "lsqr") setSolver("lsqr");
      if (id === "itpack") setSolver("pcg");
      if (id === "umfpack") setSolver("backslash");
      if (id === "gmres") setSolver("gmres");
    }
  }

  function run() {
    setError("");
    clearViz();
    setStatus("RUNNING");
    try {
      if (lab === "steady") {
        const r = runSteadyPlate({ nx, ny, Lx, Ly, k, Tl, Tr, Tb, Tinf, hconv });
        setLog(r.log.join("\n"));
        setField({
          grid: r.temperature,
          xv: r.xv,
          yv: r.yv,
          title2d: "Steady temperature field",
          title3d: "Temperature surface",
          showSurf: true,
        });
        setMetrics([
          { label: "Unknowns", value: String(r.unknowns) },
          { label: "nnz(A)", value: String(r.nnz) },
          { label: "‖r‖∞", value: r.residual.toExponential(3) },
          { label: "Time (s)", value: (r.elapsedMs / 1000).toFixed(4) },
        ]);
        setExportPayload(r);
        setStatus("COMPLETE");
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
        // Octave: imagesc on ax1 + mean-T history on ax2 (not surf for transient)
        setField({
          grid: r.temperature,
          xv: r.xv,
          yv: r.yv,
          title2d: "Final transient temperature",
          title3d: "Temperature surface (optional)",
          showSurf: true,
        });
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
        setStatus("COMPLETE");
        return;
      }
      if (lab === "fin") {
        const r = runStraightFin({ L: Lx, k, Tb: T0, Tinf, hconv, P: finP, Ac: finAc });
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
        setStatus("COMPLETE");
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
        setStatus("COMPLETE");
        return;
      }
      if (lab === "nozzle") {
        const r = runIsentropicNozzle(gamma, areaRatio);
        setLog(r.log.join("\n"));
        setChartX(r.Ms);
        setChartSeries([
          { key: "AR", label: "A/A*", values: r.Afr, color: "#22d3ee" },
          {
            key: "pr",
            label: "p/p0 (mapped)",
            values: r.Ms.map((_, i) => {
              const m = r.Ms[i]!;
              const idx = Math.min(
                r.Mplot.length - 1,
                Math.max(0, Math.round((m / 5) * (r.Mplot.length - 1))),
              );
              return r.pr[idx]!;
            }),
            color: "#fbbf24",
          },
        ]);
        setMetrics([
          { label: "M_sub", value: formatNumber(r.Msub, 10) },
          { label: "M_sup", value: formatNumber(r.Msup, 10) },
        ]);
        setExportPayload(r);
        setStatus("COMPLETE");
        return;
      }
      if (lab === "sparse") {
        const ngrid = Math.max(3, Math.min(25, Math.round(Math.sqrt(matrixOrder))));
        const r = runSparseLab(ngrid, solver, tol, maxit);
        setLog(r.log.join("\n"));
        const xv = Array.from({ length: ngrid }, (_, i) => i + 1);
        const yv = [...xv];
        setField({
          grid: r.solutionGrid,
          xv,
          yv,
          title2d: `${r.method} solution`,
          title3d: "Solution surface",
          showSurf: true,
        });
        setChartX(r.history.map((_, i) => i));
        setChartSeries([
          { key: "res", label: "‖r‖", values: r.history, color: "#34d399" },
        ]);
        setMetrics([
          { label: "Order", value: String(r.n) },
          { label: "Iters", value: String(r.iterations) },
          { label: "Rel res", value: r.relativeResidual.toExponential(3) },
          { label: "Flag", value: String(r.flag) },
        ]);
        setExportPayload(r);
        setStatus("COMPLETE");
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
        setStatus("COMPLETE");
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
      setStatus("COMPLETE");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "HTANT run failed.");
      setStatus("ERROR");
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            Dual-pane visualization matches the Octave GUI: imagesc + surf(view 38,30) for
            conduction. Transient is LU-factored once and capped so the tab stays responsive.
          </p>
          <p
            className={cn(
              "font-mono text-xs font-bold uppercase tracking-[0.16em]",
              status === "READY" && "text-mint",
              status === "RUNNING" && "text-amber",
              status === "COMPLETE" && "text-mint",
              status === "ERROR" && "text-red-400",
            )}
          >
            {status}
          </p>
        </div>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-[minmax(240px,340px)_minmax(0,1fr)]">
        <div className="space-y-3">
          <Panel title="INPUTS" eyebrow="Laboratory">
            <div className="space-y-3">
              <Field label="Module">
                <Select value={lab} onChange={(e) => selectLab(e.target.value as LabMode)}>
                  {LAB_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>

              {showPlate && (
                <div className="grid grid-cols-2 gap-2">
                  <Field label={`Grid Nx${lab === "transient" ? " (≤17)" : " (≤31)"}`}>
                    <BoundNumberInput
                      value={nx}
                      min={3}
                      max={lab === "transient" ? 17 : 31}
                      onChange={setNx}
                    />
                  </Field>
                  <Field label={`Grid Ny${lab === "transient" ? " (≤17)" : " (≤31)"}`}>
                    <BoundNumberInput
                      value={ny}
                      min={3}
                      max={lab === "transient" ? 17 : 31}
                      onChange={setNy}
                    />
                  </Field>
                  <Field label="Length X (m)">
                    <BoundNumberInput value={Lx} onChange={setLx} />
                  </Field>
                  <Field label="Length Y (m)">
                    <BoundNumberInput value={Ly} onChange={setLy} />
                  </Field>
                  <Field label="Conductivity k">
                    <BoundNumberInput value={k} onChange={setK} />
                  </Field>
                  <Field label="Left T">
                    <BoundNumberInput value={Tl} onChange={setTl} />
                  </Field>
                  <Field label="Right T">
                    <BoundNumberInput value={Tr} onChange={setTr} />
                  </Field>
                  <Field label="Bottom T">
                    <BoundNumberInput value={Tb} onChange={setTb} />
                  </Field>
                  <Field label="Top ambient T">
                    <BoundNumberInput value={Tinf} onChange={setTinf} />
                  </Field>
                  <Field label="Top convection h">
                    <BoundNumberInput value={hconv} onChange={setHconv} />
                  </Field>
                </div>
              )}

              {showTransient && (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Density ρ">
                    <BoundNumberInput value={rho} onChange={setRho} />
                  </Field>
                  <Field label="Heat capacity cp">
                    <BoundNumberInput value={cp} onChange={setCp} />
                  </Field>
                  <Field label="Initial T">
                    <BoundNumberInput value={T0} onChange={setT0} />
                  </Field>
                  <Field label="Time step (s)">
                    <BoundNumberInput value={dt} onChange={setDt} />
                  </Field>
                  <Field label="Final time (s)">
                    <BoundNumberInput value={tf} onChange={setTf} />
                  </Field>
                  <p className="col-span-2 font-mono text-[10px] text-amber/90">
                    Auto-caps ≤48 steps · LU factored once (browser-safe vs Octave sparse \).
                  </p>
                </div>
              )}

              {showFin && (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Fin length L (m)">
                    <BoundNumberInput value={Lx} onChange={setLx} />
                  </Field>
                  <Field label="Conductivity k">
                    <BoundNumberInput value={k} onChange={setK} />
                  </Field>
                  <Field label="Base T">
                    <BoundNumberInput value={T0} onChange={setT0} />
                  </Field>
                  <Field label="Ambient T">
                    <BoundNumberInput value={Tinf} onChange={setTinf} />
                  </Field>
                  <Field label="Convection h">
                    <BoundNumberInput value={hconv} onChange={setHconv} />
                  </Field>
                  <Field label="Perimeter">
                    <BoundNumberInput value={finP} onChange={setFinP} />
                  </Field>
                  <Field label="Cross-section Ac">
                    <BoundNumberInput value={finAc} onChange={setFinAc} />
                  </Field>
                </div>
              )}

              {showAtmo && (
                <Field label="Altitude (m)">
                  <BoundNumberInput value={altitude} min={0} max={84852} onChange={setAltitude} />
                </Field>
              )}

              {showNozzle && (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Gamma">
                    <BoundNumberInput value={gamma} onChange={setGamma} />
                  </Field>
                  <Field label="Area ratio A/A*">
                    <BoundNumberInput value={areaRatio} onChange={setAreaRatio} />
                  </Field>
                </div>
              )}

              {showSparse && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Matrix order ≈ n">
                      <BoundNumberInput value={matrixOrder} min={9} max={625} onChange={setMatrixOrder} />
                    </Field>
                    <Field label="Tolerance">
                      <BoundNumberInput value={tol} onChange={setTol} />
                    </Field>
                    <Field label="Max iterations">
                      <BoundNumberInput value={maxit} min={1} max={2000} onChange={setMaxit} />
                    </Field>
                  </div>
                  <Field label="Solver">
                    <Select value={solver} onChange={(e) => setSolver(e.target.value as SparseMethod)}>
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
                  className="rounded border border-cyan/30 bg-black/40 px-2 py-1 font-mono text-[9px] uppercase tracking-wide text-cyan transition hover:border-amber/50 hover:text-amber"
                >
                  {item.label} · {item.algo}
                  <span className="ml-1 text-muted-foreground">({item.fidelity})</span>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-3">
          <Panel title="VISUALIZATION" eyebrow="ax1 · ax2">
            <div className="grid gap-3 xl:grid-cols-2">
              {field && <Field2D grid={field.grid} title={field.title2d} />}
              {field?.showSurf && (
                <Surface3D
                  xv={field.xv}
                  yv={field.yv}
                  grid={field.grid}
                  title={field.title3d}
                />
              )}
            </div>
            {chartX.length > 0 && chartSeries.length > 0 && (
              <div className="mt-3">
                <Chart x={chartX} series={chartSeries} height={260} />
              </div>
            )}
            {!field && chartX.length === 0 && (
              <p className="font-mono text-[11px] text-muted-foreground">
                Run a laboratory to populate imagesc / surf panes (Octave dual-axis layout).
              </p>
            )}
          </Panel>

          <Panel title="OUTPUT LOG" eyebrow="HTANT V2">
            <pre className="max-h-72 overflow-auto rounded-sm border border-cyan/20 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-mint whitespace-pre-wrap">
              {log}
            </pre>
          </Panel>
        </div>
      </div>
    </div>
  );
}
