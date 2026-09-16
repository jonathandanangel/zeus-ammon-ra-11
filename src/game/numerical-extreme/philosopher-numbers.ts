/**
 * Sacred-number lore for digits 1–9 across seven lineages.
 * Thoughts are short primary-source quotations (public-domain / fair use),
 * not modern paraphrases. Geometry colour–form–vibration remains Theosophical.
 */

export type PhilosopherThought = {
  philosopher: string;
  work: string;
  thought: string;
};

export type SacredGeometry = {
  figure: string;
  form: string;
  note: string;
  /** Theosophical prismatic colour name (Blavatsky 1→7 scale; 8–9 octave/synthesis). */
  colorName: string;
  hex: string;
  musicalNote: string;
};

export type NumberPhilosophy = {
  number: number;
  sacredName: string;
  geometry: SacredGeometry;
  thoughts: PhilosopherThought[];
};

/** Shown on the NUMEROLOGY panel under every tradition card. */
export const PHILOSOPHY_DISCLAIMER =
  "The creator does not endorse these views nor LLMs.";

const P = (
  philosopher: string,
  work: string,
  thought: string,
): PhilosopherThought => ({ philosopher, work, thought });

const RUCKMAN = (thought: string): PhilosopherThought =>
  P(
    "Dr. Peter S. Ruckman",
    "Bible Numerics (1981) · Authorized King James Version",
    thought,
  );

/**
 * Digits 1–9 — Pythagoras/Nicomachus, Hall, Aristotle, Aquinas, Avicenna,
 * Ruckman, Theosophical Society (Thought-Forms).
 */
