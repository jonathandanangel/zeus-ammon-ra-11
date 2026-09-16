/** Credits and literature behind Numerical Extreme / NumericalAnalysisToolbox_V15. */

export type ReferenceEntry = {
  title: string;
  authors: string;
  detail: string;
  venue?: string;
};

export type ReferenceSection = {
  heading: string;
  blurb: string;
  entries: ReferenceEntry[];
};

export const TOOLBOX_REFERENCES: ReferenceSection[] = [
  {
    heading: "ACM Collected Algorithms (CALGO)",
    blurb:
      "Core numerical kernels in the original Octave/MATLAB toolbox were adapted from Transactions on Mathematical Software collected algorithms. The ACM SPARS laboratory (V5) adds Algorithms 618, 619, and 740 alongside the earlier 420–695 roster.",
    entries: [
      {
        title: "Algorithm 420 — HIDE: Hidden-Line Plotting Program",
        authors: "Hugh Williamson",
        detail:
          "Hidden-line removal and surface rendering for technical plots; cited in the V15 header as part of the visualization lineage. Informs plot-inspect markers and multi-axis laboratory layouts (MAIN / ACM SPARS visual panes).",
        venue: "ACM TOMS / CALGO",
      },
      {
        title: "Algorithm 502 — DERPAR: Continuation Method",
        authors: "Milan Kubíček",
        detail:
          "Parameter continuation with Newton correction, GAUSE free-coordinate selection, and Adams–Bashforth prediction (ADAMS/GAUSE loop in V15). Ported to TypeScript as runDerpar in the ALGORITHMS lab with exact α = 1 − x² comparison curves.",
        venue: "ACM TOMS / CALGO",
      },
      {
        title: "Algorithm 618 — DSM / FDJS: Consistent Partitioning & Sparse Jacobian Estimation",
        authors: "Thomas F. Coleman, Burton S. Garbow, Jorge J. Moré",
        detail:
          "Direct Sparse Matrix (DSM) column intersection-graph coloring (smallest-last, incidence-degree, largest-first) plus Finite-Difference Jacobian Sparse (FDJS) grouped forward differences. Neutron-kinetics sparsity driver: N divisible by 3; columns sharing a row cannot share a group. Reports MINGRP/MAXGRP, grouped vs ungrouped evaluations, and relative Frobenius error versus the exact sparse Jacobian. Ported as runAcm618 / runAcm618Suite (N = 300…1200) in the ACM SPARS laboratory from Argonne MINPACK (July 1983).",
        venue: "ACM TOMS, Vol. 10, No. 3, Sept. 1984, pp. 346–347; Argonne National Laboratory, MINPACK Project",
      },
      {
        title: "Algorithm 619 — DLAINV: Durbin Inverse Laplace + Wynn ε-Extrapolation",
        authors: "ACM TOMS authors (CALGO 619); P. Wynn (ε-algorithm, 1956)",
        detail:
          "Durbin formula for numerical Laplace inversion with Wynn’s epsilon table acceleration. V5 / rev 1.4 retains at most 50 partial sums (LIMEXP-style bound) to avoid unbounded dense ε-table rebuilds that freeze GUIs; adds finite-value guards and status codes ier = 3 (scale overflow) / 4 (non-finite F(s)). Default F(s) = 1/(s²+1) compares against sin(t). Ported as acm619Dlainv / runAcm619 with a complex F(s) expression compiler.",
        venue: "ACM TOMS, Vol. 10, No. 3, Sept. 1984, pp. 348–353; Wynn, P. (1956) ε-algorithm",
      },
      {
        title: "Algorithm 652 — HOMPACK: Globally Convergent Homotopy Algorithms",
        authors: "Layne T. Watson, Stephen C. Billups, Alexander P. Morgan",
        detail:
          "Homotopy / continuation framework for globally convergent nonlinear solves; referenced as an inspiration for robust path-following design alongside DERPAR (Alg 502).",
        venue: "ACM TOMS / CALGO",
      },
      {
        title: "Algorithm 677 — C¹ Surface Interpolation (MASUB)",
        authors: "L. Bacchelli Montefusco, Giulio Casciola",
        detail:
          "C¹ surface interpolation package; informs the DIFF / spline and surface-interpolation discussion in the toolbox notes.",
        venue: "ACM TOMS / CALGO",
      },
      {
        title: "Algorithm 681 — INTBIS: Interval Newton / Bisection",
        authors: "R. Baker Kearfott, Manuel Novoa III",
        detail:
          "Interval Newton and bisection for rigorous root enclosure; complements classical IVT/bisection checks in the MAIN analyzer.",
        venue: "ACM TOMS / CALGO",
      },
      {
        title: "Algorithm 682 — Talbot’s Method for Laplace Inversion",
        authors: "A. Murli, M. Rizzardi (implementation); A. Talbot (contour method)",
        detail:
          "Contour quadrature for numerical Laplace transform inversion (talbot_tapar / talbot_tsum demos in ALGORITHMS and MAIN §10). Complements Algorithm 619 (Durbin–Wynn) as an alternate inversion strategy: Talbot deforms a Bromwich contour; DLAINV sums Durbin blocks with ε-extrapolation. Talbot’s original contour deformation underlies the CALGO packaging.",
        venue: "ACM TOMS / CALGO; Talbot, IMA J. Numer. Anal. / related Laplace-inversion literature",
      },
      {
        title: "Algorithm 695 — Modified Cholesky Factorization",
        authors: "Elizabeth Eskow, Robert B. Schnabel",
        detail:
          "Modified Cholesky of the form PᵀAP + E = LLᵀ with Gerschgorin-guided diagonal additions (Eskow–Schnabel phase 1/2). Driver / modchl / mkmat / solve Fortran lineage from TOMS Vol. 17. Distinct from Algorithm 740 incomplete (zero-fill / threshold) factorizations — 695 restores positive-definiteness via diagonal perturbation; 740 approximates A ≈ LLᵀ with controlled fill.",
        venue: "ACM TOMS, Vol. 17, No. 3, Sept. 1991, pp. 306–312",
      },
      {
        title: "Algorithm 740 — Incomplete Cholesky Factorization Methods",
        authors: "Mark T. Jones, Paul E. Plassmann (Jones–Plassmann IC variants; CALGO packaging)",
        detail:
          "Three incomplete Cholesky strategies: STANDARD IC(0) preserving the original lower sparsity; COLUMN- and ROW-oriented Jones/Plassmann structural budgets that retain the largest-magnitude candidates per column budget. Drivers cover banded, arrowhead, 2-D Laplacian, and the original 4×4 failure matrix. Reports return code, lower-half Frobenius residual ‖tril(A−LLᵀ)‖_F, max abs residual, nnz(L), and timing. Ported as runAcm740 / runAcm740Suite in ACM SPARS.",
        venue: "ACM TOMS, Vol. 21, No. 1, March 1995, pp. 18–19",
      },
    ],
  },
  {
    heading: "ACM SPARS laboratory (V5 integration)",
    blurb:
      "ACMsPARSENumericsGUIINTEGRATIONV5 — Octave/MATLAB clean-room translation of Fortran/pseudo-code with one-based pointer semantics retained where practical; sparse matrices replace static work arrays. Integrated into Numerical Extreme as the ACM SPARS tab (2026-09-15, rev 1.4).",
    entries: [
      {
        title: "ACMsPARSENumericsGUIINTEGRATIONV5",
        authors: "Jonathan Angel (Octave GUI laboratory); TypeScript port in ZEUS Numerical Extreme",
        detail:
          "Three-tab laboratory: ACM 618 Sparse Jacobian, ACM 619 Inverse Laplace, ACM 740 Incomplete Cholesky. Revision 1.4 fixes Octave SPY/BAR/IMAGESC output-arity issues, axes-first graphics wrappers, click-to-inspect markers, bounded Wynn tables, DLAINV progress/finite guards (ier 3/4), recursive log normalization, and nested-cell log construction. Integration contract: add-on laboratory without mutating existing V15 callbacks.",
        venue: "NumericalAnalysisToolbox_V15 companion · ZEUS NUMERICAL EXTREME ACM SPARS",
      },
      {
        title: "Coleman–Garbow–Moré consistent partitioning (DSM)",
        authors: "Thomas F. Coleman, Burton S. Garbow, Jorge J. Moré",
        detail:
          "Intersection-graph coloring of sparse Jacobian columns so that a single grouped difference recovers all nonzeros in a color class. Ordering heuristics: smallest-last (SL), incidence-degree (IDO), largest-first (LF); mode “best of three” selects the minimum MAXGRP. Classical reference for cheap sparse Jacobian estimation in large-scale nonlinear optimization / MINPACK-style drivers.",
        venue: "Argonne MINPACK Project; TOMS 1984",
      },
      {
        title: "Wynn ε-algorithm (bounded LIMEXP adaptation)",
        authors: "P. Wynn",
        detail:
          "Nonlinear sequence transformation accelerating slowly convergent series. Original DQEXT stores a condensed table (~52); the V5 port keeps the most recent 50 Durbin partial sums and limits each extrapolation to O(50²), matching LIMEXP ≈ 50 intent and preventing GUI freezes from unbounded dense rebuilds.",
        venue: "Wynn (1956); ACM Algorithm 619 packaging",
      },
      {
        title: "Jones–Plassmann incomplete factorization fill control",
        authors: "Mark T. Jones, Paul E. Plassmann",
        detail:
          "Structural budget equal to the original lower-nonzero count per column; candidate fill is generated then truncated to the largest-magnitude entries (column order or sorted row order). Complements classical IC(0) which never creates fill outside the original pattern.",
        venue: "ACM Algorithm 740; sparse preconditioning literature",
      },
    ],
  },
  {
    heading: "Named classical methods (V15 method roster)",
    blurb:
      "Authors and eponyms listed in the NumericalAnalysisToolbox_V15 footer — Adams–Bashforth through Taylor — that the MAIN / ALGORITHMS / ACM SPARS labs exercise.",
    entries: [
      {
        title: "Adams–Bashforth multistep predictors",
        authors: "John Couch Adams, Francis Bashforth",
        detail:
          "Explicit multistep ODE stepping used as the ADAMS predictor inside DERPAR continuation (orders 1–4 in the V15 / TypeScript port).",
      },
      {
        title: "Bolzano Intermediate Value Theorem & bisection",
        authors: "Bernard Bolzano; classical NA pedagogy (Timothy Sauer)",
        detail:
          "Sign-change bracketing on a grid, then refined bisection — MAIN §3 IVT scan.",
      },
      {
        title: "Newton–Raphson iteration (damped)",
        authors: "Isaac Newton, Joseph Raphson",
        detail:
          "Local quadratic root-finding with residual line-search damping and weighted step tests (MAIN §8, shift-to-zero y = x − c).",
      },
      {
        title: "Secant method",
        authors: "Classical (chord / secant lineage; cf. Newton–Raphson texts)",
        detail:
          "Derivative-free two-point updates over proposed seed pairs and user plot seeds.",
      },
      {
        title: "Mean Value Theorem (derivative & integral forms)",
        authors: "Joseph-Louis Lagrange; Augustin-Louis Cauchy",
        detail:
          "Find c with f′(c) = (f(b)−f(a))/(b−a), and c with f(c) = average value — MAIN §§5–6.",
      },
      {
        title: "Taylor polynomials via finite differences",
        authors: "Brook Taylor; finite-difference NA practice",
        detail:
          "Numeric Taylor coefficients about x = 0 using central / recursive FD (MAIN §7). Related pedagogy to Algorithm 618’s grouped finite-difference Jacobian estimation.",
      },
      {
        title: "Gaussian elimination with pivoting & substitution",
        authors: "Carl Friedrich Gauss; pivoting refinements (Wilkinson et al.)",
        detail:
          "GAUSE free-coordinate selection and forward/back substitution in the DERPAR corrector linear algebra.",
      },
      {
        title: "Gerschgorin circle / bound estimation",
        authors: "Semyon Aranovich Gershgorin",
        detail:
          "Negative Gerschgorin bounds guide Phase-2 diagonal additions in modified Cholesky (Alg 695).",
      },
      {
        title: "QR / Householder orthogonalization (test matrices)",
        authors: "Alston S. Householder; Francis / Gram–Schmidt QR lineage",
        detail:
          "mkmatESK / generateEskowMatrix builds QDQᵀ spectra via QR of random matrices (Householder-style orthonormal factors in the Fortran mkmat notes).",
      },
      {
        title: "Machine epsilon / unit roundoff",
        authors: "Forsythe / Moler numerical computing tradition; IEEE-754 practice",
        detail:
          "mcheps-style ε used for τ₁, τ₂ = ε^(1/3) tolerances in Eskow–Schnabel; d1mach_local analogs in Talbot overflow tests; 5ε|result| floors on Algorithm 619 estimated errors.",
      },
      {
        title: "Brent-style scalar root polishing",
        authors: "Richard P. Brent",
        detail:
          "Hybrid bisection / inverse-quadratic polishing used where V15 called fzero for MVT and average-value locations.",
      },
      {
        title: "Durbin formula for Laplace inversion",
        authors: "F. Durbin (Fourier-series form of the Bromwich integral)",
        detail:
          "Discretized Bromwich inversion underlying Algorithm 619 DLAINV: successive blocks of sine/cosine-weighted F(c+ia) samples, scaled by e^{ct}/(16t) factors, then accelerated by Wynn ε.",
      },
      {
        title: "Forward-difference Jacobian approximation",
        authors: "Classical finite-difference NA; Curtis–Powell–Reid / Coleman–Moré sparse FD lineage",
        detail:
          "Grouped forward differences J[:,G] ≈ (F(x+h·e_G) − F(x))/h with consistency ensuring unique recovery of each structural nonzero — core of Algorithm 618 FDJS.",
      },
    ],
  },
  {
    heading: "Textbooks & classroom NA",
    blurb:
      "Pedagogical structure for IVT scans, bisection, Newton, secant, MVT, Taylor, composite quadrature, sparse linear algebra, and transform methods.",
    entries: [
      {
        title: "Program 3.7 — Freehand Draw Using Bézier Splines",
        authors: "Timothy Sauer (Numerical Analysis)",
        detail:
          "Interactive cubic Bézier freehand drawing: first click places P0; each subsequent group of three clicks places control points P1, P2 and the next knot P3. Coefficients b = 3(P1−P0), c = 3(P2−P1)−b, d = P3−P0−b−c are evaluated with Horner's method on t ∈ [0,1]. Chained segments promote P3 → next P0. Ported as the BEZIER laboratory tab (domain [−1,1]² matching the Octave axes).",
        venue: "Sauer, Numerical Analysis — Program 3.7 (bezierdraw)",
      },
      {
        title: "Numerical Analysis",
        authors: "Timothy Sauer",
        detail:
          "Intermediate Value Theorem bracketing, bisection checks, and classroom-style root-finding workflow mirrored in MAIN sections 3–8. Program 3.7 supplies the BEZIER freehand spline lab.",
        venue: "Pearson / textbook editions",
      },
      {
        title: "Burden & Faires — Numerical Analysis",
        authors: "Richard L. Burden, J. Douglas Faires",
        detail:
          "Standard undergraduate treatment of Newton, secant, interpolation, and composite quadrature parallel to COMPOSITE / DIFF labs.",
      },
      {
        title: "Atkinson — An Introduction to Numerical Analysis",
        authors: "Kendall E. Atkinson",
        detail:
          "Classical theory for approximation, nonlinear equations, and quadrature referenced by the toolbox’s method roster.",
      },
      {
        title: "Golub & Van Loan — Matrix Computations",
        authors: "Gene H. Golub, Charles F. Van Loan",
        detail:
          "Authoritative reference for Cholesky variants, sparse factorization structure, and residual norms used when interpreting Algorithms 695 and 740 outputs.",
        venue: "Johns Hopkins University Press",
      },
      {
        title: "Saad — Iterative Methods for Sparse Linear Systems",
        authors: "Yousef Saad",
        detail:
          "Incomplete factorization preconditioners (IC, ILU) and sparse graph perspectives that contextualize Algorithm 740’s STANDARD / COLUMN / ROW strategies.",
        venue: "SIAM",
      },
      {
        title: "Ortega & Rheinboldt — Iterative Solution of Nonlinear Equations in Several Variables",
        authors: "J. M. Ortega, W. C. Rheinboldt",
        detail:
          "Foundational nonlinear systems text behind Newton–Jacobi METHOD-lab workflows and sparse Jacobian estimation motivation for Algorithm 618.",
      },
    ],
  },
  {
    heading: "Applied mechanics & vibrations",
    blurb: "Single-degree-of-freedom free response and forced steady-state FRF tools.",
    entries: [
      {
        title: "SDOF vibration response & magnification factor",
        authors:
          "Singiresu S. Rao; Daniel J. Inman; William T. Thomson; J. P. Den Hartog (classical FRF / magnification)",
        detail:
          "Underdamped free response x(t) with ωₙ, ζ, ω_d; forced M(r) = X/(F₀/k) and phase φ — Vibrations panel / vibrationCore.",
      },
    ],
  },
  {
    heading: "Nonlinear systems & quadrature labs (V11 Neon)",
    blurb:
      "Method Builder, COMPOSITE, DIFF, and VECTOR overlays from NumericalAnalysisToolbox_V11_Neon_Vectorized_Calculus.",
    entries: [
      {
        title: "Nonlinear Jacobi & inexact Newton–Jacobi",
        authors:
          "Carl Gustav Jacob Jacobi (Jacobi iteration); Newton–Raphson system extensions (Ortega / Rheinboldt lineage)",
        detail:
          "Diagonal nonlinear Jacobi vs inexact Newton with inner Jacobi linear solves (METHOD lab workflow / Jacobian / split / pseudocode tabs).",
      },
      {
        title: "Composite trapezoidal, midpoint, Simpson 1/3 & 3/8",
        authors: "Isaac Newton & Roger Cotes (Newton–Cotes); Thomas Simpson",
        detail:
          "COMPOSITE lab formulas and node tables against a dense reference integral.",
      },
      {
        title: "Newton divided differences, Lagrange, natural cubic splines",
        authors:
          "Isaac Newton (divided differences); Joseph-Louis Lagrange; I. J. Schoenberg (splines)",
        detail:
          "DIFF lab tables, P(x) / L(x) forms, and natural spline segments Sᵢ(t).",
      },
      {
        title: "Barycentric Lagrange evaluation",
        authors: "Jean-Paul Berrut, Lloyd N. Trefethen (modern barycentric form)",
        detail:
          "Stable barycentric weights for Lagrange evaluation in the DIFF lab (avoids naïve Π basis blow-up).",
      },
    ],
  },
  {
    heading: "Evolutionary & global search (V11)",
    blurb:
      "Genetic Algorithm root approximation integrated into NumericalAnalysisToolbox_V11 Run Analysis, now a dedicated GENETIC laboratory tab.",
    entries: [
      {
        title: "Genetic Algorithm root finder (V11 GUI block)",
        authors: "Jonathan Angel (NumericalAnalysisToolbox_V11); Holland / Goldberg GA lineage",
        detail:
          "Population on [a,b], fitness 1/(|f(x)|+ε), roulette selection via cumulative fitness, blend (α) crossover in pairs, Gaussian mutation with rate/step, box projection to bounds. Defaults: popSize=50, generations=100, mutationRate=0.10, mutationStep=0.05. Reports best x, f(x), and |f(x)|. Ported as runGeneticRootFinder with a seeded PRNG for reproducible demos.",
        venue: "NumericalAnalysisToolbox_V11 · GENETIC tab",
      },
      {
        title: "Adaptation in Natural and Artificial Systems",
        authors: "John H. Holland",
        detail:
          "Foundational genetic algorithm framework (selection, crossover, mutation) underlying the V11 root-approximation GA.",
        venue: "MIT Press / University of Michigan Press",
      },
      {
        title: "Genetic Algorithms in Search, Optimization, and Machine Learning",
        authors: "David E. Goldberg",
        detail:
          "Classical GA operators and fitness-proportionate selection referenced by classroom evolutionary-optimization demos.",
        venue: "Addison-Wesley",
      },
    ],
  },
  {
    heading: "Symbolic calculus (Octave symbolic / browser CAS)",
    blurb:
      "Elementary indefinite/definite integration mirroring pkg load symbolic; int(f,x) demos — not a full SymPy/Octave CAS.",
    entries: [
      {
        title: "Octave symbolic package · int(f, x)",
        authors: "GNU Octave Forge symbolic (SymPy backend in Octave); browser elementary port",
        detail:
          "Session-style laboratory: syms x; f = …; integral_f = int(f, x) [or definite limits]. Covers polynomials, sin/cos/exp/log, and tabular integration-by-parts for xⁿ·{sin,cos,exp}. Side panel echoes the Octave script while the engine returns antiderivatives + C or definite values.",
        venue: "SYMBOLIC tab · Octave symbolic / SymPy lineage",
      },
    ],
  },
  {
    heading: "THE VANITY APP · Face++ Detect batch & attractiveness literature",
    blurb:
      "Session-gated Face++ Detect batch (Beauty → IQ-like / ATTR / CAC) ported from TheVanityApp.m. Literature anchors r≈0.78 and r≈0.88 feed the Correlation-Adjusted Composite; the 0.08% NIST FRVT identification floor is used only as an error-budget term (ID task, not Beauty).",
    entries: [
      {
        title: "Face++ Detect API & Beauty attribute",
        authors: "Megvii / Face++",
        detail:
          "Detect endpoint with return_attributes including beauty (male_score, female_score), gender, age, and emotion. Image constraints: JPG/PNG, 48–4096 px, ≤2MB. Browser port: auto-repair, URL-encoded then multipart fallback, US↔CN endpoint fallback, skip-on-failure batching.",
        venue:
          "https://console.faceplusplus.com/documents/5679127 · https://www.faceplusplus.com/beauty/",
      },
      {
        title: "Face++ Common Return Values / errors",
        authors: "Megvii / Face++",
        detail:
          "Shared error_message / request_id / time_used fields used in per-image skip reasons and the FacePP_Batch_Report.txt meta line.",
        venue: "https://console.faceplusplus.com/documents/7078059",
      },
      {
        title: "Facial attractiveness prediction correlations (group-level)",
        authors: "Hindawi CIN 2021; SCUT-FBP; SCUT-FBP5500 literature",
        detail:
          "Group-level prediction reliabilities used as CAC anchors: Hindawi 2021 r≈0.7836; SCUT-FBP CNN up to ~0.82; SCUT-FBP5500 r≈0.78. Fisher-z average → r̄, then r² reliabilities with CV dispersion penalties.",
        venue:
          "https://doi.org/10.1155/2021/4423407 · https://arxiv.org/pdf/1511.02459 · https://jov.arvojournals.org/article.aspx?articleid=2809824",
      },
      {
        title: "NIST FRVT face-identification error floor (0.08%)",
        authors: "NIST FRVT (as summarized in secondary reporting)",
        detail:
          "0.08% identification-task floor combined in quadrature with batch sampling SE for possible overall IQ/ATTR percent error. Explicitly an ID-task floor, not a Beauty-score uncertainty.",
        venue: "https://lab.imedd.org/en/how-accurate-facial-recognition-systems/",
      },
      {
        title: "TheVanityApp.m (MATLAB) → THE VANITY APP (ZEUS)",
        authors: "Jonathan Angel",
        detail:
          "Preferred/Alternate IQ-like baselines (μ=56.4,σ=10.3 / μ=40.9,σ=17.1), THE IQ, ATTR (mean=6, SD=1.25), arithmetic/trimmed/winsorized/Huber ensemble with fairness penalty, CAC meta-ensemble, and FacePP_Batch_Report.txt text page.",
        venue: "Title screen · VANITY APP",
      },
    ],
  },
  {
    heading: "NUMEROLOGY tab · people, books & source texts",
    blurb:
      "Word → digital-root lore (A=1…Z=26, mod 9) shows primary-source quotations for the typed word’s path digit (1–9), plus dictionary / doctrine / verse / myth passages matched to that word. On-panel notice: “The creator does not endorse these views nor LLMs.”",
    entries: [
      {
        title: "Pythagoras · Nicomachus of Gerasa (trad.)",
        authors: "Pythagoras; Nicomachus, Introduction to Arithmetic (D’Ooge); Theon of Smyrna / Euclid Elements VII Def. 22",
        detail:
          "Quoted Nicomachean arithmetic (monad as potential perfect; perfect numbers equal to their parts — 6, 28; even-times-even 1–2–4–8; primes/incomposites) beside sacred geometry for digits 1–9.",
        venue: "NUMEROLOGY · seven traditions panel · philosopher-numbers.ts",
      },
      {
        title: "The Secret Teachings of All Ages (1928)",
        authors: "Manly P. Hall",
        detail:
          "Direct quotations from the Pythagorean Mathematics chapter (monad “Sire of Gods and men,” duad, triad, tetrad/tetractys oath, pentad/pentagram, hexad, heptad “Motherless Virgin,” ogdoad/cube, ennead/horizon) for each path number.",
        venue: "NUMEROLOGY · Manly P. Hall card · sacred-texts.com/eso/sta/",
      },
      {
        title: "Metaphysics · Physics · Poetics · De Anima",
        authors: "Aristotle (Ross / Hardie & Gaye / Butcher / Smith)",
        detail:
          "Quoted lines on being/unity (Met. Γ), contraries (Phys. I), beginning–middle–end (Poetics 7), four causes (Phys. II.3), and the five senses (De Anima II) mapped to path digits.",
        venue: "NUMEROLOGY · Aristotle card",
      },
      {
        title: "Summa Theologiae (I qq.11, 27–43, 73–74; I–II qq.61, 68; III q.54)",
        authors: "Thomas Aquinas (New Advent / Dominican Fathers)",
        detail:
          "Quoted Summa text: “one” as undivided being; Trinity; six days’ perfection as 1+2+3; seventh-day rest; cardinal virtues; gifts of the Spirit; five wounds — tied to digits 1–9.",
        venue: "NUMEROLOGY · Thomas Aquinas card",
      },
      {
        title: "The Metaphysics of The Healing · Canon · De Anima",
        authors: "Avicenna (Ibn Sina) · Marmura / McGinnis / Rahman / Gruner",
        detail:
          "Balancing primary quotes opposite Ruckman: Necessary Existent’s absolute oneness; essence≠existence in contingents; three soul powers; four elements/qualities; five senses; six directions of place; seven climes; emanation of intellects/spheres; soul’s intellectual felicity.",
        venue: "NUMEROLOGY · Avicenna card",
      },
      {
        title: "Bible Numerics (1981)",
        authors: "Dr. Peter S. Ruckman",
        detail:
          "Attributed Bible Numerics readings kept as quotes — including harsh ones (e.g. five = death not grace; brazen altar as type of hell; six = man / Antichrist “superman” / 666 vs 777). Digits: unity, division, Trinity, elusive four, death/five, man/six, completeness/seven, new beginning/eight, fruitfulness/nine. Not endorsed by the creator.",
        venue: "NUMEROLOGY · Ruckman card · public/kjv/ruckman-cited.json",
      },
      {
        title: "King James Version with Apocrypha (1611 text)",
        authors: "Church of England translators (1611); davince.com/bible PDF extract",
        detail:
          "Exact verse text for passages Ruckman cites on the active path number only (e.g. Deut 6:4, Amos 3:3, Gen 5:5, Exod 27:1, Rev 13:18, Gal 5:22–23).",
        venue: "NUMEROLOGY · 1611 KJV verse blocks · npm run build:kjv-ruckman",
      },
      {
        title: "Thought-Forms (1901) · The Secret Doctrine · colour–sound–number",
        authors: "Annie Besant & C. W. Leadbeater; H. P. Blavatsky (Secret Doctrine I–II); Theosophical Society",
        detail:
          "Tradition cards quote Thought-Forms (vibration/form/colour) and Secret Doctrine (Power of Numbers, Monad/Duad, Fohat’s five strides & six-to-seventh, Hebdomad/septenary, Unity begetting Numbers), plus prismatic colour / note and plate imagery. Frontispiece Key to the Meanings of Colours (key-to-meanings-of-colours.png) is the always-on general source for every path digit, word scramble, and colour combination. Separate Secret Doctrine & Greek Myths search panels unchanged.",
        venue: "NUMEROLOGY · Theosophical Society card · public/numerology/thought-forms/key-to-meanings-of-colours.png · public/secret-doctrine/",
      },
      {
        title: "Timaeus · Elements VII Def. 22",
        authors: "Plato (Timaeus); Euclid (Heath)",
        detail:
          "Extra classical sources on tradition cards: Timaeus on four elements, proportional means in cubes/squares, and the perfect year; Euclid’s definition of a perfect number (equal to its own parts) beside Nicomachus on 6 and 28.",
        venue: "NUMEROLOGY · Aristotle / Pythagoras cards (cross-cited)",
      },
      {
        title: "The Secret Doctrine (Cosmogenesis / Anthropogenesis)",
        authors: "H. P. Blavatsky",
        detail:
          "Indexed public-domain PDF passages matched to the typed word (and close stems), ranked for occult / numerical co-occurrence with the path digit (septenary, Fohat, Dzyan, etc.). Left as the primary free-text Blavatsky search — working well.",
        venue: "NUMEROLOGY · Secret Doctrine panel · public/secret-doctrine/ · npm run build:secret-doctrine",
      },
      {
        title: "The Greek Myths (1955, revised 1960)",
        authors: "Robert Graves",
        detail:
          "Indexed passages matched to the typed word via exact forms, anagrams/scrambles (same letter signature), and similar letter-count words that share letters — with PDF page citations. Left unchanged — working well.",
        venue: "NUMEROLOGY · Greek Myths panel · public/greek-myths/",
      },
      {
        title: "A Dictionary of the English Language (1755)",
        authors: "Samuel Johnson; Lexicons of Early Modern English (LEME), University of Toronto (CC BY 4.0)",
        detail:
          "First-edition headword senses for the typed word (letter-bucket lexicon). Optional UCF high-res facsimile scans when a page could be extracted from the local OneDrive zip. Definitions left as-is — working well.",
        venue: "NUMEROLOGY · Johnson 1755 panel · public/johnson/lexicon/ · npm run build:johnson",
      },
      {
        title: "A Dictionary of the English Language, 4th ed. (1773)",
        authors: "Samuel Johnson; johnsonsdictionaryonline.com / LEME CC BY 4.0; StarDict DSL (Alex Laemmle / Internet Archive johnson_1773)",
        detail:
          "Fourth-edition senses shown beside 1755 for the same typed word (~34k headwords). Rebuild from DSL with npm run build:johnson-1773.",
        venue: "NUMEROLOGY · Johnson 1773 panel · public/johnson/lexicon-1773/",
      },
      {
        title: "Johnson’s Dictionary Online (UCF / UF scans)",
        authors: "Beth Rapp Young, Jack Lynch, et al.; University of Central Florida; University of Florida Smathers Libraries",
        detail:
          "Permalink search for facsimile browsing; partial UCF TIFF zip used only for on-page facsimile images when extractable.",
        venue: "https://johnsonsdictionaryonline.com",
      },
      {
        title: "Major Arcana path cards (I–IX)",
        authors: "Tarot tradition (Rider–Waite lineage glosses in-app)",
        detail:
          "Each path number 1–9 maps to a Major Arcana card with a short explanation expanded via Johnson gloss look-ups.",
        venue: "NUMEROLOGY · tarot block",
      },
    ],
  },
  {
    heading: "Project lineage",
    blurb: "Ports and presentation layers that carried the toolbox into ZEUS AMMON-RA 11.",
    entries: [
      {
        title: "NumericalAnalysisToolbox_V15",
        authors: "Jonathan Angel (original Octave/MATLAB GUI)",
        detail:
          "Cross-platform Octave-compatible analyzer with plot inspect, symbolic factorization/shift when available, ACM demos (420–695 roster), and SDOF vibrations. Designed for MATLAB↔Octave portability. Companion V5 module ACMsPARSENumericsGUIINTEGRATIONV5 adds Algorithms 618 / 619 / 740 without mutating existing callbacks.",
      },
      {
        title: "NumericalAnalysisToolbox_V11_Neon_Vectorized_Calculus",
        authors: "Jonathan Angel (neon overlay)",
        detail:
          "Non-destructive neon theme, VECTOR / METHOD / COMPOSITE / DIFF laboratories, keyboard shortcuts, display utilities, and the GUI-integrated Genetic Algorithm root block later ported to the GENETIC tab.",
      },
      {
        title: "NUMERICAL EXTREME (ZEUS AMMON-RA 11)",
        authors: "Jonathan Angel · WOZKAF presentation layer",
        detail:
          "Client-side TypeScript port of the math engine inside the ZEUS neon UI with Extreme-style SFX (no BGM on open), Enoch-Ra compute feedback, NUMEROLOGY (seven traditions · Johnson 1755/1773 · Secret Doctrine · Ruckman×1611 KJV · Greek Myths · Thought-Forms), REFS, ALGORITHMS (695 / 682 / 502), ACM SPARS (618 / 619 / 740), BEZIER (Sauer 3.7), SYMBOLIC int(f,x), GENETIC (V11 GA roots), HEAT (HTANT V2), and THE VANITY APP Face++ batch.",
      },
    ],
  },
];
