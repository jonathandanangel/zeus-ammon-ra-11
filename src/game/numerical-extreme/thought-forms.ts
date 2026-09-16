/**
 * Thought-Forms (Besant & Leadbeater, Theosophical Publishing Society, 1905).
 * Quotes & page numbers from the user’s PDF scan; plates extracted to
 * /public/numerology/thought-forms/book/ plus Gutenberg cleans in the parent folder.
 *
 * Hierarchy:
 *   Path digit 1–9
 *     → spectral ray (Do–Si / octave / chord)
 *     → Meaning of the Colours (pp. 32–35) emotion key
 *     → illustrative odd-shape figures (emotion plates)
 *     → vibration proofs (Chladni / pendulums / music)
 *     → colour-combination anagrams (book: complex thoughts = several rates)
 *
 * GENERAL SOURCE (all words / number scrambles / combinations):
 *   Frontispiece “Key to the Meanings of Colours”
 *   → /numerology/thought-forms/key-to-meanings-of-colours.png
 */

/** Always-on colour key for every path digit, word scramble, and combination. */
export const COLOUR_KEY_GENERAL_SOURCE = {
  id: "key-to-meanings-of-colours",
  title: "Key to the Meanings of Colours",
  src: "/numerology/thought-forms/key-to-meanings-of-colours.png",
  bookPage: 0,
  bookRef: "Frontispiece · Thought-Forms (1905)",
  role: "General source for all words, path numbers, scrambles, and colour combinations",
  quote:
    "“The table of colours given in the frontispiece has already been thoroughly described in the book Man Visible and Invisible, and the meaning to be attached to them is just the same in the thought-form as in the body out of which it is evolved.” (Meaning of the Colours, p. 32)",
} as const;

/**
 * Frontispiece 5×5 grid (row × column) — exact key labels for scramble / combination work.
 * Row 1 = highest spirituality band … Row 5 = densest astral band (chart layout).
 */
export type ColourKeyCell = {
  row: number;
  col: number;
  emotion: string;
  /** Approximate display hex for UI chips. */
  hex: string;
  /** Path digits that most often land on this cell. */
  pathHint: number[];
};

export const COLOUR_KEY_GRID: ColourKeyCell[] = [
  { row: 1, col: 1, emotion: "High Spirituality", hex: "#CE93D8", pathHint: [7, 9] },
  { row: 1, col: 2, emotion: "Devotion mixed with Affection", hex: "#5E35B1", pathHint: [6, 7, 8] },
  { row: 1, col: 3, emotion: "Devotion to a Noble Ideal", hex: "#42A5F5", pathHint: [5, 6] },
  { row: 1, col: 4, emotion: "Pure Religious Feeling", hex: "#1E88E5", pathHint: [5] },
  { row: 1, col: 5, emotion: "Selfish Religious Feeling", hex: "#1A237E", pathHint: [5, 2] },
  { row: 2, col: 1, emotion: "Religious Feeling, tinged with Fear", hex: "#546E7A", pathHint: [5, 4] },
  { row: 2, col: 2, emotion: "Highest Intellect", hex: "#FFEE58", pathHint: [3, 9] },
  { row: 2, col: 3, emotion: "Strong Intellect", hex: "#FDD835", pathHint: [3] },
  { row: 2, col: 4, emotion: "Low type of Intellect", hex: "#F9A825", pathHint: [3, 2] },
  { row: 2, col: 5, emotion: "Pride", hex: "#FB8C00", pathHint: [2] },
  { row: 3, col: 1, emotion: "Sympathy", hex: "#81C784", pathHint: [4] },
  { row: 3, col: 2, emotion: "Love for Humanity", hex: "#F48FB1", pathHint: [8, 9] },
  { row: 3, col: 3, emotion: "Unselfish Affection", hex: "#EC407A", pathHint: [8] },
  { row: 3, col: 4, emotion: "Selfish Affection", hex: "#880E4F", pathHint: [8, 2] },
  { row: 3, col: 5, emotion: "Pure Affection", hex: "#E53935", pathHint: [8, 1] },
  { row: 4, col: 1, emotion: "Adaptability", hex: "#558B2F", pathHint: [4] },
  { row: 4, col: 2, emotion: "Jealousy", hex: "#6D4C41", pathHint: [4, 1] },
  { row: 4, col: 3, emotion: "Deceit", hex: "#9E9D24", pathHint: [4, 2] },
  { row: 4, col: 4, emotion: "Fear", hex: "#90A4AE", pathHint: [4] },
  { row: 4, col: 5, emotion: "Depression", hex: "#455A64", pathHint: [4, 2] },
  { row: 5, col: 1, emotion: "Selfishness", hex: "#8D6E63", pathHint: [2] },
  { row: 5, col: 2, emotion: "Avarice", hex: "#5D4037", pathHint: [2] },
  { row: 5, col: 3, emotion: "Anger", hex: "#F44336", pathHint: [1] },
  { row: 5, col: 4, emotion: "Sensuality", hex: "#B71C1C", pathHint: [1] },
  { row: 5, col: 5, emotion: "Malice", hex: "#000000", pathHint: [1] },
];

