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
  "Jk its just 1 in 10⁵ to beat this game for a skilled master!",
  "Big secret at the end!",
  "There's a Dune reference?!",
  "Improves executive function!",
  "Very deep!",
  "Bill cypher?",
  "You wont believe this!",
  "Yes its a real game!",
] as const;

function randomSplashIndex(exclude?: number): number {
  const n = LEGEND_SPLASHES.length;
  if (n <= 1) return 0;
  let next = Math.floor(Math.random() * n);
  if (exclude === undefined) return next;
  // Avoid showing the same line twice in a row.
  while (next === exclude) next = Math.floor(Math.random() * n);
  return next;
}

type Props = {
  className?: string;
  /** Force a specific line (skips rotation). */
  text?: string;
};

export function MinecraftSplash({ className, text }: Props) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(() => randomSplashIndex());

  useEffect(() => {
    if (text || reduced) return;
    const id = window.setInterval(() => {
      setIndex((i) => randomSplashIndex(i));
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
