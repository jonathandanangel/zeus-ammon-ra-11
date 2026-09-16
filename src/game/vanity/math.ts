/**
 * TheVanityApp aggregation math — Face++ Beauty → IQ-like / ATTR / CAC.
 * Pure client-side; no API secrets here.
 */

export const TARGET_MEAN = 100;
export const TARGET_SD = 15;
export const IQ_PREF_MU = 56.4;
export const IQ_PREF_SD = 10.3;
export const IQ_ALT_MU = 40.9;
export const IQ_ALT_SD = 17.1;
export const ATTR_MEAN = 6;
export const ATTR_SD = 1.25;

export type FaceDetectScores = {
  maleScore: number | null;
  femaleScore: number | null;
  age: number | null;
  gender: string;
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
  pctIq: number | null;
  attr: number | null;
  pctAttr: number | null;
  meta: string;
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
  // Abramowitz–Stegun approximation
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

export function enrichRow(
  base: Omit<
    ImageVanityRow,
    | "iqPrefMale"
    | "iqPrefFemale"
    | "iqAltMale"
    | "iqAltFemale"
    | "theIq"
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
  const theIq = prefVals.length ? mean(prefVals) : null;
  const pctIq =
    theIq === null ? null : 100 * normCdf0((theIq - TARGET_MEAN) / TARGET_SD);
  const attr =
    theIq === null ? null : ATTR_MEAN + ATTR_SD * ((theIq - TARGET_MEAN) / TARGET_SD);
  const pctAttr = attr === null ? null : 100 * normCdf0((attr - ATTR_MEAN) / ATTR_SD);
  return {
    ...base,
    iqPrefMale,
    iqPrefFemale,
    iqAltMale,
    iqAltFemale,
    theIq,
    pctIq,
    attr,
    pctAttr,
  };
}

export function aggregateBatch(rows: ImageVanityRow[]): BatchVanityResult {
  const nSelected = rows.length;
  const valid = rows.filter((r) => !r.skipped && r.theIq !== null);
  const nValid = valid.length;
  const nSkipped = nSelected - nValid;

  if (nValid === 0) {
    const reportText = buildReport({
      rows,
      nSelected,
      nValid,
      nSkipped,
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
      reportText: "",
    });
    return {
      rows,
      nSelected,
      nValid,
      nSkipped,
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
      reportText,
    };
  }

  const centerPref = valid.map((r) => r.theIq!);
  const centerAlt = valid.map((r) => {
    const vals = [r.iqAltMale, r.iqAltFemale].filter((v): v is number => v !== null);
    return vals.length ? mean(vals) : Number.NaN;
  }).filter(Number.isFinite);

  const AM_pref = mean(centerPref);
  const TM_pref = trimmedMean(centerPref, 0.2) ?? AM_pref;
  const WM_pref = winsorMean(centerPref, 0.2) ?? AM_pref;
  const HR_pref = huberMean(centerPref) ?? AM_pref;
  const imbalance_pref = mean(
    valid.map((r) => Math.abs((r.iqPrefMale ?? 0) - (r.iqPrefFemale ?? 0))),
  );
  const compositePref =
    0.25 * AM_pref + 0.3 * TM_pref + 0.15 * WM_pref + 0.3 * HR_pref - 0.2 * imbalance_pref;

  const AM_alt = centerAlt.length ? mean(centerAlt) : AM_pref;
  const TM_alt = trimmedMean(centerAlt, 0.2) ?? AM_alt;
  const WM_alt = winsorMean(centerAlt, 0.2) ?? AM_alt;
  const HR_alt = huberMean(centerAlt) ?? AM_alt;
  const imbalance_alt = mean(
    valid.map((r) => Math.abs((r.iqAltMale ?? 0) - (r.iqAltFemale ?? 0))),
  );
  const compositeAlt =
    0.25 * AM_alt + 0.3 * TM_alt + 0.15 * WM_alt + 0.3 * HR_alt - 0.2 * imbalance_alt;

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

  const baseScores = [compositePref, compositeAlt, AM_pref, TM_pref, HR_pref, WM_pref];
  const baseRel = [r_high ** 2, r_low ** 2, r_bar ** 2, r_bar ** 2, r_bar ** 2, r_bar ** 2];
  const basePen = [penPref, penAlt, penPref, penPref, penPref, penPref];
  const wRaw = baseRel.map((r, i) => r * basePen[i]!);
  const wSum = wRaw.reduce((s, v) => s + v, 0) + Number.EPSILON;
  const wCAC = wRaw.map((w) => w / wSum);
  const cacIq = baseScores.reduce((s, v, i) => s + wCAC[i]! * v, 0);
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
    reportText: "",
  };
  result.reportText = buildReport(result);
  return result;
}

function fmt(n: number | null, digits = 2): string {
  if (n === null || !Number.isFinite(n)) return "-";
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
  lines.push(
    `CAC on ATTR scale: ${fmt(r.cacAttr)} | Percentile: ${fmt(r.cacAttrPct, 1)}%`,
  );
  lines.push(
    `Possible overall error (IQ %): ±${fmt(r.peTotalPct)}% (sampling + 0.08% FRVT floor)`,
  );
  lines.push(`Possible overall error (ATTR %): ±${fmt(r.peAttrPct)}%`);
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
    } else {
      lines.push(
        `${String(row.index + 1).padStart(3)} | SKIPPED |            - |            - |      - |       - |    - |       - | ${(row.gender || "-").padEnd(6)} | ${row.age === null ? "?" : String(Math.round(row.age))}  [Reason: ${row.skipReason}]`,
      );
    }
  }
  lines.push("");
  lines.push("=== METHOD (brief) ===");
  lines.push(
    "• Face++ Detect returns Beauty (male_score, female_score); invalid images are repaired or skipped.",
  );
  lines.push("• Constraints: JPG/PNG; 48–4096 px; ≤2MB.");
  lines.push(
    "• Preferred IQ-like: μ=56.4, σ=10.3; Alternate: μ=40.9, σ=17.1; mapped to IQ mean=100, SD=15.",
  );
  lines.push(
    "• THE IQ = mean of available preferred male/female IQ-like scores.",
  );
  lines.push(
    "• Preferred ensemble = arithmetic/trimmed/winsorized/Huber minus fairness penalty.",
  );
  lines.push(
    "• ATTR = 6 + 1.25*((THE IQ − 100)/15); CAC uses r≈0.78 & r≈0.88 anchors.",
  );
  lines.push("");
  lines.push("=== SOURCES ===");
  lines.push("Face++ Detect & Beauty: https://console.faceplusplus.com/documents/5679127");
  lines.push("Beauty product: https://www.faceplusplus.com/beauty/");
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
    let { width: W, height: H } = bitmap;
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