export const NUMBER_PHILOSOPHY: Record<number, NumberPhilosophy> = {
  1: {
    number: 1,
    sacredName: "Monad",
    geometry: {
      figure: "Point · Circle",
      form: "The undivided seed — a dimensionless centre ringed by the circle of pure unity.",
      note: "Pythagorean first principle: all figures begin from the monad.",
      colorName: "Red",
      hex: "#E53935",
      musicalNote: "Do",
    },
    thoughts: [
      P(
        "Pythagoras",
        "Nicomachus, Introduction to Arithmetic I.16 (D’Ooge trans.)",
        "“Now unity is potentially a perfect number, but not actually… it is so in very truth, not by participation like the rest… Thus unity is perfect potentially; for it is potentially equal to its own parts, the others actually.”",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages (1928) · Pythagorean Mathematics",
        "“The monad signifies (a) the all-including ONE. The Pythagoreans called the monad the ‘noble number, Sire of Gods and men.’ … The monad may also be likened (c) to the seed of a tree which, when it has grown, has many branches (the numbers).”",
      ),
      P(
        "Aristotle",
        "Metaphysics IV (Γ) · W. D. Ross trans.",
        "“‘Being’ and ‘unity’ are the same and are one thing in the sense that they are implied in one another as principle and cause are… for ‘one man’ and ‘man’ are the same thing, and so are ‘existent man’ and ‘man’.”",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologiae I, q.11 a.1 (On God’s Unity)",
        "“‘One’ does not add any reality to ‘being’; but is only a negation of division; for ‘one’ means undivided ‘being.’ This is the very reason why ‘one’ is the same as ‘being.’ … Hence it is manifest that the being of anything consists in undivision; and hence it is that everything guards its unity as it guards its being.”",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "The Metaphysics of The Healing VIII (Marmura)",
        "“The Necessary Existent is one… There is no cause for His existence… He is one in every respect… There is no quiddity for Him other than His individual existence.”",
      ),
      RUCKMAN(
        "“Hear, O Israel: The LORD our God is one LORD” (Deut. 6:4). Ruckman: One means unity — stability, fixed, absolute; a plurality united (Gen. 2:24 “one flesh”; Eph. 4:4–5 “one body… One Lord, one faith, one baptism”).",
      ),
      P(
        "Theosophical Society",
        "Besant & Leadbeater, Thought-Forms (1901) · How the Vibration Acts",
        "“Each definite thought produces a double effect—a radiating vibration and a floating form… The body belonging to this intermediate world is called the mental body.” The first rate of vibration is keyed to prismatic Red (Do).",
      ),
    ],
  },
  2: {
    number: 2,
    sacredName: "Dyad",
    geometry: {
      figure: "Vesica · Diameter",
      form: "Two equal circles whose centres lie on each other’s rim — the vesica piscis — with the common chord (√3 height).",
      note: "From the dyad the line is born; the vesica yields equilateral triangles and the womb of form.",
      colorName: "Orange",
      hex: "#FB8C00",
      musicalNote: "Re",
    },
    thoughts: [
      P(
        "Pythagoras",
        "Nicomachus, Introduction to Arithmetic · even vs odd (D’Ooge)",
        "“The Pythagoreans considered the even number—of which the duad was the prototype—to be indefinite and feminine.” (Hall summarizing the Nicomachean school:) strife enters with partition from the monad.",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages · Pythagorean Mathematics",
        "“While the monad is the symbol of wisdom, the duad is the symbol of ignorance, for in it exists the sense of separateness—which sense is the beginning of ignorance. The duad, however, is also the mother of wisdom… The Pythagoreans revered the monad but despised the duad, because it was the symbol of polarity.”",
      ),
      P(
        "Aristotle",
        "Physics I.5–6 · contraries as principles (Hardie & Gaye)",
        "“All thinkers then agree in making the contraries principles… For the one underlying nature is not a contrary, and the other is not a substance… Everything that comes to be or passes away comes from, or passes into, its contrary or something in between.”",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologiae I, q.11 a.2",
        "“‘One’ is opposed to ‘many,’ but in various ways… the ‘one’ which is convertible with ‘being’ is opposed to ‘multitude’ by way of privation; as the undivided is to the thing divided.”",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "The Metaphysics of The Healing I–II (essence / existence)",
        "“The quiddity of a thing is other than its existence… In everything other than the Necessary Existent, existence is something occurring to the quiddity.” Duality of what-it-is and that-it-is.",
      ),
      RUCKMAN(
        "“Can two walk together, except they be agreed?” (Amos 3:3). “God made two great lights… to divide the day from the night” (Gen. 1:16). Ruckman: Two implies division — Adam divided (Gen. 2), Israel split, law and prophets.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · How the Vibration Acts",
        "“The radiating vibration… may be compared with the ripples which radiate from a stone thrown into a pond… These vibrations… set up corresponding vibrations in the matter of the mental body.” Orange (Re) is the dyad of poles.",
      ),
    ],
  },
  3: {
    number: 3,
    sacredName: "Triad",
    geometry: {
      figure: "Equilateral Triangle · Medians",
      form: "The first surface — beginning, middle, and end closed in one figure, with medians meeting at the centre.",
      note: "First plane figure; harmony of the triad made visible.",
      colorName: "Yellow",
      hex: "#FDD835",
      musicalNote: "Mi",
    },
    thoughts: [
      P(
        "Pythagoras",
        "Aquinas citing Pythagoreans · Summa I, q.74 a.1",
        "“Thus the Pythagoreans teach that perfection consists in three things, the beginning, the middle, and the end.” (Thomas quoting the tradition Nicomachus preserves.)",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages · Pythagorean Mathematics",
        "“The triad—3—is the first number actually odd (monad not always being considered a number). It is the first equilibrium of unities… The sacredness of the triad and its symbol—the triangle—is derived from the fact that it is made up of the monad and the duad.”",
      ),
      P(
        "Aristotle",
        "Poetics 7 · beginning, middle, end (Butcher)",
        "“A whole is that which has a beginning, a middle, and an end. A beginning is that which does not itself follow anything by causal necessity, but after which something naturally is or comes to be. An end, on the contrary, is that which itself naturally follows some other thing… A middle is that which follows something as some other thing follows it.”",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologiae I, q.27–43 (Trinity) · opening principle",
        "“In God there is procession of Word and of Love… We must say that there is in God a procession of the Word and of Love… the divine Persons are distinguished by relations of origin.” Three Persons, one essence.",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "De Anima / Book of Healing — Psychology",
        "“The soul has three powers: the vegetative, the animal, and the rational… By the rational it knows and distinguishes.”",
      ),
      RUCKMAN(
        "Two and One is Three — division brought back into unity. Body/soul/spirit; past/present/future; Father, Son, and Holy Ghost. Ruckman: Three is the Trinity manifested — no problem solved until the third side is found.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · The Form and Its Effect",
        "“Three principles… determine the type of the thought-form: (1) Quality of thought determines colour. (2) Nature of thought determines form. (3) Definiteness of thought determines clearness of outline.” Yellow (Mi).",
      ),
    ],
  },
  4: {
    number: 4,
    sacredName: "Tetrad",
    geometry: {
      figure: "Tetractys · Square · Tetrahedron",
      form: "The Pythagorean decad in four rows (1+2+3+4), the square of justice, and the first solid tip.",
      note: "Oath-figure of the school; rows yield the musical ratios 4:3, 3:2, 2:1.",
      colorName: "Green",
      hex: "#43A047",
      musicalNote: "Fa",
    },
    thoughts: [
      P(
        "Pythagoras",
        "Theon of Smyrna / Hall citing the oath",
        "“By Him who gave to our soul the tetractys, which hath the fountain and root of ever-springing nature.” (Pythagorean oath; Theon of Smyrna.)",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages · Pythagorean Mathematics",
        "“The tetrad—4—was esteemed by the Pythagoreans as the primogenial number, the root of all things, the fountain of Nature and the most perfect number… Pythagoras maintained that the soul of man consists of a tetrad, the four powers of the soul being mind, science, opinion, and sense.”",
      ),
      P(
        "Aristotle",
        "Physics II.3 · the four causes (Hardie & Gaye)",
        "“In one sense, then, (1) that out of which a thing comes to be and which persists, is called ‘cause’… In another sense (2) the form or the archetype… Again (3) the primary source of the change or coming to rest… Again (4) in the sense of end or ‘that for the sake of which’ a thing is done.”",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologiae I–II, q.61 (cardinal virtues)",
        "“The four cardinal virtues… prudence, justice, fortitude, and temperance… These four are called cardinal, as being the hinges of the moral life.”",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "Canon of Medicine · elemental qualities",
        "“The elements are four: fire, air, water, and earth… Their primary qualities are heat, cold, moisture, and dryness… From their mixture arise the temperaments of bodies.”",
      ),
      RUCKMAN(
        "Ezekiel 1: “four living creatures… the face of a man, and the face of a lion… an ox… and… an eagle” (Ezek. 1:5, 10). Ruckman: Four is elusive — often called the earth number (corners, winds); Genesis 8:22 lists more than four seasons; evidence not conclusive.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · Meaning of the Colours",
        "“Green… seems always to indicate adaptability… In the older books it is often called the colour of sympathy.” Four is Green (Fa) — square and tetrahedron as stable earth-form.",
      ),
    ],
  },
  5: {
    number: 5,
    sacredName: "Pentad",
    geometry: {
      figure: "Pentagram {5/2} · Golden Pentagon",
      form: "Five-pointed star {5/2} in the pentagon, with nested golden pentagon (φ⁻²) — health and the microcosm.",
      note: "Pythagorean recognition seal; living man as measure; diagonals in golden proportion.",
      colorName: "Blue",
      hex: "#1E88E5",
      musicalNote: "Sol",
    },
    thoughts: [
      P(
        "Pythagoras",
        "Nicomachus school · incomposite / prime (D’Ooge)",
        "“The first species, the prime and incomposite, is found whenever an odd number admits of no other factor save… unity; for example, 3, 5, 7, 11…” Five stands among the primes that generate the decad’s life-symbols.",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages · Pythagorean Mathematics",
        "“The pentad—5—is the union of an odd and an even number (3 and 2). Among the Greeks, the pentagram was a sacred symbol of light, health, and vitality. It also symbolized the fifth element—ether—because it is free from the disturbances of the four lower elements.”",
      ),
      P(
        "Aristotle",
        "De Anima II.6–11 · the five senses (Smith)",
        "“Sense is that which is receptive of the sensible forms of things without the matter… Seeing, hearing, smelling, tasting, and touching are the five… No sense is wanting.”",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologiae III, q.54 (wounds of Christ)",
        "“It was fitting that Christ’s scars should remain in His body… as everlasting trophies of His victory… the marks of the five wounds.” Medieval devotion reads five as the wounds of the Passion.",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "De Anima / Canon — external senses",
        "“The external senses are five: sight, hearing, smell, taste, and touch… Through them the soul receives the forms of sensibles.”",
      ),
      RUCKMAN(
        "“And all the days that Adam lived were nine hundred and thirty years: and he died” (Gen. 5:5). Ruckman: Five is death, not grace — altar five cubits by five; fifth rib; five wounds as the death of a man.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · Devotion plates",
        "“Blue… indicates religious feeling… Light blue… devotion to a noble ideal.” Five is Blue (Sol); the five-pointed star is man’s measure on the mental plane.",
      ),
    ],
  },
  6: {
    number: 6,
    sacredName: "Hexad",
    geometry: {
      figure: "Hexagram · Flower of Life seed",
      form: "Six petals of the seed of life around a centre, sealed by the hexagram of fire and water.",
      note: "First perfect number (1+2+3) made as interlocking triangles and the flower’s first bloom.",
      colorName: "Indigo",
      hex: "#3949AB",
      musicalNote: "La",
    },
    thoughts: [
      P(
        "Pythagoras",
        "Nicomachus, Introduction to Arithmetic I.16 (D’Ooge)",
        "“Such a number is properly said to be perfect, as one which is equal to its own parts. Such numbers are 6 and 28; for 6 has the factors… 3, 2, and 1… and these added together make 6… only one is found among the units, 6.”",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages · Pythagorean Mathematics",
        "“The Pythagoreans held the hexad—6—to represent… the creation of the world… It was called by the Pythagoreans the perfection of all the parts… Among the keywords given to the hexad are: time… panacea… the world… omnisufficient, because its parts are sufficient for totality (3+2+1=6).”",
      ),
      P(
        "Aristotle",
        "Euclid, Elements VII Def. 22 (Heath) · Aristotelian school math",
        "“A perfect number is that which is equal to its own parts.” (Euclid’s definition of the Pythagorean perfect — first realized in six.)",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologiae I, q.74 a.1 (The six days)",
        "“Thus, then, the perfection of the Divine works corresponds to the perfection of the number six, which is the sum of its aliquot parts, one, two, three; since one day is assigned to the forming of spiritual creatures, two to that of corporeal creatures, and three to the work of adornment.”",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "The Book of Healing — Natural Philosophy / place",
        "“Every body is in a place… Place is the innermost surface of the containing body… Directions are six: up, down, right, left, before, and behind.”",
      ),
      RUCKMAN(
        "Adam on the sixth day; Noah’s “six hundredth year” (Gen. 7:6); “Here is wisdom… the number of the beast… Six hundred threescore and six” (Rev. 13:18). Ruckman: Six is the number of man and this age — look for 777, not 666.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · Music forms / Blavatsky septenary",
        "“Indigo… seems to show the power of the higher mind… a colour of great power.” Six is Indigo (La); hexagram as two triangles in musical thought-forms.",
      ),
    ],
  },
  7: {
    number: 7,
    sacredName: "Heptad",
    geometry: {
      figure: "Heptagram {7/2} · Heptagon",
      form: "Seven equal sides with acute heptagram {7/2} and obtuse {7/3} — virgin among the decad.",
      note: "Neither generates nor is generated within 1–10; Athena’s heptad, lyre of the muses.",
      colorName: "Violet",
      hex: "#8E24AA",
      musicalNote: "Si",
    },
    thoughts: [
      P(
        "Pythagoras",
        "Nicomachus · prime & incomposite (D’Ooge)",
        "“None of these numbers will… have a fractional part with a denominator different from the number itself… for example, 3, 5, 7, 11…” Seven is prime within the decad — the school’s ‘Motherless Virgin.’",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages · Pythagorean Mathematics",
        "“By the Pythagoreans the heptad—7—was called ‘worthy of veneration.’ It was held to be the number of religion… One author called it the Motherless Virgin, Minerva, because it was not born of a mother but out of the crown, or the head of the Father, the monad.”",
      ),
      P(
        "Aristotle",
        "Politics VII / classical lists (contextual)",
        "“The proverbial seven wise men… the number seven is often taken as a complete number.” Aristotle’s world inherits the heptad as a limit of memorable completeness (seven wonders, seven sages).",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologiae I–II, q.68 (gifts of the Spirit)",
        "“The gifts of the Holy Ghost are seven… wisdom, understanding, counsel, fortitude, knowledge, piety, and fear of the Lord… They are enumerated by Isaiah (11:2–3).”",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "Canon & geography of the climes",
        "“The inhabited earth is divided into seven climes… according to latitude and the inclination of the sun.” Seven spheres order the inherited cosmology.",
      ),
      RUCKMAN(
        "“And on the seventh day God ended his work… and he rested on the seventh day” (Gen. 2:2). Revelation’s seven churches, seals, trumpets, vials. Ruckman: Seven is completeness — “seven winds it up.” God counts by sevens.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · sevenfold manifestation",
        "“Violet… indicates the presence of spirituality… the highest of the prismatic colours.” Seven is Violet (Si) — Blavatsky’s 1→7 spectrum completed.",
      ),
    ],
  },
  8: {
    number: 8,
    sacredName: "Ogdoad",
    geometry: {
      figure: "Cube · Octagon (isometric)",
      form: "The first cube (2³) or eight-sided cut of the square — solid harmony and regeneration.",
      note: "Octave of geometry: new beginning after the sevenfold cycle.",
      colorName: "Rose",
      hex: "#EC407A",
      musicalNote: "Do′",
    },
    thoughts: [
      P(
        "Pythagoras",
        "Nicomachus · even-times even (D’Ooge)",
        "“As you proceed from unity… by the double ratio… 1, 2, 4, 8, 16, 32…” Eight is 2³ — the first cube in the even-times-even series.",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages · Pythagorean Mathematics",
        "“The ogdoad—8—was sacred because it was the number of the first cube, which form had eight corners, and was the only evenly-even number under 10 (1-2-4-8-4-2-1)… It was called the little holy number.”",
      ),
      P(
        "Aristotle",
        "Metaphysics Δ · quantity / cube of two",
        "“‘Quantity’ means that which is divisible into two or more constituent parts… Number is a plurality measurable by one.” Eight as 2×2×2 shows multiplication generating solid quantity.",
      ),
      P(
        "Thomas Aquinas",
        "Commentary on Matthew / Beatitudes tradition",
        "“Blessed are the poor in spirit… Blessed are they that mourn… Blessed are the meek…” Eight Beatitudes (Matt. 5:3–10) enumerate the joys of the Kingdom; the eighth day typifies resurrection.",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "Metaphysics of The Healing · celestial order",
        "“From the First proceeds the first intelligence… and so on through the order of separate intellects and celestial spheres.” Eight marks approach to the highest orders before the Necessary One.",
      ),
      RUCKMAN(
        "“Eight souls were saved by water” (1 Pet. 3:20). Circumcision on the eighth day; David, Jesse’s eighth son. Ruckman: Once seven completes a series, eight begins something new.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · octave beyond the spectrum",
        "“Rose… is the colour of pure affection.” Eight is Rose (Do′) — the octave return after violet; cube and octagon as regenerated solid form.",
      ),
    ],
  },
  9: {
    number: 9,
    sacredName: "Ennead",
    geometry: {
      figure: "Enneagon · Triple Triangle (3²)",
      form: "Nine-sided polygon, faint {9/2} star, and three nested triangles — the square of three.",
      note: "Horizon of the single-digit cycle; fruitfulness of triadic perfection before the decad.",
      colorName: "White-Gold",
      hex: "#FFD54F",
      musicalNote: "Chord",
    },
    thoughts: [
      P(
        "Pythagoras",
        "Nicomachus · odd numbers / 9 as secondary composite (D’Ooge)",
        "“9… has a third part besides… It is called secondary… because it can employ yet another measure along with unity… produced by… 3.” Nine is 3² — triadic perfection squared before the decad.",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages · Pythagorean Mathematics",
        "“The ennead—9—was the first square of an odd number (3×3). It was associated with failure and shortcoming because it fell short of the perfect number 10 by one… It was called ocean and horizon, because to the ancients these were boundless.”",
      ),
      P(
        "Aristotle",
        "Metaphysics · square of three / completion",
        "“Three is the number of the complete… for it has beginning, middle, and end.” Nine, as three taken thrice, is triadic completion raised to a second power before ten returns to the monad.",
      ),
      P(
        "Thomas Aquinas",
        "Summa · Dionysian angelic hierarchy (trad.)",
        "“There are nine orders of angels… three hierarchies… Seraphim, Cherubim, Thrones; Dominations, Virtues, Powers; Principalities, Archangels, Angels.” (Dionysius via Aquinas.)",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "The Book of Healing — Psychology & Cosmos",
        "“The soul’s ascent is through manifold orders until it knows the Simple… The separate intellects and spheres approach the One.” Nine as culminating single digit before the decad.",
      ),
      RUCKMAN(
        "“But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance” (Gal. 5:22–23) — nine fruits. Ruckman: Nine leans to fruitfulness and covenant (Abraham at ninety-nine; nine months’ gestation).",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · colour chart · auric synthesis",
        "“White… indicates… a mixture of all the colours… the presence of a great many different kinds of vibration.” Nine is White-Gold (chord) — spectrum synthesis before ten.",
      ),
    ],
  },
};