export function colourKeyCellsForNumber(n: number): ColourKeyCell[] {
  const number = n >= 1 && n <= 9 ? n : 9;
  return COLOUR_KEY_GRID.filter((c) => c.pathHint.includes(number));
}

export type ThoughtFormKind =
  | "colour-key"
  | "vibration"
  | "emotion"
  | "meditation"
  | "music"
  | "manifestation";

export type ThoughtFormFigure = {
  id: string;
  /** Book figure / plate label, e.g. "Fig. 8" or "Frontispiece". */
  fig: string;
  /** Printed page in the 1905 edition (from PDF). */
  bookPage: number;
  emotion: string;
  /** Short shape note (odd cloud / projectile / hooks / star…). */
  shape: string;
  colours: string;
  quote: string;
  src: string;
  kind: ThoughtFormKind;
  /** Path digits that should surface this plate. */
  pathNumbers: number[];
};

/** Three laws — book p. 31 (PDF p. 17). */
export const THOUGHT_FORM_THREE_LAWS = [
  {
    law: "Quality of thought determines colour.",
    bookPage: 31,
  },
  {
    law: "Nature of thought determines form.",
    bookPage: 31,
  },
  {
    law: "Definiteness of thought determines clearness of outline.",
    bookPage: 31,
  },
] as const;

export const THOUGHT_FORM_DOUBLE_EFFECT = {
  quote:
    "EACH definite thought produces a double effect—a radiating vibration and a floating form.",
  bookPage: 21, // printed ~21–22; PDF ~11
} as const;

/** Frontispiece colour key (PDF p. 2) + Meaning of the Colours pp. 32–35. */
export type ColourKeyEntry = {
  id: string;
  colorName: string;
  hex: string;
  emotion: string;
  bookPage: number;
  quote: string;
  /** Path digits primarily keyed to this hue. */
  pathNumbers: number[];
};

