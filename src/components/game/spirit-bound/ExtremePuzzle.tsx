import * as React from "react";
import { Finale } from "@/components/game/Finale";
import {
  itemImageUrl,
  loadExtremePuzzleAnswers,
  type ExtremePuzzleAnswers,
  type ExtremePuzzleResult,
} from "@/game/extreme-puzzle/assets";
import { BUNDLED_ANSWER_KEY } from "@/game/extreme-puzzle/answer-key";
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
import {
  playSfx,
  startExtremePuzzleMusic,
  startMusic,
  stopExtremePuzzleMusic,
} from "@/game/spirit-bound/shrine/audio";
import { audio } from "@/game/audio";
import { useGame } from "@/game/store";
import {
  formatAttemptDate,
  loadExtremePuzzleHistory,
  recordExtremePuzzleAttempt,
  type ExtremePuzzleAttempt,
} from "@/storage/spirit-bound/extreme-puzzle";
import { cn } from "@/lib/utils";

type Phase = "hebrew" | "warning" | "age" | "play" | "rocket";

type Props = {
  onExit: () => void;
};

/** Rapid Hebrew flashes — “Test of Induction” */
const HEBREW_INDUCTION_LINES = [
  "מבחן אינדוקציה",
  "מבחן אינדוקציה",
  "בחינת אינדוקציה",
  "מבחן אינדוקציה",
  "מבחן החשיבה האינדוקטיבית",
  "מבחן אינדוקציה",
  "מבחן אינדוקציה",
  "מבחן אינדוקציה",
] as const;

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
              className="mt-0.5 block break-all text-[#48a0f8] underline decoration-[#48a0f8]/40 underline-offset-2 hover:text-game-yellow"
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

function NumberRibbon({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-center font-pixel text-[9px] tracking-[0.28em] text-[#ff4040]",
        className,
      )}
      aria-hidden
    >
      666 · 676 · 69 · 13 · 666 · 676 · 69 · 13 · 666
    </p>
  );
}

function ThetaLogo({ className, size = "hero" }: { className?: string; size?: "hero" | "flash" | "mark" }) {
  return (
    <div
      className={cn(
        "extreme-theta-logo extreme-theta-logo--gold select-none text-center leading-none",
        size === "hero" && "extreme-theta-logo--hero",
        size === "flash" && "extreme-theta-logo--flash",
        size === "mark" && "extreme-theta-logo--mark",
        className,
      )}
      aria-hidden
    >
      Θ
    </div>
  );
}

/** Legend of Triangles golden-ink chrome */
const goldBtn =
  "relative z-10 w-full border-2 border-game-yellow bg-[#3a2808] px-3 py-3 font-pixel text-[11px] text-game-yellow transition hover:bg-game-yellow hover:text-game-bg";
const goldBtnGhost =
  "relative z-10 w-full border border-[#a88828] px-3 py-2 font-pixel text-[9px] text-[#a88828] transition hover:border-game-yellow hover:text-game-yellow";
const goldField =
  "w-full border-2 border-[#a88828] bg-[#100808] px-3 py-2 font-pixel text-[11px] text-[#f8f0c8] outline-none focus:border-game-yellow";
const goldPanel =
  "relative z-[1] mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-sm border border-[#39ff14]/75 bg-game-bg p-5 text-center text-[#f8f0c8] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_rgba(0,0,0,0.45)] sm:p-8";

