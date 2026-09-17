/**
 * Babelia-style image location for NUMEROLOGY.
 *
 * babelia.libraryofbabel.info is Basile’s image archive (same “already exists /
 * locate by seed” idea as libraryofbabel.info). No public API — we generate
 * deterministic plates in-canvas from word + path + Thought-Forms colour so
 * the same search always yields the same image address.
 */

import { OFFICIAL_BABEL } from "./babel-pathfinder";

export type BabelImageStyle = "hexagon" | "babelia" | "folio" | "shelf" | "grimoire";

export type BabelLocatedImage = {
  id: string;
  style: BabelImageStyle;
  title: string;
  /** Short address analogous to hexagon · wall · shelf · volume · page */
  address: string;
  seedDigest: string;
  width: number;
  height: number;
  /** data:image/png;base64… — set when rendered in browser */
  dataUrl: string;
  colorHex: string;
  officialBabelia: string;
  note: string;
  /** 0–100 · most likely matches for this word/path rank higher (UI: top → bottom). */
  likelihood: number;
  likelihoodWhy: string;
};

/** Pixel grimoire cover shipped for the Babel entry ritual. */
export const RETRO_GRIMOIRE_SRC = "/numerology/babel/retro-grimoire.png";

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h.padEnd(6, "0").slice(0, 6);
  return {
    r: parseInt(full.slice(0, 2), 16) || 0,
    g: parseInt(full.slice(2, 4), 16) || 0,
    b: parseInt(full.slice(4, 6), 16) || 0,
  };
}

function addressFromSeed(seed: number, pathNumber: number): string {
  const wall = (seed % 4) + 1;
  const shelf = (Math.floor(seed / 4) % 5) + 1;
  const volume = (Math.floor(seed / 20) % 32) + 1;
  const page = (Math.floor(seed / 640) % 410) + 1;
  const hex = (seed >>> 0).toString(36).padStart(8, "0");
  return `img-${hex}${pathNumber} · w${wall} · s${shelf} · v${volume} · p${page}`;
}

