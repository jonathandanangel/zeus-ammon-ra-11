import * as React from "react";
import { cn } from "@/lib/utils";
import {
  PROJECT_GUI_SOURCE,
  assignStudentGrades,
  computeTeamAverages,
  getDataByHeaderAndRow,
  getDataDict,
  summarizeGameLog,
  type DataDict,
  type GameLogStats,
} from "@/game/university-projects/projectGui";

type SubTab = "summary" | "scoring" | "grades" | "data" | "source";

const btn =
  "rounded-sm border border-cyan/50 bg-deepblue/50 backdrop-blur-md px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.16em] text-cyan transition hover:bg-cyan/20 hover:text-moon disabled:opacity-40";

async function fetchText(path: string): Promise<string> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path}`);
  return res.text();
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsText(file);
  });
}

/**
 * Web port of project_gui.py — Game Log Summarizer + Scoring + Grades + Data Reader.
 */
export function ProjectGuiPanel() {
  const [sub, setSub] = React.useState<SubTab>("summary");

  // Summary
  const [logText, setLogText] = React.useState("");
  const [logLabel, setLogLabel] = React.useState("No log loaded");
  const [out, setOut] = React.useState("");
  const [stats, setStats] = React.useState<GameLogStats | null>(null);
  const [err, setErr] = React.useState("");

  // Scoring
  const [scoreText, setScoreText] = React.useState("");
  const [scoreOut, setScoreOut] = React.useState("");

  // Grades
  const [gradeText, setGradeText] = React.useState("");
  const [gradeOut, setGradeOut] = React.useState("");

  // Data reader
  const [dataText, setDataText] = React.useState("");
  const [dataHeaders, setDataHeaders] = React.useState<(keyof DataDict)[]>([]);
  const [header, setHeader] = React.useState<keyof DataDict>("LABEL");
  const [rowNum, setRowNum] = React.useState(1);
  const [dataValue, setDataValue] = React.useState("");
  const [dataOut, setDataOut] = React.useState("");

  // Source
  const [sourceBody, setSourceBody] = React.useState("");

  React.useEffect(() => {
    void fetchText("/university-projects/me021/sample_game_log.txt")
      .then((t) => {
        setLogText(t);
        setLogLabel("sample_game_log.txt");
      })
      .catch(() => undefined);
    void fetchText("/university-projects/samples/TeamData.txt")
      .then(setScoreText)
      .catch(() => undefined);
    void fetchText("/university-projects/me021/StudentInfo.tsv")
      .then(setGradeText)
      .catch(() => undefined);
    void fetchText("/university-projects/me021/StudentAppearance.txt")
      .then(setDataText)
      .catch(() => undefined);
  }, []);

  React.useEffect(() => {
    if (sub !== "source") return;
    void fetchText(PROJECT_GUI_SOURCE)
      .then(setSourceBody)
      .catch(() => setSourceBody("// could not load project_gui.py"));
  }, [sub]);

  function runSummary() {
    setErr("");
    const { summary, stats: s } = summarizeGameLog(logText);
    setOut(summary);
    setStats(s);
  }

  function runScores() {
    const { text, error } = computeTeamAverages(scoreText);
    setScoreOut(error ?? text);
  }

  function runGrades() {
    const { text, error } = assignStudentGrades(gradeText);
    setGradeOut(error ?? text);
  }

  function loadHeaders() {
    const d = getDataDict(dataText);
    const headers = (Object.keys(d) as (keyof DataDict)[]).filter((h) => d[h].length > 0);
    setDataHeaders(headers.length ? headers : (["LABEL", "Name", "appearance"] as const));
    if (headers[0]) setHeader(headers[0]);
    setDataOut(`Loaded headers: ${headers.join(", ") || "(none)"} · ${d.LABEL.length} rows`);
  }

  function getData() {
    const { value, error } = getDataByHeaderAndRow(dataText, header, rowNum);
    if (error) {
      setDataValue("");
      setDataOut(error);
    } else {
      setDataValue(String(value));
      setDataOut(`Value at header '${header}', row ${rowNum}: ${value}`);
    }
  }

  function downloadText(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <section className="rounded-sm border border-[#60a5fa]/35 bg-black/40 p-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#93c5fd]">
          ME 021 · project_gui.py web port
        </p>
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
          Game Log Summarizer (PC kills / damage), team score averages, student grade assigner
          (improved TSV → letter grades), and LABEL/Name/appearance data reader — from your
          PySimpleGUI <code className="text-cyan">project_gui.py</code>. Raw Python exec is
          omitted in the browser; open the Source tab to read the original.
        </p>
        <nav className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["summary", "Log summary"],
              ["scoring", "Team scoring"],
              ["grades", "Student grades"],
              ["data", "Data reader"],
              ["source", "project_gui.py"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={cn(btn, sub === id && "border-[#60a5fa] bg-[#60a5fa]/20 text-[#93c5fd]")}
              onClick={() => setSub(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </section>

      {err && (
        <p className="rounded-sm border border-red-400/40 bg-red-950/40 px-3 py-2 font-mono text-[11px] text-red-200">
          {err}
        </p>
      )}

      {sub === "summary" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
          <section className="space-y-3 rounded-sm border border-[#60a5fa]/35 bg-black/40 p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#93c5fd]">
              Log file · {logLabel}
            </p>
            <button
              type="button"
              className={btn}
              onClick={() =>
                void fetchText("/university-projects/me021/sample_game_log.txt").then((t) => {
                  setLogText(t);
                  setLogLabel("sample_game_log.txt");
                })
              }
            >
              Load sample log
            </button>
            <label className="block">
              <span className="font-mono text-[10px] text-muted-foreground">Upload .txt log</span>
              <input
                type="file"
                accept=".txt,text/plain"
                className="mt-1 block w-full font-mono text-[11px] text-moon"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  void readFile(f).then((t) => {
                    setLogText(t);
                    setLogLabel(f.name);
                  });
                }}
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] text-muted-foreground">Or paste chat log</span>
              <textarea
                value={logText}
                onChange={(e) => setLogText(e.target.value)}
                rows={12}
                className="mt-1 w-full rounded-sm border border-cyan/30 bg-midnight px-2 py-1.5 font-mono text-[10px] text-moon"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={btn} onClick={() => setOut(logText)}>
                Show raw
              </button>
              <button type="button" className={btn} onClick={runSummary}>
                Show summary
              </button>
              <button
                type="button"
                className={btn}
                disabled={!out}
                onClick={() => downloadText("game_log_summary.txt", out)}
              >
                Save summary
              </button>
              <button
                type="button"
                className={btn}
                onClick={() => {
                  setOut("");
                  setStats(null);
                }}
              >
                Clear
              </button>
            </div>
          </section>
          <section className="space-y-3 rounded-sm border border-[#60a5fa]/35 bg-black/40 p-4">
            <div className="flex flex-wrap gap-3 font-mono text-[11px] text-moon">
              <span>
                PC: <span className="text-cyan">{stats?.pc ?? "—"}</span>
              </span>
              <span>
                Kills: <span className="text-amber">{stats?.kills ?? 0}</span>
              </span>
              <span>
                Hits: <span className="text-amber">{stats?.hits ?? 0}</span>
              </span>
              <span>
                Total: <span className="text-amber">{stats?.total ?? 0}</span>
              </span>
              <span>
                Avg: <span className="text-amber">{(stats?.avg ?? 0).toFixed(1)}</span>
              </span>
            </div>
            <pre className="max-h-[32rem] overflow-auto rounded-sm border border-cyan/20 bg-[#02121b] p-3 font-mono text-[11px] leading-relaxed text-moon whitespace-pre-wrap">
              {out || "(output will appear here)"}
            </pre>
          </section>
        </div>
      )}

      {sub === "scoring" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-3 rounded-sm border border-[#60a5fa]/35 bg-black/40 p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#93c5fd]">
              Score file · TeamData
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btn}
                onClick={() =>
                  void fetchText("/university-projects/samples/TeamData.txt").then(setScoreText)
                }
              >
                TeamData.txt
              </button>
              <button
                type="button"
                className={btn}
                onClick={() =>
                  void fetchText("/university-projects/samples/HW04b_TeamData.txt").then(setScoreText)
                }
              >
                HW04b_TeamData.txt
              </button>
            </div>
            <textarea
              value={scoreText}
              onChange={(e) => setScoreText(e.target.value)}
              rows={14}
              className="w-full rounded-sm border border-cyan/30 bg-midnight px-2 py-1.5 font-mono text-[10px] text-moon"
            />
            <button type="button" className={btn} onClick={runScores}>
              Compute averages
            </button>
          </section>
          <section className="rounded-sm border border-[#60a5fa]/35 bg-black/40 p-4">
            <pre className="max-h-[32rem] overflow-auto font-mono text-[11px] text-mint whitespace-pre-wrap">
              {scoreOut || "(averages will appear here)"}
            </pre>
            {scoreOut && !scoreOut.startsWith("No valid") && (
              <button
                type="button"
                className={cn(btn, "mt-3")}
                onClick={() => downloadText("test_file.txt", scoreOut)}
              >
                Save test_file.txt
              </button>
            )}
          </section>
        </div>
      )}

      {sub === "grades" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-3 rounded-sm border border-[#60a5fa]/35 bg-black/40 p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#93c5fd]">
              StudentInfo · TSV → letter grades
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              Port of the Raw Runner grade script — averages exam columns and appends A–F (works for
              any row count, not just 5).
            </p>
            <button
              type="button"
              className={btn}
              onClick={() =>
                void fetchText("/university-projects/me021/StudentInfo.tsv").then(setGradeText)
              }
            >
              Load StudentInfo.tsv
            </button>
            <textarea
              value={gradeText}
              onChange={(e) => setGradeText(e.target.value)}
              rows={12}
              className="w-full rounded-sm border border-cyan/30 bg-midnight px-2 py-1.5 font-mono text-[10px] text-moon"
            />
            <button type="button" className={btn} onClick={runGrades}>
              Assign grades
            </button>
          </section>
          <section className="rounded-sm border border-[#60a5fa]/35 bg-black/40 p-4">
            <pre className="max-h-[32rem] overflow-auto font-mono text-[11px] text-mint whitespace-pre-wrap">
              {gradeOut || "(graded TSV will appear here)"}
            </pre>
            {gradeOut && (
              <button
                type="button"
                className={cn(btn, "mt-3")}
                onClick={() => downloadText("text.tsv", gradeOut)}
              >
                Save text.tsv
              </button>
            )}
          </section>
        </div>
      )}

      {sub === "data" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-3 rounded-sm border border-[#60a5fa]/35 bg-black/40 p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#93c5fd]">
              Data reader · LABEL / Name / appearance
            </p>
            <button
              type="button"
              className={btn}
              onClick={() =>
                void fetchText("/university-projects/me021/StudentAppearance.txt").then(setDataText)
              }
            >
              Load StudentAppearance.txt
            </button>
            <textarea
              value={dataText}
              onChange={(e) => setDataText(e.target.value)}
              rows={10}
              className="w-full rounded-sm border border-cyan/30 bg-midnight px-2 py-1.5 font-mono text-[10px] text-moon"
            />
            <div className="flex flex-wrap items-end gap-2">
              <button type="button" className={btn} onClick={loadHeaders}>
                Load headers
              </button>
              <label className="font-mono text-[10px] text-muted-foreground">
                Header
                <select
                  className="mt-1 block rounded-sm border border-cyan/40 bg-midnight px-2 py-1.5 text-moon"
                  value={header}
                  onChange={(e) => setHeader(e.target.value as keyof DataDict)}
                >
                  {(dataHeaders.length ? dataHeaders : (["LABEL", "Name", "appearance"] as const)).map(
                    (h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ),
                  )}
                </select>
              </label>
              <label className="font-mono text-[10px] text-muted-foreground">
                Row (1-based)
                <input
                  type="number"
                  min={1}
                  value={rowNum}
                  onChange={(e) => setRowNum(Number(e.target.value))}
                  className="mt-1 block w-20 rounded-sm border border-cyan/40 bg-midnight px-2 py-1.5 text-moon"
                />
              </label>
              <button type="button" className={btn} onClick={getData}>
                Get data
              </button>
            </div>
          </section>
          <section className="space-y-2 rounded-sm border border-[#60a5fa]/35 bg-black/40 p-4">
            <p className="font-mono text-[11px] text-cyan">
              Value: <span className="text-amber">{dataValue || "—"}</span>
            </p>
            <pre className="font-mono text-[11px] text-moon whitespace-pre-wrap">{dataOut || "—"}</pre>
          </section>
        </div>
      )}

      {sub === "source" && (
        <section className="rounded-sm border border-[#60a5fa]/35 bg-black/40 p-4">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#93c5fd]">
            {PROJECT_GUI_SOURCE}
          </p>
          <pre className="max-h-[40rem] overflow-auto rounded-sm border border-cyan/20 bg-[#02121b] p-3 font-mono text-[10px] leading-relaxed text-mint/90 whitespace-pre">
            {sourceBody || "Loading…"}
          </pre>
        </section>
      )}
    </div>
  );
}