export function ExtremePuzzle({ onExit }: Props) {
  const { settings, progress } = useGame();
  const [phase, setPhase] = React.useState<Phase>("hebrew");
  const [hebrewLine, setHebrewLine] = React.useState(0);
  const [years, setYears] = React.useState(25);
  const [months, setMonths] = React.useState(0);
  const [answers, setAnswers] = React.useState<ExtremePuzzleAnswers>(() => ({ ...BUNDLED_ANSWER_KEY }));
  const [loadError, setLoadError] = React.useState("");
  const [ageError, setAgeError] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [result, setResult] = React.useState<ExtremePuzzleResult | null>(null);
  const [history, setHistory] = React.useState<ExtremePuzzleAttempt[]>(() => loadExtremePuzzleHistory().attempts);
  const [imgOk, setImgOk] = React.useState(true);

  React.useEffect(() => {
    // Kill title / HT MP3 beds so only the custom Extreme Puzzle chiptune plays.
    audio.silenceBackground();
    startExtremePuzzleMusic();
    return () => {
      stopExtremePuzzleMusic();
      startMusic();
    };
  }, []);

  React.useEffect(() => {
    if (phase !== "hebrew") return;
    playSfx("spirits");
    let line = 0;
    const flash = window.setInterval(() => {
      line += 1;
      if (line >= HEBREW_INDUCTION_LINES.length) {
        window.clearInterval(flash);
        setPhase("warning");
        return;
      }
      setHebrewLine(line);
      if (line === 3 || line === 6) playSfx("spirits");
    }, 140);
    const done = window.setTimeout(() => {
      window.clearInterval(flash);
      setPhase("warning");
    }, HEBREW_INDUCTION_LINES.length * 140 + 180);
    return () => {
      window.clearInterval(flash);
      window.clearTimeout(done);
    };
  }, [phase]);

  React.useEffect(() => {
    let alive = true;
    void (async () => {
      const data = await loadExtremePuzzleAnswers();
      if (!alive) return;
      setAnswers(data);
      // Soft notice only — play still works via bundled key
      try {
        const probe = await fetch(itemImageUrl(1), { method: "HEAD", cache: "no-store" });
        if (!probe.ok) {
          setLoadError(
            "Item images not found locally. Run scripts/extract-tri52.py once for q01–q52.png (gitignored). Scoring still works.",
          );
        }
      } catch {
        setLoadError(
          "Item images not found locally. Run scripts/extract-tri52.py once for q01–q52.png (gitignored). Scoring still works.",
        );
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const itemNumber = index + 1;
  const band = AGE_BANDS[ageBandIndex(years, months)]!;

  React.useEffect(() => {
    setImgOk(true);
  }, [index]);

  function leave() {
    stopExtremePuzzleMusic();
    startMusic();
    onExit();
  }

  function acceptWarning() {
    playSfx("arcade");
    setPhase("age");
  }

  function startPlay() {
    const y = Math.floor(Number(years));
    const m = Math.floor(Number(months));
    if (!Number.isFinite(y) || y < 6) {
      playSfx("invalid");
      setAgeError("Enter age years 6 or older to begin.");
      return;
    }
    if (!Number.isFinite(m) || m < 0 || m > 11) {
      playSfx("invalid");
      setAgeError("Months must be 0–11.");
      return;
    }
    if (!answers) {
      playSfx("invalid");
      setAgeError("Answer key still loading — try again in a moment.");
      return;
    }
    setAgeError("");
    setYears(y);
    setMonths(m);
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
    if (!ok) playSfx("fail");

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
      stopExtremePuzzleMusic();
      startMusic();
      setPhase("rocket");
      return;
    }
    setCorrectCount(nextCorrect);
    setIndex((i) => i + 1);
    setSelected([]);
    setImgOk(true);
    playSfx("move");
  }

  function shell(children: React.ReactNode) {
    return (
      <div className="relative min-h-[min(92vh,900px)] font-pixel">
        {phase === "hebrew" && (
          <div className="extreme-hebrew-flash" aria-live="polite">
            <div className="flex flex-col items-center gap-4">
              <ThetaLogo size="flash" />
              <p className="extreme-hebrew-flash__text" lang="he" dir="rtl">
                {HEBREW_INDUCTION_LINES[hebrewLine] ?? HEBREW_INDUCTION_LINES[0]}
              </p>
              <p className="extreme-hebrew-flash__sub">666 · CAUTION · 676</p>
            </div>
          </div>
        )}
        <div className="extreme-puzzle-stage relative z-[1] space-y-3 py-2">{children}</div>
      </div>
    );
  }

  if (phase === "hebrew") {
    return shell(null);
  }

  if (phase === "warning") {
    return shell(
      <section className={goldPanel}>
        <div className="flex flex-col items-center leading-none text-game-yellow">
          <span className="text-[22px]">▲</span>
          <span className="-mt-1 text-[22px] tracking-[0.55em]">▲ ▲</span>
        </div>
        <ThetaLogo size="hero" />
        <h1 className="font-pixel text-[16px] uppercase tracking-[0.12em] text-game-yellow sm:text-[20px]">
          {EXTREME_PUZZLE_WARNING.title}
        </h1>
        <p className="font-pixel text-[9px] uppercase tracking-[0.18em] text-[#ff6060]">
          {EXTREME_PUZZLE_WARNING.subtitle}
        </p>
        <NumberRibbon />
        <p className="font-pixel text-[8px] text-[#a88828]">
          Extreme Puzzle · read before you continue
        </p>
        <ul className="space-y-2 text-left">
          {EXTREME_PUZZLE_WARNING.lines.map((line) => (
            <li
              key={line.slice(0, 48)}
              className="rounded border border-[#a88828]/40 bg-[#100808] px-3 py-2 font-pixel text-[8px] leading-relaxed text-[#f8f0c8]"
            >
              {line}
            </li>
          ))}
        </ul>
        {history.length > 0 && (
          <div className="space-y-2 text-left">
            <p className="font-pixel text-[9px] tracking-[0.16em] text-game-yellow">
              Prior attempts ({history.length})
            </p>
            <ScoreHistory attempts={history.slice(0, 5)} />
          </div>
        )}
        <button type="button" onClick={acceptWarning} className={goldBtn}>
          I UNDERSTAND · CONTINUE
        </button>
        <button type="button" onClick={leave} className={goldBtnGhost}>
          CANCEL · MAIN SCREEN
        </button>
      </section>,
    );
  }

  if (phase === "rocket" && result) {
    return shell(
      <>
        <Finale
          progress={progress}
          total={EXTREME_PUZZLE_ITEM_COUNT}
          reducedMotion={settings.reducedMotion}
          onReviewMissed={leave}
          onMastery={leave}
          onMenu={leave}
          extremeMission={{
            title: "EXTREME PUZZLE",
            score: result.ageReferencedScore ?? result.rawScore,
            correct: result.rawScore,
            total: result.total,
            continueLabel: "Back to main screen",
            onContinue: leave,
          }}
        />
        <section className={goldPanel}>
          <p className="font-pixel text-[9px] tracking-[0.2em] text-game-yellow">YOUR SCORE</p>
          <p className="font-pixel text-[18px] text-[#f8f0c8]">
            Raw {result.rawScore} / {result.total}
          </p>
          <p className="font-pixel text-[9px] text-[#c8a048]">
            Age-referenced ({result.ageBandLabel}):{" "}
            <span className="text-game-yellow">
              {result.ageReferencedScore === null ? "—" : result.ageReferencedScore}
            </span>
          </p>
          <p className="font-pixel text-[7px] text-[#a88828]">
            Age {result.ageYears}:{String(result.ageMonths).padStart(2, "0")} · saved{" "}
            {formatAttemptDate(history[0]?.at ?? new Date().toISOString())}
          </p>
          <div className="space-y-2 text-left">
            <p className="font-pixel text-[9px] tracking-[0.16em] text-game-yellow">Score history</p>
            <ScoreHistory attempts={history} />
          </div>
          <SourceList title="Correlations (group-level)" items={EXTREME_PUZZLE_CORRELATIONS} />
          <SourceList title="Sources" items={EXTREME_PUZZLE_SOURCES} />
          <button type="button" onClick={leave} className={goldBtn}>
            BACK TO MAIN SCREEN
          </button>
        </section>
      </>,
    );
  }

  if (phase === "age") {
    return shell(
      <section className={cn(goldPanel, "max-w-md")}>
        <ThetaLogo size="mark" />
        <h2 className="font-pixel text-[14px] tracking-[0.14em] text-game-yellow">EXTREME PUZZLE</h2>
        <p className="font-pixel text-[8px] leading-relaxed text-[#a88828]">
          Untimed · 52 items · enter age for age-referenced scoring
        </p>
        {loadError && (
          <p className="rounded border border-game-hp/50 bg-game-hp/10 px-3 py-2 font-pixel text-[8px] leading-relaxed text-game-hp">
            {loadError}
          </p>
        )}
        <label className="block space-y-1 text-left">
          <span className="font-pixel text-[8px] tracking-[0.14em] text-game-yellow">Age · years</span>
          <input
            type="number"
            min={6}
            max={120}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className={goldField}
          />
        </label>
        <label className="block space-y-1 text-left">
          <span className="font-pixel text-[8px] tracking-[0.14em] text-game-yellow">Age · months (0–11)</span>
          <input
            type="number"
            min={0}
            max={11}
            value={months}
            onChange={(e) => setMonths(Math.max(0, Math.min(11, Number(e.target.value))))}
            className={goldField}
          />
        </label>
        <p className="font-pixel text-[8px] text-[#a88828]">Band: {band.label}</p>
        {ageError && (
          <p className="rounded border border-game-hp/50 bg-game-hp/10 px-3 py-2 font-pixel text-[8px] leading-relaxed text-game-hp">
            {ageError}
          </p>
        )}
        {history.length > 0 && (
          <p className="font-pixel text-[7px] text-[#c8a048]">
            {history.length} prior attempt{history.length === 1 ? "" : "s"} · latest{" "}
            {formatAttemptDate(history[0]!.at)} · raw {history[0]!.rawScore}/{history[0]!.total}
          </p>
        )}
        <button type="button" onClick={startPlay} className={goldBtn}>
          BEGIN · 52 ITEMS
        </button>
        <button type="button" onClick={leave} className={goldBtnGhost}>
          CANCEL · MAIN SCREEN
        </button>
      </section>,
    );
  }

  return shell(
    <section className="relative z-[1] mx-auto w-full max-w-3xl overflow-hidden rounded-sm border border-[#39ff14]/75 bg-game-bg text-[#f8f0c8] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_rgba(0,0,0,0.45)]">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-game-yellow bg-[#201808] px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-40 overflow-hidden border border-game-yellow bg-[#100808]">
            <div
              className="h-full bg-game-yellow transition-all"
              style={{ width: `${((index + 1) / EXTREME_PUZZLE_ITEM_COUNT) * 100}%` }}
            />
          </div>
          <span className="font-pixel text-[10px] tracking-wide text-game-yellow">Q{itemNumber}</span>
        </div>
        <span className="font-pixel text-[8px] tracking-[0.16em] text-[#a88828]">
          {index + 1} / {EXTREME_PUZZLE_ITEM_COUNT}
        </span>
      </header>

      <div className="bg-black px-2 py-3 sm:px-4">
        {imgOk ? (
          <img
            key={itemNumber}
            src={itemImageUrl(itemNumber)}
            alt={`Extreme Puzzle item ${itemNumber}`}
            className="mx-auto max-h-[min(68vh,820px)] w-auto max-w-full object-contain shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
            onLoad={() => setImgOk(true)}
            onError={(e) => {
              const el = e.currentTarget;
              const fallback = `/extreme-puzzle/items/q${String(itemNumber).padStart(2, "0")}.png`;
              if (!el.src.endsWith(fallback)) {
                el.src = fallback;
                return;
              }
              setImgOk(false);
            }}
            draggable={false}
          />
        ) : (
          <p className="py-16 text-center font-pixel text-[9px] text-game-hp">
            Missing item image q{String(itemNumber).padStart(2, "0")}.png
          </p>
        )}
      </div>

      <div className="space-y-3 border-t-4 border-game-yellow bg-[#201808] px-3 py-3">
        <p className="font-pixel text-[8px] tracking-[0.12em] text-[#a88828]">
          Select option(s) 1–6 · some items need more than one
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
                    ? "border-game-yellow bg-game-yellow text-game-bg"
                    : "border-[#a88828] bg-[#100808] text-game-yellow hover:border-game-yellow",
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={submitItem} className={cn(goldBtn, "flex-1")}>
            {index >= EXTREME_PUZZLE_ITEM_COUNT - 1 ? "FINISH" : "NEXT"}
          </button>
          <button type="button" onClick={leave} className={cn(goldBtnGhost, "w-auto px-4")}>
            ABORT
          </button>
        </div>
      </div>
    </section>,
  );
}
