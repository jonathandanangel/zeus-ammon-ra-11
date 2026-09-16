import * as React from "react";
import { Finale } from "@/components/game/Finale";
import { WorldBackground } from "@/components/game/WorldBackground";
import moonPortraitUrl from "@/assets/seus-moon.png";
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

const HALLOWEEN_NUMBERS = [
  { text: "666", top: "6%", left: "4%", size: "1.6rem", delay: "0s" },
  { text: "666", top: "12%", left: "38%", size: "3.2rem", delay: "0.4s", big: true },
  { text: "666", top: "18%", right: "28%", size: "1.1rem", delay: "1.1s" },
  { text: "666", top: "44%", left: "8%", size: "2.4rem", delay: "0.7s" },
  { text: "666", top: "58%", right: "12%", size: "1.4rem", delay: "1.5s" },
  { text: "666", top: "78%", left: "22%", size: "4rem", delay: "0.2s", big: true },
  { text: "666", top: "86%", right: "6%", size: "1.2rem", delay: "1.8s" },
  { text: "676", top: "8%", left: "18%", size: "1.3rem", delay: "0.3s" },
  { text: "676", top: "28%", left: "52%", size: "2.1rem", delay: "1.2s" },
  { text: "676", top: "48%", right: "30%", size: "1.5rem", delay: "0.6s" },
  { text: "676", top: "68%", left: "3%", size: "2.8rem", delay: "1.4s", big: true },
  { text: "676", top: "82%", left: "48%", size: "1.1rem", delay: "0.9s" },
  { text: "69", top: "10%", left: "62%", size: "1.4rem", delay: "0.5s" },
  { text: "69", top: "34%", left: "14%", size: "2rem", delay: "1.6s" },
  { text: "69", top: "52%", left: "40%", size: "1.2rem", delay: "0.1s" },
  { text: "69", top: "70%", right: "22%", size: "2.6rem", delay: "1.0s", big: true },
  { text: "69", top: "90%", left: "10%", size: "1.3rem", delay: "1.7s" },
  { text: "13", top: "5%", right: "40%", size: "1.5rem", delay: "0.8s" },
  { text: "13", top: "22%", left: "28%", size: "1.1rem", delay: "1.3s" },
  { text: "13", top: "40%", right: "8%", size: "2.2rem", delay: "0.25s" },
  { text: "13", top: "62%", left: "30%", size: "1.6rem", delay: "1.9s" },
  { text: "13", top: "84%", right: "38%", size: "3rem", delay: "0.55s", big: true },
] as const;

const FLOAT_GLYPHS = [
  { kind: "star" as const, top: "4%", left: "6%", size: 28, delay: "0s" },
  { kind: "penta" as const, top: "8%", right: "22%", size: 42, delay: "0.4s" },
  { kind: "star" as const, top: "22%", left: "2%", size: 22, delay: "1.1s" },
  { kind: "penta" as const, top: "30%", left: "16%", size: 34, delay: "0.7s" },
  { kind: "star" as const, top: "38%", right: "4%", size: 26, delay: "1.6s" },
  { kind: "penta" as const, top: "50%", left: "5%", size: 48, delay: "0.2s" },
  { kind: "star" as const, top: "56%", right: "18%", size: 30, delay: "1.3s" },
  { kind: "penta" as const, top: "72%", right: "8%", size: 38, delay: "0.9s" },
  { kind: "star" as const, top: "80%", left: "12%", size: 24, delay: "1.8s" },
  { kind: "penta" as const, top: "88%", left: "40%", size: 32, delay: "0.5s" },
];

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

