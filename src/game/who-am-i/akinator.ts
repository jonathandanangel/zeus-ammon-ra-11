/**
 * Server-side Akinator (aki-api) session helpers.
 * https://github.com/jgoralcz/aki-api
 */
import type { Aki as AkiClass, answers, region } from "aki-api";

type Aki = InstanceType<typeof AkiClass>;

/** aki-api is Node-only; load it lazily so it never enters the SSR/client module graph. */
async function loadAki(): Promise<typeof AkiClass> {
  // Import the class module directly: aki-api's index.js reads a CA bundle file
  // at import time that does not exist here (postinstall scripts are skipped).
  const mod = (await import("aki-api/dist/src/Akinator")) as unknown as {
    default: typeof AkiClass;
  };
  return mod.default;
}

export const AKI_CREDIT = "Powered by Akinator via aki-api (jgoralcz/aki-api)";

export type AkiAnswerId = 0 | 1 | 2 | 3 | 4;

export type AkiSessionState = {
  region: region;
  childMode: boolean;
  session: string;
  signature: string;
  currentStep: number;
  progress: number;
  answers: string[];
};

export type AkiGuess = {
  name: string;
  description: string;
  photo: string;
  probabilityHint: string;
};

export type AkiClientState = {
  ok: boolean;
  phase: "question" | "guess" | "error";
  question: string;
  answers: string[];
  progress: number;
  step: number;
  session: AkiSessionState | null;
  guess: AkiGuess | null;
  errorMessage: string;
  credit: string;
};

const EMPTY: AkiClientState = {
  ok: false,
  phase: "error",
  question: "",
  answers: [],
  progress: 0,
  step: 0,
  session: null,
  guess: null,
  errorMessage: "",
  credit: AKI_CREDIT,
};

function isRegion(v: unknown): v is region {
  return typeof v === "string" && v.length > 0;
}

function snapshot(aki: Aki): AkiSessionState {
  return {
    region: aki.region,
    childMode: !!aki.childMode,
    session: String(aki.session ?? ""),
    signature: String(aki.signature ?? ""),
    currentStep: Number(aki.currentStep) || 0,
    progress: Number(aki.progress) || 0,
    answers: Array.isArray(aki.answers) ? aki.answers.map(String) : [],
  };
}

function attachBrowserHeaders(aki: Aki) {
  aki.config = {
    ...(aki.config ?? {}),
    headers: {
      ...((aki.config as { headers?: Record<string, string> } | undefined)?.headers ?? {}),
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: `https://${aki.region}.akinator.com/`,
    },
    timeout: 20_000,
  };
}

async function hydrate(state: AkiSessionState): Promise<Aki> {
  const Aki = await loadAki();
  const aki = new Aki({ region: state.region, childMode: state.childMode });
  attachBrowserHeaders(aki);
  aki.session = state.session;
  aki.signature = state.signature;
  aki.currentStep = state.currentStep;
  aki.progress = state.progress;
  aki.answers = state.answers;
  return aki;
}

function isGuess(result: unknown): result is {
  id_base_proposition?: string;
  name_proposition?: string;
  description_proposition?: string;
  photo?: string;
  completion?: string;
} {
  return !!result && typeof result === "object" && "id_base_proposition" in result;
}

function toClient(
  aki: Aki,
  result: unknown,
  forceGuess = false,
): AkiClientState {
  if (forceGuess || isGuess(result)) {
    const g = (isGuess(result) ? result : aki.guess) as {
      name_proposition?: string;
      description_proposition?: string;
      photo?: string;
      completion?: string;
    } | undefined;
    return {
      ok: true,
      phase: "guess",
      question: "",
      answers: aki.answers?.length ? aki.answers : ["Yes", "No", "Don't know", "Probably", "Probably not"],
      progress: Number(aki.progress) || 0,
      step: Number(aki.currentStep) || 0,
      session: snapshot(aki),
      guess: {
        name: String(g?.name_proposition ?? "Unknown"),
        description: String(g?.description_proposition ?? ""),
        photo: String(g?.photo ?? ""),
        probabilityHint: String(g?.completion ?? ""),
      },
      errorMessage: "",
      credit: AKI_CREDIT,
    };
  }

  const q =
    (result && typeof result === "object" && "question" in result
      ? String((result as { question?: string }).question ?? "")
      : "") || String(aki.question ?? "");

  return {
    ok: true,
    phase: "question",
    question: q,
    answers: aki.answers?.length
      ? aki.answers
      : ["Yes", "No", "Don't know", "Probably", "Probably not"],
    progress: Number(aki.progress) || 0,
    step: Number(aki.currentStep) || 0,
    session: snapshot(aki),
    guess: null,
    errorMessage: "",
    credit: AKI_CREDIT,
  };
}

function friendlyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  const status =
    e && typeof e === "object" && "response" in e
      ? Number((e as { response?: { status?: number } }).response?.status)
      : NaN;
  if (status === 403 || /403|cloudflare|just a moment/i.test(msg)) {
    return "Akinator blocked the request (Cloudflare). Try again in a moment from your network.";
  }
  if (/timeout|ETIMEDOUT|AbortError/i.test(msg)) {
    return "Akinator timed out. Check your connection and retry.";
  }
  if (/session|start the game/i.test(msg)) {
    return "Session expired. Start a new round.";
  }
  return msg || "Akinator request failed.";
}

export async function akinatorStart(input: {
  region?: unknown;
  childMode?: unknown;
}): Promise<AkiClientState> {
  try {
    const region = isRegion(input.region) ? input.region : "en";
    const childMode = input.childMode === true;
    const Aki = await loadAki();
    const aki = new Aki({ region, childMode });
    attachBrowserHeaders(aki);
    await aki.start();
    return toClient(aki, { question: aki.question });
  } catch (e) {
    return { ...EMPTY, errorMessage: friendlyError(e) };
  }
}

export async function akinatorAnswer(input: {
  session?: unknown;
  answer?: unknown;
}): Promise<AkiClientState> {
  try {
    const session = input.session as AkiSessionState | undefined;
    if (!session?.session || !session.signature || !isRegion(session.region)) {
      return { ...EMPTY, errorMessage: "Missing Akinator session. Start a new round." };
    }
    const answerNum = Number(input.answer);
    if (![0, 1, 2, 3, 4].includes(answerNum)) {
      return { ...EMPTY, errorMessage: "Invalid answer id (use 0–4)." };
    }
    const aki = await hydrate(session);
    const result = await aki.step(answerNum as answers);
    if (result instanceof Error) throw result;
    return toClient(aki, result);
  } catch (e) {
    return { ...EMPTY, errorMessage: friendlyError(e) };
  }
}

export async function akinatorBack(input: { session?: unknown }): Promise<AkiClientState> {
  try {
    const session = input.session as AkiSessionState | undefined;
    if (!session?.session || !session.signature || !isRegion(session.region)) {
      return { ...EMPTY, errorMessage: "Missing Akinator session. Start a new round." };
    }
    const aki = await hydrate(session);
    const result = await aki.back();
    if (result instanceof Error) throw result;
    return toClient(aki, result);
  } catch (e) {
    return { ...EMPTY, errorMessage: friendlyError(e) };
  }
}

export async function akinatorContinue(input: { session?: unknown }): Promise<AkiClientState> {
  try {
    const session = input.session as AkiSessionState | undefined;
    if (!session?.session || !session.signature || !isRegion(session.region)) {
      return { ...EMPTY, errorMessage: "Missing Akinator session. Start a new round." };
    }
    const aki = await hydrate(session);
    const result = await aki.continue();
    if (result instanceof Error) throw result;
    return toClient(aki, result);
  } catch (e) {
    return { ...EMPTY, errorMessage: friendlyError(e) };
  }
}

export const AKI_ANSWER_LABELS = [
  { id: 0 as const, key: "yes", fallback: "Yes" },
  { id: 1 as const, key: "no", fallback: "No" },
  { id: 2 as const, key: "dontKnow", fallback: "Don't know" },
  { id: 3 as const, key: "probably", fallback: "Probably" },
  { id: 4 as const, key: "probablyNot", fallback: "Probably not" },
];
