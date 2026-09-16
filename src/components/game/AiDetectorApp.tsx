import * as React from "react";
import { cn } from "@/lib/utils";
import { runAiDetectorEnsemble } from "@/game/ai-detector/ensemble";
import { FREE_DETECTORS, runFreeEnsemble } from "@/game/ai-detector/freeEnsemble";
import {
  DETECTORS,
  toneForBand,
  type DetectorId,
  type DetectorScanResult,
  type EnsembleConsensus,
} from "@/game/ai-detector/types";

type KeyMap = Partial<Record<DetectorId, string>>;
type Mode = "free" | "api";

export function AiDetectorApp({ onMenu }: { onMenu: () => void }) {
  const [mode, setMode] = React.useState<Mode>("free");
  const [keys, setKeys] = React.useState<KeyMap>({});
  const [enabled, setEnabled] = React.useState<Record<DetectorId, boolean>>(() =>
    Object.fromEntries(DETECTORS.map((d) => [d.id, false])) as Record<DetectorId, boolean>,
  );
  const [content, setContent] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [status, setStatus] = React.useState(
    "Free mode works without keys — GPTZero-style neural + stylometric stack. Paste ~50+ words.",
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

  async function runScan() {
    if (wordCount < 40) {
      setStatus("Paste ~50+ words. Short snippets are unreliable.");
      return;
    }
    setBusy(true);
    setResults(null);
    setConsensus(null);
    try {
      if (mode === "free") {
        setStatus("Free multi-scan starting…");
        const out = await runFreeEnsemble(content, setStatus);
        setResults(out.results);
        setConsensus(out.consensus);
        const okN = out.results.filter((r) => r.ok).length;
        setStatus(
          okN === 0
            ? "Free scanners failed — check network for first model downloads (OpenAI/HC3/ModernBERT)."
            : out.consensus.summary,
        );
      } else {
        if (readyIds.length === 0) {
          setStatus("API mode needs at least one enabled detector with a key — or use Free mode.");
          return;
        }
        setStatus(`Running ${readyIds.length} API detector(s)…`);
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
            ? "All API scans failed — check keys/credits, or use Free mode."
            : out.consensus.summary,
        );
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Scan failed.");
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
              Free mode: GPTZero-style perplexity+burstiness twin + 3 neural ONNX detectors +
              stylometrics — no keys. API mode: real GPTZero / WasItAI / Sapling / Winston / ZeroGPT /
              Originality when you have keys.
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
            <p className="text-mint">
              Free mode needs no API keys. First scan downloads open ONNX detectors into your browser
              cache (OpenAI RoBERTa, HC3, ModernBERT). Neural scores are weighted heavier than
              stylometrics — closer to how GPTZero leans on deep models over surface stats.
            </p>
            <p>
              Still evidence, not proof. Commercial GPTZero API (API mode) usually wins on newest
              LLMs if you have a key.
            </p>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className={cn(busy ? "text-amber" : "text-mint")}>{status}</span>
          <span className="text-muted-foreground">{wordCount} words</span>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2">
        {(
          [
            ["free", "Free (no keys)"],
            ["api", "API keys"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={cn(
              btn,
              mode === id && "border-cyan bg-cyan/20 text-moon shadow-[0_0_18px_rgba(34,211,238,0.25)]",
            )}
            onClick={() => {
              setMode(id);
              setResults(null);
              setConsensus(null);
              setStatus(
                id === "free"
                  ? "Free mode — paste text and multi-scan. No keys required."
                  : "API mode — enable detectors and paste vendor keys.",
              );
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {mode === "free" ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FREE_DETECTORS.map((d) => (
            <div
              key={d.id}
              className="zeus-outline-box rounded-sm border border-cyan/35 bg-deepblue/50 p-3 backdrop-blur-md"
            >
              <p className="font-display text-xs uppercase tracking-[0.14em] text-cyan">{d.name}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{d.blurb}</p>
            </div>
          ))}
        </section>
      ) : (
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
      )}

      <section className="zeus-outline-box space-y-3 rounded-sm border border-cyan/40 bg-deepblue/50 p-4 backdrop-blur-md">
        <textarea
          className={cn(field, "min-h-[200px] leading-relaxed")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste the passage (~50+ words). Free mode runs 6 local detectors with no keys."
        />
        <button
          type="button"
          className={cn(btn, "w-full py-3 sm:w-auto")}
          disabled={busy || wordCount < 40 || (mode === "api" && readyIds.length === 0)}
          onClick={runScan}
        >
          {busy
            ? "Scanning…"
            : mode === "free"
              ? "Free multi-scan (12 · GPTZero-style)"
              : `API multi-scan (${readyIds.length})`}
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
