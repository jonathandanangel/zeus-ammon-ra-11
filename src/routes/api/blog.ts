import { createFileRoute } from "@tanstack/react-router";
import {
  createBlogPost,
  deleteBlogPost,
  listBlogPosts,
  updateBlogPost,
  verifyBlogCredentials,
} from "@/server/blog-store";

type AuthBody = {
  username?: unknown;
  password?: unknown;
};

function readAuth(body: AuthBody): { username: string; password: string } | null {
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!username || !password) return null;
  return { username, password };
}

/**
 * Creator Blog API
 * GET  — public list
 * POST — { action: "login" | "create" | "delete", ... } with credentials for mutate
 */
export const Route = createFileRoute("/api/blog")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const posts = listBlogPosts();
          return Response.json({ ok: true, posts });
        } catch (e) {
          return Response.json(
            {
              ok: false,
              posts: [],
              error: e instanceof Error ? e.message : "Blog list failed",
            },
            { status: 500 },
          );
        }
      },
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as AuthBody & {
            action?: unknown;
            title?: unknown;
            body?: unknown;
            id?: unknown;
          };
          const action = typeof body.action === "string" ? body.action : "";
          const auth = readAuth(body);

          if (action === "login") {
            if (!auth || !verifyBlogCredentials(auth.username, auth.password)) {
              return Response.json({ ok: false, error: "Invalid username or password." }, { status: 401 });
            }
            return Response.json({ ok: true, username: auth.username });
          }

          if (!auth || !verifyBlogCredentials(auth.username, auth.password)) {
            return Response.json({ ok: false, error: "Login required to modify the blog." }, { status: 401 });
          }

          if (action === "create") {
            const title = typeof body.title === "string" ? body.title : "";
            const text = typeof body.body === "string" ? body.body : "";
            const result = createBlogPost({
              title,
              body: text,
              author: auth.username,
            });
            if (!result.ok) {
              return Response.json({ ok: false, error: result.error }, { status: 400 });
            }
            return Response.json({
              ok: true,
              post: result.post,
              persisted: result.persisted,
              posts: listBlogPosts(),
            });
          }

          if (action === "update") {
            const id = typeof body.id === "string" ? body.id : "";
            const title = typeof body.title === "string" ? body.title : "";
            const text = typeof body.body === "string" ? body.body : "";
            const result = updateBlogPost({ id, title, body: text });
            if (!result.ok) {
              return Response.json({ ok: false, error: result.error }, { status: 400 });
            }
            return Response.json({
              ok: true,
              post: result.post,
              persisted: result.persisted,
              posts: listBlogPosts(),
            });
          }

          if (action === "delete") {
            const id = typeof body.id === "string" ? body.id : "";
            if (!id) return Response.json({ ok: false, error: "Missing post id." }, { status: 400 });
            const result = deleteBlogPost(id);
            if (!result.ok) {
              return Response.json({ ok: false, error: result.error }, { status: 400 });
            }
            return Response.json({
              ok: true,
              persisted: result.persisted,
              posts: listBlogPosts(),
            });
          }

          return Response.json({ ok: false, error: "Unknown action." }, { status: 400 });
        } catch (e) {
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : "Blog request failed" },
            { status: 500 },
          );
        }
      },
    },
  },
});
