import * as React from "react";
import { Finale } from "@/components/game/Finale";
import {
  itemImageUrl,
  loadExtremePuzzleAnswers,
  type ExtremePuzzleAnswers,
  type ExtremePuzzleResult,
} from "@/game/extreme-puzzle/assets";
import {
  AGE_BANDS,
  EXTREME_PUZZLE_ITEM_COUNT,
  ageBandIndex,
  ageReferencedScore,
  sameAnswerSet,
} from "@/game/extreme-puzzle/scoring";
import {
  EXTREME_PUZZLE_CORRELATIONS,
  EXTREME_PUZZLE_SOURCES,
  EXTREME_PUZZLE_WARNING,
  type ExtremePuzzleSourceLink,
} from "@/game/extreme-puzzle/sources";
import { playSfx } from "@/game/spirit-bound/shrine/audio";
import { useGame } from "@/game/store";
import {
  formatAttemptDate,
  loadExtremePuzzleHistory,
  recordExtremePuzzleAttempt,
  type ExtremePuzzleAttempt,
} from "@/storage/spirit-bound/extreme-puzzle";
import { cn } from "@/lib/utils";

type Phase = "warning" | "age" | "play" | "rocket";

type Props = {
  onExit: () => void;
};

function InvertedPentagram({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <polygon
        points="50,88 31,30 78,62 22,62 69,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function UpsideDownStar({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <polygon
        points="12,22 14.9,14.9 22,14.9 16.2,10.4 18.5,3.5 12,8.2 5.5,3.5 7.8,10.4 2,14.9 9.1,14.9"
        fill="currentColor"
      />
    </svg>
  );
}

