import * as React from "react";
import { Chart } from "@/components/game/numerical-extreme/Chart";
import { cn } from "@/lib/utils";
import catalogJson from "@/data/university-projects/catalog.json";
import {
  columnStats,
  linearFit,
  pairsToCsv,
  parseUniversityTable,
  type UniversityTable,
} from "@/game/university-projects/tableParse";

type CatalogProject = {
  id: string;
  collection: string;
  collectionTitle: string;
  name: string;
  path: string;
  kind: string;
  lines: number;
  preview: string;
};

type Catalog = {
  title: string;
  count: number;
  projects: CatalogProject[];
  samples: Array<{ name: string; path: string }>;
};

type Tab = "plotter" | "sources";

/**
 * University Projects — web port of MATLABProject-1.m (column pick → scatter/line plot
 * → optional engineering point picks → CSV), plus coursework source browser.
 * Improvements vs the .m: one plot path (no 8× branches), file upload, stats, OLS fit,
 * start/end markers on true endpoints, equal-axis toggle, live click pick without ginput.
 */
export function UniversityProjectsApp({ onMenu }: { onMenu: () => void }) {
  const catalog = catalogJson as Catalog;
  const [tab, setTab] = React.useState<Tab>("plotter");
  const [rawText, setRawText] = React.useState("");
  const [fileLabel, setFileLabel] = React.useState("No file loaded");
  const [table, setTable] = React.useState<UniversityTable | null>(null);
  const [xIdx, setXIdx] = React.useState(0);
  const [yIdx, setYIdx] = React.useState(1);
  const [axisEqual, setAxisEqual] = React.useState(false);
  const [markEnds, setMarkEnds] = React.useState(true);
  const [engMode, setEngMode] = React.useState(false);
  const [showFit, setShowFit] = React.useState(false);
  const [picked, setPicked] = React.useState<Array<{ x: number; y: number }>>([]);
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("Load Sample_Data_01 or upload a lab table.");
  const [sourceFilter, setSourceFilter] = React.useState<"all" | "matlab" | "python-misc" | "python-test">(
    "all",
  );
  const [sourceQuery, setSourceQuery] = React.useState("");
  const [selectedSource, setSelectedSource] = React.useState(catalog.projects[0]?.id ?? "");
  const [sourceBody, setSourceBody] = React.useState("");

  const btn =
    "rounded-sm border border-cyan/50 bg-deepblue/50 backdrop-blur-md px-4 py-2 font-display text-xs uppercase tracking-[0.18em] text-cyan transition hover:bg-cyan/20 hover:text-moon disabled:opacity-40";

  function applyText(text: string, label: string) {
    setError("");
    setRawText(text);
    setFileLabel(label);
    setPicked([]);
    try {
      const parsed = parseUniversityTable(text);
      setTable(parsed);
      setXIdx(0);
      setYIdx(Math.min(1, parsed.headers.length - 1));
      setStatus(
        `Loaded ${label} · ${parsed.rowCount} rows · ${parsed.headers.length} cols · format ${parsed.sourceFormat}`,
      );
      if (parsed.warnings.length) setError(parsed.warnings.join(" "));
    } catch (err) {
      setTable(null);
      setError(err instanceof Error ? err.message : "Parse failed");
      setStatus("Parse failed");
    }
  }

  async function loadSample(path: string, name: string) {
    setStatus(`Loading ${name}…`);
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Could not load ${name}`);
    applyText(await res.text(), name);
  }

  function onUpload(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => applyText(String(reader.result ?? ""), file.name);
    reader.readAsText(file);
  }

  React.useEffect(() => {
    void loadSample("/university-projects/samples/Sample_Data_01.txt", "Sample_Data_01.txt").catch(
      (err: unknown) => setError(err instanceof Error ? err.message : "Sample load failed"),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- boot once
  }, []);

  const xs = table?.columns[xIdx] ?? [];
  const ys = table?.columns[yIdx] ?? [];
  const xLabel = table?.headers[xIdx] ?? "X";
  const yLabel = table?.headers[yIdx] ?? "Y";
  const xStats = columnStats(xs);
  const yStats = columnStats(ys);
  const fit = showFit ? linearFit(xs, ys) : null;

  const paired = React.useMemo(() => {
    const pts: Array<{ x: number; y: number }> = [];
    const n = Math.min(xs.length, ys.length);
    for (let i = 0; i < n; i += 1) {
      const x = xs[i]!;
      const y = ys[i]!;
      if (Number.isFinite(x) && Number.isFinite(y)) pts.push({ x, y });
    }
    return pts;
  }, [xs, ys]);

  const chartX = paired.map((p) => p.x);
  const chartY = paired.map((p) => p.y as number | null);
  const fitSeries =
    fit && paired.length >= 2
      ? {
          key: "fit",
          label: `fit y=${fit.a.toPrecision(4)}+${fit.b.toPrecision(4)}x`,
          values: chartX.map((x) => fit.a + fit.b * x) as Array<number | null>,
          color: "#fbbf24",
        }
      : null;

  const markers: Array<{ x: number; y: number; color?: string; label?: string }> = [];
  if (markEnds && xs.length && ys.length) {
    const first = { x: xs[0]!, y: ys[0]! };
    const last = { x: xs[xs.length - 1]!, y: ys[ys.length - 1]! };
    if (Number.isFinite(first.x) && Number.isFinite(first.y)) {
      markers.push({ ...first, color: "#39ff14", label: "start" });
    }
    if (Number.isFinite(last.x) && Number.isFinite(last.y)) {
      markers.push({ ...last, color: "#ff2a2a", label: "end" });
    }
  }
  for (const p of picked) {
    markers.push({ ...p, color: "#f472b6", label: "pick" });
  }

  const filteredSources = catalog.projects.filter((p) => {
    if (sourceFilter !== "all" && p.collection !== sourceFilter) return false;
    const q = sourceQuery.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.collectionTitle.toLowerCase().includes(q);
  });
  const activeSource = catalog.projects.find((p) => p.id === selectedSource) ?? filteredSources[0];

  React.useEffect(() => {
    if (!activeSource || tab !== "sources") return;
    let cancelled = false;
    fetch(activeSource.path)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((t) => {
        if (!cancelled) setSourceBody(t);
      })
      .catch(() => {
        if (!cancelled) setSourceBody(activeSource.preview);
      });
    return () => {
      cancelled = true;
    };
  }, [activeSource, tab]);

  function downloadPicks() {
    if (!picked.length) return;
    const blob = new Blob([pairsToCsv(picked)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "picked_points.csv";
    a.click();
    URL.revokeObjectURL(url);
    setStatus(`Saved ${picked.length} points → picked_points.csv`);
  }

  // Equal-axis: square the plot domain by padding the smaller span
  let equalNote = "";
  if (axisEqual && xStats.min != null && yStats.min != null && xStats.max != null && yStats.max != null) {
    const xr = xStats.max - xStats.min || 1;
    const yr = yStats.max - yStats.min || 1;
    equalNote = xr >= yr ? "axis equal (Y padded)" : "axis equal (X padded)";
  }

  return (
    <div className="extreme-shell relative mx-auto flex w-full max-w-6xl flex-col gap-4 px-2 py-4">
      <header className="zeus-outline-box overflow-hidden rounded-sm border border-[#60a5fa]/55 bg-deepblue/50 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#60a5fa]/25 px-4 py-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#93c5fd]">
              ZEUS AMMON-RA 11 · COURSEWORK
            </p>
            <h1 className="mt-1 font-display text-xl uppercase tracking-[0.16em] text-[#60a5fa] text-glow sm:text-2xl">
              University Projects
            </h1>
            <p className="mt-1 max-w-3xl font-mono text-[10px] leading-relaxed text-muted-foreground">
              Web port of <code>MATLABProject-1.m</code>: load lab table → choose X/Y → scatter+line →
              optional engineering picks → CSV. Improved: one plot path, upload, stats, linear fit,
              true start/end markers. Also browses PyCharm Misc Python labs.
            </p>
          </div>
          <button
            type="button"
            onClick={onMenu}
            className="rounded-sm border border-amber/50 bg-deepblue/50 px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-amber transition hover:bg-amber/15"
          >
            Main menu
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className="text-mint">{status}</span>
          <span className="text-muted-foreground">{fileLabel}</span>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2">
        {(
          [
            ["plotter", "Data plotter"],
            ["sources", "Source files"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={cn(btn, tab === id && "border-[#60a5fa] bg-[#60a5fa]/20 text-[#93c5fd]")}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "plotter" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
          <section className="space-y-3 rounded-sm border border-[#60a5fa]/35 bg-black/40 p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#93c5fd]">Load table</p>
            <div className="flex flex-wrap gap-2">
              {catalog.samples.map((s) => (
                <button
                  key={s.path}
                  type="button"
                  className={btn}
                  onClick={() => void loadSample(s.path, s.name).catch((e: unknown) => setError(String(e)))}
                >
                  {s.name}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="font-mono text-[10px] text-muted-foreground">Upload .txt / .csv / .tsv</span>
              <input
                type="file"
                accept=".txt,.csv,.tsv,text/plain"
                className="mt-1 block w-full font-mono text-[11px] text-moon"
                onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] text-muted-foreground">Or paste table text</span>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-sm border border-cyan/30 bg-midnight px-2 py-1.5 font-mono text-[10px] text-moon"
              />
            </label>
            <button type="button" className={btn} onClick={() => applyText(rawText, "pasted text")}>
              Parse pasted text
            </button>

            {table && (
              <>
                <label className="block font-mono text-[10px] text-muted-foreground">
                  Choose X
                  <select
                    className="mt-1 w-full rounded-sm border border-cyan/40 bg-midnight px-2 py-1.5 text-moon"
                    value={xIdx}
                    onChange={(e) => setXIdx(Number(e.target.value))}
                  >
                    {table.headers.map((h, i) => (
                      <option key={`x-${h}-${i}`} value={i}>
                        {h}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block font-mono text-[10px] text-muted-foreground">
                  Choose Y
                  <select
                    className="mt-1 w-full rounded-sm border border-cyan/40 bg-midnight px-2 py-1.5 text-moon"
                    value={yIdx}
                    onChange={(e) => setYIdx(Number(e.target.value))}
                  >
                    {table.headers.map((h, i) => (
                      <option key={`y-${h}-${i}`} value={i}>
                        {h}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="space-y-2 font-mono text-[11px] text-moon">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={axisEqual} onChange={(e) => setAxisEqual(e.target.checked)} className="accent-cyan" />
                    Equal axis scaling
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={markEnds} onChange={(e) => setMarkEnds(e.target.checked)} className="accent-cyan" />
                    Mark beginning & ending points
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={engMode}
                      onChange={(e) => {
                        setEngMode(e.target.checked);
                        if (!e.target.checked) setPicked([]);
                      }}
                      className="accent-cyan"
                    />
                    Engineering mode (click plot to pick points)
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={showFit} onChange={(e) => setShowFit(e.target.checked)} className="accent-cyan" />
                    Show linear fit (OLS)
                  </label>
                </div>

                <div className="rounded-sm border border-cyan/20 bg-black/40 px-2 py-2 font-mono text-[10px] text-muted-foreground">
                  <p>
                    X · n={xStats.count} min={xStats.min?.toPrecision(4) ?? "—"} max=
                    {xStats.max?.toPrecision(4) ?? "—"} mean={xStats.mean?.toPrecision(4) ?? "—"}
                  </p>
                  <p>
                    Y · n={yStats.count} min={yStats.min?.toPrecision(4) ?? "—"} max=
                    {yStats.max?.toPrecision(4) ?? "—"} mean={yStats.mean?.toPrecision(4) ?? "—"}
                  </p>
                  {fit && (
                    <p className="text-amber">
                      Fit: y = {fit.a.toPrecision(5)} + {fit.b.toPrecision(5)}·x (n={fit.n})
                    </p>
                  )}
                  {equalNote && <p className="text-cyan">{equalNote}</p>}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button type="button" className={btn} disabled={!picked.length} onClick={downloadPicks}>
                    Save picks CSV
                  </button>
                  <button type="button" className={btn} disabled={!picked.length} onClick={() => setPicked([])}>
                    Clear picks
                  </button>
                </div>
              </>
            )}
            {error && (
              <p className="rounded-sm border border-orange/40 bg-orange/10 px-2 py-1.5 font-mono text-[11px] text-orange">
                {error}
              </p>
            )}
          </section>

          <section className="rounded-sm border border-[#60a5fa]/35 bg-black/40 p-3">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#93c5fd]">
              Scatter plot of selected data · {xLabel} vs {yLabel}
              {engMode ? " · click to pick" : ""}
            </p>
            {table && chartX.length > 0 ? (
              <Chart
                x={chartX}
                series={[
                  { key: "line", label: "trace", values: chartY, color: "#38bdf8" },
                  ...(fitSeries ? [fitSeries] : []),
                ]}
                markers={markers}
                height={axisEqual ? 420 : 320}
                {...(engMode
                  ? {
                      onPointClick: (pt: { x: number; y: number; index: number }) => {
                        setPicked((prev) => [...prev, { x: pt.x, y: pt.y }]);
                        setStatus(
                          `Picked (${pt.x.toPrecision(6)}, ${pt.y.toPrecision(6)}) · ${picked.length + 1} total`,
                        );
                      },
                    }
                  : {})}
              />
            ) : (
              <p className="py-16 text-center font-mono text-sm text-muted-foreground">No plot yet.</p>
            )}
            {picked.length > 0 && (
              <pre className="mt-2 max-h-32 overflow-auto rounded-sm border border-magenta/30 bg-black/50 p-2 font-mono text-[10px] text-magenta">
                {pairsToCsv(picked)}
              </pre>
            )}
          </section>
        </div>
      )}

      {tab === "sources" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
          <section className="space-y-3 rounded-sm border border-[#60a5fa]/35 bg-black/40 p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#93c5fd]">
              {catalog.count} coursework files
            </p>
            <div className="flex flex-wrap gap-1">
              {(
                [
                  ["all", "All"],
                  ["matlab", "MATLAB"],
                  ["python-misc", "Python misc"],
                  ["python-test", "Python test"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={cn(btn, "px-2 py-1", sourceFilter === id && "bg-[#60a5fa]/20 text-[#93c5fd]")}
                  onClick={() => setSourceFilter(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              value={sourceQuery}
              onChange={(e) => setSourceQuery(e.target.value)}
              placeholder="Search files…"
              className="w-full rounded-sm border border-cyan/30 bg-midnight px-2 py-1.5 font-mono text-[11px] text-moon"
            />
            <div className="max-h-[min(55vh,520px)] space-y-1 overflow-y-auto">
              {filteredSources.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedSource(p.id)}
                  className={cn(
                    "w-full rounded-sm border px-2 py-2 text-left",
                    activeSource?.id === p.id
                      ? "border-[#60a5fa]/60 bg-[#60a5fa]/15"
                      : "border-cyan/20 bg-black/30 hover:border-cyan/40",
                  )}
                >
                  <p className="font-mono text-[11px] text-cyan">{p.name}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">
                    {p.kind} · {p.lines} lines · {p.collectionTitle}
                  </p>
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-sm border border-[#60a5fa]/35 bg-black/40 p-3">
            {activeSource ? (
              <>
                <p className="mb-2 font-mono text-[11px] text-[#93c5fd]">
                  {activeSource.name}
                  <span className="text-muted-foreground"> · {activeSource.path}</span>
                </p>
                <pre className="max-h-[min(70vh,680px)] overflow-auto rounded-sm border border-cyan/20 bg-black/50 p-3 font-mono text-[11px] leading-relaxed text-mint whitespace-pre">
                  {sourceBody || activeSource.preview}
                </pre>
              </>
            ) : (
              <p className="font-mono text-sm text-muted-foreground">Select a file.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
