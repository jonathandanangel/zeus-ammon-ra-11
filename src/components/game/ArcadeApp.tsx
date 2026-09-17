import * as React from "react";
import { audio } from "@/game/audio";
import { useGame } from "@/game/store";
import { cn } from "@/lib/utils";
import {
  loadMemoryHighScores,
  saveMemoryHighScore,
  type MemoryGameId,
  type MemoryHighScores,
} from "@/game/memory-extreme/scores";
import { ElectricRecall } from "./ElectricRecall";
import { LightCycleGame } from "./LightCycleGame";
import { MemoryGauntlet } from "./MemoryGauntlet";
import { NeonMazeGame } from "./NeonMazeGame";

export type ArcadeGameId = MemoryGameId;

const GAMES: Array<{
  id: ArcadeGameId;
  label: string;
  blurb: string;
  scoreLabel: string;
}> = [
  {
    id: "grid-run",
    label: "EXTREME LIGHT CYCLE",
    blurb: "Light-cycle duel from the trivia intermissions.",
    scoreLabel: "High score",
  },
  {
    id: "neon-maze",
    label: "EXTREME PACMAN",
    blurb: "Clear pellets, dodge ghost programs — the trivia Pac-Man run.",
    scoreLabel: "High score",
  },
  {
    id: "electric-recall",
    label: "EXTREME RECALL",
    blurb: "Repeat the flashed pad sequence. Longer is harder.",
    scoreLabel: "High score",
  },
  {
    id: "memory-gauntlet",
    label: "EXTREME GAUNTLET",
    blurb: "Three-stage Extreme recall: grid, scatter, path lasers.",
    scoreLabel: "High score",
  },
];

