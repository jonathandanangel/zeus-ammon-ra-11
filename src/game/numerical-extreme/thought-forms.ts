/** Official Thought-Forms plates (Besant & Leadbeater, Theosophical Publishing Society). */

export type ThoughtFormPlate = {
  id: string;
  src: string;
  title: string;
  caption: string;
  kind: "colour" | "vibration" | "music" | "manifestation";
};

/** Public-domain scans from Project Gutenberg eBook #16269. */
export const THOUGHT_FORM_PLATES: ThoughtFormPlate[] = [
  {
    id: "colour-chart",
    src: "/numerology/thought-forms/colorchart.jpg",
    title: "Meaning of the Colours",
    caption:
      "Frontispiece — official colour key for thought-forms and the aura (Besant & Leadbeater).",
    kind: "colour",
  },
  {
    id: "chladni",
    src: "/numerology/thought-forms/fig1.png",
    title: "Fig. 1 · Chladni's Sound Plate",
    caption:
      "Physical proof that vibration builds form — sand arranges into geometry by tone.",
    kind: "vibration",
  },
  {
    id: "sound-forms-a",
    src: "/numerology/thought-forms/fig2.png",
    title: "Fig. 2 · Forms Produced in Sound",
    caption: "Vibratory patterns in matter — each rate of vibration yields its own figure.",
    kind: "vibration",
  },
  {
    id: "sound-forms-b",
    src: "/numerology/thought-forms/fig3.png",
    title: "Fig. 3 · Forms Produced in Sound",
    caption: "Further Chladni-type figures: form is the visible body of vibration.",
    kind: "vibration",
  },
  {
    id: "pendulums",
    src: "/numerology/thought-forms/figs4-7.png",
    title: "Figs. 4–7 · Forms Produced by Pendulums",
    caption: "Compound oscillations draw closed curves — motion writing geometry.",
    kind: "vibration",
  },
  {
    id: "cosmic-order",
    src: "/numerology/thought-forms/fig40.jpg",
    title: "Fig. 40 · Cosmic Order",
    caption: "An intellectual conception of cosmic order as a thought-form.",
    kind: "manifestation",
  },
  {
    id: "logos-man",
    src: "/numerology/thought-forms/fig41.jpg",
    title: "Fig. 41 · Logos in Man",
    caption: "The Logos as manifested in man — microcosm mirroring the macrocosm.",
    kind: "manifestation",
  },
  {
    id: "sevenfold",
    src: "/numerology/thought-forms/figs44-47.png",
    title: "Figs. 44–47 · Threefold & Sevenfold",
    caption: "Threefold and sevenfold manifestation — Theosophy’s septenary key.",
    kind: "manifestation",
  },
  {
    id: "mendelssohn",
    src: "/numerology/thought-forms/figm.jpg",
    title: "Plate M · Music of Mendelssohn",
    caption: "Music builds towering thought-forms — vibration made visible in colour and shape.",
    kind: "music",
  },
  {
    id: "gounod",
    src: "/numerology/thought-forms/figg.jpg",
    title: "Plate G · Music of Gounod",
    caption: "Gounod’s music as a brilliant, massive form of living colour.",
    kind: "music",
  },
  {
    id: "wagner",
    src: "/numerology/thought-forms/figw.jpg",
    title: "Plate W · Music of Wagner",
    caption: "Wagner’s mountain-range of sound — the densest musical thought-form plate.",
    kind: "music",
  },
];

/**
 * Prismatic number–colour–note scale used in Theosophical instruction:
 * colours, sounds, and numbers proceed from 1→7 (not 7→1).
 * Sources: H. P. Blavatsky (CW / True Colours tradition); Besant & Leadbeater, Thought-Forms (1901).
 * 8–9 extend beyond the septenary as octave-return and spectrum-synthesis.
 */
export type TheosophyRay = {
  number: number;
  colorName: string;
  hex: string;
  note: string;
  principle: string;
};

export const THEOSOPHY_RAYS: Record<number, TheosophyRay> = {
  1: {
    number: 1,
    colorName: "Red",
    hex: "#E53935",
    note: "Do",
    principle: "Lowest spectral ray · force, will, and the first rate of vibration",
  },
  2: {
    number: 2,
    colorName: "Orange",
    hex: "#FB8C00",
    note: "Re",
    principle: "Prāṇa / vitality · the second rate — life-current between poles",
  },
  3: {
    number: 3,
    colorName: "Yellow",
    hex: "#FDD835",
    note: "Mi",
    principle: "Buddhi-tint of intellect · third rate — clear, luminous mind-light",
  },
  4: {
    number: 4,
    colorName: "Green",
    hex: "#43A047",
    note: "Fa",
    principle: "Adaptability / sympathy · fourth rate — form seeking harmony with others",
  },
  5: {
    number: 5,
    colorName: "Blue",
    hex: "#1E88E5",
    note: "Sol",
    principle: "Devotion & higher clarity · fifth rate — upward rush of ordered feeling",
  },
  6: {
    number: 6,
    colorName: "Indigo",
    hex: "#3949AB",
    note: "La",
    principle: "Higher Manas · sixth rate — deep spiritual intellect",
  },
  7: {
    number: 7,
    colorName: "Violet",
    hex: "#8E24AA",
    note: "Si",
    principle: "Highest prismatic ray · seventh rate — completion of the septenary scale",
  },
  8: {
    number: 8,
    colorName: "Rose",
    hex: "#EC407A",
    note: "Do′",
    principle: "Octave return · new cycle after violet; affection-tone of a higher turn",
  },
  9: {
    number: 9,
    colorName: "White-Gold",
    hex: "#FFD54F",
    note: "Chord",
    principle: "Spectrum synthesis · all colours in one — auric fullness before the decad",
  },
};
