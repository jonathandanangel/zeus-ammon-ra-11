import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Minecraft-style yellow splash lines for THE LEGEND OF TRIANGLES.
 * Rarity line: 69 chained extreme murals (20s/25s, diameter 19) × Kaller 2012
 * 7-move perfect-solution baseline (~27.9%) → ~1 in 10³⁹ for all 11 papers.
 */
export const LEGEND_SPLASHES = [
  "Rarity of beating game is 1 in 10³⁹!",
  "Also try Executive Accumen!",
  "19 moves · 20s / 25s!",
  "Only 4 hardest murals exist!",
  "Diameter of the tree is 19!",
  "69 extreme trials await!",
  "Greenvale never sleeps!",
  "▲ ▲ ▲",
] as const;

type Props = {
  className?: string;
  /** Force a specific line (skips rotation). */
  text?: string;
};

export function MinecraftSplash({ className, text }: Props) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (text || reduced) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % LEGEND_SPLASHES.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [text, reduced]);

  const line = text ?? LEGEND_SPLASHES[index]!;

  return (
    <p
      key={line}
      className={cn("mc-splash", reduced && "mc-splash-static", className)}
      aria-live="polite"
    >
      {line}
    </p>
  );
}
