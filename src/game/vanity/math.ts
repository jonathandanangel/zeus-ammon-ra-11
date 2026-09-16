/**
 * TheVanityApp aggregation math — Face++ Beauty → IQ-like / ATTR / CAC.
 * Pure client-side; no API secrets here. Mirrors TheVanityApp.m ensembles.
 */

export const TARGET_MEAN = 100;
export const TARGET_SD = 15;
export const IQ_PREF_MU = 56.4;
export const IQ_PREF_SD = 10.3;
export const IQ_ALT_MU = 40.9;
export const IQ_ALT_SD = 17.1;
export const ATTR_MEAN = 6;
export const ATTR_SD = 1.25;

export const ENSEMBLE_WEIGHTS = {
  wAM: 0.25,
  wTM: 0.3,
  wWM: 0.15,
  wHR: 0.3,
  fairnessPenalty: 0.2,
} as const;

export type FaceEmotionScores = {
  anger: number | null;
  disgust: number | null;
  fear: number | null;
  happiness: number | null;
  neutral: number | null;
  sadness: number | null;
  surprise: number | null;
};

export type FaceDetectScores = {
  maleScore: number | null;
  femaleScore: number | null;
  age: number | null;
  gender: string;
  emotion: FaceEmotionScores | null;
  faceCount: number;
};

export type ImageVanityRow = FaceDetectScores & {
  index: number;
  name: string;
  skipped: boolean;
  skipReason: string;
  iqPrefMale: number | null;
  iqPrefFemale: number | null;
  iqAltMale: number | null;
  iqAltFemale: number | null;
  theIq: number | null;
  altCenter: number | null;
  pctIq: number | null;
  attr: number | null;
  pctAttr: number | null;
  meta: string;
  encoding: string;
};

export type EnsembleTelemetry = {
  AM_pref: number;
  TM_pref: number;
  WM_pref: number;
  HR_pref: number;
  imbalance_pref: number;
  AM_alt: number;
  TM_alt: number;
  WM_alt: number;
  HR_alt: number;
  imbalance_alt: number;
  r_low: number;
  r_high: number;
  r_bar: number;
  covPref: number;
  covAlt: number;
  penPref: number;
  penAlt: number;
  cacComponentLabels: string[];
  cacWeights: number[];
  cacBaseScores: number[];
  pe_sampling_pct: number;
  pe_id_pct: number;
};

export type BatchVanityResult = {
  rows: ImageVanityRow[];
  nSelected: number;
  nValid: number;
  nSkipped: number;
  compositePref: number | null;
  pctPref: number | null;
  compositeAlt: number | null;
  pctAlt: number | null;
  attrPref: number | null;
  attrPrefPct: number | null;
  cacIq: number | null;
  cacPct: number | null;
  cacAttr: number | null;
  cacAttrPct: number | null;
  peTotalPct: number | null;
  peAttrPct: number | null;
  telemetry: EnsembleTelemetry | null;
  reportText: string;
};

export function toIq(
  score: number | null,
  mu: number,
  sigma: number,
  tgtMu = TARGET_MEAN,
  tgtSd = TARGET_SD,
): number | null {
  if (score === null || !Number.isFinite(score)) return null;
  return tgtMu + tgtSd * ((score - mu) / sigma);
}

export function normCdf0(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

export function trimmedMean(values: number[], alpha: number): number | null {
  const x = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!x.length) return null;
  const k = Math.floor(alpha * x.length);
  const sliced = x.slice(k, x.length - k);
  if (!sliced.length) return mean(x);
  return mean(sliced);
}

export function winsorMean(values: number[], alpha: number): number | null {
  const x = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!x.length) return null;
  const k = Math.floor(alpha * x.length);
  const y = x.slice();
  if (k > 0) {
    for (let i = 0; i < k; i += 1) y[i] = y[k]!;
    for (let i = y.length - k; i < y.length; i += 1) y[i] = y[y.length - k - 1]!;
  }
  return mean(y);
}

export function huberMean(values: number[]): number | null {
  const x = values.filter(Number.isFinite);
  if (!x.length) return null;
  const sorted = x.slice().sort((a, b) => a - b);
  const m = sorted[Math.floor(sorted.length / 2)]!;
  const mad =
    sorted.map((v) => Math.abs(v - m)).sort((a, b) => a - b)[Math.floor(sorted.length / 2)]! +
    Number.EPSILON;
  const delta = 1.5 * mad;
  let num = 0;
  let den = 0;
  for (const xi of x) {
    const r = xi - m;
    const w = Math.min(1, delta / Math.max(Math.abs(r), Number.EPSILON));
    num += w * r;
    den += w;
  }
  return m + num / (den + Number.EPSILON);
}

