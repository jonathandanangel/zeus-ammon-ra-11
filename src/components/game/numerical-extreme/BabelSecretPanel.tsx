import * as React from "react";
import {
  EquationBox,
  GhostButton,
  Metric,
  Panel,
  RunButton,
} from "@/components/game/numerical-extreme/ui";
import {
  BABEL_ARTWORK,
  OFFICIAL_BABEL,
  downloadDataUrl,
  formatBabelFindReport,
  generateBabelBooks,
  locateBabelImages,
  searchBabelSecrets,
  type BabelGeneratedBook,
  type BabelLibraryReport,
  type BabelLocatedImage,
  type BabelSecretFind,
  type GreekMythPassage,
  type JohnsonSense,
  type NumerologyResult,
  type RuckmanVerse,
  type SecretDoctrinePassage,
} from "@/game/numerical-extreme";
import { downloadJson } from "@/game/numerical-extreme";

/** Amber highlight — same convention as Greek Myths / Secret Doctrine panels. */
function highlightAmber(text: string, matched: string[]): React.ReactNode {
  if (!matched.length) return text;
  const unique = [...new Set(matched.map((m) => m.toLowerCase()).filter(Boolean))].sort(
    (a, b) => b.length - a.length,
  );
  if (!unique.length) return text;
  const pattern = new RegExp(
    `\\b(${unique.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
    "gi",
  );
  const parts = text.split(pattern);
  return parts.map((part, index) =>
    unique.some((m) => m.toLowerCase() === part.toLowerCase()) ? (
      <span
        key={`${part}-${index}`}
        className="rounded-sm bg-amber/25 px-0.5 font-semibold text-amber"
      >
        {part}
      </span>
    ) : (
      <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
    ),
  );
}

function kindLabel(kind: string): string {
  const map: Record<string, string> = {
    keyword: "KEYWORD",
    anagram: "ANAGRAM / SCRAMBLE",
    path: "PATH",
    "thought-form": "THOUGHT-FORMS",
    johnson: "JOHNSON",
    "johnson-expansion": "JOHNSON EXP.",
    "secret-doctrine": "BLAVATSKY",
    "greek-myth": "GREEK MYTH",
    ruckman: "KJV",
    philosophy: "PHILOSOPHY",
    tarot: "TAROT",
    synthesis: "SYNTHESIS",
  };
  return map[kind] ?? kind.toUpperCase();
}

function FindCard({ find }: { find: BabelSecretFind }) {
  const preview = find.page.lines.slice(0, 10).join("\n");
  return (
    <article
      className="overflow-hidden rounded-sm border border-cyan/25 bg-black/45"
      style={{ boxShadow: `inset 0 0 40px ${find.colorHex}14` }}
    >
      <header className="flex flex-wrap items-start justify-between gap-2 border-b border-cyan/20 px-3 py-2">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-magenta">
            {kindLabel(find.query.kind)}
          </p>
          <p className="font-mono text-[12px] text-cyan">{find.query.label}</p>
          <p className="mt-0.5 font-mono text-[9px] text-muted-foreground">
            {find.page.location.address}
          </p>
        </div>
        <a
          href={find.page.location.officialSearchUrl}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[9px] uppercase tracking-[0.12em] text-amber underline-offset-2 hover:underline"
        >
          Official search ↗
        </a>
      </header>
      <p className="border-b border-cyan/10 px-3 py-1.5 font-mono text-[9px] leading-relaxed text-moon/80">
        {find.query.note}
      </p>
      {(find.page.matchReasons.length > 0 || find.page.matched.length > 0) && (
        <p className="border-b border-amber/20 bg-amber/5 px-3 py-1.5 font-mono text-[8px] text-amber">
          {[...find.page.matchReasons].slice(0, 4).join(" · ")}
          {find.page.matched.length > 0 && (
            <span className="text-muted-foreground">
              {" "}
              · match {find.page.matched.slice(0, 8).join(", ")}
            </span>
          )}
        </p>
      )}
      <pre className="max-h-56 overflow-auto px-3 py-2 font-mono text-[10px] leading-relaxed text-mint/90 whitespace-pre-wrap break-all">
        {highlightAmber(preview, find.page.matched)}
      </pre>
    </article>
  );
}

function BookReader({
  book,
  pageIdx,
  onPage,
  images,
}: {
  book: BabelGeneratedBook;
  pageIdx: number;
  onPage: (n: number) => void;
  images: BabelLocatedImage[];
}) {
  const leaf = book.pages[pageIdx] ?? book.pages[0];
  if (!leaf) return null;
  const body = leaf.page.lines.join("\n");
  const { info } = book;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)]">
        <figure className="overflow-hidden rounded-sm border border-amber/35 bg-black/50">
          <img
            src={images.find((i) => i.style === "folio")?.dataUrl || book.coverArt.src}
            alt={book.coverArt.title}
            className="h-48 w-full object-cover sm:h-full sm:min-h-[200px]"
            loading="lazy"
          />
          <figcaption className="px-2 py-1.5 font-mono text-[8px] leading-snug text-muted-foreground">
            {images.find((i) => i.style === "folio")
              ? "Located folio cover · path seed"
              : `${book.coverArt.artist} · ${book.coverArt.year}`}
          </figcaption>
        </figure>
        <div className="space-y-2">
          <p className="font-display text-sm uppercase tracking-[0.12em] text-cyan">{book.title}</p>
          <p className="font-mono text-[10px] text-amber">{book.subtitle}</p>
          <p className="font-mono text-[10px] leading-relaxed text-moon/85">{book.blurb}</p>
          <p className="font-mono text-[9px] text-magenta">
            Combination · {book.combination.slice(0, 8).join(" · ")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Metric label="Pages" value={String(book.pages.length)} />
            <Metric label="Path" value={String(book.pathNumber)} />
            <Metric label="Ray" value={book.colorName} />
            <Metric label="Year" value={String(info.imprintYear)} />
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-cyan/25 bg-black/40 px-3 py-2.5 font-mono text-[10px] leading-relaxed text-moon/90">
        <p className="mb-1 text-[9px] uppercase tracking-[0.16em] text-magenta">Book information</p>
        <p>
          <span className="text-cyan">Call no.</span> {info.callNumber}
        </p>
        <p>
          <span className="text-cyan">Location</span> {info.hexagon} · wall {info.wall} · shelf{" "}
          {info.shelf} · vol {info.volume}
        </p>
        <p>
          <span className="text-cyan">Publisher</span> {info.publisher} · {info.imprintYear}
        </p>
        <p>
          <span className="text-cyan">ISBN-like</span> {info.isbnLike}
        </p>
        <p>
          <span className="text-cyan">Language</span> {info.language}
        </p>
        <p>
          <span className="text-cyan">Subjects</span> {info.subjects.join(" · ")}
        </p>
        <p className="mt-1 italic text-amber/90">{info.dedication}</p>
        <p className="mt-2 text-[9px] text-muted-foreground">
          Contents: {info.contents.join(" · ")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[9px]">
          <a
            className="text-amber underline-offset-2 hover:underline"
            href={info.officialSearchUrl}
            target="_blank"
            rel="noreferrer"
          >
            libraryofbabel.info search ↗
          </a>
          <a
            className="text-amber underline-offset-2 hover:underline"
            href={info.babeliaUrl}
            target="_blank"
            rel="noreferrer"
          >
            babelia images ↗
          </a>
          <a
            className="text-amber underline-offset-2 hover:underline"
            href={info.theoryUrl}
            target="_blank"
            rel="noreferrer"
          >
            theory ↗
          </a>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber">
            Located images · babelia-style (deterministic from your word)
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {images.map((img) => (
              <figure
                key={img.id}
                className="overflow-hidden rounded-sm border border-cyan/25 bg-black/50"
              >
                <img src={img.dataUrl} alt={img.title} className="w-full object-cover" />
                <figcaption className="space-y-1 px-2 py-1.5">
                  <p className="font-mono text-[10px] text-cyan">{img.title}</p>
                  <p className="font-mono text-[8px] text-muted-foreground">{img.address}</p>
                  <button
                    type="button"
                    className="font-mono text-[8px] uppercase tracking-[0.12em] text-amber underline-offset-2 hover:underline"
                    onClick={() =>
                      downloadDataUrl(img.dataUrl, `babel-${img.style}-${book.seedWord}.png`)
                    }
                  >
                    Download PNG
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <GhostButton
          type="button"
          disabled={pageIdx <= 0}
          onClick={() => onPage(Math.max(0, pageIdx - 1))}
        >
          Prev leaf
        </GhostButton>
        <span className="font-mono text-[10px] text-muted-foreground">
          Leaf {pageIdx + 1} / {book.pages.length} · {leaf.title}
        </span>
        <GhostButton
          type="button"
          disabled={pageIdx >= book.pages.length - 1}
          onClick={() => onPage(Math.min(book.pages.length - 1, pageIdx + 1))}
        >
          Next leaf
        </GhostButton>
        <a
          href={book.officialSearchUrl}
          target="_blank"
          rel="noreferrer"
          className="ml-auto font-mono text-[9px] uppercase tracking-[0.12em] text-amber underline-offset-2 hover:underline"
        >
          Find combo on libraryofbabel.info ↗
        </a>
      </div>

      <div
        className="overflow-hidden rounded-sm border border-cyan/30 bg-black/55"
        style={{ boxShadow: `inset 0 0 48px ${book.colorHex}18` }}
      >
        <div className="border-b border-amber/25 bg-amber/10 px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber">
            {kindLabel(leaf.sourceKind)} · {leaf.page.location.address}
          </p>
          <p className="font-mono text-[8px] text-muted-foreground">
            Amber = exact / stem / anagram / scramble / similar letters from source texts
          </p>
        </div>
        <p className="border-b border-cyan/15 px-3 py-2 font-mono text-[10px] leading-relaxed text-moon/85">
          {highlightAmber(leaf.excerpt, leaf.page.matched)}
        </p>
        <pre className="max-h-[22rem] overflow-auto px-3 py-2.5 font-mono text-[10px] leading-relaxed text-mint/90 whitespace-pre-wrap break-all">
          {highlightAmber(body, leaf.page.matched)}
        </pre>
      </div>
    </div>
  );
}

export function BabelSecretPanel({
  result,
  johnsonWord,
  johnsonWord1773,
  secretPassages,
  mythPassages,
  ruckmanVerses,
  sourcesReady,
}: {
  result: NumerologyResult;
  johnsonWord: JohnsonSense | null;
  johnsonWord1773: JohnsonSense | null;
  secretPassages: SecretDoctrinePassage[];
  mythPassages: GreekMythPassage[];
  ruckmanVerses: RuckmanVerse[];
  /** True once Johnson + doctrine/myth fetches have settled enough to search. */
  sourcesReady: boolean;
}) {
  const [artIdx, setArtIdx] = React.useState(0);
  const [bookIdx, setBookIdx] = React.useState(0);
  const [pageIdx, setPageIdx] = React.useState(0);
  const [showFinds, setShowFinds] = React.useState(true);

  const report: BabelLibraryReport | null = React.useMemo(() => {
    if (!sourcesReady) return null;
    return searchBabelSecrets({
      result,
      johnsonWord,
      johnsonWord1773,
      secretPassages,
      mythPassages,
      ruckmanVerses,
      limit: 14,
    });
  }, [
    sourcesReady,
    result,
    johnsonWord,
    johnsonWord1773,
    secretPassages,
    mythPassages,
    ruckmanVerses,
  ]);

  const books: BabelGeneratedBook[] = React.useMemo(() => {
    if (!sourcesReady) return [];
    return generateBabelBooks({
      result,
      johnsonWord,
      johnsonWord1773,
      secretPassages,
      mythPassages,
      ruckmanVerses,
      maxBooks: 3,
    });
  }, [
    sourcesReady,
    result,
    johnsonWord,
    johnsonWord1773,
    secretPassages,
    mythPassages,
    ruckmanVerses,
  ]);

  React.useEffect(() => {
    setBookIdx(0);
    setPageIdx(0);
    setArtIdx(Math.abs(result.number - 1) % BABEL_ARTWORK.length);
  }, [result.number, result.normalized]);

  const activeBook = books[bookIdx] ?? null;
  const hero = BABEL_ARTWORK[artIdx] ?? BABEL_ARTWORK[0]!;

  const bookImages: BabelLocatedImage[] = React.useMemo(() => {
    if (!activeBook) return [];
    return locateBabelImages({
      seedWord: activeBook.seedWord,
      pathNumber: activeBook.pathNumber,
      colorHex: activeBook.colorHex,
      colorName: activeBook.colorName,
      bookTitle: activeBook.title,
      combination: activeBook.combination,
      spineTitles: [
        activeBook.seedWord,
        ...activeBook.combination,
        ...activeBook.pages.slice(0, 6).map((p) => p.title.replace(/^.*·\s*/, "")),
      ],
    });
  }, [activeBook]);

  function downloadAll() {
    if (!report) return;
    downloadJson(`babel-secrets-${result.normalized}-path${result.number}.json`, {
      word: result.normalized,
      path: result.number,
      report,
      books: books.map((b) => ({
        ...b,
        pages: b.pages.map((p) => ({
          ...p,
          page: {
            ...p.page,
            text: p.page.text.slice(0, 400),
            lines: p.page.lines.slice(0, 12),
          },
        })),
      })),
      synthesisReport: report.synthesis ? formatBabelFindReport(report.synthesis) : null,
    });
  }

  if (!sourcesReady) {
    return (
      <Panel title="Babel Secret Library" eyebrow="LOCATING SOURCES">
        <p className="font-mono text-[11px] text-muted-foreground">
          Waiting on Johnson / Secret Doctrine / Greek Myths so combinations can be located…
        </p>
      </Panel>
    );
  }

  return (
    <div className="space-y-3">
      <Panel
        title="Babel Secret Library"
        eyebrow="NUMEROLOGY · locate · do not invent · amber = source matches"
        action={
          <RunButton type="button" onClick={downloadAll}>
            Download JSON
          </RunButton>
        }
      >
        <div className="space-y-3">
          <p className="rounded-sm border border-amber/35 bg-amber/10 px-3 py-2 font-mono text-[10px] leading-relaxed text-amber">
            Best live Babel:{" "}
            <a
              className="underline underline-offset-2"
              href={OFFICIAL_BABEL.home}
              target="_blank"
              rel="noreferrer"
            >
              libraryofbabel.info
            </a>{" "}
            (Basile — no public API). Locates text pages and{" "}
            <a
              className="underline underline-offset-2"
              href={OFFICIAL_BABEL.babelia}
              target="_blank"
              rel="noreferrer"
            >
              babelia-style images
            </a>{" "}
            from your path word plus Johnson, Blavatsky, Graves anagrams, philosophy, tarot, and
            Thought-Forms — then generates multi-leaf books with call numbers, contents, and
            deterministic covers. Amber marks the same match classes as Greek Myths / Secret
            Doctrine.
          </p>

          <figure className="overflow-hidden rounded-sm border border-amber/40 bg-black/60">
            <div className="relative max-h-[min(42vh,420px)] overflow-hidden">
              <img
                src={hero.src}
                alt={`${hero.title} — ${hero.artist}`}
                className="h-full w-full object-cover object-center"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <figcaption className="absolute bottom-0 left-0 right-0 space-y-1 p-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber">
                  Antique Babel · public domain
                </p>
                <p className="font-display text-sm uppercase tracking-[0.1em] text-moon">
                  {hero.title}
                </p>
                <p className="font-mono text-[10px] text-moon/80">
                  {hero.artist} · {hero.year} · {hero.credit}
                </p>
              </figcaption>
            </div>
            <div className="flex flex-wrap gap-1.5 border-t border-amber/20 bg-black/50 px-2 py-2">
              {BABEL_ARTWORK.map((art, i) => (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => setArtIdx(i)}
                  className={`overflow-hidden rounded-sm border ${
                    i === artIdx ? "border-amber ring-1 ring-amber/50" : "border-cyan/20 opacity-70"
                  }`}
                  title={art.title}
                >
                  <img src={art.src} alt="" className="h-12 w-16 object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </figure>

          <div className="flex flex-wrap gap-2">
            <Metric label="Path" value={String(result.number)} />
            <Metric label="Finds" value={String(report?.finds.length ?? 0)} />
            <Metric label="Books" value={String(books.length)} />
            <Metric label="Ray" value={report?.colorName ?? "—"} />
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-[9px]">
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href={OFFICIAL_BABEL.search}
              target="_blank"
              rel="noreferrer"
            >
              Official Search
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href={OFFICIAL_BABEL.theory}
              target="_blank"
              rel="noreferrer"
            >
              Theory
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href={OFFICIAL_BABEL.babelia}
              target="_blank"
              rel="noreferrer"
            >
              Babelia
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href={OFFICIAL_BABEL.algo}
              target="_blank"
              rel="noreferrer"
            >
              Algo (GitHub)
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href={OFFICIAL_BABEL.borgesPdf}
              target="_blank"
              rel="noreferrer"
            >
              Borges PDF
            </a>
          </div>
        </div>
      </Panel>

      {activeBook && (
        <Panel
          title="Generated books · from foundational sources"
          eyebrow={`${books.length} volume${books.length === 1 ? "" : "s"} · word + combinations`}
          action={
            <div className="flex flex-wrap gap-1">
              {books.map((b, i) => (
                <GhostButton
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBookIdx(i);
                    setPageIdx(0);
                  }}
                >
                  {i === bookIdx ? `● ${i + 1}` : String(i + 1)}
                </GhostButton>
              ))}
            </div>
          }
        >
          <BookReader
            book={activeBook}
            pageIdx={pageIdx}
            onPage={setPageIdx}
            images={bookImages}
          />
        </Panel>
      )}

      {report?.synthesis && (
        <Panel title="Catalogue leaf · synthesis" eyebrow="All sources · one located page">
          <FindCard find={report.synthesis} />
        </Panel>
      )}

      <Panel
        title="Secret finds · source by source"
        eyebrow={`${report?.finds.length ?? 0} located pages`}
        action={
          <GhostButton type="button" onClick={() => setShowFinds((v) => !v)}>
            {showFinds ? "Collapse" : "Expand"}
          </GhostButton>
        }
      >
        {showFinds ? (
          <div className="max-h-[36rem] space-y-3 overflow-y-auto pr-1">
            {(report?.finds ?? []).map((find) => (
              <FindCard key={find.query.id} find={find} />
            ))}
          </div>
        ) : (
          <p className="font-mono text-[10px] text-muted-foreground">
            Collapsed — expand to read each located page with amber highlights.
          </p>
        )}
      </Panel>

      {report?.synthesis && (
        <Panel title="Telemetry" eyebrow="BABEL">
          <EquationBox label="Synthesis leaf">{formatBabelFindReport(report.synthesis)}</EquationBox>
        </Panel>
      )}
    </div>
  );
}
