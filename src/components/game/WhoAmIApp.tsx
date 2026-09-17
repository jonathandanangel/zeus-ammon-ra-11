import * as React from "react";
import { cn } from "@/lib/utils";
import type { AkiClientState, AkiSessionState } from "@/game/who-am-i/akinator";

async function callAkinator(payload: Record<string, unknown>): Promise<AkiClientState> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const res = await fetch(`${origin}/api/akinator`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const json = (await res.json()) as AkiClientState;
  return json;
}

const FALLBACK_ANSWERS = ["Yes", "No", "Don't know", "Probably", "Probably not"];

export function WhoAmIApp({ onMenu }: { onMenu: () => void }) {
  const [busy, setBusy] = React.useState(false);
  const [session, setSession] = React.useState<AkiSessionState | null>(null);
  const [state, setState] = React.useState<AkiClientState | null>(null);
  const [status, setStatus] = React.useState("Think of a real or fictional character. Press Start.");

  const btn =
    "rounded-sm border border-cyan/50 bg-deepblue/50 backdrop-blur-md px-4 py-2 font-display text-xs uppercase tracking-[0.18em] text-cyan transition hover:bg-cyan/20 hover:text-moon disabled:opacity-40";
  const answerBtn =
    "rounded-sm border border-cyan/40 bg-black/35 px-4 py-3 text-left font-display text-sm uppercase tracking-[0.14em] text-moon transition hover:border-cyan hover:bg-cyan/15 disabled:opacity-40";

  const apply = (next: AkiClientState) => {
    setState(next);
    if (next.session) setSession(next.session);
    if (!next.ok) {
      setStatus(next.errorMessage || "Something went wrong.");
      return;
    }
    if (next.phase === "guess") {
      setStatus(`I think of… ${next.guess?.name ?? "someone"}`);
      return;
    }
    setStatus(`Question ${next.step + 1} · confidence ${Math.round(next.progress)}%`);
  };

  const start = async () => {
    setBusy(true);
    setStatus("Opening Akinator session…");
    try {
      const next = await callAkinator({ action: "start", region: "en", childMode: false });
      apply(next);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to start.");
    } finally {
      setBusy(false);
    }
  };

  const answer = async (answerId: number) => {
    if (!session || busy) return;
    setBusy(true);
    try {
      const next = await callAkinator({ action: "answer", session, answer: answerId });
      apply(next);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Answer failed.");
    } finally {
      setBusy(false);
    }
  };

  const back = async () => {
    if (!session || busy) return;
    setBusy(true);
    try {
      const next = await callAkinator({ action: "back", session });
      apply(next);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Back failed.");
    } finally {
      setBusy(false);
    }
  };

  const continuePlay = async () => {
    if (!session || busy) return;
    setBusy(true);
    setStatus("Continuing…");
    try {
      const next = await callAkinator({ action: "continue", session });
      apply(next);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Continue failed.");
    } finally {
      setBusy(false);
    }
  };

  const labels = state?.answers?.length === 5 ? state.answers : FALLBACK_ANSWERS;
  const progress = Math.min(100, Math.max(0, Math.round(state?.progress ?? 0)));

  return (
    <div className="extreme-shell relative mx-auto flex w-full max-w-3xl flex-col gap-4 px-2 py-4">
      <header className="zeus-outline-box overflow-hidden rounded-sm border border-cyan/55 bg-deepblue/50 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan/25 px-4 py-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-magenta">
              ZEUS AMMON-RA 11 · WHO AM I?
            </p>
            <h1 className="mt-1 font-display text-xl uppercase tracking-[0.16em] text-cyan text-glow sm:text-2xl">
              Akinator
            </h1>
            <p className="mt-1 max-w-xl font-mono text-[10px] leading-relaxed text-muted-foreground">
              Answer yes / no style questions. The genie tries to guess who (or what) you are thinking of.
              Uses{" "}
              <a
                className="text-cyan underline"
                href="https://github.com/jgoralcz/aki-api"
                target="_blank"
                rel="noreferrer"
              >
                aki-api
              </a>
              .
            </p>
          </div>
          <button type="button" onClick={onMenu} className={cn(btn, "border-amber/50 text-amber hover:bg-amber/15")}>
            Main menu
          </button>
        </div>
        <div className="px-4 py-2 font-mono text-[11px] text-muted-foreground">{status}</div>
      </header>

      <section className="zeus-outline-box space-y-4 rounded-sm border border-cyan/40 bg-deepblue/45 p-5 backdrop-blur-md">
        {!state || state.phase === "error" ? (
          <div className="space-y-4 text-center">
            <p className="font-mono text-sm text-moon">
              Think of a character — real, fictional, celebrity, game hero, myth…
            </p>
            {state?.errorMessage ? (
              <p className="rounded-sm border border-amber/40 bg-amber/10 px-3 py-2 font-mono text-[11px] text-amber">
                {state.errorMessage}
              </p>
            ) : null}
            <button type="button" className={btn} disabled={busy} onClick={() => void start()}>
              {busy ? "Starting…" : "Start"}
            </button>
          </div>
        ) : null}

        {state?.phase === "question" ? (
          <div className="space-y-4">
            <div className="h-2 w-full overflow-hidden rounded-sm bg-black/40">
              <div
                className="h-full bg-cyan/70 transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-display text-lg leading-snug text-moon sm:text-xl">{state.question}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {labels.map((label, i) => (
                <button
                  key={`${i}-${label}`}
                  type="button"
                  className={answerBtn}
                  disabled={busy}
                  onClick={() => void answer(i)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={btn} disabled={busy || (state.step ?? 0) < 1} onClick={() => void back()}>
                Back
              </button>
              <button type="button" className={btn} disabled={busy} onClick={() => void start()}>
                New game
              </button>
            </div>
          </div>
        ) : null}

        {state?.phase === "guess" && state.guess ? (
          <div className="flex flex-col items-center gap-4 text-center">
            {state.guess.photo ? (
              <img
                src={state.guess.photo}
                alt=""
                className="max-h-48 rounded-sm border border-cyan/40 object-contain"
                decoding="async"
              />
            ) : null}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-magenta">I guess</p>
              <h2 className="mt-1 font-display text-2xl text-cyan text-glow">{state.guess.name}</h2>
              {state.guess.description ? (
                <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
                  {state.guess.description}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" className={btn} disabled={busy} onClick={() => void start()}>
                Correct · play again
              </button>
              <button type="button" className={btn} disabled={busy} onClick={() => void continuePlay()}>
                Wrong · keep going
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <p className="text-center font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
        {state?.credit ?? "Powered by Akinator via aki-api"}
      </p>
    </div>
  );
}