export const COLOUR_KEY: ColourKeyEntry[] = [
  {
    id: "black",
    colorName: "Black",
    hex: "#111111",
    emotion: "Hatred / malice",
    bookPage: 32,
    quote: "“…black means hatred and malice.”",
    pathNumbers: [1],
  },
  {
    id: "red",
    colorName: "Red",
    hex: "#E53935",
    emotion: "Anger · sensual desire (dragon’s blood)",
    bookPage: 32,
    quote:
      "“Red, of all shades from lurid brick-red to brilliant scarlet, indicates anger; brutal anger will show as flashes of lurid red from dark brown clouds, while the anger of ‘noble indignation’ is a vivid scarlet… a particularly dark and unpleasant red, almost exactly the colour called dragon’s blood, shows animal passion and sensual desire of various kinds.”",
    pathNumbers: [1],
  },
  {
    id: "orange",
    colorName: "Orange",
    hex: "#FB8C00",
    emotion: "Pride / ambition",
    bookPage: 33,
    quote: "“Deep orange imports pride or ambition…”",
    pathNumbers: [2],
  },
  {
    id: "yellow",
    colorName: "Yellow",
    hex: "#FDD835",
    emotion: "Intellect",
    bookPage: 33,
    quote:
      "“…the various shades of yellow denote intellect or intellectual gratification, dull yellow ochre implying the direction of such faculty to selfish purposes, while clear gamboge shows a distinctly higher type, and pale luminous primrose yellow is a sign of the highest and most unselfish use of intellectual power, the pure reason directed to spiritual ends.”",
    pathNumbers: [3],
  },
  {
    id: "green",
    colorName: "Green",
    hex: "#43A047",
    emotion: "Adaptability / sympathy (or deceit if grey-green)",
    bookPage: 33,
    quote:
      "“Green seems always to denote adaptability; in the lowest case, when mingled with selfishness, this adaptability becomes deceit… in its still higher, more delicate and more luminous aspect, it shows the divine power of sympathy.”",
    pathNumbers: [4],
  },
  {
    id: "blue",
    colorName: "Blue",
    hex: "#1E88E5",
    emotion: "Religious feeling / devotion",
    bookPage: 33,
    quote:
      "“The different shades of blue all indicate religious feeling, and range through all hues from the dark brown-blue of selfish devotion, or the pallid grey-blue of fetish-worship tinged with fear, up to the rich deep clear colour of heartfelt adoration, and the beautiful pale azure of that highest form which implies self-renunciation and union with the divine…”",
    pathNumbers: [5, 6],
  },
  {
    id: "violet",
    colorName: "Violet",
    hex: "#8E24AA",
    emotion: "Affection + devotion · high ideal",
    bookPage: 34,
    quote:
      "“A mixture of affection and devotion is manifested by a tint of violet, and the more delicate shades of this invariably show the capacity of absorbing and responding to a high and beautiful ideal.”",
    pathNumbers: [6, 7],
  },
  {
    id: "rose",
    colorName: "Rose / Carmine",
    hex: "#EC407A",
    emotion: "Affection / love",
    bookPage: 33,
    quote:
      "“Affection expresses itself in all shades of crimson and rose… a full clear carmine means a strong healthy affection of normal type; if stained heavily with brown-grey, a selfish and grasping feeling is indicated, while pure pale rose marks that absolutely unselfish love which is possible only to high natures…”",
    pathNumbers: [8, 9],
  },
  {
    id: "brown-grey",
    colorName: "Brown-grey",
    hex: "#6D4C41",
    emotion: "Selfishness / avarice / depression / fear",
    bookPage: 32,
    quote:
      "“Clear brown (almost burnt sienna) shows avarice; hard dull brown-grey is a sign of selfishness… deep heavy grey signifies depression, while a livid pale grey is associated with fear; grey-green is a signal of deceit, while brownish-green… betokens jealousy.”",
    pathNumbers: [2, 4],
  },
];

/**
 * Illustrative odd-shape plates from the 1905 PDF (facing colour pages).
 * bookPage = printed page; src = extracted plate image.
 */
