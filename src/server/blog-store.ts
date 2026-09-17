/**
 * Creator blog store — public read, authenticated write.
 *
 * Shared source of truth for every visitor (not per-browser):
 *   1) MantleDB remote JSON (cross-isolate / cross-user)
 *   2) Cache API (edge hot cache)
 *   3) data/ + public/ + /tmp JSON when the host allows disk
 *   4) in-memory for the current isolate
 *
 * Seed post always merges in for first-time readers.
 */

import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export type BlogPost = {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
};

const USERNAME = "wozkaf";
/** sha256("zeus-blog-v1:wozkaf:<password>") — plaintext never stored in source */
const CREDENTIAL_HASH =
  "a045c18801de4b350b7843fce08a86c1a255336c4b6df4ef1aec2de4146ad04d";

const SEED_POSTS: BlogPost[] = [
  {
    id: "seed-why-zeus",
    title: "Why ZEUS AMMON-RA 11 exists",
    author: "wozkaf",
    createdAt: "2026-09-17T20:00:00.000Z",
    body: [
      "ZEUS AMMON-RA 11 is a personal learning lab — philosophy, myths, math, flight dynamics,",
      "heat transfer, and tools from MATLAB/Octave — built so hard practice sticks.",
      "",
      "Trivia modes push memory and agency. Numerical Extreme ports real numerical analysis work.",
      "University Projects carry coursework into the same neon shell. Babel / Numerology and the",
      "AI Detector exist because deep technical writing gets dismissed as “AI” too easily;",
      "the detector and Writing-IQ stack are there to stress-test that claim.",
      "",
      "This Blog is for creator updates over time: what changed, why it was made, and notes for",
      "new visitors. Git history still lives under Updates; this page is the human changelog.",
    ].join("\n"),
  },
];

type StoreFile = { posts: BlogPost[]; updatedAt?: string };

type BlogGlobal = typeof globalThis & {
  __zeusBlogPosts?: BlogPost[];
  __zeusBlogHydrated?: boolean;
  __zeusBlogHydrateAt?: number;
};

const CACHE_NAME = "zeus-blog-v1";
const CACHE_REQ = "https://zeus-ammon-ra.internal/blog/posts.json";

/** Shared remote so every online visitor sees the same posts (not isolate memory). */
const REMOTE_MANTLE =
  "https://mantledb.sh/v2/zeus-ammon-ra-11/blog/posts";
const REMOTE_GITHUB_RAW =
  "https://raw.githubusercontent.com/jonathandanangel/aero-flight-trivia/main/public/blog/posts.json";

const HYDRATE_TTL_MS = 5_000;

function g(): BlogGlobal {
  return globalThis as BlogGlobal;
}

function dataPath(): string {
  return join(process.cwd(), "data", "blog-posts.json");
}

function publicPath(): string {
  return join(process.cwd(), "public", "blog", "posts.json");
}

function hashCredentials(username: string, password: string): string {
  return createHash("sha256")
    .update(`zeus-blog-v1:${username}:${password}`, "utf8")
    .digest("hex");
}

export function verifyBlogCredentials(username: string, password: string): boolean {
  if (username !== USERNAME) return false;
  const got = hashCredentials(username, password);
  if (got.length !== CREDENTIAL_HASH.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ CREDENTIAL_HASH.charCodeAt(i);
  return diff === 0;
}

function isPost(p: unknown): p is BlogPost {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  return (
    typeof o["id"] === "string" &&
    typeof o["title"] === "string" &&
    typeof o["body"] === "string" &&
    typeof o["author"] === "string" &&
    typeof o["createdAt"] === "string"
  );
}

function parseStore(raw: string): BlogPost[] {
  try {
    const parsed = JSON.parse(raw) as StoreFile | BlogPost[];
    if (Array.isArray(parsed)) return parsed.filter(isPost);
    if (!parsed || !Array.isArray(parsed.posts)) return [];
    return parsed.posts.filter(isPost);
  } catch {
    return [];
  }
}

function readJsonFile(path: string): BlogPost[] {
  try {
    if (!existsSync(path)) return [];
    return parseStore(readFileSync(path, "utf8"));
  } catch {
    return [];
  }
}

function writeJsonFile(path: string, posts: BlogPost[]): boolean {
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(
      path,
      `${JSON.stringify({ posts, updatedAt: new Date().toISOString() }, null, 2)}\n`,
      "utf8",
    );
    return true;
  } catch {
    return false;
  }
}