function drawHexagon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  stroke: string,
  fill?: string,
) {
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function renderHexagonGallery(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
  rgb: { r: number; g: number; b: number },
  label: string,
) {
  ctx.fillStyle = "#05080f";
  ctx.fillRect(0, 0, w, h);
  const R = 28;
  const dx = R * 1.75;
  const dy = R * 1.55;
  let row = 0;
  for (let y = R; y < h + R; y += dy) {
    const offset = row % 2 === 0 ? 0 : dx / 2;
    for (let x = R + offset; x < w + R; x += dx) {
      const a = 0.12 + rand() * 0.45;
      const fill = `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;
      const stroke = `rgba(${Math.min(255, rgb.r + 40)},${Math.min(255, rgb.g + 40)},${Math.min(255, rgb.b + 40)},0.55)`;
      drawHexagon(ctx, x, y, R * (0.75 + rand() * 0.35), stroke, fill);
      // tiny “book spines”
      if (rand() > 0.55) {
        ctx.fillStyle = `rgba(255,255,255,${0.08 + rand() * 0.2})`;
        for (let k = 0; k < 3; k += 1) {
          ctx.fillRect(x - 10 + k * 7, y - 6, 3, 12 + rand() * 8);
        }
      }
    }
    row += 1;
  }
  // lamps
  for (let i = 0; i < 6; i += 1) {
    const lx = rand() * w;
    const ly = rand() * h;
    const g = ctx.createRadialGradient(lx, ly, 2, lx, ly, 40);
    g.addColorStop(0, "rgba(255,220,140,0.35)");
    g.addColorStop(1, "rgba(255,220,140,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(lx, ly, 40, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0, h - 36, w, 36);
  ctx.fillStyle = "#fbbf24";
  ctx.font = "11px monospace";
  ctx.fillText(label.slice(0, 72), 10, h - 14);
}

function renderBabeliaNoise(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
  rgb: { r: number; g: number; b: number },
  phrase: string,
) {
  const img = ctx.createImageData(w, h);
  const data = img.data;
  // Base noise field
  for (let i = 0; i < w * h; i += 1) {
    const n = rand();
    const v = Math.floor(n * 255);
    const o = i * 4;
    data[o] = Math.floor(v * 0.35 + rgb.r * n * 0.65);
    data[o + 1] = Math.floor(v * 0.35 + rgb.g * n * 0.65);
    data[o + 2] = Math.floor(v * 0.35 + rgb.b * n * 0.65);
    data[o + 3] = 255;
  }
  // Embed phrase as a low-contrast barcode strip (locatable “secret”)
  const bits = [...phrase.toLowerCase()].map((c) => c.charCodeAt(0) % 2);
  const y0 = Math.floor(h * 0.42);
  for (let x = 0; x < w; x += 1) {
    const bit = bits[x % Math.max(1, bits.length)] ?? 0;
    for (let dy = 0; dy < 8; dy += 1) {
      const o = ((y0 + dy) * w + x) * 4;
      const tone = bit ? 220 : 30;
      data[o] = Math.floor((data[o]! + tone) / 2);
      data[o + 1] = Math.floor((data[o + 1]! + tone) / 2);
      data[o + 2] = Math.floor((data[o + 2]! + tone) / 2);
    }
  }
  ctx.putImageData(img, 0, 0);
  // Hex overlay frame
  ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.55)`;
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, w - 16, h - 16);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(8, h - 40, w - 16, 32);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "10px monospace";
  ctx.fillText(`babelia · ${phrase.slice(0, 48)}`, 16, h - 18);
}

function renderFolioCover(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
  rgb: { r: number; g: number; b: number },
  title: string,
  subtitle: string,
) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, `rgb(${Math.floor(rgb.r * 0.25)},${Math.floor(rgb.g * 0.2)},${Math.floor(rgb.b * 0.35)})`);
  g.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // leather grain
  for (let i = 0; i < 1200; i += 1) {
    ctx.fillStyle = `rgba(255,255,255,${rand() * 0.04})`;
    ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 2, 1);
  }

  ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.7)`;
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, w - 36, h - 36);
  ctx.lineWidth = 1;
  ctx.strokeRect(28, 28, w - 56, h - 56);

  // ornamental hex
  drawHexagon(ctx, w / 2, h * 0.38, 48, `rgba(${rgb.r},${rgb.g},${rgb.b},0.85)`, `rgba(${rgb.r},${rgb.g},${rgb.b},0.15)`);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 16px Georgia, serif";
  ctx.textAlign = "center";
  const lines = wrapText(ctx, title, w - 70);
  let ty = h * 0.58;
  for (const line of lines.slice(0, 3)) {
    ctx.fillText(line, w / 2, ty);
    ty += 22;
  }
  ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  ctx.font = "11px monospace";
  ctx.fillText(subtitle.slice(0, 56), w / 2, h * 0.86);
  ctx.textAlign = "left";
}

function renderShelfSpine(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
  rgb: { r: number; g: number; b: number },
  titles: string[],
) {
  ctx.fillStyle = "#1a120a";
  ctx.fillRect(0, 0, w, h);
  // wood
  for (let y = 0; y < h; y += 18) {
    ctx.fillStyle = `rgba(80,50,20,${0.3 + rand() * 0.3})`;
    ctx.fillRect(0, y, w, 3);
  }
  const n = Math.min(14, Math.max(5, titles.length || 8));
  let x = 8;
  for (let i = 0; i < n; i += 1) {
    const bw = 14 + Math.floor(rand() * 22);
    const bh = h * (0.45 + rand() * 0.45);
    const by = h - bh - 8;
    const shade = 0.4 + rand() * 0.5;
    ctx.fillStyle = `rgba(${Math.floor(rgb.r * shade)},${Math.floor(rgb.g * shade)},${Math.floor(rgb.b * shade)},0.95)`;
    ctx.fillRect(x, by, bw, bh);
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.strokeRect(x, by, bw, bh);
    ctx.save();
    ctx.translate(x + bw / 2, by + bh / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    const t = (titles[i % titles.length] ?? "volume").slice(0, 18);
    ctx.fillText(t, 0, 3);
    ctx.restore();
    x += bw + 3;
    if (x > w - 20) break;
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export type LocateBabelImagesInput = {
  seedWord: string;
  pathNumber: number;
  colorHex: string;
  colorName: string;
  bookTitle: string;
  combination: string[];
  /** Optional extra titles for shelf spines */
  spineTitles?: string[];
  /** Optional Johnson / doctrine / myth hit counts boost likelihood. */
  sourceHits?: {
    johnson?: number;
    doctrine?: number;
    myth?: number;
    philosophy?: number;
  };
};

function likelihoodForStyle(
  style: BabelImageStyle,
  input: LocateBabelImagesInput,
): { score: number; why: string } {
  const hits = input.sourceHits ?? {};
  const wordLen = input.seedWord.replace(/[^a-z]/gi, "").length;
  const comboN = input.combination.length;
  const path = input.pathNumber;

  switch (style) {
    case "grimoire":
      // Always the most likely “true book” for occult/numerology paths
      return {
        score: Math.min(
          99,
          88 + (hits.doctrine ?? 0) * 2 + (hits.philosophy ?? 0) + (path === 5 || path === 7 ? 4 : 0),
        ),
        why: "Retro grimoire · strongest match for path lore & occult sources",
      };
    case "folio":
      return {
        score: Math.min(92, 70 + comboN * 2 + (hits.johnson ?? 0) * 3),
        why: "Located folio cover · title + combination seed",
      };
    case "babelia":
      return {
        score: Math.min(85, 55 + wordLen * 2 + (hits.myth ?? 0) * 3),
        why: "Babelia plate · letter-seed noise (Basile image archive idea)",
      };
    case "hexagon":
      return {
        score: Math.min(78, 48 + path * 2 + (hits.doctrine ?? 0)),
        why: "Hexagonal gallery · Borges library geometry",
      };
    case "shelf":
      return {
        score: Math.min(70, 40 + comboN * 3),
        why: "Shelf spines · combination tokens as volumes",
      };
    default:
      return { score: 30, why: "Lower-likelihood plate" };
  }
}

function renderGrimoirePlate(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  babelLine: string,
  pathLine: string,
  rgb: { r: number; g: number; b: number },
) {
  ctx.fillStyle = "#0a0610";
  ctx.fillRect(0, 0, w, h);
  // pixel-crisp draw of the retro book
  const scale = Math.min((w - 24) / img.width, (h - 72) / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = (w - dw) / 2;
  const dy = 12;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, dx, dy, dw, dh);

  // Babel-font strip (monospace = 29-letter press feel)
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.fillRect(0, h - 64, w, 64);
  ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.85)`;
  ctx.strokeRect(6, h - 58, w - 12, 52);
  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 11px Courier New, Courier, monospace";
  ctx.textAlign = "center";
  ctx.fillText(babelLine.slice(0, 42), w / 2, h - 36);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "10px Courier New, Courier, monospace";
  ctx.fillText(pathLine.slice(0, 48), w / 2, h - 16);
  ctx.textAlign = "left";
}