export const THOUGHT_FORM_FIGURES: ThoughtFormFigure[] = [
  {
    id: "colour-key",
    fig: "Frontispiece",
    bookPage: 0,
    emotion: "Key to the Meanings of Colours",
    shape: "5×5 colour grid (texture = purity vs mottled selfish stain)",
    colours: "Full spectrum of the aura / thought-form key",
    quote:
      "“The table of colours given in the frontispiece has already been thoroughly described in the book Man Visible and Invisible, and the meaning to be attached to them is just the same in the thought-form as in the body out of which it is evolved.” (p. 32)",
    src: "/numerology/thought-forms/key-to-meanings-of-colours.png",
    kind: "colour-key",
    pathNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    id: "chladni",
    fig: "Fig. 1",
    bookPage: 28,
    emotion: "Vibration → geometry (laboratory)",
    shape: "Sand plate / nodal lines",
    colours: "Physical proof plate",
    quote:
      "“A Chladni’s sound plate (fig. 1) is made of brass or plate-glass. Grains of fine sand… are scattered over the surface, and the edge of the plate is bowed… By touching the edge of the plate at different points… different notes, and hence varying forms, are obtained (fig. 3).” (pp. 28–29)",
    src: "/numerology/thought-forms/fig1.png",
    kind: "vibration",
    pathNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    id: "sand-2",
    fig: "Fig. 2",
    bookPage: 28,
    emotion: "Single tone → one figure",
    shape: "Sand nodal pattern",
    colours: "Monochrome vibration figure",
    quote:
      "“The fact of the creation by vibrations of a distinct form, geometrical or other, is already familiar to every student of acoustics, and ‘Chladni’s’ figures are continually reproduced in every physical laboratory.” (p. 28)",
    src: "/numerology/thought-forms/fig2.png",
    kind: "vibration",
    pathNumbers: [1, 3, 5],
  },
  {
    id: "sand-3",
    fig: "Fig. 3",
    bookPage: 29,
    emotion: "Different notes → varying forms",
    shape: "Alternate sand figure",
    colours: "Monochrome vibration figure",
    quote:
      "“…different notes, and hence varying forms, are obtained (fig. 3).” (p. 29)",
    src: "/numerology/thought-forms/fig3.png",
    kind: "vibration",
    pathNumbers: [2, 4, 7],
  },
  {
    id: "pendulums",
    fig: "Figs. 4–7",
    bookPage: 29,
    emotion: "Compound oscillations (complex thought)",
    shape: "Closed curves / interlaced loops (odd machine-drawn forms)",
    colours: "Ink figures comparable to living thought-forms",
    quote:
      "“Substitute for the swing of the pendulum the vibrations set up in the mental or astral body, and we have clearly before us the modus operandi of the building of forms by vibrations.” (pp. 28–29) Compare fig. 4 with fig. 12; fig. 6 with fig. 25.",
    src: "/numerology/thought-forms/figs4-7.png",
    kind: "vibration",
    pathNumbers: [2, 4, 6, 9],
  },
  {
    id: "fig8-9",
    fig: "Figs. 8–9",
    bookPage: 40,
    emotion: "Vague Pure Affection · Vague Selfish Affection",
    shape: "Shapeless rolling crimson clouds (odd nebulous ovals)",
    colours: "Clear rose-crimson vs murky brown-stained crimson",
    quote:
      "“Vague Pure Affection.—Fig. 8 is a revolving cloud of pure affection… Vague Selfish Affection” contrasts with brown-grey selfish stain (pp. 40–41). “Every one of the thought-forms here given is drawn from life.” (p. 40)",
    src: "/numerology/thought-forms/book/p22_x360.png",
    kind: "emotion",
    pathNumbers: [8, 1, 9],
  },
  {
    id: "fig10-12",
    fig: "Figs. 10 & 12",
    bookPage: 42,
    emotion: "Definite / projectile affection · Peace & protection",
    shape: "Comet-head projectile; winged yellow centre with rose vanes",
    colours: "Clear crimson; yellow + rose",
    quote:
      "“Fig. 10 depicts just such a thought-form… The clearness of the colour assures us of the purity of the emotion… while the precision of its outline is unmistakable evidence of power and of vigorous purpose.” (p. 42)",
    src: "/numerology/thought-forms/book/p24_x385.png",
    kind: "emotion",
    pathNumbers: [8, 3, 5],
  },
  {
    id: "fig14-16",
    fig: "Figs. 14 & 16",
    bookPage: 44,
    emotion: "Vague Religious Feeling · Devotion (odd blue flower/hooks)",
    shape: "Shapeless blue cloud; pale-blue petal/hook form",
    colours: "Deep dull blue · pale azure",
    quote:
      "“It betokens that vaguely pleasurable religious feeling—a sensation of devoutness rather than of devotion… In many a church one may see a great cloud of deep dull blue floating over the heads of the congregation—indefinite in outline…” (p. 44)",
    src: "/numerology/thought-forms/book/p26_x395.png",
    kind: "emotion",
    pathNumbers: [5, 6, 7],
  },
  {
    id: "fig20-21",
    fig: "Figs. 20–21",
    bookPage: 52,
    emotion: "Selfish Ambition · Acquisitiveness",
    shape: "Orange projectile with tendrils; hooked orange octopus/hub",
    colours: "Bright orange + dull brown-grey selfish stain",
    quote:
      "“Fig. 20 is rising steadily onward towards a definite object… Fig. 21… is strongly indicative of general acquisitiveness—the ambition to grasp for the self everything that is within sight… we here have a large stain of the dull brown-grey of selfishness.” (p. 52)",
    src: "/numerology/thought-forms/book/p33_x475.png",
    kind: "emotion",
    pathNumbers: [2, 1],
  },
  {
    id: "fig40-41",
    fig: "Figs. 40–41",
    bookPage: 68,
    emotion: "Cosmic Order (intellect) · Logos in Man (devotion)",
    shape: "Yellow hexagram in orb; pale-blue pentagram with yellow rays",
    colours: "Yellow / orange · pale blue + yellow rays",
    quote:
      "“An Intellectual Conception of Cosmic Order.—In Fig. 40… The Logos as manifested in Man.—… pale blue tinge to the five-pointed star… surrounded by bright yellow rays…” (pp. 68–69). Six directions (Hindu) yield “curious hexagon” / hexagram geometry.",
    src: "/numerology/thought-forms/book/p50_x620.png",
    kind: "meditation",
    pathNumbers: [3, 5, 6],
  },
  {
    id: "sevenfold-plate",
    fig: "Figs. 44–47",
    bookPage: 70,
    emotion: "Threefold & Sevenfold Manifestation of the Logos",
    shape: "Concentric damascened rings / septenary unfolding",
    colours: "Blue line-work · golden centre (First Aspect glow)",
    quote:
      "“The Threefold Manifestation.—When the form employed in Fig. 46 was made, its creator was endeavouring to think of the LOGOS in His threefold manifestation. The vacant space in the centre… was a blinding glow of yellow light…” (p. 71). Fig. 47 = sevenfold manifestation.",
    src: "/numerology/thought-forms/figs44-47.png",
    kind: "manifestation",
    pathNumbers: [3, 6, 7, 9],
  },
  {
    id: "mendelssohn",
    fig: "Plate M",
    bookPage: 78,
    emotion: "Music · Mendelssohn (filigree vibration-form)",
    shape: "Towering multi-band coloured architecture above organ",
    colours: "Blue / carmine bands · violet arpeggio scallops",
    quote:
      "“It is produced by one of Mendelssohn’s ‘Lieder ohne Worte,’ and is characteristic of the delicate filigree-work which so often appears as the result of his compositions.” (p. 79)",
    src: "/numerology/thought-forms/figm.jpg",
    kind: "music",
    pathNumbers: [6, 5, 7],
  },
  {
    id: "gounod",
    fig: "Plate G",
    bookPage: 80,
    emotion: "Music · Gounod",
    shape: "Massive chordal colour mountain",
    colours: "Blended chord colours (violet protrusions noted)",
    quote:
      "“The large violet protrusion there is evidently the opening chord of a phrase…” (p. 81) — Gounod plate analysis.",
    src: "/numerology/thought-forms/figg.jpg",
    kind: "music",
    pathNumbers: [5, 7, 8],
  },
  {
    id: "wagner",
    fig: "Plate W",
    bookPage: 82,
    emotion: "Music · Wagner (densest multi-rate form)",
    shape: "Mountain-range of simultaneous vibrations",
    colours: "Coruscating many-coloured mass",
    quote:
      "“Each class of music has its own type of form, and the style of the composer shows as clearly in the form which his music builds as a man’s character shows in his handwriting.” (p. 76)",
    src: "/numerology/thought-forms/figw.jpg",
    kind: "music",
    pathNumbers: [7, 9, 6],
  },
];

