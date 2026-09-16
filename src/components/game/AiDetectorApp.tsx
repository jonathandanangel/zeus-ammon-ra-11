import * as React from "react";
import { cn } from "@/lib/utils";
import { runAiDetectorEnsemble } from "@/game/ai-detector/ensemble";
import {
  DETECTORS,
  toneForBand,
  type DetectorId,
  type DetectorScanResult,
  type EnsembleConsensus,
} from "@/game/ai-detector/types";

type KeyMap = Partial<Record<DetectorId, string>>;

export function AiDetectorApp({ onMenu }: { onMenu: () => void }) {
  const [keys, setKeys] = React.useState<KeyMap>({});
  const [enabled, setEnabled] = React.useState<Record<DetectorId, boolean>>(() =>
    Object.fromEntries(DETECTORS.map((d) => [d.id, d.id === "wasitai" || d.id === "gptzero"])) as Record<
      DetectorId,
      boolean
    >,
  );
  const [content, setContent] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [status, setStatus] = React.useState(
    "Not guaranteed blank — paste text, enable detectors you have keys for, then multi-scan.",
  );
  const [results, setResults] = React.useState<DetectorScanResult[] | null>(null);
  const [consensus, setConsensus] = React.useState<EnsembleConsensus | null>(null);
  const [showInfo, setShowInfo] = React.useState(true);

  const field =
    "w-full rounded-sm border border-cyan/40 bg-deepblue/50 backdrop-blur-md px-3 py-2 font-mono text-xs text-moon outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30";
  const btn =
    "rounded-sm border border-cyan/50 bg-deepblue/50 backdrop-blur-md px-4 py-2 font-display text-xs uppercase tracking-[0.18em] text-cyan transition hover:bg-cyan/20 hover:text-moon disabled:opacity-40";

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const activeIds = DETECTORS.filter((d) => enabled[d.id]).map((d) => d.id);
  const readyIds = activeIds.filter((id) => (keys[id] ?? "").trim().length > 0);

  async function multiScan() {
    if (readyIds.length === 0) {
      setStatus("Enable at least one detector and paste its API key first.");
      return;
    }
    if (wordCount < 40) {
      setStatus("Paste ~50+ words. Short snippets are unreliable across detectors.");
      return;
    }
    setBusy(true);
    setResults(null);
    setConsensus(null);
    setStatus(`Running ${readyIds.length} detector(s) in parallel…`);
    try {
      const payloadKeys: KeyMap = {};
      for (const id of readyIds) payloadKeys[id] = keys[id]!.trim();
      const out = await runAiDetectorEnsemble({
        data: { content, keys: payloadKeys, enabled: readyIds },
      });
      setResults(out.results);
      setConsensus(out.consensus);
      const okN = out.results.filter((r) => r.ok).length;
      setStatus(
        okN === 0
          ? "All scans failed — check keys, credits, and network."
          : out.consensus.summary,
      );
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Multi-scan failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="extreme-shell relative mx-auto flex w-full max-w-6xl flex-col gap-4 px-2 py-4">
      <header className="zeus-outline-box overflow-hidden rounded-sm border border-cyan/55 bg-deepblue/50 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan/25 px-4 py-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-magenta">
              ZEUS AMMON-RA 11 · SYSTEM
            </p>
            <h1 className="mt-1 font-display text-xl uppercase tracking-[0.16em] text-cyan text-glow sm:text-2xl">
              AI DETECTOR BENCH
            </h1>
            <p className="mt-1 max-w-3xl font-mono text-[10px] leading-relaxed text-muted-foreground">
              Six remote detectors (WasItAI · GPTZero · Sapling · Winston · ZeroGPT · Originality).
              Keys stay in session memory only. Results are evidence, not proof.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btn} onClick={() => setShowInfo((v) => !v)}>
              {showInfo ? "Hide info" : "More info"}
            </button>
            <button
              type="button"
              onClick={onMenu}
              className="rounded-sm border border-amber/50 bg-deepblue/50 backdrop-blur-md px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-amber transition hover:bg-amber/15"
            >
              Main menu
            </button>
          </div>
        </div>
        {showInfo && (
          <div className="space-y-2 border-b border-cyan/20 px-4 py-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            <p className="text-amber">
              Will paste-and-scan always work? No. Each enabled detector needs a valid API key and
              credits from that vendor. Failed keys show per-row errors; consensus only uses
              successful scans.
            </p>
            <p>
              Sign up links live on each card. GPTZero:{" "}
              <a className="text-cyan underline" href="https://gptzero.me/" target="_blank" rel="noreferrer">
                gptzero.me
              </a>
              . WasItAI:{" "}
              <a
                className="text-cyan underline"
                href="https://wasitaigenerated.com/sign-up"
                target="_blank"
                rel="noreferrer"
              >
                wasitaigenerated.com
              </a>
              .
            </p>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className={cn(busy ? "text-amber" : "text-mint")}>{status}</span>
          <span className="text-muted-foreground">
            {wordCount} words · {readyIds.length}/{activeIds.length} keyed
          </span>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DETECTORS.map((d) => (
          <div
            key={d.id}
            className="zeus-outline-box space-y-2 rounded-sm border border-cyan/35 bg-deepblue/50 p-3 backdrop-blur-md"
          >
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={enabled[d.id]}
                onChange={(e) => setEnabled((prev) => ({ ...prev, [d.id]: e.target.checked }))}
              />
              <span>
                <span className="block font-display text-xs uppercase tracking-[0.14em] text-cyan">
                  {d.name}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                  {d.blurb}
                </span>
              </span>
            </label>
            <input
              type="password"
              className={field}
              disabled={!enabled[d.id]}
              value={keys[d.id] ?? ""}
              onChange={(e) => setKeys((prev) => ({ ...prev, [d.id]: e.target.value }))}
              placeholder={d.keyHint}
              autoComplete="off"
            />
            <a
              className="font-mono text-[10px] text-cyan/80 underline"
              href={d.signupUrl}
              target="_blank"
              rel="noreferrer"
            >
              Get key →
            </a>
          </div>
        ))}
      </section>

      <section className="zeus-outline-box space-y-3 rounded-sm border border-cyan/40 bg-deepblue/50 p-4 backdrop-blur-md">
        <textarea
          className={cn(field, "min-h-[200px] leading-relaxed")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste the passage to multi-scan (~50+ words). Ensemble runs only detectors you enabled and keyed."
        />
        <button
          type="button"
          className={cn(btn, "w-full py-3 sm:w-auto")}
          disabled={busy || readyIds.length === 0 || wordCount < 40}
          onClick={multiScan}
        >
          {busy ? "Scanning…" : `Multi-scan (${readyIds.length})`}
        </button>
      </section>

      {consensus && (
        <section className="zeus-outline-box space-y-3 rounded-sm border border-cyan/40 bg-deepblue/50 p-4 backdrop-blur-md">
          <h2 className="font-display text-sm uppercase tracking-[0.16em] text-cyan">Consensus</h2>
          <p className={cn("font-mono text-sm", toneForBand(bandFromConsensus(consensus)))}>
            {consensus.summary}
          </p>
          <div className="grid gap-2 sm:grid-cols-4">
            <Metric label="Avg AI %" value={consensus.avgAiScore.toFixed(1)} />
            <Metric label="Median AI %" value={consensus.medianAiScore.toFixed(1)} />
            <Metric label="Human votes" value={String(consensus.humanVotes)} className="text-mint" />
            <Metric label="AI votes" value={String(consensus.aiVotes)} className="text-[#ff4d6d]" />
          </div>
        </section>
      )}

      {results && (
        <section className="space-y-2">
          {results.map((r) => (
            <div
              key={r.id}
              className="zeus-outline-box rounded-sm border border-cyan/30 bg-deepblue/50 px-4 py-3 backdrop-blur-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-xs uppercase tracking-[0.14em] text-cyan">{r.name}</p>
                {r.ok ? (
                  <p className={cn("font-mono text-xs uppercase", toneForBand(r.band))}>
                    {r.label} · {r.aiScore.toFixed(1)}% AI
                  </p>
                ) : (
                  <p className="font-mono text-xs text-red-300">Failed</p>
                )}
              </div>
              {r.ok ? (
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {r.rawClass && `class=${r.rawClass} · `}
                  {r.detail || `confidence ${(r.confidence * 100).toFixed(0)}%`}
                </p>
              ) : (
                <p className="mt-1 font-mono text-[11px] text-red-300/90">{r.errorMessage}</p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function bandFromConsensus(c: EnsembleConsensus) {
  if (c.agreement === "strong_human" || c.agreement === "lean_human") return "human" as const;
  if (c.agreement === "strong_ai" || c.agreement === "lean_ai") return "likely_ai" as const;
  return "uncertain" as const;
}

function Metric({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-sm border border-cyan/25 bg-black/30 px-3 py-2">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-display text-sm text-cyan", className)}>{value}</p>
    </div>
  );
}