/**
 * Locate (generate) Babelia-style images ranked by likelihood (high → low).
 * Grimoire composites the retro pixel book + Babel-alphabet caption.
 */
export function locateBabelImages(input: LocateBabelImagesInput): BabelLocatedImage[] {
  if (typeof document === "undefined") return [];

  const baseSeed = hashSeed(
    `${input.pathNumber}|${input.seedWord}|${input.bookTitle}|${input.combination.join(",")}|babelia`,
  );
  const rgb = parseHex(input.colorHex);
  const styles: BabelImageStyle[] = ["grimoire", "folio", "babelia", "hexagon", "shelf"];
  const out: BabelLocatedImage[] = [];

  // Sync path: grimoire uses static URL until async composite is ready (UI may replace).
  for (let i = 0; i < styles.length; i += 1) {
    const style = styles[i]!;
    const seed = (baseSeed + i * 9973) >>> 0;
    const rand = mulberry32(seed);
    const { score, why } = likelihoodForStyle(style, input);

    if (style === "grimoire") {
      out.push({
        id: `grimoire-${seed.toString(16)}`,
        style,
        title: "Retro grimoire · press to open",
        address: addressFromSeed(seed, input.pathNumber),
        seedDigest: seed.toString(16),
        width: 360,
        height: 420,
        dataUrl: RETRO_GRIMOIRE_SRC,
        colorHex: input.colorHex,
        officialBabelia: OFFICIAL_BABEL.babelia,
        note: "Pixel grimoire with Babel-alphabet caption — most likely image for this path.",
        likelihood: score,
        likelihoodWhy: why,
      });
      continue;
    }

    const w = style === "folio" ? 320 : 360;
    const h = style === "folio" ? 440 : style === "shelf" ? 220 : 280;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    const label = `${input.seedWord} · path ${input.pathNumber} · ${input.colorName}`;
    if (style === "hexagon") {
      renderHexagonGallery(ctx, w, h, rand, rgb, label);
    } else if (style === "babelia") {
      renderBabeliaNoise(ctx, w, h, rand, rgb, input.combination.join(" ") || input.seedWord);
    } else if (style === "folio") {
      renderFolioCover(
        ctx,
        w,
        h,
        rand,
        rgb,
        input.bookTitle,
        `Path ${input.pathNumber} · ${input.colorName}`,
      );
    } else {
      renderShelfSpine(
        ctx,
        w,
        h,
        rand,
        rgb,
        input.spineTitles?.length
          ? input.spineTitles
          : [input.seedWord, ...input.combination, input.bookTitle],
      );
    }

    out.push({
      id: `${style}-${seed.toString(16)}`,
      style,
      title:
        style === "hexagon"
          ? "Hexagonal gallery"
          : style === "babelia"
            ? "Babelia plate"
            : style === "folio"
              ? "Located folio cover"
              : "Shelf of combinations",
      address: addressFromSeed(seed, input.pathNumber),
      seedDigest: seed.toString(16),
      width: w,
      height: h,
      dataUrl: canvas.toDataURL("image/png"),
      colorHex: input.colorHex,
      officialBabelia: OFFICIAL_BABEL.babelia,
      note:
        style === "babelia"
          ? "Deterministic plate from your word/combination seed — same idea as babelia.libraryofbabel.info."
          : "Located from path colour + seed.",
      likelihood: score,
      likelihoodWhy: why,
    });
  }

  return out.sort((a, b) => b.likelihood - a.likelihood);
}

