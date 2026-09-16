/**
 * Face++ Detect proxy via TanStack Start server function.
 * API key/secret are supplied per request by the user — never hardcoded.
 * Mirrors TheVanityApp.m: URL-encoded first, then multipart; US↔CN endpoint fallback.
 */
import { createServerFn } from "@tanstack/react-start";

export type FaceppEmotion = {
  anger: number | null;
  disgust: number | null;
  fear: number | null;
  happiness: number | null;
  neutral: number | null;
  sadness: number | null;
  surprise: number | null;
};

export type FaceppDetectInput = {
  apiKey: string;
  apiSecret: string;
  region: "us" | "cn";
  imageBase64: string;
  returnAttributes?: string;
};

export type FaceppDetectOutput = {
  ok: boolean;
  errorMessage: string;
  maleScore: number | null;
  femaleScore: number | null;
  age: number | null;
  gender: string;
  emotion: FaceppEmotion | null;
  faceCount: number;
  encoding: "urlencoded" | "multipart" | "";
  endpoint: string;
  status: number | null;
  requestId: string;
  timeUsed: number | null;
};

function asNumber(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function emptyEmotion(): FaceppEmotion {
  return {
    anger: null,
    disgust: null,
    fear: null,
    happiness: null,
    neutral: null,
    sadness: null,
    surprise: null,
  };
}

function parseEmotion(attrs: Record<string, unknown>): FaceppEmotion | null {
  const raw = attrs["emotion"];
  if (!raw || typeof raw !== "object") return null;
  const e = raw as Record<string, unknown>;
  return {
    anger: asNumber(e["anger"]),
    disgust: asNumber(e["disgust"]),
    fear: asNumber(e["fear"]),
    happiness: asNumber(e["happiness"]),
    neutral: asNumber(e["neutral"]),
    sadness: asNumber(e["sadness"]),
    surprise: asNumber(e["surprise"]),
  };
}

function parseFaces(data: Record<string, unknown>): Omit<
  FaceppDetectOutput,
  | "ok"
  | "errorMessage"
  | "endpoint"
  | "status"
  | "requestId"
  | "timeUsed"
  | "encoding"
  | "faceCount"
> & { faceCount: number } {
  const faces = data["faces"];
  if (!Array.isArray(faces) || faces.length === 0) {
    return {
      maleScore: null,
      femaleScore: null,
      age: null,
      gender: "",
      emotion: null,
      faceCount: 0,
    };
  }
  const face = faces[0] as Record<string, unknown>;
  const attrs = (face["attributes"] ?? {}) as Record<string, unknown>;
  const beauty = (attrs["beauty"] ?? {}) as Record<string, unknown>;
  const ageObj = (attrs["age"] ?? {}) as Record<string, unknown>;
  const genderObj = (attrs["gender"] ?? {}) as Record<string, unknown>;
  return {
    maleScore: asNumber(beauty["male_score"]),
    femaleScore: asNumber(beauty["female_score"]),
    age: asNumber(ageObj["value"]),
    gender: typeof genderObj["value"] === "string" ? genderObj["value"] : "",
    emotion: parseEmotion(attrs),
    faceCount: faces.length,
  };
}

async function postUrlEncoded(
  url: string,
  fields: Record<string, string>,
): Promise<{ status: number; data: Record<string, unknown> }> {
  const body = new URLSearchParams(fields);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  let data: Record<string, unknown> = {};
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    data = {};
  }
  return { status: res.status, data };
}

/** Multipart fallback — keys in query string, image as file part (MATLAB FormProvider path). */
async function postMultipart(
  url: string,
  apiKey: string,
  apiSecret: string,
  returnAttributes: string,
  imageBase64: string,
): Promise<{ status: number; data: Record<string, unknown> }> {
  const bytes = Uint8Array.from(atob(imageBase64), (c) => c.charCodeAt(0));
  const form = new FormData();
  form.append("image_file", new Blob([bytes], { type: "image/jpeg" }), "face.jpg");
  const qs = new URLSearchParams({
    api_key: apiKey,
    api_secret: apiSecret,
    return_attributes: returnAttributes,
  });
  const res = await fetch(`${url}?${qs.toString()}`, {
    method: "POST",
    body: form,
  });
  let data: Record<string, unknown> = {};
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    data = {};
  }
  return { status: res.status, data };
}

