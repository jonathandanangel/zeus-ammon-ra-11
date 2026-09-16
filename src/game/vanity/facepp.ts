/**
 * Face++ Detect proxy via TanStack Start server function.
 * API key/secret are supplied per request by the user — never hardcoded.
 */
import { createServerFn } from "@tanstack/react-start";

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
  endpoint: string;
  status: number | null;
  requestId: string;
  timeUsed: number | null;
};

function asNumber(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseFaces(data: Record<string, unknown>): Omit<
  FaceppDetectOutput,
  "ok" | "errorMessage" | "endpoint" | "status" | "requestId" | "timeUsed"
> {
  const faces = data["faces"];
  if (!Array.isArray(faces) || faces.length === 0) {
    return {
      maleScore: null,
      femaleScore: null,
      age: null,
      gender: "",
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

    for (const endpoint of endpoints) {
      lastEndpoint = endpoint;
      const { status, data: json } = await postUrlEncoded(endpoint, {
        api_key: data.apiKey,
        api_secret: data.apiSecret,
        image_base64: data.imageBase64,
        return_attributes: data.returnAttributes,
      });
      lastStatus = status;
      lastRequestId =
        typeof json["request_id"] === "string" ? json["request_id"] : "";
      lastTimeUsed = asNumber(json["time_used"]);

      if (
        status === 200 &&
        Array.isArray(json["faces"]) &&
        json["faces"].length > 0
      ) {
        const parsed = parseFaces(json);
        return {
          ok: true,
          errorMessage: "",
          ...parsed,
          endpoint,
          status,
          requestId: lastRequestId,
          timeUsed: lastTimeUsed,
        };
      }

      if (typeof json["error_message"] === "string" && json["error_message"]) {
        lastError = json["error_message"];
      } else if (status !== 200) {
        lastError = `HTTP ${status}`;
      } else {
        lastError = "No faces detected";
      }
    }

    return {
      ok: false,
      errorMessage: lastError,
      maleScore: null,
      femaleScore: null,
      age: null,
      gender: "",
      endpoint: lastEndpoint,
      status: lastStatus,
      requestId: lastRequestId,
      timeUsed: lastTimeUsed,
    };
  });
