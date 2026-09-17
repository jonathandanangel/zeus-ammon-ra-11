import * as React from "react";
import { cn } from "@/lib/utils";
import {
  loadAiDetectorPolarity,
  saveAiDetectorPolarity,
  subscribeAiDetectorPolarity,
  type AiDetectorPolarity,
} from "@/game/ai-detector/polarity";

/**
 * User-facing polarity control — AI Detector and Babel share one setting.
 */
export function PolaritySwitch({
  polarity: controlled,
  onPolarityChange,
  className,
  compact,
}: {
  polarity?: AiDetectorPolarity;
  onPolarityChange?: (next: AiDetectorPolarity) => void;
  className?: string;
  compact?: boolean;
}) {
  const [polarity, setPolarity] = React.useState<AiDetectorPolarity>(
    () => controlled ?? loadAiDetectorPolarity(),
  );

  React.useEffect(() => {
    if (controlled) setPolarity(controlled);
  }, [controlled]);

  React.useEffect(() => {
    return subscribeAiDetectorPolarity((p) => {
      setPolarity(p);
      onPolarityChange?.(p);
    });
  }, [onPolarityChange]);

  function setMode(next: AiDetectorPolarity) {
    setPolarity(next);
    saveAiDetectorPolarity(next);
    onPolarityChange?.(next);
  }

  const btn =
    "rounded-sm border bg-deepblue/50 backdrop-blur-md px-4 py-2 font-display text-xs uppercase tracking-[0.18em] transition disabled:opacity-40";

  return (
    <section
      className={cn(
        "zeus-outline-box space-y-3 rounded-sm border border-amber/45 bg-deepblue/55 p-4 backdrop-blur-md shadow-[0_0_24px_rgba(251,191,36,0.12)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber">
            Polarity switch
          </p>
          {!compact && (
            <p className="mt-1 max-w-2xl font-mono text-[11px] leading-relaxed text-muted-foreground">
              If human writing shows as AI (or AI as human), flip here. Same detectors — every AI%
              becomes 100−AI% and consensus rebuilds. Applies to{" "}
              <span className="text-cyan">AI Detector</span> and{" "}
              <span className="text-cyan">Library of Babel</span> polish together.
            </p>
          )}
        </div>
        <span
          className={cn(
            "rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em]",
            polarity === "flipped"
              ? "border-amber/60 bg-amber/15 text-amber"
              : "border-mint/60 bg-mint/10 text-mint",
          )}
        >
          {polarity === "flipped" ? "Flipped · 100−AI%" : "Standard · high%=AI"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={cn(
            btn,
            polarity === "standard"
              ? "border-mint bg-mint/20 text-mint shadow-[0_0_16px_rgba(52,211,153,0.22)]"
              : "border-cyan/40 text-cyan hover:bg-cyan/15",
          )}
          onClick={() => setMode("standard")}
        >
          Standard
        </button>
        <button
          type="button"
          className={cn(
            btn,
            polarity === "flipped"
              ? "border-amber bg-amber/20 text-amber shadow-[0_0_16px_rgba(251,191,36,0.28)]"
              : "border-cyan/40 text-cyan hover:bg-cyan/15",
          )}
          onClick={() => setMode("flipped")}
        >
          Flipped
        </button>
      </div>
    </section>
  );
}
