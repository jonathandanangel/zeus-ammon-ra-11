import * as React from "react";
import { cn } from "@/lib/utils";
import {
  UPDATES_COMMIT_COUNT,
  UPDATES_GENERATED_AT,
  UPDATES_LOG,
  UPDATES_MIRROR_REPO,
  UPDATES_REPO,
  type UpdateEntry,
  type UpdateKind,
} from "@/data/updates-log";

type Filter = "all" | UpdateKind;

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function kindLabel(kind: UpdateKind): string {
  return kind === "human" ? "Human" : "AI-assisted";
}

function UpdateCard({ entry }: { entry: UpdateEntry }) {
  const [open, setOpen] = React.useState(false);
  const body = entry.body.trim();
  const showBody = open && body.length > 0;

  return (
    <article className="rounded-md border border-border bg-deepblue/60 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {formatWhen(entry.date)} · {entry.short}
          </p>
          <h2 className="mt-1 text-sm text-moon">{entry.subject}</h2>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            {entry.author}
            {entry.fileCount > 0
              ? ` · ${entry.fileCount} file${entry.fileCount === 1 ? "" : "s"} · +${entry.additions}/−${entry.deletions}`
              : ""}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
            entry.kind === "human"
              ? "border-mint/50 text-mint"
              : "border-magenta/50 text-magenta",
          )}
        >
          {kindLabel(entry.kind)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {body.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-sm border border-cyan/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan hover:bg-cyan/15"
          >
            {open ? "Hide notes" : "Notes"}
          </button>
        )}
        <a
          href={entry.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-sm border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-moon/80 hover:border-cyan/50 hover:text-cyan"
        >
          GitHub
        </a>
      </div>

      {showBody && (
        <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-sm border border-border/60 bg-black/30 p-2 font-mono text-[11px] leading-relaxed text-moon/85">
          {body}
        </pre>
      )}

      {open && entry.files.length > 0 && (
        <ul className="mt-2 max-h-40 space-y-1 overflow-auto font-mono text-[10px] text-muted-foreground">
          {entry.files.map((f) => (
            <li key={f.path} className="flex justify-between gap-3">
              <span className="truncate">{f.path}</span>
              <span className="shrink-0 text-mint/80">
                +{f.additions}/−{f.deletions}
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function UpdatesPanel({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return UPDATES_LOG.filter((e) => {
      if (filter !== "all" && e.kind !== filter) return false;
      if (!q) return true;
      const blob = `${e.subject}\n${e.body}\n${e.author}\n${e.short}`.toLowerCase();
      return blob.includes(q);
    });
  }, [filter, query]);

  const humanN = UPDATES_LOG.filter((e) => e.kind === "human").length;
  const aiN = UPDATES_LOG.length - humanN;

  return (
    <div className="panel mx-auto w-full max-w-3xl space-y-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-cyan text-glow">UPDATES</h1>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            {UPDATES_COMMIT_COUNT} commits · generated {formatWhen(UPDATES_GENERATED_AT)}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-border px-3 py-1 font-mono text-xs"
        >
          Back
        </button>
      </div>

      <p className="font-mono text-xs leading-relaxed text-moon/80">
        Full project history from git — subjects, notes, and file stats. Tags mark human vs
        AI-assisted commits (co-author / bot signals). Mirror:{" "}
        <a
          href={UPDATES_MIRROR_REPO}
          target="_blank"
          rel="noreferrer"
          className="text-cyan underline-offset-2 hover:underline"
        >
          zeus-ammon-ra-11
        </a>
        {" · "}
        <a
          href={UPDATES_REPO}
          target="_blank"
          rel="noreferrer"
          className="text-cyan underline-offset-2 hover:underline"
        >
          aero-flight-trivia
        </a>
        .
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["all", `All (${UPDATES_LOG.length})`],
            ["human", `Human (${humanN})`],
            ["ai-assisted", `AI-assisted (${aiN})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition",
              filter === id
                ? "border-cyan bg-cyan/15 text-cyan"
                : "border-border text-muted-foreground hover:border-cyan/40 hover:text-cyan",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search subjects, notes, authors…"
        className="w-full rounded-sm border border-cyan/40 bg-deepblue/50 px-3 py-2 font-mono text-xs text-moon outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30"
      />

      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Showing {filtered.length}
      </p>

      <div className="max-h-[min(70vh,720px)] space-y-3 overflow-y-auto pr-1">
        {filtered.map((entry) => (
          <UpdateCard key={entry.hash} entry={entry} />
        ))}
        {filtered.length === 0 && (
          <p className="rounded-md border border-border bg-deepblue/40 p-4 font-mono text-xs text-muted-foreground">
            No commits match this filter.
          </p>
        )}
      </div>
    </div>
  );
}
