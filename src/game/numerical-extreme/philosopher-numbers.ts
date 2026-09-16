/** Sacred-number lore for digits 1–9 across seven lineages (incl. Theosophical colour–form–vibration). */

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

const P = (
  philosopher: string,
  work: string,
  thought: string,
): PhilosopherThought => ({ philosopher, work, thought });

const RUCKMAN = (
  thought: string,
): PhilosopherThought =>
  P(
    "Dr. Peter S. Ruckman",
    "Bible Numerics (1981) · Authorized King James Version",
    thought,
  );

/** Digits 1–9 — Pythagoras, Hall, Aristotle, Aquinas, Avicenna, Ruckman, Theosophical Society. */
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
        "Nicomachus, Introduction to Arithmetic (trad.)",
        "The monad is the source of all numbers and the root of all things — not a number among numbers but the principle of unity, mind, and light. It is odd, stable, and godlike; from it the entire scale unfolds without itself being divided.",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages (1928)",
        "One is the Absolute, the Eternal Parent, the hidden Lord of the universe and the source of all measurement. It is the point from which the line of manifestation proceeds and to which all cycles return.",
      ),
      P(
        "Aristotle",
        "Metaphysics Γ & I",
        "Being and unity are convertible: what is truly one is in some way a being, and what has being participates in unity. The One is not a mere aggregate but a principle that makes a thing the very thing it is.",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologica I, q.11 (On God's Unity)",
        "God is supremely one because He is absolutely simple — no composition of parts, no distinction of essence and existence. Every finite unity participates in that divine oneness as a transcendental property of being.",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "The Book of Healing — Metaphysics VIII",
        "The Necessary Existent is absolutely one: no composition, no partner, no multiplicity in essence. All plurality in the world derives from what is possible-in-itself and must receive unity from the First.",
      ),
      RUCKMAN(
        "One means unity — stability, fixed, absolute. Everywhere in Scripture it is tied to united strength: “Hear, O Israel: The Lord our God is one Lord” (Deut. 6:4) is a plurality united, not a lone unit. From Genesis 1:9 (“one place”) through marriage (“one flesh”) and Paul’s “one body, one Lord, one faith,” One plainly stands for unity.",
      ),
      P(
        "Theosophical Society",
        "Besant & Leadbeater, Thought-Forms (1901) · Blavatsky colour–sound–number",
        "One is the first rate of vibration — prismatic Red (Do). Thought and will strike the mental and astral matter; each vibration builds a form. The monad is the single centre from which every later colour and figure radiates.",
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
        "Theon of Smyrna / Iamblichus (trad.)",
        "The dyad is the first division — the line, matter, and the indefinite. It proceeds from the monad but introduces strife, opposition, and the possibility of distance; it is the mother of multiplicity.",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages",
        "Two is the corridor through which creation passes — the duad as a line between two points. It is the womb of matter, the shadow of the monad, and the symbol of the pairs that make experience possible.",
      ),
      P(
        "Aristotle",
        "Metaphysics & Categories",
        "Knowledge begins with the distinction of contraries and the recognition that one thing is not another. Duality appears in privation and form, potency and act — the structure that lets change and relation exist.",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologica I, q.3–4 (Distinction & Creation)",
        "Creator and creature are two orders of being; evil is privation of good, a two-fold contrast of what is and what ought to be. In Christ, true God and true man meet without confusion — the noblest dyad in theology.",
      ),
      P(
        "Avicenna",
        "The Book of Healing — Metaphysics",
        "Contingent beings exhibit a duality of essence and existence: what a thing is and that it is are not the same except in the Necessary Existent. From the One, the first intelligible multiplicity emerges in intellection.",
      ),
      RUCKMAN(
        "Two implies division. Amos 3:3 — “Can two walk together, except they be agreed?” Adam is divided in Genesis 2; the sun and moon are made “to divide the day from the night” (Gen. 1:16). Israel splits under Rehoboam; the Old Testament is chiefly “the law and the prophets.” One is unity; Two is division.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · How the Vibration Acts",
        "Two is Orange (Re) — the dyad of poles through which life-current (prāṇa) oscillates. Vibration acting between two centres draws the first line; Chladni plates show sand dividing into opposed regions under a single tone.",
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
        "Nicomachus (trad.)",
        "Three is the first true number — the first to have beginning, middle, and end. It is the triad of harmony uniting monad and dyad, the first figure with length, breadth, and depth, and the symbol of completion in process.",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages",
        "Three is the number of manifestation: heaven, man, and earth; past, present, and future; body, soul, and spirit. The triangle is the simplest closed form and the gate through which idea becomes form.",
      ),
      P(
        "Aristotle",
        "Poetics & Nicomachean Ethics",
        "Good action and good story have a threefold structure — beginning, middle, and end. Friendship, virtue, and deliberation often divide into three kinds, revealing a natural triadic order in human affairs.",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologica I, qq.27–43 (Trinity & Creation)",
        "Three divine Persons are one God — a mystery of unity in distinction. The theological virtues are three: faith, hope, and charity; together they orient the soul toward its triune end.",
      ),
      P(
        "Avicenna",
        "De Anima / The Book of Healing — Psychology",
        "The human soul is analyzed in three ascending powers — vegetative, animal, and rational — by which life, motion, and intellect are ordered in one living substance.",
      ),
      RUCKMAN(
        "Two and One is Three — a division brought back into unity. Three is the Godhead in three Persons, man’s body/soul/spirit, and time’s past/present/future. The two Testaments in print need Christ the incarnate Word as the third Testament to complete the Book. No problem is solved until the third side is found; Three represents the Trinity manifested throughout the universe.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · The Form and Its Effect",
        "Three is Yellow (Mi) — the first closed plane of mind-light. A thought-form needs quality (colour), nature (vibration rate), and definition (shape). The triad is the minimum complete form on the mental plane.",
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
        "Nicomachus (trad.)",
        "Four is the tetrad — the square, justice, and the cosmos in fourfold order. It completes the solid by adding a fourth dimension to the triad and grounds the elements in a stable, equal-sided foundation.",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages",
        "Four is the number of foundation: the elements, seasons, cardinal directions, and the square altar of the material world. It represents law, order, and the cube of manifestation.",
      ),
      P(
        "Aristotle",
        "Physics II & Metaphysics I",
        "Explanation requires four causes — material, formal, efficient, and final. The sublunary world is articulated through four elements whose transformations account for coming-to-be and passing-away.",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologica I–II (Cardinal Virtues & Creation)",
        "Four cardinal virtues — prudence, justice, fortitude, temperance — govern human action. Creation unfolds in four days of forming before adornment, and the Gospels are fourfold witness to one truth.",
      ),
      P(
        "Avicenna",
        "The Book of Healing — Natural Philosophy",
        "Nature is known through four primary qualities — hot, cold, dry, moist — composing the elements. Cosmic order repeats in fourfold schemes of direction, season, and elemental mixture.",
      ),
      RUCKMAN(
        "Four is far more elusive than Three. Christian numerologists call it the “earth number” (four corners, four winds, four seasons — though Genesis 8 lists six seasons). Ezekiel 1 repeats “four” more than any chapter: four living creatures with faces of man, ox, eagle, and lion — kings of creation. Ruckman calls Four still a mystery: possibly earth or creation, but the evidence is not conclusive.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · Meaning of the Colours",
        "Four is Green (Fa) — adaptability and sympathy in the colour key. Square and tetrahedron mark stable earth-form; green thought-forms seek to fit their vibration to surrounding lives.",
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
        "Nicomachus / pentagram tradition",
        "Five marries two and three — the pentad of life and health. The five-pointed star was the sign of recognition among Pythagoreans, symbolizing the microcosm and the fivefold harmony of soul and body.",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages",
        "Five is the human number: five extremities, five senses, the pentagram as man measure. It is the quintessence rising above the four elements — the bridge between material and spiritual man.",
      ),
      P(
        "Aristotle",
        "De Anima II",
        "We know the world through five senses — sight, hearing, smell, taste, touch — each a distinct path by which form enters the soul. Sensible qualities are ordered so that no further sense is needed for natural knowledge.",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologica III (Passion & Sacraments)",
        "Christ's five wounds are a focal symbol of redemption in medieval devotion Aquinas expounds. Five wounds, five joys, and five sorrowful mysteries structure liturgical meditation on the Incarnation.",
      ),
      P(
        "Avicenna",
        "Canon of Medicine & De Anima",
        "Five external senses gather species from the world; internal faculties — common sense, imagination, estimation, memory, and cogitation — refine them inwardly so the soul can judge and remember.",
      ),
      RUCKMAN(
        "Five is death — not grace. Scholars tie five to grace because of Christ’s five wounds, but Ruckman argues five means death everywhere else: the brazen altar was five cubits by five (a type of hell), the first man to die appears in Genesis 5:5, victims are smitten in the fifth rib, life first appears on the fifth day (4,000 years before Christ’s death), and Christ’s five wounds are the death of a man. Five is death.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · Devotion plates",
        "Five is Blue (Sol). Clear blue marks devotion; the five-pointed star is man’s measure. Higher vibration lifts the form upward — as in the ‘Upward Rush of Devotion’ plate — geometry sharpened by purity of tone.",
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
        "Nicomachus (trad.)",
        "Six is the first perfect number — equal to the sum of its parts (1+2+3). It is marriage, creation, and the hexad of balance; the six directions and the harmony of opposites resolved in form.",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages",
        "Six is the number of the solar hero and the interlaced triangle — Solomon's seal, the union of fire and water triangles. It marks completion of a cycle of labor before the seventh rest.",
      ),
      P(
        "Aristotle",
        "Metaphysics & Euclid's tradition",
        "Six as composite reveals proportion and symmetry in arithmetic — the first number perfect in the Pythagorean sense, showing how parts relate to whole in measurable beauty.",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologica I, q.74 (The Six Days)",
        "God's work of distinction and adornment is narrated in six days before the divine rest. Six ages of the world structure salvation history from Adam to the fullness of time.",
      ),
      P(
        "Avicenna",
        "The Book of Healing — Cosmology",
        "The sublunary realm is articulated through six directions and the mixtures that place bodies in place and time. Sixfold schemes appear in the ordering of faculties that prepare the soul for intellection.",
      ),
      RUCKMAN(
        "Six is the number of man and of this present age. Adam is made on the sixth day; Noah enters the ark at 600; 666 marks the Antichrist superman (Rev. 13:18). “Six hundred men” recurs throughout Scripture. This age is characterized by six before the seventh-day Sabbath rest of the Millennium — look for 777, not 666.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · Music forms / Blavatsky septenary",
        "Six is Indigo (La) — deep spiritual intellect. Hexagram marries two triangles; musical thought-forms (Mendelssohn, Gounod) show how complex vibration weaves interlaced colour-geometry in living matter.",
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
        "Nicomachus / Iamblichus (trad.)",
        "Seven is the venerable heptad — Athena's number, the vowels of the cosmos, and the rhythm of life. It neither generates nor is generated among the first decad in the same way as composites; it stands as virgin and complete.",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages",
        "Seven is the sacred number of initiation: seven planets, seven seals, seven steps of the pyramid. It marks the soul's journey through the planetary spheres toward the hidden eighth.",
      ),
      P(
        "Aristotle",
        "Politics & Poetics (contextual)",
        "Seven appears in classical lists of wonder — seven wise men, seven-fold observation — as a natural limit of memorable completeness. The good life requires leisure and repeated reflection, not endless multiplicity.",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologica I–II (Gifts of the Spirit)",
        "Seven gifts of the Holy Spirit perfect the virtues; seven sacraments channel grace; seven deadly sins name the capital disorders of the will. Seven is the fullness of spiritual discipline in the Church's pedagogy.",
      ),
      P(
        "Avicenna",
        "Canon of Medicine & Geography",
        "Seven climes divide the inhabited earth by latitude and climate. Seven planetary spheres in the inherited cosmology order time, temperament, and the ascending powers of the soul toward the intellectual heavens.",
      ),
      RUCKMAN(
        "Seven is plainly the number of completeness — no number is more complete. God finishes creation on the seventh day; Leviticus 23 and 25 “seven” everything (weeks, years, jubilee). Revelation closes with seven churches, seals, trumpets, and vials. Nature works by sevens: seven body members, seven colors, seven musical notes — “seven winds it up.” God counts by sevens.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · Sevenfold manifestation · Blavatsky 1→7 spectrum",
        "Seven is Violet (Si) — highest prismatic ray. Theosophy counts by sevens: principles, planes, and colours–sounds–numbers from Red/Do to Violet/Si. Seven completes the vibrational octave of form before a new cycle.",
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
        "Nicomachus (trad.)",
        "Eight is the first cube (2³) — the ogdad of justice and solid harmony. It completes a double quaternary and represents the first three-dimensional power of the dyad, stability raised to a new order.",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages",
        "Eight is the number of regeneration through structure — the octagon of baptism, the cube unfolded. It is the octave, the new beginning beyond the sevenfold planetary cycle.",
      ),
      P(
        "Aristotle",
        "Metaphysics & mathematics",
        "Eight as the cube of two shows how multiplication generates new kinds of quantity. In practical wisdom, repeated habituation — many acts forming one stable hexis — mirrors how powers accumulate into character.",
      ),
      P(
        "Thomas Aquinas",
        "Commentary on the Beatitudes & Easter typology",
        "Eight beatitudes enumerate the joys of the Kingdom; the eighth day typifies resurrection and the new creation beyond the seven-day week. Baptismal fonts of eight sides symbolize entry into that new life.",
      ),
      P(
        "Avicenna",
        "The Book of Healing — Metaphysics of Emanation",
        "In the inherited scheme of celestial intellects and spheres, eight marks the approach to the highest orders before the Necessary Existent. Solid bodies and cubic measures ground astronomy in tangible proportion.",
      ),
      RUCKMAN(
        "Once Seven completes a series, Eight begins something new. Noah was the eighth person — eight souls in the ark repopulating a new earth (1 Pet. 3:20). Circumcision on the eighth day typifies the new creature; David was Jesse’s eighth son, a new type of Christ. Eight and its multiples mark a fresh beginning after completion.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · octave beyond the spectrum",
        "Eight is Rose (Do′) — the octave return after violet. A new series of vibration begins; rose in the colour key marks pure affection. The cube/octagon is regenerated solid form — a fresh geometry after the sevenfold close.",
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
        "Nicomachus (trad.)",
        "Nine is the ennead — the horizon, the limit of the single-digit cycle before the decad returns to unity. It is boundless in a subtle sense: multiplied, it reproduces itself in digital root, mirroring cosmic completion.",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages",
        "Nine is the number of initiation completed — the ennead, the nine gates, the fullness of single-digit being before the return to one at ten. It is the womb of the zero and the sum of all prior digits.",
      ),
      P(
        "Aristotle",
        "Metaphysics & arithmetic tradition",
        "Nine is the square of three — triadic perfection raised to a second power. Completion in form often arrives when a process has cycled through its proper parts and stands ready for a higher unity.",
      ),
      P(
        "Thomas Aquinas",
        "Summa & angelic hierarchy (trad.)",
        "Nine choirs of angels order the invisible government of the world in Dionysian tradition Aquinas adapts. Nine fruits and beatitudes appear in variant lists marking the fullness of charity before the perfection of ten.",
      ),
      P(
        "Avicenna",
        "The Book of Healing — Psychology & Cosmos",
        "Nine marks the culminating single digit before the decad; intellectual emanation schemes count spheres and intellects approaching the One. The soul's ascent traverses manifold orders until it knows the Simple.",
      ),
      RUCKMAN(
        "Nine is harder to pin down but seems tied to fruitfulness and covenants: nine fruits of the Spirit (Gal. 5:22–23), nine gifts (1 Cor. 12), Abraham at ninety-nine when God’s covenant makes him fruitful though “dead” (Rom. 4), and nine months’ gestation. It is three times three and one short of Gentile ten; Ruckman’s primary reading is spiritual fruit-bearing, though he notes the evidence is not fully settled.",
      ),
      P(
        "Theosophical Society",
        "Thought-Forms · colour chart · auric synthesis",
        "Nine is White-Gold (chord) — synthesis of the spectrum before ten. All vibration rates coexist in the auric egg; nine folds fruitfulness of form when every colour has sounded. The enneagon is the last single-digit figure.",
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
  return `${header}\n${divider}\n\n${geo}${body}`.trimEnd();
}

export function formatAllNumbersPhilosophy(): string {
  return Array.from({ length: 9 }, (_, i) => formatPhilosophyBlock(NUMBER_PHILOSOPHY[i + 1]!)).join(
    "\n\n",
  );
}
