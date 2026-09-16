import * as React from "react";
import { Chart } from "@/components/game/numerical-extreme/Chart";
import { HeatAerospacePanel } from "@/components/game/numerical-extreme/HeatAerospacePanel";
import { BrainOverload } from "@/components/game/BrainOverload";
import {
  EquationBox,
  ErrorBanner,
  Field,
  GhostButton,
  Metric,
  BoundNumberInput,
  DraftNumberInput,
  GraphBoundsFields,
  NumericalComputeContext,
  Panel,
  RunButton,
  Select,
  TextArea,
  TextInput,
} from "@/components/game/numerical-extreme/ui";
import {
  analyzeFunction,
  analyzeVibration,
  buildFunctionReport,
  buildMethodFormulation,
  buildVibrationReport,
  buildBezierSegment,
  compileScalar,
  compositeIntegration,
  COMPOSITE_FORMULAS,
  downloadJson,
  formatBezierLog,
  formatNumber,
  formatNumerologyReport,
  FUNCTION_PRESETS,
  interpolate,
  parseNumberList,
  runAcm618,
  runAcm618Suite,
  runAcm619,
  runAcm740,
  runAcm740Suite,
  runDerpar,
  runGeneticRootFinder,
  runModifiedCholesky,
  runTalbot,
  solveNonlinearSystem,
  SYMBOLIC_PRESETS,
  symbolicIntegrate,
  TOOLBOX_REFERENCES,
  vectorizeExpression,
  wordToNumerology,
  lookupJohnsonInline,
  loadJohnsonResources,
  lookupJohnsonEditions,
  searchSecretDoctrine,
  searchGreekMyths,
  getRuckmanVersesForNumber,
  thoughtFormBundleForNumber,
  COLOUR_KEY_GENERAL_SOURCE,
  type Acm618OrderingMode,
  type Acm740MatrixKind,
  type BezierSegment,
  type FunctionAnalysisResult,
  type IntegrationResult,
  type InterpolationResult,
  type NonlinearSystemResult,
  type NumerologyResult,
  type JohnsonSense,
  type SecretDoctrinePassage,
  type GreekMythPassage,
  type RuckmanVerse,
  type NumberPhilosophy,
  PHILOSOPHY_DISCLAIMER,
  type Point2,
  type VibrationResult,
} from "@/game/numerical-extreme";
import { audio } from "@/game/audio";
import { useGame } from "@/game/store";
import { cn } from "@/lib/utils";

type Mode =
  | "main"
  | "vector"
  | "method"
  | "composite"
  | "diff"
  | "algorithms"
  | "acm"
  | "bezier"
  | "symbolic"
  | "genetic"
  | "heat"
  | "numerology"
  | "references";

const MODES: Array<{ id: Mode; label: string }> = [
  { id: "main", label: "MAIN" },
  { id: "vector", label: "VECTOR" },
  { id: "method", label: "METHOD" },
  { id: "composite", label: "COMPOSITE" },
  { id: "diff", label: "DIFF" },
  { id: "algorithms", label: "ALGORITHMS" },
  { id: "acm", label: "ACM SPARS" },
  { id: "bezier", label: "BEZIER" },
  { id: "symbolic", label: "SYMBOLIC" },
  { id: "genetic", label: "GENETIC" },
  { id: "heat", label: "HEAT" },
  { id: "numerology", label: "NUMEROLOGY" },
  { id: "references", label: "REFS" },
];

export interface NumericalExtremeGameProps {
  onMenu: () => void;
}

