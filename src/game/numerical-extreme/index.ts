/**
 * Numerical Analysis Toolbox math engine (TypeScript port).
 *
 * Naming: camelCase throughout. Python backends used snake_case; UI should consume
 * these TypeScript types / keys (e.g. absoluteError, simpsonOneThird).
 */

export {
  ExpressionError,
  normalizeExpression,
  vectorizeExpression,
  compileScalar,
  compileNamed,
  compileExpression,
} from "./expr";
export type { CompiledExpression } from "./expr";

export {
  finiteOrNone,
  listWithNulls,
  linspace,
  centralDerivative,
  adjacentSignChanges,
  deduplicate,
  brentLike,
  rootsFromGrid,
  bisection,
} from "./common";

export { compositeIntegration } from "./integration";
export { adaptiveSimpson } from "./integration";
export { interpolate } from "./interpolation";
export { analyzeFunction } from "./function-analysis";
export { analyzeVibration } from "./vibrations";
export { solveNonlinearSystem } from "./nonlinear";

export {
  generateEskowMatrix,
  modifiedCholeskyEskow,
  solveModifiedCholesky,
  runModifiedCholesky,
  talbotParameters,
  talbotSum,
  runTalbot,
  runDerpar,
} from "./algorithms";

export {
  compileComplexLaplace,
  isDefaultSinTransform,
  runAcm618,
  runAcm618Suite,
  runAcm619,
  acm619Dlainv,
  runAcm740,
  runAcm740Suite,
  acm740Matrix,
} from "./acm-sparse";
export type {
  Complex,
  ComplexLaplaceFn,
  Acm618OrderingMode,
  Acm618Result,
  Acm619Point,
  Acm619Result,
  Acm740MatrixKind,
  Acm740Row,
  Acm740Result,
} from "./acm-sparse";

export type * from "./types";

export {
  buildFunctionReport,
  buildVibrationReport,
  buildMethodFormulation,
  FUNCTION_PRESETS,
  COMPOSITE_FORMULAS,
} from "./v15-report";

export { TOOLBOX_REFERENCES } from "./references";
export type { ReferenceEntry, ReferenceSection } from "./references";

export {
  bezierCoefficients,
  evaluateBezierHorner,
  buildBezierSegment,
  formatBezierLog,
} from "./bezier";
export type { Point2, BezierSegment } from "./bezier";

export {
  symbolicIntegrate,
  symbolicDifferentiate,
  parseSymbolic,
  symPretty,
  SYMBOLIC_PRESETS,
} from "./symbolic";
export type { SymNode, SymbolicIntegralResult, SymbolicDerivativeResult } from "./symbolic";

export { runGeneticRootFinder } from "./genetic";
export type { GeneticRootParams, GeneticRootResult } from "./genetic";

export {
  runSteadyPlate,
  runTransientPlate,
  runStraightFin,
  runStandardAtmosphere,
  runIsentropicNozzle,
  runSparseLab,
  runLbfgsbDemo,
  runAdolcDemo,
  HEAT_ACM_LABS,
} from "./heat-aerospace";
export type {
  HeatAcmLabId,
  SparseMethod,
  SteadyPlateResult,
  TransientPlateResult,
  FinResult,
  AtmosphereResult,
  NozzleResult,
  SparseLabResult,
} from "./heat-aerospace";

export {
  wordToNumerology,
  formatNumerologyReport,
  digitalRoot,
  bruteForceJohnsonExpand,
  lookupJohnsonInline,
  NUMBER_PHILOSOPHY,
  PHILOSOPHER_ORDER,
  PHILOSOPHY_DISCLAIMER,
  philosophyForNumber,
  formatPhilosophyBlock,
  formatAllNumbersPhilosophy,
} from "./numerology";
export { loadJohnsonResources, lookupJohnsonFull, lookupJohnsonEditions, enrichJohnsonSense } from "./johnson-leme";
export type { JohnsonResources, JohnsonEditions } from "./johnson-leme";
export type {
  NumerologyResult,
  NumerologyLetter,
  JohnsonSense,
  JohnsonExpansion,
  TarotCard,
  NumberPhilosophy,
  PhilosopherThought,
  SacredGeometry,
} from "./numerology";
export {
  THOUGHT_FORM_PLATES,
  THOUGHT_FORM_FIGURES,
  COLOUR_KEY,
  COLOUR_KEY_GRID,
  COLOUR_KEY_GENERAL_SOURCE,
  COLOUR_COMBINATIONS,
  THOUGHT_FORM_THREE_LAWS,
  THOUGHT_FORM_DOUBLE_EFFECT,
  THEOSOPHY_RAYS,
  PRIMARY_FIGURE_BY_DIGIT,
  MASTER_NUMBERS,
  thoughtFormBundleForNumber,
  colourKeyCellsForNumber,
  baseDigitFromPath,
  isMasterNumber,
  type ThoughtFormPlate,
  type ThoughtFormFigure,
  type ColourKeyCell,
  type ColourKeyEntry,
  type ColourCombination,
  type PathThoughtFormBundle,
  type TheosophyRay,
} from "./thought-forms";
export { searchSecretDoctrine, loadSecretDoctrineManifest } from "./secret-doctrine";
export type { SecretDoctrinePassage, SecretDoctrineQuery } from "./secret-doctrine";
export { searchGreekMyths, loadGreekMythsManifest } from "./greek-myths";
export type { GreekMythPassage } from "./greek-myths";
export { getRuckmanVersesForNumber } from "./ruckman-kjv";
export type { RuckmanVerse } from "./ruckman-kjv";

export {
  BABEL_ALPHABET,
  BABEL_PAGE_CHARS,
  BABEL_ARTWORK,
  OFFICIAL_BABEL,
  toBabelAlphabet,
  locatePageWithHighlights,
  collectBabelSecrets,
  searchBabelSecrets,
  generateBabelBooks,
  buildSynthesisQuery,
  formatBabelFindReport,
  babelPathMetrics,
  isAnagramOf,
} from "./babel-pathfinder";
export type {
  BabelSourceKind,
  BabelHighlightToken,
  BabelSecretQuery,
  BabelLocation,
  BabelPage,
  BabelSecretFind,
  BabelLibraryReport,
  BabelArtwork,
  BabelBookPage,
  BabelBookInfo,
  BabelGeneratedBook,
} from "./babel-pathfinder";

export {
  locateBabelImages,
  composeGrimoireWithBabelText,
  toBabelCaption,
  downloadDataUrl,
  RETRO_GRIMOIRE_SRC,
} from "./babel-images";
export type { BabelImageStyle, BabelLocatedImage } from "./babel-images";

/** Format a number for display (null-safe). */
export function formatNumber(
  value: number | null | undefined,
  digits = 8,
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }
  if (Math.abs(value) !== 0 && (Math.abs(value) < 1e-4 || Math.abs(value) >= 1e6)) {
    return value.toExponential(Math.max(1, digits - 1));
  }
  return Number(value.toPrecision(digits)).toString();
}

/** Parse a comma/space/semicolon-separated list of numbers. */
export function parseNumberList(raw: string): number[] {
  const parts = raw
    .split(/[,;\s]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) {
    throw new Error("Expected at least one number.");
  }
  const values = parts.map((p) => {
    const n = Number(p);
    if (!Number.isFinite(n)) {
      throw new Error(`Invalid number '${p}'.`);
    }
    return n;
  });
  return values;
}

/** Trigger a JSON download in the browser. No-op outside DOM. */
export function downloadJson(filename: string, data: unknown): void {
  if (typeof document === "undefined") {
    throw new Error("downloadJson requires a browser document.");
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".json") ? filename : `${filename}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
