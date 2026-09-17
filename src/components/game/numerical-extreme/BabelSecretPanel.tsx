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
  OFFICIAL_BABELIA,
  RETRO_GRIMOIRE_SRC,
  babeliaFromLocation,
  babeliaHierarchyForWord,
  babeliaLocateFromImageData,
  babeliaRandom,
  babeliaStep,
  isOfficialBabeliaLocationLength,
  officialBabeliaBookmarkUrl,
  composeGrimoireWithBabelText,
  downloadDataUrl,
  formatBabelFindReport,
  generateBabelBooks,
  quietlyPolishBabelBooks,
  locateBabelImages,
  searchBabelSecrets,
  toBabelCaption,
  type BabelGeneratedBook,
  type BabelLibraryReport,
  type BabelLocatedImage,
  type BabelSecretFind,
  type BabeliaPlate,
  type GreekMythPassage,
  type JohnsonSense,
  type NumerologyResult,
  type RuckmanVerse,
  type SecretDoctrinePassage,
} from "@/game/numerical-extreme";
import { downloadJson } from "@/game/numerical-extreme";
import { TextInput } from "@/components/game/numerical-extreme/ui";
import { audio } from "@/game/audio";

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
  const accuracyPct = leaf.accuracy;
  const fadeNote =
    accuracyPct >= 85
      ? "Rare coherent page · foundational signal located in the hexagon"
      : accuracyPct >= 65
        ? "Readable near-match · still more sense than noise"
        : accuracyPct >= 45
          ? "Mostly Babel dust · a few amber tokens remain"
          : "Typical Library page · nearly all permutation noise";

  return (
    <div className="space-y-3">
      <div className="rounded-sm border border-amber/35 bg-amber/10 px-3 py-2 font-mono text-[10px] leading-relaxed text-amber">
        <span className="text-moon">Library of Babel idea:</span> nothing is authored — pages are{" "}
        <span className="text-cyan">located</span>. Walk the volume from rare coherent leaves
        (foundational sources) into ordinary Babel noise. This leaf ·{" "}
        <span className="text-cyan">{accuracyPct}% coherence</span> · {leaf.accuracyLabel}. {fadeNote}.
      </div>

      <div className="rounded-sm border border-cyan/30 bg-black/50 px-3 py-2 font-mono text-[10px] text-moon">
        <p className="text-[9px] uppercase tracking-[0.16em] text-magenta">Browse address</p>
        <p className="mt-1 text-cyan">
          hexagon <span className="text-amber">{leaf.page.location.hexagon}</span>
        </p>
        <p>
          wall {leaf.page.location.wall} · shelf {leaf.page.location.shelf} · volume{" "}
          {leaf.page.location.volume} · page {leaf.page.location.page}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-2 text-[9px]">
          <a
            className="text-amber underline-offset-2 hover:underline"
            href={OFFICIAL_BABEL.browse}
            target="_blank"
            rel="noreferrer"
          >
            Official Browse
          </a>
          <a
            className="text-amber underline-offset-2 hover:underline"
            href={leaf.page.location.officialSearchUrl}
            target="_blank"
            rel="noreferrer"
          >
            Official Search
          </a>
          <a
            className="text-amber underline-offset-2 hover:underline"
            href={OFFICIAL_BABEL.random}
            target="_blank"
            rel="noreferrer"
          >
            Official Random
          </a>
        </div>
      </div>

      {/* Coherence progress — Library walk */}
      <div className="space-y-1">
        <div className="flex flex-wrap gap-1">
          {book.pages.map((p, i) => (
            <button
              key={p.index}
              type="button"
              onClick={() => {
                audio.play("babel-air", 1);
                onPage(i);
              }}
              title={`${p.accuracy}% coherence · ${p.title}`}
              className={`h-2 flex-1 min-w-[8px] rounded-sm transition ${
                i === pageIdx ? "ring-1 ring-amber" : ""
              }`}
              style={{
                backgroundColor: `rgba(251, 191, 36, ${Math.max(0.12, p.accuracy / 100)})`,
              }}
            />
          ))}
        </div>
        <p className="font-mono text-[8px] text-muted-foreground">
          Hexagon walk · brighter = rarer coherent page (less Babel noise)
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)]">
        <figure className="overflow-hidden rounded-sm border border-amber/35 bg-black/50">
            <img
            src={images.find((i) => i.style === "grimoire")?.dataUrl ||
              images.find((i) => i.style === "folio")?.dataUrl ||
              book.coverArt.src}
            alt={book.coverArt.title}
            className="h-48 w-full object-contain sm:h-full sm:min-h-[200px]"
            style={{ imageRendering: "pixelated" }}
            loading="lazy"
          />
          <figcaption className="px-2 py-1.5 font-mono text-[8px] leading-snug text-muted-foreground">
            {images.find((i) => i.style === "grimoire")
              ? "Retro grimoire · most likely"
              : images.find((i) => i.style === "folio")
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
            Image hierarchy · most likely → least likely
          </p>
          <div className="space-y-2">
            {[...images]
              .sort((a, b) => b.likelihood - a.likelihood)
              .map((img, rank) => (
                <figure
                  key={img.id}
                  className="overflow-hidden rounded-sm border border-cyan/25 bg-black/50"
                  style={{
                    opacity: Math.max(0.55, 1 - rank * 0.08),
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan/15 px-2 py-1.5">
                    <p className="font-mono text-[10px] text-cyan">
                      #{rank + 1} · {img.likelihood}% · {img.title}
                    </p>
                    <p className="font-mono text-[8px] text-amber">{img.likelihoodWhy}</p>
                  </div>
                  <img
                    src={img.dataUrl}
                    alt={img.title}
                    className="mx-auto max-h-64 w-auto object-contain"
                    style={img.style === "grimoire" ? { imageRendering: "pixelated" } : undefined}
                  />
                  <figcaption className="space-y-1 px-2 py-1.5">
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
          onClick={() => {
            audio.play("babel-air", 0);
            onPage(Math.max(0, pageIdx - 1));
          }}
        >
          Prev leaf
        </GhostButton>
        <span className="font-mono text-[10px] text-muted-foreground">
          Leaf {pageIdx + 1} / {book.pages.length} · {leaf.title}
        </span>
        <GhostButton
          type="button"
          disabled={pageIdx >= book.pages.length - 1}
          onClick={() => {
            audio.play("babel-air", 2);
            onPage(Math.min(book.pages.length - 1, pageIdx + 1));
          }}
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
            {leaf.accuracy}% · {leaf.accuracyLabel} · {kindLabel(leaf.sourceKind)}
          </p>
          <p className="font-mono text-[8px] text-muted-foreground">{leaf.accuracyWhy}</p>
          <p className="font-mono text-[8px] text-muted-foreground">
            {leaf.page.location.address} · amber = source tokens
          </p>
        </div>
        <div className="border-b border-cyan/15 px-3 py-2.5">
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-magenta">
            Located reading · coherence note
          </p>
          <pre className="font-mono text-[11px] leading-relaxed text-moon whitespace-pre-wrap">
            {highlightAmber(leaf.bodyText || leaf.excerpt, leaf.page.matched)}
          </pre>
        </div>
        <p className="border-b border-cyan/15 px-3 py-2 font-mono text-[10px] leading-relaxed text-moon/85">
          Source excerpt · {highlightAmber(leaf.excerpt, leaf.page.matched)}
        </p>
        <pre className="max-h-[18rem] overflow-auto px-3 py-2.5 font-mono text-[10px] leading-relaxed text-mint/90 whitespace-pre-wrap break-all">
          {highlightAmber(body, leaf.page.matched)}
        </pre>
      </div>
    </div>
  );
}

function ProveOnOfficialBabel({ defaultText }: { defaultText: string }) {
  const [textSeed, setTextSeed] = React.useState(defaultText);
  const [twinNote, setTwinNote] = React.useState("");
  const [imageTwin, setImageTwin] = React.useState<BabeliaPlate | null>(null);

  React.useEffect(() => {
    setTextSeed(defaultText);
  }, [defaultText]);

  const officialTextUrl = `${OFFICIAL_BABEL.search}?find=${encodeURIComponent(
    textSeed.trim().slice(0, 3200),
  )}`;

  function onImageFile(file: File | null) {
    if (!file || typeof document === "undefined") return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const plate = babeliaLocateFromImageData(data);
        setImageTwin(plate);
        setTwinNote(
          `ZEUS twin located a plate (${plate.location.length} digits). Official Babelia needs their Image Search upload for the true Basile address.`,
        );
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }

  return (
    <Panel
      title="Prove it · official Library of Babel"
      eyebrow="text / image seed → Basile search (true archive) + ZEUS twin"
    >
      <div className="space-y-3">
        <p className="font-mono text-[10px] leading-relaxed text-amber">
          To <span className="text-cyan">know it’s true</span> on the real site: paste a text
          phrase → Official text search finds exact matches in Basile’s Library. For images, use
          Official Babelia Image Search (upload). ZEUS still shows an educational twin plate so
          you can practice locate locally — same idea, not the same pixels/pages.
        </p>

        <label className="block font-mono text-[10px] text-muted-foreground">
          Text seed (exact phrase to prove)
          <textarea
            value={textSeed}
            onChange={(e) => setTextSeed(e.target.value)}
            rows={3}
            spellCheck={false}
            className="mt-1 w-full rounded-sm border border-cyan/30 bg-black/50 px-2 py-1.5 font-mono text-[11px] text-moon"
            placeholder="paste a sentence or word…"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <a
            className="inline-flex items-center rounded-sm border border-amber/50 bg-amber/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-amber hover:bg-amber/25"
            href={officialTextUrl}
            target="_blank"
            rel="noreferrer"
          >
            Find text on libraryofbabel.info ↗
          </a>
          <a
            className="inline-flex items-center rounded-sm border border-cyan/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cyan hover:bg-cyan/10"
            href={OFFICIAL_BABELIA.search}
            target="_blank"
            rel="noreferrer"
          >
            Official Babelia image search ↗
          </a>
          <a
            className="inline-flex items-center rounded-sm border border-cyan/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cyan hover:bg-cyan/10"
            href={OFFICIAL_BABELIA.slideshow}
            target="_blank"
            rel="noreferrer"
          >
            Babelia slideshow ↗
          </a>
        </div>

        <label className="block font-mono text-[10px] text-muted-foreground">
          Image seed (optional · ZEUS twin locate)
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-[10px] text-moon"
            onChange={(e) => onImageFile(e.target.files?.[0] ?? null)}
          />
        </label>

        {twinNote && (
          <p className="font-mono text-[9px] leading-relaxed text-moon/80">{twinNote}</p>
        )}
        {imageTwin && (
          <figure className="overflow-hidden rounded-sm border border-cyan/30 bg-black/50">
            <img
              src={imageTwin.dataUrl}
              alt={imageTwin.shortId}
              className="mx-auto max-h-48 w-auto"
              style={{ imageRendering: "pixelated" }}
            />
            <figcaption className="break-all px-2 py-1.5 font-mono text-[8px] text-muted-foreground">
              {imageTwin.shortId} · {imageTwin.location.length} digits (ZEUS twin only)
            </figcaption>
          </figure>
        )}
      </div>
    </Panel>
  );
}

function BabeliaArchiveBrowser({
  seedWord,
  pathNumber,
  colorHex,
  combination,
}: {
  seedWord: string;
  pathNumber: number;
  colorHex: string;
  combination: string[];
}) {
  const hierarchy = React.useMemo(
    () =>
      babeliaHierarchyForWord({
        seedWord,
        pathNumber,
        colorHex,
        combination: combination.length ? combination : [seedWord],
      }),
    [seedWord, pathNumber, colorHex, combination],
  );

  const [plate, setPlate] = React.useState<BabeliaPlate | null>(null);
  const [seekFull, setSeekFull] = React.useState("");
  const [tierIdx, setTierIdx] = React.useState(0);

  React.useEffect(() => {
    setTierIdx(0);
    setPlate(hierarchy[0] ?? babeliaRandom());
    setSeekFull(hierarchy[0]?.location ?? "");
  }, [hierarchy]);

  const active = plate ?? hierarchy[0];
  if (!active) return null;

  const seekDigits = seekFull.replace(/\D/g, "");
  const officialPaste = isOfficialBabeliaLocationLength(seekDigits.length);
  const seekDisplay =
    seekDigits.length > 220
      ? `${seekDigits.slice(0, 48)}… (${seekDigits.length} digits) …${seekDigits.slice(-48)}`
      : seekDigits;

  return (
    <Panel
      title="Babelia · image archives"
      eyebrow="12-bit · location → pixels · locate, don’t store"
    >
      <div className="space-y-3">
        <p className="font-mono text-[10px] leading-relaxed text-amber">
          Same <span className="text-moon">idea</span> as{" "}
          <a
            className="underline underline-offset-2"
            href="https://babelia.libraryofbabel.info/slideshow.html"
            target="_blank"
            rel="noreferrer"
          >
            babelia slideshow
          </a>
          . You do <span className="text-cyan">not</span> need to zoom — colorful static{" "}
          <span className="text-moon">is</span> ordinary archive noise on the ZEUS twin. Pasting a
          real Babelia location (~960k digits) will not redraw Basile’s image here (different
          algorithm). Use <span className="text-cyan">Open on official Babelia</span> for the true
          plate.
        </p>

        <div className="flex flex-wrap gap-2">
          <GhostButton
            type="button"
            onClick={() => {
              const next = babeliaRandom();
              setPlate(next);
              setSeekFull(next.location);
            }}
          >
            Random
          </GhostButton>
          <GhostButton
            type="button"
            onClick={() => {
              const next = babeliaStep(active.location, -1);
              setPlate(next);
              setSeekFull(next.location);
            }}
          >
            Prev location
          </GhostButton>
          <GhostButton
            type="button"
            onClick={() => {
              const next = babeliaStep(active.location, 1);
              setPlate(next);
              setSeekFull(next.location);
            }}
          >
            Next location
          </GhostButton>
          <a
            className="inline-flex items-center font-mono text-[9px] uppercase tracking-[0.12em] text-amber underline-offset-2 hover:underline"
            href={OFFICIAL_BABELIA.search}
            target="_blank"
            rel="noreferrer"
          >
            Official image search ↗
          </a>
          <a
            className="inline-flex items-center font-mono text-[9px] uppercase tracking-[0.12em] text-amber underline-offset-2 hover:underline"
            href={OFFICIAL_BABELIA.about}
            target="_blank"
            rel="noreferrer"
          >
            About archives ↗
          </a>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-[220px] flex-1 font-mono text-[10px] text-muted-foreground">
            Seek location (paste digits · ZEUS twin)
            <TextInput
              value={seekDisplay}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d.]/g, "");
                // Ignore display ellipsis edits; accept new pastes / short IDs only
                if (raw.includes("…") || /\(\d+ digits\)/.test(e.target.value)) return;
                setSeekFull(e.target.value.replace(/\D/g, ""));
              }}
              onPaste={(e) => {
                const text = e.clipboardData.getData("text").replace(/\D/g, "");
                if (text.length > 0) {
                  e.preventDefault();
                  setSeekFull(text);
                }
              }}
              spellCheck={false}
              className="mt-1"
              placeholder="paste location digits…"
            />
          </label>
          <GhostButton
            type="button"
            onClick={() => {
              const digits = seekDigits || "1";
              const next = babeliaFromLocation(digits, 0);
              setPlate(next);
              setSeekFull(next.location);
            }}
          >
            Seek twin
          </GhostButton>
          <a
            className="inline-flex items-center rounded-sm border border-amber/50 bg-amber/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-amber hover:bg-amber/25"
            href={officialBabeliaBookmarkUrl(seekDigits || "1")}
            target="_blank"
            rel="noreferrer"
          >
            Open on official Babelia ↗
          </a>
        </div>

        {officialPaste && (
          <p className="rounded-sm border border-amber/40 bg-amber/10 px-3 py-2 font-mono text-[10px] leading-relaxed text-amber">
            Loaded official-length ID ({seekDigits.length.toLocaleString()} digits). Twin Seek =
            colorful static (expected). For the real image of this location, use{" "}
            <span className="text-cyan">Open on official Babelia</span> — no zoom will fix the twin
            plate.
          </p>
        )}

        <figure className="overflow-hidden rounded-sm border border-cyan/30 bg-black/60">
          <img
            src={active.dataUrl}
            alt={active.shortId}
            className="mx-auto w-full max-w-xl"
            style={{ imageRendering: "pixelated" }}
          />
          <figcaption className="space-y-1 border-t border-cyan/20 px-3 py-2 font-mono text-[10px]">
            <p className="text-cyan">{active.shortId}</p>
            <p className="break-all text-[8px] text-muted-foreground">
              {active.location.length.toLocaleString()} digits · {active.location.slice(0, 120)}
              {active.location.length > 120 ? "…" : ""}
            </p>
            <p className="text-amber">
              coherence {active.coherence}% · {active.note}
            </p>
            <button
              type="button"
              className="text-[8px] uppercase tracking-[0.12em] text-amber underline-offset-2 hover:underline"
              onClick={() => downloadDataUrl(active.dataUrl, `babelia-${pathNumber}.png`)}
            >
              Download PNG
            </button>
          </figcaption>
        </figure>

        <div className="space-y-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-magenta">
            Image search hierarchy · most coherent → archive noise
          </p>
          <div className="space-y-2">
            {hierarchy.map((p, i) => (
              <button
                key={`${p.shortId}-${i}`}
                type="button"
                onClick={() => {
                  setTierIdx(i);
                  setPlate(p);
                  setSeekFull(p.location);
                }}
                className={`flex w-full gap-3 overflow-hidden rounded-sm border text-left transition ${
                  tierIdx === i ? "border-amber/60 bg-amber/10" : "border-cyan/20 bg-black/40"
                }`}
                style={{ opacity: Math.max(0.5, 1 - i * 0.08) }}
              >
                <img
                  src={p.dataUrl}
                  alt=""
                  className="h-16 w-24 shrink-0 object-cover"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="min-w-0 flex-1 py-2 pr-2 font-mono text-[9px] leading-snug text-moon">
                  <span className="text-cyan">
                    #{i + 1} · {p.coherence}%
                  </span>
                  <br />
                  {p.note}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Panel>
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
  const [showFinds, setShowFinds] = React.useState(false);
  const [begun, setBegun] = React.useState(false);
  const [grimoireUrl, setGrimoireUrl] = React.useState(RETRO_GRIMOIRE_SRC);

  const [books, setBooks] = React.useState<BabelGeneratedBook[]>([]);

  const report: BabelLibraryReport | null = React.useMemo(() => {
    // Defer heavy locate until the grimoire is opened — keeps typing/scrolling smooth.
    if (!sourcesReady || !begun) return null;
    return searchBabelSecrets({
      result,
      johnsonWord,
      johnsonWord1773,
      secretPassages,
      mythPassages,
      ruckmanVerses,
      limit: 10,
    });
  }, [
    begun,
    sourcesReady,
    result,
    johnsonWord,
    johnsonWord1773,
    secretPassages,
    mythPassages,
    ruckmanVerses,
  ]);

  React.useEffect(() => {
    if (!sourcesReady || !begun) {
      if (!begun) setBooks([]);
      return;
    }
    const base = generateBabelBooks({
      result,
      johnsonWord,
      johnsonWord1773,
      secretPassages,
      mythPassages,
      ruckmanVerses,
      maxBooks: 2,
    });
    setBooks(base);

    // Idle polish: light keep typing smooth (no SFX). Deferred ModernBERT pass bings when done
    // (coin already on grimoire press — same Free multi-scan pairing).
    let cancelled = false;
    const runLight = () => {
      if (cancelled) return;
      void quietlyPolishBabelBooks(base, { light: true, sfx: false }).then((polished) => {
        if (!cancelled && polished.length) setBooks(polished);
      });
    };
    const runNeural = () => {
      if (cancelled) return;
      void quietlyPolishBabelBooks(base, { light: false, sfx: "end" }).then((polished) => {
        if (!cancelled && polished.length) setBooks(polished);
      });
    };
    const idleLight = window.setTimeout(runLight, 900);
    const idleNeural = window.setTimeout(runNeural, 2200);
    return () => {
      cancelled = true;
      window.clearTimeout(idleLight);
      window.clearTimeout(idleNeural);
    };
  }, [
    begun,
    sourcesReady,
    result.number,
    result.normalized,
    johnsonWord,
    johnsonWord1773,
    secretPassages,
    mythPassages,
    ruckmanVerses,
  ]);

  React.useEffect(() => {
    setBookIdx(0);
    setPageIdx(0);
    setBegun(false);
    setArtIdx(0);
    audio.stopBabelAmbience();
  }, [result.number, result.normalized]);

  React.useEffect(() => {
    return () => {
      audio.stopBabelAmbience();
    };
  }, []);

  React.useEffect(() => {
    if (!begun) return;
    let cancelled = false;
    const snippet = [
      result.normalized,
      result.title,
      ...(secretPassages[0]?.matched.slice(0, 2) ?? []),
      ...(mythPassages[0]?.matched.slice(0, 2) ?? []),
    ].join(" ");
    const run = () => {
      void composeGrimoireWithBabelText({
        seedWord: result.normalized,
        pathNumber: result.number,
        colorHex: result.philosophy.geometry.hex,
        colorName: result.philosophy.geometry.colorName,
        babelSnippet: snippet,
      }).then((url) => {
        if (!cancelled) setGrimoireUrl(url);
      });
    };
    const t = window.setTimeout(run, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [begun, result, secretPassages, mythPassages]);

  const activeBook = books[bookIdx] ?? null;
  const hero = BABEL_ARTWORK[artIdx] ?? BABEL_ARTWORK[0]!;

  const bookImages: BabelLocatedImage[] = React.useMemo(() => {
    if (!begun || !activeBook) return [];
    const located = locateBabelImages({
      seedWord: activeBook.seedWord,
      pathNumber: activeBook.pathNumber,
      colorHex: activeBook.colorHex,
      colorName: activeBook.colorName,
      bookTitle: activeBook.title,
      combination: activeBook.combination,
      spineTitles: [
        activeBook.seedWord,
        ...activeBook.combination.slice(0, 4),
        ...activeBook.pages.slice(0, 3).map((p) => p.title.replace(/^.*·\s*/, "")),
      ],
      sourceHits: {
        johnson: johnsonWord || johnsonWord1773 ? 2 : 0,
        doctrine: secretPassages.length,
        myth: mythPassages.length,
        philosophy: result.philosophy.thoughts.length,
      },
    });
    return located.map((img) =>
      img.style === "grimoire" ? { ...img, dataUrl: grimoireUrl } : img,
    );
  }, [
    begun,
    activeBook,
    grimoireUrl,
    johnsonWord,
    johnsonWord1773,
    secretPassages.length,
    mythPassages.length,
    result.philosophy.thoughts.length,
  ]);

  const babelPressLine = toBabelCaption(
    `${result.normalized}, ${result.title}. path ${result.number}.`,
  );

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

  if (!begun) {
    return (
      <Panel title="Babel Secret Library" eyebrow="PRESS THE GRIMOIRE · BABEL FONT">
        <div className="flex flex-col items-center gap-4 py-2">
          <p className="max-w-xl text-center font-mono text-[10px] leading-relaxed text-amber">
            Library of Babel: every page already exists. Press the grimoire to locate the rare
            coherent leaves for your word — then walk into noise. Caption uses the 29-letter press
            (a–z, space, comma, period).
          </p>
          <button
            type="button"
            onClick={() => {
              audio.openBabelGrimoire();
              audio.play("detect-coin");
              setBegun(true);
            }}
            className="group relative max-w-sm overflow-hidden rounded-sm border-2 border-amber/60 bg-black/70 p-2 transition hover:border-amber hover:shadow-[0_0_32px_rgba(251,191,36,0.25)] focus:outline-none focus:ring-2 focus:ring-amber/50"
            aria-label="Press the grimoire to begin the Babel Secret Library"
          >
            <img
              src={grimoireUrl}
              alt="Retro grimoire — press to begin"
              className="mx-auto w-full max-w-[280px] transition group-hover:scale-[1.02]"
              style={{ imageRendering: "pixelated" }}
            />
            <span
              className="mt-2 block rounded-sm border border-amber/40 bg-black/80 px-3 py-2 text-center font-mono text-[11px] leading-relaxed tracking-wide text-amber"
              style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
              {babelPressLine || toBabelCaption(result.normalized)}
              <span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-moon/80">
                path {result.number} · press to begin
              </span>
            </span>
          </button>
          <p className="font-mono text-[9px] text-muted-foreground">
            Hierarchy after open: grimoire → folio → babelia → hexagon → shelf (likelihood %).
            Opening plays coin-flip SFX (same as Free multi-scan); polish ends with a bing. Mute in
            Settings if needed.
          </p>
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-3">
      <Panel
        title="Babel Secret Library"
        eyebrow="NUMEROLOGY · locate · do not invent · amber = source matches"
        action={
          <div className="flex flex-wrap gap-1.5">
            <GhostButton
              type="button"
              onClick={() => {
                audio.closeBabelGrimoire();
                setBegun(false);
              }}
            >
              Close grimoire
            </GhostButton>
            <RunButton type="button" onClick={downloadAll}>
              Download JSON
            </RunButton>
          </div>
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
            Doctrine. Multilingual source EPUBs:{" "}
            <a
              className="underline underline-offset-2"
              href={OFFICIAL_BABEL.epubCompanion}
              target="_blank"
              rel="noreferrer"
            >
              The Babel Library (clcreuso)
            </a>{" "}
            vendored at{" "}
            <a
              className="underline underline-offset-2"
              href={OFFICIAL_BABEL.epubCompanionLocal}
              target="_blank"
              rel="noreferrer"
            >
              tools/the-babel-library
            </a>{" "}
            — Codex EPUB translator integrated with all NUMEROLOGY sources (not a LoB clone).
          </p>
          <p className="rounded-sm border border-mint/30 bg-mint/10 px-3 py-2 font-mono text-[10px] leading-relaxed text-mint/95">
            Silent polish uses the same Free AI Detector as AI Detector Free mode: ModernBERT +
            stylometrics, higher-order lead composite, log-odds / product-of-experts fusion, and all
            ModernBERT-first rules — preferring prose under ~10% AI while maximizing Writing IQ
            toward ~190. Ordered Spatial Reasoning (V18) also scores locate-token structure for
            high-variance recall. Scores stay hidden in NUMEROLOGY.
          </p>
          <p className="rounded-sm border border-amber/25 bg-black/40 px-3 py-2 font-mono text-[10px] leading-relaxed text-amber/90">
            Notes / security: Free ensemble scoring runs in your browser (ONNX models cached after
            first download). No API keys required for polish. Do not paste secrets, passwords, or
            private credentials into path words or exported JSON. Heuristic filter only — not a legal
            or academic verdict. Coin on grimoire / bing when deferred polish finishes (same Free
            multi-scan pairing); mute in Settings if needed.
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
              href={OFFICIAL_BABEL.epubCompanion}
              target="_blank"
              rel="noreferrer"
            >
              EPUB Babel Library
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href={OFFICIAL_BABEL.epubCompanionLocal}
              target="_blank"
              rel="noreferrer"
            >
              Vendored guide
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href="/numerology/babel/epub-companion-glossary.md"
              target="_blank"
              rel="noreferrer"
            >
              EPUB glossary
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
        <>
          <ProveOnOfficialBabel
            defaultText={
              activeBook.pages[0]?.excerpt ||
              activeBook.combination.slice(0, 6).join(" ") ||
              result.normalized
            }
          />
          <Panel
            title="Generated books · from foundational sources"
            eyebrow={`${books.length} volume${books.length === 1 ? "" : "s"} · coherent→noise`}
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
          <BabeliaArchiveBrowser
            seedWord={activeBook.seedWord}
            pathNumber={activeBook.pathNumber}
            colorHex={activeBook.colorHex}
            combination={activeBook.combination}
          />
        </>
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
