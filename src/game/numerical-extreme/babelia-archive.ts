/**
 * Educational Babelia (babelia.libraryofbabel.info) client.
 *
 * Basile: every 640×416 image with a 12-bit palette (~10^961755 images) is
 * generated from a location number via an invertible PRNG — images are not
 * stored. Official algo needs GMP multiprecision; this port uses a scaled
 * canvas (160×104 = 1/16 of 640×416) and a 32-bit LCG so browse / random /
 * seek / locate still teach the same idea inside the browser.
 *
 * Links: https://babelia.libraryofbabel.info/ · https://libraryofbabel.info/
 */

import { OFFICIAL_BABEL } from "./babel-pathfinder";

/** Official babelia proportions scaled ×0.25 for browser speed. */
export const BABELIA_W = 160;
export const BABELIA_H = 104;
export const BABELIA_PIXELS = BABELIA_W * BABELIA_H;
/** 12-bit colour space (Basile): 4 bits R, 4 G, 4 B → 4096 colours. */
export const BABELIA_PALETTE = 4096;

export const OFFICIAL_BABELIA = {
  home: OFFICIAL_BABEL.babelia,
  about: "https://babelia.libraryofbabel.info/about.html",
  search: "https://babelia.libraryofbabel.info/imagesearch.html",
  slideshow: "https://babelia.libraryofbabel.info/",
} as const;

export type BabeliaPlate = {
  /** Truncated display id (babelia #…) */
  shortId: string;
  /** Full location string (decimal digits of BigInt) */
  location: string;
  width: number;
  height: number;
  dataUrl: string;
  /** How much planted signal vs random archive noise (0–100). */
  coherence: number;
  note: string;
};

/** Hull–Dobell-ish LCG constants for 32-bit stream (educational, not Basile’s m). */
const LCG_A = 1664525;
const LCG_C = 1013904223;

function lcgNext(state: number): number {
  return (Math.imul(LCG_A, state) + LCG_C) >>> 0;
}

function temper(x: number): number {
  x ^= x >>> 11;
  x ^= (x << 7) & 0x9d2c5680;
  x ^= (x << 15) & 0xefc60000;
  x ^= x >>> 18;
  return x >>> 0;
}

/** Expand location BigInt into a pixel PRNG state. */
function locationToState(loc: bigint): number {
  const mod = 0x100000000n;
  let n = loc < 0n ? -loc : loc;
  // fold high digits into 32-bit
  let s = 0;
  while (n > 0n) {
    s = temper((s ^ Number(n % mod)) >>> 0);
    n /= mod;
  }
  return s || 1;
}

export function quantize12bit(r: number, g: number, b: number): number {
  const R = Math.min(15, Math.max(0, Math.round(r / 17)));
  const G = Math.min(15, Math.max(0, Math.round(g / 17)));
  const B = Math.min(15, Math.max(0, Math.round(b / 17)));
  return (R << 8) | (G << 4) | B;
}

export function expand12bit(c: number): { r: number; g: number; b: number } {
  const R = (c >> 8) & 0xf;
  const G = (c >> 4) & 0xf;
  const B = c & 0xf;
  return { r: R * 17, g: G * 17, b: B * 17 };
}

function shortIdFromLocation(loc: string): string {
  if (loc.length <= 24) return `babelia #${loc}`;
  return `babelia #${loc.slice(0, 10)}…${loc.slice(-10)}`;
}

