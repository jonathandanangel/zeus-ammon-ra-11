import { createFileRoute } from "@tanstack/react-router";
import { analyzeWritingIq, WRITING_IQ_SOURCE } from "@/game/ai-detector/writingIq";

/**
 * Same-origin Writing to IQ proxy.
 * Avoids CSRF on createServerFn and keeps the outbound GET to writingtoiq.com
 * on the server (no browser CORS).
 */
export const Route = createFileRoute("/api/writing-iq")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { content?: unknown };
          const content = typeof body.content === "string" ? body.content : "";
          const result = await analyzeWritingIq(content);
          return Response.json(result);
        } catch (e) {
          return Response.json(
            {
              ok: false,
              iq: null,
              bandLabel: "",
              resultText: "",
              errorMessage: e instanceof Error ? e.message : "Writing to IQ proxy error.",
              status: null,
              sourceUrl: WRITING_IQ_SOURCE.siteUrl,
              endpointUrl: WRITING_IQ_SOURCE.endpointUrl,
            },
            { status: 200 },
          );
        }
      },
    },
  },
});
