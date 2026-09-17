import { createFileRoute } from "@tanstack/react-router";
import { fetchAnuQrngBytes } from "@/game/spirit-bound/anu-qrng-fetch";

/**
 * Same-origin ANU Quantum Random Numbers proxy for Legend of Triangles.
 * Keeps outbound ANU calls (and optional API key) on the server.
 */
export const Route = createFileRoute("/api/anu-qrng")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const length = Number(url.searchParams.get("length") ?? "256");
          const result = await fetchAnuQrngBytes(length);
          return Response.json(result, { status: 200 });
        } catch (e) {
          return Response.json(
            {
              ok: false,
              data: [],
              length: 0,
              type: "uint8",
              upstream: "none",
              errorMessage: e instanceof Error ? e.message : "ANU QRNG proxy error",
              credit:
                "ANU Quantum Random Numbers — vacuum-fluctuation entropy measured at the Australian National University",
            },
            { status: 200 },
          );
        }
      },
    },
  },
});
