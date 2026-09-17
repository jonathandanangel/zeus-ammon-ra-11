import { createFileRoute } from "@tanstack/react-router";
import {
  akinatorAnswer,
  akinatorBack,
  akinatorContinue,
  akinatorStart,
  AKI_CREDIT,
} from "@/game/who-am-i/akinator";

/**
 * Same-origin Akinator proxy (aki-api runs only on the server).
 */
export const Route = createFileRoute("/api/akinator")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            action?: unknown;
            region?: unknown;
            childMode?: unknown;
            session?: unknown;
            answer?: unknown;
          };
          const action = typeof body.action === "string" ? body.action : "";

          if (action === "start") {
            return Response.json(await akinatorStart(body));
          }
          if (action === "answer") {
            return Response.json(await akinatorAnswer(body));
          }
          if (action === "back") {
            return Response.json(await akinatorBack(body));
          }
          if (action === "continue") {
            return Response.json(await akinatorContinue(body));
          }

          return Response.json({
            ok: false,
            phase: "error",
            question: "",
            answers: [],
            progress: 0,
            step: 0,
            session: null,
            guess: null,
            errorMessage: `Unknown action: ${action || "(empty)"}`,
            credit: AKI_CREDIT,
          });
        } catch (e) {
          return Response.json({
            ok: false,
            phase: "error",
            question: "",
            answers: [],
            progress: 0,
            step: 0,
            session: null,
            guess: null,
            errorMessage: e instanceof Error ? e.message : "Akinator proxy error.",
            credit: AKI_CREDIT,
          });
        }
      },
    },
  },
});