function mean(x: number[]): number {
  return x.reduce((s, v) => s + v, 0) / x.length;
}

function std(x: number[]): number {
  if (x.length < 2) return 0;
  const m = mean(x);
  return Math.sqrt(x.reduce((s, v) => s + (v - m) ** 2, 0) / (x.length - 1));
}

export function dominantEmotion(e: FaceEmotionScores | null): string {
  if (!e) return "-";
  const entries: Array<[string, number]> = (
    [
      ["anger", e.anger],
      ["disgust", e.disgust],
      ["fear", e.fear],
      ["happiness", e.happiness],
      ["neutral", e.neutral],
      ["sadness", e.sadness],
      ["surprise", e.surprise],
    ] as Array<[string, number | null]>
  )
    .filter((pair): pair is [string, number] => pair[1] !== null && Number.isFinite(pair[1]))
    .map(([k, v]) => [k, v]);
  if (!entries.length) return "-";
  entries.sort((a, b) => b[1] - a[1]);
  const [name, val] = entries[0]!;
  return `${name} ${val.toFixed(1)}`;
}

export function enrichRow(
  base: Omit<
    ImageVanityRow,
    | "iqPrefMale"
    | "iqPrefFemale"
    | "iqAltMale"
    | "iqAltFemale"
    | "theIq"
    | "altCenter"
    | "pctIq"
    | "attr"
    | "pctAttr"
  >,
): ImageVanityRow {
  const iqPrefMale = toIq(base.maleScore, IQ_PREF_MU, IQ_PREF_SD);
  const iqPrefFemale = toIq(base.femaleScore, IQ_PREF_MU, IQ_PREF_SD);
  const iqAltMale = toIq(base.maleScore, IQ_ALT_MU, IQ_ALT_SD);
  const iqAltFemale = toIq(base.femaleScore, IQ_ALT_MU, IQ_ALT_SD);
  const prefVals = [iqPrefMale, iqPrefFemale].filter((v): v is number => v !== null);
  const altVals = [iqAltMale, iqAltFemale].filter((v): v is number => v !== null);
  const theIq = prefVals.length ? mean(prefVals) : null;
  const altCenter = altVals.length ? mean(altVals) : null;
  const pctIq =
    theIq === null ? null : 100 * normCdf0((theIq - TARGET_MEAN) / TARGET_SD);
  const attr =
    theIq === null ? null : ATTR_MEAN + ATTR_SD * ((theIq - TARGET_MEAN) / TARGET_SD);
  const pctAttr = attr === null ? null : 100 * normCdf0((attr - ATTR_MEAN) / ATTR_SD);
  return {
    ...base,
    emotion: base.emotion ?? null,
    faceCount: base.faceCount ?? 0,
    encoding: base.encoding ?? "",
    iqPrefMale,
    iqPrefFemale,
    iqAltMale,
    iqAltFemale,
    theIq,
    altCenter,
    pctIq,
    attr,
    pctAttr,
  };
}

function emptyBatch(rows: ImageVanityRow[]): BatchVanityResult {
  const nSelected = rows.length;
  const result: BatchVanityResult = {
    rows,
    nSelected,
    nValid: 0,
    nSkipped: nSelected,
    compositePref: null,
    pctPref: null,
    compositeAlt: null,
    pctAlt: null,
    attrPref: null,
    attrPrefPct: null,
    cacIq: null,
    cacPct: null,
    cacAttr: null,
    cacAttrPct: null,
    peTotalPct: null,
    peAttrPct: null,
    telemetry: null,
    reportText: "",
  };
  result.reportText = buildReport(result);
  return result;
}

