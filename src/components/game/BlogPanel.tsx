import * as React from "react";
import { cn } from "@/lib/utils";

export type BlogPost = {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
};

type Session = { username: string; password: string };

const SESSION_KEY = "zeus-blog-session-v1";
const POSTS_KEY = "zeus-blog-posts-v1";

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

function mergePosts(...lists: BlogPost[][]): BlogPost[] {
  const byId = new Map<string, BlogPost>();
  for (const list of lists) {
    for (const p of list) {
      if (isPost(p)) byId.set(p.id, p);
    }
  }
  return [...byId.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function loadLocalPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { posts?: unknown };
    if (!parsed || !Array.isArray(parsed.posts)) return [];
    return parsed.posts.filter(isPost);
  } catch {
    return [];
  }
}

function saveLocalPosts(posts: BlogPost[]) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify({ posts }));
  } catch {
    /* ignore */
  }
}

function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (
      parsed &&
      typeof parsed.username === "string" &&
      typeof parsed.password === "string" &&
      parsed.username &&
      parsed.password
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function saveSession(session: Session | null) {
  try {
    if (!session) sessionStorage.removeItem(SESSION_KEY);
    else sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

async function apiGet(): Promise<{ ok: boolean; posts: BlogPost[]; error?: string }> {
  const res = await fetch("/api/blog", { cache: "no-store" });
  return (await res.json()) as { ok: boolean; posts: BlogPost[]; error?: string };
}

async function staticGet(): Promise<BlogPost[]> {
  try {
    const res = await fetch("/blog/posts.json", { cache: "no-store" });
    if (!res.ok) return [];
    const json = (await res.json()) as { posts?: unknown };
    if (!json || !Array.isArray(json.posts)) return [];
    return json.posts.filter(isPost);
  } catch {
    return [];
  }
}

async function apiPost(payload: Record<string, unknown>) {
  const res = await fetch("/api/blog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const json = (await res.json()) as {
    ok: boolean;
    error?: string;
    username?: string;
    posts?: BlogPost[];
    post?: BlogPost;
    persisted?: boolean;
    backends?: { memory?: boolean; disk?: boolean; cache?: boolean };
  };
  return { status: res.status, ...json };
}

export function BlogPanel({ onBack }: { onBack: () => void }) {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [status, setStatus] = React.useState("Loading creator notes…");
  const [busy, setBusy] = React.useState(false);
  const [session, setSession] = React.useState<Session | null>(null);
  const [showLogin, setShowLogin] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const field =
    "w-full rounded-sm border border-cyan/40 bg-deepblue/50 backdrop-blur-md px-3 py-2 font-mono text-xs text-moon outline-none transition placeholder:text-muted-foreground hover:border-cyan/60 focus:border-cyan focus:ring-1 focus:ring-cyan/30";
  const btn =
    "rounded-sm border border-cyan/50 bg-deepblue/50 backdrop-blur-md px-4 py-2 font-display text-xs uppercase tracking-[0.18em] text-cyan transition hover:bg-cyan/20 hover:text-moon disabled:opacity-40";
  const btnAmber =
    "rounded-sm border border-amber/50 bg-deepblue/50 backdrop-blur-md px-4 py-2 font-display text-xs uppercase tracking-[0.18em] text-amber transition hover:bg-amber/15 hover:text-moon disabled:opacity-40";
  const btnMint =
    "rounded-sm border border-mint/50 bg-deepblue/50 backdrop-blur-md px-4 py-2 font-display text-xs uppercase tracking-[0.18em] text-mint transition hover:bg-mint/15 hover:text-moon disabled:opacity-40";
  const btnOrange =
    "rounded-sm border border-orange/40 bg-deepblue/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-orange transition hover:bg-orange/10 disabled:opacity-40";
  const btnGhost =
    "rounded-sm border border-cyan/40 bg-deepblue/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan transition hover:bg-cyan/10 disabled:opacity-40";

  const applyPosts = React.useCallback((next: BlogPost[]) => {
    const merged = mergePosts(next);
    setPosts(merged);
    saveLocalPosts(merged);
    setStatus(
      merged.length
        ? `${merged.length} note${merged.length === 1 ? "" : "s"} from the creator`
        : "No posts yet.",
    );
  }, []);

  const refresh = React.useCallback(async () => {
    try {
      const local = loadLocalPosts();
      const [api, stat] = await Promise.all([apiGet(), staticGet()]);
      const server = api.ok ? (api.posts ?? []) : [];
      const merged = mergePosts(local, stat, server);
      if (!api.ok && !stat.length && !local.length) {
        setStatus(api.error || "Could not load blog.");
        return;
      }
      applyPosts(merged);
    } catch (e) {
      const local = loadLocalPosts();
      if (local.length) {
        applyPosts(local);
        setStatus("Showing cached creator notes (network/API unavailable).");
        return;
      }
      setStatus(e instanceof Error ? e.message : "Blog fetch failed.");
    }
  }, [applyPosts]);

  React.useEffect(() => {
    setSession(loadSession());
    void refresh();
  }, [refresh]);

  function cancelCompose() {
    setEditingId(null);
    setTitle("");
    setBody("");
  }

  function startEdit(post: BlogPost) {
    setEditingId(post.id);
    setTitle(post.title);
    setBody(post.body);
    setShowLogin(false);
    setStatus(`Editing “${post.title}”`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("Signing in…");
    try {
      const out = await apiPost({
        action: "login",
        username: username.trim(),
        password,
      });
      if (!out.ok) {
        setStatus(out.error || "Login failed.");
        return;
      }
      const next = { username: username.trim(), password };
      saveSession(next);
      setSession(next);
      setShowLogin(false);
      setPassword("");
      setStatus(`Blog mode · signed in as ${next.username}`);
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    saveSession(null);
    setSession(null);
    setShowLogin(false);
    cancelCompose();
    setStatus("Signed out of blog mode. Public posts stay on the page.");
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setBusy(true);
    setStatus(editingId ? "Saving edits…" : "Publishing…");
    try {
      const out = await apiPost(
        editingId
          ? {
              action: "update",
              username: session.username,
              password: session.password,
              id: editingId,
              title,
              body,
            }
          : {
              action: "create",
              username: session.username,
              password: session.password,
              title,
              body,
            },
      );
      if (!out.ok) {
        setStatus(out.error || (editingId ? "Save failed." : "Publish failed."));
        return;
      }
      const next = mergePosts(
        loadLocalPosts(),
        out.posts ?? [],
        out.post ? [out.post] : [],
        posts,
      );
      applyPosts(next);
      // Push full list back so every visitor's /api/blog sees the same posts
      try {
        const pushed = await apiPost({
          action: "push",
          username: session.username,
          password: session.password,
          posts: next.filter((p) => !p.id.startsWith("seed-") || p.title !== "Why ZEUS AMMON-RA 11 exists"),
        });
        if (pushed.ok && pushed.posts) applyPosts(mergePosts(next, pushed.posts));
      } catch {
        /* keep local/server create result */
      }
      cancelCompose();
      setStatus(
        editingId
          ? "Edits saved — everyone can see this post. It stays until you edit or delete."
          : "Published — everyone can see this post. It stays until you edit or delete.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!session) return;
    if (!window.confirm("Delete this post?")) return;
    setBusy(true);
    try {
      const out = await apiPost({
        action: "delete",
        username: session.username,
        password: session.password,
        id,
      });
      if (!out.ok) {
        setStatus(out.error || "Delete failed.");
        return;
      }
      if (editingId === id) cancelCompose();
      const next = (out.posts ?? posts.filter((p) => p.id !== id)).filter((p) => p.id !== id);
      // If server returned full list, prefer it; always drop deleted id locally
      applyPosts(mergePosts(out.posts ?? [], next).filter((p) => p.id !== id));
      setStatus("Post deleted.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel mx-auto w-full max-w-3xl space-y-5 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-magenta">
            ZEUS AMMON-RA 11 · WOZKAF
          </p>
          <h1 className="mt-1 font-display text-xl text-cyan text-glow">CREATOR BLOG</h1>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            Why this was made · notes over time for new visitors
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-border px-3 py-1 font-mono text-xs"
        >
          Back
        </button>
      </div>

      <p className="font-mono text-sm leading-relaxed text-muted-foreground">
        Public notes stay on this page for everyone until you edit or delete them. Git history
        still lives under <span className="text-cyan">Updates</span>.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {session ? (
          <>
            <span className="rounded-sm border border-mint/50 bg-mint/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-mint shadow-[0_0_18px_rgba(52,211,153,0.18)]">
              Blog mode · {session.username}
            </span>
            <button type="button" className={btn} onClick={handleLogout} disabled={busy}>
              Sign out
            </button>
          </>
        ) : (
          <button
            type="button"
            className={btnAmber}
            onClick={() => setShowLogin((v) => !v)}
            disabled={busy}
          >
            {showLogin ? "Cancel login" : "Creator login"}
          </button>
        )}
        <button type="button" className={btn} onClick={() => void refresh()} disabled={busy}>
          Refresh
        </button>
      </div>

      <p
        className={cn(
          "font-mono text-[11px]",
          status.toLowerCase().includes("fail") || status.toLowerCase().includes("invalid")
            ? "text-orange"
            : "text-muted-foreground",
        )}
      >
        {status}
      </p>

      {showLogin && !session && (
        <form
          onSubmit={handleLogin}
          className="space-y-3 rounded-sm border border-amber/40 bg-deepblue/50 p-4 shadow-[0_0_24px_rgba(251,191,36,0.12)]"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber">
            Enter blog mode
          </p>
          <input
            className={field}
            autoComplete="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className={field}
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={btnAmber} disabled={busy}>
            Unlock compose
          </button>
        </form>
      )}

      {session && (
        <form
          onSubmit={handlePublish}
          className="space-y-3 rounded-sm border border-mint/40 bg-deepblue/50 p-4 shadow-[0_0_24px_rgba(52,211,153,0.12)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-mint">
              {editingId ? "Edit transmission" : "New transmission"}
            </p>
            {editingId && (
              <button type="button" className={btnGhost} onClick={cancelCompose} disabled={busy}>
                Cancel edit
              </button>
            )}
          </div>
          <input
            className={field}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
          />
          <textarea
            className={cn(field, "min-h-[140px] resize-y leading-relaxed")}
            placeholder="What changed, why it matters, notes for new users…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={20000}
          />
          <button
            type="submit"
            className={btnMint}
            disabled={busy || !title.trim() || !body.trim()}
          >
            {editingId ? "Save edits" : "Publish"}
          </button>
        </form>
      )}

      <div className="max-h-[min(65vh,680px)] space-y-3 overflow-y-auto pr-1">
        {posts.map((post) => (
          <article
            key={post.id}
            className={cn(
              "rounded-sm border bg-deepblue/60 p-4 transition",
              editingId === post.id
                ? "border-mint/55 shadow-[0_0_22px_rgba(52,211,153,0.16)]"
                : "border-cyan/25 hover:border-cyan/45",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {formatWhen(post.createdAt)} · {post.author}
                  {editingId === post.id ? " · editing" : ""}
                </p>
                <h2 className="mt-1 font-display text-base tracking-[0.04em] text-moon">
                  {post.title}
                </h2>
              </div>
              {session && (
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    className={btnGhost}
                    onClick={() => startEdit(post)}
                    disabled={busy}
                  >
                    Edit
                  </button>
                  {!post.id.startsWith("seed-") && (
                    <button
                      type="button"
                      className={btnOrange}
                      onClick={() => void handleDelete(post.id)}
                      disabled={busy}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
            <pre className="mt-3 whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-moon/85">
              {post.body}
            </pre>
          </article>
        ))}
        {posts.length === 0 && (
          <p className="rounded-sm border border-border bg-deepblue/40 p-4 font-mono text-xs text-muted-foreground">
            No creator notes yet.
          </p>
        )}
      </div>
    </div>
  );
}
