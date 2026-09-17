#!/usr/bin/env node
/**
 * Rebuild src/data/updates-log.ts from the full git history (subjects, bodies, file stats).
 * Run: node scripts/build-updates-log.mjs
 *
 * Note: with `git log --pretty=…%x1e --numstat`, each commit's numstat appears
 * AFTER the record separator, before the next COMMIT line.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";

const ORIGIN = "https://github.com/jonathandanangel/aero-flight-trivia";
const MIRROR = "https://github.com/jonathandanangel/zeus-ammon-ra-11";
const AI_AUTHOR_RE = /(gpt-engineer|lovable|cursoragent|cursor\b|copilot|dependabot|bot@|\[bot\])/i;
const AI_BODY_RE = /co-authored-by:\s*(cursor|gpt-engineer|lovable|copilot|cursoragent)/i;

function classify(author, email, body) {
  const blob = `${author}\n${email}\n${body}`;
  if (AI_AUTHOR_RE.test(blob) || AI_BODY_RE.test(body)) return "ai-assisted";
  return "human";
}

function parseNumstat(lines) {
  const files = [];
  let additions = 0;
  let deletions = 0;
  for (const line of lines) {
    const m = line.match(/^(\d+|-)\t(\d+|-)\t(.+)$/);
    if (!m) continue;
    const a = m[1] === "-" ? 0 : Number(m[1]);
    const d = m[2] === "-" ? 0 : Number(m[2]);
    additions += a;
    deletions += d;
    if (files.length < 80) files.push({ path: m[3], additions: a, deletions: d });
  }
  return { files, additions, deletions, fileCount: files.length };
}

const raw = execSync(
  "git log --pretty=format:'COMMIT%x1f%H%x1f%h%x1f%an%x1f%ae%x1f%aI%x1f%s%x1f%b%x1e' --numstat",
  { encoding: "utf8", maxBuffer: 80 * 1024 * 1024 },
);

const chunks = raw.split("\x1e");
const entries = [];

for (let i = 0; i < chunks.length; i++) {
  const chunk = chunks[i];
  const commitAt = chunk.indexOf("COMMIT\x1f");
  if (commitAt === -1) continue;

  // Numstat for the *previous* commit sits before this COMMIT marker.
  if (entries.length > 0 && commitAt > 0) {
    const prevStats = parseNumstat(chunk.slice(0, commitAt).split("\n"));
    const prev = entries[entries.length - 1];
    prev.files = prevStats.files;
    prev.additions = prevStats.additions;
    prev.deletions = prevStats.deletions;
    prev.fileCount = prevStats.fileCount;
  }

  const payload = chunk.slice(commitAt);
  const firstNl = payload.indexOf("\n");
  const headLine = firstNl === -1 ? payload : payload.slice(0, firstNl);
  const bodyRest = firstNl === -1 ? "" : payload.slice(firstNl + 1);
  const parts = headLine.split("\x1f");
  if (parts.length < 7) continue;

  const hash = parts[1] ?? "";
  const short = parts[2] ?? "";
  const author = parts[3] ?? "";
  const email = parts[4] ?? "";
  const date = parts[5] ?? "";
  const subject = parts[6] || "(no subject)";
  const bodyFirst = parts.slice(7).join("\x1f");
  const body = [bodyFirst, bodyRest]
    .join("\n")
    .replace(/\r/g, "")
    .trim();

  entries.push({
    hash,
    short,
    author,
    email,
    date,
    subject,
    body,
    additions: 0,
    deletions: 0,
    fileCount: 0,
    files: [],
    kind: classify(author, email, body),
    githubUrl: `${ORIGIN}/commit/${hash}`,
  });
}

// Trailing numstat after the final \x1e (last chunk may be only stats)
const lastChunk = chunks[chunks.length - 1] ?? "";
if (entries.length > 0 && !lastChunk.includes("COMMIT\x1f")) {
  const stats = parseNumstat(lastChunk.split("\n"));
  const last = entries[entries.length - 1];
  last.files = stats.files;
  last.additions = stats.additions;
  last.deletions = stats.deletions;
  last.fileCount = stats.fileCount;
} else if (entries.length > 0) {
  // Stats for the last commit may follow its body in the same chunk after body newlines — already handled via next chunk.
  // Also handle: final chunk is "\nstats" only when pretty ends with \x1e and numstat follows as its own segment.
  const afterLast = chunks[chunks.length - 1];
  if (afterLast && !afterLast.includes("COMMIT\x1f")) {
    const stats = parseNumstat(afterLast.split("\n"));
    const last = entries[entries.length - 1];
    if (last.fileCount === 0 && stats.fileCount > 0) {
      last.files = stats.files;
      last.additions = stats.additions;
      last.deletions = stats.deletions;
      last.fileCount = stats.fileCount;
    }
  }
}

const generatedAt = new Date().toISOString();
const header = `/* Auto-generated from git history — regenerate with: node scripts/build-updates-log.mjs */
export const UPDATES_REPO = ${JSON.stringify(ORIGIN)} as const;
export const UPDATES_MIRROR_REPO = ${JSON.stringify(MIRROR)} as const;
export const UPDATES_GENERATED_AT = ${JSON.stringify(generatedAt)} as const;
export const UPDATES_COMMIT_COUNT = ${entries.length} as const;

export type UpdateKind = "human" | "ai-assisted";

export type UpdateFileChange = {
  path: string;
  additions: number;
  deletions: number;
};

export type UpdateEntry = {
  hash: string;
  short: string;
  author: string;
  email: string;
  date: string;
  subject: string;
  body: string;
  additions: number;
  deletions: number;
  fileCount: number;
  files: UpdateFileChange[];
  kind: UpdateKind;
  githubUrl: string;
};

export const UPDATES_LOG: UpdateEntry[] = `;

fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync("src/data/updates-log.ts", `${header}${JSON.stringify(entries, null, 2)};
`);

const ai = entries.filter((e) => e.kind === "ai-assisted").length;
const withFiles = entries.filter((e) => e.fileCount > 0).length;
console.log(
  `Wrote ${entries.length} updates (${ai} AI-assisted, ${withFiles} with file stats) → src/data/updates-log.ts`,
);
