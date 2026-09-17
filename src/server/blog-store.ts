/**
 * Creator blog store — public read, authenticated write.
 * Durable posts live in data/blog-posts.json (survive deploys when committed).
 * Seed posts always appear so new visitors understand why ZEUS was made.
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

function storePath(): string {
  return join(process.cwd(), "data", "blog-posts.json");
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

function readFromDisk(): BlogPost[] {
  try {
    const path = storePath();
    if (!existsSync(path)) return [];
    const parsed = JSON.parse(readFileSync(path, "utf8")) as StoreFile;
    if (!parsed || !Array.isArray(parsed.posts)) return [];
    return parsed.posts.filter(
      (p) =>
        p &&
        typeof p.id === "string" &&
        typeof p.title === "string" &&
        typeof p.body === "string" &&
        typeof p.author === "string" &&
        typeof p.createdAt === "string",
    );
  } catch {
    return [];
  }
}

function writeToDisk(posts: BlogPost[]): boolean {
  try {
    const path = storePath();
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify({ posts }, null, 2)}\n`, "utf8");
    return true;
  } catch {
    return false;
  }
}

/** Merge seed + disk, newest first, unique by id (disk wins on id clash). */
export function listBlogPosts(): BlogPost[] {
  const byId = new Map<string, BlogPost>();
  for (const p of SEED_POSTS) byId.set(p.id, p);
  for (const p of readFromDisk()) byId.set(p.id, p);
  return [...byId.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function createBlogPost(input: {
  title: string;
  body: string;
  author: string;
}): { ok: true; post: BlogPost; persisted: boolean } | { ok: false; error: string } {
  const title = input.title.trim().slice(0, 200);
  const body = input.body.trim().slice(0, 20000);
  if (!title) return { ok: false, error: "Title is required." };
  if (!body) return { ok: false, error: "Body is required." };

  const post: BlogPost = {
    id: randomUUID(),
    title,
    body,
    author: (input.author.trim() || USERNAME).slice(0, 64),
    createdAt: new Date().toISOString(),
  };

  const disk = readFromDisk().filter((p) => p.id !== post.id);
  disk.push(post);
  const persisted = writeToDisk(disk);
  return { ok: true, post, persisted };
}

export function updateBlogPost(input: {
  id: string;
  title: string;
  body: string;
}): { ok: true; post: BlogPost; persisted: boolean } | { ok: false; error: string } {
  const id = input.id.trim();
  if (!id) return { ok: false, error: "Missing post id." };
  const title = input.title.trim().slice(0, 200);
  const body = input.body.trim().slice(0, 20000);
  if (!title) return { ok: false, error: "Title is required." };
  if (!body) return { ok: false, error: "Body is required." };

  const current = listBlogPosts().find((p) => p.id === id);
  if (!current) return { ok: false, error: "Post not found." };

  const post: BlogPost = {
    ...current,
    title,
    body,
    // Keep original createdAt; bump updatedAt only in body metadata via optional field later
  };

  const disk = readFromDisk().filter((p) => p.id !== id);
  disk.push(post);
  const persisted = writeToDisk(disk);
  return { ok: true, post, persisted };
}

export function deleteBlogPost(
  id: string,
): { ok: true; persisted: boolean } | { ok: false; error: string } {
  const seed = SEED_POSTS.find((p) => p.id === id);
  if (seed) {
    // Removing a seed override restores the built-in seed; cannot erase seed entirely.
    const disk = readFromDisk();
    const next = disk.filter((p) => p.id !== id);
    if (next.length === disk.length) {
      return { ok: false, error: "Built-in seed posts cannot be deleted (edit instead)." };
    }
    const persisted = writeToDisk(next);
    return { ok: true, persisted };
  }
  const disk = readFromDisk();
  const next = disk.filter((p) => p.id !== id);
  if (next.length === disk.length) return { ok: false, error: "Post not found." };
  const persisted = writeToDisk(next);
  return { ok: true, persisted };
}