function SourceList({
  title,
  items,
}: {
  title: string;
  items: readonly ExtremePuzzleSourceLink[];
}) {
  return (
    <div className="rounded border border-[#a88828]/50 bg-[#100808] px-3 py-3 text-left">
      <p className="font-pixel text-[9px] tracking-[0.16em] text-game-yellow">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item.href + item.label} className="font-pixel text-[7px] leading-relaxed text-[#c8a048]">
            <span className="text-[#f8f0c8]">{item.label}</span>
            <span className="mt-0.5 block text-[#a88828]">{item.detail}</span>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 block break-all text-[#48a0f8] underline decoration-[#48a0f8]/40 underline-offset-2 hover:text-cyan"
            >
              {item.href}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreHistory({ attempts }: { attempts: ExtremePuzzleAttempt[] }) {
  if (attempts.length === 0) {
    return (
      <p className="font-pixel text-[8px] text-[#a88828]">
        No prior attempts yet — each finish here is dated and stored on this device.
      </p>
    );
  }
  return (
    <div className="max-h-48 overflow-y-auto rounded border border-[#a88828]/40 bg-[#100808]">
      <table className="w-full text-left font-pixel text-[7px]">
        <thead className="sticky top-0 bg-[#181008] text-[#f8d030]">
          <tr>
            <th className="px-2 py-1.5 font-normal tracking-[0.12em]">DATE</th>
            <th className="px-2 py-1.5 font-normal tracking-[0.12em]">RAW</th>
            <th className="px-2 py-1.5 font-normal tracking-[0.12em]">AGE-REF</th>
            <th className="px-2 py-1.5 font-normal tracking-[0.12em]">BAND</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((a) => (
            <tr key={a.at} className="border-t border-[#a88828]/25 text-[#c8a048]">
              <td className="px-2 py-1.5 text-[#f8f0c8]">{formatAttemptDate(a.at)}</td>
              <td className="px-2 py-1.5">
                {a.rawScore}/{a.total}
              </td>
              <td className="px-2 py-1.5 text-game-yellow">
                {a.ageReferencedScore === null ? "—" : a.ageReferencedScore}
              </td>
              <td className="px-2 py-1.5">{a.ageBandLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ExtremePuzzle({ onExit }: Props) {
  const { settings, progress } = useGame();
  const [phase, setPhase] = React.useState<Phase>("warning");
  const [years, setYears] = React.useState(25);
  const [months, setMonths] = React.useState(0);
  const [answers, setAnswers] = React.useState<ExtremePuzzleAnswers | null>(null);
  const [loadError, setLoadError] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [result, setResult] = React.useState<ExtremePuzzleResult | null>(null);
  const [history, setHistory] = React.useState<ExtremePuzzleAttempt[]>(() => loadExtremePuzzleHistory().attempts);
  const [imgOk, setImgOk] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    void (async () => {
      const data = await loadExtremePuzzleAnswers();
      if (!alive) return;
      if (!data) {
        setLoadError(
          "Local TRI item pack missing. Run scripts/extract-tri52.py with your PDF once (assets stay private / gitignored).",
        );
        return;
      }
      setAnswers(data);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const itemNumber = index + 1;
  const band = AGE_BANDS[ageBandIndex(years, months)]!;

  function acceptWarning() {
    playSfx("arcade");
    setPhase("age");
  }

  function startPlay() {
    if (years < 6) {
      playSfx("invalid");
      return;
    }
    playSfx("arcade");
    setPhase("play");
    setIndex(0);
    setSelected([]);
    setCorrectCount(0);
    setResult(null);
    setImgOk(true);
  }

  function toggleOption(n: number) {
    playSfx("select");
    setSelected((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n].sort((a, b) => a - b)));
  }

  function submitItem() {
    if (!answers || selected.length === 0) {
      playSfx("invalid");
      return;
    }
    const key = answers[String(itemNumber)] ?? answers[itemNumber as unknown as string] ?? [];
    const ok = sameAnswerSet(selected, key);
    const nextCorrect = correctCount + (ok ? 1 : 0);
    if (ok) playSfx("success");
    else playSfx("fail");

    if (index >= EXTREME_PUZZLE_ITEM_COUNT - 1) {
      const ageScore = ageReferencedScore(nextCorrect, years, months);
      const finished: ExtremePuzzleResult = {
        rawScore: nextCorrect,
        total: EXTREME_PUZZLE_ITEM_COUNT,
        ageYears: years,
        ageMonths: months,
        ageBandLabel: band.label,
        ageReferencedScore: ageScore,
      };
      setCorrectCount(nextCorrect);
      setResult(finished);
      setHistory(recordExtremePuzzleAttempt(finished).attempts);
      setPhase("rocket");
      return;
    }
    setCorrectCount(nextCorrect);
    setIndex((i) => i + 1);
    setSelected([]);
    setImgOk(true);
    playSfx("move");
  }

  if (phase === "warning") {
    const floatStars = [
      { top: "4%", left: "6%", size: 28, delay: "0s" },
      { top: "8%", right: "8%", size: 36, delay: "0.4s" },
      { top: "22%", left: "2%", size: 22, delay: "1.1s" },
      { top: "28%", right: "3%", size: 26, delay: "0.7s" },
      { top: "48%", left: "4%", size: 40, delay: "1.6s" },
      { top: "52%", right: "5%", size: 32, delay: "0.2s" },
      { top: "72%", left: "8%", size: 24, delay: "1.3s" },
      { top: "76%", right: "10%", size: 30, delay: "0.9s" },
      { top: "88%", left: "18%", size: 20, delay: "1.8s" },
      { top: "90%", right: "20%", size: 22, delay: "0.5s" },
      { top: "14%", left: "42%", size: 18, delay: "2s" },
      { top: "64%", left: "46%", size: 16, delay: "1.4s" },
    ] as const;

    return (
      <section className="extreme-warning-shell mx-auto flex min-h-[min(92vh,780px)] w-full max-w-3xl flex-col justify-center gap-5 p-5 sm:p-8">
        <div className="extreme-warning-starfield" aria-hidden>
          {floatStars.map((s, i) => (
            <UpsideDownStar
              key={i}
              className="extreme-warning-float"
              style={
                {
                  top: s.top,
                  left: "left" in s ? s.left : undefined,
                  right: "right" in s ? s.right : undefined,
                  width: s.size,
                  height: s.size,
                  animationDelay: s.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="extreme-warning-content flex flex-col gap-4">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <InvertedPentagram className="extreme-warning-glyph h-16 w-16 sm:h-24 sm:w-24" />
            <UpsideDownStar className="h-10 w-10 text-[#ff2020] sm:h-14 sm:w-14" style={{ transform: "rotate(180deg)" }} />
            <InvertedPentagram className="extreme-warning-glyph extreme-warning-glyph-rev h-16 w-16 sm:h-24 sm:w-24" />
          </div>

          <h1 className="extreme-warning-title text-center font-pixel uppercase">
            {EXTREME_PUZZLE_WARNING.title}
          </h1>

          <p className="extreme-warning-caution text-center font-pixel uppercase">
            {EXTREME_PUZZLE_WARNING.subtitle}
          </p>

          <div className="flex justify-center gap-4 text-[#ff3030]" aria-hidden>
            {Array.from({ length: 9 }).map((_, i) => (
              <UpsideDownStar key={i} className="h-5 w-5 sm:h-6 sm:w-6" style={{ transform: "rotate(180deg)" }} />
            ))}
          </div>

          <p className="text-center font-pixel text-[10px] tracking-[0.22em] text-[#ff6666] sm:text-[12px]">
            EXTREME PUZZLE · READ BEFORE YOU DARE CONTINUE
          </p>

          <ul className="space-y-3">
            {EXTREME_PUZZLE_WARNING.lines.map((line) => (
              <li
                key={line.slice(0, 48)}
                className="flex gap-3 border-2 border-[#ff2020]/70 bg-[#3a0000]/80 px-3 py-3 font-pixel text-[9px] leading-relaxed text-[#ffc8c8] shadow-[inset_0_0_24px_rgba(255,0,0,0.15)] sm:text-[10px]"
              >
                <UpsideDownStar
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#ff2020]"
                  style={{ transform: "rotate(180deg)" }}
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {history.length > 0 && (
            <div className="space-y-2 border-2 border-[#ff4040]/40 bg-black/40 px-3 py-3">
              <p className="font-pixel text-[9px] tracking-[0.16em] text-[#ff6060]">
                ★ PRIOR ATTEMPTS ON THIS DEVICE ({history.length}) ★
              </p>
              <ScoreHistory attempts={history.slice(0, 5)} />
            </div>
          )}

          <div className="flex items-center justify-center gap-4" aria-hidden>
            <InvertedPentagram className="h-10 w-10 text-[#ff1818]" />
            <InvertedPentagram className="h-14 w-14 text-[#ff1010]" />
            <InvertedPentagram className="h-10 w-10 text-[#ff1818]" />
          </div>

          <button
            type="button"
            onClick={acceptWarning}
            className="border-4 border-[#ff1010] bg-[#4a0000] px-3 py-4 font-pixel text-[13px] tracking-[0.2em] text-[#ff3030] shadow-[0_0_28px_rgba(255,0,0,0.45)] transition hover:bg-[#ff1010] hover:text-black sm:text-[15px]"
          >
            I ACCEPT THE CURSE · CONTINUE
          </button>
          <button
            type="button"
            onClick={onExit}
            className="border-2 border-[#662222] px-3 py-2 font-pixel text-[10px] tracking-[0.14em] text-[#aa5555] hover:border-[#ff4040] hover:text-[#ff8080]"
          >
            FLEE · CANCEL
          </button>
        </div>
      </section>
    );
  }

  if (phase === "rocket" && result) {
    return (
      <div className="space-y-3">
        <Finale
          progress={progress}
          total={EXTREME_PUZZLE_ITEM_COUNT}
          reducedMotion={settings.reducedMotion}
          onReviewMissed={onExit}
          onMastery={onExit}
          onMenu={onExit}
          extremeMission={{
            title: "EXTREME PUZZLE",
            score: result.ageReferencedScore ?? result.rawScore,
            correct: result.rawScore,
            total: result.total,
            continueLabel: "Back to title",
            onContinue: onExit,
          }}
        />
        <section className="mx-auto max-w-lg space-y-4 rounded-lg border-4 border-game-yellow bg-game-bg p-5 text-[#f8f0c8] shadow-[0_0_0_4px_#181010]">
          <div className="text-center">
            <p className="font-pixel text-[11px] tracking-[0.2em] text-game-yellow">YOUR SCORE</p>
            <p className="mt-3 font-pixel text-[22px] text-[#38c060]">
              Raw {result.rawScore} / {result.total}
            </p>
            <p className="mt-2 font-pixel text-[12px] text-[#f8f0c8]">
              Age-referenced ({result.ageBandLabel}):{" "}
              <span className="text-game-yellow">
                {result.ageReferencedScore === null ? "—" : result.ageReferencedScore}
              </span>
            </p>
            <p className="mt-1 font-pixel text-[8px] text-[#a88828]">
              Age entered {result.ageYears}:{String(result.ageMonths).padStart(2, "0")} · saved{" "}
              {formatAttemptDate(history[0]?.at ?? new Date().toISOString())}
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-pixel text-[9px] tracking-[0.16em] text-[#f8d030]">
              SCORE HISTORY · THIS DEVICE
            </p>
            <p className="font-pixel text-[7px] leading-relaxed text-[#a88828]">
              Every finish after unlock is dated here. Re-enter Extreme Puzzle anytime (code only needed once).
            </p>
            <ScoreHistory attempts={history} />
          </div>

          <SourceList title="CORRELATIONS (GROUP-LEVEL)" items={EXTREME_PUZZLE_CORRELATIONS} />
          <SourceList title="SOURCES" items={EXTREME_PUZZLE_SOURCES} />

          <button
            type="button"
            onClick={onExit}
            className="w-full border-2 border-game-yellow px-3 py-3 font-pixel text-[10px] text-game-yellow hover:bg-game-yellow hover:text-game-bg"
          >
            BACK TO TITLE
          </button>
        </section>
      </div>
    );
  }

  if (phase === "age") {
    return (
      <section className="mx-auto flex min-h-[420px] w-full max-w-md flex-col justify-center gap-4 rounded-lg border-4 border-game-yellow bg-game-bg p-6 text-[#f8f0c8] shadow-[0_0_0_4px_#181010]">
        <p className="text-center font-pixel text-[12px] tracking-[0.22em] text-game-yellow">
          EXTREME PUZZLE
        </p>
        <p className="text-center font-pixel text-[9px] leading-relaxed text-[#c8a048]">
          Untimed · 52 items · enter age for TRI/JCTI age-referenced scoring
        </p>
        {loadError && (
          <p className="rounded border border-game-hp/50 bg-game-hp/10 px-3 py-2 font-pixel text-[8px] leading-relaxed text-game-hp">
            {loadError}
          </p>
        )}
        <label className="block space-y-1">
          <span className="font-pixel text-[8px] tracking-[0.14em] text-[#f8d030]">AGE · YEARS</span>
          <input
            type="number"
            min={6}
            max={120}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full border-2 border-[#a88828] bg-[#181008] px-3 py-2 font-pixel text-[12px] text-[#f8f0c8] outline-none focus:border-game-yellow"
          />
        </label>
        <label className="block space-y-1">
          <span className="font-pixel text-[8px] tracking-[0.14em] text-[#f8d030]">AGE · MONTHS (0–11)</span>
          <input
            type="number"
            min={0}
            max={11}
            value={months}
            onChange={(e) => setMonths(Math.max(0, Math.min(11, Number(e.target.value))))}
            className="w-full border-2 border-[#a88828] bg-[#181008] px-3 py-2 font-pixel text-[12px] text-[#f8f0c8] outline-none focus:border-game-yellow"
          />
        </label>
        <p className="font-pixel text-[8px] text-[#a88828]">Band: {band.label}</p>
        {history.length > 0 && (
          <p className="font-pixel text-[7px] text-[#c8a048]">
            {history.length} prior attempt{history.length === 1 ? "" : "s"} on this device · latest{" "}
            {formatAttemptDate(history[0]!.at)} · raw {history[0]!.rawScore}/{history[0]!.total}
          </p>
        )}
        <button
          type="button"
          disabled={!answers}
          onClick={startPlay}
          className="border-2 border-[#38c060] px-3 py-3 font-pixel text-[11px] text-[#38c060] transition hover:bg-[#38c060] hover:text-game-bg disabled:opacity-40"
        >
          BEGIN · 52 ITEMS
        </button>
        <button
          type="button"
          onClick={onExit}
          className="border border-[#a88828] px-3 py-2 font-pixel text-[9px] text-[#a88828] hover:border-game-yellow hover:text-game-yellow"
        >
          CANCEL
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg border-4 border-game-yellow bg-[#ebebeb] text-[#201808] shadow-[0_0_0_4px_#181010]">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#6d7278]/40 bg-[#d8d8d8] px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-40 overflow-hidden rounded-sm bg-[#6d7278]">
            <div
              className="h-full bg-[#d08d74] transition-all"
              style={{ width: `${((index + 1) / EXTREME_PUZZLE_ITEM_COUNT) * 100}%` }}
            />
          </div>
          <span className="font-pixel text-[11px] tracking-wide text-[#4a5560]">
            Q{itemNumber}
          </span>
        </div>
        <span className="font-pixel text-[8px] text-[#6d7278]">
          {index + 1} / {EXTREME_PUZZLE_ITEM_COUNT}
        </span>
      </header>

      <div className="bg-[#ebebeb] px-2 py-3 sm:px-4">
        {imgOk ? (
          <img
            src={itemImageUrl(itemNumber)}
            alt={`Extreme Puzzle item ${itemNumber}`}
            className="mx-auto max-h-[min(68vh,820px)] w-auto max-w-full object-contain shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
            onError={() => setImgOk(false)}
            draggable={false}
          />
        ) : (
          <p className="py-16 text-center font-pixel text-[10px] text-[#8a3030]">
            Missing item image q{String(itemNumber).padStart(2, "0")}.png — extract from your PDF locally.
          </p>
        )}
      </div>

      <div className="space-y-3 border-t-2 border-[#6d7278]/30 bg-[#d8d8d8] px-3 py-3">
        <p className="font-pixel text-[8px] tracking-[0.12em] text-[#4a5560]">
          SELECT OPTION(S) 1–6 · some items need more than one
        </p>
        <div className="grid grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((n) => {
            const on = selected.includes(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggleOption(n)}
                className={cn(
                  "border-2 px-2 py-3 font-pixel text-[14px] transition",
                  on
                    ? "border-[#2a6a38] bg-[#38c060] text-[#102010]"
                    : "border-[#6d7278] bg-[#f4f4f4] text-[#201808] hover:border-[#d08d74]",
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={submitItem}
            className="flex-1 border-2 border-[#2a6a38] bg-[#38c060] px-3 py-3 font-pixel text-[11px] text-[#102010] hover:brightness-110"
          >
            {index >= EXTREME_PUZZLE_ITEM_COUNT - 1 ? "FINISH" : "NEXT"}
          </button>
          <button
            type="button"
            onClick={onExit}
            className="border-2 border-[#6d7278] px-3 py-3 font-pixel text-[9px] text-[#4a5560] hover:border-[#d08d74]"
          >
            ABORT
          </button>
        </div>
      </div>
    </section>
  );
}