function MainPanel() {
  const [expression, setExpression] = React.useState(FUNCTION_PRESETS[0]!.expr);
  const [a, setA] = React.useState(FUNCTION_PRESETS[0]!.a);
  const [b, setB] = React.useState(FUNCTION_PRESETS[0]!.b);
  const [tolerance, setTolerance] = React.useState(1e-6);
  const [maxIterations, setMaxIterations] = React.useState(200);
  const [gridPoints, setGridPoints] = React.useState(400);
  const [degrees, setDegrees] = React.useState("2, 5");
  const [shift, setShift] = React.useState(true);
  const [seedOne, setSeedOne] = React.useState("");
  const [seedTwo, setSeedTwo] = React.useState("");
  const [clickMode, setClickMode] = React.useState<"off" | "inspect" | "secant">("inspect");
  const [seedStage, setSeedStage] = React.useState(0);
  const [clickedPoints, setClickedPoints] = React.useState<Array<{ x: number; y: number }>>([]);

  const [vibrationMode, setVibrationMode] = React.useState<"free" | "forced">("free");
  const [mass, setMass] = React.useState(1);
  const [damping, setDamping] = React.useState(0.4);
  const [stiffness, setStiffness] = React.useState(4);
  const [x0, setX0] = React.useState(0.866025403784);
  const [v0, setV0] = React.useState(0);
  const [force, setForce] = React.useState(0.866025403784);
  const [omega, setOmega] = React.useState(3);
  const [duration, setDuration] = React.useState(25);

  const [functionResult, setFunctionResult] = React.useState<FunctionAnalysisResult | null>(null);
  const [vibrationResult, setVibrationResult] = React.useState<VibrationResult | null>(null);
  const [activeOutput, setActiveOutput] = React.useState<"function" | "vibration" | null>(null);
  const [log, setLog] = React.useState("(output will appear here)");
  const [error, setError] = React.useState("");
  const compute = React.useContext(NumericalComputeContext);

  function appendClickLog(line: string) {
    setLog((prev) => `${prev}\n${line}`);
  }

  function runFunction(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const seeds =
        seedOne.trim() && seedTwo.trim()
          ? ([Number(seedOne), Number(seedTwo)] as [number, number])
          : null;
      const result = analyzeFunction(
        expression,
        a,
        b,
        tolerance,
        maxIterations,
        gridPoints,
        shift,
        parseNumberList(degrees).map(Math.round),
        seeds,
      );
      setFunctionResult(result);
      setVibrationResult(null);
      setActiveOutput("function");
      setClickedPoints([]);
      setSeedStage(0);
      setLog(buildFunctionReport(result));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Analysis failed.");
    }
  }

  function runVibration() {
    setError("");
    compute?.();
    try {
      const result = analyzeVibration(
        vibrationMode,
        mass,
        damping,
        stiffness,
        x0,
        v0,
        force,
        omega,
        duration,
        1200,
      );
      setVibrationResult(result);
      setActiveOutput("vibration");
      setClickedPoints([]);
      setLog((prev) => {
        const block = buildVibrationReport(result);
        if (prev.startsWith("(output") || prev.startsWith("(output cleared)")) return block;
        return `${prev}\n\n${block}`;
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Vibration analysis failed.");
    }
  }

  function clearOutput() {
    setFunctionResult(null);
    setVibrationResult(null);
    setActiveOutput(null);
    setClickedPoints([]);
    setSeedStage(0);
    setLog("(output cleared)");
    setError("");
  }

  function handleChartClick(point: { x: number; y: number }) {
    if (clickMode === "off") return;
    setClickedPoints((prev) => [...prev, point]);
    appendClickLog(
      `Clicked point: x=${formatNumber(point.x, 12)}, y=${formatNumber(point.y, 12)}`,
    );
    if (clickMode === "secant" && activeOutput === "function") {
      if (seedStage === 0) {
        setSeedOne(String(point.x));
        setSeedStage(1);
        appendClickLog(`Secant seed 1 ← ${formatNumber(point.x, 12)}`);
      } else {
        const first = Number(seedOne);
        const pair = [first, point.x].sort((u, v) => u - v);
        setSeedOne(String(pair[0]));
        setSeedTwo(String(pair[1]));
        setSeedStage(0);
        appendClickLog(
          `Secant seeds ← [${formatNumber(pair[0]!, 12)}, ${formatNumber(pair[1]!, 12)}]`,
        );
      }
    }
  }

  const seedMarkers =
    clickMode === "secant"
      ? [
          seedOne.trim() && Number.isFinite(Number(seedOne))
            ? { x: Number(seedOne), y: 0, color: "#f59e0b", label: "s0" }
            : null,
          seedTwo.trim() && Number.isFinite(Number(seedTwo))
            ? { x: Number(seedTwo), y: 0, color: "#f59e0b", label: "s1" }
            : null,
        ].filter(Boolean) as Array<{ x: number; y: number; color: string; label: string }>
      : [];

  const chart = React.useMemo(() => {
    const inspectMarkers = clickedPoints.map((p) => ({
      x: p.x,
      y: p.y,
      color: "#f472b6",
      label: `(${formatNumber(p.x, 4)}, ${formatNumber(p.y, 4)})`,
    }));
    const clickProps =
      clickMode === "off"
        ? {}
        : {
            onPointClick: (point: { x: number; y: number; index: number }) => {
              handleChartClick(point);
            },
          };

    if (activeOutput === "function" && functionResult) {
      return (
        <Chart
          x={functionResult.plot.x}
          series={[
            {
              key: "function",
              label: "f(x)",
              values: functionResult.plot.y,
              color: "#22d3ee",
            },
          ]}
          referenceX={[
            ...functionResult.ivt.roots,
            ...seedMarkers.map((m) => m.x),
          ]}
          referenceY={0}
          markers={inspectMarkers}
          {...clickProps}
          height={300}
        />
      );
    }
    if (
      activeOutput === "vibration" &&
      vibrationResult?.mode === "free" &&
      Array.isArray(vibrationResult.plot["time"]) &&
      Array.isArray(vibrationResult.plot["displacement"])
    ) {
      return (
        <Chart
          x={vibrationResult.plot["time"] as number[]}
          series={[
            {
              key: "displacement",
              label: "x(t)",
              values: vibrationResult.plot["displacement"] as Array<number | null>,
              color: "#22d3ee",
            },
          ]}
          referenceY={0}
          markers={inspectMarkers}
          {...clickProps}
          height={300}
        />
      );
    }
    if (
      activeOutput === "vibration" &&
      vibrationResult?.mode === "forced" &&
      Array.isArray(vibrationResult.plot["frequencyRatio"]) &&
      Array.isArray(vibrationResult.plot["magnification"])
    ) {
      return (
        <Chart
          x={vibrationResult.plot["frequencyRatio"] as number[]}
          series={[
            {
              key: "magnification",
              label: "M(r)",
              values: vibrationResult.plot["magnification"] as Array<number | null>,
              color: "#22d3ee",
            },
          ]}
          markers={inspectMarkers}
          {...clickProps}
          height={300}
        />
      );
    }
    return (
      <div className="grid h-[300px] place-items-center rounded-sm border border-dashed border-cyan/25 bg-deepblue/40 text-center">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
            No plot data
          </p>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground/70">
            Run analysis or vibration.
          </p>
        </div>
      </div>
    );
  }, [
    activeOutput,
    functionResult,
    vibrationResult,
    clickMode,
    clickedPoints,
    seedMarkers,
    seedOne,
    seedStage,
  ]);

  return (
    <form
      onSubmit={runFunction}
      className="grid gap-3 xl:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]"
    >
      <aside className="space-y-4 rounded-sm border border-cyan/35 bg-deepblue/50 backdrop-blur-md p-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-amber">Inputs</p>
        <div className="space-y-2">
          <Field label="f(x)">
            <TextInput
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              spellCheck={false}
            />
          </Field>
          <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">
            {FUNCTION_PRESETS.map((preset) => (
              <GhostButton
                key={preset.label}
                type="button"
                title={preset.note ? `${preset.expr}\n${preset.note}` : preset.expr}
                onClick={() => {
                  setExpression(preset.expr);
                  setA(preset.a);
                  setB(preset.b);
                }}
              >
                {preset.label}
              </GhostButton>
            ))}
          </div>
          <p className="font-mono text-[9px] text-muted-foreground">
            {FUNCTION_PRESETS.length} V15 demo f(x) samples · hover for expression
          </p>
          <GraphBoundsFields a={a} b={b} onAChange={setA} onBChange={setB} />
          <Field label="Plot click mode">
            <Select
              value={clickMode}
              onChange={(e) => {
                setClickMode(e.target.value as "off" | "inspect" | "secant");
                setSeedStage(0);
              }}
            >
              <option value="off">Off</option>
              <option value="inspect">Inspect (snap + log)</option>
              <option value="secant">Pick Secant seeds</option>
            </Select>
          </Field>
          <Field label="Secant seeds" hint={clickMode === "secant" ? "click plot twice" : "blank = auto"}>
            <div className="grid grid-cols-2 gap-2">
              <Field label="x0">
                <DraftNumberInput
                  value={seedOne}
                  placeholder="x0"
                  onChange={setSeedOne}
                />
              </Field>
              <Field label="x1">
                <DraftNumberInput
                  value={seedTwo}
                  placeholder="x1"
                  onChange={setSeedTwo}
                />
              </Field>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="TOL">
              <BoundNumberInput value={tolerance} onChange={setTolerance} />
            </Field>
            <Field label="MAXIT">
              <BoundNumberInput value={maxIterations} onChange={setMaxIterations} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="GRIDN">
              <BoundNumberInput value={gridPoints} onChange={setGridPoints} />
            </Field>
            <Field label="Taylor degs">
              <TextInput value={degrees} onChange={(e) => setDegrees(e.target.value)} />
            </Field>
          </div>
          <label className="flex items-center gap-2 rounded-sm border border-cyan/30 bg-deepblue/50 backdrop-blur-md px-3 py-2 font-mono text-[10px] text-moon/80">
            <input
              type="checkbox"
              checked={shift}
              onChange={(e) => setShift(e.target.checked)}
              className="accent-cyan"
            />
            Shift-to-zero (y = x − c)
          </label>
        </div>

        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-amber">
          Vibrations (SDOF)
        </p>
        <div className="space-y-2">
          <Field label="Mode">
            <Select
              value={vibrationMode}
              onChange={(e) => setVibrationMode(e.target.value as "free" | "forced")}
            >
              <option value="free">Free response</option>
              <option value="forced">Forced steady-state</option>
            </Select>
          </Field>
          {(
            [
              ["m (kg)", mass, setMass],
              ["c (N·s/m)", damping, setDamping],
              ["k (N/m)", stiffness, setStiffness],
              ["x0 (m)", x0, setX0],
              ["v0 (m/s)", v0, setV0],
              ["F0 (N)", force, setForce],
              ["ω", omega, setOmega],
              ["tEnd (s)", duration, setDuration],
            ] as const
          ).map(([label, value, setter]) => (
            <Field key={label} label={label}>
              <BoundNumberInput value={value} onChange={setter} />
            </Field>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <RunButton>Run analysis</RunButton>
          <GhostButton type="button" onClick={runVibration} className="w-full py-2.5">
            Run vibration
          </GhostButton>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <GhostButton type="button" onClick={clearOutput} className="w-full">
            Clear output
          </GhostButton>
          <GhostButton
            type="button"
            className="w-full"
            onClick={() => {
              setClickedPoints([]);
              appendClickLog("Clicked points cleared.");
            }}
          >
            Clear clicks
          </GhostButton>
        </div>
        {error && <ErrorBanner message={error} />}
      </aside>

      <div className="min-w-0 space-y-3">
        {chart}
        <Panel title="Engine log" eyebrow="V15 telemetry · sections 1–11">
          <pre className="max-h-80 overflow-auto rounded-sm border border-cyan/20 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-mint whitespace-pre-wrap">
            {log}
          </pre>
        </Panel>
      </div>
    </form>
  );
}

function VectorPanel() {
  const [raw, setRaw] = React.useState(
    "-20000 + 7000*((((1+x)^3 - 1) / (x*(1+x)^3))) + 8000 / (1+x)^3",
  );
  const [a, setA] = React.useState(-2);
  const [b, setB] = React.useState(2);
  const [result, setResult] = React.useState<{
    cleaned: string;
    python: string;
    octave: string;
  } | null>(null);
  const [previewX, setPreviewX] = React.useState<number[]>([]);
  const [previewY, setPreviewY] = React.useState<Array<number | null>>([]);
  const [inspect, setInspect] = React.useState<Array<{ x: number; y: number }>>([]);
  const [status, setStatus] = React.useState(
    "READY | Paste an equation, vectorize it, then plot.",
  );
  const [error, setError] = React.useState("");
  const [copied, setCopied] = React.useState("");

  function vectorize(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const data = vectorizeExpression(raw);
      setResult(data);
      setPreviewX([]);
      setPreviewY([]);
      setInspect([]);
      setStatus("VECTORIZATION COMPLETE | Output is ready.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Vectorization failed.");
    }
  }

  function plotPreview() {
    if (!result) return;
    setError("");
    try {
      const fn = compileScalar(result.cleaned);
      const n = 400;
      const xs: number[] = [];
      const ys: Array<number | null> = [];
      for (let i = 0; i < n; i += 1) {
        const x = a + ((b - a) * i) / (n - 1);
        xs.push(x);
        try {
          const y = fn(x);
          ys.push(Number.isFinite(y) ? y : null);
        } catch {
          ys.push(null);
        }
      }
      setPreviewX(xs);
      setPreviewY(ys);
      setInspect([]);
      setStatus(
        `PLOT COMPLETE | ${ys.filter((v) => v !== null).length} finite real samples.`,
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Preview failed.");
    }
  }

  async function copy(name: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(name);
      setStatus(`OUTPUT COPIED (${name})`);
      window.setTimeout(() => setCopied(""), 1200);
    } catch {
      setError("Clipboard unavailable.");
    }
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <form onSubmit={vectorize} className="space-y-3">
        <Panel title="Equation conversion matrix" eyebrow="VECTOR lab">
          <div className="space-y-3">
            <Field label="Paste raw algebraic equation" hint="implicit products cleaned">
              <TextArea value={raw} onChange={(e) => setRaw(e.target.value)} rows={8} />
            </Field>
            <GraphBoundsFields
              a={a}
              b={b}
              onAChange={setA}
              onBChange={setB}
              aLabel="Lower x"
              bLabel="Upper x"
            />
            <RunButton>Vectorize & clean</RunButton>
            {error && <ErrorBanner message={error} />}
            <p className="font-mono text-[10px] text-mint/80">{status}</p>
          </div>
        </Panel>
      </form>

      <div className="space-y-3">
        {!result ? (
          <Panel title="Ready" eyebrow="VECTOR">
            <p className="font-mono text-xs text-muted-foreground">
              Turn handwritten algebra into cleaned, Python, and Octave forms, then sample with the
              local scalar compiler. Click the plot to inspect nearest samples (V15 inspect mode).
            </p>
          </Panel>
        ) : (
          <>
            <Panel title="Conversion matrix" eyebrow="Portable forms">
              <div className="space-y-3">
                {(
                  [
                    ["Readable", result.cleaned],
                    ["Python", result.python],
                    ["Octave / MATLAB", result.octave],
                  ] as const
                ).map(([name, value]) => (
                  <div key={name}>
                    <div className="mb-1 flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan">
                        {name}
                      </p>
                      <GhostButton type="button" onClick={() => copy(name, value)}>
                        {copied === name ? "Copied" : "Copy"}
                      </GhostButton>
                    </div>
                    <pre className="overflow-x-auto rounded-sm border border-cyan/20 bg-black/40 p-2.5 font-mono text-[11px] text-mint">
                      {value}
                    </pre>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2">
                  <GhostButton type="button" onClick={plotPreview} className="w-full">
                    Plot clean equation
                  </GhostButton>
                  <GhostButton
                    type="button"
                    className="w-full"
                    onClick={() => {
                      setInspect([]);
                      setStatus("Inspection points cleared.");
                    }}
                  >
                    Clear dots
                  </GhostButton>
                </div>
              </div>
            </Panel>
            {previewX.length > 0 && (
              <Chart
                x={previewX}
                series={[
                  { key: "f", label: "f(x)", values: previewY, color: "#e879f9" },
                ]}
                referenceY={0}
                markers={inspect.map((p) => ({
                  x: p.x,
                  y: p.y,
                  color: "#22d3ee",
                  label: `(${formatNumber(p.x, 4)}, ${formatNumber(p.y, 4)})`,
                }))}
                onPointClick={(point) => {
                  setInspect((prev) => [...prev, { x: point.x, y: point.y }]);
                  setStatus(
                    `INSPECT | x=${formatNumber(point.x, 12)}, y=${formatNumber(point.y, 12)}`,
                  );
                }}
                height={280}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MethodPanel() {
  const [systemSize, setSystemSize] = React.useState<2 | 3>(3);
  const [eq1, setEq1] = React.useState("5*x + sin(y) + z^2 - 1");
  const [eq2, setEq2] = React.useState("x^2 + 6*y - cos(z)");
  const [eq3, setEq3] = React.useState("x - y + 4*z - 2");
  const [initial, setInitial] = React.useState("0, 0, 0");
  const [outerTol, setOuterTol] = React.useState(1e-8);
  const [outerMax, setOuterMax] = React.useState(30);
  const [innerTol, setInnerTol] = React.useState(1e-10);
  const [innerMax, setInnerMax] = React.useState(100);
  const [page, setPage] = React.useState<"workflow" | "jacobian" | "split" | "pseudo" | "solve">(
    "workflow",
  );
  const [result, setResult] = React.useState<NonlinearSystemResult | null>(null);
  const [error, setError] = React.useState("");

  const equations =
    systemSize === 3 ? [eq1, eq2, eq3] : [eq1, eq2];
  const guessParts = initial.split(/[,;\s]+/).filter(Boolean);
  const formulation = buildMethodFormulation(equations, guessParts);

  function applySize(next: 2 | 3) {
    setSystemSize(next);
    setResult(null);
    setPage("workflow");
    if (next === 3) {
      setEq1("5*x + sin(y) + z^2 - 1");
      setEq2("x^2 + 6*y - cos(z)");
      setEq3("x - y + 4*z - 2");
      setInitial("0, 0, 0");
    } else {
      setEq1("5*x + sin(y) - 1");
      setEq2("x^2 + 6*y - 1");
      setEq3("x - y + 4*z - 2");
      setInitial("0, 0");
    }
  }

  function run(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPage("solve");
    try {
      const guess = parseNumberList(initial);
      if (guess.length !== systemSize) {
        throw new Error(`Initial vector must contain exactly ${systemSize} values.`);
      }
      const system =
        systemSize === 3 ? [eq1, eq2, eq3] : [eq1, eq2];
      setResult(
        solveNonlinearSystem(system, guess, outerTol, outerMax, innerTol, innerMax),
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "System solve failed.");
    }
  }

  const jacobi = result?.diagonalNonlinearJacobi;
  const newton = result?.inexactNewtonJacobi;
  const traceLen = result
    ? Math.max(jacobi?.history.length ?? 0, newton?.history.length ?? 0)
    : 0;
  const traceX = Array.from({ length: traceLen }, (_, i) => i);
  const varHint = systemSize === 3 ? "x, y, z" : "x, y";

  const pages = [
    ["workflow", "WORKFLOW"],
    ["jacobian", "JACOBIAN"],
    ["split", "JACOBI SPLIT"],
    ["pseudo", "PSEUDOCODE"],
    ["solve", "ANALYSIS"],
  ] as const;

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <form onSubmit={run} className="space-y-3">
        <Panel title="Problem input" eyebrow="Newton–Jacobi method builder">
          <div className="space-y-3">
            <Field label="System size">
              <Select
                value={String(systemSize)}
                onChange={(e) => applySize(Number(e.target.value) as 2 | 3)}
              >
                <option value="3">3 × 3</option>
                <option value="2">2 × 2</option>
              </Select>
            </Field>
            <Field label={`f₁(${varHint}) = 0`}>
              <TextInput value={eq1} onChange={(e) => setEq1(e.target.value)} spellCheck={false} />
            </Field>
            <Field label={`f₂(${varHint}) = 0`}>
              <TextInput value={eq2} onChange={(e) => setEq2(e.target.value)} spellCheck={false} />
            </Field>
            {systemSize === 3 && (
              <Field label="f₃(x, y, z) = 0">
                <TextInput
                  value={eq3}
                  onChange={(e) => setEq3(e.target.value)}
                  spellCheck={false}
                />
              </Field>
            )}
            <Field
              label="Initial X⁽⁰⁾"
              hint={systemSize === 3 ? "three values, comma-separated" : "two values, comma-separated"}
            >
              <TextInput value={initial} onChange={(e) => setInitial(e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Outer TOL">
                <BoundNumberInput value={outerTol} onChange={setOuterTol} />
              </Field>
              <Field label="Outer MAX">
                <BoundNumberInput value={outerMax} onChange={setOuterMax} />
              </Field>
              <Field label="Inner TOL">
                <BoundNumberInput value={innerTol} onChange={setInnerTol} />
              </Field>
              <Field label="Inner MAX">
                <BoundNumberInput value={innerMax} onChange={setInnerMax} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <GhostButton
                type="button"
                onClick={() => {
                  applySize(3);
                  setPage("workflow");
                }}
              >
                Load 3×3 (problem 3)
              </GhostButton>
              <GhostButton
                type="button"
                onClick={() => {
                  setSystemSize(2);
                  setResult(null);
                  setEq1("4*x + sin(y) - 1");
                  setEq2("x^2 + 5*y - 1");
                  setInitial("0, 0");
                  setPage("workflow");
                }}
              >
                Load 2×2
              </GhostButton>
            </div>
            <RunButton>Run optional analysis</RunButton>
            {error && <ErrorBanner message={error} />}
          </div>
        </Panel>
      </form>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {pages.map(([id, label]) => (
            <GhostButton
              key={id}
              type="button"
              className={cn(page === id && "border-cyan text-cyan")}
              onClick={() => setPage(id)}
            >
              {label}
            </GhostButton>
          ))}
        </div>

        {page === "workflow" && (
          <Panel title="Workflow" eyebrow={`${systemSize} × ${systemSize} formulation`}>
            <EquationBox>{formulation.workflow}</EquationBox>
          </Panel>
        )}
        {page === "jacobian" && (
          <Panel title="Jacobian structure" eyebrow="∂F/∂X">
            <EquationBox>{formulation.jacobian}</EquationBox>
          </Panel>
        )}
        {page === "split" && (
          <Panel title="Inner Jacobi split" eyebrow="J = D + L + U">
            <EquationBox>{formulation.split}</EquationBox>
          </Panel>
        )}
        {page === "pseudo" && (
          <Panel title="Pseudocode" eyebrow="No auto-solve on this tab">
            <EquationBox>{formulation.pseudocode}</EquationBox>
          </Panel>
        )}
        {page === "solve" &&
          (!result ? (
            <Panel title="Optional analysis" eyebrow="METHOD">
              <p className="font-mono text-xs text-muted-foreground">
                Build the method tabs first, then press Run optional analysis for residual history
                on the selected {systemSize}×{systemSize} system.
              </p>
            </Panel>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Metric
                  label="Jacobi residual"
                  value={jacobi?.finalResidual}
                  detail={`${jacobi?.iterations ?? 0} iters · ${jacobi?.converged ? "ok" : "stop"}`}
                />
                <Metric
                  label="Newton residual"
                  value={newton?.finalResidual}
                  detail={`${newton?.iterations ?? 0} iters · ${newton?.converged ? "ok" : "stop"}`}
                  accent="magenta"
                />
              </div>
              <Panel title="Estimates" eyebrow={`${result.dimension}×${result.dimension} · X*`}>
                <pre className="font-mono text-[11px] text-mint whitespace-pre-wrap">
                  {`variables: ${result.variables.join(", ")}\nJacobi:  [${(jacobi?.estimate ?? []).map((v) => formatNumber(v, 8)).join(", ")}]\nNewton:  [${(newton?.estimate ?? []).map((v) => formatNumber(v, 8)).join(", ")}]\n\n${jacobi?.message ?? ""}\n${newton?.message ?? ""}`}
                </pre>
              </Panel>
              {traceLen > 0 && (
                <Chart
                  x={traceX}
                  series={[
                    {
                      key: "jacobi",
                      label: "Jacobi residual",
                      values: traceX.map((_, i) => jacobi?.history[i]?.residual ?? null),
                      color: "#22d3ee",
                    },
                    {
                      key: "newton",
                      label: "Newton residual",
                      values: traceX.map((_, i) => newton?.history[i]?.residual ?? null),
                      color: "#e879f9",
                    },
                  ]}
                  height={260}
                />
              )}
              <GhostButton
                type="button"
                onClick={() => downloadJson("nonlinear-system.json", result)}
              >
                Export JSON
              </GhostButton>
            </>
          ))}
      </div>
    </div>
  );
}

function CompositePanel() {
  const [expression, setExpression] = React.useState("sin(x) + x^2");
  const [a, setA] = React.useState(0);
  const [b, setB] = React.useState(2);
  const [subintervals, setSubintervals] = React.useState(12);
  const [result, setResult] = React.useState<IntegrationResult | null>(null);
  const [error, setError] = React.useState("");

  function run(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      setResult(compositeIntegration(expression, a, b, subintervals));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Integration failed.");
    }
  }

  const methods = result
    ? [
        ["Trapezoidal", result.methods.trapezoidal],
        ["Midpoint", result.methods.midpoint],
        ["Simpson 1/3", result.methods.simpsonOneThird],
        ["Simpson 3/8", result.methods.simpsonThreeEighths],
      ] as const
    : [];

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <form onSubmit={run} className="space-y-3">
        <Panel title="Function & interval" eyebrow="Composite integration lab">
          <div className="space-y-3">
            <Field label="Integrand f(x)">
              <TextInput
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                spellCheck={false}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["Polynomial", "x^2", 0, 3],
                  ["Oscillatory", "sin(5*x)*exp(-x/3)", 0, 6],
                  ["Gaussian", "exp(-x^2)", -3, 3],
                ] as const
              ).map(([label, expr, lo, hi]) => (
                <GhostButton
                  key={label}
                  type="button"
                  onClick={() => {
                    setExpression(expr);
                    setA(lo);
                    setB(hi);
                  }}
                >
                  {label}
                </GhostButton>
              ))}
            </div>
            <GraphBoundsFields
              a={a}
              b={b}
              onAChange={setA}
              onBChange={setB}
              aLabel="Lower a"
              bLabel="Upper b"
            />
            <Field label="Subintervals n" hint="even for 1/3 · ÷3 for 3/8">
              <BoundNumberInput value={subintervals} min={1} onChange={setSubintervals} />
            </Field>
            <EquationBox>{COMPOSITE_FORMULAS}</EquationBox>
            <RunButton>Compute area</RunButton>
            {error && <ErrorBanner message={error} />}
          </div>
        </Panel>
      </form>

      <div className="space-y-3">
        {!result ? (
          <Panel title="Ready" eyebrow="COMPOSITE">
            <p className="font-mono text-xs text-muted-foreground">
              Compare trapezoidal, midpoint, and Simpson composite rules against a dense reference —
              formulas shown in the control panel (V11 Neon Composite Lab).
            </p>
          </Panel>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Metric label="Reference" value={result.reference.value} accent="amber" />
              <Metric label="Step h" value={result.interval.step} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {methods.map(([name, method]) => (
                <Metric
                  key={name}
                  label={name}
                  value={method.available ? method.value : "n/a"}
                  detail={
                    method.available
                      ? `|err| ${formatNumber(method.absoluteError, 4)}`
                      : method.reason ?? "unavailable"
                  }
                />
              ))}
            </div>
            <Panel title="Method comparison" eyebrow="Nodes + residuals">
              <pre className="max-h-40 overflow-auto font-mono text-[11px] text-mint whitespace-pre-wrap">
                {[
                  `Integral on [${formatNumber(result.interval.a)}, ${formatNumber(result.interval.b)}], n=${result.interval.subintervals}`,
                  `Reference (${result.reference.method}): ${formatNumber(result.reference.value, 14)}`,
                  "",
                  ...methods.map(([name, method]) =>
                    method.available
                      ? `${name.padEnd(14)} = ${formatNumber(method.value, 14)}   |error|=${formatNumber(method.absoluteError, 3)}`
                      : `${name.padEnd(14)} = unavailable (${method.reason ?? "n/a"})`,
                  ),
                ].join("\n")}
              </pre>
            </Panel>
            <Chart
              x={result.plot.x}
              series={[
                {
                  key: "f",
                  label: "f(x)",
                  values: result.plot.y,
                  color: "#22d3ee",
                },
              ]}
              height={240}
            />
          </>
        )}
      </div>
    </div>
  );
}

const INTERP_PRESETS = {
  sample: "1, 2\n2, 3\n3, 5\n4, 4",
  runge: "-1, 0.0384615\n-0.5, 0.137931\n0, 1\n0.5, 0.137931\n1, 0.0384615",
  smooth: "0, 0\n1, 0.841471\n2, 0.909297\n3, 0.14112\n4, -0.756802",
};

function parsePoints(raw: string): Array<[number, number]> {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const values = line
        .replace(/[()]/g, "")
        .split(/[\s,;]+/)
        .filter(Boolean)
        .map(Number);
      if (values.length !== 2 || values.some((v) => !Number.isFinite(v))) {
        throw new Error(`Each row must contain exactly two finite values: "${line}"`);
      }
      return [values[0]!, values[1]!] as [number, number];
    });
}

function formatDividedDifferenceTable(table: Array<Array<number | null>>): string {
  const width = Math.max(
    10,
    ...table.flatMap((row) => row.map((cell) => (cell == null ? 1 : formatNumber(cell, 6).length))),
  );
  const header = ["f[x]", ...table.slice(1).map((_, i) => `Δ^${i + 1}`)]
    .map((label) => label.padEnd(width))
    .join(" ");
  const body = table
    .map((row, rowIndex) =>
      row
        .map((cell, colIndex) => {
          if (colIndex > table.length - 1 - rowIndex) return "".padEnd(width);
          return (cell == null ? "—" : formatNumber(cell, 6)).padEnd(width);
        })
        .join(" "),
    )
    .join("\n");
  return `${header}\n${body}`;
}

function formatSplineSegments(
  segments: InterpolationResult["naturalCubicSpline"]["segments"],
): string {
  return segments
    .map((segment, index) => {
      const a = formatNumber(segment.a, 8);
      const b = formatNumber(segment.b, 8);
      const c = formatNumber(segment.c, 8);
      const d = formatNumber(segment.d, 8);
      return [
        `Segment ${index + 1}: [${formatNumber(segment.left)}, ${formatNumber(segment.right)}]`,
        `  t = x − ${formatNumber(segment.left)}`,
        `  S(t) = ${a} + (${b})·t + (${c})·t² + (${d})·t³`,
      ].join("\n");
    })
    .join("\n\n");
}

function DiffPanel() {
  const [rawPoints, setRawPoints] = React.useState(INTERP_PRESETS.sample);
  const [query, setQuery] = React.useState(2.5);
  const [result, setResult] = React.useState<InterpolationResult | null>(null);
  const [error, setError] = React.useState("");

  function run(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const next = interpolate(parsePoints(rawPoints), query, 500);
      setResult(next);
      audio.play("numeric-result");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Interpolation failed.");
    }
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <form onSubmit={run} className="space-y-3">
        <Panel title="Point data" eyebrow="DIFF laboratory">
          <div className="space-y-3">
            <Field label="One x, y pair per line" hint="distinct x">
              <TextArea
                value={rawPoints}
                onChange={(e) => setRawPoints(e.target.value)}
                rows={8}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <GhostButton type="button" onClick={() => setRawPoints(INTERP_PRESETS.sample)}>
                Sample
              </GhostButton>
              <GhostButton
                type="button"
                onClick={() => {
                  setRawPoints(INTERP_PRESETS.runge);
                  setQuery(0.25);
                }}
              >
                Runge
              </GhostButton>
              <GhostButton
                type="button"
                onClick={() => {
                  setRawPoints(INTERP_PRESETS.smooth);
                  setQuery(1.5);
                }}
              >
                Smooth
              </GhostButton>
            </div>
            <Field label="Query x">
              <BoundNumberInput value={query} onChange={setQuery} />
            </Field>
            <RunButton>Interpolate</RunButton>
            {error && <ErrorBanner message={error} />}
          </div>
        </Panel>

        <Panel title="Three coordinated views" eyebrow="Same data · different forms">
          <ul className="space-y-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
            <li>Newton: triangular divided-difference table and nested evaluation.</li>
            <li>Lagrange: readable basis form, evaluated with stable barycentric weights.</li>
            <li>Natural spline: piecewise cubics with zero endpoint second derivatives.</li>
          </ul>
        </Panel>
      </form>

      <div className="space-y-3">
        {!result ? (
          <Panel title="Ready" eyebrow="DIFF">
            <p className="font-mono text-xs text-muted-foreground">
              Newton, Lagrange, and natural cubic spline evaluation with agreement checks. Built
              equations appear here after Interpolate.
            </p>
          </Panel>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
              <Metric label="Newton P(q)" value={result.newton.value} />
              <Metric label="Lagrange L(q)" value={result.lagrange.value} accent="magenta" />
              <Metric label="Spline S(q)" value={result.naturalCubicSpline.value} accent="amber" />
              <Metric
                label="|P−L|"
                value={result.agreement.newtonVsLagrangeAbsoluteDifference}
                accent="moon"
              />
            </div>
            <Chart
              x={result.plot.x}
              series={[
                {
                  key: "poly",
                  label: "Newton/Lagrange",
                  values: result.plot.polynomial,
                  color: "#22d3ee",
                },
                {
                  key: "spline",
                  label: "Cubic spline",
                  values: result.plot.spline,
                  color: "#f59e0b",
                },
              ]}
              referenceX={[query, ...result.points.map((point) => point.x)]}
              height={260}
            />

            <Panel
              title="Newton divided differences"
              eyebrow={`Triangular table · query x = ${formatNumber(result.query)}`}
            >
              <div className="space-y-3">
                <EquationBox label="Divided-difference table">
                  {formatDividedDifferenceTable(result.newton.dividedDifferenceTable)}
                </EquationBox>
                <EquationBox label="Newton nested form P(x)">
                  {`P(x) = ${result.newton.formula}`}
                </EquationBox>
                <EquationBox label="Coefficients f[x₀…xₖ]">
                  {result.newton.coefficients.map((c, i) => `a${i} = ${formatNumber(c, 10)}`).join("\n")}
                </EquationBox>
              </div>
            </Panel>

            <Panel title="Lagrange representation" eyebrow="Equivalent global polynomial">
              <div className="space-y-3">
                <p className="font-mono text-[11px] text-muted-foreground">{result.lagrange.evaluation}</p>
                <EquationBox label="L(x)">
                  {result.lagrange.formula
                    ? `L(x) = ${result.lagrange.formula}`
                    : "(Expanded readable form omitted above 12 points — barycentric weights still used numerically.)"}
                </EquationBox>
              </div>
            </Panel>

            <Panel
              title="Natural cubic segments"
              eyebrow={result.naturalCubicSpline.boundaryCondition}
            >
              <EquationBox label="Piecewise cubics Sᵢ(t)">
                {formatSplineSegments(result.naturalCubicSpline.segments)}
              </EquationBox>
            </Panel>

            {result.warnings.length > 0 && (
              <ErrorBanner message={result.warnings.join(" · ")} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AlgorithmsPanel() {
  const [algo, setAlgo] = React.useState<"cholesky" | "talbot" | "derpar">("cholesky");
  const [log, setLog] = React.useState("(select an algorithm and run)");
  const [error, setError] = React.useState("");
  const [chartX, setChartX] = React.useState<number[]>([]);
  const [chartSeries, setChartSeries] = React.useState<
    Array<{ key: string; label: string; values: Array<number | null>; color: string }>
  >([]);

  // Cholesky
  const [size, setSize] = React.useState(6);
  const [low, setLow] = React.useState(-100);
  const [high, setHigh] = React.useState(-1);
  const [seed, setSeed] = React.useState(1234);

  // Talbot
  const [preset, setPreset] = React.useState("exponential");
  const [time, setTime] = React.useState(1);
  const [digits, setDigits] = React.useState(8);

  // Derpar
  const [initX, setInitX] = React.useState(0.5);
  const [initParam, setInitParam] = React.useState(0.5);
  const [step, setStep] = React.useState(0.05);
  const [maxPoints, setMaxPoints] = React.useState(80);

  function run() {
    setError("");
    try {
      if (algo === "cholesky") {
        const result = runModifiedCholesky(null, size, low, high, seed);
        setLog(
          [
            "=== MODIFIED CHOLESKY (ESKOW) ===",
            `source = ${result.source}`,
            `size = ${result.size}`,
            `factorization ∞-error = ${formatNumber(result.verification.factorizationInfinityError)}`,
            `solve ∞-error = ${formatNumber(result.verification.solveInfinityError)}`,
            `max diagonal addition = ${formatNumber(result.verification.maximumDiagonalAddition)}`,
            `λmin before = ${formatNumber(result.verification.minimumEigenvalueBefore)}`,
            `λmin after = ${formatNumber(result.verification.minimumEigenvalueAfter)}`,
            `PD after = ${result.verification.positiveDefiniteAfter}`,
          ].join("\n"),
        );
        setChartX(result.permutationOneBased);
        setChartSeries([
          {
            key: "add",
            label: "Diagonal additions",
            values: result.diagonalAdditionsOriginalOrder,
            color: "#f59e0b",
          },
        ]);
      } else if (algo === "talbot") {
        const result = runTalbot(preset, time, digits, 6, 0.1, 5, 80);
        setLog(
          [
            "=== TALBOT INVERSION (Alg 682) ===",
            result.description,
            `t = ${formatNumber(result.time)}`,
            `value = ${formatNumber(result.value)}`,
            `exact = ${formatNumber(result.expected)}`,
            `|error| = ${formatNumber(result.absoluteError)}`,
            `λ=${formatNumber(result.parameters.lambda)}  σ=${formatNumber(result.parameters.sigma)}  ν=${formatNumber(result.parameters.nu)}`,
            `H (contourParameter) = ${result.parameters.contourParameter}`,
            `quadrature points = ${result.parameters.quadraturePoints}`,
            `ier = ${result.errorCode}`,
          ].join("\n"),
        );
        setChartX(result.plot.time);
        setChartSeries([
          {
            key: "talbot",
            label: "Talbot",
            values: result.plot.talbot,
            color: "#22d3ee",
          },
          {
            key: "exact",
            label: "Exact",
            values: result.plot.exact,
            color: "#f59e0b",
          },
        ]);
      } else {
        const result = runDerpar(initX, initParam, step, 0.5, 0.5, 1, 1, maxPoints, 1e-8);
        setLog(
          [
            "=== DERPAR CONTINUATION ===",
            result.equation,
            `status = ${result.status}`,
            `flag = ${result.flag}`,
            result.message,
            `points = ${result.pointCount}`,
            `initial correction = ${result.initialCorrectionConverged ? "converged" : "failed"}`,
          ].join("\n"),
        );
        const xs = result.plot.x.map((v, i) => (v !== null ? v : i));
        setChartX(xs as number[]);
        setChartSeries([
          {
            key: "param",
            label: "α(x)",
            values: result.plot.parameter,
            color: "#22d3ee",
          },
          {
            key: "exact",
            label: "1 − x²",
            values: result.plot.exactParameter,
            color: "#f59e0b",
          },
        ]);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Algorithm failed.");
    }
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
      <Panel title="Algorithm suite" eyebrow="V15 ports">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-1 rounded-sm border border-cyan/30 p-1">
            {(
              [
                ["cholesky", "Chol"],
                ["talbot", "Talbot"],
                ["derpar", "DERPAR"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setAlgo(id)}
                className={cn(
                  "rounded-md px-2 py-2 font-mono text-[9px] uppercase tracking-[0.1em] transition",
                  algo === id
                    ? "bg-cyan text-deepblue"
                    : "text-cyan hover:bg-cyan/15",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {algo === "cholesky" && (
            <div className="space-y-2">
              <Field label="Size">
                <BoundNumberInput value={size} min={1} max={40} onChange={setSize} />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="λ low">
                  <BoundNumberInput value={low} onChange={setLow} />
                </Field>
                <Field label="λ high">
                  <BoundNumberInput value={high} onChange={setHigh} />
                </Field>
              </div>
              <Field label="Seed">
                <BoundNumberInput value={seed} onChange={setSeed} />
              </Field>
            </div>
          )}

          {algo === "talbot" && (
            <div className="space-y-2">
              <Field label="Preset">
                <Select value={preset} onChange={(e) => setPreset(e.target.value)}>
                  <option value="exponential">Exponential</option>
                  <option value="sine">Sine</option>
                  <option value="v15">V15 demo</option>
                </Select>
              </Field>
              <Field label="Time t">
                <BoundNumberInput value={time} onChange={setTime} />
              </Field>
              <Field label="Decimal digits">
                <BoundNumberInput value={digits} min={2} max={16} onChange={setDigits} />
              </Field>
            </div>
          )}

          {algo === "derpar" && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Field label="x₀">
                  <BoundNumberInput value={initX} onChange={setInitX} />
                </Field>
                <Field label="α₀">
                  <BoundNumberInput value={initParam} onChange={setInitParam} />
                </Field>
              </div>
              <Field label="Step">
                <BoundNumberInput value={step} onChange={setStep} />
              </Field>
              <Field label="Max points">
                <BoundNumberInput value={maxPoints} min={5} onChange={setMaxPoints} />
              </Field>
            </div>
          )}

          <RunButton type="button" onClick={run}>
            Run {algo}
          </RunButton>
          {error && <ErrorBanner message={error} />}
        </div>
      </Panel>

      <div className="space-y-3">
        {chartX.length > 0 && chartSeries.length > 0 && (
          <Chart x={chartX} series={chartSeries} height={280} />
        )}
        <Panel title="Engine log" eyebrow="Algorithms">
          <pre className="max-h-72 overflow-auto rounded-sm border border-cyan/20 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-mint whitespace-pre-wrap">
            {log}
          </pre>
        </Panel>
      </div>
    </div>
  );
}

function AcmLabPanel() {
  const [tab, setTab] = React.useState<"618" | "619" | "740">("618");
  const [log, setLog] = React.useState("(select ACM 618 / 619 / 740 and run)");
  const [error, setError] = React.useState("");
  const [chartX, setChartX] = React.useState<number[]>([]);
  const [chartSeries, setChartSeries] = React.useState<
    Array<{ key: string; label: string; values: Array<number | null>; color: string }>
  >([]);

  // 618
  const [n618, setN618] = React.useState(300);
  const [h618, setH618] = React.useState(0.001);
  const [order618, setOrder618] = React.useState<Acm618OrderingMode>(1);
  const [validate618, setValidate618] = React.useState(true);

  // 619
  const [expr619, setExpr619] = React.useState("1/(s^2+1)");
  const [t619, setT619] = React.useState("0.1,1,2,3,4,5,10,20");
  const [c619, setC619] = React.useState(0);
  const [er619, setEr619] = React.useState(1e-8);
  const [ea619, setEa619] = React.useState(1e-8);
  const [mx619, setMx619] = React.useState(120);

  // 740
  const [kind740, setKind740] = React.useState<Acm740MatrixKind>(1);
  const [n740, setN740] = React.useState(50);
  const [band740, setBand740] = React.useState(25);

  function run618() {
    setError("");
    try {
      const result = runAcm618(n618, h618, order618, validate618);
      setLog(result.log.join("\n"));
      setChartX(result.groupCounts.map((_, i) => i + 1));
      setChartSeries([
        {
          key: "groups",
          label: "Columns per group",
          values: result.groupCounts,
          color: "#22d3ee",
        },
      ]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Algorithm 618 failed.");
    }
  }

  function suite618() {
    setError("");
    try {
      const result = runAcm618Suite();
      setLog(result.log.join("\n"));
      setChartX(result.ns);
      setChartSeries([
        {
          key: "maxgrp",
          label: "MAXGRP",
          values: result.maxgrp,
          color: "#22d3ee",
        },
        {
          key: "nnz",
          label: "NNZ / 100",
          values: result.nnz.map((v) => v / 100),
          color: "#f59e0b",
        },
      ]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Algorithm 618 suite failed.");
    }
  }

  function run619() {
    setError("");
    try {
      const tv = parseNumberList(t619);
      const result = runAcm619(expr619, tv, c619, er619, ea619, mx619);
      setLog(result.log.join("\n"));
      setChartX(result.points.map((p) => p.t));
      const series: Array<{
        key: string;
        label: string;
        values: Array<number | null>;
        color: string;
      }> = [
        {
          key: "dlainv",
          label: "DLAINV",
          values: result.points.map((p) => p.result),
          color: "#22d3ee",
        },
      ];
      if (result.isDefault) {
        series.push({
          key: "exact",
          label: "sin(t)",
          values: result.points.map((p) => p.exact),
          color: "#f59e0b",
        });
      }
      const hist = result.points[result.points.length - 1]?.history ?? [];
      if (hist.length > 1) {
        series.push({
          key: "esterr",
          label: "ε-est (last t)",
          values: [
            ...new Array(Math.max(0, result.points.length - hist.length)).fill(null),
            ...hist,
          ].slice(0, result.points.length),
          color: "#c084fc",
        });
      }
      setChartSeries(series);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Algorithm 619 failed.");
    }
  }

  function run740() {
    setError("");
    try {
      const result = runAcm740(kind740, n740, band740);
      setLog(result.log.join("\n"));
      setChartX([1, 2, 3]);
      setChartSeries([
        {
          key: "fro",
          label: "‖tril(A−LLᵀ)‖_F",
          values: result.rows.map((r) => r.fro),
          color: "#22d3ee",
        },
      ]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Algorithm 740 failed.");
    }
  }

  function suite740() {
    setError("");
    try {
      const result = runAcm740Suite();
      setLog(result.log.join("\n"));
      setChartX([1, 2, 3, 4]);
      setChartSeries([
        {
          key: "std",
          label: "Standard",
          values: result.frobenius.map((row) => row[0] ?? null),
          color: "#22d3ee",
        },
        {
          key: "col",
          label: "Column",
          values: result.frobenius.map((row) => row[1] ?? null),
          color: "#f59e0b",
        },
        {
          key: "row",
          label: "Row",
          values: result.frobenius.map((row) => row[2] ?? null),
          color: "#c084fc",
        },
      ]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Algorithm 740 suite failed.");
    }
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(240px,340px)_minmax(0,1fr)]">
      <Panel title="ACM 618 / 619 / 740 Laboratory" eyebrow="V5 · rev 1.4">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-1 rounded-sm border border-cyan/30 p-1">
            {(
              [
                ["618", "618 Jac"],
                ["619", "619 Lap"],
                ["740", "740 IC"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "rounded-md px-2 py-2 font-mono text-[9px] uppercase tracking-[0.1em] transition",
                  tab === id ? "bg-cyan text-deepblue" : "text-cyan hover:bg-cyan/15",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "618" && (
            <div className="space-y-2">
              <Field label="Problem size N" hint="divisible by 3">
                <BoundNumberInput value={n618} min={3} max={1200} onChange={setN618} />
              </Field>
              <Field label="Difference step h">
                <BoundNumberInput value={h618} onChange={setH618} />
              </Field>
              <Field label="Ordering">
                <Select
                  value={String(order618)}
                  onChange={(e) => setOrder618(Number(e.target.value) as Acm618OrderingMode)}
                >
                  <option value="1">Best of SL / ID / LF</option>
                  <option value="2">Smallest-last</option>
                  <option value="3">Incidence-degree</option>
                  <option value="4">Largest-first</option>
                </Select>
              </Field>
              <label className="flex items-center gap-2 font-mono text-[10px] text-moon">
                <input
                  type="checkbox"
                  checked={validate618}
                  onChange={(e) => setValidate618(e.target.checked)}
                  className="accent-cyan"
                />
                Compare with exact sparse Jacobian
              </label>
              <RunButton type="button" onClick={run618}>
                Run DSM + FDJS
              </RunButton>
              <GhostButton type="button" onClick={suite618} className="w-full">
                Run N=300:1200 suite
              </GhostButton>
              <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
                Columns sharing a row may not share a group. Chart: columns per consistent color
                class (or MAXGRP / NNZ suite).
              </p>
            </div>
          )}

          {tab === "619" && (
            <div className="space-y-2">
              <Field label="F(s) expression">
                <TextInput value={expr619} onChange={(e) => setExpr619(e.target.value)} />
              </Field>
              <Field label="t values" hint="comma-separated, positive">
                <TextInput value={t619} onChange={(e) => setT619(e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Abscissa c">
                  <BoundNumberInput value={c619} onChange={setC619} />
                </Field>
                <Field label="Max blocks">
                  <BoundNumberInput value={mx619} min={3} max={2000} onChange={setMx619} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Rel tol">
                  <BoundNumberInput value={er619} onChange={setEr619} />
                </Field>
                <Field label="Abs tol">
                  <BoundNumberInput value={ea619} onChange={setEa619} />
                </Field>
              </div>
              <RunButton type="button" onClick={run619}>
                Run DLAINV
              </RunButton>
              <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
                Default 1/(s²+1) compares to sin(t). Bounded Wynn ε on ≤50 Durbin sums (V5 rev 1.4).
              </p>
            </div>
          )}

          {tab === "740" && (
            <div className="space-y-2">
              <Field label="Test matrix">
                <Select
                  value={String(kind740)}
                  onChange={(e) => setKind740(Number(e.target.value) as Acm740MatrixKind)}
                >
                  <option value="1">Banded</option>
                  <option value="2">Arrowhead</option>
                  <option value="3">2-D Laplacian</option>
                  <option value="4">Original 4×4 failure</option>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Order N / grid LN">
                  <BoundNumberInput value={n740} min={1} max={80} onChange={setN740} />
                </Field>
                <Field label="Semi-bandwidth">
                  <BoundNumberInput value={band740} min={0} onChange={setBand740} />
                </Field>
              </div>
              <RunButton type="button" onClick={run740}>
                Run three factorizations
              </RunButton>
              <GhostButton type="button" onClick={suite740} className="w-full">
                Run four original tests
              </GhostButton>
              <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
                STANDARD = IC(0). COLUMN / ROW keep largest entries per structural budget
                (Jones–Plassmann).
              </p>
            </div>
          )}

          {error && <ErrorBanner message={error} />}
        </div>
      </Panel>

      <div className="space-y-3">
        {chartX.length > 0 && chartSeries.length > 0 && (
          <Chart x={chartX} series={chartSeries} height={280} />
        )}
        <Panel title="Engine log" eyebrow="ACM SPARS">
          <pre className="max-h-80 overflow-auto rounded-sm border border-cyan/20 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-mint whitespace-pre-wrap">
            {log}
          </pre>
        </Panel>
      </div>
    </div>
  );
}

function BezierPanel() {
  const [anchor, setAnchor] = React.useState<Point2 | null>(null);
  const [pending, setPending] = React.useState<Point2[]>([]);
  const [segments, setSegments] = React.useState<BezierSegment[]>([]);
  const [done, setDone] = React.useState(false);
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const compute = React.useContext(NumericalComputeContext);

  const width = 720;
  const height = 420;
  const pad = 28;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const domain = 1; // axes [-1,1]² like Program 3.7

  const mapX = (x: number) => pad + ((x + domain) / (2 * domain)) * innerW;
  const mapY = (y: number) => pad + ((domain - y) / (2 * domain)) * innerH;

  function unmap(clientX: number, clientY: number): Point2 | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * width;
    const py = ((clientY - rect.top) / rect.height) * height;
    const x = ((px - pad) / innerW) * 2 * domain - domain;
    const y = domain - ((py - pad) / innerH) * 2 * domain;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return {
      x: Math.max(-domain, Math.min(domain, x)),
      y: Math.max(-domain, Math.min(domain, y)),
    };
  }

  function prompt(): string {
    if (done) return "Drawing finished — Clear to start again.";
    if (!anchor) return "Click to locate the first spline point P0.";
    if (pending.length === 0) return "Click control point P1.";
    if (pending.length === 1) return "Click control point P2.";
    return "Click next spline point P3 (then chain continues).";
  }

  function handleClick(event: React.MouseEvent<SVGSVGElement>) {
    if (done) return;
    const pt = unmap(event.clientX, event.clientY);
    if (!pt) return;
    audio.play("hover");

    if (!anchor) {
      setAnchor(pt);
      setPending([]);
      return;
    }

    const nextPending = [...pending, pt];
    if (nextPending.length < 3) {
      setPending(nextPending);
      return;
    }

    const [p1, p2, p3] = nextPending as [Point2, Point2, Point2];
    const segment = buildBezierSegment(anchor, p1, p2, p3);
    setSegments((prev) => [...prev, segment]);
    setAnchor(p3);
    setPending([]);
    compute();
  }

  function finish() {
    setDone(true);
    setPending([]);
  }

  function clearAll() {
    setAnchor(null);
    setPending([]);
    setSegments([]);
    setDone(false);
  }

  function undoLast() {
    if (pending.length) {
      setPending((p) => p.slice(0, -1));
      return;
    }
    if (!segments.length) {
      setAnchor(null);
      return;
    }
    const next = segments.slice(0, -1);
    setSegments(next);
    setAnchor(next.length ? next[next.length - 1]!.points[3] : null);
    setPending([]);
    setDone(false);
  }

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finish();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        clearAll();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const polyline = (pts: Point2[]) =>
    pts.map((p) => `${mapX(p.x)},${mapY(p.y)}`).join(" ");

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(220px,300px)_minmax(0,1fr)]">
      <Panel title="Freehand Bézier splines" eyebrow="Program 3.7">
        <div className="space-y-3">
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            Click in the figure for the first point, then click three more times for two
            control points and the next spline knot. Repeat in groups of three. Press Enter
            (or Done) to terminate — same flow as Sauer&apos;s <code>bezierdraw</code>.
          </p>
          <Metric label="Status" value={prompt()} accent="cyan" />
          <div className="grid grid-cols-2 gap-2">
            <Metric label="Segments" value={segments.length} />
            <Metric
              label="Pending clicks"
              value={anchor ? `${pending.length} / 3` : "—"}
              accent="amber"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <GhostButton type="button" onClick={undoLast}>
              Undo
            </GhostButton>
            <GhostButton type="button" onClick={finish} disabled={done}>
              Done (Enter)
            </GhostButton>
            <GhostButton type="button" onClick={clearAll}>
              Clear
            </GhostButton>
          </div>
          <EquationBox label="Horner coefficients / points">{formatBezierLog(segments)}</EquationBox>
        </div>
      </Panel>

      <Panel title="Figure window" eyebrow="Domain [−1, 1]²">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height={height}
          role="img"
          aria-label="Bézier freehand canvas"
          className={cn(
            "block rounded-sm border border-cyan/30 bg-deepblue/50 backdrop-blur-md",
            done ? "cursor-default" : "cursor-crosshair",
          )}
          onClick={handleClick}
        >
          {/* Axes */}
          <line
            x1={mapX(-1)}
            x2={mapX(1)}
            y1={mapY(0)}
            y2={mapY(0)}
            stroke="rgba(248,240,200,0.55)"
            strokeWidth={1.2}
          />
          <line
            x1={mapX(0)}
            x2={mapX(0)}
            y1={mapY(-1)}
            y2={mapY(1)}
            stroke="rgba(248,240,200,0.55)"
            strokeWidth={1.2}
          />
          <rect
            x={pad}
            y={pad}
            width={innerW}
            height={innerH}
            fill="none"
            stroke="rgba(34,211,238,0.25)"
          />

          {segments.map((seg, i) => {
            const [p0, p1, p2, p3] = seg.points;
            return (
              <g key={`seg-${i}`}>
                <line
                  x1={mapX(p0.x)}
                  y1={mapY(p0.y)}
                  x2={mapX(p1.x)}
                  y2={mapY(p1.y)}
                  stroke="#f472b6"
                  strokeDasharray="3 4"
                  strokeWidth={1.2}
                />
                <line
                  x1={mapX(p2.x)}
                  y1={mapY(p2.y)}
                  x2={mapX(p3.x)}
                  y2={mapY(p3.y)}
                  stroke="#f472b6"
                  strokeDasharray="3 4"
                  strokeWidth={1.2}
                />
                <circle cx={mapX(p1.x)} cy={mapY(p1.y)} r={4} fill="#f472b6" />
                <circle cx={mapX(p2.x)} cy={mapY(p2.y)} r={4} fill="#f472b6" />
                <circle
                  cx={mapX(p0.x)}
                  cy={mapY(p0.y)}
                  r={5}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth={2}
                />
                <circle
                  cx={mapX(p3.x)}
                  cy={mapY(p3.y)}
                  r={5}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth={2}
                />
                <polyline
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth={2.2}
                  points={polyline(seg.curve)}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {anchor && (
            <circle
              cx={mapX(anchor.x)}
              cy={mapY(anchor.y)}
              r={5}
              fill="#22d3ee"
              stroke="#0b1220"
              strokeWidth={1}
            />
          )}
          {pending.map((p, i) => (
            <circle
              key={`pend-${i}`}
              cx={mapX(p.x)}
              cy={mapY(p.y)}
              r={4}
              fill="#f59e0b"
              stroke="#0b1220"
              strokeWidth={1}
            />
          ))}
        </svg>
      </Panel>
    </div>
  );
}

function SymbolicPanel() {
  const [expression, setExpression] = React.useState("x*cos(x)");
  const [variable, setVariable] = React.useState("x");
  const [definite, setDefinite] = React.useState(false);
  const [lower, setLower] = React.useState(0);
  const [upper, setUpper] = React.useState(Math.PI / 2);
  const [log, setLog] = React.useState("(run int(f, x) — Octave-style session appears on the right)");
  const [octave, setOctave] = React.useState(
    "pkg load symbolic\nsyms x\nf = x*cos(x);\nintegral_f = int(f, x);",
  );
  const [anti, setAnti] = React.useState("");
  const [error, setError] = React.useState("");

  function run() {
    setError("");
    try {
      const result = symbolicIntegrate(
        expression,
        variable.trim() || "x",
        definite ? lower : null,
        definite ? upper : null,
      );
      setAnti(
        result.definite
          ? result.definite.display
          : `${result.antiderivativePretty} + C`,
      );
      setLog(result.sessionLog);
      setOctave(result.octaveEcho);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Symbolic integration failed.");
    }
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
      <Panel title="Symbolic integration" eyebrow="pkg load symbolic">
        <div className="space-y-3">
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            Browser elementary CAS mirroring Octave&apos;s <code>syms</code> / <code>int(f,x)</code>.
            Side panel shows the equivalent script.
          </p>
          <Field label="Variable">
            <TextInput value={variable} onChange={(e) => setVariable(e.target.value)} />
          </Field>
          <Field label={`f(${variable || "x"})`}>
            <TextInput value={expression} onChange={(e) => setExpression(e.target.value)} />
          </Field>
          <div className="flex flex-wrap gap-1">
            {SYMBOLIC_PRESETS.map((p) => (
              <GhostButton key={p.expr} type="button" onClick={() => setExpression(p.expr)}>
                {p.label}
              </GhostButton>
            ))}
          </div>
          <label className="flex items-center gap-2 font-mono text-[10px] text-moon">
            <input
              type="checkbox"
              checked={definite}
              onChange={(e) => setDefinite(e.target.checked)}
              className="accent-cyan"
            />
            Definite integral int(f, x, a, b)
          </label>
          {definite && (
            <GraphBoundsFields
              a={lower}
              b={upper}
              onAChange={setLower}
              onBChange={setUpper}
              aLabel="Lower"
              bLabel="Upper"
            />
          )}
          <RunButton type="button" onClick={run}>
            Run int(f, {variable || "x"})
          </RunButton>
          {anti && <Metric label="Result" value={anti} accent="amber" />}
          {error && <ErrorBanner message={error} />}
        </div>
      </Panel>

      <div className="space-y-3">
        <Panel title="Octave session echo" eyebrow="Off to the side">
          <pre className="max-h-64 overflow-auto rounded-sm border border-cyan/20 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-mint whitespace-pre-wrap">
            {octave}
          </pre>
        </Panel>
        <Panel title="Engine log" eyebrow="SYMBOLIC">
          <pre className="max-h-56 overflow-auto rounded-sm border border-cyan/20 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-mint whitespace-pre-wrap">
            {log}
          </pre>
        </Panel>
      </div>
    </div>
  );
}

function GeneticPanel() {
  const [expression, setExpression] = React.useState("x - cos(x)");
  const [a, setA] = React.useState(0);
  const [b, setB] = React.useState(1);
  const [popSize, setPopSize] = React.useState(50);
  const [generations, setGenerations] = React.useState(100);
  const [mutationRate, setMutationRate] = React.useState(0.1);
  const [mutationStep, setMutationStep] = React.useState(0.05);
  const [seed, setSeed] = React.useState(1234);
  const [log, setLog] = React.useState("(run GA root approximation — V11 defaults)");
  const [error, setError] = React.useState("");
  const [chartX, setChartX] = React.useState<number[]>([]);
  const [chartSeries, setChartSeries] = React.useState<
    Array<{ key: string; label: string; values: Array<number | null>; color: string }>
  >([]);
  const [best, setBest] = React.useState<{ x: number; f: number } | null>(null);

  function run() {
    setError("");
    try {
      const result = runGeneticRootFinder({
        expression,
        a,
        b,
        populationSize: popSize,
        generations,
        mutationRate,
        mutationStep,
        seed,
      });
      setLog(result.log.join("\n"));
      setBest({ x: result.x, f: result.f });
      setChartX(result.history.map((h) => h.generation));
      setChartSeries([
        {
          key: "absf",
          label: "|f| best",
          values: result.history.map((h) => h.bestAbsF),
          color: "#22d3ee",
        },
      ]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Genetic algorithm failed.");
    }
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
      <Panel title="Genetic Algorithm root finder" eyebrow="V11 GUI block">
        <div className="space-y-3">
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            Fitness 1/(|f|+ε), blend crossover, Gaussian mutation, bounds [a,b] — same block as{" "}
            <code>NumericalAnalysisToolbox_V11</code> Run Analysis.
          </p>
          <Field label="f(x)">
            <TextInput value={expression} onChange={(e) => setExpression(e.target.value)} />
          </Field>
          <div className="flex flex-wrap gap-1">
            {(
              [
                ["x - cos(x)", "x−cos"],
                ["(x-1)^3", "(x−1)³"],
                ["x^5 - 2*x + 0.1", "quintic"],
              ] as const
            ).map(([expr, label]) => (
              <GhostButton key={expr} type="button" onClick={() => setExpression(expr)}>
                {label}
              </GhostButton>
            ))}
          </div>
          <GraphBoundsFields a={a} b={b} onAChange={setA} onBChange={setB} />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Population">
              <BoundNumberInput value={popSize} min={4} max={500} onChange={setPopSize} />
            </Field>
            <Field label="Generations">
              <BoundNumberInput value={generations} min={1} max={2000} onChange={setGenerations} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Mut. rate">
              <BoundNumberInput value={mutationRate} onChange={setMutationRate} />
            </Field>
            <Field label="Mut. step">
              <BoundNumberInput value={mutationStep} onChange={setMutationStep} />
            </Field>
          </div>
          <Field label="Seed">
            <BoundNumberInput value={seed} onChange={setSeed} />
          </Field>
          <RunButton type="button" onClick={run}>
            Run Genetic Algorithm
          </RunButton>
          {best && (
            <div className="grid grid-cols-2 gap-2">
              <Metric label="x ≈" value={formatNumber(best.x, 12)} />
              <Metric label="|f(x)|" value={formatNumber(Math.abs(best.f), 4)} accent="amber" />
            </div>
          )}
          {error && <ErrorBanner message={error} />}
        </div>
      </Panel>

      <div className="space-y-3">
        {chartX.length > 0 && chartSeries.length > 0 && (
          <Chart x={chartX} series={chartSeries} height={260} />
        )}
        <Panel title="Engine log" eyebrow="GENETIC · V11">
          <pre className="max-h-72 overflow-auto rounded-sm border border-cyan/20 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-mint whitespace-pre-wrap">
            {log}
          </pre>
        </Panel>
      </div>
    </div>
  );
}

function polygonPoints(sides: number, cx: number, cy: number, r: number, rot = -Math.PI / 2): string {
  return Array.from({ length: sides }, (_, i) => {
    const a = rot + (i * 2 * Math.PI) / sides;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

/** Dense star {n/k} by connecting every k-th vertex of a regular n-gon. */
function starPolygonPoints(
  n: number,
  k: number,
  cx: number,
  cy: number,
  r: number,
  rot = -Math.PI / 2,
): string {
  return Array.from({ length: n }, (_, i) => {
    const a = rot + (((i * k) % n) * 2 * Math.PI) / n;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

function vertexAt(i: number, n: number, cx: number, cy: number, r: number, rot = -Math.PI / 2) {
  const a = rot + (i * 2 * Math.PI) / n;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function SacredGeometryGlyph({
  number,
  hex,
  size = 120,
  fancy = true,
}: {
  number: number;
  hex: string;
  size?: number;
  fancy?: boolean;
}) {
  const glow = fancy
    ? `drop-shadow(0 0 6px ${hex}88) drop-shadow(0 0 14px ${hex}40)`
    : undefined;
  const stroke = hex;
  const fill = `${hex}1f`;
  const common = {
    fill: "none" as const,
    stroke,
    strokeWidth: 1.85,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };

  // Tetractys of the decad: 1+2+3+4 = 10 points (point → line → plane → solid)
  const tetractysDots = (() => {
    const dots: Array<{ x: number; y: number }> = [];
    const startY = 26;
    const rowGap = 15;
    const colGap = 15;
    for (let row = 0; row < 4; row++) {
      const count = row + 1;
      const width = (count - 1) * colGap;
      const y = startY + row * rowGap;
      for (let col = 0; col < count; col++) {
        dots.push({ x: 50 - width / 2 + col * colGap, y });
      }
    }
    return dots;
  })();

  // Seed of Life: six equal circles through a common centre (hexad / first perfect number)
  const flowerPetals = Array.from({ length: 6 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 3;
    return { cx: 50 + 14 * Math.cos(a), cy: 50 + 14 * Math.sin(a) };
  });

  // Golden ratio for nested pentagon (φ⁻² ≈ 0.382)
  const PHI_INV2 = 2 / (3 + Math.sqrt(5));

  let figure: React.ReactNode = null;
  switch (number) {
    case 1:
      // Monad: dimensionless centre · circle of unity · orbits of potential
      figure = (
        <>
          <circle cx="50" cy="50" r="36" {...common} strokeOpacity={0.18} />
          <circle cx="50" cy="50" r="24" {...common} strokeOpacity={0.5} />
          <circle cx="50" cy="50" r="14" {...common} strokeDasharray="2.5 3" strokeOpacity={0.8} />
          <line x1="50" y1="14" x2="50" y2="26" {...common} strokeOpacity={0.35} />
          <line x1="50" y1="74" x2="50" y2="86" {...common} strokeOpacity={0.35} />
          <line x1="14" y1="50" x2="26" y2="50" {...common} strokeOpacity={0.35} />
          <line x1="74" y1="50" x2="86" y2="50" {...common} strokeOpacity={0.35} />
          <circle cx="50" cy="50" r="4.2" fill={stroke} stroke="none" />
          <circle cx="50" cy="50" r="8" {...common} strokeOpacity={0.4} />
        </>
      );
      break;
    case 2: {
      // Dyad: vesica piscis — centres on each other's rim; mandorla lens; √3 common chord
      const r = 20;
      const c1 = 50 - r / 2;
      const c2 = 50 + r / 2;
      const h = (r * Math.sqrt(3)) / 2; // classical vesica half-height
      const lens = `M 50,${50 - h} A ${r} ${r} 0 0 1 50,${50 + h} A ${r} ${r} 0 0 1 50,${50 - h}`;
      figure = (
        <>
          <circle cx={c1} cy="50" r={r} {...common} fill={fill} strokeOpacity={0.75} />
          <circle cx={c2} cy="50" r={r} {...common} fill={`${hex}12`} strokeOpacity={0.75} />
          <path d={lens} {...common} fill={`${hex}33`} strokeWidth={2} />
          <line x1={c1} y1="50" x2={c2} y2="50" {...common} strokeWidth={2.1} />
          <line
            x1="50"
            y1={50 - h}
            x2="50"
            y2={50 + h}
            {...common}
            strokeWidth={1.6}
            strokeOpacity={0.9}
          />
          {/* equilateral hints from the two centres to the lens tips */}
          <line x1={c1} y1="50" x2="50" y2={50 - h} {...common} strokeOpacity={0.35} />
          <line x1={c2} y1="50" x2="50" y2={50 - h} {...common} strokeOpacity={0.35} />
          <circle cx={c1} cy="50" r="2.6" fill={stroke} stroke="none" />
          <circle cx={c2} cy="50" r="2.6" fill={stroke} stroke="none" />
          <circle cx="50" cy={50 - h} r="2.2" fill={stroke} stroke="none" />
          <circle cx="50" cy={50 + h} r="2.2" fill={stroke} stroke="none" />
        </>
      );
      break;
    }
    case 3: {
      // Triad: first plane figure — equilateral with medians (beginning–middle–end)
      const pts = [0, 1, 2].map((i) => vertexAt(i, 3, 50, 52, 30));
      const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
      });
      const m01 = mid(pts[0]!, pts[1]!);
      const m12 = mid(pts[1]!, pts[2]!);
      const m20 = mid(pts[2]!, pts[0]!);
      figure = (
        <>
          <circle cx="50" cy="52" r="34" {...common} strokeOpacity={0.2} />
          <polygon points={polygonPoints(3, 50, 52, 30)} {...common} fill={fill} strokeWidth={2.15} />
          <circle cx="50" cy="52" r="9" {...common} strokeOpacity={0.4} />
          <line x1={pts[0]!.x} y1={pts[0]!.y} x2={m12.x} y2={m12.y} {...common} strokeOpacity={0.5} />
          <line x1={pts[1]!.x} y1={pts[1]!.y} x2={m20.x} y2={m20.y} {...common} strokeOpacity={0.5} />
          <line x1={pts[2]!.x} y1={pts[2]!.y} x2={m01.x} y2={m01.y} {...common} strokeOpacity={0.5} />
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.4" fill={stroke} stroke="none" />
          ))}
          <circle cx="50" cy="52" r="2.5" fill={stroke} stroke="none" />
        </>
      );
      break;
    }
    case 4: {
      // Tetrad: tetractys (oath-figure) · square of justice · tetrahedral tip
      const apex = tetractysDots[0]!;
      const baseL = tetractysDots[6]!;
      const baseR = tetractysDots[9]!;
      figure = (
        <>
          <rect x="20" y="20" width="60" height="60" {...common} fill={`${hex}0c`} strokeOpacity={0.3} />
          <polygon
            points={`${apex.x},${apex.y} ${baseR.x},${baseR.y} ${baseL.x},${baseL.y}`}
            {...common}
            fill={fill}
            strokeOpacity={0.55}
          />
          {/* row guides — musical ratios 4:3 · 3:2 · 2:1 read across the tetractys */}
          <line
            x1={tetractysDots[1]!.x}
            y1={tetractysDots[1]!.y}
            x2={tetractysDots[2]!.x}
            y2={tetractysDots[2]!.y}
            {...common}
            strokeOpacity={0.28}
          />
          <line
            x1={tetractysDots[3]!.x}
            y1={tetractysDots[3]!.y}
            x2={tetractysDots[5]!.x}
            y2={tetractysDots[5]!.y}
            {...common}
            strokeOpacity={0.28}
          />
          <line
            x1={tetractysDots[6]!.x}
            y1={tetractysDots[6]!.y}
            x2={tetractysDots[9]!.x}
            y2={tetractysDots[9]!.y}
            {...common}
            strokeOpacity={0.28}
          />
          {tetractysDots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={i === 0 ? 3.4 : 2.7} fill={stroke} stroke="none" />
          ))}
        </>
      );
      break;
    }
    case 5: {
      // Pentad: golden pentagon · pentagram {5/2} · nested φ⁻² pentagon (microcosm)
      const R = 34;
      const rInner = R * PHI_INV2;
      figure = (
        <>
          <circle cx="50" cy="50" r="38" {...common} strokeOpacity={0.18} />
          <polygon points={polygonPoints(5, 50, 50, R)} {...common} strokeOpacity={0.55} />
          <polygon
            points={starPolygonPoints(5, 2, 50, 50, R)}
            {...common}
            fill={fill}
            strokeWidth={2}
          />
          <polygon
            points={polygonPoints(5, 50, 50, rInner, Math.PI / 5)}
            {...common}
            fill={`${hex}28`}
            strokeOpacity={0.85}
            strokeWidth={1.5}
          />
          <circle cx="50" cy="50" r="4" fill={stroke} stroke="none" />
        </>
      );
      break;
    }
    case 6:
      // Hexad: seed of life · hexagon · hexagram (fire △ + water ▽)
      figure = (
        <>
          <polygon points={polygonPoints(6, 50, 50, 36)} {...common} strokeOpacity={0.35} />
          <circle cx="50" cy="50" r="14" {...common} strokeOpacity={0.4} fill={`${hex}14`} />
          {flowerPetals.map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r="14" {...common} strokeOpacity={0.55} />
          ))}
          <polygon points={polygonPoints(3, 50, 50, 28)} {...common} fill={fill} strokeWidth={1.8} />
          <polygon
            points={polygonPoints(3, 50, 50, 28, Math.PI / 2)}
            {...common}
            strokeWidth={1.8}
          />
          <circle cx="50" cy="50" r="2.8" fill={stroke} stroke="none" />
        </>
      );
      break;
    case 7:
      // Heptad: virgin number — heptagon + acute {7/2} + obtuse {7/3}
      figure = (
        <>
          <circle cx="50" cy="50" r="38" {...common} strokeOpacity={0.15} />
          <polygon points={polygonPoints(7, 50, 50, 34)} {...common} fill={fill} strokeOpacity={0.7} />
          <polygon
            points={starPolygonPoints(7, 2, 50, 50, 34)}
            {...common}
            strokeOpacity={0.95}
            strokeWidth={1.65}
          />
          <polygon
            points={starPolygonPoints(7, 3, 50, 50, 22)}
            {...common}
            strokeOpacity={0.45}
            strokeWidth={1.25}
          />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const v = vertexAt(i, 7, 50, 50, 34);
            return <circle key={i} cx={v.x} cy={v.y} r="1.8" fill={stroke} stroke="none" />;
          })}
          <circle cx="50" cy="50" r="3" fill={stroke} stroke="none" />
        </>
      );
      break;
    case 8: {
      // Ogdoad: regular octagon + true isometric cube (2³) — 30° equal-edge projection
      const s = 13; // half-edge in isometric units
      const dx = s * Math.cos(Math.PI / 6);
      const dy = s * Math.sin(Math.PI / 6);
      const ox = 50;
      const oy = 48;
      // top face centre slightly above; vertical edges of length 2s
      const T = { x: ox, y: oy - s }; // top-front of top diamond
      const TL = { x: ox - dx, y: oy - s + dy };
      const TR = { x: ox + dx, y: oy - s + dy };
      const TB = { x: ox, y: oy - s + 2 * dy };
      const BL = { x: TL.x, y: TL.y + 2 * s };
      const BR = { x: TR.x, y: TR.y + 2 * s };
      const BB = { x: TB.x, y: TB.y + 2 * s };
      figure = (
        <>
          <polygon
            points={polygonPoints(8, 50, 50, 40, Math.PI / 8)}
            {...common}
            fill={`${hex}10`}
            strokeOpacity={0.4}
          />
          <polygon
            points={`${TL.x},${TL.y} ${T.x},${T.y} ${TR.x},${TR.y} ${TB.x},${TB.y}`}
            {...common}
            fill={`${hex}30`}
          />
          <polygon
            points={`${TL.x},${TL.y} ${TB.x},${TB.y} ${BB.x},${BB.y} ${BL.x},${BL.y}`}
            {...common}
            fill={`${hex}1a`}
          />
          <polygon
            points={`${TB.x},${TB.y} ${TR.x},${TR.y} ${BR.x},${BR.y} ${BB.x},${BB.y}`}
            {...common}
            fill={`${hex}0e`}
          />
          <polyline
            points={`${TL.x},${TL.y} ${T.x},${T.y} ${TR.x},${TR.y} ${BR.x},${BR.y} ${BB.x},${BB.y} ${BL.x},${BL.y} ${TL.x},${TL.y}`}
            {...common}
            strokeWidth={2}
          />
          <line x1={TB.x} y1={TB.y} x2={TL.x} y2={TL.y} {...common} strokeOpacity={0.9} />
          <line x1={TB.x} y1={TB.y} x2={TR.x} y2={TR.y} {...common} strokeOpacity={0.9} />
          <line x1={TB.x} y1={TB.y} x2={BB.x} y2={BB.y} {...common} strokeOpacity={0.9} />
        </>
      );
      break;
    }
    default:
      // Ennead: enneagon · {9/2} star · triple triangle (3²) at 40° offsets
      figure = (
        <>
          <polygon points={polygonPoints(9, 50, 50, 37)} {...common} fill={`${hex}0c`} strokeOpacity={0.4} />
          <polygon
            points={starPolygonPoints(9, 2, 50, 50, 37)}
            {...common}
            strokeOpacity={0.35}
            strokeWidth={1.2}
          />
          <polygon points={polygonPoints(3, 50, 50, 30)} {...common} fill={fill} strokeWidth={1.75} />
          <polygon
            points={polygonPoints(3, 50, 50, 22, (2 * Math.PI) / 9)}
            {...common}
            strokeOpacity={0.8}
            strokeWidth={1.55}
          />
          <polygon
            points={polygonPoints(3, 50, 50, 14, (4 * Math.PI) / 9)}
            {...common}
            strokeOpacity={0.55}
            strokeWidth={1.4}
          />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            const v = vertexAt(i, 9, 50, 50, 37);
            return <circle key={i} cx={v.x} cy={v.y} r="1.6" fill={stroke} stroke="none" />;
          })}
          <circle cx="50" cy="50" r="3" fill={stroke} stroke="none" />
        </>
      );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="shrink-0"
      style={{ filter: glow }}
      aria-hidden
    >
      <defs>
        <radialGradient id={`sg-glow-${number}`} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor={hex} stopOpacity="0.38" />
          <stop offset="55%" stopColor={hex} stopOpacity="0.08" />
          <stop offset="100%" stopColor={hex} stopOpacity="0" />
        </radialGradient>
      </defs>
      {fancy && <circle cx="50" cy="50" r="47" fill={`url(#sg-glow-${number})`} stroke="none" />}
      <circle cx="50" cy="50" r="44" fill="none" stroke={hex} strokeOpacity={0.18} strokeWidth={1} />
      {figure}
    </svg>
  );
}

function GeometryColourCard({
  philosophy,
  compact = false,
}: {
  philosophy: NumberPhilosophy;
  compact?: boolean;
}) {
  const g = philosophy.geometry;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm border bg-black/50",
        compact ? "p-3" : "p-4",
      )}
      style={{
        borderColor: `${g.hex}66`,
        boxShadow: `inset 0 0 40px ${g.hex}14, 0 0 24px ${g.hex}18`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl"
        style={{ background: g.hex }}
      />
      <div className={cn("relative flex gap-4", compact ? "items-center" : "items-start")}>
        <SacredGeometryGlyph number={philosophy.number} hex={g.hex} size={compact ? 72 : 112} />
        <div className="min-w-0 flex-1 space-y-1.5">
          <p
            className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]"
            style={{ color: g.hex }}
          >
            Sacred geometry · Theosophy colour
          </p>
          <p className="font-display text-sm uppercase tracking-[0.1em] text-cyan">
            {g.figure}
          </p>
          <p className="font-mono text-[11px] leading-relaxed text-moon">{g.form}</p>
          {!compact && (
            <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">{g.note}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{
                borderColor: `${g.hex}88`,
                color: g.hex,
                background: `${g.hex}18`,
              }}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: g.hex, boxShadow: `0 0 8px ${g.hex}` }}
              />
              {g.colorName} · {g.musicalNote}
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">{g.hex}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RelevantThoughtForms({
  number,
  colorName,
}: {
  number: number;
  colorName: string;
}) {
  const bundle = thoughtFormBundleForNumber(number);
  const key = COLOUR_KEY_GENERAL_SOURCE;
  const emotionPlates = bundle.figures.filter((f) => f.id !== "colour-key");

  return (
    <Panel
      title="Thought-Forms · for this number"
      eyebrow={`Theosophy · ${colorName} · ${bundle.musicalNote} · vibration → form`}
    >
      <p className="mb-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
        {bundle.blurb}
      </p>

      {/* Always-visible general source for every path / scramble / combination */}
      <figure className="mb-4 overflow-hidden rounded-sm border border-amber/40 bg-black/50">
        <div className="border-b border-amber/25 bg-amber/10 px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber">
            General source · all words & number scrambles
          </p>
          <p className="font-mono text-[12px] text-cyan">{key.title}</p>
          <p className="font-mono text-[9px] text-muted-foreground">{key.bookRef}</p>
        </div>
        <div className="relative max-h-[420px] overflow-auto bg-black/70 p-2">
          <img
            src={key.src}
            alt={key.title}
            className="mx-auto h-auto w-full max-w-3xl object-contain"
            loading="lazy"
          />
        </div>
        <figcaption className="space-y-2 border-t border-amber/20 px-3 py-2.5">
          <p className="font-mono text-[10px] leading-relaxed text-moon/90">{key.quote}</p>
          <p className="font-mono text-[9px] text-muted-foreground">{key.role}</p>
          {bundle.gridCells.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {bundle.gridCells.map((cell) => (
                <span
                  key={`${cell.row}-${cell.col}`}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-white/15 px-2 py-1 font-mono text-[9px] text-moon"
                  title={`Grid ${cell.row},${cell.col}`}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm border border-white/30"
                    style={{ backgroundColor: cell.hex }}
                  />
                  {cell.row},{cell.col} · {cell.emotion}
                </span>
              ))}
            </div>
          )}
        </figcaption>
      </figure>

      {bundle.colourKeys.length > 0 && (
        <div className="mb-4 space-y-1.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-magenta">
            Meaning of the Colours · pp. 32–35 · path {number}
          </p>
          {bundle.colourKeys.map((entry) => (
            <div
              key={entry.id}
              className="flex gap-2 rounded-sm border border-cyan/20 bg-black/30 px-2.5 py-2"
            >
              <span
                className="mt-0.5 h-3 w-3 shrink-0 rounded-sm border border-white/25"
                style={{ backgroundColor: entry.hex }}
              />
              <div>
                <p className="font-mono text-[11px] text-cyan">
                  {entry.colorName} · {entry.emotion}
                </p>
                <p className="font-mono text-[10px] leading-relaxed text-moon/90">{entry.quote}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {bundle.combinations.length > 0 && (
        <div className="mb-4 space-y-1.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-magenta">
            Colour / number combinations · anagrams of rates
          </p>
          {bundle.combinations.map((combo) => (
            <div
              key={combo.id}
              className="rounded-sm border border-violet-400/25 bg-black/30 px-2.5 py-2"
            >
              <p className="font-mono text-[10px] text-cyan">
                {combo.inputs.join(" + ")} → {combo.result}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground">
                Combos {combo.numberCombos.join(" · ")} · book p. {combo.bookPage}
              </p>
              <p className="mt-1 font-mono text-[10px] leading-relaxed text-moon/90">{combo.quote}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mb-3 space-y-1">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-magenta">
          Three laws · p. 31
        </p>
        <ul className="space-y-1">
          {bundle.laws.map((law) => (
            <li key={law.law} className="font-mono text-[10px] text-moon/90">
              · {law.law}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {emotionPlates.map((plate) => (
          <figure
            key={plate.id}
            className="overflow-hidden rounded-sm border border-cyan/25 bg-black/40"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-black/60">
              <img
                src={plate.src}
                alt={`${plate.fig} · ${plate.emotion}`}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
            <figcaption className="space-y-1 border-t border-cyan/15 px-3 py-2.5">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-magenta">
                {plate.kind} · {plate.fig} · p. {plate.bookPage}
              </p>
              <p className="font-mono text-[11px] text-cyan">{plate.emotion}</p>
              <p className="font-mono text-[9px] text-muted-foreground">
                {plate.shape} · {plate.colours}
              </p>
              <p className="font-mono text-[10px] leading-relaxed text-moon/90">{plate.quote}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Panel>
  );
}

function PhilosophyThoughtsBlock({
  philosophy,
  showGeometry = true,
  ruckmanVerses = [],
  ruckmanSource = "",
}: {
  philosophy: NumberPhilosophy;
  showGeometry?: boolean;
  ruckmanVerses?: RuckmanVerse[];
  ruckmanSource?: string;
}) {
  const accent: Record<string, string> = {
    Pythagoras: "border-amber/45 bg-amber/10",
    "Manly P. Hall": "border-magenta/40 bg-magenta/10",
    Aristotle: "border-cyan/40 bg-cyan/10",
    "Thomas Aquinas": "border-yellow-400/35 bg-yellow-400/10",
    "Avicenna (Ibn Sina)": "border-mint/40 bg-mint/10",
    Avicenna: "border-mint/40 bg-mint/10",
    "Dr. Peter S. Ruckman": "border-orange-400/40 bg-orange-400/10",
    "Theosophical Society": "border-violet-400/45 bg-violet-400/10",
  };

  return (
    <div className="space-y-2.5">
      {showGeometry && <GeometryColourCard philosophy={philosophy} />}
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber">
        Number {philosophy.number} · {philosophy.sacredName} · {philosophy.geometry.colorName}
      </p>
      <p className="rounded-sm border border-amber/30 bg-amber/5 px-2.5 py-2 font-mono text-[10px] leading-relaxed text-amber/90">
        {PHILOSOPHY_DISCLAIMER}
      </p>
      {philosophy.thoughts.map((t) => (
        <div
          key={t.philosopher}
          className={`rounded-sm border p-3 ${accent[t.philosopher] ?? "border-cyan/25 bg-black/30"}`}
          style={
            t.philosopher === "Theosophical Society"
              ? {
                  borderColor: `${philosophy.geometry.hex}66`,
                  boxShadow: `inset 0 0 24px ${philosophy.geometry.hex}12`,
                }
              : undefined
          }
        >
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-cyan">
            {t.philosopher}
          </p>
          <p className="font-mono text-[9px] leading-relaxed text-muted-foreground">{t.work}</p>
          <p className="mt-2 font-mono text-[11px] leading-relaxed text-moon">{t.thought}</p>
          {t.philosopher === "Dr. Peter S. Ruckman" && ruckmanVerses.length > 0 && (
            <div className="mt-3 space-y-2 border-t border-orange-400/25 pt-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-orange-300">
                1611 KJV · verses he cites for {philosophy.number}
              </p>
              {ruckmanVerses.map((verse) => (
                <blockquote
                  key={verse.ref}
                  className="rounded border border-orange-400/20 bg-black/35 px-2.5 py-2"
                >
                  <p className="font-mono text-[10px] font-bold text-orange-200">{verse.ref}</p>
                  <p className="mt-1 font-mono text-[11px] leading-relaxed text-moon">{verse.text}</p>
                </blockquote>
              ))}
              {ruckmanSource && (
                <p className="font-mono text-[8px] text-muted-foreground">{ruckmanSource}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function highlightPassage(text: string, matched: string[]): React.ReactNode {
  if (!matched.length) return text;
  const unique = [...new Set(matched.map((m) => m.toLowerCase()).filter(Boolean))].sort(
    (a, b) => b.length - a.length,
  );
  const pattern = new RegExp(`\\b(${unique.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, index) =>
    unique.some((m) => m.toLowerCase() === part.toLowerCase()) ? (
      <span key={`${part}-${index}`} className="text-amber">
        {part}
      </span>
    ) : (
      <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
    ),
  );
}

function SourcePassagePanel({
  title,
  eyebrow,
  word,
  passages,
  source,
  loading,
  emptyHint,
  matchHint,
}: {
  title: string;
  eyebrow: string;
  word: string;
  passages: Array<{
    id: number;
    page: number;
    text: string;
    matched: string[];
    reasons?: string[];
  }>;
  source: string;
  loading?: boolean;
  emptyHint: string;
  matchHint: string;
}) {
  if (loading) {
    return (
      <Panel title={title} eyebrow={eyebrow}>
        <p className="font-mono text-[10px] text-muted-foreground">
          Searching for “{word}”…
        </p>
      </Panel>
    );
  }
  if (!passages.length) {
    return (
      <Panel title={title} eyebrow={eyebrow}>
        <p className="font-mono text-[10px] text-muted-foreground">{emptyHint}</p>
      </Panel>
    );
  }

  return (
    <Panel
      title={title}
      eyebrow={`${eyebrow} · ${passages.length} passage${passages.length === 1 ? "" : "s"}`}
    >
      <div className="space-y-3">
        <p className="font-mono text-[9px] leading-relaxed text-amber">{matchHint}</p>
        <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
          {passages.map((passage) => (
            <article
              key={passage.id}
              className="rounded-sm border border-magenta/25 bg-black/40 px-3 py-2.5"
            >
              <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-magenta">
                PDF p.{passage.page}
                {passage.matched.length > 0 && (
                  <span className="text-muted-foreground">
                    {" "}
                    · match {passage.matched.slice(0, 4).join(", ")}
                  </span>
                )}
              </p>
              {passage.reasons && passage.reasons.length > 0 && (
                <p className="mb-1.5 font-mono text-[8px] text-cyan/80">
                  {passage.reasons.join(" · ")}
                </p>
              )}
              <p className="font-mono text-[11px] leading-relaxed text-moon">
                {highlightPassage(passage.text, passage.matched)}
              </p>
            </article>
          ))}
        </div>
        {source && <p className="font-mono text-[9px] text-muted-foreground">{source}</p>}
      </div>
    </Panel>
  );
}

function SecretDoctrinePanel({
  word,
  passages,
  source,
  loading,
}: {
  word: string;
  passages: SecretDoctrinePassage[];
  source: string;
  loading?: boolean;
}) {
  return (
    <SourcePassagePanel
      title="Secret Doctrine"
      eyebrow="BLAVATSKY"
      word={word}
      passages={passages}
      source={source}
      loading={loading}
      loading={loading ?? false}
      emptyHint={`No close passages found for “${word}” in The Secret Doctrine.`}
      matchHint={`Passages for “${word}” via exact / stem / anagram / scramble / similar letter-count, ranked with occult & path-number relevance.`}
    />
  );
}

function GreekMythsPanel({
  word,
  passages,
  source,
  loading,
}: {
  word: string;
  passages: GreekMythPassage[];
  source: string;
  loading?: boolean;
}) {
  return (
    <SourcePassagePanel
      title="The Greek Myths"
      eyebrow="GRAVES"
      word={word}
      passages={passages}
      source={source}
      loading={loading}
      loading={loading ?? false}
      emptyHint={`No close passages found for “${word}” in The Greek Myths.`}
      matchHint={`Passages for “${word}” via exact / stem / anagram / scramble / similar letter-count with shared letters — PDF page cited.`}
    />
  );
}

function JohnsonEntryPanel({
  title,
  eyebrow,
  entry,
  loading,
}: {
  title: string;
  eyebrow: string;
  entry: JohnsonSense | null;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Panel title={title} eyebrow={eyebrow}>
        <p className="font-mono text-[10px] text-muted-foreground">Loading Johnson lexicon…</p>
      </Panel>
    );
  }
  if (!entry) {
    return null;
  }

  return (
    <Panel title={title} eyebrow={eyebrow}>
      <div className="space-y-3">
        <div>
          <p className="font-mono text-[13px] font-bold text-cyan">{entry.headword}</p>
          {entry.partOfSpeech && (
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-amber">{entry.partOfSpeech}</p>
          )}
        </div>
        <ol className="list-decimal space-y-2 pl-4 font-mono text-[11px] leading-relaxed text-moon">
          {entry.senses.map((sense, index) => (
            <li key={`${entry.headword}-${index}`}>{sense}</li>
          ))}
        </ol>
        {entry.facsimileUrl && (
          <figure className="overflow-hidden rounded-sm border border-cyan/25 bg-black/50">
            <img
              src={entry.facsimileUrl}
              alt={`Johnson facsimile page ${entry.facsimilePage ?? ""}`}
              className="max-h-72 w-full object-contain"
              loading="lazy"
            />
            <figcaption className="border-t border-cyan/15 px-3 py-2 font-mono text-[9px] text-muted-foreground">
              UCF high-res scan (OneDrive zip){entry.facsimilePage ? ` · page ${entry.facsimilePage}` : ""}
            </figcaption>
          </figure>
        )}
        <div className="flex flex-wrap gap-2 font-mono text-[9px] text-muted-foreground">
          <span>{entry.source}</span>
          {entry.facsimilePage && !entry.facsimileUrl && (
            <span>· facsimile page ~{entry.facsimilePage} (not extracted from zip)</span>
          )}
          {entry.onlineUrl && (
            <a
              href={entry.onlineUrl}
              target="_blank"
              rel="noreferrer"
              className="text-cyan underline-offset-2 hover:underline"
            >
              Johnson&apos;s Dictionary Online
            </a>
          )}
        </div>
      </div>
    </Panel>
  );
}

function NumerologyPanel() {
  const [word, setWord] = React.useState("abc");
  const [johnsonReady, setJohnsonReady] = React.useState(false);
  const [johnsonWordEntry, setJohnsonWordEntry] = React.useState<JohnsonSense | null>(null);
  const [johnsonWord1773, setJohnsonWord1773] = React.useState<JohnsonSense | null>(null);
  const [secretPassages, setSecretPassages] = React.useState<SecretDoctrinePassage[]>([]);
  const [secretSource, setSecretSource] = React.useState("");
  const [secretLoading, setSecretLoading] = React.useState(false);
  const [mythPassages, setMythPassages] = React.useState<GreekMythPassage[]>([]);
  const [mythSource, setMythSource] = React.useState("");
  const [mythLoading, setMythLoading] = React.useState(false);
  const [ruckmanVerses, setRuckmanVerses] = React.useState<RuckmanVerse[]>([]);
  const [ruckmanSource, setRuckmanSource] = React.useState("");
  const johnsonResourcesRef = React.useRef<Awaited<ReturnType<typeof loadJohnsonResources>> | null>(null);
  const compute = React.useContext(NumericalComputeContext);

  const { result, error } = React.useMemo(() => {
    const trimmed = word.trim();
    if (!trimmed) {
      return { result: null as NumerologyResult | null, error: "" };
    }
    try {
      return { result: wordToNumerology(trimmed), error: "" };
    } catch (caught) {
      return {
        result: null as NumerologyResult | null,
        error: caught instanceof Error ? caught.message : "Numerology failed.",
      };
    }
  }, [word]);

  React.useEffect(() => {
    let cancelled = false;
    loadJohnsonResources()
      .then((resources) => {
        if (cancelled) return;
        johnsonResourcesRef.current = resources;
        setJohnsonReady(true);
      })
      .catch(() => {
        if (!cancelled) setJohnsonReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!result) {
      setJohnsonWordEntry(null);
      setJohnsonWord1773(null);
      setSecretPassages([]);
      setSecretSource("");
      setSecretLoading(false);
      setMythPassages([]);
      setMythSource("");
      setMythLoading(false);
      setRuckmanVerses([]);
      setRuckmanSource("");
      return;
    }

    const resources = johnsonResourcesRef.current;
    const wordKey = result.normalized.replace(/[^a-z]/g, "");
    let cancelled = false;

    if (!resources) {
      setJohnsonWordEntry(result.johnsonWord);
      setJohnsonWord1773(null);
    } else {
      setJohnsonWordEntry(null);
      setJohnsonWord1773(null);
      lookupJohnsonEditions(wordKey, resources, lookupJohnsonInline).then(({ e1755, e1773 }) => {
        if (cancelled) return;
        setJohnsonWordEntry(e1755 ?? result.johnsonWord);
        setJohnsonWord1773(e1773);
      });
    }

    setSecretLoading(true);
    setMythLoading(true);
    searchSecretDoctrine({
      word: wordKey || result.normalized,
      pathNumber: result.number,
      limit: 5,
    })
      .then(({ passages, source }) => {
        if (cancelled) return;
        setSecretPassages(passages);
        setSecretSource(source);
        setSecretLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setSecretPassages([]);
        setSecretSource("");
        setSecretLoading(false);
      });

    searchGreekMyths({
      word: wordKey || result.normalized,
      limit: 5,
    })
      .then(({ passages, source }) => {
        if (cancelled) return;
        setMythPassages(passages);
        setMythSource(source);
        setMythLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setMythPassages([]);
        setMythSource("");
        setMythLoading(false);
      });

    getRuckmanVersesForNumber(result.number).then(({ verses, source }) => {
      if (cancelled) return;
      setRuckmanVerses(verses);
      setRuckmanSource(source);
    });

    return () => {
      cancelled = true;
    };
  }, [result, johnsonReady]);

  function downloadReport() {
    if (!result) return;
    compute();
    downloadJson(`numerology-${result.normalized || "word"}.json`, {
      ...result,
      johnsonWord: johnsonWordEntry ?? result.johnsonWord,
      johnsonWord1773,
      secretDoctrine: secretPassages,
      greekMyths: mythPassages,
      ruckmanKjv: ruckmanVerses,
      report: formatNumerologyReport(result),
    });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-2">
      <div className="space-y-3">
        <Panel title="Word → number" eyebrow="NUMEROLOGY · path + tarot + philosophy + Johnson">
          <div className="space-y-3">
            <p className="rounded-sm border border-amber/35 bg-amber/10 px-3 py-2 font-mono text-[10px] leading-relaxed text-amber">
              Samuel Johnson 1755 and 1773 (4th ed.) define your typed word when found. Secret
              Doctrine and Greek Myths add passages via exact / anagram / scramble / similar
              letter-count matches. Ruckman cites 1611 KJV verses for your path number.
            </p>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cyan">
              BRUTE FORCE METHOD TO FIND DEFINITIONS!
            </p>
            <Field
              label="Type any word or phrase"
              hint="A=1…Z=26 · mod 9 · path · tarot · five philosophers on your number · Johnson"
            >
              <TextInput
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="e.g. love"
                spellCheck={false}
                autoFocus
              />
            </Field>
            <div className="flex flex-wrap gap-1.5">
              {["abc", "love", "king", "triangle", "network", "hope", "faith", "wisdom"].map(
                (sample) => (
                  <GhostButton key={sample} type="button" onClick={() => setWord(sample)}>
                    {sample}
                  </GhostButton>
                ),
              )}
            </div>
            {error && <ErrorBanner message={error} />}
            <p className="font-mono text-[10px] text-mint/80">
              READY | Letter-sum path · tarot · seven traditions · sacred geometry · Johnson.
            </p>
          </div>
        </Panel>

        {result && (
          <Panel title={`Number ${result.number}`} eyebrow={result.title}>
            <div className="space-y-3">
              <GeometryColourCard philosophy={result.philosophy} compact />
              <div className="flex flex-wrap gap-2">
                <Metric label="Number" value={String(result.number)} />
                <Metric label="Σ letters" value={String(result.sumPositions)} />
                <Metric label="Letters" value={String(result.letterCount)} />
                <Metric label="mod 9" value={String(result.remainder)} />
              </div>
              <p className="font-mono text-[11px] leading-relaxed text-moon">{result.note}</p>
              <p className="font-mono text-[10px] text-amber">
                Traits · {result.traits.join(" · ")}
              </p>
              <div className="rounded-sm border border-magenta/30 bg-black/40 p-3">
                <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-magenta">
                  Tarot · {result.tarot.arcana}
                </p>
                <div className="mt-2 flex gap-3">
                  <img
                    src={result.tarot.imageUrl}
                    alt={`${result.tarot.name} — Rider–Waite–Smith`}
                    className="h-36 w-auto shrink-0 rounded border border-magenta/25 object-contain bg-black/60"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[12px] text-cyan">{result.tarot.name}</p>
                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-moon">
                      {result.tarot.explanation}
                    </p>
                    <p className="mt-2 font-mono text-[8px] text-muted-foreground">
                      Rider–Waite–Smith (1909) · public domain
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <RunButton type="button" onClick={downloadReport}>
                  Download JSON report
                </RunButton>
              </div>
            </div>
          </Panel>
        )}

        {result && (
          <>
            {!johnsonReady && (
              <Panel title={`“${result.normalized}” in Johnson`} eyebrow="1755 · 1773">
                <p className="font-mono text-[10px] text-muted-foreground">
                  Loading Johnson 1755 and 1773 lexicons…
                </p>
              </Panel>
            )}
            {johnsonReady && !johnsonWordEntry && !johnsonWord1773 && (
              <Panel title={`“${result.normalized}” in Johnson`} eyebrow="1755 · 1773">
                <p className="font-mono text-[10px] text-muted-foreground">
                  No Johnson headword found for this word in 1755 or 1773.
                </p>
              </Panel>
            )}
            <JohnsonEntryPanel
              title={`“${result.normalized}” · 1755`}
              eyebrow="first edition · LEME"
              entry={johnsonWordEntry}
            />
            <JohnsonEntryPanel
              title={`“${result.normalized}” · 1773`}
              eyebrow="4th edition · JDO / LEME"
              entry={johnsonWord1773}
            />
            <SecretDoctrinePanel
              word={result.normalized}
              passages={secretPassages}
              source={secretSource}
              loading={secretLoading}
            />
            <GreekMythsPanel
              word={result.normalized}
              passages={mythPassages}
              source={mythSource}
              loading={mythLoading}
            />
          </>
        )}
      </div>

      <div className="space-y-3">
        {!result ? (
          <Panel title="Ready" eyebrow="NUMEROLOGY">
            <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
              Type a word. Letters sum A=1…Z=26, then mod 9 (0→9). Only the lore for{" "}
              <span className="text-cyan">your number</span> appears — path, tarot, sacred geometry,
              Theosophy colour, seven traditions, Johnson 1755/1773, Secret Doctrine & Greek Myths
              (anagram / scramble / similar letters), and Ruckman×1611 KJV for your path number.
            </p>
          </Panel>
        ) : (
          <>
            <Panel title="Letter ledger" eyebrow="Running sum">
              <div className="max-h-48 overflow-auto rounded-sm border border-cyan/20 bg-black/40">
                <table className="w-full font-mono text-[10px] text-mint">
                  <thead className="sticky top-0 bg-deepblue text-amber">
                    <tr>
                      <th className="px-2 py-1.5 text-left">#</th>
                      <th className="px-2 py-1.5 text-left">Char</th>
                      <th className="px-2 py-1.5 text-right">Pos</th>
                      <th className="px-2 py-1.5 text-left">Kind</th>
                      <th className="px-2 py-1.5 text-right">Σ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.letters.map((row, i) => (
                      <tr key={`${row.char}-${i}`} className="border-t border-cyan/10">
                        <td className="px-2 py-1 opacity-70">{i + 1}</td>
                        <td className="px-2 py-1 text-cyan">{row.char}</td>
                        <td className="px-2 py-1 text-right">{row.position}</td>
                        <td className="px-2 py-1 opacity-80">{row.kind}</td>
                        <td className="px-2 py-1 text-right">{row.runningSum}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel
              title="Johnson expansions"
              eyebrow={`BRUTE FORCE · ${result.johnsonExpansions.filter((e) => e.found).length}/${result.johnsonExpansions.length} words`}
            >
              <p className="mb-2 font-mono text-[9px] text-amber">
                Samuel Johnson Dictionary 1777 federally validated is included
              </p>
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {result.johnsonExpansions.map((exp) => (
                  <div
                    key={exp.word}
                    className="rounded border border-cyan/15 bg-black/30 px-2 py-1.5 font-mono text-[10px]"
                  >
                    <span className="text-cyan">{exp.word.toUpperCase()}</span>
                    {exp.found && exp.entry ? (
                      <span className="text-moon"> — {exp.entry.senses[0]}</span>
                    ) : (
                      <span className="text-muted-foreground"> — (no headword onboard)</span>
                    )}
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Full report" eyebrow="Digital root · path · tarot · philosophy · Johnson">
              <EquationBox label="Telemetry">{formatNumerologyReport(result)}</EquationBox>
            </Panel>
          </>
        )}
      </div>
      </div>

      {result && (
        <>
          <Panel
            title={`Number ${result.number} · ${result.philosophy.sacredName}`}
            eyebrow={`${result.philosophy.geometry.colorName} · geometry · seven traditions`}
          >
            <PhilosophyThoughtsBlock
              philosophy={result.philosophy}
              showGeometry={false}
              ruckmanVerses={ruckmanVerses}
              ruckmanSource={ruckmanSource}
            />
          </Panel>
          <RelevantThoughtForms
            number={result.number}
            colorName={result.philosophy.geometry.colorName}
          />
        </>
      )}
    </div>
  );
}

function ReferencesPanel() {
  return (
    <div className="space-y-4">
      <Panel title="People & literature that inspired the toolbox" eyebrow="REFS">
        <p className="font-mono text-xs leading-relaxed text-muted-foreground">
          Numerical Extreme carries forward NumericalAnalysisToolbox_V15 / V11 Neon: ACM Collected
          Algorithms (including SPARS 618 / 619 / 740), Sauer-style root finding, classical
          quadrature & interpolation, and SDOF vibration analysis — plus the NUMEROLOGY tab’s
          people, dictionaries, Secret Doctrine, Greek Myths, Ruckman×KJV, and Thought-Forms
          sources listed below.
        </p>
      </Panel>

      {TOOLBOX_REFERENCES.map((section) => (
        <Panel key={section.heading} title={section.heading} eyebrow="Citation">
          <div className="space-y-3">
            <p className="font-mono text-[11px] text-muted-foreground">{section.blurb}</p>
            <ul className="space-y-3">
              {section.entries.map((entry) => (
                <li
                  key={entry.title}
                  className="rounded-sm border border-cyan/25 bg-black/30 px-3 py-2.5"
                >
                  <p className="font-display text-sm uppercase tracking-[0.08em] text-cyan">
                    {entry.title}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-amber">{entry.authors}</p>
                  {entry.venue ? (
                    <p className="mt-0.5 font-mono text-[10px] text-magenta/90">{entry.venue}</p>
                  ) : null}
                  <p className="mt-2 font-mono text-[11px] leading-relaxed text-mint/90">
                    {entry.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      ))}

      <Panel title="Disclaimer" eyebrow="Attribution">
        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
          Algorithm names, author credits, and TOMS citations honor the original published work.
          This client port reimplements selected demos in TypeScript for education and gameplay; it
          is not an official ACM redistribution of the Fortran/MATLAB source packages.
        </p>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
          Reference curation was AI-assisted, but every source listed here was used in building the
          toolbox — including development and verification work in MATLAB and Octave alongside the
          TypeScript Neon Composite Lab port.
        </p>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
          Design priority: main functionality and mechanistic usefulness are maximized — runnable
          methods, inspectable intermediates, and lab-style controls over decorative chrome.
        </p>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-amber/90">
          {PHILOSOPHY_DISCLAIMER} Numerology tradition cards quote primary sources (including harsh
          Bible Numerics readings and Avicenna for balance); display is historical/educational only.
        </p>
      </Panel>
    </div>
  );
}

export function NumericalExtremeGame({ onMenu }: NumericalExtremeGameProps) {
  const { settings } = useGame();
  const [mode, setMode] = React.useState<Mode>("main");
  const [overloadBurst, setOverloadBurst] = React.useState(0);

  const triggerEnochRa = React.useCallback(() => {
    setOverloadBurst((value) => value + 1);
  }, []);

  return (
    <NumericalComputeContext.Provider value={triggerEnochRa}>
      <div className="numerical-extreme-shell relative mx-auto flex w-full max-w-6xl flex-col gap-4 px-2 py-4">
        <BrainOverload
          burst={overloadBurst}
          reducedMotion={settings.reducedMotion}
          durationMs={1000}
          onDone={() => setOverloadBurst(0)}
        />

        <header className="nx-header zeus-outline-box overflow-hidden rounded-sm border border-cyan/50 bg-deepblue/50 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan/30 px-4 py-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-magenta">
                ZEUS AMMON-RA 11
              </p>
              <h1 className="nx-title mt-1 font-display text-xl uppercase tracking-[0.16em] text-cyan text-glow sm:text-2xl">
                NUMERICAL EXTREME
              </h1>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                Local TypeScript engine · V11 / V15 ports · ACM & Sauer lineage
              </p>
            </div>
            <button
              type="button"
              onClick={onMenu}
              className="rounded-sm border border-amber/50 bg-deepblue/50 backdrop-blur-md px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-amber transition hover:bg-amber/15"
            >
              Main menu
            </button>
          </div>
          <nav className="flex flex-wrap gap-px bg-cyan/15 p-px">
            {MODES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => audio.play("hover")}
                onClick={() => {
                  audio.play("numeric-tab", index);
                  setMode(item.id);
                }}
                className={cn(
                  "nx-tab min-h-10 flex-1 px-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition",
                  mode === item.id
                    ? "nx-tab-active bg-cyan text-deepblue"
                    : "bg-deepblue/90 text-cyan hover:bg-cyan/20 hover:text-moon",
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="min-w-0">
          {mode === "main" && <MainPanel />}
          {mode === "vector" && <VectorPanel />}
          {mode === "method" && <MethodPanel />}
          {mode === "composite" && <CompositePanel />}
          {mode === "diff" && <DiffPanel />}
          {mode === "algorithms" && <AlgorithmsPanel />}
          {mode === "acm" && <AcmLabPanel />}
          {mode === "bezier" && <BezierPanel />}
          {mode === "symbolic" && <SymbolicPanel />}
          {mode === "genetic" && <GeneticPanel />}
          {mode === "heat" && <HeatAerospacePanel />}
          {mode === "numerology" && <NumerologyPanel />}
          {mode === "references" && <ReferencesPanel />}
        </main>
      </div>
    </NumericalComputeContext.Provider>
  );
}
