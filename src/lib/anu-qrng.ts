/**
 * ANU Quantum Random Numbers — client buffer.
 *
 * True entropy from live quantum vacuum fluctuations measured at the
 * Australian National University (via same-origin `/api/anu-qrng`), with
 * `crypto.getRandomValues` / Math.random fallback when the feed is empty or down.
 *
 * Prefer this for any Spirit Bound / Legend of Triangles randomness requirement.
 * Puzzle *content* stays deterministic from a seed (mulberry32); only the seed
 * (and other live rolls) draw from this buffer.
 */

export const ANU_QRNG_CREDIT =
  "ANU Quantum Random Numbers — vacuum-fluctuation entropy measured at the Australian National University";

export type QrngSource = "anu" | "local";

const REFILL_LENGTH = 1024;
const LOW_WATER = 64;

let buffer = new Uint8Array(0);
let cursor = 0;
let source: QrngSource = "local";
let refillPromise: Promise<void> | null = null;
let lastError = "";

function leftover(): number {
  return buffer.length - cursor;
}

function localBytes(n: number): Uint8Array {
  const out = new Uint8Array(n);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(out);
    return out;
  }
  for (let i = 0; i < n; i++) out[i] = Math.floor(Math.random() * 256) & 0xff;
  return out;
}

function appendBytes(bytes: Uint8Array, fromAnu: boolean) {
  if (leftover() === 0) {
    buffer = bytes;
    cursor = 0;
  } else {
    const keep = buffer.subarray(cursor);
    const next = new Uint8Array(keep.length + bytes.length);
    next.set(keep, 0);
    next.set(bytes, keep.length);
    buffer = next;
    cursor = 0;
  }
  if (fromAnu) source = "anu";
}

async function fetchAnuBatch(length: number): Promise<Uint8Array | null> {
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/api/anu-qrng?length=${Math.min(1024, Math.max(1, length))}&type=uint8`;
    const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
    const json = (await res.json()) as {
      ok?: boolean;
      data?: unknown;
      errorMessage?: string;
      source?: string;
    };
    if (!json.ok || !Array.isArray(json.data) || json.data.length === 0) {
      lastError = json.errorMessage || `ANU QRNG HTTP ${res.status}`;
      return null;
    }
    const bytes = new Uint8Array(json.data.length);
    for (let i = 0; i < json.data.length; i++) {
      const v = json.data[i];
      bytes[i] = typeof v === "number" ? v & 0xff : 0;
    }
    lastError = "";
    return bytes;
  } catch (e) {
    lastError = e instanceof Error ? e.message : "ANU QRNG fetch failed";
    return null;
  }
}

function kickRefill() {
  if (refillPromise) return;
  refillPromise = (async () => {
    const batch = await fetchAnuBatch(REFILL_LENGTH);
    if (batch) appendBytes(batch, true);
  })().finally(() => {
    refillPromise = null;
  });
}

/** Warm the buffer from ANU (safe to call often; coalesces in-flight requests). */
export function prefetchAnuQrng(minBytes = REFILL_LENGTH): Promise<void> {
  if (leftover() >= minBytes) return Promise.resolve();
  kickRefill();
  return refillPromise ?? Promise.resolve();
}

export function qrngSource(): QrngSource {
  return source;
}

export function qrngLastError(): string {
  return lastError;
}

function takeByte(): number {
  if (leftover() <= 0) {
    source = "local";
    kickRefill();
    return localBytes(1)[0]!;
  }
  const b = buffer[cursor]!;
  cursor += 1;
  if (leftover() < LOW_WATER) kickRefill();
  return b;
}

/** Uniform uint32 from ANU buffer (or local CSPRNG fallback). */
export function randomUint32(): number {
  const b0 = takeByte();
  const b1 = takeByte();
  const b2 = takeByte();
  const b3 = takeByte();
  return ((b0 << 24) | (b1 << 16) | (b2 << 8) | b3) >>> 0;
}

/** Uniform float in [0, 1). */
export function randomFloat(): number {
  return randomUint32() / 4294967296;
}

/** Integer in [0, maxExclusive). */
export function randomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;
  return Math.min(maxExclusive - 1, Math.floor(randomFloat() * maxExclusive));
}

/** Non-zero 32-bit seed for mulberry32 puzzle generators. */
export function randomSeed(): number {
  return randomUint32() || 1;
}

/** Chance check — true with probability p. */
export function randomChance(p: number): boolean {
  return randomFloat() < p;
}
