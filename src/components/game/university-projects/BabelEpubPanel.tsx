import * as React from "react";
import {
  EquationBox,
  GhostButton,
  Metric,
  Panel,
} from "@/components/game/numerical-extreme/ui";
import {
  BABEL_INTEGRATED_SOURCES,
  OFFICIAL_BABEL,
  THE_BABEL_LIBRARY,
  formatBabelLibraryCompanionBlurb,
  formatEpubTranslateExample,
  seedsFromAllIntegratedSources,
} from "@/game/numerical-extreme";

/**
 * University Projects tab — vendored clcreuso/the-babel-library + all NUMEROLOGY sources.
 * Offline Codex EPUB pipeline; browser shows catalog, glossaries, and CLI examples.
 */
export function BabelEpubPanel() {
  const seeds = React.useMemo(() => seedsFromAllIntegratedSources(36), []);
  const [copied, setCopied] = React.useState(false);

  const example = formatEpubTranslateExample("BOOK.epub", "French");

  async function copyExample() {
    try {
      await navigator.clipboard.writeText(example);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <Panel
        title="The Babel Library · EPUB companion"
        eyebrow="University · vendored tools/the-babel-library · MIT · not Basile LoB"
      >
        <div className="space-y-3">
          <p className="rounded-sm border border-amber/35 bg-amber/10 px-3 py-2 font-mono text-[10px] leading-relaxed text-amber">
            {formatBabelLibraryCompanionBlurb()}
          </p>

          <div className="flex flex-wrap gap-2">
            <Metric label="Sources" value={String(BABEL_INTEGRATED_SOURCES.length)} />
            <Metric label="Local" value="tools/…" />
            <Metric label="License" value="MIT" />
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-[9px]">
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href={OFFICIAL_BABEL.epubCompanion}
              target="_blank"
              rel="noreferrer"
            >
              Upstream GitHub ↗
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href={THE_BABEL_LIBRARY.publicGuide}
              target="_blank"
              rel="noreferrer"
            >
              Local guide
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href={THE_BABEL_LIBRARY.publicGlossary}
              target="_blank"
              rel="noreferrer"
            >
              Master glossary
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href={OFFICIAL_BABEL.home}
              target="_blank"
              rel="noreferrer"
            >
              libraryofbabel.info
            </a>
          </div>

          <div className="rounded-sm border border-cyan/25 bg-black/40 px-3 py-2">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              CLI (Codex required · legal EPUBs only)
            </p>
            <pre className="whitespace-pre-wrap break-all font-mono text-[10px] text-moon/90">{example}</pre>
            <div className="mt-2">
              <GhostButton type="button" onClick={() => void copyExample()}>
                {copied ? "Copied" : "Copy command"}
              </GhostButton>
            </div>
          </div>

          <EquationBox label="Paths">
            {`Entry: ${THE_BABEL_LIBRARY.entry}\nGlossaries: ${THE_BABEL_LIBRARY.glossaryDir}\nBooks out: tools/the-babel-library/books/ (gitignored)`}
          </EquationBox>

          <EquationBox label="Demo translation (EN→FR · no Codex)">
            {`npm run babel:epub:demo\n→ /numerology/babel/epub-library/samples/zeus-babel-seed-fr.epub\nFull AI translate needs: codex login`}
          </EquationBox>

          <div className="flex flex-wrap gap-2 font-mono text-[9px]">
            <a
              className="text-amber underline-offset-2 hover:underline"
              href="/numerology/babel/epub-library/samples/zeus-babel-seed.epub"
            >
              EN seed EPUB
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              className="text-amber underline-offset-2 hover:underline"
              href="/numerology/babel/epub-library/samples/zeus-babel-seed-fr.epub"
            >
              FR translated EPUB
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href="/numerology/babel/epub-library/samples/zeus-babel-seed-fr.seeds.json"
              target="_blank"
              rel="noreferrer"
            >
              FR locate seeds JSON
            </a>
          </div>
        </div>
      </Panel>

      <Panel title="Integrated sources" eyebrow="Every NUMEROLOGY / Babel feed → glossary + locate">
        <ul className="space-y-2">
          {BABEL_INTEGRATED_SOURCES.map((src) => (
            <li
              key={src.id}
              className="rounded-sm border border-cyan/20 bg-black/40 px-3 py-2 font-mono text-[10px]"
            >
              <p className="uppercase tracking-[0.14em] text-magenta">{src.label}</p>
              <p className="mt-0.5 text-moon/85">{src.role}</p>
              <p className="mt-1 text-muted-foreground">
                {src.inAppVenue} · glossary{" "}
                <span className="text-cyan">{src.glossaryFile}</span>
              </p>
              <p className="mt-1 text-amber/90">{src.epubHint}</p>
              <p className="mt-1 text-[9px] text-moon/60">
                seeds: {src.seedTerms.join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Combined seed cloud" eyebrow="expandWithBabelGlossary across all sources">
        <p className="font-mono text-[10px] leading-relaxed text-moon/80">
          {seeds.join(" · ")}
        </p>
      </Panel>
    </div>
  );
}
