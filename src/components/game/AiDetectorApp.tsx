import * as React from "react";
import { cn } from "@/lib/utils";
import { audio } from "@/game/audio";
import { finalizeApiWithPolarity, runAiDetectorEnsemble } from "@/game/ai-detector/ensemble";
import { FREE_DETECTORS, finalizeFreeWithPolarity, runFreeEnsemble } from "@/game/ai-detector/freeEnsemble";
import {
  estimateWritingIqClient,
  WRITING_IQ_DISCLAIMER,
  WRITING_IQ_SOURCE,
  type WritingIqResult,
} from "@/game/ai-detector/writingIq";
import {
  loadAiDetectorPolarity,
  saveAiDetectorPolarity,
  type AiDetectorPolarity,
} from "@/game/ai-detector/polarity";
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
  const [rawResults, setRawResults] = React.useState<DetectorScanResult[] | null>(null);
  const [results, setResults] = React.useState<DetectorScanResult[] | null>(null);
  const [consensus, setConsensus] = React.useState<EnsembleConsensus | null>(null);
  const [writingIq, setWritingIq] = React.useState<WritingIqResult | null>(null);
  const [showInfo, setShowInfo] = React.useState(true);
  const [polarity, setPolarity] = React.useState<AiDetectorPolarity>(() => loadAiDetectorPolarity());

  const field =
    "w-full rounded-sm border border-cyan/40 bg-deepblue/50 backdrop-blur-md px-3 py-2 font-mono text-xs text-moon outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30";
  const btn =
    "rounded-sm border border-cyan/50 bg-deepblue/50 backdrop-blur-md px-4 py-2 font-display text-xs uppercase tracking-[0.18em] text-cyan transition hover:bg-cyan/20 hover:text-moon disabled:opacity-40";

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const activeIds = DETECTORS.filter((d) => enabled[d.id]).map((d) => d.id);
  const readyIds = activeIds.filter((id) => (keys[id] ?? "").trim().length > 0);

  function applyPolarityView(
    raw: DetectorScanResult[],
    nextPolarity: AiDetectorPolarity,
    scanMode: Mode,
  ) {
    if (scanMode === "free") {
      const out = finalizeFreeWithPolarity(raw, nextPolarity);
      setResults(out.results);
      setConsensus(out.consensus);
      return out.consensus.summary;
    }
    const out = finalizeApiWithPolarity(raw, nextPolarity);
    setResults(out.results);
    setConsensus(out.consensus);
    return out.consensus.summary;
  }

  function togglePolarity() {
    const next: AiDetectorPolarity = polarity === "flipped" ? "standard" : "flipped";
    setPolarity(next);
    saveAiDetectorPolarity(next);
    if (rawResults?.length) {
      const summary = applyPolarityView(rawResults, next, mode);
      setStatus(
        next === "flipped"
          ? `Polarity FLIPPED (100−AI%) · ${summary}`
          : `Polarity STANDARD · ${summary}`,
      );
    } else {
      setStatus(
        next === "flipped"
          ? "Polarity FLIPPED — high AI% ↔ human swapped until you flip back."
          : "Polarity STANDARD — high AI% means AI.",
      );
    }
  }

  async function runScan() {
    if (wordCount < 40) {
      setStatus("Paste ~50+ words. Short snippets are unreliable.");
      return;
    }
    // Coin flip on free multi-scan press only — detection math unchanged.
    if (mode === "free") {
      audio.init();
      audio.resume();
      audio.play("detect-coin");
    }
    setBusy(true);
    setResults(null);
    setConsensus(null);
    setRawResults(null);
    setWritingIq(null);
    try {
      const iqJob =
        wordCount >= 50
          ? estimateWritingIqClient(content)
          : Promise.resolve(null);

      if (mode === "free") {
        setStatus("Free multi-scan + Writing to IQ…");
        const [out, iq] = await Promise.all([
          runFreeEnsemble(content, setStatus, { polarity }),
          iqJob,
        ]);
        setRawResults(out.rawResults);
        setResults(out.results);
        setConsensus(out.consensus);
        setWritingIq(iq);
        const okN = out.results.filter((r) => r.ok).length;
        setStatus(
          okN === 0
            ? "Free scanners failed — check network for first model downloads (OpenAI/HC3/ModernBERT)."
            : out.consensus.summary,
        );
        audio.play("detect-bing");
      } else {
        if (readyIds.length === 0) {
          setStatus("API mode needs at least one enabled detector with a key — or use Free mode.");
          return;
        }
        setStatus(`Running ${readyIds.length} API detector(s) + Writing to IQ…`);
        const payloadKeys: KeyMap = {};
        for (const id of readyIds) payloadKeys[id] = keys[id]!.trim();
        const [out, iq] = await Promise.all([
          runAiDetectorEnsemble({
            data: { content, keys: payloadKeys, enabled: readyIds },
          }),
          iqJob,
        ]);
        setRawResults(out.results);
        const polarized = finalizeApiWithPolarity(out.results, polarity);
        setResults(polarized.results);
        setConsensus(polarized.consensus);
        setWritingIq(iq);
        const okN = polarized.results.filter((r) => r.ok).length;
        setStatus(
          okN === 0
            ? "All API scans failed — check keys/credits, or use Free mode."
            : polarized.consensus.summary,
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
            <p className="mt-2 max-w-3xl font-mono text-[12px] leading-relaxed text-moon">
              Tired of people calling everything AI generated? Tired of if it sounds deep or complex
              it must be AI? Don&apos;t worry I am also worried about this and have a solution!
            </p>
            <p className="mt-2 max-w-3xl font-mono text-[10px] leading-relaxed text-muted-foreground">
              Custom weight to certain detectors (biased) and used math models (log-odds / softmax
              fusion, confidence gates, ModernBERT-first rules) to reach high efficiency. Free mode:
              GPTZero-style twin + ONNX neural detectors + stylometrics — no keys. API mode: GPTZero /
              WasItAI / Sapling / Winston / ZeroGPT / Originality when you have keys. Every scan also
              calls Writing to IQ (
              <a
                className="text-cyan underline"
                href={WRITING_IQ_SOURCE.siteUrl}
                target="_blank"
                rel="noreferrer"
              >
                {WRITING_IQ_SOURCE.siteUrl}
              </a>
              , no key).
            </p>
            <p className="mt-2 max-w-3xl font-mono text-[11px] font-bold leading-relaxed text-amber">
              {WRITING_IQ_DISCLAIMER}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={cn(
                btn,
                polarity === "flipped"
                  ? "border-amber bg-amber/20 text-amber shadow-[0_0_18px_rgba(251,191,36,0.28)]"
                  : "border-mint/50 text-mint",
              )}
              onClick={togglePolarity}
              title="If human reads as AI (or reverse), flip polarity instantly — same detectors, inverted AI%."
            >
              Polarity · {polarity === "flipped" ? "FLIPPED" : "STANDARD"}
            </button>
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
              Custom weight biased toward ModernBERT leads, with a higher-order lead composite
              (generalizes patterns like ModernBERT ≫ story without exact percents) plus log-odds
              softmax + product-of-experts fusion. Full free suite still votes; soft stylometrics
              stay low-weight. Library of Babel polish uses this same Free ensemble silently.
            </p>
            <p>
              Free mode needs no API keys. First scan downloads open ONNX detectors into your browser
              cache (OpenAI RoBERTa, HC3, ModernBERT). Still evidence, not proof — commercial GPTZero
              API (API mode) usually wins on newest LLMs if you have a key.
            </p>
            <p className="text-amber/90">
              Polarity switch: if human writing reads as AI (or the reverse), tap{" "}
              <span className="text-amber">Polarity · FLIPPED/STANDARD</span> — same detectors and
              fusion, every AI% becomes 100−AI% and consensus rebuilds instantly. Default is FLIPPED
              after the last inversion bug. Babel polish uses the same saved polarity.
            </p>
            <p className="text-amber/90">
              Notes / security: text is scored in your browser for Free mode (models cached locally
              after first download). API mode sends paste content only to the vendors you enable and
              key — keys stay in this session&apos;s memory, not committed to the repo. Do not paste
              secrets, passwords, or private credentials into the box. Results are heuristic, not a
              legal or academic verdict.
            </p>
            <p className="text-muted-foreground">
              Free multi-scan plays a coin-flip SFX on press and a bing when the suite finishes —
              scoring path unchanged.
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
              setRawResults(null);
              setWritingIq(null);
              setStatus(
                id === "free"
                  ? "Free mode — paste text and multi-scan. Writing to IQ runs with every scan."
                  : "API mode — enable detectors and paste vendor keys. Writing to IQ still runs (no key).",
              );
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {mode === "free" ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="zeus-outline-box rounded-sm border border-amber/40 bg-deepblue/50 p-3 backdrop-blur-md">
            <p className="font-display text-xs uppercase tracking-[0.14em] text-amber">
              {WRITING_IQ_SOURCE.name}
            </p>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              {WRITING_IQ_SOURCE.about}
            </p>
            <a
              className="mt-2 inline-block font-mono text-[10px] text-cyan underline"
              href={WRITING_IQ_SOURCE.siteUrl}
              target="_blank"
              rel="noreferrer"
            >
              Source: {WRITING_IQ_SOURCE.siteUrl}
            </a>
            <p className="mt-1 break-all font-mono text-[9px] text-muted-foreground">
              Endpoint: {WRITING_IQ_SOURCE.endpointUrl}
            </p>
          </div>
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

      {writingIq && (
        <section className="zeus-outline-box space-y-2 rounded-sm border border-amber/45 bg-deepblue/50 p-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-sm uppercase tracking-[0.16em] text-amber">
              {WRITING_IQ_SOURCE.name}
            </h2>
            <a
              className="font-mono text-[10px] text-cyan underline"
              href={writingIq.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Source →
            </a>
          </div>
          {writingIq.ok && writingIq.iq != null ? (
            <>
              <p className="font-display text-3xl tracking-[0.08em] text-moon">{writingIq.iq}</p>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-amber">
                {writingIq.bandLabel}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">
                {writingIq.resultText}. Vocabulary-based estimate for curiosity — not a
                standardized IQ test, and not part of the AI consensus vote.
              </p>
              <p className="font-mono text-[11px] font-bold text-amber">
                {WRITING_IQ_DISCLAIMER}
              </p>
            </>
          ) : (
            <p className="font-mono text-[11px] text-red-300/90">
              {writingIq.errorMessage || "Could not estimate IQ from this sample."}
            </p>
          )}
          <p className="font-mono text-[9px] leading-relaxed text-muted-foreground">
            Source:{" "}
            <a className="text-cyan underline" href={writingIq.sourceUrl} target="_blank" rel="noreferrer">
              {writingIq.sourceUrl}
            </a>
            <br />
            API:{" "}
            <span className="break-all text-moon/80">{writingIq.endpointUrl}</span>
          </p>
        </section>
      )}

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