function metaFrom(json: Record<string, unknown>, status: number) {
  return {
    status,
    requestId: typeof json["request_id"] === "string" ? json["request_id"] : "",
    timeUsed: asNumber(json["time_used"]),
  };
}

function errorFrom(json: Record<string, unknown>, status: number): string {
  if (typeof json["error_message"] === "string" && json["error_message"]) {
    return json["error_message"];
  }
  if (status !== 200) return `HTTP ${status}`;
  if (!Array.isArray(json["faces"]) || json["faces"].length === 0) {
    return "No faces detected";
  }
  return "API failed";
}

export const faceppDetect = createServerFn({ method: "POST" })
  .inputValidator((input: FaceppDetectInput) => {
    if (!input || typeof input !== "object") throw new Error("Invalid payload.");
    if (!input.apiKey?.trim() || !input.apiSecret?.trim()) {
      throw new Error("API key and secret are required.");
    }
    if (!input.imageBase64?.trim()) throw new Error("Image payload is empty.");
    if (input.region !== "us" && input.region !== "cn") {
      throw new Error("Region must be us or cn.");
    }
    return {
      apiKey: input.apiKey.trim(),
      apiSecret: input.apiSecret.trim(),
      region: input.region,
      imageBase64: input.imageBase64.replace(/^data:[^;]+;base64,/, ""),
      returnAttributes: input.returnAttributes?.trim() || "gender,age,emotion,beauty",
    };
  })
  .handler(async ({ data }): Promise<FaceppDetectOutput> => {
    const endpoints =
      data.region === "cn"
        ? [
            "https://api-cn.faceplusplus.com/facepp/v3/detect",
            "https://api-us.faceplusplus.com/facepp/v3/detect",
          ]
        : [
            "https://api-us.faceplusplus.com/facepp/v3/detect",
            "https://api-cn.faceplusplus.com/facepp/v3/detect",
          ];

    let lastError = "API failed on both endpoints. Check region/key.";
    let lastEndpoint = endpoints[0]!;
    let lastStatus: number | null = null;
    let lastRequestId = "";
    let lastTimeUsed: number | null = null;
    let lastEncoding: FaceppDetectOutput["encoding"] = "";

    for (const endpoint of endpoints) {
      lastEndpoint = endpoint;

      // 1) URL-encoded base64 (primary)
      {
        const { status, data: json } = await postUrlEncoded(endpoint, {
          api_key: data.apiKey,
          api_secret: data.apiSecret,
          image_base64: data.imageBase64,
          return_attributes: data.returnAttributes,
        });
        const meta = metaFrom(json, status);
        lastStatus = meta.status;
        lastRequestId = meta.requestId;
        lastTimeUsed = meta.timeUsed;
        lastEncoding = "urlencoded";

        if (status === 200 && Array.isArray(json["faces"]) && json["faces"].length > 0) {
          const parsed = parseFaces(json);
          return {
            ok: true,
            errorMessage: "",
            ...parsed,
            encoding: "urlencoded",
            endpoint,
            status,
            requestId: lastRequestId,
            timeUsed: lastTimeUsed,
          };
        }
        lastError = errorFrom(json, status);
      }

      // 2) Multipart fallback (MATLAB second attempt)
      {
        const { status, data: json } = await postMultipart(
          endpoint,
          data.apiKey,
          data.apiSecret,
          data.returnAttributes,
          data.imageBase64,
        );
        const meta = metaFrom(json, status);
        lastStatus = meta.status;
        lastRequestId = meta.requestId || lastRequestId;
        lastTimeUsed = meta.timeUsed ?? lastTimeUsed;
        lastEncoding = "multipart";

        if (status === 200 && Array.isArray(json["faces"]) && json["faces"].length > 0) {
          const parsed = parseFaces(json);
          return {
            ok: true,
            errorMessage: "",
            ...parsed,
            encoding: "multipart",
            endpoint,
            status,
            requestId: lastRequestId,
            timeUsed: lastTimeUsed,
          };
        }
        lastError = errorFrom(json, status);
      }
    }

    return {
      ok: false,
      errorMessage: lastError,
      maleScore: null,
      femaleScore: null,
      age: null,
      gender: "",
      emotion: emptyEmotion(),
      faceCount: 0,
      encoding: lastEncoding,
      endpoint: lastEndpoint,
      status: lastStatus,
      requestId: lastRequestId,
      timeUsed: lastTimeUsed,
    };
  });
