/** Educational disclaimer + published JCTI / TRI-52 correlation refs (no item content). */

export const EXTREME_PUZZLE_WARNING = {
  title: "⚠ WARNING ⚠",
  subtitle: "CAUTION · VERY HARD · ABANDON HOPE",
  lines: [
    "THIS IS NOT A TOY. Fifty-two untimed inductive-reasoning items. Most will fail. Many will quit. The seal did not lie.",
    "Private practice UI only — not a clinical evaluation, not a licensed diagnosis, not an official Cogn-IQ / Cerebrals administration.",
    "Item images and the answer key stay on YOUR machine (gitignored). Do not redistribute copyrighted TRI / JCTI materials.",
    "Age-referenced scores are approximate curiosities for self-tracking. Practice effects and fatigue will haunt you.",
    "By continuing you accept personal study inside ZEUS AMMON RA only — never employment, admission, or clinical use.",
  ],
} as const;

export type ExtremePuzzleSourceLink = {
  label: string;
  detail: string;
  href: string;
};

/** Group-level correlations reported for JCTI / TRI-52 style induction measures. */
export const EXTREME_PUZZLE_CORRELATIONS: ExtremePuzzleSourceLink[] = [
  {
    label: "SAT Math Reasoning",
    detail: "r ≈ .84 (N = 63) · concurrent validity study",
    href: "https://www.cogn-iq.org/articles/validation/jcti-reliability-sat-rist/",
  },
  {
    label: "SAT-Mathematics (self-report sample)",
    detail: "r ≈ .80 (N = 106) · verbal association much weaker",
    href: "https://www.cogn-iq.org/articles/cognition/jcti-sat-factors/",
  },
  {
    label: "RIST Odd Item Out",
    detail: "r ≈ .86 (N = 34) · nonverbal screening subtest",
    href: "https://www.cogn-iq.org/articles/validation/jcti-reliability-sat-rist/",
  },
  {
    label: "Raven’s Advanced Progressive Matrices",
    detail: "corrected r ≈ .93 · convergent fluid-reasoning signature",
    href: "https://www.cogn-iq.org/articles/validation/jcti-convergent-criterion/",
  },
  {
    label: "WAIS Matrix Reasoning",
    detail: "corrected r ≈ .88 · matrix / figural reasoning",
    href: "https://www.cogn-iq.org/articles/validation/jcti-convergent-criterion/",
  },
];

export const EXTREME_PUZZLE_SOURCES: ExtremePuzzleSourceLink[] = [
  {
    label: "JCTI Technical Manual",
    detail: "Methods & evidence · Cogn-IQ",
    href: "https://www.cogn-iq.org/methods/jcti-manual/",
  },
  {
    label: "Reliability & concurrent validity (SAT / RIST)",
    detail: "Jouve · Cogn-IQ Research Papers",
    href: "https://www.cogn-iq.org/articles/validation/jcti-reliability-sat-rist/",
  },
  {
    label: "Convergent & criterion validity",
    detail: "Fluid-reasoning signature across ability / academic tests",
    href: "https://www.cogn-iq.org/articles/validation/jcti-convergent-criterion/",
  },
  {
    label: "Inductive reasoning & SAT factors",
    detail: "Strong SAT-M link · little independent SAT-V association",
    href: "https://www.cogn-iq.org/articles/cognition/jcti-sat-factors/",
  },
  {
    label: "Archived TRI52 criterion note (web archive)",
    detail: "Historical Cerebrals TRI52 CRV PDF",
    href: "https://web.archive.org/web/20100215201915/http://cerebrals.com/tests/tri/pdf/TRI52%20CRV.pdf",
  },
];
