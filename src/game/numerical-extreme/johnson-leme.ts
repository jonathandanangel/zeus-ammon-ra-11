/** Johnson 1755 (LEME) + 1773 (4th ed. via JDO/StarDict) lexicons + UCF facsimile helpers. */

import type { JohnsonSense } from "./numerology";

const SOURCE_1755 = "Samuel Johnson, Dictionary of the English Language (1755) · LEME XML";
const SOURCE_1773 =
  "Samuel Johnson, Dictionary of the English Language, 4th ed. (1773) · johnsonsdictionaryonline.com / LEME CC BY 4.0";
const INLINE_SOURCE = "Johnson inline gloss lexicon (fallback)";
const JDO_BASE = "https://johnsonsdictionaryonline.com/views/search.php?word=";

type LemeBucketEntry = { p: string; s: string[] };
type LemeBucket = { bucket: string; count: number; entries: Record<string, LemeBucketEntry> };

type PageIndex = {
  max?: number | null;
  pages?: Record<string, { path: string }>;
};

type FacsimileManifest = {
  pages: number[];
  source?: string;
};

type HocrEstimates = {
  maxPage?: number;
  words?: Record<string, number>;
};

export type JohnsonResources = {
  buckets1755: Map<string, Record<string, LemeBucketEntry>>;
  buckets1773: Map<string, Record<string, LemeBucketEntry>>;
  pageIndex: PageIndex | null;
  facsimilePages: Set<number>;
  hocrPages: Record<string, number>;
  maxScanPage: number;
};

export type JohnsonEditions = {
  e1755: JohnsonSense | null;
  e1773: JohnsonSense | null;
};

let resourcesPromise: Promise<JohnsonResources> | null = null;

function normalizeHeadword(word: string): string {
  return word.toUpperCase().replace(/[^A-Z']/g, "");
}

function bucketKey(headword: string): string {
  const key = normalizeHeadword(headword);
  return key[0] ?? "_";
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}`);
  }
  return response.json() as Promise<T>;
}

async function loadBucket(
  letter: string,
  dir: "lexicon" | "lexicon-1773",
): Promise<Record<string, LemeBucketEntry>> {
  const safe = letter.replace(/[^A-Z']/g, "") || "_";
  const data = await fetchJson<LemeBucket>(`/johnson/${dir}/${encodeURIComponent(safe)}.json`);
  return data.entries;
}

export async function loadJohnsonResources(): Promise<JohnsonResources> {
  if (resourcesPromise) return resourcesPromise;

  resourcesPromise = (async () => {
    const [pageIndex, manifest, estimates] = await Promise.all([
      fetchJson<PageIndex>("/johnson/page-index.json").catch(() => null),
      fetchJson<FacsimileManifest>("/johnson/facsimile/manifest.json").catch(() => ({
        pages: [],
      })),
      fetchJson<HocrEstimates>("/johnson/hocr-page-estimates.json").catch(() => ({})),
    ]);

    const maxScanPage =
      pageIndex?.max ??
      estimates.maxPage ??
      (pageIndex?.pages ? Math.max(...Object.keys(pageIndex.pages).map(Number)) : 0);

    return {
      buckets1755: new Map(),
      buckets1773: new Map(),
      pageIndex,
      facsimilePages: new Set(manifest.pages ?? []),
      hocrPages: estimates.words ?? {},
      maxScanPage: maxScanPage || 0,
    };
  })();

  return resourcesPromise;
}

async function bucketFor(
  resources: JohnsonResources,
  headword: string,
  edition: "1755" | "1773",
): Promise<Record<string, LemeBucketEntry>> {
  const key = bucketKey(headword);
  const map = edition === "1755" ? resources.buckets1755 : resources.buckets1773;
  const cached = map.get(key);
  if (cached) return cached;
  try {
    const loaded = await loadBucket(key, edition === "1755" ? "lexicon" : "lexicon-1773");
    map.set(key, loaded);
    return loaded;
  } catch {
    map.set(key, {});
    return {};
  }
}

function toSense(headword: string, entry: LemeBucketEntry, source: string): JohnsonSense {
  return {
    headword,
    partOfSpeech: entry.p,
    senses: entry.s,
    source,
  };
}

function estimatePage(headword: string, resources: JohnsonResources): number | null {
  const key = normalizeHeadword(headword);
  const direct = resources.hocrPages[key];
  if (direct) return direct;
  if (resources.maxScanPage <= 0) return null;
  const ratio = key.charCodeAt(0) / 90;
  return Math.max(1, Math.min(resources.maxScanPage, Math.round(1 + ratio * (resources.maxScanPage - 1))));
}

function facsimileForPage(page: number, resources: JohnsonResources): string | null {
  if (!resources.facsimilePages.has(page)) return null;
  return `/johnson/facsimile/page-${String(page).padStart(4, "0")}.jpg`;
}

export function enrichJohnsonSense(
  sense: JohnsonSense,
  headword: string,
  resources: JohnsonResources | null | undefined,
): JohnsonSense {
  if (!resources) return sense;
  const page = estimatePage(headword, resources);
  const onlineUrl = `${JDO_BASE}${encodeURIComponent(headword.toLowerCase())}`;
  if (!page) {
    return { ...sense, onlineUrl };
  }
  const facsimileUrl = facsimileForPage(page, resources);
  return {
    ...sense,
    facsimilePage: page,
    ...(facsimileUrl ? { facsimileUrl } : {}),
    onlineUrl,
  };
}

async function lookupEdition(
  word: string,
  resources: JohnsonResources,
  edition: "1755" | "1773",
): Promise<JohnsonSense | null> {
  const key = normalizeHeadword(word);
  if (!key) return null;
  const bucket = await bucketFor(resources, key, edition);
  const entry = bucket[key];
  if (!entry) return null;
  const source = edition === "1755" ? SOURCE_1755 : SOURCE_1773;
  return enrichJohnsonSense(toSense(key, entry, source), key, resources);
}

/** Prefer 1755 for single-entry callers; falls back to 1773 then inline. */
export async function lookupJohnsonLeme(
  word: string,
  resources: JohnsonResources,
): Promise<JohnsonSense | null> {
  return (
    (await lookupEdition(word, resources, "1755")) ??
    (await lookupEdition(word, resources, "1773"))
  );
}

export async function lookupJohnsonEditions(
  word: string,
  resources: JohnsonResources | null | undefined,
  inlineLookup: (word: string) => JohnsonSense | null,
): Promise<JohnsonEditions> {
  const key = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!key) return { e1755: null, e1773: null };

  if (!resources) {
    const inline = inlineLookup(key);
    return {
      e1755: inline ? enrichJohnsonSense({ ...inline, source: inline.source || INLINE_SOURCE }, key.toUpperCase(), null) : null,
      e1773: null,
    };
  }

  const [e1755, e1773] = await Promise.all([
    lookupEdition(key, resources, "1755"),
    lookupEdition(key, resources, "1773"),
  ]);

  if (e1755 || e1773) {
    return { e1755, e1773 };
  }

  const inline = inlineLookup(key);
  return {
    e1755: inline
      ? enrichJohnsonSense({ ...inline, source: inline.source || INLINE_SOURCE }, key.toUpperCase(), resources)
      : null,
    e1773: null,
  };
}

export async function lookupJohnsonFull(
  word: string,
  resources: JohnsonResources | null | undefined,
  inlineLookup: (word: string) => JohnsonSense | null,
): Promise<JohnsonSense | null> {
  const editions = await lookupJohnsonEditions(word, resources, inlineLookup);
  return editions.e1755 ?? editions.e1773;
}