function mergeById(...lists: BlogPost[][]): BlogPost[] {
  const byId = new Map<string, BlogPost>();
  for (const list of lists) {
    for (const p of list) byId.set(p.id, p);
  }
  return [...byId.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/** Keep user posts + seed overrides (edited seeds); drop unchanged seeds. */
function durableOnly(posts: BlogPost[]): BlogPost[] {
  return posts.filter((p) => {
    const seed = SEED_POSTS.find((s) => s.id === p.id);
    if (!seed) return true;
    return seed.title !== p.title || seed.body !== p.body;
  });
}

function payload(posts: BlogPost[]): StoreFile {
  return { posts: durableOnly(posts), updatedAt: new Date().toISOString() };
}

async function readFromCache(): Promise<BlogPost[]> {
  try {
    const cachesApi = (globalThis as { caches?: CacheStorage }).caches;
    if (!cachesApi?.open) return [];
    const cache = await cachesApi.open(CACHE_NAME);
    const res = await cache.match(CACHE_REQ);
    if (!res) return [];
    return parseStore(await res.text());
  } catch {
    return [];
  }
}

async function writeToCache(posts: BlogPost[]): Promise<boolean> {
  try {
    const cachesApi = (globalThis as { caches?: CacheStorage }).caches;
    if (!cachesApi?.open) return false;
    const cache = await cachesApi.open(CACHE_NAME);
    await cache.put(
      CACHE_REQ,
      new Response(JSON.stringify(payload(posts)), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }),
    );
    return true;
  } catch {
    return false;
  }
}

async function fetchRemotePosts(url: string): Promise<BlogPost[]> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json", "Cache-Control": "no-store" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return parseStore(await res.text());
  } catch {
    return [];
  }
}

async function readFromSharedRemote(): Promise<BlogPost[]> {
  const [mantle, github] = await Promise.all([
    fetchRemotePosts(REMOTE_MANTLE),
    fetchRemotePosts(REMOTE_GITHUB_RAW),
  ]);
  return mergeById(mantle, github);
}

async function writeToSharedRemote(posts: BlogPost[]): Promise<boolean> {
  const body = JSON.stringify(payload(posts));
  try {
    const res = await fetch(REMOTE_MANTLE, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body,
      cache: "no-store",
    });
    if (res.ok || res.status === 200 || res.status === 201 || res.status === 204) {
      return true;
    }
  } catch {
    /* try PUT */
  }
  try {
    const res = await fetch(REMOTE_MANTLE, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body,
      cache: "no-store",
    });
    return res.ok || res.status === 200 || res.status === 201 || res.status === 204;
  } catch {
    return false;
  }
}

function getMemory(): BlogPost[] {
  return g().__zeusBlogPosts ?? [];
}

function writableCandidates(): string[] {
  const paths = [dataPath(), publicPath()];
  try {
    paths.push(join("/tmp", "zeus-blog-posts.json"));
  } catch {
    /* ignore */
  }
  return paths;
}

async function hydrate(force = false): Promise<void> {
  const now = Date.now();
  if (
    !force &&
    g().__zeusBlogHydrated &&
    Array.isArray(g().__zeusBlogPosts) &&
    typeof g().__zeusBlogHydrateAt === "number" &&
    now - g().__zeusBlogHydrateAt! < HYDRATE_TTL_MS
  ) {
    return;
  }

  const [fromRemote, fromCache] = await Promise.all([
    readFromSharedRemote(),
    readFromCache(),
  ]);
  const fromFiles = writableCandidates().flatMap((path) => readJsonFile(path));
  // Remote wins over stale isolate memory so every visitor converges.
  g().__zeusBlogPosts = durableOnly(
    mergeById(fromFiles, fromCache, getMemory(), fromRemote),
  );
  g().__zeusBlogHydrated = true;
  g().__zeusBlogHydrateAt = now;
}