/** Book colour-mix “anagrams” — rearrangements of rates into compound hues. */
export type ColourCombination = {
  id: string;
  inputs: string[];
  result: string;
  bookPage: number;
  quote: string;
  /** Digit pairs / triples that exemplify the mix. */
  numberCombos: string[];
};

export const COLOUR_COMBINATIONS: ColourCombination[] = [
  {
    id: "violet-mix",
    inputs: ["rose (affection)", "blue (devotion)"],
    result: "Violet",
    bookPage: 34,
    quote:
      "“A mixture of affection and devotion is manifested by a tint of violet…”",
    numberCombos: ["8+5→7", "8+5→6", "5+8"],
  },
  {
    id: "brotherhood",
    inputs: ["pale rose (love)", "blue (devotion)"],
    result: "Universal brotherhood tint",
    bookPage: 33,
    quote:
      "“With a touch of the blue of devotion in it, this may express a strong realisation of the universal brotherhood of humanity.”",
    numberCombos: ["8+5→9", "8+5"],
  },
  {
    id: "complex-multi",
    inputs: ["any two+ emotions"],
    result: "Several colours in one form",
    bookPage: 22,
    quote:
      "“The majority of human thoughts… are by no means simple… This means that at least two separate vibrations appear… The radiating vibration, therefore, will be a complex one, and the resultant thought-form will show several colours instead of only one.”",
    numberCombos: ["1+2", "2+3", "3+4", "4+5", "5+6", "6+7", "1+2+3=6"],
  },
  {
    id: "jealousy",
    inputs: ["brownish-green", "scarlet flashes"],
    result: "Jealousy",
    bookPage: 32,
    quote:
      "“…brownish-green (usually flecked with points and flashes of scarlet) betokens jealousy.”",
    numberCombos: ["4+1", "1+4"],
  },
  {
    id: "hexagram-six",
    inputs: ["up-triangle (spirit)", "down-triangle (matter)"],
    result: "Yellow hexagram · Cosmic Order (Fig. 40) · six directions",
    bookPage: 68,
    quote:
      "“…the Hindu speaks, not of four directions… but always of six, since he very sensibly includes the zenith and the nadir.” Fig. 40 hexagram of cosmic order.",
    numberCombos: ["3+3", "1+2+3=6", "6"],
  },
];

