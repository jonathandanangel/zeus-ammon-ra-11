import * as React from "react";

const CREATOR_LINKS = [
  {
    label: "Instagram",
    handle: "@wozkafpidge",
    href: "https://www.instagram.com/wozkafpidge/",
  },
  {
    label: "LinkedIn",
    handle: "Jonathan Angel",
    href: "https://www.linkedin.com/in/jonathan-angel-72a837207/",
  },
] as const;

export function AboutCreatorPanel({ onBack }: { onBack: () => void }) {
  return (
    <div className="panel mx-auto w-full max-w-xl space-y-5 p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-xl text-cyan text-glow">ABOUT CREATOR</h1>
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-border px-3 py-1 font-mono text-xs"
        >
          Back
        </button>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-magenta">
          ZEUS AMMON-RA 11 · WOZKAF
        </p>
        <h2 className="font-display text-2xl tracking-[0.08em] text-moon">Jonathan Angel</h2>
        <p className="font-mono text-sm leading-relaxed text-muted-foreground">
          Student builder of this neon trivia / labs / Legend of Triangles project.
        </p>
      </div>

      <ul className="space-y-3">
        {CREATOR_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-sm border border-cyan/40 bg-deepblue/50 px-4 py-3 font-mono text-sm text-cyan transition hover:border-cyan hover:bg-cyan/15 hover:text-moon"
            >
              <span className="uppercase tracking-[0.16em]">{link.label}</span>
              <span className="text-xs text-muted-foreground normal-case tracking-normal">
                {link.handle} ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