async function persistDurable(durable: BlogPost[]): Promise<{
  memory: true;
  disk: boolean;
  cache: boolean;
  remote: boolean;
}> {
  const next = durableOnly(durable);
  g().__zeusBlogPosts = next;
  g().__zeusBlogHydrated = true;
  g().__zeusBlogHydrateAt = Date.now();

  let disk = false;
  for (const path of writableCandidates()) {
    if (writeJsonFile(path, next)) disk = true;
  }
  const [cache, remote] = await Promise.all([
    writeToCache(next),
    writeToSharedRemote(next),
  ]);
  return { memory: true, disk, cache, remote };
}

/** Public list: seed + durable posts. Newest first. Always re-checks shared remote. */
export async function listBlogPosts(): Promise<BlogPost[]> {
  await hydrate(true);
  return mergeById(SEED_POSTS, getMemory());
}

export async function createBlogPost(input: {
  title: string;
  body: string;
  author: string;
}): Promise<
  | {
      ok: true;
      post: BlogPost;
      persisted: boolean;
      backends: { memory: true; disk: boolean; cache: boolean; remote: boolean };
    }
  | { ok: false; error: string }
> {
  const title = input.title.trim().slice(0, 200);
  const body = input.body.trim().slice(0, 20000);
  if (!title) return { ok: false, error: "Title is required." };
  if (!body) return { ok: false, error: "Body is required." };

  await hydrate(true);
  const post: BlogPost = {
    id: randomUUID(),
    title,
    body,
    author: (input.author.trim() || USERNAME).slice(0, 64),
    createdAt: new Date().toISOString(),
  };

  const next = mergeById(
    getMemory().filter((p) => p.id !== post.id),
    [post],
  );
  const backends = await persistDurable(next);
  const persisted = backends.remote || backends.disk || backends.cache || backends.memory;
  return { ok: true, post, persisted, backends };
}

export async function updateBlogPost(input: {
  id: string;
  title: string;
  body: string;
}): Promise<
  | {
      ok: true;
      post: BlogPost;
      persisted: boolean;
      backends: { memory: true; disk: boolean; cache: boolean; remote: boolean };
    }
  | { ok: false; error: string }
> {
  const id = input.id.trim();
  if (!id) return { ok: false, error: "Missing post id." };
  const title = input.title.trim().slice(0, 200);
  const body = input.body.trim().slice(0, 20000);
  if (!title) return { ok: false, error: "Title is required." };
  if (!body) return { ok: false, error: "Body is required." };

  await hydrate(true);
  const current = (await listBlogPosts()).find((p) => p.id === id);
  if (!current) return { ok: false, error: "Post not found." };

  const post: BlogPost = { ...current, title, body };
  const next = mergeById(
    getMemory().filter((p) => p.id !== id),
    [post],
  );
  const backends = await persistDurable(next);
  return { ok: true, post, persisted: true, backends };
}

export async function deleteBlogPost(
  id: string,
): Promise<
  | {
      ok: true;
      persisted: boolean;
      backends: { memory: true; disk: boolean; cache: boolean; remote: boolean };
    }
  | { ok: false; error: string }
> {
  await hydrate(true);
  const seed = SEED_POSTS.find((p) => p.id === id);
  const mem = getMemory();
  if (seed && !mem.some((p) => p.id === id)) {
    return { ok: false, error: "Built-in seed posts cannot be deleted (edit instead)." };
  }
  if (!seed && !mem.some((p) => p.id === id)) {
    return { ok: false, error: "Post not found." };
  }
  const next = mem.filter((p) => p.id !== id);
  const backends = await persistDurable(next);
  return { ok: true, persisted: true, backends };
}

/** Merge creator-client posts into the shared store (authenticated). */
export async function mergeBlogPosts(
  incoming: BlogPost[],
): Promise<{
  ok: true;
  backends: { memory: true; disk: boolean; cache: boolean; remote: boolean };
}> {
  await hydrate(true);
  const cleaned = incoming.filter(isPost);
  const next = durableOnly(mergeById(getMemory(), cleaned));
  const backends = await persistDurable(next);
  return { ok: true, backends };
}