export type PathThoughtFormBundle = {
  number: number;
  colorName: string;
  hex: string;
  musicalNote: string;
  colourKeys: ColourKeyEntry[];
  /** Always included — frontispiece key for scrambles / combinations. */
  generalColourKey: typeof COLOUR_KEY_GENERAL_SOURCE;
  gridCells: ColourKeyCell[];
  figures: ThoughtFormFigure[];
  combinations: ColourCombination[];
  laws: typeof THOUGHT_FORM_THREE_LAWS;
  doubleEffect: typeof THOUGHT_FORM_DOUBLE_EFFECT;
  blurb: string;
};

const PATH_META: Record<
  number,
  { colorName: string; hex: string; musicalNote: string; blurb: string }
> = {
  1: {
    colorName: "Red",
    hex: "#E53935",
    musicalNote: "Do",
    blurb:
      "Path 1 · Red (pp. 32–33) — anger / passion key; flash and projectile anger shapes; Chladni single-tone geometry.",
  },
  2: {
    colorName: "Orange",
    hex: "#FB8C00",
    musicalNote: "Re",
    blurb:
      "Path 2 · Orange (p. 33) — pride/ambition; hooked acquisitive odd-forms (Figs. 20–21, p. 52); dual pendulum rates.",
  },
  3: {
    colorName: "Yellow",
    hex: "#FDD835",
    musicalNote: "Mi",
    blurb:
      "Path 3 · Yellow intellect (p. 33); Cosmic Order hexagram Fig. 40 (p. 68); threefold Logos plates.",
  },
  4: {
    colorName: "Green",
    hex: "#43A047",
    musicalNote: "Fa",
    blurb:
      "Path 4 · Green adaptability/sympathy (p. 33); deceit/jealousy stains when greyed; compound vibration curves.",
  },
  5: {
    colorName: "Blue",
    hex: "#1E88E5",
    musicalNote: "Sol",
    blurb:
      "Path 5 · Blue religious feeling (pp. 33–34); vague devotion cloud Fig. 14 (p. 44); Logos-in-man star Fig. 41; Gounod music.",
  },
  6: {
    colorName: "Indigo",
    hex: "#3949AB",
    musicalNote: "La",
    blurb:
      "Path 6 · Indigo band (deep blue→violet, pp. 33–34); six-directions / Cosmic Order hexagram Fig. 40 (p. 68); sevenfold plates; Mendelssohn filigree.",
  },
  7: {
    colorName: "Violet",
    hex: "#8E24AA",
    musicalNote: "Si",
    blurb:
      "Path 7 · Violet = affection+devotion mix (p. 34); sevenfold manifestation; Wagner densest music-form (p. 82).",
  },
  8: {
    colorName: "Rose",
    hex: "#EC407A",
    musicalNote: "Do′",
    blurb:
      "Path 8 · Rose/carmine affection (p. 33); Figs. 8–10 affection clouds & projectile (pp. 40–42); octave after violet.",
  },
  9: {
    colorName: "White-Gold",
    hex: "#FFD54F",
    musicalNote: "Chord",
    blurb:
      "Path 9 · Chord of many rates (p. 22 complex thoughts); colour-key synthesis; sevenfold + Wagner multi-colour mass.",
  },
};

