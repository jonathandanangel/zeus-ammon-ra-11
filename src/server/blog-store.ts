/**
 * Creator blog store — public read, authenticated write.
 * Durable order: in-memory (process) → Cache API → data/ + public/ JSON → seed.
 * Posts remain until edit/delete; /api/blog serves the same list to every visitor.
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

type StoreFile = { posts: BlogPost[] };

type BlogGlobal = typeof globalThis & {
  __zeusBlogPosts?: BlogPost[];
  __zeusBlogHydrated?: boolean;
};

const CACHE_NAME = "zeus-blog-v1";
const CACHE_REQ = "https://zeus-ammon-ra.internal/blog/posts.json";

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
    const parsed = JSON.parse(raw) as StoreFile;
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
    writeFileSync(path, `${JSON.stringify({ posts }, null, 2)}\n`, "utf8");
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
      new Response(JSON.stringify({ posts }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=31536000",
        },
      }),
    );
    return true;
  } catch {
    return false;
  }
}

function getMemory(): BlogPost[] {
  return g().__zeusBlogPosts ?? [];
}

async function hydrate(): Promise<void> {
  if (g().__zeusBlogHydrated && Array.isArray(g().__zeusBlogPosts)) return;
  const fromCache = await readFromCache();
  const fromFiles = writableCandidates().flatMap((path) => readJsonFile(path));
  g().__zeusBlogPosts = durableOnly(mergeById(fromFiles, fromCache));
  g().__zeusBlogHydrated = true;
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

async function persistDurable(durable: BlogPost[]): Promise<{
  memory: true;
  disk: boolean;
  cache: boolean;
}> {
  const next = durableOnly(durable);
  g().__zeusBlogPosts = next;
  g().__zeusBlogHydrated = true;
  let disk = false;
  for (const path of writableCandidates()) {
    if (writeJsonFile(path, next)) disk = true;
  }
  const cache = await writeToCache(next);
  return { memory: true, disk, cache };
}

/** Public list: seed + durable posts. Newest first. */
export async function listBlogPosts(): Promise<BlogPost[]> {
  await hydrate();
  return mergeById(SEED_POSTS, getMemory());
}

export async function createBlogPost(input: {
  title: string;
  body: string;
  author: string;
}): Promise<
  | { ok: true; post: BlogPost; persisted: boolean; backends: { memory: true; disk: boolean; cache: boolean } }
  | { ok: false; error: string }
> {
  const title = input.title.trim().slice(0, 200);
  const body = input.body.trim().slice(0, 20000);
  if (!title) return { ok: false, error: "Title is required." };
  if (!body) return { ok: false, error: "Body is required." };

  await hydrate();
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
  // Memory always holds the post for this runtime; cache/disk when available.
  const persisted = backends.memory || backends.disk || backends.cache;
  return { ok: true, post, persisted, backends };
}

export async function updateBlogPost(input: {
  id: string;
  title: string;
  body: string;
}): Promise<
  | { ok: true; post: BlogPost; persisted: boolean; backends: { memory: true; disk: boolean; cache: boolean } }
  | { ok: false; error: string }
> {
  const id = input.id.trim();
  if (!id) return { ok: false, error: "Missing post id." };
  const title = input.title.trim().slice(0, 200);
  const body = input.body.trim().slice(0, 20000);
  if (!title) return { ok: false, error: "Title is required." };
  if (!body) return { ok: false, error: "Body is required." };

  await hydrate();
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
  | { ok: true; persisted: boolean; backends: { memory: true; disk: boolean; cache: boolean } }
  | { ok: false; error: string }
> {
  await hydrate();
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
): Promise<{ ok: true; backends: { memory: true; disk: boolean; cache: boolean } }> {
  await hydrate();
  const cleaned = incoming.filter(isPost);
  const next = durableOnly(mergeById(getMemory(), cleaned));
  const backends = await persistDurable(next);
  return { ok: true, backends };
}
