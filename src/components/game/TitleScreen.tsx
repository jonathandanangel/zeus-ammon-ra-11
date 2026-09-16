import * as React from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import magentaBrain from "@/assets/winged-brain.png";
import cyanBrain from "@/assets/winged-brain-cyan.png";
import solarBrain from "@/assets/winged-brain-solar.png";
import voltBrain from "@/assets/winged-brain-volt.png";

export interface TitleScreenProps {
  hasSave: boolean;
  onUnlockAudio: () => void;
  onStart: () => void;
  onResume: () => void;
  onPractice: () => void;
  onHighSpeed: () => void;
  onExtreme: () => void;
  onExtremeV2: () => void;
  onHeatTransferExtreme: () => void;
  onHeatTransferIntro: () => void;
  onSpiritBound: () => void;
  onNumericalExtreme: () => void;
  onVanityApp: () => void;
  onAiDetector: () => void;
  onSettings: () => void;
  onValidate: () => void;
}

const BRAIN_ASSETS = [
  magentaBrain,
  cyanBrain,
  solarBrain,
  voltBrain,
] as const;

/** Neon palettes — asset + hue shift so every open/cycle feels different. */
const BRAIN_LOOKS = [
  { asset: 0, hue: 0, glow: "rgba(236,72,153,0.65)", name: "magenta" },
  { asset: 1, hue: 0, glow: "rgba(34,211,238,0.65)", name: "cyan" },
  { asset: 2, hue: 0, glow: "rgba(251,191,36,0.6)", name: "solar" },
  { asset: 3, hue: 0, glow: "rgba(163,230,53,0.6)", name: "volt" },
  { asset: 0, hue: 40, glow: "rgba(255,90,200,0.6)", name: "hot-pink" },
  { asset: 1, hue: 55, glow: "rgba(120,255,200,0.55)", name: "aqua-mint" },
  { asset: 2, hue: -35, glow: "rgba(255,120,60,0.6)", name: "ember" },
  { asset: 3, hue: 90, glow: "rgba(180,120,255,0.6)", name: "violet" },
  { asset: 0, hue: 160, glow: "rgba(80,220,255,0.55)", name: "ice" },
  { asset: 1, hue: -80, glow: "rgba(255,70,140,0.6)", name: "rose" },
  { asset: 2, hue: 120, glow: "rgba(100,255,160,0.55)", name: "lime" },
  { asset: 3, hue: -120, glow: "rgba(255,200,80,0.55)", name: "gold" },
] as const;

function pickBrainLook(excludeName?: string) {
  const pool = excludeName
    ? BRAIN_LOOKS.filter((b) => b.name !== excludeName)
    : BRAIN_LOOKS;
  return pool[Math.floor(Math.random() * pool.length)] ?? BRAIN_LOOKS[0]!;
}

type Phase = "intro" | "landing";

type ModeSection = {
  id: string;
  eyebrow: string;
  title: string;
  blurb: string;
  accentClass: string;
  buttonClass: string;
  actions: Array<{
    label: string;
    sub?: string;
    onClick: () => void;
    show?: boolean;
    buttonClass?: string;
  }>;
};