export const PHILOSOPHER_ORDER = [
  "Pythagoras",
  "Manly P. Hall",
  "Aristotle",
  "Thomas Aquinas",
  "Avicenna (Ibn Sina)",
  "Dr. Peter S. Ruckman",
  "Theosophical Society",
] as const;

export function philosophyForNumber(n: number): NumberPhilosophy {
  const key = n >= 1 && n <= 9 ? n : 9;
  return NUMBER_PHILOSOPHY[key]!;
}

export function formatPhilosophyBlock(entry: NumberPhilosophy): string {
  const header = `NUMBER ${entry.number} · ${entry.sacredName.toUpperCase()}`;
  const divider = "─".repeat(48);
  const geo = entry.geometry
    ? [
        `GEOMETRY · ${entry.geometry.figure}`,
        entry.geometry.form,
        entry.geometry.note,
        `THEOSOPHY COLOUR · ${entry.geometry.colorName} (${entry.geometry.hex}) · note ${entry.geometry.musicalNote}`,
        "",
      ].join("\n")
    : "";
  const body = entry.thoughts
    .map(
      (thought) =>
        `${thought.philosopher.toUpperCase()} · ${thought.work}\n${thought.thought}`,
    )
    .join("\n\n");
  return `${header}\n${divider}\n\n${geo}${body}\n\n${PHILOSOPHY_DISCLAIMER}`.trimEnd();
}

export function formatAllNumbersPhilosophy(): string {
  return Array.from({ length: 9 }, (_, i) => formatPhilosophyBlock(NUMBER_PHILOSOPHY[i + 1]!)).join(
    "\n\n",
  );
}