export function aggregateBatch(rows: ImageVanityRow[]): BatchVanityResult {
  const nSelected = rows.length;
  const valid = rows.filter((r) => !r.skipped && r.theIq !== null);
  const nValid = valid.length;
  const nSkipped = nSelected - nValid;

  if (nValid === 0) return emptyBatch(rows);

  const centerPref = valid.map((r) => r.theIq!);
  const centerAlt = valid
    .map((r) => r.altCenter)
    .filter((v): v is number => v !== null && Number.isFinite(v));

  const { wAM, wTM, wWM, wHR, fairnessPenalty } = ENSEMBLE_WEIGHTS;
  const AM_pref = mean(centerPref);
  const TM_pref = trimmedMean(centerPref, 0.2) ?? AM_pref;
  const WM_pref = winsorMean(centerPref, 0.2) ?? AM_pref;
  const HR_pref = huberMean(centerPref) ?? AM_pref;
  const imbalance_pref = mean(
    valid.map((r) => {
      if (r.iqPrefMale === null || r.iqPrefFemale === null) return 0;
      return Math.abs(r.iqPrefMale - r.iqPrefFemale);
    }),
  );
  const compositePref =
    wAM * AM_pref + wTM * TM_pref + wWM * WM_pref + wHR * HR_pref - fairnessPenalty * imbalance_pref;

  const AM_alt = centerAlt.length ? mean(centerAlt) : AM_pref;
  const TM_alt = trimmedMean(centerAlt, 0.2) ?? AM_alt;
  const WM_alt = winsorMean(centerAlt, 0.2) ?? AM_alt;
  const HR_alt = huberMean(centerAlt) ?? AM_alt;
  const imbalance_alt = mean(
    valid.map((r) => {
      if (r.iqAltMale === null || r.iqAltFemale === null) return 0;
      return Math.abs(r.iqAltMale - r.iqAltFemale);
    }),
  );
  const compositeAlt =
    wAM * AM_alt + wTM * TM_alt + wWM * WM_alt + wHR * HR_alt - fairnessPenalty * imbalance_alt;

  const pctPref = 100 * normCdf0((compositePref - TARGET_MEAN) / TARGET_SD);
  const pctAlt = 100 * normCdf0((compositeAlt - TARGET_MEAN) / TARGET_SD);
  const attrPref = ATTR_MEAN + ATTR_SD * ((compositePref - TARGET_MEAN) / TARGET_SD);
  const attrPrefPct = 100 * normCdf0((attrPref - ATTR_MEAN) / ATTR_SD);

  const r_low = 0.78;
  const r_high = 0.88;
  const z1 = Math.atanh(r_low);
  const z2 = Math.atanh(r_high);
  const r_bar = Math.tanh((z1 + z2) / 2);
  const covPref = std(centerPref) / Math.max(mean(centerPref), Number.EPSILON);
  const covAlt =
    centerAlt.length > 1
      ? std(centerAlt) / Math.max(mean(centerAlt), Number.EPSILON)
      : covPref;
  const penPref = 1 / (1 + Math.max(covPref, 0));
  const penAlt = 1 / (1 + Math.max(covAlt, 0));

  const cacComponentLabels = [
    "CompositePref",
    "CompositeAlt",
    "AM_pref",
    "TM_pref",
    "HR_pref",
    "WM_pref",
  ];
  const cacBaseScores = [compositePref, compositeAlt, AM_pref, TM_pref, HR_pref, WM_pref];
  const baseRel = [r_high ** 2, r_low ** 2, r_bar ** 2, r_bar ** 2, r_bar ** 2, r_bar ** 2];
  const basePen = [penPref, penAlt, penPref, penPref, penPref, penPref];
  const wRaw = baseRel.map((rel, i) => rel * basePen[i]!);
  const wSum = wRaw.reduce((s, v) => s + v, 0) + Number.EPSILON;
  const cacWeights = wRaw.map((w) => w / wSum);
  const cacIq = cacBaseScores.reduce((s, v, i) => s + cacWeights[i]! * v, 0);
  const cacPct = 100 * normCdf0((cacIq - TARGET_MEAN) / TARGET_SD);
  const cacAttr = ATTR_MEAN + ATTR_SD * ((cacIq - TARGET_MEAN) / TARGET_SD);
  const cacAttrPct = 100 * normCdf0((cacAttr - ATTR_MEAN) / ATTR_SD);

  const sdPref = std(centerPref);
  const sePref = sdPref / Math.max(Math.sqrt(nValid), 1);
  const pe_sampling_pct = (sePref / Math.max(cacIq, Number.EPSILON)) * 100;
  const pe_id_pct = 0.08;
  const peTotalPct = Math.sqrt(pe_sampling_pct ** 2 + pe_id_pct ** 2);
  const attr_gain = ATTR_SD / TARGET_SD;
  const peAttrPct = Math.sqrt((pe_sampling_pct * attr_gain) ** 2 + pe_id_pct ** 2);

  const telemetry: EnsembleTelemetry = {
    AM_pref,
    TM_pref,
    WM_pref,
    HR_pref,
    imbalance_pref,
    AM_alt,
    TM_alt,
    WM_alt,
    HR_alt,
    imbalance_alt,
    r_low,
    r_high,
    r_bar,
    covPref,
    covAlt,
    penPref,
    penAlt,
    cacComponentLabels,
    cacWeights,
    cacBaseScores,
    pe_sampling_pct,
    pe_id_pct,
  };

  const result: BatchVanityResult = {
    rows,
    nSelected,
    nValid,
    nSkipped,
    compositePref,
    pctPref,
    compositeAlt,
    pctAlt,
    attrPref,
    attrPrefPct,
    cacIq,
    cacPct,
    cacAttr,
    cacAttrPct,
    peTotalPct,
    peAttrPct,
    telemetry,
    reportText: "",
  };
  result.reportText = buildReport(result);
  return result;
}