export function TitleScreen(p: TitleScreenProps) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = React.useState<Phase>("intro");
  const [leaving, setLeaving] = React.useState(false);
  const [brain, setBrain] = React.useState(() => pickBrainLook());
  const [brainVisible, setBrainVisible] = React.useState(true);
  const fadingRef = React.useRef(false);
  const done = React.useRef(false);
  const landingRef = React.useRef<HTMLDivElement | null>(null);

  const FADE_MS = 700;

  const crossfadeBrain = React.useCallback(() => {
    if (fadingRef.current || reduced) {
      setBrain((prev) => pickBrainLook(prev.name));
      return;
    }
    fadingRef.current = true;
    setBrainVisible(false);
    window.setTimeout(() => {
      setBrain((prev) => pickBrainLook(prev.name));
      // next frame so the new asset paints before fade-in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setBrainVisible(true);
          fadingRef.current = false;
        });
      });
    }, FADE_MS);
  }, [reduced]);

  const enterLanding = React.useCallback(() => {
    if (done.current) return;
    done.current = true;
    p.onUnlockAudio();
    crossfadeBrain();
    if (reduced) {
      setPhase("landing");
      return;
    }
    setLeaving(true);
    window.setTimeout(() => setPhase("landing"), 700);
  }, [p, reduced, crossfadeBrain]);

  React.useEffect(() => {
    if (phase !== "intro" || reduced) return;
    const id = window.setInterval(crossfadeBrain, 3200);
    return () => window.clearInterval(id);
  }, [phase, reduced, crossfadeBrain]);

  React.useEffect(() => {
    if (phase !== "landing" || reduced) return;
    const id = window.setInterval(crossfadeBrain, 5200);
    return () => window.clearInterval(id);
  }, [phase, reduced, crossfadeBrain]);

  React.useEffect(() => {
    if (phase !== "landing") return;
    const id = window.setTimeout(() => {
      landingRef.current?.querySelector<HTMLElement>("[data-scroll-hint]")?.focus({ preventScroll: true });
    }, 400);
    return () => window.clearTimeout(id);
  }, [phase]);

  const brainSrc = BRAIN_ASSETS[brain.asset]!;
  const brainFilter = `hue-rotate(${brain.hue}deg) drop-shadow(0 0 48px ${brain.glow}) drop-shadow(0 0 90px ${brain.glow})`;

  const sections: ModeSection[] = [
    {
      id: "campaign",
      eyebrow: "Core path",
      title: "Flight Dynamics Trivia",
      blurb:
        "To help you remember everything in fluid mechanics and begin thinking about aerodynamics and flight and control.",
      accentClass: "from-cyan/25 via-transparent to-magenta/20 border-cyan/40",
      buttonClass:
        "border-cyan/50 text-cyan hover:bg-cyan/20 hover:text-moon shadow-[0_0_24px_rgba(34,211,238,0.15)]",
      actions: [
        { label: "Start new campaign", onClick: p.onStart },
        ...(p.hasSave ? [{ label: "Resume campaign", onClick: p.onResume }] : []),
        { label: "Practice mode", onClick: p.onPractice },
      ],
    },
    {
      id: "labs",
      eyebrow: "Labs",
      title: "High-Speed & Extreme Aero",
      blurb:
        "Extremely difficult on purpose meant to expand memory while increasing learning rate.",
      accentClass: "from-magenta/30 via-transparent to-fuchsia-500/20 border-magenta/45",
      buttonClass:
        "border-magenta/55 text-magenta hover:bg-magenta/20 extreme-menu-item shadow-[0_0_24px_rgba(236,72,153,0.18)]",
      actions: [
        { label: "High-Speed Lab", onClick: p.onHighSpeed },
        { label: "Aerodynamics Extreme", onClick: p.onExtreme },
        {
          label: "Aerodynamics Extreme V2",
          onClick: p.onExtremeV2,
          buttonClass:
            "border-[#e879f9]/65 text-[#e879f9] hover:bg-[#e879f9]/15 extreme-v2-menu-item shadow-[0_0_24px_rgba(232,121,249,0.22)]",
        },
      ],
    },
    {
      id: "heat",
      eyebrow: "Thermal",
      title: "Heat Transfer",
      blurb:
        "Music: Iasos – Crystal Vista (1981); Das Armageddon (2026) by キ aerzengel (@AERZENGEL). Related: Berdysh (@Berdysh66), Occult Tripping KVLT (@OccultTrippingCult), Shypunch (@Shypunch120), SERAPHRID (@seraphrid78787), Luxen (@Luxen420). Intro bed from Portal 2. Game is extremely hard meant to increase learning rate rapidly for general agency related questions for heat transfer and thermodynamics.",
      accentClass: "from-[#ff8c1a]/25 via-transparent to-[#ff2a2a]/25 border-[#ff8c1a]/55",
      buttonClass:
        "border-[#ff2a2a]/80 text-[#ff2a2a] hover:bg-[#ff2a2a]/15 ht-extreme-menu-item shadow-[0_0_24px_rgba(255,42,42,0.28)]",
      actions: [
        { label: "Heat Transfer Intro", onClick: p.onHeatTransferIntro },
        {
          label: "Heat Transfer Extreme Bananza",
          onClick: p.onHeatTransferExtreme,
        },
      ],
    },
    {
      id: "story",
      eyebrow: "Story world",
      title: "The Legend of Triangles",
      blurb:
        "Game is real and thought was put into it. Has a story line and key ideas. Its very deep.",
      accentClass: "from-[#39ff14]/20 via-transparent to-[#7CFC00]/15 border-[#39ff14]/75",
      buttonClass:
        "border-[#90EE90]/70 text-[#b8f5b8] hover:bg-[#90EE90]/15 shadow-[0_0_24px_rgba(144,238,144,0.22)]",
      actions: [{ label: "Enter Greenvale", onClick: p.onSpiritBound }],
    },
    {
      id: "tools",
      eyebrow: "Instrument benches",
      title: "Numerical Extreme & Vanity",
      blurb:
        "Brute force definitions, run various math calculations same original functionality, do heat transfer testing, access official Samuel Johnson Dictionary, engineering economy, component design usability, and various scientific tools from MATLAB and Octave.",
      accentClass: "from-[#ff2a2a]/25 via-transparent to-[#ff4d6d]/20 border-[#ff2a2a]/70",
      buttonClass:
        "border-[#ff2a2a]/80 text-[#ff4d6d] hover:bg-[#ff2a2a]/15 numerical-extreme-menu-item vanity-app-menu-item shadow-[0_0_24px_rgba(255,42,42,0.28)]",
      actions: [
        { label: "Numerical Extreme", onClick: p.onNumericalExtreme },
        { label: "Vanity App", onClick: p.onVanityApp },
      ],
    },
    {
      id: "system",
      eyebrow: "System",
      title: "Settings & validation",
      blurb:
        "AI detector works very well can check the text here. Settings is mainly to toggle on and off music and sound. The text here might be AI generated especially citations in references page, but all sources were used and studied.",
      accentClass: "from-moon/15 via-transparent to-cyan/10 border-border",
      buttonClass: "border-cyan/40 text-cyan hover:bg-cyan/15",
      actions: [
        { label: "Settings", onClick: p.onSettings },
        { label: "Developer validation", onClick: p.onValidate },
        {
          label: "AI Detector",
          onClick: p.onAiDetector,
          buttonClass:
            "border-cyan/55 text-cyan hover:bg-cyan/15 shadow-[0_0_24px_rgba(34,211,238,0.22)]",
        },
      ],
    },
  ];

  if (phase === "intro") {
    return (
      <button
        type="button"
        aria-label="Insert coin. ZEUS AMMON-RA 11"
        onClick={enterLanding}
        className={cn(
          "zeus-intro fixed inset-0 z-[80] flex min-h-[100dvh] w-full cursor-pointer items-center justify-center overflow-hidden border-0 bg-black p-0 text-center",
          leaving && "zeus-intro--leaving",
        )}
      >
        <img
          src={brainSrc}
          alt=""
          className={cn("zeus-intro-brain", brainVisible ? "zeus-brain-shown" : "zeus-brain-hidden")}
          style={{ filter: brainFilter }}
          decoding="async"
        />
        <div className="zeus-intro-veil" aria-hidden />
        <div className="relative z-10 flex max-w-4xl flex-col items-center px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-magenta sm:text-xs">
            Philosophy, Myths, Math, and More!
          </p>
          <h1 className="zeus-title-electric mt-3 font-display text-4xl leading-tight sm:text-6xl md:text-7xl">
            ZEUS AMMON-RA 11
          </h1>
          <p className="mt-4 font-mono text-xs tracking-[0.35em] text-moon/80 sm:text-sm">
            Insert coin.
          </p>
        </div>
      </button>
    );
  }

  return (
    <div
      ref={landingRef}
      className="zeus-landing relative w-full"
      onPointerDown={p.onUnlockAudio}
    >
      {/* Hero */}
      <section className="relative flex min-h-[88dvh] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-10 text-center">
        <img
          src={brainSrc}
          alt=""
          className={cn(
            "zeus-hero-brain pointer-events-none absolute left-1/2 top-[44%] z-0 -translate-x-1/2 -translate-y-1/2 object-contain",
            brainVisible ? "zeus-brain-shown" : "zeus-brain-hidden",
          )}
          style={{ filter: brainFilter }}
          decoding="async"
        />
        <div className="relative z-10 flex max-w-3xl flex-col items-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-magenta">ZEUS AMMON-RA 11</p>
          <h2 className="zeus-title-electric mt-3 font-display text-3xl sm:text-5xl">
            The narrow golden path
          </h2>
          <p className="mt-4 max-w-lg font-mono text-sm leading-relaxed text-muted-foreground">
            trivia, labs, heat, story, and tools
          </p>
          <p className="mt-3 max-w-lg font-mono text-[11px] leading-relaxed text-muted-foreground">
            Music: Iasos – Crystal Vista (1981) · Das Armageddon (2026) by キ aerzengel (@AERZENGEL)
          </p>
          <button
            type="button"
            data-scroll-hint
            className="zeus-scroll-hint mt-10 font-mono text-[11px] uppercase tracking-[0.35em] text-amber outline-none"
            onClick={() =>
              document.getElementById("zeus-modes")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            Rise ↓
          </button>
          <p className="mt-10 max-w-md font-mono text-[11px] leading-relaxed text-muted-foreground">
            Very bright and vibrant be warned.
          </p>
          <div className="mt-4 flex w-full max-w-lg items-end justify-between gap-4 px-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>WOZKAF</span>
            <span className="max-w-[16rem] text-center normal-case tracking-normal leading-relaxed">
              Music: Iasos – Crystal Vista (1981)
              <br />
              Das Armageddon (2026) by キ aerzengel
              <br />
              Heat Transfer Intro: Portal 2
            </span>
            <span>Jonathan Angel</span>
          </div>
        </div>
      </section>

      <div id="zeus-modes" className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-24">
        {sections.map((section) => (
          <section
            key={section.id}
            id={`mode-${section.id}`}
            className={cn(
              "zeus-mode-panel zeus-outline-box relative overflow-hidden rounded-sm border bg-gradient-to-br p-6 sm:p-10",
              section.accentClass,
              "bg-deepblue/50 backdrop-blur-md",
            )}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
              {section.eyebrow}
            </p>
            <h3 className="mt-2 font-display text-2xl tracking-[0.06em] text-moon sm:text-3xl">
              {section.title}
            </h3>
            <p className="mt-3 max-w-2xl font-mono text-[12px] leading-relaxed text-muted-foreground sm:text-sm">
              {section.blurb}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {section.actions
                .filter((a) => a.show !== false)
                .map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={action.onClick}
                    className={cn(
                      "rounded-sm border bg-black/35 px-5 py-4 text-left font-display text-sm uppercase tracking-[0.18em] transition-colors",
                      action.buttonClass ?? section.buttonClass,
                    )}
                  >
                    {action.label}
                    {action.sub && (
                      <span className="mt-1 block font-mono text-[10px] normal-case tracking-normal text-muted-foreground">
                        {action.sub}
                      </span>
                    )}
                  </button>
                ))}
            </div>
          </section>
        ))}

        <p className="mx-auto max-w-md text-center font-mono text-[11px] leading-relaxed text-muted-foreground">
          Very bright and vibrant be warned.
        </p>
        <div className="flex w-full max-w-lg items-end justify-between gap-4 self-center px-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>WOZKAF</span>
          <span className="max-w-[16rem] text-center normal-case tracking-normal leading-relaxed">
            Music: Iasos – Crystal Vista (1981)
            <br />
            Das Armageddon (2026) by キ aerzengel
            <br />
            Heat Transfer Intro: Portal 2
          </span>
          <span>Jonathan Angel</span>
        </div>
      </div>
    </div>
  );
}