export function ArcadeApp({
  onMenu,
  initialGame = null,
}: {
  onMenu: () => void;
  initialGame?: ArcadeGameId | null;
}) {
  const { settings } = useGame();
  const [scores, setScores] = React.useState<MemoryHighScores>(() => loadMemoryHighScores());
  const [play, setPlay] = React.useState<ArcadeGameId | null>(initialGame);
  const [recallLength, setRecallLength] = React.useState(8);
  const mazeScoreRef = React.useRef(0);

  React.useEffect(() => {
    audio.init();
    audio.resume();
  }, []);

  const record = React.useCallback((id: ArcadeGameId, score: number) => {
    setScores(saveMemoryHighScore(id, score));
  }, []);

  const backToHub = React.useCallback(() => setPlay(null), []);

  if (play === "grid-run") {
    const milestone = Math.max(1, scores["grid-run"] + 1);
    return (
      <div className="arcade-shell mx-auto flex w-full max-w-6xl flex-col gap-3 px-2 py-4">
        <HubChrome onBack={backToHub} title="EXTREME LIGHT CYCLE" />
        <LightCycleGame
          key={`cycle-${milestone}`}
          milestone={milestone}
          reducedMotion={settings.reducedMotion}
          onComplete={(outcome) => {
            if (outcome === "won") record("grid-run", milestone);
            backToHub();
          }}
        />
      </div>
    );
  }

  if (play === "neon-maze") {
    return (
      <div className="arcade-shell mx-auto flex w-full max-w-6xl flex-col gap-3 px-2 py-4">
        <HubChrome onBack={backToHub} title="EXTREME PACMAN" />
        <NeonMazeGame
          milestone={3}
          reducedMotion={settings.reducedMotion}
          onScoreChange={(value) => {
            mazeScoreRef.current = value;
          }}
          onComplete={() => {
            record("neon-maze", mazeScoreRef.current);
            backToHub();
          }}
        />
      </div>
    );
  }

  if (play === "electric-recall") {
    return (
      <div className="arcade-shell mx-auto flex w-full max-w-3xl flex-col gap-3 px-2 py-4">
        <HubChrome onBack={backToHub} title="EXTREME RECALL" />
        <div className="flex flex-wrap items-center gap-2 px-1">
          <label className="font-mono text-[10px] uppercase tracking-widest text-cyan/80">
            Length
            <select
              className="ml-2 rounded-sm border border-cyan/40 bg-deepblue/60 px-2 py-1 text-moon"
              value={recallLength}
              onChange={(e) => setRecallLength(Number(e.target.value))}
            >
              {[5, 8, 11, 14].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ElectricRecall
          key={`recall-${recallLength}`}
          length={recallLength}
          questionNumber={recallLength >= 11 ? 160 : 40}
          reducedMotion={settings.reducedMotion}
          onEvolved={() => undefined}
          onResult={(won) => {
            if (won) record("electric-recall", recallLength);
            window.setTimeout(backToHub, 400);
          }}
        />
      </div>
    );
  }

  if (play === "memory-gauntlet") {
    return (
      <div className="arcade-shell mx-auto flex w-full max-w-3xl flex-col gap-3 px-2 py-4">
        <HubChrome onBack={backToHub} title="EXTREME GAUNTLET" />
        <MemoryGauntlet
          reducedMotion={settings.reducedMotion}
          hp={11}
          banner="EXTREME GAUNTLET"
          onOvercharge={() => undefined}
          onDamage={() => undefined}
          onComplete={(score) => {
            record("memory-gauntlet", score);
            backToHub();
          }}
          onAbort={(score) => {
            record("memory-gauntlet", score);
            backToHub();
          }}
        />
      </div>
    );
  }

  return (
    <div className="arcade-shell mx-auto flex w-full max-w-5xl flex-col gap-5 px-3 py-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            ZEUS AMMON-RA 11
          </p>
          <h1 className="zeus-topic-title mt-2 font-display text-2xl tracking-[0.06em] text-cyan sm:text-3xl">
            Arcade
          </h1>
          <p className="mt-2 max-w-xl font-mono text-[12px] leading-relaxed text-muted-foreground">
            Memory games found in the trivia — separate high score for each.
          </p>
        </div>
        <button
          type="button"
          onClick={onMenu}
          className={cn(
            "zeus-topic-btn zeus-topic-btn--arcade rounded-sm border border-cyan/65 bg-black/30 px-5 py-3",
            "font-display text-sm uppercase tracking-[0.18em] text-cyan",
            "hover:bg-cyan/15 shadow-[0_0_24px_rgba(37,217,255,0.22)]",
          )}
        >
          <span className="zeus-topic-btn-label relative z-[1]">Main menu</span>
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => {
              audio.play("select");
              mazeScoreRef.current = 0;
              setPlay(game.id);
            }}
            className={cn(
              "zeus-topic-btn zeus-topic-btn--arcade rounded-sm border border-cyan/65 bg-black/30 px-5 py-4 text-left",
              "font-display text-sm uppercase tracking-[0.18em] text-cyan",
              "hover:bg-cyan/15 shadow-[0_0_24px_rgba(37,217,255,0.22)]",
            )}
          >
            <span className="zeus-topic-btn-label relative z-[1]">{game.label}</span>
            <span className="relative z-[1] mt-1 block font-mono text-[10px] normal-case tracking-normal text-muted-foreground">
              {game.blurb}
            </span>
            <span className="relative z-[1] mt-2 block font-mono text-[10px] uppercase tracking-widest text-moon/80">
              {game.scoreLabel}: <span className="text-cyan">{scores[game.id]}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function HubChrome({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan">
        Arcade · {title}
      </p>
      <button
        type="button"
        onClick={onBack}
        className={cn(
          "zeus-topic-btn zeus-topic-btn--arcade rounded-sm border border-cyan/50 bg-black/30 px-4 py-2",
          "font-mono text-[10px] uppercase tracking-widest text-cyan hover:bg-cyan/15",
        )}
      >
        Hub
      </button>
    </div>
  );
}