function fmt(n: number | null | undefined, digits = 2): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

function buildReport(r: BatchVanityResult): string {
  const lines: string[] = [];
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  lines.push(
    `Face++ Batch Report (selected=${r.nSelected}, valid=${r.nValid}, skipped=${r.nSkipped})`,
  );
  lines.push(`Generated: ${now}`);
  lines.push("");

  if (r.nValid === 0) {
    lines.push("No valid images were processed. Skipped:");
    for (const row of r.rows) {
      lines.push(`  #${row.index + 1}  ${row.name}  [Reason: ${row.skipReason || "unknown"}]`);
    }
    lines.push("");
    lines.push("Constraints: JPG/PNG; 48–4096 px; ≤2MB (Detect API).");
    lines.push("  https://console.faceplusplus.com/documents/5679127");
    return lines.join("\n");
  }

  const t = r.telemetry!;
  lines.push("=== OVERALL (valid only) ===");
  lines.push(
    `Preferred Ensemble THE IQ: ${fmt(r.compositePref)} | Percentile (IQ): ${fmt(r.pctPref, 1)}%`,
  );
  lines.push(
    `Alternate Ensemble IQ-like: ${fmt(r.compositeAlt)} | Percentile (IQ): ${fmt(r.pctAlt, 1)}%`,
  );
  lines.push(
    `Preferred on ATTR scale (mean=6, SD=1.25): ${fmt(r.attrPref)} | Percentile: ${fmt(r.attrPrefPct, 1)}%`,
  );
  lines.push(
    `Correlation-Adjusted Composite (CAC) IQ-like: ${fmt(r.cacIq)} | Percentile (IQ): ${fmt(r.cacPct, 1)}%`,
  );
  lines.push(`CAC on ATTR scale: ${fmt(r.cacAttr)} | Percentile: ${fmt(r.cacAttrPct, 1)}%`);
  lines.push(
    `Possible overall error (IQ %): ±${fmt(r.peTotalPct)}% (sampling + 0.08% FRVT floor)`,
  );
  lines.push(`Possible overall error (ATTR %): ±${fmt(r.peAttrPct)}%`);
  lines.push("");

  lines.push("=== ENSEMBLE TELEMETRY ===");
  lines.push(
    `Pref AM/TM/WM/HR: ${fmt(t.AM_pref)} / ${fmt(t.TM_pref)} / ${fmt(t.WM_pref)} / ${fmt(t.HR_pref)} | imbalance=${fmt(t.imbalance_pref)}`,
  );
  lines.push(
    `Alt  AM/TM/WM/HR: ${fmt(t.AM_alt)} / ${fmt(t.TM_alt)} / ${fmt(t.WM_alt)} / ${fmt(t.HR_alt)} | imbalance=${fmt(t.imbalance_alt)}`,
  );
  lines.push(
    `Weights: AM=${ENSEMBLE_WEIGHTS.wAM} TM=${ENSEMBLE_WEIGHTS.wTM} WM=${ENSEMBLE_WEIGHTS.wWM} HR=${ENSEMBLE_WEIGHTS.wHR} fairnessPen=${ENSEMBLE_WEIGHTS.fairnessPenalty}`,
  );
  lines.push(
    `CAC anchors: r_low=${t.r_low} r_high=${t.r_high} r̄=${fmt(t.r_bar, 4)} | CV pref=${fmt(t.covPref, 4)} alt=${fmt(t.covAlt, 4)} | pen pref=${fmt(t.penPref, 4)} alt=${fmt(t.penAlt, 4)}`,
  );
  lines.push(
    `CAC weights: ${t.cacComponentLabels.map((lab, i) => `${lab}=${fmt(t.cacWeights[i], 4)}`).join(" · ")}`,
  );
  lines.push(
    `Error decomposition: sampling=${fmt(t.pe_sampling_pct)}% · FRVT ID floor=${fmt(t.pe_id_pct)}%`,
  );
  lines.push("");

  lines.push("=== PER-IMAGE SUMMARY (Preferred center) ===");
  lines.push(
    "Idx | Status  | Beauty(M/F) | PrefIQ(M/F) | THE IQ | THE IQ % | ATTR | ATTR % | Gender | Age~",
  );
  for (const row of r.rows) {
    if (!row.skipped && row.theIq !== null) {
      lines.push(
        `${String(row.index + 1).padStart(3)} | VALID   | ${fmt(row.maleScore)}/${fmt(row.femaleScore)} | ${fmt(row.iqPrefMale)}/${fmt(row.iqPrefFemale)} | ${fmt(row.theIq)} | ${fmt(row.pctIq, 1)}% | ${fmt(row.attr)} | ${fmt(row.pctAttr, 1)}% | ${(row.gender || "-").padEnd(6)} | ${row.age === null ? "?" : String(Math.round(row.age))}`,
      );
      const extras: string[] = [];
      if (row.iqAltMale !== null || row.iqAltFemale !== null) {
        extras.push(`AltIQ(M/F)=${fmt(row.iqAltMale)}/${fmt(row.iqAltFemale)}`);
      }
      const emo = dominantEmotion(row.emotion);
      if (emo !== "-") extras.push(`emotion=${emo}`);
      if (row.faceCount > 0) extras.push(`faces=${row.faceCount}`);
      if (row.encoding) extras.push(`enc=${row.encoding}`);
      if (row.meta) extras.push(row.meta.trim());
      if (extras.length) lines.push(`      ${extras.join(" · ")}`);
    } else {
      lines.push(
        `${String(row.index + 1).padStart(3)} | SKIPPED |            - |            - |      - |       - |    - |       - | ${(row.gender || "-").padEnd(6)} | ${row.age === null ? "?" : String(Math.round(row.age))}`,
      );
      lines.push(`      [Reason: ${row.skipReason || "unknown"}]`);
    }
  }
  lines.push("");
  lines.push("=== METHOD (brief) ===");
  lines.push(
    "• Face++ Detect returns Beauty (male_score, female_score); invalid images are auto-repaired or skipped.",
  );
  lines.push(
    "• Constraints: JPG/PNG; 48–4096 px; ≤2MB. Free keys analyze top-5 faces. See doc:",
  );
  lines.push("  https://console.faceplusplus.com/documents/5679127");
  lines.push(
    "• Preferred IQ-like: μ=56.4, σ=10.3; Alternate: μ=40.9, σ=17.1; both mapped to IQ mean=100, SD=15.",
  );
  lines.push(
    "• THE IQ (per image) = mean of available preferred male/female IQ-like (robust to a missing perspective).",
  );
  lines.push(
    "• Preferred ensemble = fusion of arithmetic/trimmed/winsorized/Huber means minus fairness penalty (M↔F).",
  );
  lines.push(
    "• Standard Attractiveness = 6 + 1.25*((THE IQ - 100)/15); percentiles via standard normal CDF.",
  );
  lines.push(
    "• CAC: uses literature anchors (r≈0.78 & r≈0.88), Fisher z-averaged → r̄, converts to reliabilities (r²),",
  );
  lines.push(
    "  applies dispersion penalties (CV) and forms a reliability-weighted meta-ensemble, then maps to IQ/ATTR.",
  );
  lines.push(
    "• Possible overall error combines batch sampling uncertainty with 0.08% FRVT face-identification floor (ID task, not Beauty).",
  );
  lines.push(
    "• Transport: URL-encoded base64 first, multipart file fallback; US↔CN endpoint fallback (MATLAB TheVanityApp parity).",
  );
  lines.push("");
  lines.push("=== SOURCES ===");
  lines.push("Face++ Detect & Beauty:");
  lines.push("  • https://console.faceplusplus.com/documents/5679127");
  lines.push("  • https://www.faceplusplus.com/beauty/");
  lines.push("Common Return Values / errors:");
  lines.push("  • https://console.faceplusplus.com/documents/7078059");
  lines.push("Attractiveness prediction correlations (group-level):");
  lines.push(
    "  • Hindawi 2021 (r≈0.7836): https://www.hindawi.com/journals/cin/2021/5594303/",
  );
  lines.push("  • SCUT-FBP (CNN up to ~0.82): https://arxiv.org/pdf/1511.02459");
  lines.push(
    "  • SCUT-FBP5500 (r≈0.78): https://jov.arvojournals.org/article.aspx?articleid=2809824",
  );
  lines.push("0.08% error (face IDENTIFICATION, NIST FRVT) used in error floor:");
  lines.push("  • https://lab.imedd.org/en/how-accurate-facial-recognition-systems/");
  return lines.join("\n");
}

