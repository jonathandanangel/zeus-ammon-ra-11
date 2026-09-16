import * as React from "react";
import { faceppDetect } from "@/game/vanity/facepp";
import {
  aggregateBatch,
  blobToBase64,
  enrichRow,
  repairImageForFacepp,
  type BatchVanityResult,
  type ImageVanityRow,
} from "@/game/vanity/math";
import { cn } from "@/lib/utils";

export interface VanityAppProps {
  onMenu: () => void;
}

type GateState = {
  apiKey: string;
  apiSecret: string;
  region: "us" | "cn";
};

const PAUSE_MS = 200;

export function VanityApp({ onMenu }: VanityAppProps) {
  const [unlocked, setUnlocked] = React.useState(false);
  const [gate, setGate] = React.useState<GateState>({
    apiKey: "",
    apiSecret: "",
    region: "us",
  });
  const [gateError, setGateError] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [status, setStatus] = React.useState("Enter Face++ credentials to unlock.");
  const [rows, setRows] = React.useState<ImageVanityRow[]>([]);
  const [batch, setBatch] = React.useState<BatchVanityResult | null>(null);
  const [log, setLog] = React.useState<string[]>(["THE VANITY APP ready."]);
  const abortRef = React.useRef(false);
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  function appendLog(line: string) {
    setLog((prev) => [...prev.slice(-400), line]);
  }

  function unlock(event: React.FormEvent) {
    event.preventDefault();
    setGateError("");
    if (!gate.apiKey.trim() || !gate.apiSecret.trim()) {
      setGateError("API key and API secret are required.");
      return;
    }
    if (/^paste/i.test(gate.apiKey.trim()) || /^paste/i.test(gate.apiSecret.trim())) {
      setGateError('Replace placeholder text — do not use "paste" as credentials.');
      return;
    }
    setUnlocked(true);
    setStatus("READY — select images to run Face++ Detect batch.");
    appendLog(`Credentials accepted (region=${gate.region}). Keys stay in memory only.`);
  }

  function lockCredentials() {
    abortRef.current = true;
    setUnlocked(false);
    setGate({ apiKey: "", apiSecret: "", region: gate.region });
    setBatch(null);
    setRows([]);
    setStatus("Credentials cleared.");
    appendLog("Session locked — API key/secret wiped from memory.");
  }

  async function runBatch(files: FileList | null) {
    if (!files?.length || !unlocked) return;
    abortRef.current = false;
    setBusy(true);
    setBatch(null);
    const list = Array.from(files);
    appendLog(`Selected ${list.length} image(s). Processing…`);
    const nextRows: ImageVanityRow[] = [];

    for (let i = 0; i < list.length; i += 1) {
      if (abortRef.current) {
        appendLog("Batch stopped by user.");
        break;
      }
      const file = list[i]!;
      setStatus(`RUNNING ${i + 1} / ${list.length}`);
      const repaired = await repairImageForFacepp(file);
      if (!repaired.ok || !repaired.blob) {
        nextRows.push(
          enrichRow({
            index: i,
            name: file.name,
            skipped: true,
            skipReason: repaired.reason,
            maleScore: null,
            femaleScore: null,
            age: null,
            gender: "",
            emotion: null,
            faceCount: 0,
            encoding: "",
            meta: "",
          }),
        );
        appendLog(`#${i + 1} SKIP — ${repaired.reason}`);
        continue;
      }

      try {
        const b64 = await blobToBase64(repaired.blob);
        const result = await faceppDetect({
          data: {
            apiKey: gate.apiKey,
            apiSecret: gate.apiSecret,
            region: gate.region,
            imageBase64: b64,
            returnAttributes: "gender,age,emotion,beauty",
          },
        });
        const meta = `[endpoint=${result.endpoint} status=${result.status ?? "?"} req=${result.requestId || "-"} time=${result.timeUsed ?? "?"}ms enc=${result.encoding || "-"}]`;
        if (!result.ok || (result.maleScore === null && result.femaleScore === null)) {
          nextRows.push(
            enrichRow({
              index: i,
              name: file.name,
              skipped: true,
              skipReason: `${result.errorMessage || "API failed/No faces"} ${meta}`,
              maleScore: result.maleScore,
              femaleScore: result.femaleScore,
              age: result.age,
              gender: result.gender,
              emotion: result.emotion,
              faceCount: result.faceCount,
              encoding: result.encoding,
              meta,
            }),
          );
          appendLog(`#${i + 1} SKIP — ${result.errorMessage || "No faces"}`);
        } else {
          const row = enrichRow({
            index: i,
            name: file.name,
            skipped: false,
            skipReason: repaired.reason !== "OK" ? repaired.reason : "",
            maleScore: result.maleScore,
            femaleScore: result.femaleScore,
            age: result.age,
            gender: result.gender,
            emotion: result.emotion,
            faceCount: result.faceCount,
            encoding: result.encoding,
            meta,
          });
          nextRows.push(row);
          appendLog(
            `#${i + 1} OK — THE IQ≈${row.theIq?.toFixed(2) ?? "-"} ATTR≈${row.attr?.toFixed(2) ?? "-"}`,
          );
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Runtime error";
        nextRows.push(
          enrichRow({
            index: i,
            name: file.name,
            skipped: true,
            skipReason: `Runtime error: ${msg}`,
            maleScore: null,
            femaleScore: null,
            age: null,
            gender: "",
            emotion: null,
            faceCount: 0,
            encoding: "",
            meta: "",
          }),
        );
        appendLog(`#${i + 1} ERROR — ${msg}`);
      }

      setRows([...nextRows]);
      await new Promise((r) => setTimeout(r, PAUSE_MS));
    }

    const result = aggregateBatch(nextRows);
    setBatch(result);
    setRows(nextRows);
    setBusy(false);
    setStatus(result.nValid ? "COMPLETE" : "COMPLETE — no valid faces");
    appendLog(
      `Batch done: valid=${result.nValid} skipped=${result.nSkipped}` +
        (result.cacIq !== null ? ` CAC IQ≈${result.cacIq.toFixed(2)}` : ""),
    );
  }

  function downloadReport() {
    if (!batch) return;
    const blob = new Blob([batch.reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "FacePP_Batch_Report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const field =
    "w-full rounded-lg border border-cyan/40 bg-deepblue/80 px-3 py-2 font-mono text-xs text-moon outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30";
  const btn =
    "rounded-lg border border-cyan/50 bg-deepblue/70 px-4 py-2 font-display text-xs uppercase tracking-[0.18em] text-cyan transition hover:bg-cyan/20 hover:text-moon disabled:opacity-40";

  return (
    <div className="extreme-shell relative mx-auto flex w-full max-w-6xl flex-col gap-4 px-2 py-4">
      <header className="overflow-hidden rounded-xl border border-magenta/50 bg-deepblue/80 shadow-[0_0_40px_rgba(236,72,153,0.14)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-magenta/30 px-4 py-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan">
              ZEUS AMMON-RA 11
            </p>
            <h1 className="mt-1 font-display text-xl uppercase tracking-[0.16em] text-magenta text-glow sm:text-2xl">
              THE VANITY APP
            </h1>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              Face++ Detect batch · Beauty → IQ-like / ATTR / CAC · keys never hardcoded
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {unlocked && (
              <button type="button" className={btn} onClick={lockCredentials}>
                Lock keys
              </button>
            )}
            <button
              type="button"
              onClick={onMenu}
              className="rounded-lg border border-amber/50 bg-deepblue/70 px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-amber transition hover:bg-amber/15"
            >
              Main menu
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className={cn(busy ? "text-amber" : "text-mint")}>{status}</span>
          <span className="text-muted-foreground">
            region {gate.region.toUpperCase()} · pause {PAUSE_MS}ms
          </span>
        </div>
      </header>

      {!unlocked ? (
        <form
          onSubmit={unlock}
          className="mx-auto w-full max-w-lg space-y-4 rounded-xl border border-cyan/40 bg-deepblue/70 p-5 shadow-[0_0_28px_rgba(34,211,238,0.08)]"
        >
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            Enter your Face++ <span className="text-cyan">API Key</span> and{" "}
            <span className="text-cyan">API Secret</span>. Values stay in session memory only — never
            stored as <code className="text-amber">paste</code> placeholders.
          </p>
          <label className="block space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-magenta">
              API Key
            </span>
            <input
              type="password"
              autoComplete="off"
              spellCheck={false}
              className={field}
              value={gate.apiKey}
              onChange={(e) => setGate((g) => ({ ...g, apiKey: e.target.value }))}
              placeholder="Face++ API key"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-magenta">
              API Secret
            </span>
            <input
              type="password"
              autoComplete="off"
              spellCheck={false}
              className={field}
              value={gate.apiSecret}
              onChange={(e) => setGate((g) => ({ ...g, apiSecret: e.target.value }))}
              placeholder="Face++ API secret"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-magenta">
              Region
            </span>
            <select
              className={field}
              value={gate.region}
              onChange={(e) =>
                setGate((g) => ({ ...g, region: e.target.value as "us" | "cn" }))
              }
            >
              <option value="us">US (api-us.faceplusplus.com)</option>
              <option value="cn">CN (api-cn.faceplusplus.com)</option>
            </select>
          </label>
          {gateError && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 font-mono text-[11px] text-red-300">
              {gateError}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg border border-magenta/60 bg-magenta/25 px-4 py-3 font-display text-sm uppercase tracking-[0.2em] text-moon transition hover:bg-magenta/40"
          >
            Unlock Vanity App
          </button>
        </form>
      ) : (
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
          <section className="space-y-3 rounded-xl border border-cyan/40 bg-deepblue/70 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-magenta">
              Batch controls
            </p>
            <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
              Select JPG/PNG images. Auto-repair to 48–4096 px / ≤2MB. Skips failures and continues.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,.jpg,.jpeg,.png"
              multiple
              className="hidden"
              onChange={(e) => {
                void runBatch(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              className={cn(btn, "w-full border-magenta/50 text-magenta")}
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              {busy ? "Running…" : "Select images"}
            </button>
            {busy && (
              <button
                type="button"
                className={cn(btn, "w-full border-amber/50 text-amber")}
                onClick={() => {
                  abortRef.current = true;
                }}
              >
                Stop
              </button>
            )}
            <button
              type="button"
              className={cn(btn, "w-full")}
              disabled={!batch}
              onClick={downloadReport}
            >
              Download TXT report
            </button>

            {batch && batch.nValid > 0 && (
              <div className="space-y-2 rounded-lg border border-cyan/25 bg-black/30 p-3 font-mono text-[11px] text-mint">
                <p>CAC IQ ≈ {batch.cacIq?.toFixed(2)} ({batch.cacPct?.toFixed(1)}%)</p>
                <p>CAC ATTR ≈ {batch.cacAttr?.toFixed(2)} ({batch.cacAttrPct?.toFixed(1)}%)</p>
                <p>Pref ensemble ≈ {batch.compositePref?.toFixed(2)}</p>
                <p>Alt ensemble ≈ {batch.compositeAlt?.toFixed(2)}</p>
                <p>
                  valid {batch.nValid} / {batch.nSelected} · err ±{batch.peTotalPct?.toFixed(2)}%
                </p>
                {batch.telemetry && (
                  <p className="text-[10px] text-muted-foreground">
                    AM/TM/WM/HR {batch.telemetry.AM_pref.toFixed(1)}/
                    {batch.telemetry.TM_pref.toFixed(1)}/{batch.telemetry.WM_pref.toFixed(1)}/
                    {batch.telemetry.HR_pref.toFixed(1)} · r̄=
                    {batch.telemetry.r_bar.toFixed(3)}
                  </p>
                )}
              </div>
            )}
          </section>

          <div className="space-y-3">
            <section className="overflow-hidden rounded-xl border border-cyan/40 bg-deepblue/70">
              <header className="border-b border-cyan/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-magenta">
                Per-image results
              </header>
              <div className="max-h-64 overflow-auto p-2">
                {rows.length === 0 ? (
                  <p className="p-3 font-mono text-[11px] text-muted-foreground">
                    No images processed yet.
                  </p>
                ) : (
                  <table className="w-full font-mono text-[10px] text-moon">
                    <thead className="text-cyan">
                      <tr className="text-left">
                        <th className="p-1">#</th>
                        <th className="p-1">File</th>
                        <th className="p-1">Status</th>
                        <th className="p-1">THE IQ</th>
                        <th className="p-1">ATTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.index} className="border-t border-cyan/10">
                          <td className="p-1">{row.index + 1}</td>
                          <td className="max-w-[10rem] truncate p-1">{row.name}</td>
                          <td className="p-1">
                            {row.skipped ? (
                              <span className="text-amber">SKIP</span>
                            ) : (
                              <span className="text-mint">OK</span>
                            )}
                          </td>
                          <td className="p-1">
                            {row.theIq === null ? "-" : row.theIq.toFixed(2)}
                          </td>
                          <td className="p-1">
                            {row.attr === null ? "-" : row.attr.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-cyan/40 bg-deepblue/70">
              <header className="border-b border-cyan/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-magenta">
                Engine log / report
              </header>
              <pre className="max-h-80 overflow-auto whitespace-pre-wrap p-3 font-mono text-[11px] leading-relaxed text-mint">
                {batch?.reportText || log.join("\n")}
              </pre>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