function DevilHorns({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 90" className={className} aria-hidden>
      <path
        d="M28 78 C 18 52, 8 28, 22 8 C 36 22, 48 48, 58 78 Z"
        fill="#7a0000"
        stroke="#ff2020"
        strokeWidth="3"
      />
      <path
        d="M172 78 C 182 52, 192 28, 178 8 C 164 22, 152 48, 142 78 Z"
        fill="#7a0000"
        stroke="#ff2020"
        strokeWidth="3"
      />
      <path d="M34 18 L 22 2" stroke="#ff4040" strokeWidth="3" strokeLinecap="round" />
      <path d="M166 18 L 178 2" stroke="#ff4040" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Distant silhouette — figure on a cross on the far horizon. */
function DistantCrucifix({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 140" className={className} aria-hidden>
      <line x1="40" y1="8" x2="40" y2="132" stroke="#2a1810" strokeWidth="5" />
      <line x1="14" y1="36" x2="66" y2="36" stroke="#2a1810" strokeWidth="5" />
      {/* figure */}
      <circle cx="40" cy="28" r="7" fill="#1a100c" />
      <line x1="40" y1="34" x2="40" y2="78" stroke="#1a100c" strokeWidth="4" />
      <line x1="40" y1="42" x2="18" y2="38" stroke="#1a100c" strokeWidth="3.5" />
      <line x1="40" y1="42" x2="62" y2="38" stroke="#1a100c" strokeWidth="3.5" />
      <line x1="40" y1="78" x2="28" y2="108" stroke="#1a100c" strokeWidth="3.5" />
      <line x1="40" y1="78" x2="52" y2="108" stroke="#1a100c" strokeWidth="3.5" />
    </svg>
  );
}

/** Colossal titan / giant silhouettes (AoT-inspired, original shapes). */
function TitanGiant({ className, variant = 0 }: { className?: string; variant?: number }) {
  if (variant === 1) {
    return (
      <svg viewBox="0 0 160 320" className={className} aria-hidden>
        <ellipse cx="80" cy="48" rx="34" ry="40" fill="#1a0808" />
        <path d="M46 80 L30 200 L52 200 L60 110 L100 110 L108 200 L130 200 L114 80 Z" fill="#220a0a" />
        <path d="M52 200 L40 310 L70 310 L72 210 Z" fill="#180606" />
        <path d="M108 200 L90 310 L120 310 L130 210 Z" fill="#180606" />
        <path d="M30 120 L8 190 L28 195 L48 130 Z" fill="#1a0808" />
        <path d="M130 120 L152 190 L132 195 L112 130 Z" fill="#1a0808" />
        <circle cx="68" cy="42" r="4" fill="#ff3030" opacity="0.7" />
        <circle cx="92" cy="42" r="4" fill="#ff3030" opacity="0.7" />
      </svg>
    );
  }
  if (variant === 2) {
    return (
      <svg viewBox="0 0 140 300" className={className} aria-hidden>
        <ellipse cx="70" cy="40" rx="28" ry="34" fill="#1c0909" />
        <path d="M42 70 L28 175 L50 175 L55 95 L85 95 L90 175 L112 175 L98 70 Z" fill="#240c0c" />
        <path d="M50 175 L38 290 L62 290 L64 185 Z" fill="#160505" />
        <path d="M90 175 L78 290 L102 290 L112 185 Z" fill="#160505" />
        <path d="M28 100 L4 160 L22 168 L44 112 Z" fill="#1c0909" />
        <path d="M112 100 L136 155 L118 165 L96 112 Z" fill="#1c0909" />
        <circle cx="60" cy="36" r="3.5" fill="#ff4040" opacity="0.65" />
        <circle cx="80" cy="36" r="3.5" fill="#ff4040" opacity="0.65" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 180 340" className={className} aria-hidden>
      <ellipse cx="90" cy="52" rx="40" ry="46" fill="#1a0707" />
      <path d="M50 90 L32 210 L58 210 L68 120 L112 120 L122 210 L148 210 L130 90 Z" fill="#260c0c" />
      <path d="M58 210 L42 330 L78 330 L80 220 Z" fill="#140404" />
      <path d="M122 210 L100 330 L138 330 L148 220 Z" fill="#140404" />
      <path d="M32 130 L2 210 L26 218 L54 140 Z" fill="#1a0707" />
      <path d="M148 130 L178 205 L154 216 L126 140 Z" fill="#1a0707" />
      <circle cx="76" cy="46" r="5" fill="#ff2020" opacity="0.75" />
      <circle cx="104" cy="46" r="5" fill="#ff2020" opacity="0.75" />
      <path d="M70 68 Q90 78 110 68" stroke="#ff3030" strokeWidth="2" fill="none" opacity="0.5" />
    </svg>
  );
}

function NukeMushroom() {
  return (
    <div className="extreme-nuke" aria-hidden>
      <div className="extreme-nuke__flash" />
      <svg viewBox="0 0 240 280" className="extreme-nuke__cloud">
        <defs>
          <radialGradient id="nukeCap" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#fff4c8" />
            <stop offset="35%" stopColor="#ffb040" />
            <stop offset="70%" stopColor="#ff4020" />
            <stop offset="100%" stopColor="#601000" stopOpacity="0.2" />
          </radialGradient>
          <linearGradient id="nukeStem" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd080" />
            <stop offset="50%" stopColor="#ff6020" />
            <stop offset="100%" stopColor="#401008" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <ellipse cx="120" cy="70" rx="95" ry="55" fill="url(#nukeCap)" opacity="0.9" />
        <ellipse cx="70" cy="85" rx="40" ry="28" fill="#ff8040" opacity="0.75" />
        <ellipse cx="170" cy="82" rx="38" ry="26" fill="#ff6030" opacity="0.7" />
        <path d="M95 90 C 88 140, 85 190, 78 260 L 162 260 C 155 190, 152 140, 145 90 Z" fill="url(#nukeStem)" opacity="0.85" />
        <ellipse cx="120" cy="255" rx="70" ry="18" fill="#ff4010" opacity="0.35" />
      </svg>
    </div>
  );
}

function RuinedCity() {
  return (
    <svg viewBox="0 0 1200 320" preserveAspectRatio="none" className="extreme-ruin-city" aria-hidden>
      <g fill="#0a0404" stroke="#3a1010" strokeWidth="1.2" opacity="0.92">
        {/* broken skyline — jagged tops */}
        <path d="M0 320 L0 140 L40 140 L40 90 L55 110 L70 70 L70 140 L120 140 L120 60 L135 95 L150 40 L150 160 L210 160 L210 100 L230 130 L250 80 L250 170 L320 170 L320 50 L340 90 L360 30 L380 100 L400 55 L400 180 L480 180 L480 70 L500 120 L520 45 L540 110 L560 80 L560 200 L640 200 L640 90 L670 140 L700 40 L720 100 L740 60 L740 210 L820 210 L820 100 L850 150 L880 55 L900 120 L920 70 L920 190 L1000 190 L1000 85 L1030 130 L1060 50 L1080 110 L1100 75 L1100 220 L1160 220 L1160 120 L1200 120 L1200 320 Z" />
        {/* rubble piles */}
        <path d="M80 280 L120 240 L160 290 L200 250 L240 300 Z" fill="#120606" />
        <path d="M500 300 L560 250 L620 295 L680 255 L740 310 Z" fill="#120606" />
        <path d="M900 290 L960 245 L1020 300 L1080 260 L1140 310 Z" fill="#120606" />
      </g>
      {/* window fires */}
      {[110, 280, 450, 620, 790, 960, 1100].map((x) => (
        <rect key={x} x={x} y={170 + (x % 40)} width="8" height="12" fill="#ff6020" opacity="0.7">
          <animate attributeName="opacity" values="0.4;0.9;0.35;0.8" dur={`${1.4 + (x % 7) * 0.15}s`} repeatCount="indefinite" />
        </rect>
      ))}
    </svg>
  );
}

function ExtremeHalloweenBackdrop() {
  return (
    <div className="extreme-halloween-scene" aria-hidden>
      <div className="extreme-halloween-fog" />
      <div className="extreme-halloween-embers" />

      <NukeMushroom />

      {/* far crucifixion on the horizon */}
      <div className="extreme-crucifix">
        <DistantCrucifix />
      </div>

      {/* colossal titans behind the ruin line */}
      <div className="extreme-titans">
        <TitanGiant className="extreme-titan extreme-titan--a" variant={0} />
        <TitanGiant className="extreme-titan extreme-titan--b" variant={1} />
        <TitanGiant className="extreme-titan extreme-titan--c" variant={2} />
      </div>

      <div className="extreme-ruin-wrap">
        <RuinedCity />
        <div className="extreme-lava inferno-lava inferno-lava--flow" />
        <div className="extreme-lava-streaks inferno-lava-streaks inferno-lava-streaks--flow" />
      </div>

      <div className="extreme-halloween-glyphs">
        {FLOAT_GLYPHS.map((g, i) => {
          const style = {
            top: g.top,
            left: "left" in g ? g.left : undefined,
            right: "right" in g ? g.right : undefined,
            width: g.size,
            height: g.size,
            animationDelay: g.delay,
          } as React.CSSProperties;
          return g.kind === "penta" ? (
            <InvertedPentagram key={`g-${i}`} className="extreme-halloween-glyph" style={style} />
          ) : (
            <UpsideDownStar
              key={`g-${i}`}
              className="extreme-halloween-glyph"
              style={{ ...style, transform: "rotate(180deg)" }}
            />
          );
        })}
        {HALLOWEEN_NUMBERS.map((n, i) => (
          <span
            key={`n-${i}`}
            className={cn("extreme-halloween-number", "big" in n && n.big && "extreme-halloween-number--big")}
            style={
              {
                top: n.top,
                left: "left" in n ? n.left : undefined,
                right: "right" in n ? n.right : undefined,
                fontSize: "big" in n && n.big ? undefined : n.size,
                animationDelay: n.delay,
              } as React.CSSProperties
            }
          >
            {n.text}
          </span>
        ))}
      </div>

      <div className="extreme-seus-moon">
        <DevilHorns className="extreme-seus-moon__horns" />
        <div className="extreme-seus-moon__face">
          <img src={moonPortraitUrl} alt="" />
        </div>
      </div>
      <div className="extreme-theta-watermark" aria-hidden>
        Θ
      </div>
    </div>
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
  "relative z-[1] mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-lg border-4 border-game-yellow bg-game-bg p-5 text-center text-[#f8f0c8] shadow-[0_0_0_4px_#181010] sm:p-8";

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
    const worldProgress =
      phase === "play"
        ? (index + 1) / EXTREME_PUZZLE_ITEM_COUNT
        : phase === "rocket"
          ? 1
          : 0.55;

    return (
      <div className="relative min-h-[min(92vh,900px)] font-pixel">
        {/* Scary Extreme backdrop only — GUI stays Legend of Triangles gold */}
        <WorldBackground
          progress={worldProgress}
          scanlines={settings.scanlines}
          reducedMotion={settings.reducedMotion}
          bloodMoon
          psychedelic
          inferno
        />
        <ExtremeHalloweenBackdrop />
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
    <section className="relative z-[1] mx-auto w-full max-w-3xl overflow-hidden rounded-lg border-4 border-game-yellow bg-game-bg text-[#f8f0c8] shadow-[0_0_0_4px_#181010]">
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
