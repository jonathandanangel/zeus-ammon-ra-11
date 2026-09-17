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
        "The Metaphysics of The Healing VIII.4–5 (Marmura)",
        "“The Necessary Existent is one… There is no cause for His existence… He is one in every respect, not divisible—neither in parts of quantity, nor in parts of definition… There is no quiddity for Him other than His individual existence.”",
      ),
      RUCKMAN(
        "“One means unity—stability, fixed, absolute. Everywhere in Scripture it is tied to united strength: ‘Hear, O Israel: The LORD our God is one LORD’ (Deut. 6:4) is a plurality united, not a lone unit. From Genesis 1:9 (‘one place’) through marriage (‘one flesh’) and Paul’s ‘one body, one Lord, one faith,’ One plainly stands for unity.” — Bible Numerics (1981)",
      ),
      P(
        "Theosophical Society",
        "Blavatsky, The Secret Doctrine I · Power of Numbers · Thought-Forms",
        "“Number is, as the great writer thought, an Entity, and, at the same time, a Breath emanating from what he called God and what we call the ALL… ‘where naught obtains its form but through the Deity, which is an effect of Number.’” (SD I.) Thought-Forms: each definite thought yields “a radiating vibration and a floating form.” Red (Do).",
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
        "The Metaphysics of The Healing I.5–6 (Marmura)",
        "“The quiddity of every contingent thing is other than its existence… Existence is something occurring to the quiddity… Only in the Necessary Existent are essence and existence identical.”",
      ),
      RUCKMAN(
        "“Two implies division. Amos 3:3—‘Can two walk together, except they be agreed?’ Adam is divided in Genesis 2; the sun and moon are made ‘to divide the day from the night’ (Gen. 1:16). Israel splits under Rehoboam; the Old Testament is chiefly ‘the law and the prophets.’ One is unity; Two is division.” — Bible Numerics (1981)",
      ),
      P(
        "Theosophical Society",
        "Blavatsky, Secret Doctrine · Monad and Duad · Thought-Forms",
        "Porphyry (cited in SD): the Monad is “that most simple Being, the cause of all unity and the measure of all things.” “But the Duad, although the origin of Evil, or Matter… is still Substance during Manvantara.” (SD.) Thought-Forms: vibrations “set up corresponding vibrations in the matter of the mental body.” Orange (Re).",
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
        "De Anima / The Book of Healing — Psychology (Rahman)",
        "“The soul has three powers: the vegetative, by which it nourishes and grows; the animal, by which it perceives and moves; and the rational, by which it knows intelligibles and distinguishes truth from falsehood.”",
      ),
      RUCKMAN(
        "“Two and One is Three—a division brought back into unity. Three is the Godhead in three Persons, man’s body/soul/spirit, and time’s past/present/future. The two Testaments in print need Christ the incarnate Word as the third Testament to complete the Book. No problem is solved until the third side is found; Three represents the Trinity manifested throughout the universe.” — Bible Numerics (1981)",
      ),
      P(
        "Theosophical Society",
        "Blavatsky, Secret Doctrine · triangles · Thought-Forms",
        "“Together of pure Spirit and Matter, of the Arupa and the Rupa, of which the Triangles are a Symbol. This double Triangle is a sign of Vishnu, as it is Solomon’s seal…” (SD I.) Thought-Forms: “(1) Quality of thought determines colour. (2) Nature of thought determines form. (3) Definiteness of thought determines clearness of outline.” Yellow (Mi).",
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
        "Theon of Smyrna · Pythagorean oath (Hall / Theon)",
        "“By Him who gave to our soul the tetractys, which hath the fountain and root of ever-springing nature.” The tetractys (1+2+3+4=10) is the oath-figure of the school and the fountain of harmonic ratios 4:3, 3:2, 2:1.",
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
        "Summa Theologiae I–II, q.61 a.2 (cardinal virtues)",
        "“The four cardinal virtues… prudence, justice, fortitude, and temperance… These four are called cardinal, as being the hinges of the moral life… All the other moral virtues are in some way reduced to these.”",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "Canon of Medicine I · On the elements (Gruner / traditional)",
        "“The elements are four: fire, air, water, and earth… Their primary qualities are heat, cold, moisture, and dryness… From their mixture and balance arise the temperaments of bodies and the conditions of health and disease.”",
      ),
      RUCKMAN(
        "“Four is far more elusive than Three. Christian numerologists call it the ‘earth number’ (four corners, four winds, four seasons—though Genesis 8 lists six seasons). Ezekiel 1 repeats ‘four’ more than any chapter: four living creatures with faces of man, ox, eagle, and lion—kings of creation. Four is still a mystery: possibly earth or creation, but the evidence is not conclusive.” — Bible Numerics (1981)",
      ),
      P(
        "Theosophical Society",
        "Plato, Timaeus · Blavatsky SD · Thought-Forms",
        "Timaeus: “the creation took up the whole of each of the four elements; for the Creator compounded the world out of all the fire and all the water and all the air and all the earth.” SD: Fohat’s “four winged wheels at each corner… for the four holy ones.” Thought-Forms: “Green… adaptability… sympathy.” Green (Fa).",
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
        "De Anima · external & internal senses",
        "“The external senses are five: sight, hearing, smell, taste, and touch… Through them the soul receives the forms of sensibles without their matter… The internal faculties then retain, compose, and judge what the senses deliver.”",
      ),
      RUCKMAN(
        "“Five is death—not grace. Scholars tie five to grace because of Christ’s five wounds, but five means death everywhere else: the brazen altar was five cubits by five (a type of hell), the first man to die appears in Genesis 5:5, victims are smitten in the fifth rib, life first appears on the fifth day (4,000 years before Christ’s death), and Christ’s five wounds are the death of a man. Five is death.” — Bible Numerics (1981)",
      ),
      P(
        "Theosophical Society",
        "Blavatsky, Secret Doctrine · five strides · Thought-Forms",
        "“From a Cosmic point of view, Fohat taking ‘five strides’ refers here to the five upper planes of Consciousness and Being, the sixth and the seventh (counting downwards) being the astral and the terrestrial…” (SD I.) Thought-Forms: “Blue… indicates religious feeling… Light blue… devotion to a noble ideal.” Blue (Sol).",
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
        "Euclid, Elements VII Def. 22 (Heath) · Nicomachus I.16",
        "Euclid: “A perfect number is that which is equal to its own parts.” Nicomachus: “Such numbers are 6 and 28; for 6 has the factors… 3, 2, and 1… and these added together make 6… only one is found among the units, 6.”",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologiae I, q.74 a.1 (The six days)",
        "“Thus, then, the perfection of the Divine works corresponds to the perfection of the number six, which is the sum of its aliquot parts, one, two, three; since one day is assigned to the forming of spiritual creatures, two to that of corporeal creatures, and three to the work of adornment.”",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "The Book of Healing — Physics / Place (McGinnis)",
        "“Every body is in a place… Place is the innermost surface of the containing body that is at rest… Directions are six: up and down, right and left, before and behind—by which bodies are ordered in the world of generation and corruption.”",
      ),
      RUCKMAN(
        "“Six is the number of man and of this present age. Adam is made on the sixth day; Noah enters the ark at 600; 666 marks the Antichrist superman (Rev. 13:18). ‘Six hundred men’ recurs throughout Scripture. This age is characterized by six before the seventh-day Sabbath rest of the Millennium—look for 777, not 666.” — Bible Numerics (1981)",
      ),
      P(
        "Theosophical Society",
        "Blavatsky, Secret Doctrine · six to the seventh · Thought-Forms",
        "“FOHAT TRACES SPIRAL LINES TO UNITE THE SIX TO THE SEVENTH — THE CROWN…” “This double Triangle is a sign of Vishnu, as it is Solomon’s seal, and the Sri-Antara of the Brahmins.” (SD I.) Thought-Forms: “Indigo… the power of the higher mind.” Indigo (La).",
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
        "Plato, Timaeus · Aristotle’s inheritance of heptadic completeness",
        "Timaeus (on cosmic time): “the perfect number of time fulfils the perfect year when all the eight revolutions… attain their completion at the same time.” Classical lists (seven sages, seven wonders) treat seven as a limit of memorable completeness Aristotle’s world inherits.",
      ),
      P(
        "Thomas Aquinas",
        "Summa Theologiae I–II, q.68 (gifts of the Spirit)",
        "“The gifts of the Holy Ghost are seven… wisdom, understanding, counsel, fortitude, knowledge, piety, and fear of the Lord… They are enumerated by Isaiah (11:2–3).”",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "Canon of Medicine & Geography of the climes",
        "“The inhabited quarter of the earth is divided into seven climes according to latitude and the inclination of the sun… Temperament, disease, and the length of day follow the clime.” Seven planetary spheres order the inherited heavens.",
      ),
      RUCKMAN(
        "“Seven is plainly the number of completeness—no number is more complete. God finishes creation on the seventh day; Leviticus 23 and 25 ‘seven’ everything (weeks, years, jubilee). Revelation closes with seven churches, seals, trumpets, and vials. Nature works by sevens: seven body members, seven colors, seven musical notes—‘seven winds it up.’ God counts by sevens.” — Bible Numerics (1981)",
      ),
      P(
        "Theosophical Society",
        "Blavatsky, Secret Doctrine · Mysteries of the Hebdomad · Thought-Forms",
        "“Between the Vedas and the Puranas there is an abyss… like the seventh (atmic) and the first or lowest principle (the physical body) in the Septenary constitution of man.” (SD II.) Hebdomad sections: Tetraktis and heptagon; seven in astronomy and magic. Thought-Forms: “Violet… spirituality… highest of the prismatic colours.” Violet (Si).",
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
        "Nicomachus · even-times even series (D’Ooge)",
        "“As you proceed from unity, as from a root, by the double ratio to infinity… 1, 2, 4, 8, 16, 32, 64…” Eight is 2³ — “the proof of the perfect evenly-even number is that it can be halved and the halves again halved back to unity.”",
      ),
      P(
        "Manly P. Hall",
        "The Secret Teachings of All Ages · Pythagorean Mathematics",
        "“The ogdoad—8—was sacred because it was the number of the first cube, which form had eight corners, and was the only evenly-even number under 10 (1-2-4-8-4-2-1)… It was called the little holy number.”",
      ),
      P(
        "Aristotle",
        "Plato, Timaeus · means in cube and square · Aristotle Met. Δ",
        "Timaeus: “whenever in any three numbers, whether cube or square, there is a mean, which is to the last term what the first term is to it… they will all of them of necessity… be the same…” Eight as the first cube (2³) grounds solid quantity.",
      ),
      P(
        "Thomas Aquinas",
        "Commentary on Matthew / Beatitudes tradition",
        "“Blessed are the poor in spirit… Blessed are they that mourn… Blessed are the meek…” Eight Beatitudes (Matt. 5:3–10) enumerate the joys of the Kingdom; the eighth day typifies resurrection.",
      ),
      P(
        "Avicenna (Ibn Sina)",
        "The Metaphysics of The Healing IX–X · emanation (Marmura)",
        "“From the First, inasmuch as He intellects Himself, there proceeds a first intelligence… and from that, another, and so through the order of separate intellects and the celestial spheres, until the Active Intellect that governs the world of generation and corruption.”",
      ),
      RUCKMAN(
        "“Once Seven completes a series, Eight begins something new. Noah was the eighth person—eight souls in the ark repopulating a new earth (1 Pet. 3:20). Circumcision on the eighth day typifies the new creature; David was Jesse’s eighth son, a new type of Christ. Eight and its multiples mark a fresh beginning after completion.” — Bible Numerics (1981)",
      ),
      P(
        "Theosophical Society",
        "Blavatsky, Secret Doctrine · octave after seven · Thought-Forms",
        "SD’s Hebdomad closes the sevenfold chain; a new cycle begins beyond violet. Thought-Forms: “Rose… is the colour of pure affection.” Eight is Rose (Do′) — octave return; cube and octagon as regenerated solid form.",
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
        "The Metaphysics of The Healing · soul’s ascent (Marmura)",
        "“The rational soul, when perfected by the intelligibles, becomes an intellectual world parallel to the existing world… Its felicity is in conjunction with the Active Intellect and in knowing the Necessary Existent as far as human power allows.”",
      ),
      RUCKMAN(
        "“Nine is harder to pin down but seems tied to fruitfulness and covenants: nine fruits of the Spirit (Gal. 5:22–23), nine gifts (1 Cor. 12), Abraham at ninety-nine when God’s covenant makes him fruitful though ‘dead’ (Rom. 4), and nine months’ gestation. It is three times three and one short of Gentile ten; the primary reading is spiritual fruit-bearing, though the evidence is not fully settled.” — Bible Numerics (1981)",
      ),
      P(
        "Theosophical Society",
        "Blavatsky, Secret Doctrine · Unity begets Numbers · Thought-Forms",
        "“God is a Number endowed with motion… As Unity, it begins the Numbers, with which it has nothing in common… The existence of the Number depends on Unity, which, without a single Number, begets them all.” (SD I, Power of Numbers.) Thought-Forms: “White… a mixture of all the colours…” Nine is White-Gold (chord).",
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
  // Masters 11/22/33… ride their base ray (2/4/6…) for sacred-geometry colour.
  let key = Math.abs(Math.trunc(n));
  if (key > 9) {
    const d = key % 9;
    key = d === 0 ? 9 : d;
  }
  if (key < 1) key = 9;
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
