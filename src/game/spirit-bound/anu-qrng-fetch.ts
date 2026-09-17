/**
 * Server-side fetch of ANU Quantum Random Numbers.
 * Used by `/api/anu-qrng` — keeps API keys and outbound calls off the browser.
 *
 * Sources (in order):
 * 1. Quantum Numbers API (https://api.quantumnumbers.anu.edu.au) when ANU_QRNG_API_KEY is set
 * 2. Legacy public JSON endpoint (qrng.anu.edu.au) as a best-effort fallback
 */

export const ANU_QRNG_LEGACY_URL = "https://qrng.anu.edu.au/API/jsonI.php";
export const ANU_QRNG_API_URL = "https://api.quantumnumbers.anu.edu.au";

export type AnuQrngServerResult = {
  ok: boolean;
  data: number[];
  length: number;
  type: "uint8";
  upstream: "anu-api" | "anu-legacy" | "none";
  errorMessage: string;
  credit: string;
};

const CREDIT =
  "ANU Quantum Random Numbers — vacuum-fluctuation entropy measured at the Australian National University";

function envKey(): string {
  const fromProcess =
    typeof process !== "undefined"
      ? (process.env.ANU_QRNG_API_KEY ?? process.env.QRNG_API_KEY ?? "")
      : "";
  return fromProcess.trim();
}

function clampLength(n: number): number {
  if (!Number.isFinite(n)) return 256;
  return Math.min(1024, Math.max(1, Math.floor(n)));
}

function asByteArray(data: unknown): number[] | null {
  if (!Array.isArray(data) || data.length === 0) return null;
  const out: number[] = [];
  for (const v of data) {
    if (typeof v !== "number" || !Number.isFinite(v)) return null;
    out.push(v & 0xff);
  }
  return out;
}

async function fetchLegacy(length: number, signal: AbortSignal): Promise<AnuQrngServerResult> {
  const url = `${ANU_QRNG_LEGACY_URL}?length=${length}&type=uint8`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "ZEUS-AMMON-RA-11-LegendOfTriangles/1.0",
    },
    signal,
  });
  if (!res.ok) {
    return {
      ok: false,
      data: [],
      length: 0,
      type: "uint8",
      upstream: "none",
      errorMessage: `ANU legacy QRNG HTTP ${res.status}`,
      credit: CREDIT,
    };
  }
  const json = (await res.json()) as { success?: boolean; data?: unknown; length?: number };
  const bytes = asByteArray(json.data);
  if (!bytes || json.success === false) {
    return {
      ok: false,
      data: [],
      length: 0,
      type: "uint8",
      upstream: "none",
      errorMessage: "ANU legacy QRNG returned no data",
      credit: CREDIT,
    };
  }
  return {
    ok: true,
    data: bytes,
    length: bytes.length,
    type: "uint8",
    upstream: "anu-legacy",
    errorMessage: "",
    credit: CREDIT,
  };
}

async function fetchApiKey(length: number, key: string, signal: AbortSignal): Promise<AnuQrngServerResult> {
  const url = `${ANU_QRNG_API_URL}/?length=${length}&type=uint8`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-api-key": key,
      "User-Agent": "ZEUS-AMMON-RA-11-LegendOfTriangles/1.0",
    },
    signal,
  });
  if (!res.ok) {
    return {
      ok: false,
      data: [],
      length: 0,
      type: "uint8",
      upstream: "none",
      errorMessage: `ANU Quantum Numbers API HTTP ${res.status}`,
      credit: CREDIT,
    };
  }
  const json = (await res.json()) as { data?: unknown; success?: boolean; type?: string };
  const bytes = asByteArray(json.data);
  if (!bytes) {
    return {
      ok: false,
      data: [],
      length: 0,
      type: "uint8",
      upstream: "none",
      errorMessage: "ANU Quantum Numbers API returned no data",
      credit: CREDIT,
    };
  }
  return {
    ok: true,
    data: bytes,
    length: bytes.length,
    type: "uint8",
    upstream: "anu-api",
    errorMessage: "",
    credit: CREDIT,
  };
}

export async function fetchAnuQrngBytes(lengthRaw: number): Promise<AnuQrngServerResult> {
  const length = clampLength(lengthRaw);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const key = envKey();
    if (key) {
      const keyed = await fetchApiKey(length, key, controller.signal);
      if (keyed.ok) return keyed;
    }
    return await fetchLegacy(length, controller.signal);
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.name === "AbortError"
          ? "ANU QRNG request timed out"
          : e.message
        : "ANU QRNG request failed";
    return {
      ok: false,
      data: [],
      length: 0,
      type: "uint8",
      upstream: "none",
      errorMessage: msg,
      credit: CREDIT,
    };
  } finally {
    clearTimeout(timer);
  }
}
