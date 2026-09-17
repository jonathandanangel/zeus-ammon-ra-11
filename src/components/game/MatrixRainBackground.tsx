import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight Matrix digital-rain canvas for ZEUS backgrounds.
 * Aesthetic homage to Rezmason’s WebGL rain (https://github.com/Rezmason/matrix)
 * — classic green / ZEUS cyan palette, soft bloom, cursor heads.
 * Full regl/MSDF build is too heavy for an always-on game chrome layer.
 */

export const MATRIX_RAIN_CREDIT =
  "Matrix rain inspired by Rezmason/matrix · https://github.com/Rezmason/matrix";

const GLYPHS =
  "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ012345789Z:・.=*+-<>¦｜çﾘｸ";

type Drop = {
  x: number;
  y: number;
  speed: number;
  len: number;
  chars: string[];
  cycle: number;
};

export function MatrixRainBackground({
  active = true,
  reducedMotion = false,
  /** 0–1 overlay strength */
  opacity = 0.28,
  /** "classic" green (Rezmason default) or ZEUS cyan mix */
  palette = "classic",
  className,
}: {
  active?: boolean;
  reducedMotion?: boolean;
  opacity?: number;
  palette?: "classic" | "zeus";
  className?: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const dropsRef = React.useRef<Drop[]>([]);
  const rafRef = React.useRef(0);
  const lastRef = React.useRef(0);

  const colors = palette === "zeus"
    ? {
        head: "rgba(234, 247, 255, 0.95)",
        bright: "rgba(37, 217, 255, 0.85)",
        mid: "rgba(37, 217, 255, 0.45)",
        dim: "rgba(7, 80, 110, 0.22)",
        fade: "rgba(5, 8, 22, 0.12)",
      }
    : {
        // Rezmason-adjacent: hsl(108…) greens + bright cursor
        head: "rgba(200, 255, 210, 0.95)",
        bright: "rgba(0, 255, 65, 0.78)",
        mid: "rgba(0, 200, 70, 0.42)",
        dim: "rgba(0, 90, 30, 0.2)",
        fade: "rgba(0, 0, 0, 0.14)",
      };

  React.useEffect(() => {
    if (!active || reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const fontSize = Math.max(12, Math.min(18, Math.floor(window.innerWidth / 90)));
    let cols = 0;
    let rows = 0;

    const randGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "0";

    const rebuild = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / fontSize);
      rows = Math.ceil(h / fontSize) + 2;
      dropsRef.current = Array.from({ length: cols }, (_, i) => ({
        x: i,
        y: Math.random() * rows,
        speed: 0.35 + Math.random() * 0.85,
        len: 8 + Math.floor(Math.random() * 18),
        chars: Array.from({ length: 24 }, randGlyph),
        cycle: Math.random() * 10,
      }));
    };

    rebuild();
    const onResize = () => rebuild();
    window.addEventListener("resize", onResize);

    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - lastRef.current) / 1000 || 0.016);
      lastRef.current = t;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.fillStyle = colors.fade;
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "Share Tech Mono", "Courier New", monospace`;
      ctx.textBaseline = "top";

      for (const drop of dropsRef.current) {
        drop.y += drop.speed * dt * 22;
        drop.cycle += dt;
        if (drop.cycle > 0.08) {
          drop.cycle = 0;
          const idx = Math.floor(Math.random() * drop.chars.length);
          drop.chars[idx] = randGlyph();
        }
        if (drop.y - drop.len > rows) {
          drop.y = -Math.random() * 20;
          drop.speed = 0.35 + Math.random() * 0.85;
          drop.len = 8 + Math.floor(Math.random() * 18);
        }

        const px = drop.x * fontSize;
        for (let i = 0; i < drop.len; i++) {
          const gy = Math.floor(drop.y) - i;
          if (gy < -1 || gy > rows) continue;
          const ch = drop.chars[i % drop.chars.length] ?? "0";
          const py = gy * fontSize;
          if (i === 0) {
            ctx.fillStyle = colors.head;
            ctx.shadowColor = colors.bright;
            ctx.shadowBlur = 8;
          } else if (i < 3) {
            ctx.fillStyle = colors.bright;
            ctx.shadowBlur = 0;
          } else if (i < drop.len * 0.45) {
            ctx.fillStyle = colors.mid;
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = colors.dim;
            ctx.shadowBlur = 0;
          }
          ctx.fillText(ch, px, py);
        }
      }
      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [active, reducedMotion, colors.bright, colors.dim, colors.fade, colors.head, colors.mid]);

  if (!active || reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none fixed inset-0 z-[3] mix-blend-screen",
        className,
      )}
      style={{ opacity }}
      aria-hidden
    />
  );
}
