import {
  randomFloat as anuRandomFloat,
  randomInt as anuRandomInt,
  randomSeed as anuRandomSeed,
  prefetchAnuQrng,
  qrngSource,
  ANU_QRNG_CREDIT,
} from "@/lib/anu-qrng";

export { prefetchAnuQrng, qrngSource, ANU_QRNG_CREDIT };

/** Deterministic mulberry32. Same seed always yields the same puzzle. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickIndex(rng: () => number, length: number): number {
  if (length <= 0) return 0;
  return Math.min(length - 1, Math.floor(rng() * length));
}

/**
 * Fresh puzzle / trial seed from ANU quantum vacuum entropy
 * (buffered via `/api/anu-qrng`; local CSPRNG fallback if the feed is empty).
 */
export function randomSeed(): number {
  return anuRandomSeed();
}

/** Live float roll [0, 1) for Spirit Bound randomness requirements. */
export function quantumFloat(): number {
  return anuRandomFloat();
}

/** Live integer in [0, maxExclusive). */
export function quantumInt(maxExclusive: number): number {
  return anuRandomInt(maxExclusive);
}