export function thoughtFormBundleForNumber(n: number): PathThoughtFormBundle {
  const number = n >= 1 && n <= 9 ? n : 9;
  const meta = PATH_META[number]!;
  const colourKeys = COLOUR_KEY.filter((c) => c.pathNumbers.includes(number));
  const figures = THOUGHT_FORM_FIGURES.filter((f) => f.pathNumbers.includes(number));
  const combinations = COLOUR_COMBINATIONS.filter((c) =>
    c.numberCombos.some((combo) => combo.includes(String(number))),
  );
  return {
    number,
    ...meta,
    colourKeys,
    generalColourKey: COLOUR_KEY_GENERAL_SOURCE,
    gridCells: colourKeyCellsForNumber(number),
    figures,
    combinations,
    laws: THOUGHT_FORM_THREE_LAWS,
    doubleEffect: THOUGHT_FORM_DOUBLE_EFFECT,
  };
}

/** Legacy exports used elsewhere. */
export type ThoughtFormPlate = {
  id: string;
  src: string;
  title: string;
  caption: string;
  kind: ThoughtFormKind | "colour" | "vibration" | "music" | "manifestation";
  bookRef: string;
};

export const THOUGHT_FORM_PLATES: ThoughtFormPlate[] = THOUGHT_FORM_FIGURES.map((f) => ({
  id: f.id,
  src: f.src,
  title: `${f.fig} · ${f.emotion}`,
  caption: `p. ${f.bookPage || "front"} · ${f.shape}. ${f.quote.slice(0, 160)}…`,
  kind: f.kind,
  bookRef: f.bookPage ? `p. ${f.bookPage}` : f.fig,
}));

export type TheosophyRay = {
  number: number;
  colorName: string;
  hex: string;
  note: string;
  principle: string;
};

export const THEOSOPHY_RAYS: Record<number, TheosophyRay> = Object.fromEntries(
  Object.entries(PATH_META).map(([k, v]) => [
    Number(k),
    {
      number: Number(k),
      colorName: v.colorName,
      hex: v.hex,
      note: v.musicalNote,
      principle: v.blurb,
    },
  ]),
) as Record<number, TheosophyRay>;

export function platesForNumber(n: number): ThoughtFormPlate[] {
  return thoughtFormBundleForNumber(n).figures.map((f) => ({
    id: f.id,
    src: f.src,
    title: `${f.fig} · ${f.emotion}`,
    caption: `p. ${f.bookPage || "front"} · ${f.shape}`,
    kind: f.kind,
    bookRef: f.bookPage ? `p. ${f.bookPage}` : f.fig,
  }));
}

export function thoughtFormDetailForNumber(n: number) {
  return thoughtFormBundleForNumber(n);
}