/** Async: stamp Babel text onto the retro grimoire (pixel-perfect). */
export function composeGrimoireWithBabelText(input: {
  seedWord: string;
  pathNumber: number;
  colorHex: string;
  colorName: string;
  babelSnippet: string;
}): Promise<string> {
  if (typeof document === "undefined") return Promise.resolve(RETRO_GRIMOIRE_SRC);

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const w = 360;
      const h = 420;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(RETRO_GRIMOIRE_SRC);
        return;
      }
      const rgb = parseHex(input.colorHex);
      const babelLine = toBabelCaption(input.babelSnippet || input.seedWord);
      const pathLine = `path ${input.pathNumber} · ${input.colorName} · press to begin`;
      renderGrimoirePlate(ctx, img, w, h, babelLine, pathLine, rgb);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(RETRO_GRIMOIRE_SRC);
    img.src = RETRO_GRIMOIRE_SRC;
  });
}

/** Collapse to Basile’s 29-letter press (a–z, space, comma, period). */
export function toBabelCaption(raw: string): string {
  return [...raw.toLowerCase()]
    .map((ch) => (/[a-z, .]/.test(ch) ? ch : " "))
    .join("")
    .replace(/ +/g, " ")
    .trim()
    .slice(0, 64);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  if (typeof document === "undefined") return;
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
