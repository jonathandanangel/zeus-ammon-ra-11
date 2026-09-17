import * as React from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { FEATURED_HEAT_ALBUMS } from "@/game/audio";
import { HeatAlbumCredits } from "./NowPlayingAlbum";
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
  onUniversityProjects: () => void;
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
  /** Soft full-screen wash while this topic is in view */
  wash: string;
  /** Frame glow family: aero = electric/mystique purple, fire = bright fiery */
  glow: "aero" | "fire" | "story" | "tools" | "system";
  actions: Array<{
    label: string;
    sub?: string;
    onClick: () => void;
    show?: boolean;
    buttonClass?: string;
  }>;
  albums?: typeof FEATURED_HEAT_ALBUMS;
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
      accentClass: "from-[#a78bfa]/30 via-transparent to-[#22d3ee]/20 border-[#c4b5fd]/55",
      buttonClass:
        "border-[#c4b5fd]/60 text-[#e9d5ff] hover:bg-[#a78bfa]/20 hover:text-moon shadow-[0_0_24px_rgba(167,139,250,0.22)]",
      wash: "rgba(168,85,247,0.42)",
      glow: "aero",
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
      accentClass: "from-[#7c3aed]/35 via-transparent to-[#e879f9]/25 border-[#a78bfa]/60",
      buttonClass:
        "border-[#c084fc]/65 text-[#e9d5ff] hover:bg-[#a78bfa]/20 extreme-menu-item shadow-[0_0_24px_rgba(168,85,247,0.28)]",
      wash: "rgba(139,92,246,0.44)",
      glow: "aero",
      actions: [
        { label: "High-Speed Lab", onClick: p.onHighSpeed },
        { label: "Aerodynamics Extreme", onClick: p.onExtreme },
        {
          label: "Aerodynamics Extreme V2",
          onClick: p.onExtremeV2,
          buttonClass:
            "border-[#e879f9]/70 text-[#f0abfc] hover:bg-[#e879f9]/15 extreme-v2-menu-item shadow-[0_0_24px_rgba(232,121,249,0.28)]",
        },
      ],
    },
    {
      id: "heat",
      eyebrow: "Thermal",
      title: "Heat Transfer",
      blurb:
        "Now playing by album title: Crystal Vista (Iasos, 1981) and Das Armageddon (キ aerzengel, 2026). Related: Berdysh (@Berdysh66), Occult Tripping KVLT (@OccultTrippingCult), Shypunch (@Shypunch120), SERAPHRID (@seraphrid78787), Luxen (@Luxen420). Intro bed from Portal 2. Extremely hard — built to raise learning rate fast for heat transfer and thermodynamics.",
      accentClass: "from-[#ff8c1a]/40 via-[#ff2a2a]/15 to-[#ffcc33]/25 border-[#ff8c1a]/80",
      buttonClass:
        "border-[#ff2a2a]/80 text-[#ff2a2a] hover:bg-[#ff2a2a]/15 ht-extreme-menu-item shadow-[0_0_24px_rgba(255,42,42,0.28)]",
      wash: "rgba(255,90,20,0.48)",
      glow: "fire",
      actions: [
        { label: "Heat Transfer Intro", onClick: p.onHeatTransferIntro },
        {
          label: "Heat Transfer Extreme Bananza",
          onClick: p.onHeatTransferExtreme,
        },
      ],
      albums: FEATURED_HEAT_ALBUMS,
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
      wash: "rgba(57,255,20,0.28)",
      glow: "story",
      actions: [{ label: "Enter Greenvale", onClick: p.onSpiritBound }],
    },
    {
      id: "tools",
      eyebrow: "Instrument benches",
      title: "Numerical Extreme & Vanity",
      blurb:
        "Brute force definitions, run various math calculations same original functionality, do heat transfer testing, access official Samuel Johnson Dictionary, engineering economy, component design usability, and various scientific tools from MATLAB and Octave.",
      accentClass: "from-[#ff4d00]/40 via-[#ff2a2a]/20 to-[#ffcc00]/20 border-[#ff6b2a]/85",
      buttonClass:
        "border-[#ff2a2a]/80 text-[#ff4d6d] hover:bg-[#ff2a2a]/15 numerical-extreme-menu-item vanity-app-menu-item shadow-[0_0_24px_rgba(255,42,42,0.28)]",
      wash: "rgba(255,60,10,0.50)",
      glow: "fire",
      actions: [
        { label: "Numerical Extreme", onClick: p.onNumericalExtreme },
        { label: "Vanity App", onClick: p.onVanityApp },
      ],
    },
    {
      id: "university",
      eyebrow: "Coursework labs",
      title: "University Projects",
      blurb:
        "MATLABProject-1 data plotter in the browser: load lab tables, pick X/Y columns, scatter+line, equal axes, start/end markers, engineering click-picks → CSV. Also browses PyCharm Misc Python labs and your MATLABProject-1.m source.",
      accentClass: "from-[#60a5fa]/25 via-transparent to-[#93c5fd]/20 border-[#60a5fa]/60",
      buttonClass:
        "border-[#60a5fa]/80 text-[#93c5fd] hover:bg-[#60a5fa]/15 shadow-[0_0_24px_rgba(96,165,250,0.22)]",
      wash: "rgba(96,165,250,0.32)",
      glow: "tools",
      actions: [{ label: "Open University Projects", onClick: p.onUniversityProjects }],
    },
    {
      id: "system",
      eyebrow: "System",
      title: "Settings & validation",
      blurb:
        "AI detector works very well can check the text here. Settings is mainly to toggle on and off music and sound. The text here might be AI generated especially citations in references page, but all sources were used and studied.",
      accentClass: "from-moon/15 via-transparent to-cyan/10 border-border",
      buttonClass: "border-cyan/40 text-cyan hover:bg-cyan/15",
      wash: "rgba(234,247,255,0.18)",
      glow: "system",
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
      className="zeus-landing zeus-landing-snap relative h-[100dvh] w-full overflow-y-auto"
      onPointerDown={p.onUnlockAudio}
    >
      {/* Hero */}
      <section className="zeus-snap-slide relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-10 text-center">
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
            Albums: Crystal Vista · Das Armageddon · Portal 2 OST
          </p>
          <button
            type="button"
            data-scroll-hint
            className="zeus-scroll-hint mt-10 font-mono text-[11px] uppercase tracking-[0.35em] text-amber outline-none"
            onClick={() =>
              document.getElementById("zeus-modes")?.scrollIntoView({ behavior: "instant", block: "start" })
            }
          >
            Rise ↓
          </button>
          <p className="mt-10 max-w-md font-mono text-[11px] leading-relaxed text-muted-foreground">
            Very bright and vibrant be warned.
          </p>
          <div className="mt-4 flex w-full max-w-sm justify-between px-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>WOZKAF</span>
            <span>Jonathan Angel</span>
          </div>
        </div>
      </section>

      <div id="zeus-modes" className="flex w-full flex-col">
        {sections.map((section) => (
          <section
            key={section.id}
            id={`mode-${section.id}`}
            className={cn(
              "zeus-snap-slide zeus-topic-slide relative flex min-h-[100dvh] w-full items-center",
              section.glow === "aero" && "zeus-glow-aero",
              section.glow === "fire" && "zeus-glow-fire",
              section.glow === "story" && "zeus-glow-story",
              section.glow === "tools" && "zeus-glow-tools",
              section.glow === "system" && "zeus-glow-system",
            )}
            style={{ ["--zeus-topic-wash" as string]: section.wash }}
          >
            <div className="zeus-topic-wash pointer-events-none absolute inset-0" aria-hidden />
            <div
              className={cn(
                "zeus-title-topic-panel relative z-10 flex min-h-[100dvh] w-full flex-col justify-center px-5 py-14 sm:px-10",
                section.id === "system" && "pb-28",
              )}
            >
              <div className="mx-auto w-full max-w-5xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                  {section.eyebrow}
                </p>
                <h3 className="zeus-topic-title mt-2 font-display text-2xl tracking-[0.06em] sm:text-3xl">
                  {section.title}
                </h3>
                <p className="mt-3 max-w-2xl font-mono text-[12px] leading-relaxed text-muted-foreground sm:text-sm">
                  {section.blurb}
                </p>
                {section.albums && section.albums.length > 0 ? (
                  <HeatAlbumCredits albums={section.albums} />
                ) : null}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {section.actions
                    .filter((a) => a.show !== false)
                    .map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        onClick={action.onClick}
                        className={cn(
                          "zeus-topic-btn rounded-sm border bg-black/30 px-5 py-4 text-left font-display text-sm uppercase tracking-[0.18em]",
                          `zeus-topic-btn--${section.glow}`,
                          action.buttonClass ?? section.buttonClass,
                        )}
                      >
                        <span className="zeus-topic-btn-label relative z-[1]">
                          {action.label}
                        </span>
                        {action.sub && (
                          <span className="relative z-[1] mt-1 block font-mono text-[10px] normal-case tracking-normal text-muted-foreground">
                            {action.sub}
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              </div>
              {section.id === "system" ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex w-full flex-col items-center px-5 text-center">
                  <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                    Very bright and vibrant be warned.
                  </p>
                  <div className="mt-4 flex w-full max-w-sm justify-between px-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span>WOZKAF</span>
                    <span>Jonathan Angel</span>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
