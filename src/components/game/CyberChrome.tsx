import * as React from "react";
import { cn } from "@/lib/utils";
import { CYBER_TOAST_CREDIT, getCyberToast } from "@/lib/cyber-toast";

/**
 * Global cyber-toast-js chrome layered on ZEUS branding:
 * perspective grid + CRT RGB noise veil (pointer-events none).
 */
export function CyberChrome({
  reducedMotion = false,
  className,
}: {
  reducedMotion?: boolean;
  className?: string;
}) {
  React.useEffect(() => {
    getCyberToast();
  }, []);

  return (
    <div
      className={cn("cyber-chrome pointer-events-none fixed inset-0 z-[5]", className)}
      aria-hidden
      data-reduced={reducedMotion ? "1" : "0"}
    >
      <div className="cyber-chrome-grid" />
      <div className="cyber-chrome-rgb" />
      {!reducedMotion && <div className="cyber-chrome-scan" />}
    </div>
  );
}

/** Tiny credit chip — optional footer / settings note. */
export function CyberToastCredit({ className }: { className?: string }) {
  return (
    <p className={cn("font-mono text-[9px] uppercase tracking-[0.18em] text-cyan/55", className)}>
      {CYBER_TOAST_CREDIT}
    </p>
  );
}
