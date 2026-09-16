/** LEME Johnson 1755 lexicon + UCF zip facsimile helpers (loaded on demand). */

import type { JohnsonSense } from "./numerology";

const LEME_SOURCE = "Samuel Johnson, Dictionary of the English Language (1755) · LEME XML";
const INLINE_SOURCE = "Johnson 1777 federally validated (4th ed. reissue / 1773 revised text)";
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
  buckets: Map<string, Record<string, LemeBucketEntry>>;
  pageIndex: PageIndex | null;
  facsimilePages: Set<number>;
  hocrPages: Record<string, number>;
  maxScanPage: number;
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

async function loadBucket(letter: string): Promise<Record<string, LemeBucketEntry>> {
  const safe = letter.replace(/[^A-Z']/g, "") || "_";
  const data = await fetchJson<LemeBucket>(`/johnson/lexicon/${encodeURIComponent(safe)}.json`);
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
      buckets: new Map(),
      pageIndex,
      facsimilePages: new Set(manifest.pages ?? []),
      hocrPages: estimates.words ?? {},
      maxScanPage: maxScanPage || 0,
    };
  })();

  return resourcesPromise;
}

async function bucketFor(resources: JohnsonResources, headword: string): Promise<Record<string, LemeBucketEntry>> {
  const key = bucketKey(headword);
  const cached = resources.buckets.get(key);
  if (cached) return cached;
  const loaded = await loadBucket(key);
  resources.buckets.set(key, loaded);
  return loaded;
}

function lemeToSense(headword: string, entry: LemeBucketEntry): JohnsonSense {
  return {
    headword,
    partOfSpeech: entry.p,
    senses: entry.s,
    source: LEME_SOURCE,
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
    facsimileUrl: facsimileUrl ?? undefined,
    onlineUrl,
  };
}

export async function lookupJohnsonLeme(
  word: string,
  resources: JohnsonResources,
): Promise<JohnsonSense | null> {
  const key = normalizeHeadword(word);
  if (!key) return null;

  const bucket = await bucketFor(resources, key);
  const entry = bucket[key];
  if (!entry) return null;

  return enrichJohnsonSense(lemeToSense(key, entry), key, resources);
}

export async function lookupJohnsonFull(
  word: string,
  resources: JohnsonResources | null | undefined,
  inlineLookup: (word: string) => JohnsonSense | null,
): Promise<JohnsonSense | null> {
  const key = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!key) return null;

  if (resources) {
    const leme = await lookupJohnsonLeme(key, resources);
    if (leme) return leme;
  }

  const inline = inlineLookup(key);
  if (!inline) return null;
  return enrichJohnsonSense({ ...inline, source: inline.source || INLINE_SOURCE }, key.toUpperCase(), resources);
}
