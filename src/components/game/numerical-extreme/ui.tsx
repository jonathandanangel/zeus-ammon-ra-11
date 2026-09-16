import * as React from "react";
import { audio } from "@/game/audio";
import { formatNumber } from "@/game/numerical-extreme";
import { cn } from "@/lib/utils";

/** Fired by RunButton so the shell can play the Enoch-Ra brain flourish. */
export const NumericalComputeContext = React.createContext<() => void>(() => {});

const controlClass =
  "w-full rounded-sm border border-cyan/40 bg-deepblue/80 px-3 py-2 font-mono text-xs text-moon outline-none transition placeholder:text-muted-foreground hover:border-cyan/60 focus:border-cyan focus:ring-1 focus:ring-cyan/30";

/** Monospace equation / telemetry box — matches MAIN / ALGORITHMS engine logs. */
export function EquationBox({
  label,
  children,
  className,
}: {
  label?: string;
  children: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
      )}
      <pre className="max-h-56 overflow-auto rounded-sm border border-cyan/20 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-mint whitespace-pre-wrap break-all">
        {children}
      </pre>
    </div>
  );
}

export function Panel({
  title,
  eyebrow,
  action,
  children,
  className,
}: {
  title?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "nx-panel zeus-outline-box overflow-hidden rounded-sm border border-cyan/40 bg-deepblue/70",
        className,
      )}
    >
      {(title || eyebrow || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-cyan/25 px-4 py-3">
          <div>
            {eyebrow && (
              <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-magenta">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-sm uppercase tracking-[0.14em] text-cyan">
                {title}
              </h2>
            )}
          </div>
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
        {hint && <span className="normal-case tracking-normal text-amber/80">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function NumberInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number"
      className={cn(controlClass, "tabular-nums", className)}
      {...props}
    />
  );
}

function isAllowedNumericDraft(raw: string): boolean {
  if (raw === "" || raw === "-" || raw === "+" || raw === "." || raw === "-." || raw === "+.") {
    return true;
  }
  return /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(raw);
}

function isCompleteNumeric(raw: string): boolean {
  if (raw === "" || raw === "-" || raw === "+" || raw === "." || raw === "-." || raw === "+.") {
    return false;
  }
  return Number.isFinite(Number(raw));
}

function clampNumber(value: number, min?: number | string, max?: number | string): number {
  let next = value;
  const minN = min === undefined ? undefined : Number(min);
  const maxN = max === undefined ? undefined : Number(max);
  if (minN !== undefined && Number.isFinite(minN)) next = Math.max(minN, next);
  if (maxN !== undefined && Number.isFinite(maxN)) next = Math.min(maxN, next);
  return next;
}

/** Numeric field that keeps “-”, “.”, etc. visible while typing (no snap to 0). */
export function BoundNumberInput({
  value,
  onChange,
  className,
  min,
  max,
  onBlur,
  onFocus,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> & {
  value: number;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = React.useState(() => String(value));
  const focusedRef = React.useRef(false);

  React.useEffect(() => {
    if (focusedRef.current) return;
    setDraft(String(value));
  }, [value]);

  const commit = React.useCallback(
    (raw: string) => {
      if (isCompleteNumeric(raw)) {
        const next = clampNumber(Number(raw), min, max);
        onChange(next);
        setDraft(String(next));
        return;
      }
      const fallback = clampNumber(value, min, max);
      onChange(fallback);
      setDraft(String(fallback));
    },
    [max, min, onChange, value],
  );

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      min={min}
      max={max}
      className={cn(controlClass, "tabular-nums", className)}
      value={draft}
      onFocus={(event) => {
        focusedRef.current = true;
        onFocus?.(event);
      }}
      onBlur={(event) => {
        focusedRef.current = false;
        commit(draft);
        onBlur?.(event);
      }}
      onChange={(event) => {
        const raw = event.target.value;
        if (!isAllowedNumericDraft(raw)) return;
        setDraft(raw);
        if (isCompleteNumeric(raw)) {
          onChange(clampNumber(Number(raw), min, max));
        }
      }}
    />
  );
}

/** Optional numeric text (empty allowed) — for secant seeds and similar graph picks. */
export function DraftNumberInput({
  value,
  onChange,
  className,
  onBlur,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> & {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      className={cn(controlClass, "tabular-nums", className)}
      value={value}
      onChange={(event) => {
        const raw = event.target.value;
        if (raw === "" || isAllowedNumericDraft(raw)) onChange(raw);
      }}
      onBlur={(event) => {
        if (value === "-" || value === "+" || value === "." || value === "-." || value === "+.") {
          onChange("");
        } else if (isCompleteNumeric(value)) {
          onChange(String(Number(value)));
        }
        onBlur?.(event);
      }}
    />
  );
}

/** Shared graph interval [a, b] — negative bounds and mid-entry “-” supported. */
export function GraphBoundsFields({
  a,
  b,
  onAChange,
  onBChange,
  aLabel = "A",
  bLabel = "B",
}: {
  a: number;
  b: number;
  onAChange: (value: number) => void;
  onBChange: (value: number) => void;
  aLabel?: string;
  bLabel?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Field label={aLabel}>
        <BoundNumberInput value={a} onChange={onAChange} />
      </Field>
      <Field label={bLabel}>
        <BoundNumberInput value={b} onChange={onBChange} />
      </Field>
    </div>
  );
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(controlClass, "min-h-24 resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(controlClass, "appearance-none", className)} {...props} />;
}

export function RunButton({
  loading,
  children = "Run analysis",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
}) {
  const onCompute = React.useContext(NumericalComputeContext);
  return (
    <button
      {...props}
      onClick={(event) => {
        audio.play("numeric-run");
        onCompute();
        props.onClick?.(event);
      }}
      onMouseEnter={(event) => {
        audio.play("hover");
        props.onMouseEnter?.(event);
      }}
      type={props.type ?? "submit"}
      disabled={loading || props.disabled}
      className={cn(
        "nx-run flex w-full items-center justify-center gap-2 rounded-sm border border-cyan/60 bg-cyan/20 px-4 py-2.5 font-display text-xs uppercase tracking-[0.2em] text-cyan shadow-[0_0_24px_rgba(34,211,238,0.18)] transition hover:bg-cyan/30 hover:text-moon disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {loading ? "Computing…" : children}
    </button>
  );
}

export function GhostButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm border border-cyan/30 bg-deepblue/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-moon/80 transition hover:border-amber/50 hover:text-amber disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Metric({
  label,
  value,
  detail,
  accent = "cyan",
}: {
  label: string;
  value: string | number | null | undefined;
  detail?: string;
  accent?: "cyan" | "magenta" | "amber" | "moon";
}) {
  const colors = {
    cyan: "border-cyan/30 from-cyan/15 text-cyan",
    magenta: "border-magenta/30 from-magenta/15 text-magenta",
    amber: "border-amber/30 from-amber/15 text-amber",
    moon: "border-moon/20 from-moon/10 text-moon",
  };
  const display = typeof value === "number" ? formatNumber(value) : (value ?? "—");
  return (
    <div
      className={cn(
        "nx-metric rounded-sm border bg-gradient-to-br to-transparent p-3",
        colors[accent],
      )}
    >
      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 font-mono text-base font-semibold tabular-nums">{display}</p>
      {detail && <p className="mt-1 font-mono text-[10px] text-muted-foreground">{detail}</p>}
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  React.useEffect(() => {
    if (message) audio.play("numeric-error");
  }, [message]);
  return (
    <div className="nx-error rounded-sm border border-magenta/40 bg-magenta/10 px-3 py-2.5 font-mono text-xs text-magenta">
      {message}
    </div>
  );
}