function canvasFromIndices(indices: Uint16Array): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = BABELIA_W;
  canvas.height = BABELIA_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(BABELIA_W, BABELIA_H);
  for (let i = 0; i < BABELIA_PIXELS; i += 1) {
    const { r, g, b } = expand12bit(indices[i]! % BABELIA_PALETTE);
    const o = i * 4;
    img.data[o] = r;
    img.data[o + 1] = g;
    img.data[o + 2] = b;
    img.data[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  // upscale display 4× with nearest neighbour for that chunky archive look
  const big = document.createElement("canvas");
  big.width = BABELIA_W * 4;
  big.height = BABELIA_H * 4;
  const bctx = big.getContext("2d");
  if (!bctx) return canvas.toDataURL("image/png");
  bctx.imageSmoothingEnabled = false;
  bctx.drawImage(canvas, 0, 0, big.width, big.height);
  return big.toDataURL("image/png");
}

/**
 * Location → image (Basile forward direction).
 * Same location always regenerates the same plate.
 */
export function babeliaFromLocation(locationRaw: string | bigint, coherence = 0): BabeliaPlate {
  let loc: bigint;
  if (typeof locationRaw === "bigint") loc = locationRaw < 0n ? -locationRaw : locationRaw;
  else {
    const digits = locationRaw.replace(/\D/g, "") || "1";
    loc = BigInt(digits);
  }
  if (loc === 0n) loc = 1n;

  let state = locationToState(loc);
  const indices = new Uint16Array(BABELIA_PIXELS);
  for (let i = 0; i < BABELIA_PIXELS; i += 1) {
    state = lcgNext(state);
    indices[i] = temper(state) % BABELIA_PALETTE;
  }

  const location = loc.toString(10);
  return {
    shortId: shortIdFromLocation(location),
    location,
    width: BABELIA_W * 4,
    height: BABELIA_H * 4,
    dataUrl: canvasFromIndices(indices),
    coherence,
    note:
      coherence > 0
        ? `Located plate · ${coherence}% planted signal (path/search) among archive noise.`
        : "Programmatic plate from location number — nothing stored on disk (Babelia idea).",
  };
}

/**
 * Image → location (educational inverse): pack 12-bit indices as base-4096 digits.
 * Full Basile inverse needs GMP; this bijection holds for our scaled canvas.
 */
export function babeliaLocateFromImageData(imageData: ImageData): BabeliaPlate {
  const { width, height, data } = imageData;
  const indices = new Uint16Array(BABELIA_PIXELS);
  for (let y = 0; y < BABELIA_H; y += 1) {
    for (let x = 0; x < BABELIA_W; x += 1) {
      const sx = Math.min(width - 1, Math.floor((x * width) / BABELIA_W));
      const sy = Math.min(height - 1, Math.floor((y * height) / BABELIA_H));
      const o = (sy * width + sx) * 4;
      indices[y * BABELIA_W + x] = quantize12bit(data[o]!, data[o + 1]!, data[o + 2]!);
    }
  }
  let loc = 0n;
  const base = BigInt(BABELIA_PALETTE);
  // Sample stride so location stays manageable in UI (~200 digits max)
  const stride = 8;
  for (let i = 0; i < BABELIA_PIXELS; i += stride) {
    loc = loc * base + BigInt(indices[i]! % BABELIA_PALETTE);
  }
  if (loc === 0n) loc = 1n;
  // Regenerate from packed location so seek is stable
  return babeliaFromLocation(loc, 15);
}

/** Random archive visit (Universal Slideshow idea). */
export function babeliaRandom(): BabeliaPlate {
  const a = BigInt(Math.floor(Math.random() * 1e15));
  const b = BigInt(Math.floor(Math.random() * 1e15));
  const c = BigInt(Date.now() % 1e12);
  return babeliaFromLocation(a * 1_000_000_000_000_000n + b * 1_000_000n + c, 0);
}

/** Step slideshow ±1 from a location (adjacent IDs — not necessarily similar visuals). */
export function babeliaStep(location: string, delta: number): BabeliaPlate {
  const digits = location.replace(/\D/g, "") || "1";
  let loc = BigInt(digits) + BigInt(delta);
  if (loc < 1n) loc = 1n;
  return babeliaFromLocation(loc, 0);
}

/**
 * Plant path/word signal into a babelia plate, then treat as a located search hit.
 * Higher coherence = more of the image is “about” your numerology search
 * (same rare-coherent-page idea as the text Library).
 */
export function babeliaLocateSearch(input: {
  seedWord: string;
  pathNumber: number;
  colorHex: string;
  coherence: number;
  salt?: string;
}): BabeliaPlate {
  if (typeof document === "undefined") {
    return babeliaFromLocation(1n, input.coherence);
  }

  const seed =
    [...`${input.pathNumber}|${input.seedWord}|${input.salt ?? "babelia-search"}`].reduce(
      (h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619),
      2166136261,
    ) >>> 0;

  let state = seed || 1;
  const indices = new Uint16Array(BABELIA_PIXELS);
  for (let i = 0; i < BABELIA_PIXELS; i += 1) {
    state = lcgNext(state);
    indices[i] = temper(state) % BABELIA_PALETTE;
  }

  // Plant Thought-Forms / path colour as a signal band (coherence %)
  const hex = input.colorHex.replace("#", "").padEnd(6, "0");
  const pr = parseInt(hex.slice(0, 2), 16) || 0;
  const pg = parseInt(hex.slice(2, 4), 16) || 0;
  const pb = parseInt(hex.slice(4, 6), 16) || 0;
  const signalColor = quantize12bit(pr, pg, pb);
  const band = Math.floor((BABELIA_PIXELS * Math.max(5, Math.min(95, input.coherence))) / 100);
  const start = temper(seed) % Math.max(1, BABELIA_PIXELS - band);
  for (let i = 0; i < band; i += 1) {
    indices[(start + i) % BABELIA_PIXELS] = signalColor;
  }

  // Encode word as a tiny barcode of 12-bit cells
  const word = input.seedWord.toLowerCase().replace(/[^a-z]/g, "").slice(0, 24);
  for (let i = 0; i < word.length; i += 1) {
    const code = (word.charCodeAt(i) - 97) * 150 + (input.pathNumber % 15);
    indices[(start + band + i * 3) % BABELIA_PIXELS] = code % BABELIA_PALETTE;
  }

  // Derive location from planted indices (so Seek regenerates this plate)
  let loc = 0n;
  const base = BigInt(BABELIA_PALETTE);
  for (let i = 0; i < BABELIA_PIXELS; i += 8) {
    loc = loc * base + BigInt(indices[i]! % BABELIA_PALETTE);
  }
  if (loc === 0n) loc = BigInt(seed) + 1n;

  const location = loc.toString(10);
  return {
    shortId: shortIdFromLocation(location),
    location,
    width: BABELIA_W * 4,
    height: BABELIA_H * 4,
    dataUrl: canvasFromIndices(indices),
    coherence: input.coherence,
    note: `Image search hit for “${input.seedWord}” · path ${input.pathNumber} · ${input.coherence}% signal in the 12-bit archive.`,
  };
}

/** Hierarchy of babelia plates: high coherence (foundational) → low (archive noise). */
export function babeliaHierarchyForWord(input: {
  seedWord: string;
  pathNumber: number;
  colorHex: string;
  combination: string[];
}): BabeliaPlate[] {
  const tiers = [
    { coherence: 92, salt: "foundational-path", label: "path colour seal" },
    { coherence: 78, salt: "johnson-band", label: "lexicon band" },
    { coherence: 62, salt: "thought-form", label: "thought-form wash" },
    { coherence: 44, salt: "anagram-dust", label: "letter-match dust" },
    { coherence: 18, salt: "archive-noise", label: "ordinary archive noise" },
  ];
  return tiers.map((t, i) => {
    const plate = babeliaLocateSearch({
      seedWord: input.combination[i] ?? input.seedWord,
      pathNumber: input.pathNumber,
      colorHex: input.colorHex,
      coherence: t.coherence,
      salt: t.salt,
    });
    return {
      ...plate,
      note: `#${i + 1} ${t.label} · ${plate.note}`,
    };
  });
}
