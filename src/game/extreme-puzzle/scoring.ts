/**
 * TRI/JCTI age-referenced score norms (raw 0–52).
 * Columns match the TRI/JCTI table the player provided:
 * 6:0–32:11 · 33:0–42:11 · 43:0–47:11 · 48:0–52:11 · 53:0–57:11 · 58:0–62:11 · 63:0+
 */

export const EXTREME_PUZZLE_ITEM_COUNT = 52;

export const AGE_BANDS = [
  { id: "6-32", label: "6:0–32:11", minMonths: 6 * 12, maxMonths: 32 * 12 + 11 },
  { id: "33-42", label: "33:0–42:11", minMonths: 33 * 12, maxMonths: 42 * 12 + 11 },
  { id: "43-47", label: "43:0–47:11", minMonths: 43 * 12, maxMonths: 47 * 12 + 11 },
  { id: "48-52", label: "48:0–52:11", minMonths: 48 * 12, maxMonths: 52 * 12 + 11 },
  { id: "53-57", label: "53:0–57:11", minMonths: 53 * 12, maxMonths: 57 * 12 + 11 },
  { id: "58-62", label: "58:0–62:11", minMonths: 58 * 12, maxMonths: 62 * 12 + 11 },
  { id: "63+", label: "63:0+", minMonths: 63 * 12, maxMonths: 200 * 12 },
] as const;

/** row = raw score 0..52, cols = AGE_BANDS order; null = dash in published table */
export const AGE_REFERENCED_SCORES: Array<Array<number | null>> = [
  [null, null, null, null, null, null, null], // 0
  [null, null, null, null, 6, 19, 53], // 1
  [30, 31, 36, 44, 58, 73, 108],
  [76, 78, 84, 93, 107, 125, 160],
  [119, 121, 128, 138, 154, 173, 209],
  [160, 162, 170, 181, 197, 218, 255],
  [198, 201, 209, 221, 238, 261, 298],
  [234, 237, 246, 259, 276, 301, 338],
  [267, 271, 281, 294, 312, 338, 376],
  [298, 302, 313, 327, 345, 373, 411],
  [327, 332, 343, 358, 376, 406, 444],
  [354, 359, 371, 386, 405, 436, 475],
  [380, 385, 397, 413, 432, 464, 504],
  [403, 408, 421, 438, 457, 490, 530],
  [425, 430, 444, 461, 480, 515, 555],
  [445, 450, 464, 482, 502, 537, 577],
  [463, 469, 483, 501, 522, 558, 598],
  [481, 486, 501, 519, 540, 577, 618],
  [496, 503, 518, 536, 557, 595, 636],
  [511, 517, 533, 552, 573, 611, 652],
  [525, 531, 547, 566, 587, 626, 668],
  [537, 544, 560, 579, 601, 640, 682],
  [549, 556, 572, 592, 613, 654, 695],
  [560, 567, 583, 603, 625, 666, 708],
  [570, 577, 594, 614, 636, 677, 719],
  [580, 587, 604, 624, 646, 688, 730],
  [589, 596, 613, 634, 656, 698, 741],
  [598, 605, 622, 643, 665, 708, 750],
  [606, 613, 631, 652, 674, 717, 760],
  [615, 622, 640, 661, 683, 727, 769],
  [623, 630, 648, 670, 692, 736, 779],
  [631, 638, 657, 678, 701, 745, 788],
  [639, 647, 665, 687, 710, 754, 798],
  [648, 656, 674, 696, 719, 764, 807],
  [657, 665, 683, 705, 728, 774, 817],
  [666, 674, 693, 715, 738, 784, 828],
  [676, 684, 703, 726, 749, 795, 839],
  [686, 694, 714, 737, 760, 807, 851],
  [698, 706, 725, 748, 772, 820, 863],
  [710, 718, 738, 761, 785, 833, 877],
  [723, 731, 751, 775, 799, 847, 892],
  [736, 745, 765, 789, 814, 863, 907],
  [752, 760, 781, 805, 830, 880, 925],
  [768, 777, 798, 823, 847, 898, 943],
  [786, 794, 816, 841, 866, 918, 963],
  [805, 814, 836, 861, 886, 939, 985],
  [825, 834, 857, 883, 908, 962, 1008],
  [847, 857, 880, 907, 932, 987, 1033],
  [871, 881, 904, 932, 958, 1014, 1060],
  [897, 907, 931, 959, 985, 1043, 1089],
  [925, 935, 960, 988, 1015, 1074, 1121],
  [955, 965, 990, 1020, 1047, 1107, 1155],
  [987, 997, 1023, 1053, 1081, 1143, 1191],
];

export function ageToMonths(years: number, months: number): number {
  return Math.max(0, Math.floor(years) * 12 + Math.floor(months));
}

export function ageBandIndex(years: number, months: number): number {
  const total = ageToMonths(years, months);
  // Below published floor → first band; above last → last band
  if (total < AGE_BANDS[0]!.minMonths) return 0;
  for (let i = 0; i < AGE_BANDS.length; i += 1) {
    const b = AGE_BANDS[i]!;
    if (total >= b.minMonths && total <= b.maxMonths) return i;
  }
  return AGE_BANDS.length - 1;
}

export function ageReferencedScore(
  rawScore: number,
  years: number,
  months: number,
): number | null {
  const raw = Math.max(0, Math.min(52, Math.round(rawScore)));
  const col = ageBandIndex(years, months);
  return AGE_REFERENCED_SCORES[raw]?.[col] ?? null;
}

export function sameAnswerSet(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const as = [...a].sort((x, y) => x - y);
  const bs = [...b].sort((x, y) => x - y);
  return as.every((v, i) => v === bs[i]);
}