/** Browser-side resize/compress to Face++ limits. */
export async function repairImageForFacepp(file: File): Promise<{
  ok: boolean;
  reason: string;
  blob: Blob | null;
  name: string;
}> {
  try {
    const bitmap = await createImageBitmap(file);
    const { width: W, height: H } = bitmap;
    if (W < 48 && H < 48) {
      bitmap.close();
      return { ok: false, reason: "Image smaller than 48×48", blob: null, name: file.name };
    }
    const scaleDown = Math.max(W / 4096, H / 4096, 1);
    const scaleUp = Math.min(Math.max(48 / W, 48 / H), 1);
    const scale = Math.max(scaleDown, scaleUp);
    const tw = Math.max(48, Math.min(4096, Math.round(W / scale)));
    const th = Math.max(48, Math.min(4096, Math.round(H / scale)));
    const canvas = document.createElement("canvas");
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return { ok: false, reason: "Canvas unavailable", blob: null, name: file.name };
    }
    ctx.drawImage(bitmap, 0, 0, tw, th);
    bitmap.close();

    let quality = 0.88;
    let blob = await canvasToJpeg(canvas, quality);
    if (blob.size > 2 * 1024 * 1024) {
      quality = 0.8;
      blob = await canvasToJpeg(canvas, quality);
    }
    if (blob.size > 2 * 1024 * 1024) {
      const canvas2 = document.createElement("canvas");
      canvas2.width = Math.max(48, Math.round(tw * 0.75));
      canvas2.height = Math.max(48, Math.round(th * 0.75));
      const ctx2 = canvas2.getContext("2d");
      if (ctx2) {
        ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
        blob = await canvasToJpeg(canvas2, 0.75);
      }
    }
    if (blob.size > 2 * 1024 * 1024) {
      return { ok: false, reason: "Cannot reduce below 2MB", blob: null, name: file.name };
    }
    return {
      ok: true,
      reason: scale !== 1 || !/\.jpe?g$/i.test(file.name) ? "Repaired to acceptable JPEG" : "OK",
      blob,
      name: file.name.replace(/\.\w+$/, "") + ".jpg",
    };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? `Repair error: ${err.message}` : "Repair error",
      blob: null,
      name: file.name,
    };
  }
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("JPEG encode failed"))),
      "image/jpeg",
      quality,
    );
  });
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Histogram bins of THE IQ for technical charting. */
export function iqHistogram(
  rows: ImageVanityRow[],
  bins = 12,
): { centers: number[]; counts: number[] } {
  const vals = rows
    .filter((r) => !r.skipped && r.theIq !== null)
    .map((r) => r.theIq!);
  if (!vals.length) return { centers: [], counts: [] };
  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  if (lo === hi) {
    lo -= 5;
    hi += 5;
  }
  const width = (hi - lo) / bins;
  const counts = new Array<number>(bins).fill(0);
  const centers = new Array<number>(bins);
  for (let i = 0; i < bins; i += 1) centers[i] = lo + (i + 0.5) * width;
  for (const v of vals) {
    let idx = Math.floor((v - lo) / width);
    if (idx >= bins) idx = bins - 1;
    if (idx < 0) idx = 0;
    counts[idx]! += 1;
  }
  return { centers, counts };
}
