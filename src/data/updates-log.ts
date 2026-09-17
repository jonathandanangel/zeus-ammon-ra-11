/* Auto-generated from git history — regenerate with: node scripts/build-updates-log.mjs */
export const UPDATES_REPO = "https://github.com/jonathandanangel/aero-flight-trivia" as const;
export const UPDATES_MIRROR_REPO = "https://github.com/jonathandanangel/zeus-ammon-ra-11" as const;
export const UPDATES_GENERATED_AT = "2026-09-17T21:25:36.769Z" as const;
export const UPDATES_COMMIT_COUNT = 399 as const;

export type UpdateKind = "human" | "ai-assisted";

export type UpdateFileChange = {
  path: string;
  additions: number;
  deletions: number;
};

export type UpdateEntry = {
  hash: string;
  short: string;
  author: string;
  email: string;
  date: string;
  subject: string;
  body: string;
  additions: number;
  deletions: number;
  fileCount: number;
  files: UpdateFileChange[];
  kind: UpdateKind;
  githubUrl: string;
};

export const UPDATES_LOG: UpdateEntry[] = [
  {
    "hash": "5e15741cce047747687425d85f1d72168a0ef930",
    "short": "5e15741",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T14:20:47-07:00",
    "subject": "Port Numerical Extreme to V18 Ordered Spatial Reasoning and smart trivia retakes.",
    "body": "Add ANU quantum missed-first retake decks with ascending difficulty, clear misses on correct review answers, and wire V18 sequence/graph/vibration reasoning into MAIN plus Babel high-variance locate scoring.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1724,
    "deletions": 176,
    "fileCount": 9,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 254,
        "deletions": 153
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 58,
        "deletions": 14
      },
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 2,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/babel-writing-iq.ts",
        "additions": 20,
        "deletions": 6
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 17,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/ordered-spatial-reasoning.ts",
        "additions": 871,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/v15-report.ts",
        "additions": 23,
        "deletions": 2
      },
      {
        "path": "src/game/numerical-extreme/v18-extras.ts",
        "additions": 391,
        "deletions": 0
      },
      {
        "path": "src/game/retake-deck.ts",
        "additions": 88,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5e15741cce047747687425d85f1d72168a0ef930"
  },
  {
    "hash": "c7899d51984428ee203600f86af48ffd4cdb6d1d",
    "short": "c7899d5",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T04:11:55-07:00",
    "subject": "Maximize Babel locate prose toward ~190 Writing IQ.",
    "body": "Elevate word/colour candidate register and rank toward Writing-to-IQ’s high band while keeping the Free AI ≤10% gate.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 153,
    "deletions": 47,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/game/numerical-extreme/babel-pathfinder.ts",
        "additions": 7,
        "deletions": 5
      },
      {
        "path": "src/game/numerical-extreme/babel-writing-iq.ts",
        "additions": 144,
        "deletions": 40
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/c7899d51984428ee203600f86af48ffd4cdb6d1d"
  },
  {
    "hash": "bbaf30c8e336e3629297dd8cc41d97aa7b200ca9",
    "short": "bbaf30c",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T04:09:01-07:00",
    "subject": "Add higher-order lead composite and share Free ensemble with Babel.",
    "body": "Generalize ModernBERT-first lead patterns without exact percents; Babel polish and UI copy now use the same Free detector rules and security notes.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 258,
    "deletions": 51,
    "fileCount": 5,
    "files": [
      {
        "path": "src/components/game/AiDetectorApp.tsx",
        "additions": 4,
        "deletions": 3
      },
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 13,
        "deletions": 0
      },
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 227,
        "deletions": 40
      },
      {
        "path": "src/game/numerical-extreme/babel-pathfinder.ts",
        "additions": 4,
        "deletions": 2
      },
      {
        "path": "src/game/numerical-extreme/babel-writing-iq.ts",
        "additions": 10,
        "deletions": 6
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/bbaf30c8e336e3629297dd8cc41d97aa7b200ca9"
  },
  {
    "hash": "19a00f316bb002cd607773f4ba90945d722e8891",
    "short": "19a00f3",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T04:05:42-07:00",
    "subject": "Add ModernBERT~90%>story~55% lead and product-of-experts fusion.",
    "body": "Fold the hard ModernBERT-over-chapterbook rule into continuous rule evidence and dual-model consensus (softmax log-odds + product-of-experts).\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 111,
    "deletions": 46,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 111,
        "deletions": 46
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/19a00f316bb002cd607773f4ba90945d722e8891"
  },
  {
    "hash": "af033be82967d51c84de921378a87332a5a4f3ec",
    "short": "af033be",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T04:00:35-07:00",
    "subject": "Fold all custom AI leads into continuous log-odds rule evidence.",
    "body": "Unify ModernBERT, story≥twin+high-mix, and alone-high mix dampening inside softmax logit fusion with weighted median for the final consensus.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 52,
    "deletions": 21,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 52,
        "deletions": 21
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/af033be82967d51c84de921378a87332a5a4f3ec"
  },
  {
    "hash": "1f0e0cb3b76f0b741815cc28775a90f35810a941",
    "short": "1f0e0cb",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T03:59:46-07:00",
    "subject": "Lean AI on story≥twin with high mix; ignore alone-high sentence-mix.",
    "body": "Treat AI-story above GPTZero-twin plus strangely elevated sentence-mix as an AI lead, while dampening high sentence-mix when it stands alone.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 77,
    "deletions": 22,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 77,
        "deletions": 22
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/1f0e0cb3b76f0b741815cc28775a90f35810a941"
  },
  {
    "hash": "b2743a8a63d27034f7a822df9c04e930a66df753",
    "short": "b2743a8",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T03:56:09-07:00",
    "subject": "Lean AI when ModernBERT beats AI-story with soft rest around the 20s.",
    "body": "Treat ModernBERT > chapterbook fingerprints (e.g. ~57% vs ~44%) while other free scans sit near 20% as an AI lead.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 54,
    "deletions": 20,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 54,
        "deletions": 20
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b2743a8a63d27034f7a822df9c04e930a66df753"
  },
  {
    "hash": "229ebb796f2f917552424348e97c47cf7e77cc0f",
    "short": "229ebb7",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T03:50:31-07:00",
    "subject": "Reuse Free multi-scan coin/bing SFX for Library of Babel polish.",
    "body": "Coin on grimoire press; bing when the deferred ModernBERT Babel filter finishes — scoring path unchanged.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 90,
    "deletions": 57,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 17,
        "deletions": 6
      },
      {
        "path": "src/game/numerical-extreme/babel-pathfinder.ts",
        "additions": 73,
        "deletions": 51
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/229ebb796f2f917552424348e97c47cf7e77cc0f"
  },
  {
    "hash": "e12fa84b621055a7fd54a2d1b5c99d03a8a3855a",
    "short": "e12fa84",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T03:47:34-07:00",
    "subject": "Add coin-flip and finish-bing SFX to free AI multi-scan.",
    "body": "Play detect-coin on Free multi-scan press and detect-bing when the suite completes, without changing scoring; note browser-local Free mode and API key/session security in the info panel.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 38,
    "deletions": 1,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/AiDetectorApp.tsx",
        "additions": 19,
        "deletions": 0
      },
      {
        "path": "src/game/audio.ts",
        "additions": 19,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/e12fa84b621055a7fd54a2d1b5c99d03a8a3855a"
  },
  {
    "hash": "053c43f5d47ead9f056545b6b346f5a28f0c1e00",
    "short": "053c43f",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T03:38:22-07:00",
    "subject": "Add log-odds fusion math to the detector and surface the custom-weight pitch.",
    "body": "Explain on the title System slide and AI Detector bench that biased detector weights plus math models target high efficiency, including the anti-false-positive note.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 149,
    "deletions": 77,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/AiDetectorApp.tsx",
        "additions": 16,
        "deletions": 9
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 2,
        "deletions": 1
      },
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 131,
        "deletions": 67
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/053c43f5d47ead9f056545b6b346f5a28f0c1e00"
  },
  {
    "hash": "fef30a43c8c248ad498bf3f74399053bc395541e",
    "short": "fef30a4",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T03:35:28-07:00",
    "subject": "Make ModernBERT custom rules the top consensus signal for detector and Babel.",
    "body": "Keep the full free suite in the weight mix, give ModernBERT/Burstiness leads highest importance (including ≈99% AI), and wire Babel to ModernBERT neural mode.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 110,
    "deletions": 84,
    "fileCount": 3,
    "files": [
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 100,
        "deletions": 80
      },
      {
        "path": "src/game/numerical-extreme/babel-pathfinder.ts",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/babel-writing-iq.ts",
        "additions": 9,
        "deletions": 3
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/fef30a43c8c248ad498bf3f74399053bc395541e"
  },
  {
    "hash": "3ebc3c99e135d3c51284c4da81e43a29d27fbe5d",
    "short": "3ebc3c9",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T03:33:04-07:00",
    "subject": "Lean AI when ModernBERT alone beats Burstiness and sentence-mix.",
    "body": "Treat ModernBERT > both soft scans as an AI lead even without the twin/rest-~20s pair pattern.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 52,
    "deletions": 27,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 52,
        "deletions": 27
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/3ebc3c99e135d3c51284c4da81e43a29d27fbe5d"
  },
  {
    "hash": "0ad7b71db2adc0e7dc0349418bf88afb76fed40e",
    "short": "0ad7b71",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T03:31:27-07:00",
    "subject": "Lean AI when ModernBERT and Burstiness beat mix and GPTZero-twin.",
    "body": "If that pair outscores sentence-mix and the twin while other free scans sit around the 20s, pull consensus toward AI.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 74,
    "deletions": 25,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 74,
        "deletions": 25
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/0ad7b71db2adc0e7dc0349418bf88afb76fed40e"
  },
  {
    "hash": "b6975325be36b3766c50a91daa73a90221a8c38e",
    "short": "b697532",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T03:29:15-07:00",
    "subject": "Lean human whenever ModernBERT AI% is below sentence-mix.",
    "body": "Any ModernBERT < sentence-mix gap pulls consensus toward human; larger gaps pull harder.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 35,
    "deletions": 38,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 35,
        "deletions": 38
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b6975325be36b3766c50a91daa73a90221a8c38e"
  },
  {
    "hash": "2e23513e7a668b04c5cc1451fbd556357561571d",
    "short": "2e23513",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T03:28:44-07:00",
    "subject": "Trust low ModernBERT over elevated sentence-mix as a human signal.",
    "body": "When free ModernBERT is far below sentence-mix (LABEL_0 vs soft ~50%), pull consensus toward human and crush stylometric dilution.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 66,
    "deletions": 15,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 66,
        "deletions": 15
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2e23513e7a668b04c5cc1451fbd556357561571d"
  },
  {
    "hash": "191f82fc70c587d0704ba284b35584932092b568",
    "short": "191f82f",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T03:26:43-07:00",
    "subject": "Weight ModernBERT 70–100% AI above soft stylometrics in consensus.",
    "body": "Raise ModernBERT influence when it calls AI strongly, crush sentence-mix dilution, and keep human-noise from vetoing a clear ModernBERT LABEL_1 hit.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 62,
    "deletions": 24,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 62,
        "deletions": 24
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/191f82fc70c587d0704ba284b35584932092b568"
  },
  {
    "hash": "f1f29abc23f230824a5c680ebf575d419eea0e1b",
    "short": "f1f29ab",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T03:16:49-07:00",
    "subject": "Fix AI detector polarity for human blurbs vs formulaic AI stories.",
    "body": "Strengthen student-voice authenticity toward ~0% AI, add chapterbook story fingerprints for LLM fiction, and stop discourse/neural dampening from flipping Babel’s low-AI filter.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 192,
    "deletions": 73,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 192,
        "deletions": 73
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f1f29abc23f230824a5c680ebf575d419eea0e1b"
  },
  {
    "hash": "5d18bb1f140f76c641f9437c9947fe9b02cc6e73",
    "short": "5d18bb1",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T09:57:28+00:00",
    "subject": "Updated card description text",
    "body": "X-Lovable-Edit-ID: edt-bdb3de5a-f62f-4e50-89d2-f6a75f8ff956\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5d18bb1f140f76c641f9437c9947fe9b02cc6e73"
  },
  {
    "hash": "d91d798c7efa7fdb12b513d0772a506862a15730",
    "short": "d91d798",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T09:57:23+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/d91d798c7efa7fdb12b513d0772a506862a15730"
  },
  {
    "hash": "a80a3575e83a9a0c5b08d980ba7b63ea08fc2b1a",
    "short": "a80a357",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T09:54:26+00:00",
    "subject": "Added cards to Numerical Extreme",
    "body": "X-Lovable-Edit-ID: edt-da6e16de-c187-42ff-9eb6-51a39c32e16a\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/a80a3575e83a9a0c5b08d980ba7b63ea08fc2b1a"
  },
  {
    "hash": "67f97935c302900a297cd4da29e1677dac55ff56",
    "short": "67f9793",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T09:54:11+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/67f97935c302900a297cd4da29e1677dac55ff56"
  },
  {
    "hash": "2b71b13752c3ea738db0991a43ecbc9a4837c560",
    "short": "2b71b13",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T09:48:15+00:00",
    "subject": "Removed main page high score",
    "body": "X-Lovable-Edit-ID: edt-a451f2cb-b4db-4c34-8163-bd1cd9929f85\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2b71b13752c3ea738db0991a43ecbc9a4837c560"
  },
  {
    "hash": "f9fec718aeb9135ace707d60c2f2eef9d69e7ae4",
    "short": "f9fec71",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T09:48:01+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 2,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 2,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f9fec718aeb9135ace707d60c2f2eef9d69e7ae4"
  },
  {
    "hash": "cf15804b2890334714ef01a5bbc8083c874faa65",
    "short": "cf15804",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T09:47:55+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 6,
    "deletions": 33,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 6,
        "deletions": 33
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/cf15804b2890334714ef01a5bbc8083c874faa65"
  },
  {
    "hash": "74f2f94416daedafdc7e5cc35124df22ae9abdb0",
    "short": "74f2f94",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T09:46:46+00:00",
    "subject": "Trimmed header bars to \"EXTREME",
    "body": "X-Lovable-Edit-ID: edt-f4bcb8c4-d99e-492e-b0e5-addf4c3de398\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/74f2f94416daedafdc7e5cc35124df22ae9abdb0"
  },
  {
    "hash": "aa32d637457f4974c604105ba8a48745cdc9aeae",
    "short": "aa32d63",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T09:46:37+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 5,
    "deletions": 5,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/ArcadeApp.tsx",
        "additions": 5,
        "deletions": 5
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/aa32d637457f4974c604105ba8a48745cdc9aeae"
  },
  {
    "hash": "09ba56e3ec7349de5169904ab7545683f4222065",
    "short": "09ba56e",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T09:46:26+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 4,
    "deletions": 4,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 4,
        "deletions": 4
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/09ba56e3ec7349de5169904ab7545683f4222065"
  },
  {
    "hash": "e645d71e0f24044f33bd6a1f26eec6c046baa2d3",
    "short": "e645d71",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T09:39:33+00:00",
    "subject": "Simplified arcade button text",
    "body": "X-Lovable-Edit-ID: edt-15ae23c4-ca29-4004-b568-96776c9dadb0\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/e645d71e0f24044f33bd6a1f26eec6c046baa2d3"
  },
  {
    "hash": "a1a1dd8476a459b0e44b2870948fb30475337052",
    "short": "a1a1dd8",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T09:39:28+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 4,
    "deletions": 4,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/ArcadeApp.tsx",
        "additions": 4,
        "deletions": 4
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/a1a1dd8476a459b0e44b2870948fb30475337052"
  },
  {
    "hash": "424b7c001128bcaf4afa9f2f99321f1ddb865423",
    "short": "424b7c0",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T02:23:24-07:00",
    "subject": "Add Arcade title section for trivia memory minigames with high scores.",
    "body": "Wire MEMORY EXTREME–named thin topic buttons into a cyan Arcade hub, and finish Numerical Extreme cyber boot/ambient UI sounds.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 567,
    "deletions": 28,
    "fileCount": 9,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 44,
        "deletions": 4
      },
      {
        "path": "src/components/game/ArcadeApp.tsx",
        "additions": 244,
        "deletions": 0
      },
      {
        "path": "src/components/game/NeonMazeGame.tsx",
        "additions": 6,
        "deletions": 1
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 17,
        "deletions": 3
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 53,
        "deletions": 7
      },
      {
        "path": "src/components/game/numerical-extreme/ui.tsx",
        "additions": 65,
        "deletions": 5
      },
      {
        "path": "src/game/audio.ts",
        "additions": 87,
        "deletions": 8
      },
      {
        "path": "src/game/memory-extreme/scores.ts",
        "additions": 42,
        "deletions": 0
      },
      {
        "path": "src/styles.css",
        "additions": 9,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/424b7c001128bcaf4afa9f2f99321f1ddb865423"
  },
  {
    "hash": "5954732873f9bf8c4c79f3830008a7889d8fc634",
    "short": "5954732",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T02:01:51-07:00",
    "subject": "Light up title topic buttons with softer NX-style themed glow.",
    "body": "Add sweep/pulse button effects colored per subject (aero purple, fire for heat/numerical) and keep them less vibrant than section headers. Center Settings credits on the full viewport.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 112,
    "deletions": 15,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 18,
        "deletions": 14
      },
      {
        "path": "src/styles.css",
        "additions": 94,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5954732873f9bf8c4c79f3830008a7889d8fc634"
  },
  {
    "hash": "f678cd0b50a7c96f0ef275410902d2919614dd25",
    "short": "f678cd0",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T01:54:31-07:00",
    "subject": "Center the Settings screen brightness warning line.",
    "body": "Co-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 2,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 2,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f678cd0b50a7c96f0ef275410902d2919614dd25"
  },
  {
    "hash": "5fd7567eb05e84eb4b4609f23b26af2a7d6c1b5d",
    "short": "5fd7567",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T01:53:15-07:00",
    "subject": "Make title topic scroll snappier and fold credits into Settings.",
    "body": "Mandatory snap stops between screens, and move the bright-warning / WOZKAF footer into the Settings & validation frame.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 17,
    "deletions": 15,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 12,
        "deletions": 11
      },
      {
        "path": "src/styles.css",
        "additions": 5,
        "deletions": 4
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5fd7567eb05e84eb4b4609f23b26af2a7d6c1b5d"
  },
  {
    "hash": "b82e4e90fa8c3ac09edf56d45f9efce0e9376699",
    "short": "b82e4e9",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T01:51:58-07:00",
    "subject": "Make title topic slides full-bleed with glowing white headers.",
    "body": "Remove the floating card square so sections scroll seamlessly, keep fiery/purple theme washes, and match section titles to the main ZEUS glow.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 72,
    "deletions": 85,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 16,
        "deletions": 15
      },
      {
        "path": "src/styles.css",
        "additions": 56,
        "deletions": 70
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b82e4e90fa8c3ac09edf56d45f9efce0e9376699"
  },
  {
    "hash": "f9df629b1f083c0faffc0cf03802891fa062759d",
    "short": "f9df629",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T01:46:37-07:00",
    "subject": "Brighten title topic frames with themed scroll washes.",
    "body": "Aerospace paths get electric mystique purple glow; Heat and Numerical get fiery frames. Drop the faint black wash band and keep original section wording.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 169,
    "deletions": 54,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 86,
        "deletions": 54
      },
      {
        "path": "src/styles.css",
        "additions": 83,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f9df629b1f083c0faffc0cf03802891fa062759d"
  },
  {
    "hash": "304f51d5b3f816559382ad46ff44d3f18eab509a",
    "short": "304f51d",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T01:27:56-07:00",
    "subject": "Keep matrix rain as an opt-in Settings toggle, off by default.",
    "body": "Restores the title canvas effect without other cyber layers, and resets older saves that had it forced on.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 202,
    "deletions": 3,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 10,
        "deletions": 0
      },
      {
        "path": "src/components/game/MatrixRainBackground.tsx",
        "additions": 173,
        "deletions": 0
      },
      {
        "path": "src/components/game/SettingsPanel.tsx",
        "additions": 5,
        "deletions": 0
      },
      {
        "path": "src/game/store.tsx",
        "additions": 14,
        "deletions": 3
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/304f51d5b3f816559382ad46ff44d3f18eab509a"
  },
  {
    "hash": "493f05094d7f50f607d18b7f9ab9bc37daf09bf5",
    "short": "493f050",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T01:25:52-07:00",
    "subject": "Remove Akinator and heavy cyber effects for lighter load.",
    "body": "Drop Who Am I?, matrix rain, cyber chrome/toast, PowerGlitch, and terminal accents so the title screen stays responsive.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 5,
    "deletions": 1981,
    "fileCount": 18,
    "files": [
      {
        "path": "package-lock.json",
        "additions": 0,
        "deletions": 381
      },
      {
        "path": "package.json",
        "additions": 0,
        "deletions": 2
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 49
      },
      {
        "path": "src/components/game/CyberChrome.tsx",
        "additions": 0,
        "deletions": 40
      },
      {
        "path": "src/components/game/MatrixRainBackground.tsx",
        "additions": 0,
        "deletions": 173
      },
      {
        "path": "src/components/game/SettingsPanel.tsx",
        "additions": 0,
        "deletions": 5
      },
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 0,
        "deletions": 8
      },
      {
        "path": "src/components/game/WhoAmIApp.tsx",
        "additions": 0,
        "deletions": 217
      },
      {
        "path": "src/game/store.tsx",
        "additions": 0,
        "deletions": 6
      },
      {
        "path": "src/game/who-am-i/akinator.ts",
        "additions": 0,
        "deletions": 264
      },
      {
        "path": "src/hooks/usePowerGlitch.ts",
        "additions": 0,
        "deletions": 87
      },
      {
        "path": "src/lib/cyber-toast.ts",
        "additions": 0,
        "deletions": 50
      },
      {
        "path": "src/routeTree.gen.ts",
        "additions": 3,
        "deletions": 21
      },
      {
        "path": "src/routes/api/akinator.ts",
        "additions": 0,
        "deletions": 69
      },
      {
        "path": "src/styles.css",
        "additions": 0,
        "deletions": 355
      },
      {
        "path": "src/styles/legend-terminal.css",
        "additions": 0,
        "deletions": 89
      },
      {
        "path": "src/vendor/cyber-toast/CyberToast.ts",
        "additions": 0,
        "deletions": 164
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/493f05094d7f50f607d18b7f9ab9bc37daf09bf5"
  },
  {
    "hash": "fb5df7b3e2d40e084fa0476dda285522ed4530e4",
    "short": "fb5df7b",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:17:03+00:00",
    "subject": "Fixed Who Am I import path",
    "body": "X-Lovable-Edit-ID: edt-1dd4d9f4-326b-45d0-bfc1-8252a0073aef\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/fb5df7b3e2d40e084fa0476dda285522ed4530e4"
  },
  {
    "hash": "73a2e0e69a3a5710ac0647c5993d5e6895c86aac",
    "short": "73a2e0e",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:16:46+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/types/aki-api-akinator.d.ts",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/73a2e0e69a3a5710ac0647c5993d5e6895c86aac"
  },
  {
    "hash": "6b7122a511d81fa7de387eb7fadaf9f6061e053b",
    "short": "6b7122a",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:16:41+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/who-am-i/akinator.ts",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6b7122a511d81fa7de387eb7fadaf9f6061e053b"
  },
  {
    "hash": "9db193647553fa9f96104c6b657b7ced7370747c",
    "short": "9db1936",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:14:11+00:00",
    "subject": "Fixed Akinator bundle crash",
    "body": "X-Lovable-Edit-ID: edt-ab890038-6974-4535-a75c-3370fa11244d\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9db193647553fa9f96104c6b657b7ced7370747c"
  },
  {
    "hash": "3bff99d49df56bb2ce6446bc77abc863cf93eee5",
    "short": "3bff99d",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:13:57+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 5,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/types/aki-api-akinator.d.ts",
        "additions": 5,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/3bff99d49df56bb2ce6446bc77abc863cf93eee5"
  },
  {
    "hash": "cb5426b331ad96402b693162c1a8f2174b849c3e",
    "short": "cb5426b",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:13:52+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/who-am-i/akinator.ts",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/cb5426b331ad96402b693162c1a8f2174b849c3e"
  },
  {
    "hash": "2743ae95d99956a4f5d0810f4d4dff6b9f06ef1c",
    "short": "2743ae9",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:13:41+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/who-am-i/akinator.ts",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2743ae95d99956a4f5d0810f4d4dff6b9f06ef1c"
  },
  {
    "hash": "c5387ee301898caea50be8b6edda6c3673c0da42",
    "short": "c5387ee",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:13:33+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 6,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/who-am-i/akinator.ts",
        "additions": 6,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/c5387ee301898caea50be8b6edda6c3673c0da42"
  },
  {
    "hash": "68ecbb3da3193d1489a3236b294452822b8f5c44",
    "short": "68ecbb3",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:13:00+00:00",
    "subject": "Shrunk audio & fixed build",
    "body": "X-Lovable-Edit-ID: edt-cc685cc9-91de-4d9f-82a1-0327771f533b\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/68ecbb3da3193d1489a3236b294452822b8f5c44"
  },
  {
    "hash": "4de3c8fe24c281fc4ac1e8090a462464dc5a4571",
    "short": "4de3c8f",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:12:34+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 19,
    "deletions": 9,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/who-am-i/akinator.ts",
        "additions": 19,
        "deletions": 9
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4de3c8fe24c281fc4ac1e8090a462464dc5a4571"
  },
  {
    "hash": "5708b7304c98b487483d31c3527d5eaaf18122a6",
    "short": "5708b73",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:11:59+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 18,
    "deletions": 18,
    "fileCount": 4,
    "files": [
      {
        "path": "src/game/audio.ts",
        "additions": 8,
        "deletions": 8
      },
      {
        "path": "src/game/spirit-bound/anu-qrng-fetch.ts",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/lib/anu-qrng.ts",
        "additions": 4,
        "deletions": 4
      },
      {
        "path": "src/vendor/cyber-toast/CyberToast.ts",
        "additions": 5,
        "deletions": 5
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5708b7304c98b487483d31c3527d5eaaf18122a6"
  },
  {
    "hash": "8462f3362d6fa183b0e0c2f482c00725716d3ad9",
    "short": "8462f33",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:11:46+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 6,
    "deletions": 9,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/audio.ts",
        "additions": 6,
        "deletions": 9
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/8462f3362d6fa183b0e0c2f482c00725716d3ad9"
  },
  {
    "hash": "5956f2c95ac0897c766502114e9342f4a5d8cf53",
    "short": "5956f2c",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:11:32+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 12,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/audio.ts",
        "additions": 12,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5956f2c95ac0897c766502114e9342f4a5d8cf53"
  },
  {
    "hash": "5c26dd2266511598aad231807cb511f2d42e5e1d",
    "short": "5c26dd2",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-17T08:11:12+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 55,
    "deletions": 0,
    "fileCount": 11,
    "files": [
      {
        "path": "public/audio/ht-bananza-bed.mp3",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/audio/ht-bananza-portal.mp3",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/audio/ht-portal-bed.mp3",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/audio/title-armageddon.mp3",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/audio/title-crystal-vista.mp3",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/audio/title-portal.mp3",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-bananza-bed.mp3.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-bananza-portal.mp3.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-portal-bed.mp3.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/title-armageddon.mp3.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/title-portal.mp3.asset.json",
        "additions": 11,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5c26dd2266511598aad231807cb511f2d42e5e1d"
  },
  {
    "hash": "ebba62456f813e6eefd8bb7e58b8da0fe9d00070",
    "short": "ebba624",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T01:05:29-07:00",
    "subject": "Add About Creator page from Settings with Instagram and LinkedIn links.",
    "body": "Co-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 92,
    "deletions": 3,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/AboutCreatorPanel.tsx",
        "additions": 59,
        "deletions": 0
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 14,
        "deletions": 2
      },
      {
        "path": "src/components/game/SettingsPanel.tsx",
        "additions": 19,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ebba62456f813e6eefd8bb7e58b8da0fe9d00070"
  },
  {
    "hash": "d9b219e6202ef25cfd545cea353d74646c63e8d0",
    "short": "d9b219e",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T01:01:38-07:00",
    "subject": "Add Who Am I? Akinator mode on the main menu.",
    "body": "Wire aki-api through a same-origin /api/akinator proxy, ship a playable yes/no UI, and surface friendly Cloudflare errors when the upstream blocks the session.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 594,
    "deletions": 4,
    "fileCount": 6,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 29,
        "deletions": 1
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 8,
        "deletions": 0
      },
      {
        "path": "src/components/game/WhoAmIApp.tsx",
        "additions": 217,
        "deletions": 0
      },
      {
        "path": "src/game/who-am-i/akinator.ts",
        "additions": 250,
        "deletions": 0
      },
      {
        "path": "src/routeTree.gen.ts",
        "additions": 21,
        "deletions": 3
      },
      {
        "path": "src/routes/api/akinator.ts",
        "additions": 69,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/d9b219e6202ef25cfd545cea353d74646c63e8d0"
  },
  {
    "hash": "2cbe6cad90c612f67cd7eadfb0ec32c836cf7586",
    "short": "2cbe6ca",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T00:57:31-07:00",
    "subject": "Enable matrix rain by default with Settings toggle to turn it off.",
    "body": "Co-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 22,
    "deletions": 22,
    "fileCount": 2,
    "files": [
      {
        "path": "src/game/store.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/routeTree.gen.ts",
        "additions": 21,
        "deletions": 21
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2cbe6cad90c612f67cd7eadfb0ec32c836cf7586"
  },
  {
    "hash": "469b33f182e06516a07653194ab73a29dd289cb1",
    "short": "469b33f",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T00:53:54-07:00",
    "subject": "Fix blank page by moving cyber-skin effect before the hydration return.",
    "body": "A useEffect after `if (!hydrated) return null` violated Rules of Hooks and crashed the client once the save finished loading.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 2,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 2,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/469b33f182e06516a07653194ab73a29dd289cb1"
  },
  {
    "hash": "b06e7374655de9227508e816c79df7ec59da1d15",
    "short": "b06e737",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-17T00:45:45-07:00",
    "subject": "Add light cyber accents, optional matrix rain, and ANU quantum rolls.",
    "body": "Keep ZEUS branding intact: soft title chrome, opt-in matrix rain, Legend terminal micro-details, and quantum seeds for Spirit Bound randomness with local fallback.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1849,
    "deletions": 43,
    "fileCount": 25,
    "files": [
      {
        "path": "package-lock.json",
        "additions": 388,
        "deletions": 0
      },
      {
        "path": "package.json",
        "additions": 3,
        "deletions": 0
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 20,
        "deletions": 0
      },
      {
        "path": "src/components/game/CyberChrome.tsx",
        "additions": 40,
        "deletions": 0
      },
      {
        "path": "src/components/game/MatrixRainBackground.tsx",
        "additions": 173,
        "deletions": 0
      },
      {
        "path": "src/components/game/SettingsPanel.tsx",
        "additions": 5,
        "deletions": 0
      },
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 27,
        "deletions": 3
      },
      {
        "path": "src/components/game/spirit-bound/BulletBox.tsx",
        "additions": 16,
        "deletions": 15
      },
      {
        "path": "src/components/game/spirit-bound/GrasslandsOverworld.tsx",
        "additions": 4,
        "deletions": 3
      },
      {
        "path": "src/components/game/spirit-bound/MinecraftSplash.tsx",
        "additions": 4,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/Overworld.tsx",
        "additions": 5,
        "deletions": 4
      },
      {
        "path": "src/game/spirit-bound/anu-qrng-fetch.ts",
        "additions": 170,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/grasslands-data.ts",
        "additions": 2,
        "deletions": 1
      },
      {
        "path": "src/game/spirit-bound/shrine/audio.ts",
        "additions": 8,
        "deletions": 7
      },
      {
        "path": "src/game/spirit-bound/shrine/rng.ts",
        "additions": 26,
        "deletions": 3
      },
      {
        "path": "src/game/store.tsx",
        "additions": 6,
        "deletions": 0
      },
      {
        "path": "src/hooks/usePowerGlitch.ts",
        "additions": 87,
        "deletions": 0
      },
      {
        "path": "src/hooks/useShrinePuzzle.ts",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/lib/anu-qrng.ts",
        "additions": 149,
        "deletions": 0
      },
      {
        "path": "src/lib/cyber-toast.ts",
        "additions": 50,
        "deletions": 0
      },
      {
        "path": "src/routeTree.gen.ts",
        "additions": 21,
        "deletions": 3
      },
      {
        "path": "src/routes/api/anu-qrng.ts",
        "additions": 35,
        "deletions": 0
      },
      {
        "path": "src/styles.css",
        "additions": 355,
        "deletions": 0
      },
      {
        "path": "src/styles/legend-terminal.css",
        "additions": 89,
        "deletions": 0
      },
      {
        "path": "src/vendor/cyber-toast/CyberToast.ts",
        "additions": 164,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b06e7374655de9227508e816c79df7ec59da1d15"
  },
  {
    "hash": "f53ffa1e16ed55b44032253033a62b80ff3b43d9",
    "short": "f53ffa1",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T19:59:48-07:00",
    "subject": "Reduce NUMEROLOGY lag while typing and scrolling.",
    "body": "Debounce word lookups, defer Babel locate/polish until the grimoire opens with local-only idle polish, lazy-load Thought-Forms images, and thin Babel ambience so the main thread stays responsive.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 122,
    "deletions": 82,
    "fileCount": 5,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 20,
        "deletions": 5
      },
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 39,
        "deletions": 25
      },
      {
        "path": "src/game/audio.ts",
        "additions": 6,
        "deletions": 18
      },
      {
        "path": "src/game/numerical-extreme/babel-pathfinder.ts",
        "additions": 39,
        "deletions": 20
      },
      {
        "path": "src/game/numerical-extreme/babel-writing-iq.ts",
        "additions": 18,
        "deletions": 14
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f53ffa1e16ed55b44032253033a62b80ff3b43d9"
  },
  {
    "hash": "77c20e7e461f2f3f4f558fb2956c424836ff4a23",
    "short": "77c20e7",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T19:41:01-07:00",
    "subject": "Polish Babel locate with silent IQ/AI tests, grimoire air SFX, and clearer Babelia seek.",
    "body": "Background Writing-IQ plus free AI-detector suite prefers dense human prose under ~10% AI; opening the grimoire adds spirit/air ambience; official-length Babelia pastes warn that twin static is expected.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 607,
    "deletions": 57,
    "fileCount": 6,
    "files": [
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 104,
        "deletions": 30
      },
      {
        "path": "src/game/audio.ts",
        "additions": 156,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/babel-pathfinder.ts",
        "additions": 73,
        "deletions": 3
      },
      {
        "path": "src/game/numerical-extreme/babel-writing-iq.ts",
        "additions": 204,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/babelia-archive.ts",
        "additions": 67,
        "deletions": 23
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 3,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/77c20e7e461f2f3f4f558fb2956c424836ff4a23"
  },
  {
    "hash": "607ed784201d07e751bbb44527c86581e1fb4b54",
    "short": "607ed78",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T19:19:10-07:00",
    "subject": "Add official LoB prove-it seeds and demo FR Babel EPUB.",
    "body": "Paste text to open Basile search, upload images for twin locate plus Babelia search links, and ship the glossary EN→FR seed translation samples.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 495,
    "deletions": 17,
    "fileCount": 8,
    "files": [
      {
        "path": "package.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/epub-library/samples/zeus-babel-seed-fr.epub",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/epub-library/samples/zeus-babel-seed-fr.seeds.json",
        "additions": 19,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/epub-library/samples/zeus-babel-seed.epub",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "scripts/babel-epub-demo-translate.py",
        "additions": 287,
        "deletions": 0
      },
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 158,
        "deletions": 16
      },
      {
        "path": "src/components/game/university-projects/BabelEpubPanel.tsx",
        "additions": 29,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/babelia-archive.ts",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/607ed784201d07e751bbb44527c86581e1fb4b54"
  },
  {
    "hash": "edd3ab120943424506aa81a248f1514538dcd770",
    "short": "edd3ab1",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T18:51:10-07:00",
    "subject": "Vendor clcreuso/the-babel-library and wire it into all Babel sources.",
    "body": "Snapshot the MIT EPUB translator under tools/, add per-source glossaries, University Babel EPUB tab, and glossary seed expansion across NUMEROLOGY locate/books.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 7882,
    "deletions": 5,
    "fileCount": 44,
    "files": [
      {
        "path": ".gitignore",
        "additions": 4,
        "deletions": 0
      },
      {
        "path": "package.json",
        "additions": 2,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/epub-companion-glossary.md",
        "additions": 50,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/epub-library/LICENSE",
        "additions": 21,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/epub-library/NOTICE",
        "additions": 12,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/epub-library/README.md",
        "additions": 38,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/epub-library/glossaries/greek-myths.md",
        "additions": 13,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/epub-library/glossaries/johnson-lexicon.md",
        "additions": 14,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/epub-library/glossaries/ruckman-kjv.md",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/epub-library/glossaries/secret-doctrine.md",
        "additions": 14,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/epub-library/glossaries/thought-forms.md",
        "additions": 14,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/epub-library/glossaries/zeus-numerology-babel.md",
        "additions": 50,
        "deletions": 0
      },
      {
        "path": "src/components/game/UniversityProjectsApp.tsx",
        "additions": 4,
        "deletions": 1
      },
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 46,
        "deletions": 1
      },
      {
        "path": "src/components/game/university-projects/BabelEpubPanel.tsx",
        "additions": 139,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/babel-library-companion.ts",
        "additions": 307,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/babel-pathfinder.ts",
        "additions": 42,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/babelia-archive.ts",
        "additions": 4,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 12,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/references.ts",
        "additions": 9,
        "deletions": 1
      },
      {
        "path": "tools/the-babel-library/.github/workflows/tests.yml",
        "additions": 27,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/.gitignore",
        "additions": 32,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/CHANGELOG.md",
        "additions": 64,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/CONTRIBUTING.md",
        "additions": 44,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/LICENSE",
        "additions": 21,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/NOTICE",
        "additions": 12,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/README.md",
        "additions": 244,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/SECURITY.md",
        "additions": 17,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/ZEUS.md",
        "additions": 38,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/books/.gitkeep",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/epub_translate.py",
        "additions": 4186,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/glossaries/greek-myths.md",
        "additions": 13,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/glossaries/johnson-lexicon.md",
        "additions": 14,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/glossaries/ruckman-kjv.md",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/glossaries/secret-doctrine.md",
        "additions": 14,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/glossaries/thought-forms.md",
        "additions": 14,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/glossaries/zeus-numerology-babel.md",
        "additions": 50,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/glossary.example.md",
        "additions": 18,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/review_translation.md",
        "additions": 238,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/tests/test_epub_translate.py",
        "additions": 1629,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/translate_epub.md",
        "additions": 270,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/translate_epub_editorial.md",
        "additions": 30,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/translate_epub_file.md",
        "additions": 44,
        "deletions": 0
      },
      {
        "path": "tools/the-babel-library/translate_epub_style.md",
        "additions": 45,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/edd3ab120943424506aa81a248f1514538dcd770"
  },
  {
    "hash": "ab5cdc0d4beddfeff071eff7d8cb734a943cdf68",
    "short": "ab5cdc0",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T18:43:25-07:00",
    "subject": "Add Babelia-style image archive: location→pixels, seek, random, hierarchy.",
    "body": "Educational 12-bit 160×104 plates mirror babelia.libraryofbabel.info — browse by location, slideshow step, and coherence-ranked search hits from the path word.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 542,
    "deletions": 26,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 235,
        "deletions": 26
      },
      {
        "path": "src/game/numerical-extreme/babelia-archive.ts",
        "additions": 291,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 16,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ab5cdc0d4beddfeff071eff7d8cb734a943cdf68"
  },
  {
    "hash": "6a8ecb4dbcb6c7466bb738a0c16e4d5fe5ad2b3d",
    "short": "6a8ecb4",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T18:40:08-07:00",
    "subject": "Embody the Library of Babel: locate pages, weave signal into noise.",
    "body": "Each leaf is a located hexagon address; coherence % controls how much foundational text vs 29-letter Babel dust, walking from rare readable pages into ordinary permutation noise.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 183,
    "deletions": 55,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 53,
        "deletions": 13
      },
      {
        "path": "src/game/numerical-extreme/babel-pathfinder.ts",
        "additions": 128,
        "deletions": 42
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 2,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6a8ecb4dbcb6c7466bb738a0c16e4d5fe5ad2b3d"
  },
  {
    "hash": "920ccf3015a4e025b104f13691884e08572a3ed2",
    "short": "920ccf3",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T18:37:58-07:00",
    "subject": "Order Babel book leaves from foundational accuracy to least likely.",
    "body": "Compose new leaf text from the source database (path, Johnson, Thought-Forms, traditions, Blavatsky, Graves, expansions) ranked by accuracy %, with a progress bar that fades as you turn pages.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 428,
    "deletions": 103,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 49,
        "deletions": 4
      },
      {
        "path": "src/game/numerical-extreme/babel-pathfinder.ts",
        "additions": 379,
        "deletions": 99
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/920ccf3015a4e025b104f13691884e08572a3ed2"
  },
  {
    "hash": "2ee7b93cce654f5d8736e79e3ee26c8b798613c7",
    "short": "2ee7b93",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T18:35:21-07:00",
    "subject": "Gate Babel behind a ranked retro grimoire with Babel-font caption.",
    "body": "Press the pixel tome to begin; located images sort by likelihood (grimoire → folio → babelia → hexagon → shelf) with Babel-alphabet press text on the cover.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 337,
    "deletions": 44,
    "fileCount": 6,
    "files": [
      {
        "path": "public/numerology/babel/credits.json",
        "additions": 10,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/retro-grimoire.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 147,
        "deletions": 35
      },
      {
        "path": "src/game/numerical-extreme/babel-images.ts",
        "additions": 168,
        "deletions": 8
      },
      {
        "path": "src/game/numerical-extreme/babel-pathfinder.ts",
        "additions": 9,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 3,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2ee7b93cce654f5d8736e79e3ee26c8b798613c7"
  },
  {
    "hash": "993ce37c61744e2c74b1b016b923e748c0dfc4c5",
    "short": "993ce37",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T18:32:15-07:00",
    "subject": "Locate babelia-style images and richer book cards in NUMEROLOGY Babel.",
    "body": "Deterministic hexagon/noise/folio/shelf plates from word+path seeds, plus call numbers, contents, ISBN-like ids, and official libraryofbabel.info / babelia links on each generated volume.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 583,
    "deletions": 8,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 132,
        "deletions": 8
      },
      {
        "path": "src/game/numerical-extreme/babel-images.ts",
        "additions": 393,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/babel-pathfinder.ts",
        "additions": 51,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 7,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/993ce37c61744e2c74b1b016b923e748c0dfc4c5"
  },
  {
    "hash": "ed1addace0cf28374d19cdb547836a85e9bc562d",
    "short": "ed1adda",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T18:28:57-07:00",
    "subject": "Port project_gui.py into University Projects as ME021 assemblies.",
    "body": "Web tabs for game-log summary, team score averages, student grade assigner, and LABEL/Name/appearance data reader, with sample log/grades and the original PySimpleGUI source.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1646,
    "deletions": 4,
    "fileCount": 8,
    "files": [
      {
        "path": "public/university-projects/me021/StudentAppearance.txt",
        "additions": 5,
        "deletions": 0
      },
      {
        "path": "public/university-projects/me021/StudentInfo.tsv",
        "additions": 6,
        "deletions": 0
      },
      {
        "path": "public/university-projects/me021/sample_game_log.txt",
        "additions": 123,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/project_gui.py",
        "additions": 794,
        "deletions": 0
      },
      {
        "path": "src/components/game/UniversityProjectsApp.tsx",
        "additions": 7,
        "deletions": 3
      },
      {
        "path": "src/components/game/university-projects/ProjectGuiPanel.tsx",
        "additions": 448,
        "deletions": 0
      },
      {
        "path": "src/data/university-projects/catalog.json",
        "additions": 11,
        "deletions": 1
      },
      {
        "path": "src/game/university-projects/projectGui.ts",
        "additions": 252,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ed1addace0cf28374d19cdb547836a85e9bc562d"
  },
  {
    "hash": "4e62a851bf334d36c06e5eaaf91de04a5e965a1a",
    "short": "4e62a85",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T18:25:53-07:00",
    "subject": "Add Babel Secret Library to NUMEROLOGY with antique art and generated books.",
    "body": "Locate libraryofbabel-style pages from Johnson, Blavatsky, Graves anagrams, philosophy, tarot, and Thought-Forms; amber-highlight matches; generate multi-leaf books from word combinations; ship Bruegel/Kircher/Doré plates plus Borges PDF.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1660,
    "deletions": 1,
    "fileCount": 12,
    "files": [
      {
        "path": "public/numerology/babel/bruegel-rotterdam.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/bruegel-vienna.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/confusion-of-tongues.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/credits.json",
        "additions": 90,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/dore-tower-babel.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/babel/kircher-turris-babel.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/university-projects/babel/library-of-babel-borges.pdf",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 13,
        "deletions": 1
      },
      {
        "path": "src/components/game/numerical-extreme/BabelSecretPanel.tsx",
        "additions": 497,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/babel-pathfinder.ts",
        "additions": 1024,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 28,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/references.ts",
        "additions": 8,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4e62a851bf334d36c06e5eaaf91de04a5e965a1a"
  },
  {
    "hash": "b1d5758e69c823f83ff38e5f69e85798eb28c6e4",
    "short": "b1d5758",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T18:11:34-07:00",
    "subject": "Add University Projects lab from MATLABProject-1 with coursework browser.",
    "body": "Port the column-pick scatter plotter to the web with upload, stats, OLS fit, and engineering picks, and ship PyCharm Misc Python plus MATLABProject-1 sources under a new title-screen section.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 7997,
    "deletions": 3,
    "fileCount": 80,
    "files": [
      {
        "path": "public/university-projects/matlab/MATLABProject-1.m",
        "additions": 377,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/2_dimensional_list_pattern.py",
        "additions": 21,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/HW05_01.py",
        "additions": 30,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/anothe.py",
        "additions": 12,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/bumps.py",
        "additions": 13,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/deletion.py",
        "additions": 27,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/dicts.py",
        "additions": 23,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/dicts_challenges.py",
        "additions": 3,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/directly_accessing_list_using_i.py",
        "additions": 38,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/efkoejreoreo knbjg.py",
        "additions": 19,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/eodwefmoe.py",
        "additions": 12,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/example.py",
        "additions": 14,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/exampleruntest.py",
        "additions": 34,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/exist.py",
        "additions": 13,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/experi_mental_data_i_one.py",
        "additions": 23,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/experiment_al_data.py",
        "additions": 18,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/food_available_list.py",
        "additions": 29,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/game_scoring_files.py",
        "additions": 244,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/hangman.py",
        "additions": 32,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/hw2.py",
        "additions": 28,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/iteration_test.py",
        "additions": 10,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/k.py",
        "additions": 12,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/levelslslsl.py",
        "additions": 21,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/lists level higher.py",
        "additions": 13,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/model_sol_two.py",
        "additions": 16,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/model_solution.py",
        "additions": 3,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/modifying_lists_while_iterating.py",
        "additions": 33,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/n.py",
        "additions": 13,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/numsRejecQues.py",
        "additions": 65,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/nums_removal.py",
        "additions": 35,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/oirfjioewrfj.py",
        "additions": 12,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/op.py",
        "additions": 7,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/os_file.py",
        "additions": 98,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/ostime.py",
        "additions": 306,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/passenger database.py",
        "additions": 41,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/patient_ages.py",
        "additions": 106,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/py_roll.py",
        "additions": 10,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/python hw02b.py",
        "additions": 41,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/randomfile.py",
        "additions": 51,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/replace_string.py",
        "additions": 16,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/script.py",
        "additions": 16,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/secondtolast.py",
        "additions": 48,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/slicing exmaple.py",
        "additions": 8,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/smapleslist.py",
        "additions": 53,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/splitting.py",
        "additions": 7,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/splitting_joining_strings_level3.py",
        "additions": 8,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/store.py",
        "additions": 113,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/storing.py",
        "additions": 279,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/string methods.py",
        "additions": 13,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/string user input.py",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/string_in_class.py",
        "additions": 17,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/string_methods_user_string_cap_input.py",
        "additions": 18,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/tac.py",
        "additions": 28,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/test.py",
        "additions": 9,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/testrun.py",
        "additions": 8,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/the hierarchy of coins.py",
        "additions": 63,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/tic_tac_toe.py",
        "additions": 43,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/two_dimensional_list.py",
        "additions": 109,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/unique_items.py",
        "additions": 14,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/unms.py",
        "additions": 15,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/userstring.py",
        "additions": 57,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/misc/whitespace.py",
        "additions": 3,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/NumericalAnalysisToolboxGUI_Octave.m",
        "additions": 681,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/NumericalAnalysisToolboxGUI_Octave_V2.m",
        "additions": 680,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/NumericalAnalysisToolboxGUI_Octave_V3.m",
        "additions": 773,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/NumericalAnalysisToolboxGUI_V2.m",
        "additions": 712,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/bisect_box.m",
        "additions": 48,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/ijoiioiojoij.m",
        "additions": 10,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/is_master.m",
        "additions": 86,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/newton_nd.m",
        "additions": 33,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/num.m",
        "additions": 205,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/numerology.m",
        "additions": 101,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/numerology_V2.m",
        "additions": 204,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/script.py",
        "additions": 16,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/scriptTest.py",
        "additions": 66,
        "deletions": 0
      },
      {
        "path": "public/university-projects/python/test/testing.m",
        "additions": 3,
        "deletions": 0
      },
      {
        "path": "public/university-projects/samples/HW04b_TeamData.txt",
        "additions": 18,
        "deletions": 0
      },
      {
        "path": "public/university-projects/samples/Sample_Data_01.txt",
        "additions": 19,
        "deletions": 0
      },
      {
        "path": "public/university-projects/samples/TeamData.txt",
        "additions": 28,
        "deletions": 0
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 33,
        "deletions": 3
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b1d5758e69c823f83ff38e5f69e85798eb28c6e4"
  },
  {
    "hash": "114ae52606a943ec285cd2c19d3300edb1058a04",
    "short": "114ae52",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T18:02:59-07:00",
    "subject": "Add Sauer MATLAB pack, symbolic int/diff GUI, and Heat album credits.",
    "body": "Bundle the Pearson companion Programs plus Octave integration/derivative scripts into Numerical Extreme, expand SYMBOLIC with diff(f,x,n), and show album titles for Heat Transfer music.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 2957,
    "deletions": 39,
    "fileCount": 71,
    "files": [
      {
        "path": "public/audio/albums/das-armageddon.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/octave-gui/derivativesOfFunctions.m",
        "additions": 5,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/octave-gui/derivativesOfFunctions_V2.m",
        "additions": 10,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/octave-gui/integrationOctave.m",
        "additions": 13,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/5.txt",
        "additions": 21,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/T.txt",
        "additions": 16,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/adapquad.m",
        "additions": 23,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/bezierdraw.m",
        "additions": 27,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/bisect.m",
        "additions": 25,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/bounce.m",
        "additions": 27,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/broyden2.m",
        "additions": 14,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/brusselator.m",
        "additions": 82,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/burgers.m",
        "additions": 32,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/bvpfem.m",
        "additions": 14,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/clgs.m",
        "additions": 15,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/clickinterp.m",
        "additions": 22,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/crank.m",
        "additions": 28,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/dftfilter.m",
        "additions": 20,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/dftinterp.m",
        "additions": 14,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/euler1.m",
        "additions": 23,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/euler2.m",
        "additions": 22,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/exmultistep.m",
        "additions": 44,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/f.txt",
        "additions": 21,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/fisher2d.m",
        "additions": 65,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/fpi.m",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/gss.m",
        "additions": 19,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/halton.m",
        "additions": 20,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/heatbd.m",
        "additions": 23,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/heatfd.m",
        "additions": 23,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/hessen.m",
        "additions": 16,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/hh.m",
        "additions": 52,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/houseqr.m",
        "additions": 17,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/invpowerit.m",
        "additions": 12,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/jacobi.m",
        "additions": 12,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/neldermead.m",
        "additions": 53,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/nest.m",
        "additions": 13,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/newtdd.m",
        "additions": 18,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/nlbvpfd.m",
        "additions": 36,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/nsi.m",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/orbit.m",
        "additions": 50,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/pend.m",
        "additions": 35,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/poisson.m",
        "additions": 35,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/poissonfem.m",
        "additions": 54,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/powerit.m",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/predcorr.m",
        "additions": 41,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/romberg.m",
        "additions": 18,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/rqi.m",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/scrippsm.txt",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/scrippsy.txt",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/shiftedqr.m",
        "additions": 29,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/simplecodec.m",
        "additions": 36,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/sin1.m",
        "additions": 23,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/sin2.m",
        "additions": 23,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/sparsesetup.m",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/spi.m",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/splinecoeff.m",
        "additions": 35,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/splineplot.m",
        "additions": 19,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/tacoma.m",
        "additions": 47,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/unshiftedqr.m",
        "additions": 13,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/wiener.m",
        "additions": 13,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/wilkpoly.m",
        "additions": 12,
        "deletions": 0
      },
      {
        "path": "public/numerical-extreme/sauer-matlab/windmill.txt",
        "additions": 61,
        "deletions": 0
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 8,
        "deletions": 0
      },
      {
        "path": "src/components/game/NowPlayingAlbum.tsx",
        "additions": 100,
        "deletions": 0
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 266,
        "deletions": 27
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 9,
        "deletions": 3
      },
      {
        "path": "src/data/numerical-extreme/sauer-matlab-catalog.json",
        "additions": 800,
        "deletions": 0
      },
      {
        "path": "src/game/audio.ts",
        "additions": 95,
        "deletions": 7
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 2,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/references.ts",
        "additions": 8,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/symbolic.ts",
        "additions": 160,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/114ae52606a943ec285cd2c19d3300edb1058a04"
  },
  {
    "hash": "3aac314aef11a760142582259a835f946b3fa423",
    "short": "3aac314",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T17:14:38-07:00",
    "subject": "Wire Thought-Forms colour and emotion plates for every path digit and master.",
    "body": "Map Fig. 1–9 as primary plates per digit 1–9, keep masters 11/22/33… on their base ray, restore the colour-key chart, and preserve masters in digital-root reduction.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 349,
    "deletions": 29,
    "fileCount": 8,
    "files": [
      {
        "path": "public/numerology/thought-forms/README.txt",
        "additions": 7,
        "deletions": 3
      },
      {
        "path": "public/numerology/thought-forms/colorchart.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/key-to-meanings-of-colours.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 36,
        "deletions": 4
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 4,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/numerology.ts",
        "additions": 17,
        "deletions": 4
      },
      {
        "path": "src/game/numerical-extreme/philosopher-numbers.ts",
        "additions": 7,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/thought-forms.ts",
        "additions": 278,
        "deletions": 17
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/3aac314aef11a760142582259a835f946b3fa423"
  },
  {
    "hash": "9ede76ebfee8cad5df7a1d99fc060448fb767e22",
    "short": "9ede76e",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T16:59:07-07:00",
    "subject": "Use a high-resolution PDF crop for the Thought-Forms colour key.",
    "body": "Replace the screenshot/low-res plate with a ~2340×3490 frontispiece extract so the full Key to the Meanings of Colours is clear in Numerology.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 7,
    "deletions": 4,
    "fileCount": 3,
    "files": [
      {
        "path": "public/numerology/thought-forms/README.txt",
        "additions": 3,
        "deletions": 1
      },
      {
        "path": "public/numerology/thought-forms/key-to-meanings-of-colours.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 4,
        "deletions": 3
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9ede76ebfee8cad5df7a1d99fc060448fb767e22"
  },
  {
    "hash": "8a03c78a2c7a8430281cbc088fd9511fa6e0e100",
    "short": "8a03c78",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T16:50:06-07:00",
    "subject": "Restore the Thought-Forms colour-key frontispiece image.",
    "body": "Replace the blank black key plate with the real Besant & Leadbeater chart and fall back to colorchart.jpg if it fails to load.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 6,
    "deletions": 0,
    "fileCount": 2,
    "files": [
      {
        "path": "public/numerology/thought-forms/key-to-meanings-of-colours.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 6,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/8a03c78a2c7a8430281cbc088fd9511fa6e0e100"
  },
  {
    "hash": "fbb79e100d43f5a3d099b6973939a4ffe91ee149",
    "short": "fbb79e1",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-16T15:26:43-07:00",
    "subject": "Fix Writing to IQ via same-origin API proxy.",
    "body": "Route the vocabulary IQ estimate through POST /api/writing-iq so Free mode no longer fails with Failed to fetch, and keep the High writing IQ disclaimer.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 217,
    "deletions": 86,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/AiDetectorApp.tsx",
        "additions": 9,
        "deletions": 13
      },
      {
        "path": "src/game/ai-detector/writingIq.ts",
        "additions": 151,
        "deletions": 70
      },
      {
        "path": "src/routeTree.gen.ts",
        "additions": 21,
        "deletions": 3
      },
      {
        "path": "src/routes/api/writing-iq.ts",
        "additions": 36,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/fbb79e100d43f5a3d099b6973939a4ffe91ee149"
  },
  {
    "hash": "8396c1dd071f94f5cdafa478bc8bef3a7579efc9",
    "short": "8396c1d",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-16T15:01:02-07:00",
    "subject": "Add Writing to IQ to the AI Detector with full source citation.",
    "body": "Call writingtoiq.com on every scan as a vocabulary IQ companion, cite the site and endpoint in the UI and REFS, and drop duplicate title-screen music credits.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 259,
    "deletions": 26,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/AiDetectorApp.tsx",
        "additions": 109,
        "deletions": 9
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 4,
        "deletions": 17
      },
      {
        "path": "src/game/ai-detector/writingIq.ts",
        "additions": 124,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/references.ts",
        "additions": 22,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/8396c1dd071f94f5cdafa478bc8bef3a7579efc9"
  },
  {
    "hash": "1e0f5052b16e5b488dffbcb1b3f103d12701465f",
    "short": "1e0f505",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-16T14:52:10-07:00",
    "subject": "Shorten the landing hero support line to the mode list.",
    "body": "Drop the neon-background explanation and keep only trivia, labs, heat, story, and tools.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 1,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/1e0f5052b16e5b488dffbcb1b3f103d12701465f"
  },
  {
    "hash": "d3770d8ec84a31b58213c0bb306a396a02a4917d",
    "short": "d3770d8",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-16T14:50:24-07:00",
    "subject": "Show Crystal Vista with Armageddon on Heat and title credits.",
    "body": "Heat Transfer and footer music lines now list both Iasos and aerzengel instead of Armageddon alone.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 9,
    "deletions": 5,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 9,
        "deletions": 5
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/d3770d8ec84a31b58213c0bb306a396a02a4917d"
  },
  {
    "hash": "2d82b542ad2d5931eb28658317f643bc4e60875a",
    "short": "2d82b54",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-16T14:49:44-07:00",
    "subject": "Merge branch 'main' of https://github.com/jonathandanangel/aero-flight-trivia",
    "body": "",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "human",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2d82b542ad2d5931eb28658317f643bc4e60875a"
  },
  {
    "hash": "1c3bbc8ae2c7e2adefb48617fcd1a050e92e217b",
    "short": "1c3bbc8",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-16T14:48:54-07:00",
    "subject": "Credit title and Heat music, and refresh the colour-key plate.",
    "body": "Show Iasos Crystal Vista and aerzengel Armageddon on the landing path, expand Heat Transfer channel credits, and replace the Thought-Forms key image.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 11,
    "deletions": 3,
    "fileCount": 3,
    "files": [
      {
        "path": "public/numerology/thought-forms/key-to-meanings-of-colours.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 4,
        "deletions": 1
      },
      {
        "path": "src/game/audio.ts",
        "additions": 7,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/1c3bbc8ae2c7e2adefb48617fcd1a050e92e217b"
  },
  {
    "hash": "34f5aa06b6d6f253549e66680ed74f945f3acc65",
    "short": "34f5aa0",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-16T21:41:44+00:00",
    "subject": "Added Portal 2 music credit",
    "body": "X-Lovable-Edit-ID: edt-9b089b76-bdf9-44db-8230-488ca2bf16b1\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/34f5aa06b6d6f253549e66680ed74f945f3acc65"
  },
  {
    "hash": "bf63fb7c0cd0ce93cde05d3c2827b6b61029cec0",
    "short": "bf63fb7",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-16T21:41:39+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/bf63fb7c0cd0ce93cde05d3c2827b6b61029cec0"
  },
  {
    "hash": "b5d32e1a90fa81087fb3b2ee09eb5ffd2721f7b1",
    "short": "b5d32e1",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-16T21:41:34+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 4,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 4,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b5d32e1a90fa81087fb3b2ee09eb5ffd2721f7b1"
  },
  {
    "hash": "f52107c6925682a8100d583361f17d14006565a0",
    "short": "f52107c",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-16T21:41:29+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 0,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f52107c6925682a8100d583361f17d14006565a0"
  },
  {
    "hash": "6f7b24ae3ae800f53e4b9b6769195fe3c56c93b8",
    "short": "6f7b24a",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-16T21:41:24+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 2,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 2,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6f7b24ae3ae800f53e4b9b6769195fe3c56c93b8"
  },
  {
    "hash": "879ad76a5500eb57f6b02655b690749c048577fb",
    "short": "879ad76",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-16T21:41:19+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 3,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/numerical-extreme/johnson-leme.ts",
        "additions": 3,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/879ad76a5500eb57f6b02655b690749c048577fb"
  },
  {
    "hash": "98c954d3f52b6220cd35efa5c6030dd367c7d410",
    "short": "98c954d",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-16T21:41:12+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/numerical-extreme/johnson-leme.ts",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/98c954d3f52b6220cd35efa5c6030dd367c7d410"
  },
  {
    "hash": "96d2a20eb08d2ad350fd382eeba54caaaf9d275c",
    "short": "96d2a20",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-16T21:41:05+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 8,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 8,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/96d2a20eb08d2ad350fd382eeba54caaaf9d275c"
  },
  {
    "hash": "0588fbf7630b8f51b36df896594f1280f2818d9d",
    "short": "0588fbf",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-16T14:37:46-07:00",
    "subject": "Rewrite title-screen copy for modes, intro, and hero path.",
    "body": "Replace blurbs and CTAs with the player-facing wording, drop button sub-lines, and tighten the photosensitivity notice.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 15,
    "deletions": 24,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 15,
        "deletions": 24
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/0588fbf7630b8f51b36df896594f1280f2818d9d"
  },
  {
    "hash": "dd95e0bdf3270bae8021a1516ea77daf8954be0c",
    "short": "dd95e0b",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-16T14:19:26-07:00",
    "subject": "Add Thought-Forms colour key as the scramble source for every path.",
    "body": "Wire Besant & Leadbeater page-cited plates, colour combinations, and the frontispiece key so Numerology always has a general source for word and number mixes.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1083,
    "deletions": 105,
    "fileCount": 73,
    "files": [
      {
        "path": "public/numerology/thought-forms/README.txt",
        "additions": 10,
        "deletions": 3
      },
      {
        "path": "public/numerology/thought-forms/book/manifest.json",
        "additions": 398,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p10_x150.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p11_x170.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p12_x190.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p13_x210.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p14_x230.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p15_x250.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p16_x270.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p17_x275.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p18_x295.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p19_x315.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p1_x898.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p20_x335.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p21_x355.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p22_x360.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p23_x380.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p24_x385.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p25_x390.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p26_x395.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p27_x415.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p28_x420.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p29_x440.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p2_x5.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p30_x460.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p31_x465.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p32_x470.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p33_x475.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p34_x480.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p35_x485.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p36_x490.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p37_x495.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p38_x515.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p39_x520.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p3_x25.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p40_x525.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p41_x530.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p42_x535.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p43_x540.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p44_x560.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p45_x565.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p46_x585.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p47_x590.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p48_x595.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p49_x615.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p4_x30.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p50_x620.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p51_x640.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p52_x660.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p53_x680.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p54_x685.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p55_x705.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p56_x710.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p57_x715.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p58_x735.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p59_x755.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p5_x50.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p60_x760.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p61_x780.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p62_x785.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p63_x805.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p64_x810.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p65_x830.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p66_x850.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p6_x70.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p7_x90.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p8_x110.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/book/p9_x130.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/key-to-meanings-of-colours.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 116,
        "deletions": 20
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 14,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/references.ts",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/game/numerical-extreme/thought-forms.ts",
        "additions": 543,
        "deletions": 80
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/dd95e0bdf3270bae8021a1516ea77daf8954be0c"
  },
  {
    "hash": "b06f5eda52a757aa26b5f88197f1a66f5b6b2f57",
    "short": "b06f5ed",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-16T13:55:56-07:00",
    "subject": "Enrich numerology quotes with Blavatsky, Plato, and Euclid.",
    "body": "Keep Johnson definitions, Secret Doctrine search, and Greek Myths as-is; thicken tradition cards with SD Power of Numbers / Hebdomad lines, Timaeus, and Euclid perfect-number text, and refresh REFS accordingly.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 50,
    "deletions": 43,
    "fileCount": 2,
    "files": [
      {
        "path": "src/game/numerical-extreme/philosopher-numbers.ts",
        "additions": 30,
        "deletions": 30
      },
      {
        "path": "src/game/numerical-extreme/references.ts",
        "additions": 20,
        "deletions": 13
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b06f5eda52a757aa26b5f88197f1a66f5b6b2f57"
  },
  {
    "hash": "f1b568207311fd4edc2ea37ae386516e2ff0c96f",
    "short": "f1b5682",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-16T13:53:45-07:00",
    "subject": "Quote Ruckman Bible Numerics harshly and balance with Avicenna.",
    "body": "Keep attributed Bible Numerics readings (including death/hell-type five and Antichrist six) as quotes opposite Avicenna Healing/Canon lines, and update REFS plus disclaimers so sources stay accurate.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 49,
    "deletions": 45,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 4,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/philosopher-numbers.ts",
        "additions": 27,
        "deletions": 27
      },
      {
        "path": "src/game/numerical-extreme/references.ts",
        "additions": 18,
        "deletions": 18
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f1b568207311fd4edc2ea37ae386516e2ff0c96f"
  },
  {
    "hash": "9ebcaa61efa0820f63b3c1722ee269bfd47812ae",
    "short": "9ebcaa6",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-16T13:51:49-07:00",
    "subject": "Replace numerology paraphrases with primary-source quotations.",
    "body": "Wire real Nicomachus, Hall, Aristotle, Aquinas, Avicenna, Ruckman×KJV, and Thought-Forms lines for digits 1–9, and show the creator disclaimer that these views (and LLMs) are not endorsed.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 138,
    "deletions": 123,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 4,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/numerology.ts",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/philosopher-numbers.ts",
        "additions": 132,
        "deletions": 123
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9ebcaa61efa0820f63b3c1722ee269bfd47812ae"
  },
  {
    "hash": "9b4f281a3a066d65b62342eb08547dca1c9ff585",
    "short": "9b4f281",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T12:54:23-07:00",
    "subject": "Calibrate free detector: student prose human, ChatGPT pitches AI.",
    "body": "Expand authenticity checks for memoir/typo voice, add LLM pitch/outline fingerprints (Title Concept, three-act, “let me know”), and only apply human-noise veto when pitch signals are weak.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 171,
    "deletions": 40,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/AiDetectorApp.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 170,
        "deletions": 39
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9b4f281a3a066d65b62342eb08547dca1c9ff585"
  },
  {
    "hash": "7afdcdc8c4389c12b3f5438497e19d09ed2c66cc",
    "short": "7afdcdc",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T12:07:13-07:00",
    "subject": "Stop GPTZero-style twin false AI on human essays.",
    "body": "Recalibrate self-perplexity so mid scores stay human unless both ppl and burst are extreme; expand authenticity checks (textspeak, its/it's, memoir voice) and dampen twin under human-noise veto.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 77,
    "deletions": 28,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 77,
        "deletions": 28
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/7afdcdc8c4389c12b3f5438497e19d09ed2c66cc"
  },
  {
    "hash": "60285b4871713f7c0d29cf0efe967bf82b609488",
    "short": "60285b4",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T11:51:35-07:00",
    "subject": "Cut free-detector false AI flags on human student writing.",
    "body": "Add a human-noise authenticity check (typos, doubled words, informal voice) with veto weighting, and soften older neural leans so passages like the 1920s slideshow blurb score human.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 156,
    "deletions": 44,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/AiDetectorApp.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 155,
        "deletions": 43
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/60285b4871713f7c0d29cf0efe967bf82b609488"
  },
  {
    "hash": "84f4af6f2403cc668065d6daedce43bdf61f101a",
    "short": "84f4af6",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T11:36:36-07:00",
    "subject": "Make free AI Detector follow a GPTZero-style strategy.",
    "body": "Add a perplexity+burstiness twin, three ONNX neural detectors, and neural-weighted consensus so free mode can classify without vendor API keys.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 451,
    "deletions": 141,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/AiDetectorApp.tsx",
        "additions": 11,
        "deletions": 10
      },
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 440,
        "deletions": 131
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/84f4af6f2403cc668065d6daedce43bdf61f101a"
  },
  {
    "hash": "8f5de414e4b443cdc138bf0ce3ea9ec04495adf4",
    "short": "8f5de41",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T11:12:12-07:00",
    "subject": "Stress mechanistic usefulness on Numerical Extreme references.",
    "body": "Note that the toolbox prioritizes runnable methods and inspectable lab controls over decorative chrome.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 4,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 4,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/8f5de414e4b443cdc138bf0ce3ea9ec04495adf4"
  },
  {
    "hash": "c1a97b462ec8b65385baac8b2ff728d5e77dec2b",
    "short": "c1a97b4",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T11:11:09-07:00",
    "subject": "Note AI-assisted references and MATLAB/Octave use in the toolbox.",
    "body": "Add a bottom disclaimer on the Numerical Extreme references panel clarifying that listed sources were used in creation, including MATLAB and Octave work.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 5,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 5,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/c1a97b462ec8b65385baac8b2ff728d5e77dec2b"
  },
  {
    "hash": "cd7e389c6cc5fbb6f646374a5571e2f58734e607",
    "short": "cd7e389",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T11:10:07-07:00",
    "subject": "Add free no-key AI Detector multi-scan mode.",
    "body": "Run HC3 RoBERTa in-browser plus five stylometric scanners so paste-and-scan works without vendor API keys; keep keyed API mode optional.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1482,
    "deletions": 118,
    "fileCount": 5,
    "files": [
      {
        "path": "package-lock.json",
        "additions": 984,
        "deletions": 24
      },
      {
        "path": "package.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "src/components/game/AiDetectorApp.tsx",
        "additions": 139,
        "deletions": 92
      },
      {
        "path": "src/game/ai-detector/freeEnsemble.ts",
        "additions": 356,
        "deletions": 0
      },
      {
        "path": "src/game/ai-detector/types.ts",
        "additions": 2,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/cd7e389c6cc5fbb6f646374a5571e2f58734e607"
  },
  {
    "hash": "7612c63e5c38905b38547981dd170953d24eceeb",
    "short": "7612c63",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T11:05:52-07:00",
    "subject": "Fix duplicate type re-export in WasItAI detector module.",
    "body": "Co-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 0,
    "deletions": 3,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/ai-detector/wasitai.ts",
        "additions": 0,
        "deletions": 3
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/7612c63e5c38905b38547981dd170953d24eceeb"
  },
  {
    "hash": "9cd9212700ded389ea5225431a9124b7af32b5a7",
    "short": "9cd9212",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T11:05:41-07:00",
    "subject": "Add multi-scan AI Detector under Settings & validation.",
    "body": "Wire six remote detectors (WasItAI, GPTZero, Sapling, Winston, ZeroGPT, Originality) with session keys, parallel ensemble consensus, and clear messaging that scans need valid vendor keys.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1130,
    "deletions": 5,
    "fileCount": 6,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 32,
        "deletions": 4
      },
      {
        "path": "src/components/game/AiDetectorApp.tsx",
        "additions": 265,
        "deletions": 0
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 10,
        "deletions": 1
      },
      {
        "path": "src/game/ai-detector/ensemble.ts",
        "additions": 370,
        "deletions": 0
      },
      {
        "path": "src/game/ai-detector/types.ts",
        "additions": 200,
        "deletions": 0
      },
      {
        "path": "src/game/ai-detector/wasitai.ts",
        "additions": 253,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9cd9212700ded389ea5225431a9124b7af32b5a7"
  },
  {
    "hash": "983a13f1dbcfba6dee2ec7ede43030b343125b00",
    "short": "983a13f",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T04:29:06-07:00",
    "subject": "Thin the Legend of Triangles Main menu button.",
    "body": "Match the shared boxy outline and frosted glass treatment used by other mode chrome.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/983a13f1dbcfba6dee2ec7ede43030b343125b00"
  },
  {
    "hash": "723fb3a06103d3c02009dc4b07cb95db7ec9817f",
    "short": "723fb3a",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T03:53:56-07:00",
    "subject": "Match title frosted-glass blur on every mode main frame.",
    "body": "Use the same translucent fill and stronger backdrop blur across campaign, Extreme, Heat, Legend, Numerical Extreme, and Vanity frames.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 49,
    "deletions": 49,
    "fileCount": 23,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/Diagram.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/ExtremeBriefing.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/ExtremeV2Briefing.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/ExtremeV2Review.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/Finale.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/HeatTransferExtremeBriefing.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/HeatTransferExtremeReview.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/HeatTransferIntroBriefing.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/HeatTransferIntroReview.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 5,
        "deletions": 5
      },
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 4,
        "deletions": 4
      },
      {
        "path": "src/components/game/VanityApp.tsx",
        "additions": 7,
        "deletions": 7
      },
      {
        "path": "src/components/game/numerical-extreme/Chart.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/numerical-extreme/ui.tsx",
        "additions": 3,
        "deletions": 3
      },
      {
        "path": "src/components/game/spirit-bound/Battle.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/spirit-bound/EggHatchIntro.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/spirit-bound/ExtremePuzzle.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/reason/ReasonTrial.tsx",
        "additions": 3,
        "deletions": 3
      },
      {
        "path": "src/components/game/spirit-bound/shrine/ArcadeTree.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/shrine/LondonDoctrineGate.tsx",
        "additions": 4,
        "deletions": 4
      },
      {
        "path": "src/components/game/spirit-bound/shrine/ShrineTrial.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/723fb3a06103d3c02009dc4b07cb95db7ec9817f"
  },
  {
    "hash": "eab3ed4e5be485f6dd867e6e72e418779b418eae",
    "short": "eab3ed4",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T03:53:12-07:00",
    "subject": "Restore frosted glass blur on main frames across every mode.",
    "body": "Keep translucent panel fills with stronger backdrop blur so title, campaign, Extreme, Heat, Legend, Numerical Extreme, and Vanity chrome match.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 9,
    "deletions": 8,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/styles.css",
        "additions": 8,
        "deletions": 7
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/eab3ed4e5be485f6dd867e6e72e418779b418eae"
  },
  {
    "hash": "ab799a46b597476fbba3f2be40cafae3c124f8ce",
    "short": "ab799a4",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T03:52:50-07:00",
    "subject": "Apply frosted glass fills to main frames in every mode.",
    "body": "Match the title-screen blurry glass on campaign, Extreme, Heat, Legend, Numerical Extreme, and Vanity chrome so outline boxes share the same translucent look.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 85,
    "deletions": 60,
    "fileCount": 26,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/Diagram.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/ExtremeBriefing.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/ExtremeV2Briefing.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/ExtremeV2Review.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/Finale.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/HeatTransferExtremeBriefing.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/HeatTransferExtremeReview.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/HeatTransferIntroBriefing.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/HeatTransferIntroReview.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 5,
        "deletions": 5
      },
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 4,
        "deletions": 4
      },
      {
        "path": "src/components/game/VanityApp.tsx",
        "additions": 8,
        "deletions": 8
      },
      {
        "path": "src/components/game/numerical-extreme/Chart.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/numerical-extreme/ui.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/Battle.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/DialogueBox.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/spirit-bound/EggHatchIntro.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/spirit-bound/ExtremePuzzle.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/reason/ReasonTrial.tsx",
        "additions": 3,
        "deletions": 3
      },
      {
        "path": "src/components/game/spirit-bound/shrine/ArcadeTree.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/shrine/CutscenePlayer.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/spirit-bound/shrine/LondonDoctrineGate.tsx",
        "additions": 4,
        "deletions": 4
      },
      {
        "path": "src/components/game/spirit-bound/shrine/ShrineTrial.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/styles.css",
        "additions": 33,
        "deletions": 8
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ab799a46b597476fbba3f2be40cafae3c124f8ce"
  },
  {
    "hash": "a192ae701c9f88b232c645f725fce2e46d94be60",
    "short": "a192ae7",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T03:48:38-07:00",
    "subject": "Unify thin boxy outlines across every mode and game chrome.",
    "body": "Match intro/landing panel radius and shadow quality on panels, labs, Heat, Legend, Numerical Extreme, and Vanity so outline boxes read the same everywhere.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 144,
    "deletions": 101,
    "fileCount": 30,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/Diagram.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/ExtremeBriefing.tsx",
        "additions": 3,
        "deletions": 3
      },
      {
        "path": "src/components/game/ExtremeV2Briefing.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/ExtremeV2Review.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/Finale.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/HeatTransferChapterJump.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/HeatTransferExtremeBriefing.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/HeatTransferExtremeReview.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/HeatTransferIntroBriefing.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/HeatTransferIntroReview.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/Interactions.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 24,
        "deletions": 24
      },
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 4,
        "deletions": 4
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/VanityApp.tsx",
        "additions": 14,
        "deletions": 14
      },
      {
        "path": "src/components/game/numerical-extreme/Chart.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/numerical-extreme/HeatAerospacePanel.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/numerical-extreme/ui.tsx",
        "additions": 7,
        "deletions": 7
      },
      {
        "path": "src/components/game/spirit-bound/Battle.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/spirit-bound/EggHatchIntro.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/spirit-bound/ExtremePuzzle.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/reason/ReasonTrial.tsx",
        "additions": 3,
        "deletions": 3
      },
      {
        "path": "src/components/game/spirit-bound/reason/StatementCard.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/spirit-bound/shrine/ArcadeTree.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/shrine/CutscenePlayer.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/spirit-bound/shrine/LondonDoctrineGate.tsx",
        "additions": 4,
        "deletions": 4
      },
      {
        "path": "src/components/game/spirit-bound/shrine/ShrineTrial.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/styles.css",
        "additions": 56,
        "deletions": 13
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/a192ae701c9f88b232c645f725fce2e46d94be60"
  },
  {
    "hash": "4d5e4ff95c73e0c0cb9d2d4fdd3198c67b2b9833",
    "short": "4d5e4ff",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T03:32:46-07:00",
    "subject": "Smooth title-brain crossfades between neon variants.",
    "body": "Fade out before swapping the winged-brain look, then fade back in on intro and landing so color cycles feel continuous.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 56,
    "deletions": 30,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 34,
        "deletions": 15
      },
      {
        "path": "src/styles.css",
        "additions": 22,
        "deletions": 15
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4d5e4ff95c73e0c0cb9d2d4fdd3198c67b2b9833"
  },
  {
    "hash": "ad1766e2ca72805b9b493fa1da9df5a0bc40bc8b",
    "short": "ad1766e",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T03:29:09-07:00",
    "subject": "Restore cyan chrome for Numerical Extreme in-game shell.",
    "body": "Drop the shared magenta extreme-shell glow so Numerical Extreme stays electric cyan after launch while title-menu red accents remain.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 2,
    "deletions": 2,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/styles.css",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ad1766e2ca72805b9b493fa1da9df5a0bc40bc8b"
  },
  {
    "hash": "886dd5a19ddbdb2f8a05dacf811762565b07001f",
    "short": "886dd5a",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T03:26:58-07:00",
    "subject": "Polish title intro: tap-only start, cycling brains, electric cyan type.",
    "body": "Hold the dark splash until tap, rotate neon brain looks while waiting, and brighten ZEUS AMMON-RA 11 with a stronger electric glow.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 22,
    "deletions": 9,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 11,
        "deletions": 9
      },
      {
        "path": "src/styles.css",
        "additions": 11,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/886dd5a19ddbdb2f8a05dacf811762565b07001f"
  },
  {
    "hash": "6aa0d77a6d411bcd59d476dbdb4b30b1601b9e9e",
    "short": "6aa0d77",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T03:20:19-07:00",
    "subject": "Add neon scroll landing with brain splash and color-coded modes.",
    "body": "Replace the flat title menu with a full-dark brain intro, Apple-style mode sections, and keep the same mode entry wiring and photosensitivity credits.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 450,
    "deletions": 99,
    "fileCount": 4,
    "files": [
      {
        "path": "public/brand/zeus-ammon-ra-11-logo.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 7,
        "deletions": 1
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 326,
        "deletions": 93
      },
      {
        "path": "src/styles.css",
        "additions": 117,
        "deletions": 5
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6aa0d77a6d411bcd59d476dbdb4b30b1601b9e9e"
  },
  {
    "hash": "ee1e602834f89bb9ed0116cb8517d12d76012e2a",
    "short": "ee1e602",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T03:00:06-07:00",
    "subject": "Add Capacitor Android shell for the live Lovable app.",
    "body": "Wrap https://aero-flight-trivia.lovable.app in a native WebView project so an APK can be built with Android Studio or Gradle.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 2065,
    "deletions": 26,
    "fileCount": 58,
    "files": [
      {
        "path": ".gitignore",
        "additions": 12,
        "deletions": 0
      },
      {
        "path": "android/.gitignore",
        "additions": 101,
        "deletions": 0
      },
      {
        "path": "android/app/.gitignore",
        "additions": 2,
        "deletions": 0
      },
      {
        "path": "android/app/build.gradle",
        "additions": 54,
        "deletions": 0
      },
      {
        "path": "android/app/capacitor.build.gradle",
        "additions": 20,
        "deletions": 0
      },
      {
        "path": "android/app/proguard-rules.pro",
        "additions": 21,
        "deletions": 0
      },
      {
        "path": "android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java",
        "additions": 26,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/AndroidManifest.xml",
        "additions": 41,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/java/com/zeusammonra/aeroflighttrivia/MainActivity.java",
        "additions": 5,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/drawable-land-hdpi/splash.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/drawable-land-mdpi/splash.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/drawable-land-xhdpi/splash.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/drawable-land-xxhdpi/splash.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/drawable-land-xxxhdpi/splash.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/drawable-port-hdpi/splash.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/drawable-port-mdpi/splash.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/drawable-port-xhdpi/splash.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/drawable-port-xxhdpi/splash.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/drawable-port-xxxhdpi/splash.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/drawable-v24/ic_launcher_foreground.xml",
        "additions": 34,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/drawable/ic_launcher_background.xml",
        "additions": 170,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/drawable/splash.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/layout/activity_main.xml",
        "additions": 12,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml",
        "additions": 5,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml",
        "additions": 5,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-hdpi/ic_launcher.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-mdpi/ic_launcher.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-xhdpi/ic_launcher.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/values/ic_launcher_background.xml",
        "additions": 4,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/values/strings.xml",
        "additions": 7,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/values/styles.xml",
        "additions": 22,
        "deletions": 0
      },
      {
        "path": "android/app/src/main/res/xml/file_paths.xml",
        "additions": 5,
        "deletions": 0
      },
      {
        "path": "android/app/src/test/java/com/getcapacitor/myapp/ExampleUnitTest.java",
        "additions": 18,
        "deletions": 0
      },
      {
        "path": "android/build.gradle",
        "additions": 29,
        "deletions": 0
      },
      {
        "path": "android/capacitor.settings.gradle",
        "additions": 9,
        "deletions": 0
      },
      {
        "path": "android/gradle.properties",
        "additions": 22,
        "deletions": 0
      },
      {
        "path": "android/gradle/wrapper/gradle-wrapper.jar",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "android/gradle/wrapper/gradle-wrapper.properties",
        "additions": 7,
        "deletions": 0
      },
      {
        "path": "android/gradlew",
        "additions": 251,
        "deletions": 0
      },
      {
        "path": "android/gradlew.bat",
        "additions": 94,
        "deletions": 0
      },
      {
        "path": "android/settings.gradle",
        "additions": 5,
        "deletions": 0
      },
      {
        "path": "android/variables.gradle",
        "additions": 16,
        "deletions": 0
      },
      {
        "path": "capacitor.config.ts",
        "additions": 26,
        "deletions": 0
      },
      {
        "path": "package-lock.json",
        "additions": 1015,
        "deletions": 25
      },
      {
        "path": "package.json",
        "additions": 9,
        "deletions": 1
      },
      {
        "path": "www/index.html",
        "additions": 18,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ee1e602834f89bb9ed0116cb8517d12d76012e2a"
  },
  {
    "hash": "0e73cc1339574556be3cf3eb019e7a2c6fa7a357",
    "short": "0e73cc1",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T02:29:32-07:00",
    "subject": "Document Vanity App data flow behind a More info control.",
    "body": "Spell out session-only credentials, Face++ Detect handoff, local scoring, optional report download, and what is not persisted.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 111,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/VanityApp.tsx",
        "additions": 111,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/0e73cc1339574556be3cf3eb019e7a2c6fa7a357"
  },
  {
    "hash": "45de0c4ead4fe6c0ed8581ecc2cf943caff01611",
    "short": "45de0c4",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T02:26:34-07:00",
    "subject": "Note Vanity App keeps session-only mechanistic use.",
    "body": "Show that the app does not save user data or API credentials and only runs local Face++ batch mechanics.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 19,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/VanityApp.tsx",
        "additions": 19,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/45de0c4ead4fe6c0ed8581ecc2cf943caff01611"
  },
  {
    "hash": "1d4bfc1d0af044429ce53d3a5215f7b4d7b648b9",
    "short": "1d4bfc1",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T02:18:13-07:00",
    "subject": "Add long-game rarity splash for skilled masters.",
    "body": "Contrast the one-shot 10³⁹ line with a joke splash for brute-force clears at about 1 in 10⁵.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/spirit-bound/MinecraftSplash.tsx",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/1d4bfc1d0af044429ce53d3a5215f7b4d7b648b9"
  },
  {
    "hash": "8aed1b571fb4470b675620159ce0f190c25c31fd",
    "short": "8aed1b5",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T02:12:24-07:00",
    "subject": "Cycle Legend of Triangles splash lines at random.",
    "body": "Rotate Minecraft-style title splashes through the rarity line and new flavor blurbs without repeating the same line twice in a row.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 20,
    "deletions": 13,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/spirit-bound/MinecraftSplash.tsx",
        "additions": 19,
        "deletions": 9
      },
      {
        "path": "src/components/game/spirit-bound/SplashIntro.tsx",
        "additions": 1,
        "deletions": 4
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/8aed1b571fb4470b675620159ce0f190c25c31fd"
  },
  {
    "hash": "33bb471c6e444dea060e959186592ddee9d59124",
    "short": "33bb471",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T02:06:21-07:00",
    "subject": "Add Minecraft-style rarity splash to Legend of Triangles.",
    "body": "Show a pulsing yellow title splash (including 1 in 10³⁹ beat rarity) on the intro and title menu.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 131,
    "deletions": 5,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 6,
        "deletions": 3
      },
      {
        "path": "src/components/game/spirit-bound/MinecraftSplash.tsx",
        "additions": 50,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/SplashIntro.tsx",
        "additions": 8,
        "deletions": 1
      },
      {
        "path": "src/styles.css",
        "additions": 67,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/33bb471c6e444dea060e959186592ddee9d59124"
  },
  {
    "hash": "59850538f98dcd32fc32bcadd5f590a3c83b0159",
    "short": "5985053",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T01:31:32-07:00",
    "subject": "Enrich sacred geometry glyphs with classical constructions and wire RWS tarot.",
    "body": "Redraw 1–9 figures (vesica lens, tetractys, golden nested pentagon, seed of life, isometric cube, enneagon) and show Rider–Waite–Smith major-arcana images beside each path number.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 368,
    "deletions": 74,
    "fileCount": 13,
    "files": [
      {
        "path": "public/numerology/tarot/major-01.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/tarot/major-02.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/tarot/major-03.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/tarot/major-04.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/tarot/major-05.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/tarot/major-06.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/tarot/major-07.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/tarot/major-08.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/tarot/major-09.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/tarot/manifest.json",
        "additions": 41,
        "deletions": 0
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 294,
        "deletions": 52
      },
      {
        "path": "src/game/numerical-extreme/numerology.ts",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/philosopher-numbers.ts",
        "additions": 22,
        "deletions": 22
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/59850538f98dcd32fc32bcadd5f590a3c83b0159"
  },
  {
    "hash": "cd83ce07c2209135d38e8fbb789026b56f2b80ac",
    "short": "cd83ce0",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T01:11:41-07:00",
    "subject": "Improve Secret Doctrine matching like Greek Myths and catalog Numerology refs.",
    "body": "Share anagram/scramble/similar-letter search for Blavatsky and Graves, wire both panels, and list all Numerology people and source books under REFS.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 679,
    "deletions": 89,
    "fileCount": 80,
    "files": [
      {
        "path": "public/greek-myths/index/a.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/b.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/c.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/d.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/e.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/f.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/g.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/h.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/i.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/j.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/k.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/l.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/m.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/n.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/o.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/p.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/q.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/r.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/s.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/t.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/u.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/v.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/w.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/x.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/y.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/index/z.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/10.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/11.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/12.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/13.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/14.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/15.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/16.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/17.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/18.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/19.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/3.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/4.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/5.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/6.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/7.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/8.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/lengths/9.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/manifest.json",
        "additions": 10,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/passages-000.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/passages-001.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/passages-002.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/passages-003.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/passages-004.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/passages-005.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/passages-006.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/passages-007.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/a.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/b.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/c.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/d.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/e.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/f.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/g.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/h.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/i.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/j.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/k.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/l.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/m.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/n.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/o.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/p.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/r.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/greek-myths/signatures/s.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/lengths/10.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/lengths/11.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/lengths/12.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/lengths/13.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/lengths/14.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/lengths/15.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/lengths/16.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/lengths/17.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/lengths/18.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/lengths/19.json",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/cd83ce07c2209135d38e8fbb789026b56f2b80ac"
  },
  {
    "hash": "8c11a479ac88f59741adac7e9a8a8e4a4857efd3",
    "short": "8c11a47",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T01:00:54-07:00",
    "subject": "Remove unused Johnson lookup import after 1773 dual-edition wiring.",
    "body": "Co-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 0,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 0,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/8c11a479ac88f59741adac7e9a8a8e4a4857efd3"
  },
  {
    "hash": "a53863348b102b228db8b40bc9b1d869a918c449",
    "short": "a538633",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T01:00:13-07:00",
    "subject": "Add Johnson 1773 fourth-edition definitions beside 1755.",
    "body": "Download and index the public-domain 1773 StarDict/JDO text so Numerology can show both first-edition and fourth-edition senses for the typed word.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 288,
    "deletions": 41,
    "fileCount": 33,
    "files": [
      {
        "path": ".gitignore",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "package.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773-manifest.json",
        "additions": 6,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/A.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/B.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/C.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/D.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/E.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/F.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/G.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/H.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/I.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/J.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/K.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/L.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/M.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/N.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/O.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/P.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/Q.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/R.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/S.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/T.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/U.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/V.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/W.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/X.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/Y.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon-1773/Z.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "scripts/build-johnson-1773.py",
        "additions": 134,
        "deletions": 0
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 34,
        "deletions": 13
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/game/numerical-extreme/johnson-leme.ts",
        "additions": 84,
        "deletions": 26
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/a53863348b102b228db8b40bc9b1d869a918c449"
  },
  {
    "hash": "aeccb76cbfa97100c27f50cb69c4406a2134b3d0",
    "short": "aeccb76",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T00:50:51-07:00",
    "subject": "Cross-reference Ruckman Bible Numerics with 1611 KJV verses.",
    "body": "When Ruckman cites Scripture for the word’s path number, show the exact King James text from the 1611 KJV+Apocrypha PDF—cited verses only.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 623,
    "deletions": 2,
    "fileCount": 8,
    "files": [
      {
        "path": ".gitignore",
        "additions": 3,
        "deletions": 0
      },
      {
        "path": "package.json",
        "additions": 2,
        "deletions": 1
      },
      {
        "path": "public/kjv/manifest.json",
        "additions": 6,
        "deletions": 0
      },
      {
        "path": "public/kjv/ruckman-cited.json",
        "additions": 257,
        "deletions": 0
      },
      {
        "path": "scripts/build-kjv-ruckman.py",
        "additions": 267,
        "deletions": 0
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 42,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 2,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/ruckman-kjv.ts",
        "additions": 44,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/aeccb76cbfa97100c27f50cb69c4406a2134b3d0"
  },
  {
    "hash": "085eff76fed7530f4aeb82bcf742312d38d2afe8",
    "short": "085eff7",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T00:47:54-07:00",
    "subject": "Add Secret Doctrine passages for typed Numerology words.",
    "body": "Index Blavatsky’s public-domain text and surface matching (or close-form) passages ranked for occult and path-number relevance beside Johnson definitions.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 586,
    "deletions": 35,
    "fileCount": 50,
    "files": [
      {
        "path": "package.json",
        "additions": 2,
        "deletions": 1
      },
      {
        "path": "public/secret-doctrine/index/_.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/a.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/b.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/c.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/d.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/e.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/f.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/g.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/h.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/i.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/j.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/k.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/l.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/m.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/n.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/o.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/p.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/q.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/r.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/s.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/t.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/u.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/v.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/w.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/x.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/y.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/index/z.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/manifest.json",
        "additions": 9,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-000.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-001.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-002.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-003.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-004.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-005.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-006.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-007.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-008.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-009.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-010.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-011.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-012.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-013.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-014.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/secret-doctrine/passages-015.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "scripts/build-secret-doctrine.py",
        "additions": 185,
        "deletions": 0
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 131,
        "deletions": 29
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 2,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/numerology.ts",
        "additions": 0,
        "deletions": 5
      },
      {
        "path": "src/game/numerical-extreme/secret-doctrine.ts",
        "additions": 214,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/085eff76fed7530f4aeb82bcf742312d38d2afe8"
  },
  {
    "hash": "562a72260fb037c280517a577282e413f8d8d25b",
    "short": "562a722",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T00:35:02-07:00",
    "subject": "Add Johnson 1755 lexicon and UCF facsimile to Numerology.",
    "body": "Load 37k LEME headwords by letter bucket for the typed word, show full senses and path-digit entry, and display UCF zip scan images when extracted (partial 107-page archive).\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 662,
    "deletions": 9,
    "fileCount": 38,
    "files": [
      {
        "path": ".gitignore",
        "additions": 7,
        "deletions": 0
      },
      {
        "path": "package.json",
        "additions": 2,
        "deletions": 1
      },
      {
        "path": "public/johnson/facsimile/manifest.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "public/johnson/facsimile/page-0001.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/johnson/facsimile/page-0066.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/johnson/hocr-page-estimates.json",
        "additions": 9,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/'.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/A.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/B.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/C.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/D.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/E.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/F.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/G.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/H.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/I.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/J.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/K.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/L.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/M.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/N.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/O.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/P.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/Q.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/R.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/S.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/T.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/U.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/V.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/W.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/Y.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/lexicon/Z.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "public/johnson/page-index.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "scripts/build-johnson-assets.py",
        "additions": 265,
        "deletions": 0
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 156,
        "deletions": 4
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 3,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/johnson-leme.ts",
        "additions": 171,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/numerology.ts",
        "additions": 11,
        "deletions": 4
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/562a72260fb037c280517a577282e413f8d8d25b"
  },
  {
    "hash": "dcaf2f50faa185b59431528711c1aefa7d9b53ba",
    "short": "dcaf2f5",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T00:12:36-07:00",
    "subject": "Show only the word’s numerology result, not the full 1–9 encyclopedia.",
    "body": "Drop the all-numbers lore dump and full Thought-Forms gallery; keep path, tarot, geometry, traditions, and a few plates that match the resolved number, with leaner Johnson expansions.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 53,
    "deletions": 108,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 50,
        "deletions": 107
      },
      {
        "path": "src/game/numerical-extreme/numerology.ts",
        "additions": 3,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/dcaf2f50faa185b59431528711c1aefa7d9b53ba"
  },
  {
    "hash": "9418026a76935edd9c126cd9cccea835b480dbdd",
    "short": "9418026",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-16T00:05:43-07:00",
    "subject": "Add Pythagorean geometry, Theosophy colours, and Thought-Forms plates to Numerology.",
    "body": "Tint each digit’s sacred figure with the Blavatsky prismatic scale, add Theosophical Society form/vibration lore, and show official Besant & Leadbeater public-domain plates (colour key, Chladni, pendulums, music forms).\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 655,
    "deletions": 17,
    "fileCount": 17,
    "files": [
      {
        "path": "public/numerology/thought-forms/README.txt",
        "additions": 15,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/colorchart.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/fig1.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/fig2.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/fig3.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/fig40.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/fig41.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/figg.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/figm.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/figs4-7.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/figs44-47.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/numerology/thought-forms/figw.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 319,
        "deletions": 13
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 7,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/numerology.ts",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/philosopher-numbers.ts",
        "additions": 141,
        "deletions": 3
      },
      {
        "path": "src/game/numerical-extreme/thought-forms.ts",
        "additions": 172,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9418026a76935edd9c126cd9cccea835b480dbdd"
  },
  {
    "hash": "c3350ea49ecbb0ddcecbc5fc4466c91453389fdd",
    "short": "c3350ea",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T23:58:22-07:00",
    "subject": "Fix Numerology tab crash in formatPhilosophyBlock report builder.",
    "body": "The flatMap-based formatter threw during render when building the telemetry report; use a simple map/join so the Numerology panel loads without hitting the root error boundary.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 10,
    "deletions": 11,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/numerical-extreme/philosopher-numbers.ts",
        "additions": 10,
        "deletions": 11
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/c3350ea49ecbb0ddcecbc5fc4466c91453389fdd"
  },
  {
    "hash": "97df013981a725e8b517e7b4e8f04c8a797a1717",
    "short": "97df013",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T23:49:10-07:00",
    "subject": "Add unified numerology traditions for digits 1–9 including Ruckman.",
    "body": "Group Pythagoras, Hall, Aristotle, Aquinas, Avicenna, and Dr. Peter S. Ruckman’s Bible Numerics (1981) per number in the Numerology panel, reports, and Johnson expansions.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 498,
    "deletions": 10,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 92,
        "deletions": 8
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 13,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/numerology.ts",
        "additions": 22,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/philosopher-numbers.ts",
        "additions": 371,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/97df013981a725e8b517e7b4e8f04c8a797a1717"
  },
  {
    "hash": "bffefaad2c75815ca2d8c0b47149729b530ea69a",
    "short": "bffefaa",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T23:40:13-07:00",
    "subject": "Unify Numerical Extreme graph interval inputs for negative A/B entry.",
    "body": "Add GraphBoundsFields and DraftNumberInput so MAIN, VECTOR, integration, symbolic, and genetic tabs all accept minus signs while typing graph bounds and secant seeds.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 104,
    "deletions": 53,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 42,
        "deletions": 53
      },
      {
        "path": "src/components/game/numerical-extreme/ui.tsx",
        "additions": 62,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/bffefaad2c75815ca2d8c0b47149729b530ea69a"
  },
  {
    "hash": "225920f7ea3e8c3a29ab15b907f94fbdbd9a698f",
    "short": "225920f",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T23:38:32-07:00",
    "subject": "Let Numerical Extreme accept negative numbers while typing in bound fields.",
    "body": "Add BoundNumberInput so a leading minus sign no longer snaps A/B and other numeric inputs to 0 mid-entry.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 165,
    "deletions": 191,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 44,
        "deletions": 141
      },
      {
        "path": "src/components/game/numerical-extreme/HeatAerospacePanel.tsx",
        "additions": 31,
        "deletions": 50
      },
      {
        "path": "src/components/game/numerical-extreme/ui.tsx",
        "additions": 90,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/225920f7ea3e8c3a29ab15b907f94fbdbd9a698f"
  },
  {
    "hash": "20a93e9f1ef8274e4e0b093751fd8a6548cd9da1",
    "short": "20a93e9",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T22:07:39-07:00",
    "subject": "Mute Extreme Puzzle success SFX so correct items stay silent.",
    "body": "Co-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/spirit-bound/ExtremePuzzle.tsx",
        "additions": 1,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/20a93e9f1ef8274e4e0b093751fd8a6548cd9da1"
  },
  {
    "hash": "89dd5c2e980fadccfe565f7353a65ed1cab7ab3b",
    "short": "89dd5c2",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T22:01:55-07:00",
    "subject": "Drop Extreme Puzzle scare backdrop and replace file beds with custom chiptune.",
    "body": "Keep pure Legend of Triangles gold UI, silence title/HT MP3 playlists on entry, and drive Extreme Puzzle with an original Web Audio retro theme only.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 40,
    "deletions": 319,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 4
      },
      {
        "path": "src/components/game/spirit-bound/ExtremePuzzle.tsx",
        "additions": 3,
        "deletions": 293
      },
      {
        "path": "src/game/audio.ts",
        "additions": 13,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/audio.ts",
        "additions": 23,
        "deletions": 22
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/89dd5c2e980fadccfe565f7353a65ed1cab7ab3b"
  },
  {
    "hash": "835049f4e8542b3665376e5485f0d811de4c20b4",
    "short": "835049f",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T21:51:33-07:00",
    "subject": "Use golden Legend UI over a full scary Extreme Puzzle backdrop.",
    "body": "Keep apocalypse WorldBackground plus Halloween ruins under Triangles-style gold panels, and silence title/main beds when entering Legend of Triangles so only that mode’s own music plays.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 105,
    "deletions": 92,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 9,
        "deletions": 11
      },
      {
        "path": "src/components/game/spirit-bound/ExtremePuzzle.tsx",
        "additions": 87,
        "deletions": 81
      },
      {
        "path": "src/styles.css",
        "additions": 9,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/835049f4e8542b3665376e5485f0d811de4c20b4"
  },
  {
    "hash": "b26d8a59e0f0a78467f5ac0363151338508dd2c7",
    "short": "b26d8a5",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T21:44:06-07:00",
    "subject": "Switch Extreme Puzzle backdrop to Aerodynamics Extreme world scene.",
    "body": "Use the shared WorldBackground (blood moon, psychedelic Enoch-Ra moon, inferno after midpoint) and refresh all 52 neon plates on a pure black field with bright ink mapping.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 20,
    "deletions": 5,
    "fileCount": 53,
    "files": [
      {
        "path": "public/extreme-puzzle/items-neon/q01.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q02.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q03.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q04.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q05.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q06.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q07.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q08.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q09.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q10.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q11.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q12.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q13.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q14.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q15.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q16.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q17.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q18.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q19.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q20.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q21.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q22.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q23.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q24.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q25.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q26.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q27.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q28.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q29.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q30.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q31.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q32.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q33.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q34.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q35.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q36.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q37.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q38.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q39.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q40.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q41.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q42.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q43.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q44.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q45.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q46.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q47.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q48.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q49.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q50.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q51.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q52.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/ExtremePuzzle.tsx",
        "additions": 20,
        "deletions": 5
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b26d8a59e0f0a78467f5ac0363151338508dd2c7"
  },
  {
    "hash": "49d936f0f4aca45d6f91492bd173ec6cca973cc1",
    "short": "49d936f",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T21:40:42-07:00",
    "subject": "Use neon exact-geometry puzzle plates and restore ZEUS neon UI after the run.",
    "body": "Remap dark ink to bright cyan neon for all 52 items (same layout as the originals), point Extreme Puzzle at the neon pack, keep apocalypse art in the backdrop only, drop the fatigue warning for a no-cheating highest-score line, and return to the normal main screen when finished.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 148,
    "deletions": 207,
    "fileCount": 56,
    "files": [
      {
        "path": "public/extreme-puzzle/items-neon/q01.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q02.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q03.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q04.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q05.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q06.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q07.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q08.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q09.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q10.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q11.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q12.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q13.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q14.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q15.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q16.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q17.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q18.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q19.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q20.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q21.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q22.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q23.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q24.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q25.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q26.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q27.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q28.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q29.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q30.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q31.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q32.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q33.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q34.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q35.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q36.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q37.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q38.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q39.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q40.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q41.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q42.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q43.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q44.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q45.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q46.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q47.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q48.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q49.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q50.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q51.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items-neon/q52.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/ExtremePuzzle.tsx",
        "additions": 135,
        "deletions": 198
      },
      {
        "path": "src/game/extreme-puzzle/assets.ts",
        "additions": 7,
        "deletions": 2
      },
      {
        "path": "src/game/extreme-puzzle/sources.ts",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/styles.css",
        "additions": 5,
        "deletions": 6
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/49d936f0f4aca45d6f91492bd173ec6cca973cc1"
  },
  {
    "hash": "17870eb029ec6091682c924631404f442dbf54c6",
    "short": "17870eb",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T21:32:12-07:00",
    "subject": "Ship Extreme Puzzle item images so plates load on deploy.",
    "body": "Stop gitignoring q01–q52 PNGs, add the massive Θ opening logo, and remount each item image so the 52-plate run shows in Lovable/GitHub instead of a missing-file error.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 96,
    "deletions": 18,
    "fileCount": 57,
    "files": [
      {
        "path": ".gitignore",
        "additions": 1,
        "deletions": 2
      },
      {
        "path": "public/extreme-puzzle/README.md",
        "additions": 7,
        "deletions": 11
      },
      {
        "path": "public/extreme-puzzle/items/q01.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q02.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q03.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q04.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q05.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q06.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q07.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q08.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q09.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q10.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q11.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q12.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q13.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q14.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q15.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q16.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q17.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q18.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q19.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q20.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q21.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q22.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q23.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q24.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q25.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q26.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q27.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q28.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q29.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q30.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q31.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q32.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q33.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q34.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q35.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q36.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q37.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q38.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q39.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q40.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q41.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q42.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q43.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q44.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q45.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q46.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q47.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q48.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q49.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q50.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q51.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/items/q52.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/ExtremePuzzle.tsx",
        "additions": 31,
        "deletions": 2
      },
      {
        "path": "src/game/extreme-puzzle/assets.ts",
        "additions": 7,
        "deletions": 3
      },
      {
        "path": "src/styles.css",
        "additions": 50,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/17870eb029ec6091682c924631404f442dbf54c6"
  },
  {
    "hash": "daaacece43bf44b2e8f3f24fa7c6e3fb7f481e62",
    "short": "daaacec",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T21:26:37-07:00",
    "subject": "Fix Extreme Puzzle start and keep creator credits only at the end.",
    "body": "Bundle the answer key so BEGIN works without answers.json, harden age entry, and rewrite the opening caution as antichrist symbolism only — correlations and sources stay on the finale.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 124,
    "deletions": 22,
    "fileCount": 6,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/spirit-bound/ExtremePuzzle.tsx",
        "additions": 40,
        "deletions": 11
      },
      {
        "path": "src/game/extreme-puzzle/answer-key.ts",
        "additions": 60,
        "deletions": 0
      },
      {
        "path": "src/game/extreme-puzzle/assets.ts",
        "additions": 16,
        "deletions": 4
      },
      {
        "path": "src/game/extreme-puzzle/sources.ts",
        "additions": 6,
        "deletions": 6
      },
      {
        "path": "src/styles.css",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/daaacece43bf44b2e8f3f24fa7c6e3fb7f481e62"
  },
  {
    "hash": "79c7ee9e87f822ac7b1a356a9472437f4f0292cb",
    "short": "79c7ee9",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T21:20:27-07:00",
    "subject": "Add Extreme Puzzle apocalypse atmosphere and Hebrew induction flash.",
    "body": "Open with rapid bright-orange Hebrew “מבחן אינדוקציה” and spirit wails, then a Halloween seal scene with horned Seus moon, nuke mushroom, ruined lava city, titan silhouettes, distant crucifix, and looping Armageddon bed.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 754,
    "deletions": 103,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/spirit-bound/ExtremePuzzle.tsx",
        "additions": 420,
        "deletions": 102
      },
      {
        "path": "src/game/spirit-bound/shrine/audio.ts",
        "additions": 40,
        "deletions": 1
      },
      {
        "path": "src/styles.css",
        "additions": 294,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/79c7ee9e87f822ac7b1a356a9472437f4f0292cb"
  },
  {
    "hash": "955e2c5549fa0e3728e4e6672a3fe8bc2b3a75a3",
    "short": "955e2c5",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T21:13:42-07:00",
    "subject": "Add Extreme Puzzle unlock with warning, scoring, and dated history.",
    "body": "Wire the book seal into Legend of Triangles: scary red caution gate, age-referenced TRI/JCTI norms, rocket finale with correlations/sources, and local-only item pack extraction so copyrighted assets stay gitignored.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1312,
    "deletions": 23,
    "fileCount": 17,
    "files": [
      {
        "path": ".gitignore",
        "additions": 6,
        "deletions": 0
      },
      {
        "path": "public/extreme-puzzle/README.md",
        "additions": 19,
        "deletions": 0
      },
      {
        "path": "scripts/extract-tri52.py",
        "additions": 138,
        "deletions": 0
      },
      {
        "path": "src/components/game/Finale.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 81,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/ExtremePuzzle.tsx",
        "additions": 538,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/JehovahBook.tsx",
        "additions": 33,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/shrine/ArcadeTree.tsx",
        "additions": 17,
        "deletions": 6
      },
      {
        "path": "src/game/extreme-puzzle/assets.ts",
        "additions": 24,
        "deletions": 0
      },
      {
        "path": "src/game/extreme-puzzle/scoring.ts",
        "additions": 106,
        "deletions": 0
      },
      {
        "path": "src/game/extreme-puzzle/sources.ts",
        "additions": 76,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/scattered-papers.ts",
        "additions": 13,
        "deletions": 1
      },
      {
        "path": "src/game/spirit-bound/shrine/audio.ts",
        "additions": 9,
        "deletions": 1
      },
      {
        "path": "src/hooks/useArcadeTree.ts",
        "additions": 28,
        "deletions": 11
      },
      {
        "path": "src/storage/spirit-bound/extreme-puzzle.ts",
        "additions": 67,
        "deletions": 0
      },
      {
        "path": "src/storage/spirit-bound/shrine.ts",
        "additions": 21,
        "deletions": 1
      },
      {
        "path": "src/styles.css",
        "additions": 135,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/955e2c5549fa0e3728e4e6672a3fe8bc2b3a75a3"
  },
  {
    "hash": "3e2adfcea67940c84e57fafec84560b817ab4113",
    "short": "3e2adfc",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T20:52:52-07:00",
    "subject": "Show clickable vanity literature sources under the app title.",
    "body": "Surface Hindawi / SCUT-FBP / FRVT citation links on the Vanity unlock screen and header so CAC anchors are readable before credentials are entered.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 67,
    "deletions": 2,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/VanityApp.tsx",
        "additions": 65,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/references.ts",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/game/vanity/math.ts",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/3e2adfcea67940c84e57fafec84560b817ab4113"
  },
  {
    "hash": "f4401f6650eae5cf438b03864710c19b0cd44c09",
    "short": "f4401f6",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T20:52:03-07:00",
    "subject": "Expand Vanity batch reports and cite Face++ sources in REFS.",
    "body": "Match TheVanityApp.m report METHOD/SOURCES (CAC anchors, FRVT floor, literature URLs), add multipart Detect fallback plus ensemble telemetry, and list those citations under Numerical Extreme REFS.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 499,
    "deletions": 105,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/VanityApp.tsx",
        "additions": 22,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/references.ts",
        "additions": 45,
        "deletions": 1
      },
      {
        "path": "src/game/vanity/facepp.ts",
        "additions": 164,
        "deletions": 34
      },
      {
        "path": "src/game/vanity/math.ts",
        "additions": 268,
        "deletions": 69
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f4401f6650eae5cf438b03864710c19b0cd44c09"
  },
  {
    "hash": "5913a7cd01381c6c52f7a09e62d9de795da771eb",
    "short": "5913a7c",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T19:09:06-07:00",
    "subject": "Fix HTANT visuals and stop transient plate from freezing the tab.",
    "body": "Add Octave-style imagesc + surf(view 38,30) panes, and LU-factor transient conduction once with hard grid/step caps so the browser stays responsive.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 426,
    "deletions": 149,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/numerical-extreme/HeatAerospacePanel.tsx",
        "additions": 152,
        "deletions": 117
      },
      {
        "path": "src/components/game/numerical-extreme/HeatViz.tsx",
        "additions": 193,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/heat-aerospace.ts",
        "additions": 81,
        "deletions": 32
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5913a7cd01381c6c52f7a09e62d9de795da771eb"
  },
  {
    "hash": "9214a031a8f11d414993f9fb299f6ab25e2e74c1",
    "short": "9214a03",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T18:58:44-07:00",
    "subject": "Expose HTANT V2 as the HEAT tab in Numerical Extreme.",
    "body": "Wire the existing heat-aerospace engine into a visible laboratory UI so the Octave V2 plate, fin, atmosphere, nozzle, and sparse solver labs are reachable from the game.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 599,
    "deletions": 0,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 4,
        "deletions": 0
      },
      {
        "path": "src/components/game/numerical-extreme/HeatAerospacePanel.tsx",
        "additions": 595,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9214a031a8f11d414993f9fb299f6ab25e2e74c1"
  },
  {
    "hash": "6f8a99dad90d9aafd1de31ca728155a1f374d54f",
    "short": "6f8a99d",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T18:51:53-07:00",
    "subject": "Add THE VANITY APP with Face++ detect and title unlock.",
    "body": "Wire a session-only API key/secret gate from the title screen into a vanity scoring flow that proxies Face++ Detect server-side.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1096,
    "deletions": 3,
    "fileCount": 5,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 31,
        "deletions": 3
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 8,
        "deletions": 0
      },
      {
        "path": "src/components/game/VanityApp.tsx",
        "additions": 422,
        "deletions": 0
      },
      {
        "path": "src/game/vanity/facepp.ts",
        "additions": 165,
        "deletions": 0
      },
      {
        "path": "src/game/vanity/math.ts",
        "additions": 470,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6f8a99dad90d9aafd1de31ca728155a1f374d54f"
  },
  {
    "hash": "d6bd040b2f02e67288e25cbc5c0b2af701a791ad",
    "short": "d6bd040",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T18:43:59-07:00",
    "subject": "Add Bezier, symbolic, genetic, and heat-aerospace labs to Numerical Extreme.",
    "body": "Port Sauer Program 3.7 freehand Bézier drawing, elementary int(f,x), the V11 GA root finder, and HTANT V2 / ACM PDE-map engines with expanded references.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 2554,
    "deletions": 3,
    "fileCount": 7,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 529,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/bezier.ts",
        "additions": 81,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/genetic.ts",
        "additions": 194,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/heat-aerospace.ts",
        "additions": 934,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 41,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/references.ts",
        "additions": 52,
        "deletions": 3
      },
      {
        "path": "src/game/numerical-extreme/symbolic.ts",
        "additions": 723,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/d6bd040b2f02e67288e25cbc5c0b2af701a791ad"
  },
  {
    "hash": "ff93c210c5d0cfecfa934bc198e7ec2720049432",
    "short": "ff93c21",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T18:03:36-07:00",
    "subject": "Add ACM 618/619/740 SPARS laboratory to Numerical Extreme.",
    "body": "Port DSM/FDJS, Durbin–Wynn DLAINV, and incomplete Cholesky from the V5 Octave module, wire an ACM SPARS toolbox tab, and expand REFS with detailed CALGO citations.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1580,
    "deletions": 14,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 368,
        "deletions": 2
      },
      {
        "path": "src/game/numerical-extreme/acm-sparse.ts",
        "additions": 1089,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 23,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/references.ts",
        "additions": 100,
        "deletions": 12
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ff93c210c5d0cfecfa934bc198e7ec2720049432"
  },
  {
    "hash": "2f369f371de54fda0b65e43dbb1093141471970c",
    "short": "2f369f3",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T17:00:23-07:00",
    "subject": "Mute Numerical Extreme on open so only SFX play.",
    "body": "Stop title/game beds when entering the lab and keep extreme BGM on spirit-bound only.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 9,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 9,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2f369f371de54fda0b65e43dbb1093141471970c"
  },
  {
    "hash": "26372c9ae0df51002dbdcf5d4f25831c4f8ad2bb",
    "short": "26372c9",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-15T14:25:27-07:00",
    "subject": "Center the Legend of Triangles splash and title start screens.",
    "body": "Avoid filter-trapped fixed positioning so the intro card sits in the middle of the viewport.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 17,
    "deletions": 5,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 14,
        "deletions": 3
      },
      {
        "path": "src/styles.css",
        "additions": 3,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/26372c9ae0df51002dbdcf5d4f25831c4f8ad2bb"
  },
  {
    "hash": "aa3e4384200bd347aa40c69400a83daf1078d7fe",
    "short": "aa3e438",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T13:57:27-07:00",
    "subject": "Restore path numerology with tarot and Johnson word expansions.",
    "body": "Keep the letter-sum method and classic 1–9 meanings, add Major Arcana tarot notes, and brute-force expand every explanation word with federally validated Johnson 1777 senses.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 480,
    "deletions": 512,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 48,
        "deletions": 51
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 8,
        "deletions": 2
      },
      {
        "path": "src/game/numerical-extreme/numerology.ts",
        "additions": 424,
        "deletions": 459
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/aa3e4384200bd347aa40c69400a83daf1078d7fe"
  },
  {
    "hash": "ae74bfcce7dc5f56daf71bf77456645bd94a6033",
    "short": "ae74bfc",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T13:50:14-07:00",
    "subject": "Call out brute-force Johnson definition lookup on the numerology panel.",
    "body": "Co-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 3,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 3,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ae74bfcce7dc5f56daf71bf77456645bd94a6033"
  },
  {
    "hash": "6425dcf06fb5b9834f18260dcc6b15241b97c53d",
    "short": "6425dcf",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T13:46:26-07:00",
    "subject": "Describe numerology with federally validated Johnson 1777 senses only.",
    "body": "Keep the A=1…Z=26 letter-sum method, replace occult glosses with Samuel Johnson Dictionary 1777 definitions, and surface that the federally validated public-domain text is included.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 521,
    "deletions": 56,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 48,
        "deletions": 17
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/numerology.ts",
        "additions": 472,
        "deletions": 38
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6425dcf06fb5b9834f18260dcc6b15241b97c53d"
  },
  {
    "hash": "4867d5190be2d6f00ea4db19c5c6592e090b8670",
    "short": "4867d51",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T13:35:07-07:00",
    "subject": "Fix vibration energy peak typing in the MAIN report.",
    "body": "Co-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 9,
    "deletions": 5,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/numerical-extreme/v15-report.ts",
        "additions": 9,
        "deletions": 5
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4867d5190be2d6f00ea4db19c5c6592e090b8670"
  },
  {
    "hash": "13cd4a88ab783ef060b6714d82ca5ea06586a3ac",
    "short": "13cd4a8",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T13:34:48-07:00",
    "subject": "Support Octave mega f(x) in MAIN with erf and denser V15 math.",
    "body": "Raise AST limits, normalize spaced .* ./ .^, add Abramowitz–Stegun erf/erfc, run true shifted-y Newton/secant, and ship the mega Octave preset plus richer analysis telemetry.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 271,
    "deletions": 61,
    "fileCount": 7,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 5,
        "deletions": 2
      },
      {
        "path": "src/game/numerical-extreme/expr.ts",
        "additions": 32,
        "deletions": 5
      },
      {
        "path": "src/game/numerical-extreme/function-analysis.ts",
        "additions": 182,
        "deletions": 47
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/integration.ts",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/types.ts",
        "additions": 3,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/v15-report.ts",
        "additions": 47,
        "deletions": 5
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/13cd4a88ab783ef060b6714d82ca5ea06586a3ac"
  },
  {
    "hash": "aacb2df5e2fee5801f4165467f5e2006508b860c",
    "short": "aacb2df",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T13:29:49-07:00",
    "subject": "Add numerology lab, full V15 f(x) presets, and named REFS authors.",
    "body": "Port the interactive word-to-numerology tool, expand MAIN demos with the commented V15 catalogue, and credit Adams–Bashforth through Talbot / Sauer lineage authors.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 577,
    "deletions": 25,
    "fileCount": 5,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 154,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 3,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/numerology.ts",
        "additions": 179,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/references.ts",
        "additions": 99,
        "deletions": 17
      },
      {
        "path": "src/game/numerical-extreme/v15-report.ts",
        "additions": 142,
        "deletions": 7
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/aacb2df5e2fee5801f4165467f5e2006508b860c"
  },
  {
    "hash": "e5503d9d728f93fb735c97fd31d2ce779cebb802",
    "short": "e5503d9",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T13:23:56-07:00",
    "subject": "Raise numerical extreme expression length to 8000 characters.",
    "body": "Long multi-term f(x) inputs were blocked by the old 500-character cap.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 2,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/numerical-extreme/expr.ts",
        "additions": 2,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/e5503d9d728f93fb735c97fd31d2ce779cebb802"
  },
  {
    "hash": "9cb6e071e48965a470e6f88bb18b74891f78da2d",
    "short": "9cb6e07",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T03:51:44-07:00",
    "subject": "Alternate extreme mural timers between 20s and 25s.",
    "body": "Replace the random ±5/10 jitter so each Accumen mural simply flips between the two limits.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 4,
    "deletions": 7,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/spirit-bound/shrine/LondonDoctrineGate.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/game/spirit-bound/shrine/difficulty.ts",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/game/spirit-bound/shrine/generator.ts",
        "additions": 2,
        "deletions": 5
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9cb6e071e48965a470e6f88bb18b74891f78da2d"
  },
  {
    "hash": "12a7fc734b605f2e38fee472da53d86e476e749e",
    "short": "12a7fc7",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T03:50:07-07:00",
    "subject": "Tighten extreme mural timers to ~20s with ±5/10 jitter.",
    "body": "Keep max-depth Accumen difficulty unchanged while each puzzle rolls 10–30 seconds at random.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 12,
    "deletions": 6,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/spirit-bound/shrine/LondonDoctrineGate.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/game/spirit-bound/shrine/difficulty.ts",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/game/spirit-bound/shrine/generator.ts",
        "additions": 8,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/12a7fc734b605f2e38fee472da53d86e476e749e"
  },
  {
    "hash": "41a07929b58ab70226ccb7bf2312d6b98a303abc",
    "short": "41a0792",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T03:30:43-07:00",
    "subject": "Harden extreme Accumen with gold triangles and a final watch note.",
    "body": "Max-depth murals run on a 30s clock with neon select feedback, then one easy TRUE/FALSE seal before the scrap unlocks.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 212,
    "deletions": 38,
    "fileCount": 5,
    "files": [
      {
        "path": "public/spirit-bound/hero-red-eyes.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/shrine/GameBoard.tsx",
        "additions": 4,
        "deletions": 3
      },
      {
        "path": "src/components/game/spirit-bound/shrine/LondonDoctrineGate.tsx",
        "additions": 147,
        "deletions": 11
      },
      {
        "path": "src/components/game/spirit-bound/shrine/PuzzleNode.tsx",
        "additions": 59,
        "deletions": 22
      },
      {
        "path": "src/game/spirit-bound/shrine/difficulty.ts",
        "additions": 2,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/41a07929b58ab70226ccb7bf2312d6b98a303abc"
  },
  {
    "hash": "d26104f7b19998d00e0007c9f5c4d611ee6b732f",
    "short": "d26104f",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T03:20:28-07:00",
    "subject": "Rename the doctrine peg gate label to Executive Accumen.",
    "body": "Keep the same extreme peg murals; only the displayed name changes.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 4,
    "deletions": 4,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/spirit-bound/shrine/LondonDoctrineGate.tsx",
        "additions": 3,
        "deletions": 3
      },
      {
        "path": "src/game/spirit-bound/shrine/difficulty.ts",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/d26104f7b19998d00e0007c9f5c4d611ee6b732f"
  },
  {
    "hash": "ef0de15d24d6df861033fafc191764b2a9f9e1f9",
    "short": "ef0de15",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T02:59:41-07:00",
    "subject": "Gate doctrine scraps with extreme London Task peg puzzles.",
    "body": "Replace verbal checks with chained random extreme tree murals (50+ path weight), restore bush burn animation, and keep the same peg board design.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 249,
    "deletions": 233,
    "fileCount": 6,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/Battle.tsx",
        "additions": 6,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/reason/DoctrineExtremeGate.tsx",
        "additions": 0,
        "deletions": 228
      },
      {
        "path": "src/components/game/spirit-bound/shrine/LondonDoctrineGate.tsx",
        "additions": 238,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/difficulty.ts",
        "additions": 2,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/types.ts",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ef0de15d24d6df861033fafc191764b2a9f9e1f9"
  },
  {
    "hash": "882bafbfcea633bdb84fd910e1a27d652f41f07e",
    "short": "882bafb",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T02:42:35-07:00",
    "subject": "Speed up overworld rendering and drop hitchy king SVG animations.",
    "body": "Cache static map layers, use delta-time movement, and redraw the Triangle King with static pixel rects so battles and walks stay smooth.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 262,
    "deletions": 174,
    "fileCount": 8,
    "files": [
      {
        "path": "src/components/game/spirit-bound/Battle.tsx",
        "additions": 44,
        "deletions": 65
      },
      {
        "path": "src/components/game/spirit-bound/BulletBox.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/spirit-bound/GrasslandsOverworld.tsx",
        "additions": 59,
        "deletions": 72
      },
      {
        "path": "src/components/game/spirit-bound/Overworld.tsx",
        "additions": 56,
        "deletions": 35
      },
      {
        "path": "src/game/spirit-bound/layer-cache.ts",
        "additions": 32,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/move.ts",
        "additions": 60,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/pixel.ts",
        "additions": 2,
        "deletions": 1
      },
      {
        "path": "src/game/spirit-bound/useKeys.ts",
        "additions": 8,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/882bafbfcea633bdb84fd910e1a27d652f41f07e"
  },
  {
    "hash": "71282a6397dc229c309ea8989b4927cea8e57cab",
    "short": "71282a6",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T02:28:58-07:00",
    "subject": "Add Cipher-style king, red-eyed hero, and extreme doctrine paper gates.",
    "body": "Triangle King uses a top-hat pyramid sprite with blue fire; grasslands scraps now require 50+ executive-acumen checks with Gravity Falls–pulse music; hero matches Link-like pixel art with red eyes.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 561,
    "deletions": 85,
    "fileCount": 9,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 34,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/Battle.tsx",
        "additions": 78,
        "deletions": 21
      },
      {
        "path": "src/components/game/spirit-bound/BulletBox.tsx",
        "additions": 11,
        "deletions": 15
      },
      {
        "path": "src/components/game/spirit-bound/EggHatchIntro.tsx",
        "additions": 2,
        "deletions": 13
      },
      {
        "path": "src/components/game/spirit-bound/GrasslandsOverworld.tsx",
        "additions": 2,
        "deletions": 14
      },
      {
        "path": "src/components/game/spirit-bound/Overworld.tsx",
        "additions": 2,
        "deletions": 22
      },
      {
        "path": "src/components/game/spirit-bound/reason/DoctrineExtremeGate.tsx",
        "additions": 228,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/hero.ts",
        "additions": 114,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/audio.ts",
        "additions": 90,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/71282a6397dc229c309ea8989b4927cea8e57cab"
  },
  {
    "hash": "192f4d007a539e3bcbaf35eabe8770b3eeaca436",
    "short": "192f4d0",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T02:19:29-07:00",
    "subject": "Add a fast Fruitful Grape Vine battle theme on the measured fight pulse.",
    "body": "Original chiptune loops slightly above the ~240.5 BPM reference grid when the vine fight starts.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 34,
    "deletions": 4,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 3,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/audio.ts",
        "additions": 31,
        "deletions": 4
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/192f4d007a539e3bcbaf35eabe8770b3eeaca436"
  },
  {
    "hash": "c7dee94fe6bbdf1e7d566c4a43e9c1226e12e411",
    "short": "c7dee94",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T02:07:41-07:00",
    "subject": "Lock grasslands town themes to the measured Onett-reference BPM.",
    "body": "Use ~117.75 BPM eighths (~0.2548s) and ~152s track length from the analyzed reference pulse.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 8,
    "deletions": 5,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/spirit-bound/shrine/audio.ts",
        "additions": 8,
        "deletions": 5
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/c7dee94fe6bbdf1e7d566c4a43e9c1226e12e411"
  },
  {
    "hash": "ee36674296b0854485a3d8d77c2157672192c501",
    "short": "ee36674",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T02:01:04-07:00",
    "subject": "Expand grasslands music to twelve Onett-feel town themes on one beat.",
    "body": "Original chiptune variations share a ~120 BPM stroll pulse and cycle ~152s each after the grasslands door.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 91,
    "deletions": 29,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/spirit-bound/shrine/audio.ts",
        "additions": 91,
        "deletions": 29
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ee36674296b0854485a3d8d77c2157672192c501"
  },
  {
    "hash": "9b020b7aad1775cc5d09cd39e7787a14a5a41114",
    "short": "9b020b7",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T01:21:06-07:00",
    "subject": "Hide the book title until every grasslands scrap is collected.",
    "body": "Remove THE SECRET OF JEHOVAH from post-boss FATES dialogue; the name only appears on the cover after all pages are found.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1,
    "deletions": 7,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 1,
        "deletions": 7
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9b020b7aad1775cc5d09cd39e7787a14a5a41114"
  },
  {
    "hash": "672c51e7e6381f83589bb9c22a78451b741f4f1b",
    "short": "672c51e",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T01:18:59-07:00",
    "subject": "Update FATES line to ivy laurel leaves after the triangle king falls.",
    "body": "Adoni Je Hovah your old ivy laurel leaves will be stopped by Paul Barnabus the Nazarene. Mark my words!\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/672c51e7e6381f83589bb9c22a78451b741f4f1b"
  },
  {
    "hash": "2bca6c916380a5782139fdd13fbcdf8bacd694c8",
    "short": "2bca6c9",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T01:03:58-07:00",
    "subject": "Cycle all five grasslands themes at EarthBound-town length.",
    "body": "Each optimistic chiptune track plays ~100s, then advances to the next and loops the playlist.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 109,
    "deletions": 20,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/spirit-bound/shrine/audio.ts",
        "additions": 109,
        "deletions": 20
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2bca6c916380a5782139fdd13fbcdf8bacd694c8"
  },
  {
    "hash": "4d3107456ab4ee4e1eb92c31173f9f59f644345f",
    "short": "4d31074",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T01:01:40-07:00",
    "subject": "Invert the battle soul into a downward red triangle.",
    "body": "Contrasts the upward gold attack triangles in the fight box.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 4,
    "deletions": 4,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/spirit-bound/BulletBox.tsx",
        "additions": 4,
        "deletions": 4
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4d3107456ab4ee4e1eb92c31173f9f59f644345f"
  },
  {
    "hash": "ed8f524454afc7f81d851003dd659c2f4f411908",
    "short": "ed8f524",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T00:58:05-07:00",
    "subject": "Sync demonic laugh to the FATES line and move mystery scraps to grasslands.",
    "body": "Play the laugh when that dialogue appears, scatter rainbow papers beyond the door, and unlock Press B for THE SECRET OF JEHOVAH only after all scraps are found.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 105,
    "deletions": 106,
    "fileCount": 5,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 49,
        "deletions": 29
      },
      {
        "path": "src/components/game/spirit-bound/DialogueBox.tsx",
        "additions": 9,
        "deletions": 1
      },
      {
        "path": "src/components/game/spirit-bound/GrasslandsOverworld.tsx",
        "additions": 42,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/JehovahBook.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/spirit-bound/Overworld.tsx",
        "additions": 3,
        "deletions": 72
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ed8f524454afc7f81d851003dd659c2f4f411908"
  },
  {
    "hash": "b2ea46c3eaeffa2b425c1fdc381a3cdc2600de24",
    "short": "b2ea46c",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T00:54:08-07:00",
    "subject": "Move Paul Atreides nameplate to the forehead and refresh scrap/audio data.",
    "body": "Place the PAUL ATREIDES plaque on a brow band for clearer reading, retint doctrine scraps with rainbow paper colors, and add five optimistic grasslands theme loops.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 154,
    "deletions": 71,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/spirit-bound/Overworld.tsx",
        "additions": 21,
        "deletions": 22
      },
      {
        "path": "src/game/spirit-bound/scattered-papers.ts",
        "additions": 69,
        "deletions": 26
      },
      {
        "path": "src/game/spirit-bound/shrine/audio.ts",
        "additions": 64,
        "deletions": 23
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b2ea46c3eaeffa2b425c1fdc381a3cdc2600de24"
  },
  {
    "hash": "247e8966b839c2f19ab8b7e16c12072f66fdfe51",
    "short": "247e896",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T00:36:25-07:00",
    "subject": "Rename the grasslands boss to Fruitful Grape Vine.",
    "body": "Replace poisonous ivy laurel naming so the final boss reads as a grape vine throughout battle text and ending copy.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 9,
    "deletions": 9,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 3,
        "deletions": 3
      },
      {
        "path": "src/game/spirit-bound/data.ts",
        "additions": 4,
        "deletions": 4
      },
      {
        "path": "src/game/spirit-bound/grasslands-data.ts",
        "additions": 2,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/247e8966b839c2f19ab8b7e16c12072f66fdfe51"
  },
  {
    "hash": "14e2b412fe20522dc14b824825990eebfa61d9a8",
    "short": "14e2b41",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T00:32:40-07:00",
    "subject": "Add random grasslands bushes with defeat burn animations.",
    "body": "Scatter angry bushes across grass tiles each visit, play a fire animation in battle and on the field when beaten, and leave ash that still smolders at night.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 202,
    "deletions": 48,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 15,
        "deletions": 1
      },
      {
        "path": "src/components/game/spirit-bound/Battle.tsx",
        "additions": 55,
        "deletions": 17
      },
      {
        "path": "src/components/game/spirit-bound/GrasslandsOverworld.tsx",
        "additions": 97,
        "deletions": 22
      },
      {
        "path": "src/game/spirit-bound/grasslands-data.ts",
        "additions": 35,
        "deletions": 8
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/14e2b412fe20522dc14b824825990eebfa61d9a8"
  },
  {
    "hash": "f3bc950b577e47dc37d0478e9636f24f55681419",
    "short": "f3bc950",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-15T00:18:11-07:00",
    "subject": "Expand Legend of Triangles with hatch intro, Jehovah book, and statues.",
    "body": "Add egg-crack quest start, ordered Greenvale scrap hunt into THE SECRET OF JEHOVAH REVEALED (full 1 Timothy tab with wine verse in red), EarthBound-style overworld loop with burn-only ending audio, softer vine boss, Greek god statues, and a named Paul Atreides plaque.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1025,
    "deletions": 92,
    "fileCount": 10,
    "files": [
      {
        "path": "public/spirit-bound/scattered-paper.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 141,
        "deletions": 45
      },
      {
        "path": "src/components/game/spirit-bound/EggHatchIntro.tsx",
        "additions": 173,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/GrasslandsOverworld.tsx",
        "additions": 27,
        "deletions": 22
      },
      {
        "path": "src/components/game/spirit-bound/JehovahBook.tsx",
        "additions": 124,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/Overworld.tsx",
        "additions": 218,
        "deletions": 5
      },
      {
        "path": "src/game/spirit-bound/data.ts",
        "additions": 89,
        "deletions": 8
      },
      {
        "path": "src/game/spirit-bound/scattered-papers.ts",
        "additions": 150,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/audio.ts",
        "additions": 97,
        "deletions": 12
      },
      {
        "path": "src/game/spirit-bound/timothy-kjv.ts",
        "additions": 6,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f3bc950b577e47dc37d0478e9636f24f55681419"
  },
  {
    "hash": "2b5429c200f224ed8cc977d5f93458e69c8c3976",
    "short": "2b5429c",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-14T23:38:17-07:00",
    "subject": "Add hawk egg easter egg with Seb/Ra lore text.",
    "body": "Place a copper hawk egg on the northeast grasslands path that opens a scrollable reader for the Egg of Seb passage.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 123,
    "deletions": 16,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 17,
        "deletions": 4
      },
      {
        "path": "src/components/game/spirit-bound/GoldenEggReader.tsx",
        "additions": 60,
        "deletions": 10
      },
      {
        "path": "src/components/game/spirit-bound/GrasslandsOverworld.tsx",
        "additions": 43,
        "deletions": 2
      },
      {
        "path": "src/game/spirit-bound/grasslands-data.ts",
        "additions": 3,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2b5429c200f224ed8cc977d5f93458e69c8c3976"
  },
  {
    "hash": "c371b11ee9ac36f0cd6a6d2a566a9d5172376e54",
    "short": "c371b11",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-14T23:35:57-07:00",
    "subject": "Extend Legend of Triangles with grasslands arc and golden egg.",
    "body": "After LORD PETER KING, a gold door opens to an EarthBound-style overworld with bush battles, a vine boss, night ending, and a northwest golden egg that opens the Secret Doctrine scroll.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 897,
    "deletions": 52,
    "fileCount": 9,
    "files": [
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 171,
        "deletions": 21
      },
      {
        "path": "src/components/game/spirit-bound/Battle.tsx",
        "additions": 34,
        "deletions": 12
      },
      {
        "path": "src/components/game/spirit-bound/BulletBox.tsx",
        "additions": 41,
        "deletions": 3
      },
      {
        "path": "src/components/game/spirit-bound/GoldenEggReader.tsx",
        "additions": 69,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/GrasslandsOverworld.tsx",
        "additions": 395,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/Overworld.tsx",
        "additions": 22,
        "deletions": 10
      },
      {
        "path": "src/game/spirit-bound/data.ts",
        "additions": 43,
        "deletions": 5
      },
      {
        "path": "src/game/spirit-bound/grasslands-data.ts",
        "additions": 100,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/audio.ts",
        "additions": 22,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/c371b11ee9ac36f0cd6a6d2a566a9d5172376e54"
  },
  {
    "hash": "58a5325faaad3f727042a75eb6152f86130ecfed",
    "short": "58a5325",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-14T21:29:24-07:00",
    "subject": "Add 3×3 nonlinear systems to the METHOD builder.",
    "body": "Match the V11 Neon method lab with a 2×2 / 3×3 size switch, Problem 3 presets, and dimension-aware Jacobian / Jacobi-split formulation text.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 120,
    "deletions": 36,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 67,
        "deletions": 23
      },
      {
        "path": "src/game/numerical-extreme/v15-report.ts",
        "additions": 53,
        "deletions": 13
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/58a5325faaad3f727042a75eb6152f86130ecfed"
  },
  {
    "hash": "cfcaa73936ebd37fa049fdcc0e2efcefc0de4b92",
    "short": "cfcaa73",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-14T21:22:37-07:00",
    "subject": "Enrich Numerical Extreme with V15 detail and a references page.",
    "body": "Deepen MAIN telemetry (IVT through Alg 695/682/502 demos), plot-click inspect/secant seeds, METHOD/COMPOSITE/VECTOR lab detail, and credit ACM CALGO authors, Sauer, and project lineage under REFS.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 945,
    "deletions": 152,
    "fileCount": 5,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 400,
        "deletions": 151
      },
      {
        "path": "src/components/game/numerical-extreme/Chart.tsx",
        "additions": 62,
        "deletions": 1
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/references.ts",
        "additions": 160,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/v15-report.ts",
        "additions": 312,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/cfcaa73936ebd37fa049fdcc0e2efcefc0de4b92"
  },
  {
    "hash": "ee528f21d71f237dee83b14d2bfe2c5ddc343f8a",
    "short": "ee528f2",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-14T21:12:21-07:00",
    "subject": "Show DIFF interpolant equations and flash Enoch-Ra on compute.",
    "body": "Surface Newton divided-difference tables, Lagrange forms, and cubic spline segments in neon telemetry boxes, and play the 1s brain overload flourish on every Numerical Extreme run.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 197,
    "deletions": 56,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 168,
        "deletions": 56
      },
      {
        "path": "src/components/game/numerical-extreme/ui.tsx",
        "additions": 29,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ee528f21d71f237dee83b14d2bfe2c5ddc343f8a"
  },
  {
    "hash": "5905e94b3bfbf2fad2dd2dba4eb8e41ee1f4bb3c",
    "short": "5905e94",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-15T04:01:41+00:00",
    "subject": "Refined NEON Numerical Extreme",
    "body": "X-Lovable-Edit-ID: edt-bf999893-37d0-4e37-9cd1-34e1247817b5\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5905e94b3bfbf2fad2dd2dba4eb8e41ee1f4bb3c"
  },
  {
    "hash": "ee55c0c9afc25c0eb4ace7d82e663c4323d581c9",
    "short": "ee55c0c",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-15T04:01:34+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 28,
    "deletions": 11,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 12,
        "deletions": 7
      },
      {
        "path": "src/components/game/numerical-extreme/ui.tsx",
        "additions": 16,
        "deletions": 4
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ee55c0c9afc25c0eb4ace7d82e663c4323d581c9"
  },
  {
    "hash": "33707119f8545bdb5bb6327c9cdf91c22077d5f0",
    "short": "3370711",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-15T04:01:15+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 21,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/audio.ts",
        "additions": 21,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/33707119f8545bdb5bb6327c9cdf91c22077d5f0"
  },
  {
    "hash": "18642b8d7a3653c79261cb65901b3b096cc53608",
    "short": "18642b8",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-15T04:01:04+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 188,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/styles.css",
        "additions": 188,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/18642b8d7a3653c79261cb65901b3b096cc53608"
  },
  {
    "hash": "e66564f0f2890bb197db3627cef3cd9040549536",
    "short": "e66564f",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-15T03:58:44+00:00",
    "subject": "Added creator names to title",
    "body": "X-Lovable-Edit-ID: edt-879e881e-b89b-4de6-abb2-dd6624ec6dd5\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/e66564f0f2890bb197db3627cef3cd9040549536"
  },
  {
    "hash": "e924cff157359002e67380138632af55f7959329",
    "short": "e924cff",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-15T03:57:54+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 4,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 4,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/e924cff157359002e67380138632af55f7959329"
  },
  {
    "hash": "309c3bf4b3c802c3d060ae29a9602a445aff9b20",
    "short": "309c3bf",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-15T03:57:47+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": ".lovable/{plan.md => plan/add-creator-credits-to-title-screen-2026-09-15.md}",
        "additions": 0,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/309c3bf4b3c802c3d060ae29a9602a445aff9b20"
  },
  {
    "hash": "1bff9958d9bb9022c5d266de1734a13934438cd6",
    "short": "1bff995",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-15T03:57:33+00:00",
    "subject": "Update plan",
    "body": "Plan file updated during planning mode\n\nX-Lovable-Edit-ID: edt-4cdcb6c7-6a86-48d1-8f1f-66b6dbaa6adb\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/1bff9958d9bb9022c5d266de1734a13934438cd6"
  },
  {
    "hash": "6ff4d1afb5fbcc263044eb980735b3598bdff3a7",
    "short": "6ff4d1a",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-15T03:57:30+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 23,
    "deletions": 49,
    "fileCount": 1,
    "files": [
      {
        "path": ".lovable/plan.md",
        "additions": 23,
        "deletions": 49
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6ff4d1afb5fbcc263044eb980735b3598bdff3a7"
  },
  {
    "hash": "2ef4aa58d5ec8eb734f542607f78137e99b25dcf",
    "short": "2ef4aa5",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-15T03:52:23+00:00",
    "subject": "Pinned Framer Motion to stable",
    "body": "X-Lovable-Edit-ID: edt-af84feb0-f5c1-4532-beba-44250948061f\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2ef4aa58d5ec8eb734f542607f78137e99b25dcf"
  },
  {
    "hash": "2ee36fa8b69b121e722b142a7d1baf9ea237ce0e",
    "short": "2ee36fa",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-15T03:52:12+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 8,
    "deletions": 1,
    "fileCount": 2,
    "files": [
      {
        "path": "bun.lock",
        "additions": 7,
        "deletions": 0
      },
      {
        "path": "package.json",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2ee36fa8b69b121e722b142a7d1baf9ea237ce0e"
  },
  {
    "hash": "889a9fc475b56f2a556b062d407cb8fb4a53bdb9",
    "short": "889a9fc",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-14T20:48:50-07:00",
    "subject": "Replace SALTBURG with Legend of Triangles from spirit-bound 701b61c.",
    "body": "Port the finished Greenvale quest, shrine trial, arcade trees, and watch-notes reason modes into ZEUS neon chrome as THE LEGEND OF TRIANGLES.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 11834,
    "deletions": 593,
    "fileCount": 53,
    "files": [
      {
        "path": "package-lock.json",
        "additions": 6910,
        "deletions": 0
      },
      {
        "path": "package.json",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 17,
        "deletions": 17
      },
      {
        "path": "src/components/game/SaltburgGame.tsx",
        "additions": 0,
        "deletions": 259
      },
      {
        "path": "src/components/game/SpiritBoundGame.tsx",
        "additions": 424,
        "deletions": 0
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 4,
        "deletions": 4
      },
      {
        "path": "src/components/game/saltburg/Overworld.tsx",
        "additions": 0,
        "deletions": 226
      },
      {
        "path": "src/components/game/{saltburg => spirit-bound}/Battle.tsx",
        "additions": 75,
        "deletions": 31
      },
      {
        "path": "src/components/game/{saltburg => spirit-bound}/BulletBox.tsx",
        "additions": 35,
        "deletions": 18
      },
      {
        "path": "src/components/game/{saltburg => spirit-bound}/DialogueBox.tsx",
        "additions": 4,
        "deletions": 4
      },
      {
        "path": "src/components/game/spirit-bound/Overworld.tsx",
        "additions": 287,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/SplashIntro.tsx",
        "additions": 90,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/reason/FeedbackLayer.tsx",
        "additions": 46,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/reason/ReasonTrial.tsx",
        "additions": 177,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/reason/SceneRenderer.tsx",
        "additions": 112,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/reason/ScoreHUD.tsx",
        "additions": 108,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/reason/StatementCard.tsx",
        "additions": 33,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/reason/Timer.tsx",
        "additions": 17,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/shrine/ArcadeTree.tsx",
        "additions": 135,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/shrine/CutscenePlayer.tsx",
        "additions": 84,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/shrine/Effects.tsx",
        "additions": 34,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/shrine/GameBoard.tsx",
        "additions": 95,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/shrine/HUD.tsx",
        "additions": 94,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/shrine/PuzzleNode.tsx",
        "additions": 79,
        "deletions": 0
      },
      {
        "path": "src/components/game/spirit-bound/shrine/ShrineTrial.tsx",
        "additions": 178,
        "deletions": 0
      },
      {
        "path": "src/game/{saltburg => spirit-bound}/data.ts",
        "additions": 35,
        "deletions": 34
      },
      {
        "path": "src/game/spirit-bound/pixel.ts",
        "additions": 38,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/reason/catalog.ts",
        "additions": 168,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/reason/difficultyManager.ts",
        "additions": 58,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/reason/generator.ts",
        "additions": 167,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/reason/logicEngine.ts",
        "additions": 95,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/reason/questionFactory.ts",
        "additions": 245,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/reason/scoring.ts",
        "additions": 138,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/reason/types.ts",
        "additions": 129,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/reason/validate.ts",
        "additions": 95,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/adapt.ts",
        "additions": 16,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/audio.ts",
        "additions": 131,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/difficulty.ts",
        "additions": 20,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/generator.ts",
        "additions": 59,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/layout.ts",
        "additions": 47,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/rng.ts",
        "additions": 22,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/rules.ts",
        "additions": 67,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/scoring.ts",
        "additions": 61,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/solver.ts",
        "additions": 67,
        "deletions": 0
      },
      {
        "path": "src/game/spirit-bound/shrine/types.ts",
        "additions": 68,
        "deletions": 0
      },
      {
        "path": "src/game/{saltburg => spirit-bound}/useKeys.ts",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/hooks/useArcadeTree.ts",
        "additions": 174,
        "deletions": 0
      },
      {
        "path": "src/hooks/usePrefersReducedMotion.ts",
        "additions": 15,
        "deletions": 0
      },
      {
        "path": "src/hooks/useReasonGame.ts",
        "additions": 322,
        "deletions": 0
      },
      {
        "path": "src/hooks/useShrinePuzzle.ts",
        "additions": 196,
        "deletions": 0
      },
      {
        "path": "src/storage/spirit-bound/reason.ts",
        "additions": 121,
        "deletions": 0
      },
      {
        "path": "src/storage/spirit-bound/shrine.ts",
        "additions": 82,
        "deletions": 0
      },
      {
        "path": "src/styles.css",
        "additions": 159,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/889a9fc475b56f2a556b062d407cb8fb4a53bdb9"
  },
  {
    "hash": "d5f32944ba28160f59ad8f9b650c07ebbd6106c1",
    "short": "d5f3294",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-14T20:45:54-07:00",
    "subject": "Add NUMERICAL EXTREME toolbox as a ZEUS-themed title mode.",
    "body": "Port the full Numerical Analysis Toolbox labs into a client-side engine and neon workbench so players can run roots, vibrations, quadrature, interpolation, nonlinear systems, and classic algorithms without a Python backend.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 5503,
    "deletions": 3,
    "fileCount": 16,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 30,
        "deletions": 3
      },
      {
        "path": "src/components/game/NumericalExtremeGame.tsx",
        "additions": 1236,
        "deletions": 0
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 8,
        "deletions": 0
      },
      {
        "path": "src/components/game/numerical-extreme/Chart.tsx",
        "additions": 217,
        "deletions": 0
      },
      {
        "path": "src/components/game/numerical-extreme/ui.tsx",
        "additions": 192,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/algorithms.ts",
        "additions": 1210,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/common.ts",
        "additions": 285,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/expr.ts",
        "additions": 482,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/function-analysis.ts",
        "additions": 466,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/index.ts",
        "additions": 98,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/integration.ts",
        "additions": 174,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/interpolation.ts",
        "additions": 260,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/nonlinear.ts",
        "additions": 326,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/types.ts",
        "additions": 303,
        "deletions": 0
      },
      {
        "path": "src/game/numerical-extreme/vibrations.ts",
        "additions": 206,
        "deletions": 0
      },
      {
        "path": "src/styles.css",
        "additions": 10,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/d5f32944ba28160f59ad8f9b650c07ebbd6106c1"
  },
  {
    "hash": "1598d93fa9268372d8ac81219d0a9da9e2c32085",
    "short": "1598d93",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-14T20:31:06-07:00",
    "subject": "Add SALTBURG as a standalone title-menu RPG mode.",
    "body": "Port the full overworld/battle demo into ZEUS with neon styling, Extreme music, and a rocket finale after the Salt King.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1421,
    "deletions": 4,
    "fileCount": 10,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 60,
        "deletions": 4
      },
      {
        "path": "src/components/game/SaltburgGame.tsx",
        "additions": 259,
        "deletions": 0
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 8,
        "deletions": 0
      },
      {
        "path": "src/components/game/saltburg/Battle.tsx",
        "additions": 379,
        "deletions": 0
      },
      {
        "path": "src/components/game/saltburg/BulletBox.tsx",
        "additions": 167,
        "deletions": 0
      },
      {
        "path": "src/components/game/saltburg/DialogueBox.tsx",
        "additions": 56,
        "deletions": 0
      },
      {
        "path": "src/components/game/saltburg/Overworld.tsx",
        "additions": 226,
        "deletions": 0
      },
      {
        "path": "src/game/saltburg/data.ts",
        "additions": 171,
        "deletions": 0
      },
      {
        "path": "src/game/saltburg/useKeys.ts",
        "additions": 45,
        "deletions": 0
      },
      {
        "path": "src/styles.css",
        "additions": 50,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/1598d93fa9268372d8ac81219d0a9da9e2c32085"
  },
  {
    "hash": "4e2424b441cdf7fc2edb11f8ed743de17fe9e3ce",
    "short": "4e2424b",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-34-18-27.ucmerced.edu",
    "date": "2026-09-14T20:24:11-07:00",
    "subject": "Keep Bananza brain-expand flourish snappy and complete before the chapter gate.",
    "body": "Stabilize the overload callback so re-renders cannot restart the timer, wait for the animation to finish before Enoch-Ra chapter jump, and use a faster Bananza timing.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 62,
    "deletions": 21,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 24,
        "deletions": 14
      },
      {
        "path": "src/components/game/BrainOverload.tsx",
        "additions": 25,
        "deletions": 6
      },
      {
        "path": "src/styles.css",
        "additions": 13,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4e2424b441cdf7fc2edb11f8ed743de17fe9e3ce"
  },
  {
    "hash": "9a83fc7e5c128824b984fba8d7c0e8ae890db0f2",
    "short": "9a83fc7",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-12T15:09:48-07:00",
    "subject": "Show Bananza chapter gate only after Enoch-Ra (HP over 11).",
    "body": "Stop opening the skip/return screen after every minigame; arm it only when overload unlocks Enoch-Ra, including later re-triggers.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 12,
    "deletions": 8,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 10,
        "deletions": 7
      },
      {
        "path": "src/components/game/HeatTransferChapterJump.tsx",
        "additions": 2,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9a83fc7e5c128824b984fba8d7c0e8ae890db0f2"
  },
  {
    "hash": "b85d977d09f1c7137e3e2a80016d7760f86d043a",
    "short": "b85d977",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-12T14:59:20-07:00",
    "subject": "Fix Bananza visual diagramType casts for exactOptionalPropertyTypes.",
    "body": "Co-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 50,
    "deletions": 50,
    "fileCount": 1,
    "files": [
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-bananza-visuals.ts",
        "additions": 50,
        "deletions": 50
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b85d977d09f1c7137e3e2a80016d7760f86d043a"
  },
  {
    "hash": "ded89a61a86334fc16bcddeb021a767c0d9ded47",
    "short": "ded89a6",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-12T14:58:23-07:00",
    "subject": "Add Bananza Enoch-Ra chapter gate and 50 visual chapter questions.",
    "body": "After Bananza minigames (and whenever Enoch-Ra triggers again), players can skip ahead with credited cards, return to earlier chapters, or continue; each chapter also gains interleaved visual problems.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1911,
    "deletions": 38,
    "fileCount": 9,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 133,
        "deletions": 1
      },
      {
        "path": "src/components/game/Diagram.tsx",
        "additions": 305,
        "deletions": 0
      },
      {
        "path": "src/components/game/HeatTransferChapterJump.tsx",
        "additions": 157,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-bananza-visuals.ts",
        "additions": 1196,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/index.ts",
        "additions": 44,
        "deletions": 34
      },
      {
        "path": "src/game/ht-chapters.ts",
        "additions": 39,
        "deletions": 0
      },
      {
        "path": "src/game/types.ts",
        "additions": 31,
        "deletions": 1
      },
      {
        "path": "src/game/validate.ts",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/styles.css",
        "additions": 4,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ded89a61a86334fc16bcddeb021a767c0d9ded47"
  },
  {
    "hash": "87813b4f25885125c950f7cc2d4570f07b811550",
    "short": "87813b4",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-12T13:22:09-07:00",
    "subject": "Keep Heat Transfer beds playing across questions and minigames.",
    "body": "Stop restarting Intro/Bananza soundtracks on each answer or gauntlet transition; only start/stop when entering or leaving those modes.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 57,
    "deletions": 26,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 35,
        "deletions": 25
      },
      {
        "path": "src/game/audio.ts",
        "additions": 22,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/87813b4f25885125c950f7cc2d4570f07b811550"
  },
  {
    "hash": "434e5bba4f09be80f9e6448614f8f566831e0c3f",
    "short": "434e5bb",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-12T01:25:14-07:00",
    "subject": "Loop Bananza between Armageddon and Portal beds.",
    "body": "After the 34:20 Armageddon excerpt ends, play a Portal OST bed, then alternate the two for Heat Transfer Extreme Bananza.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 28,
    "deletions": 13,
    "fileCount": 2,
    "files": [
      {
        "path": "public/audio/ht-bananza-portal.mp3",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/game/audio.ts",
        "additions": 28,
        "deletions": 13
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/434e5bba4f09be80f9e6448614f8f566831e0c3f"
  },
  {
    "hash": "3cf9b33f04630951e01395678259f4cdfaf96566",
    "short": "3cf9b33",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-12T01:22:53-07:00",
    "subject": "Start Bananza Armageddon bed at 34:20 with a longer excerpt.",
    "body": "Replace the short intro cut with ~76 minutes from that timestamp so Extreme Bananza stays on the later section of the track.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "public/audio/ht-bananza-bed.mp3",
        "additions": 0,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/3cf9b33f04630951e01395678259f4cdfaf96566"
  },
  {
    "hash": "5eabc5fa83515bb3769e1e650ff9fc2a99a2859c",
    "short": "5eabc5f",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-12T00:40:05-07:00",
    "subject": "Add quiet title-screen playlist that loops Crystal Vista, Armageddon, then Portal.",
    "body": "Menu music starts low on the title screen after a tap, advances through the three beds in order, and stops when leaving for a campaign mode.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 97,
    "deletions": 15,
    "fileCount": 6,
    "files": [
      {
        "path": "public/audio/title-armageddon.mp3",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/audio/title-crystal-vista.mp3",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/audio/title-portal.mp3",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 29,
        "deletions": 1
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 6,
        "deletions": 2
      },
      {
        "path": "src/game/audio.ts",
        "additions": 62,
        "deletions": 12
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5eabc5fa83515bb3769e1e650ff9fc2a99a2859c"
  },
  {
    "hash": "a7d171e1399aebb2c69eab39e166afdc6265237d",
    "short": "a7d171e",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-12T00:33:23-07:00",
    "subject": "Use Armageddon bed for Bananza with looping, 10-level wind, and thermal plasma.",
    "body": "Replace the Portal soundtrack on Heat Transfer Extreme Bananza, keep looping reliable on truncated beds, and add escalating wind plus constant fire/plasma ambience.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 141,
    "deletions": 27,
    "fileCount": 3,
    "files": [
      {
        "path": "public/audio/ht-bananza-bed.mp3",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 8,
        "deletions": 3
      },
      {
        "path": "src/game/audio.ts",
        "additions": 133,
        "deletions": 24
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/a7d171e1399aebb2c69eab39e166afdc6265237d"
  },
  {
    "hash": "f435fb5d484907df19395f199df9cefa3a0f4177",
    "short": "f435fb5",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-12T00:24:00-07:00",
    "subject": "Add Portal OST bed for Heat Transfer modes with Bananza wind escalation.",
    "body": "Bananza plays the soundtrack plus five escalating wind/turbulence SFX levels about every 10 questions; Intro uses a quieter bed only.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 159,
    "deletions": 8,
    "fileCount": 3,
    "files": [
      {
        "path": "public/audio/ht-portal-bed.mp3",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 17,
        "deletions": 5
      },
      {
        "path": "src/game/audio.ts",
        "additions": 142,
        "deletions": 3
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f435fb5d484907df19395f199df9cefa3a0f4177"
  },
  {
    "hash": "4e30b7c50c61a2b1cd7afc0915a705d92cb8c5c3",
    "short": "4e30b7c",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-11T23:25:12-07:00",
    "subject": "Add Heat Transfer Intro campaign with bright-orange menu and relaxed ambient music.",
    "body": "New 50-question Chapter 1 course mirrors Extreme flow (briefing, gauntlet, rocket finale, review) while keeping a calmer ambient soundtrack separate from Bananza.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 1698,
    "deletions": 8,
    "fileCount": 11,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 121,
        "deletions": 5
      },
      {
        "path": "src/components/game/Diagram.tsx",
        "additions": 113,
        "deletions": 0
      },
      {
        "path": "src/components/game/HeatTransferIntroBriefing.tsx",
        "additions": 107,
        "deletions": 0
      },
      {
        "path": "src/components/game/HeatTransferIntroReview.tsx",
        "additions": 86,
        "deletions": 0
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 8,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-intro.ts",
        "additions": 1153,
        "deletions": 0
      },
      {
        "path": "src/game/extreme-v2.ts",
        "additions": 7,
        "deletions": 2
      },
      {
        "path": "src/game/heat-transfer-intro.ts",
        "additions": 33,
        "deletions": 0
      },
      {
        "path": "src/game/types.ts",
        "additions": 8,
        "deletions": 1
      },
      {
        "path": "src/game/validate.ts",
        "additions": 52,
        "deletions": 0
      },
      {
        "path": "src/styles.css",
        "additions": 10,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4e30b7c50c61a2b1cd7afc0915a705d92cb8c5c3"
  },
  {
    "hash": "32af3490ee392a4cb82fdac73173e027a03d2262",
    "short": "32af349",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-11T22:49:19-07:00",
    "subject": "Add winged-brain tab icon and Extreme rocket finale endings.",
    "body": "Use the new brain art for favicon/social icons, and play the campaign rocket launch when Extreme, Extreme V2, and Heat Transfer Bananza complete.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 139,
    "deletions": 39,
    "fileCount": 10,
    "files": [
      {
        "path": "public/apple-touch-icon.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/brain-tab.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/favicon-16.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/favicon-32.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/favicon.ico",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/icon-512.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/brain-tab.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 49,
        "deletions": 4
      },
      {
        "path": "src/components/game/Finale.tsx",
        "additions": 85,
        "deletions": 34
      },
      {
        "path": "src/routes/__root.tsx",
        "additions": 5,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/32af3490ee392a4cb82fdac73173e027a03d2262"
  },
  {
    "hash": "94a1be7ab28cd111356dc05afa72ff7687ae0074",
    "short": "94a1be7",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-11T22:41:30-07:00",
    "subject": "Add Aerodynamics Extreme V2 and Heat Transfer Extreme Bananza.",
    "body": "Wire separate Extreme-family courses with briefings, 400-question HT bank, and extensible HT debrief slides.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 8751,
    "deletions": 21,
    "fileCount": 48,
    "files": [
      {
        "path": "src/assets/class05-notes-1.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/class05-notes-2.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/class05-notes-3.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/class05-notes-4.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-01.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-02.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-03.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-04.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-05.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-06.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-07.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-08.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-09.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-10.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-11.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-12.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-13.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-14.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-15.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-16.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/ht-briefing/ht-briefing-17.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 184,
        "deletions": 16
      },
      {
        "path": "src/components/game/ExtremeV2Briefing.tsx",
        "additions": 136,
        "deletions": 0
      },
      {
        "path": "src/components/game/ExtremeV2Review.tsx",
        "additions": 64,
        "deletions": 0
      },
      {
        "path": "src/components/game/HeatTransferExtremeBriefing.tsx",
        "additions": 142,
        "deletions": 0
      },
      {
        "path": "src/components/game/HeatTransferExtremeReview.tsx",
        "additions": 68,
        "deletions": 0
      },
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 3,
        "deletions": 1
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 16,
        "deletions": 0
      },
      {
        "path": "src/data/ht-briefing-slides.ts",
        "additions": 128,
        "deletions": 0
      },
      {
        "path": "src/data/questions/extreme-v2.ts",
        "additions": 439,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-ch02-03.ts",
        "additions": 1175,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-ch04.ts",
        "additions": 221,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-ch05.ts",
        "additions": 509,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-ch06.ts",
        "additions": 617,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-ch07.ts",
        "additions": 1013,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-ch08.ts",
        "additions": 761,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-ch09.ts",
        "additions": 509,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-ch10.ts",
        "additions": 437,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-ch11.ts",
        "additions": 437,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-ch12.ts",
        "additions": 653,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-ch13.ts",
        "additions": 365,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/ht-ch14.ts",
        "additions": 563,
        "deletions": 0
      },
      {
        "path": "src/data/questions/heat-transfer-extreme/index.ts",
        "additions": 58,
        "deletions": 0
      },
      {
        "path": "src/game/answer.ts",
        "additions": 47,
        "deletions": 4
      },
      {
        "path": "src/game/extreme-v2.ts",
        "additions": 24,
        "deletions": 0
      },
      {
        "path": "src/game/heat-transfer-extreme.ts",
        "additions": 33,
        "deletions": 0
      },
      {
        "path": "src/game/validate.ts",
        "additions": 129,
        "deletions": 0
      },
      {
        "path": "src/styles.css",
        "additions": 20,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/94a1be7ab28cd111356dc05afa72ff7687ae0074"
  },
  {
    "hash": "c0cf1d25bad57b0601f2df85c5e8a594d31f36f0",
    "short": "c0cf1d2",
    "author": "Jonathan Angel",
    "email": "jonathanangel10312002@ucmerced-10-33-41-234.ucmerced.edu",
    "date": "2026-09-11T20:42:02-07:00",
    "subject": "Vendor local media and finish Extreme expansion independently of Lovable.",
    "body": "Images and briefing video now ship in the repo so the game runs without the CDN, and inferno starts halfway through the 150-card Extreme set.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
    "additions": 686,
    "deletions": 422,
    "fileCount": 73,
    "files": [
      {
        "path": "cursor-migration.md",
        "additions": 520,
        "deletions": 0
      },
      {
        "path": "roadmap.md",
        "additions": 7,
        "deletions": 7
      },
      {
        "path": "src/assets/airfoil-force-vectors.jpg",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/airfoil-force-vectors.jpg.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/airfoil-geometry.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/airfoil-geometry.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/basic-aerodynamics.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/basic-aerodynamics.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/brainpic-2.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/brainpic-2.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/briefing-lecture.mp4",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/briefing-lecture.mp4.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/enoch-ra-moon.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/enoch-ra-moon.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/lecture-b1.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b1.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/lecture-b10.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b10.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/lecture-b2.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b2.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/lecture-b3.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b3.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/lecture-b4.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b4.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/lecture-b5.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b5.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/lecture-b6.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b6.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/lecture-b7.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b7.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/lecture-b8.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b8.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/lecture-b9.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b9.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/nerd-brain.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/nerd-brain.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/notes-122932.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/notes-122932.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/notes-122942.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/notes-122942.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/notes-122957.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/notes-122957.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/notes-123007.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/notes-123007.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/notes-123014.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/notes-123014.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/notes-123020.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/notes-123020.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/seus-moon.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/seus-moon.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/vertical-stabilizer-rudder.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/vertical-stabilizer-rudder.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/wing-forces-moments.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/wing-forces-moments.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/wing-geometry.gif",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/wing-geometry.gif.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/winged-brain-cyan.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/winged-brain-cyan.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/winged-brain-solar.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/winged-brain-solar.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/winged-brain-volt.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/winged-brain-volt.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/winged-brain.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/winged-brain.png.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 7,
        "deletions": 5
      },
      {
        "path": "src/components/game/BrainCelebration.tsx",
        "additions": 8,
        "deletions": 8
      },
      {
        "path": "src/components/game/BrainOverload.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/ExtremeBriefing.tsx",
        "additions": 48,
        "deletions": 48
      },
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 7,
        "deletions": 2
      },
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 4,
        "deletions": 4
      },
      {
        "path": "src/data/questions/extreme-expansion.ts",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/game/extreme.ts",
        "additions": 10,
        "deletions": 3
      },
      {
        "path": "src/game/validate.ts",
        "additions": 71,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/c0cf1d25bad57b0601f2df85c5e8a594d31f36f0"
  },
  {
    "hash": "f9d9751229babcf99702870638ea26b5be07ea52",
    "short": "f9d9751",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-12T01:30:37+00:00",
    "subject": "Fixed SEO headings",
    "body": "X-Lovable-Edit-ID: edt-267fe186-225b-4a36-851d-cd5e481b12e0\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f9d9751229babcf99702870638ea26b5be07ea52"
  },
  {
    "hash": "61d1ac2a725dcabd8243e97d2cbda4e011c6eb4b",
    "short": "61d1ac2",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-12T01:30:35+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/ValidationPanel.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/61d1ac2a725dcabd8243e97d2cbda4e011c6eb4b"
  },
  {
    "hash": "f43fc9da32460e03ac3bb1391d1de4be5ae1abea",
    "short": "f43fc9d",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-12T01:30:27+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/SettingsPanel.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f43fc9da32460e03ac3bb1391d1de4be5ae1abea"
  },
  {
    "hash": "75ced3847ad3af6596b391bc1021e761dabc1d1d",
    "short": "75ced38",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-12T01:30:22+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 6,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 6,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/75ced3847ad3af6596b391bc1021e761dabc1d1d"
  },
  {
    "hash": "2e9738d57e7616512b9a497ec34f85a68b6209e4",
    "short": "2e9738d",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-12T01:30:17+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 2,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "public/robots.txt",
        "additions": 2,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2e9738d57e7616512b9a497ec34f85a68b6209e4"
  },
  {
    "hash": "595d8eaab40c34cdce1daad5f69496bd9aa82d02",
    "short": "595d8ea",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-12T01:30:14+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 6,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "public/sitemap.xml",
        "additions": 6,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/595d8eaab40c34cdce1daad5f69496bd9aa82d02"
  },
  {
    "hash": "5284aea8805fc47760a966f3407c94e09e8bad34",
    "short": "5284aea",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-12T01:30:09+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 14,
    "deletions": 5,
    "fileCount": 1,
    "files": [
      {
        "path": "src/routes/__root.tsx",
        "additions": 14,
        "deletions": 5
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5284aea8805fc47760a966f3407c94e09e8bad34"
  },
  {
    "hash": "e18bbafdf225efe40fe37ef3ef84b1a0f550f005",
    "short": "e18bbaf",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-12T01:29:41+00:00",
    "subject": "Added inferno trigger at Q140",
    "body": "X-Lovable-Edit-ID: edt-4a240a67-1a78-4f72-9823-c6042199e602\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/e18bbafdf225efe40fe37ef3ef84b1a0f550f005"
  },
  {
    "hash": "2a3c4f8884df85cdd1d4c69e6a6e014a634fa3c6",
    "short": "2a3c4f8",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-12T01:29:37+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2a3c4f8884df85cdd1d4c69e6a6e014a634fa3c6"
  },
  {
    "hash": "c28af4bbdd159c7560151a7cdd49724ca80c3f00",
    "short": "c28af4b",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-12T01:29:23+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 86,
    "deletions": 2,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 3,
        "deletions": 1
      },
      {
        "path": "src/styles.css",
        "additions": 83,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/c28af4bbdd159c7560151a7cdd49724ca80c3f00"
  },
  {
    "hash": "f9d0d68b28c22a467dcdf06664dd0a2d32d5acd6",
    "short": "f9d0d68",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-12T01:28:56+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 16,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 16,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f9d0d68b28c22a467dcdf06664dd0a2d32d5acd6"
  },
  {
    "hash": "d488cb10b7d302f6ba8cb9cef2bdbd9e8bf4ae95",
    "short": "d488cb1",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-12T01:27:50+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 4,
    "deletions": 4,
    "fileCount": 2,
    "files": [
      {
        "path": "src/data/questions/extreme-expansion.ts",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/game/extreme.ts",
        "additions": 3,
        "deletions": 3
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/d488cb10b7d302f6ba8cb9cef2bdbd9e8bf4ae95"
  },
  {
    "hash": "c3cd5e44f9687db51d2501fc1b7674eea8391a67",
    "short": "c3cd5e4",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T01:37:30+00:00",
    "subject": "Added extreme trivia and lava",
    "body": "X-Lovable-Edit-ID: edt-4a8b386d-1090-4902-abe6-274775ca2605\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/c3cd5e44f9687db51d2501fc1b7674eea8391a67"
  },
  {
    "hash": "9423d7e9a4e271889f2d0e5af2110495f3d1134e",
    "short": "9423d7e",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T01:37:26+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 219,
    "deletions": 1,
    "fileCount": 3,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "src/data/questions/extreme-expansion.ts",
        "additions": 208,
        "deletions": 0
      },
      {
        "path": "src/game/extreme.ts",
        "additions": 10,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9423d7e9a4e271889f2d0e5af2110495f3d1134e"
  },
  {
    "hash": "477ccb832cbe58d252ab6a7dc091f99d7e760b8d",
    "short": "477ccb8",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:47:38+00:00",
    "subject": "Added neon jet to background",
    "body": "X-Lovable-Edit-ID: edt-c398e46f-50fc-4bfd-ac0b-a0d7303e27e3\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/477ccb832cbe58d252ab6a7dc091f99d7e760b8d"
  },
  {
    "hash": "04dbfc9344926172848a93550cbc006c8d4b51e3",
    "short": "04dbfc9",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:47:31+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/04dbfc9344926172848a93550cbc006c8d4b51e3"
  },
  {
    "hash": "4dac07586a620886ae12555b069fecfe6536e5ce",
    "short": "4dac075",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:47:24+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/styles.css",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4dac07586a620886ae12555b069fecfe6536e5ce"
  },
  {
    "hash": "63472831cfde8a3ee0d48fe6f8dc3efa410a56ad",
    "short": "6347283",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:46:52+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 93,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/styles.css",
        "additions": 93,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/63472831cfde8a3ee0d48fe6f8dc3efa410a56ad"
  },
  {
    "hash": "43631281d6a44e6d00452fc2f00eeb0101ffbf56",
    "short": "4363128",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:46:43+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 11,
    "deletions": 11,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 11,
        "deletions": 11
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/43631281d6a44e6d00452fc2f00eeb0101ffbf56"
  },
  {
    "hash": "68cd296ec37ddc7ce81daf2040561ffdded9b866",
    "short": "68cd296",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:46:22+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 49,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 49,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/68cd296ec37ddc7ce81daf2040561ffdded9b866"
  },
  {
    "hash": "723a0b1b10fabf8e4c4edcb8f8d42125b6ff8b37",
    "short": "723a0b1",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:45:59+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 12,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 12,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/723a0b1b10fabf8e4c4edcb8f8d42125b6ff8b37"
  },
  {
    "hash": "feee177b87a0784f64584c7ab5ea2a7caf246e59",
    "short": "feee177",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:45:51+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 4,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 4,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/feee177b87a0784f64584c7ab5ea2a7caf246e59"
  },
  {
    "hash": "a00e5398cb559b109557bdd90cc3b00a6d83972c",
    "short": "a00e539",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:45:24+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 2,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 2,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/a00e5398cb559b109557bdd90cc3b00a6d83972c"
  },
  {
    "hash": "a1bac235b0c89787f1a3aca35c1499e318d5c9e5",
    "short": "a1bac23",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:45:04+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 31,
    "deletions": 7,
    "fileCount": 1,
    "files": [
      {
        "path": "src/styles.css",
        "additions": 31,
        "deletions": 7
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/a1bac235b0c89787f1a3aca35c1499e318d5c9e5"
  },
  {
    "hash": "6126aa66693fd2c4c722eb3c347b39252b297476",
    "short": "6126aa6",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:38:41+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 2,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 2,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6126aa66693fd2c4c722eb3c347b39252b297476"
  },
  {
    "hash": "0ceb84867c27d357fb1e5464b8320572bb8d9d72",
    "short": "0ceb848",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:37:30+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/0ceb84867c27d357fb1e5464b8320572bb8d9d72"
  },
  {
    "hash": "8cd0b1b6719807dc27919d5f7e1aa3ab0df31023",
    "short": "8cd0b1b",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:37:16+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 11,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/assets/enoch-ra-moon.png.asset.json",
        "additions": 11,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/8cd0b1b6719807dc27919d5f7e1aa3ab0df31023"
  },
  {
    "hash": "a4fe6a346b3186a77364a5237343ea02a3423740",
    "short": "a4fe6a3",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:36:36+00:00",
    "subject": "Updated moon with new PNG",
    "body": "X-Lovable-Edit-ID: edt-86ae03bf-f00a-4c34-9174-f5a0e11e6c73\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/a4fe6a346b3186a77364a5237343ea02a3423740"
  },
  {
    "hash": "eb75d55ea9a0881dbcde234b2d1e16fdcd0307ef",
    "short": "eb75d55",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:36:35+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 7,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": ".lovable/north-star.md",
        "additions": 7,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/eb75d55ea9a0881dbcde234b2d1e16fdcd0307ef"
  },
  {
    "hash": "232e23500728fe8041178d7061789ec65edd6e28",
    "short": "232e235",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:36:19+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 38,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/styles.css",
        "additions": 38,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/232e23500728fe8041178d7061789ec65edd6e28"
  },
  {
    "hash": "4ffc6ebd8653d68b7d4fd4e52bff36d441b0e433",
    "short": "4ffc6eb",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:36:02+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 2,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 2,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4ffc6ebd8653d68b7d4fd4e52bff36d441b0e433"
  },
  {
    "hash": "854fd9a7b732fb09f21830b40b0df94260e00286",
    "short": "854fd9a",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:35:57+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 18,
    "deletions": 13,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 18,
        "deletions": 13
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/854fd9a7b732fb09f21830b40b0df94260e00286"
  },
  {
    "hash": "2113ce7553b6f5be6ae23ff293b70a8388c7f42f",
    "short": "2113ce7",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:35:41+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 11,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/assets/seus-moon.png.asset.json",
        "additions": 11,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2113ce7553b6f5be6ae23ff293b70a8388c7f42f"
  },
  {
    "hash": "0504336ad3a0e37b26c9cf406b2e7cb311d2910c",
    "short": "0504336",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:17:07+00:00",
    "subject": "Set title to \"Zeus Ammon-Ra 11",
    "body": "X-Lovable-Edit-ID: edt-adbf9f7b-fb9b-4fd5-a6e5-97c595193b23\nCo-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/0504336ad3a0e37b26c9cf406b2e7cb311d2910c"
  },
  {
    "hash": "3f3b575d0c23ec6b925312ffb890fb31d2bf2c12",
    "short": "3f3b575",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:16:55+00:00",
    "subject": "Changes",
    "body": "Co-authored-by: jonathandanangel <187897605+jonathandanangel@users.noreply.github.com>",
    "additions": 5,
    "deletions": 5,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/Finale.tsx",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/routes/index.tsx",
        "additions": 2,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/3f3b575d0c23ec6b925312ffb890fb31d2bf2c12"
  },
  {
    "hash": "f273f279aa183b157be0a26233c8ecf019614ebf",
    "short": "f273f27",
    "author": "Lovable",
    "email": "159125892+lovable-dev[bot]@users.noreply.github.com",
    "date": "2026-09-11T00:09:01+00:00",
    "subject": "Add project README",
    "body": "",
    "additions": 8,
    "deletions": 11,
    "fileCount": 1,
    "files": [
      {
        "path": "README.md",
        "additions": 8,
        "deletions": 11
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f273f279aa183b157be0a26233c8ecf019614ebf"
  },
  {
    "hash": "44696c7a3b8846294caace6abac19c53056e3e76",
    "short": "44696c7",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:57:42+00:00",
    "subject": "Escalated Extreme turb tracks",
    "body": "X-Lovable-Edit-ID: edt-7c0e5d2e-cc2c-4989-b5af-a33320d01ff1",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/44696c7a3b8846294caace6abac19c53056e3e76"
  },
  {
    "hash": "191550f2085b67b0400cb4efe7097d4fc2ca28d6",
    "short": "191550f",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:57:33+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/191550f2085b67b0400cb4efe7097d4fc2ca28d6"
  },
  {
    "hash": "840c4c11ebd29afbbfafd8400c7531edd04bf61c",
    "short": "840c4c1",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:57:19+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 7,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 7,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/840c4c11ebd29afbbfafd8400c7531edd04bf61c"
  },
  {
    "hash": "1c5bc62f23f65c53045fe4239d97569d38291849",
    "short": "1c5bc62",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:57:10+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 13,
    "deletions": 7,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/audio.ts",
        "additions": 13,
        "deletions": 7
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/1c5bc62f23f65c53045fe4239d97569d38291849"
  },
  {
    "hash": "125b1e4cf9c9192798fb8e64a9cf78f52d4b437d",
    "short": "125b1e4",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:56:51+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 2,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/audio.ts",
        "additions": 2,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/125b1e4cf9c9192798fb8e64a9cf78f52d4b437d"
  },
  {
    "hash": "b8f6d9e64e59723d64af0d4012d7a87e3ac5b674",
    "short": "b8f6d9e",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:56:38+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/audio.ts",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b8f6d9e64e59723d64af0d4012d7a87e3ac5b674"
  },
  {
    "hash": "b8474305f928a1b42d28d1053950b698694614c5",
    "short": "b847430",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:56:31+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 25,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/audio.ts",
        "additions": 25,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b8474305f928a1b42d28d1053950b698694614c5"
  },
  {
    "hash": "c201748dd3c0b6cee3b10256b8a44fce50592434",
    "short": "c201748",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:56:08+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 16,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/audio.ts",
        "additions": 16,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/c201748dd3c0b6cee3b10256b8a44fce50592434"
  },
  {
    "hash": "45e9f4120778d2fb649d27bc628e9fc209cca91a",
    "short": "45e9f41",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:13:45+00:00",
    "subject": "Added Extreme mode music",
    "body": "X-Lovable-Edit-ID: edt-4ff5247c-8d18-40c0-bb1a-fa2429925b0d",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/45e9f4120778d2fb649d27bc628e9fc209cca91a"
  },
  {
    "hash": "884f1ac34dd9945aa49245f586532448d30986f0",
    "short": "884f1ac",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:13:30+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 2,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 2,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/884f1ac34dd9945aa49245f586532448d30986f0"
  },
  {
    "hash": "55bdf585f6aa30c1872d7cdb2ca0b60189cd756f",
    "short": "55bdf58",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:13:22+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 9,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 9,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/55bdf585f6aa30c1872d7cdb2ca0b60189cd756f"
  },
  {
    "hash": "6ba9c88786e256b3857bbb09d3382ae9cdc116a4",
    "short": "6ba9c88",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:13:13+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 37,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/audio.ts",
        "additions": 37,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6ba9c88786e256b3857bbb09d3382ae9cdc116a4"
  },
  {
    "hash": "b103441c105c601a3dd3199716b82e187e3bf4e1",
    "short": "b103441",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:12:51+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/audio.ts",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b103441c105c601a3dd3199716b82e187e3bf4e1"
  },
  {
    "hash": "cdba6c1dee5c77ada44e078319e13f6caa4cbcc7",
    "short": "cdba6c1",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:12:40+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 2,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/types.ts",
        "additions": 2,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/cdba6c1dee5c77ada44e078319e13f6caa4cbcc7"
  },
  {
    "hash": "7fa0f0927aa42cd1bee5326e73b48f27d4e99961",
    "short": "7fa0f09",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:05:43+00:00",
    "subject": "Added aerodynamics opener",
    "body": "X-Lovable-Edit-ID: edt-9800bf2b-6456-401e-8fb1-5ebb0961d5a0",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/7fa0f0927aa42cd1bee5326e73b48f27d4e99961"
  },
  {
    "hash": "55c6a15845c37f1003b8265032f6e4c818a8b236",
    "short": "55c6a15",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:04:45+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/55c6a15845c37f1003b8265032f6e4c818a8b236"
  },
  {
    "hash": "c1d58b1afd6f64e52b7bf93f168c00d2f994bcae",
    "short": "c1d58b1",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:04:11+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 22,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/ExtremeBriefing.tsx",
        "additions": 22,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/c1d58b1afd6f64e52b7bf93f168c00d2f994bcae"
  },
  {
    "hash": "5fa177d0ead7c4b6698fe9bd3c424b00add48fed",
    "short": "5fa177d",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:02:51+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 121,
    "deletions": 0,
    "fileCount": 11,
    "files": [
      {
        "path": "src/assets/basic-aerodynamics.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b1.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b10.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b2.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b3.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b4.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b5.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b6.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b7.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b8.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b9.png.asset.json",
        "additions": 11,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5fa177d0ead7c4b6698fe9bd3c424b00add48fed"
  },
  {
    "hash": "68a4ed0e072e9f2b21f272541316c01539561ab5",
    "short": "68a4ed0",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T20:01:29+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/68a4ed0e072e9f2b21f272541316c01539561ab5"
  },
  {
    "hash": "4a6b38625df2d5e0305a6e0ed68f0a6d1e1b57a7",
    "short": "4a6b386",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:59:36+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 0,
    "deletions": 0,
    "fileCount": 10,
    "files": [
      {
        "path": "src/assets/lecture-b1.png.asset.json",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b10.png.asset.json",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b2.png.asset.json",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b3.png.asset.json",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b4.png.asset.json",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b5.png.asset.json",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b6.png.asset.json",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b7.png.asset.json",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b8.png.asset.json",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/lecture-b9.png.asset.json",
        "additions": 0,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4a6b38625df2d5e0305a6e0ed68f0a6d1e1b57a7"
  },
  {
    "hash": "888c727e2eaaa834dc360a2fbcbdd31f1ef13146",
    "short": "888c727",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:54:35+00:00",
    "subject": "Added NASA rudder slide",
    "body": "X-Lovable-Edit-ID: edt-5a623339-6496-4cfb-834d-6d98f414a9d2",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/888c727e2eaaa834dc360a2fbcbdd31f1ef13146"
  },
  {
    "hash": "286d25c5f87abfe6731550ad5e98e19bb5543bd2",
    "short": "286d25c",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:54:29+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/ExtremeBriefing.tsx",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/286d25c5f87abfe6731550ad5e98e19bb5543bd2"
  },
  {
    "hash": "9741e43df8287efef94d8fa767bddce1d0aa6b5c",
    "short": "9741e43",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:54:22+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/ExtremeBriefing.tsx",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9741e43df8287efef94d8fa767bddce1d0aa6b5c"
  },
  {
    "hash": "4e04da553dbfe99ca4a7777c996d24b6d336bba3",
    "short": "4e04da5",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:54:13+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 11,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/assets/vertical-stabilizer-rudder.png.asset.json",
        "additions": 11,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4e04da553dbfe99ca4a7777c996d24b6d336bba3"
  },
  {
    "hash": "5c65b0acec210d3a8224f4eeeb380871f0c70b79",
    "short": "5c65b0a",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:36:42+00:00",
    "subject": "Expanded briefing to 10 slides",
    "body": "X-Lovable-Edit-ID: edt-b2401432-3156-44eb-8aa9-3415ccc204ba",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5c65b0acec210d3a8224f4eeeb380871f0c70b79"
  },
  {
    "hash": "5fcea4e9924b3d5a5062fae92a81a3dec40d0546",
    "short": "5fcea4e",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:36:35+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 2,
    "deletions": 1,
    "fileCount": 2,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "src/styles.css",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5fcea4e9924b3d5a5062fae92a81a3dec40d0546"
  },
  {
    "hash": "24870496c1ccaf0d65745308d8deea7c0391c8d6",
    "short": "2487049",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:36:25+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 11,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/styles.css",
        "additions": 11,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/24870496c1ccaf0d65745308d8deea7c0391c8d6"
  },
  {
    "hash": "74f7a5e22706cfb5a51269dc24b2532535b65a55",
    "short": "74f7a5e",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:36:14+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 74,
    "deletions": 17,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/ExtremeBriefing.tsx",
        "additions": 74,
        "deletions": 17
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/74f7a5e22706cfb5a51269dc24b2532535b65a55"
  },
  {
    "hash": "6cf7b1db697509033c221ac25c408a2e945f3c54",
    "short": "6cf7b1d",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:35:47+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 11,
    "deletions": 11,
    "fileCount": 2,
    "files": [
      {
        "path": "src/assets/briefing-lecture.mov.asset.json",
        "additions": 0,
        "deletions": 11
      },
      {
        "path": "src/assets/briefing-lecture.mp4.asset.json",
        "additions": 11,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6cf7b1db697509033c221ac25c408a2e945f3c54"
  },
  {
    "hash": "62b48b51f902de120e98d181d6a484d77c394cdd",
    "short": "62b48b5",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:33:56+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 11,
    "deletions": 0,
    "fileCount": 2,
    "files": [
      {
        "path": "src/assets/nerd-brain.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/nerd-brain.png.asset.json",
        "additions": 11,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/62b48b51f902de120e98d181d6a484d77c394cdd"
  },
  {
    "hash": "c63cf05ffb02b3180da9693e7ec70f861d9ddc7e",
    "short": "c63cf05",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:32:46+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 77,
    "deletions": 0,
    "fileCount": 8,
    "files": [
      {
        "path": "src/assets/briefing-lecture.mov.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/nerd-brain.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/notes-122932.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/notes-122942.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/notes-122957.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/notes-123007.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/notes-123014.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/notes-123020.png.asset.json",
        "additions": 11,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/c63cf05ffb02b3180da9693e7ec70f861d9ddc7e"
  },
  {
    "hash": "70a85aa60532470d11983942b21ee89427b94dee",
    "short": "70a85aa",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:27:47+00:00",
    "subject": "Added briefing sequence",
    "body": "X-Lovable-Edit-ID: edt-d50d2ccd-7569-4f68-b79a-5188fb1054e8",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/70a85aa60532470d11983942b21ee89427b94dee"
  },
  {
    "hash": "4126e31e424f639eb836603904fb8f6a50c451bb",
    "short": "4126e31",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:27:42+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4126e31e424f639eb836603904fb8f6a50c451bb"
  },
  {
    "hash": "be246813aeb4731b76ccb81524f876ba3e2faac0",
    "short": "be24681",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:27:32+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 11,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 11,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/be246813aeb4731b76ccb81524f876ba3e2faac0"
  },
  {
    "hash": "ee82cdcab73a3cf0a154d68b4341f80c9474a7c7",
    "short": "ee82cdc",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:27:19+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 5,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/audio.ts",
        "additions": 5,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ee82cdcab73a3cf0a154d68b4341f80c9474a7c7"
  },
  {
    "hash": "0dc5411c22177c3b9ddd4979d363d878e3393359",
    "short": "0dc5411",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:27:12+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 97,
    "deletions": 0,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/ExtremeBriefing.tsx",
        "additions": 96,
        "deletions": 0
      },
      {
        "path": "src/game/audio.ts",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/0dc5411c22177c3b9ddd4979d363d878e3393359"
  },
  {
    "hash": "e90625d228de79cb2d5c95bd1906d3e1813441fe",
    "short": "e90625d",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T19:26:48+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 44,
    "deletions": 0,
    "fileCount": 4,
    "files": [
      {
        "path": "src/assets/airfoil-force-vectors.jpg.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/airfoil-geometry.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/wing-forces-moments.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/wing-geometry.gif.asset.json",
        "additions": 11,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/e90625d228de79cb2d5c95bd1906d3e1813441fe"
  },
  {
    "hash": "becb8d3f7a3efb69010bd947231caea405d06a80",
    "short": "becb8d3",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:53:19+00:00",
    "subject": "Updated HP + memory mechanics",
    "body": "X-Lovable-Edit-ID: edt-9c7467cf-a033-4dfb-bde1-a16844ae74f0",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/becb8d3f7a3efb69010bd947231caea405d06a80"
  },
  {
    "hash": "5e2d00bcfcb6ca2666975f9eb34b3a120def2682",
    "short": "5e2d00b",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:53:10+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5e2d00bcfcb6ca2666975f9eb34b3a120def2682"
  },
  {
    "hash": "773735cc3a37557d9536650eb248cfc2f60c4200",
    "short": "773735c",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:52:52+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 4,
    "deletions": 3,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 4,
        "deletions": 3
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/773735cc3a37557d9536650eb248cfc2f60c4200"
  },
  {
    "hash": "13b5179b076fa248f4bb6a8b0ec78a51481745c3",
    "short": "13b5179",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:52:40+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 2,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 2,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/13b5179b076fa248f4bb6a8b0ec78a51481745c3"
  },
  {
    "hash": "a43b335a659cdb728671b92d3e916912fb98ab66",
    "short": "a43b335",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:52:28+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 4,
    "deletions": 4,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/HealthBar.tsx",
        "additions": 4,
        "deletions": 4
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/a43b335a659cdb728671b92d3e916912fb98ab66"
  },
  {
    "hash": "f5b9a197ee99115d92a028ce5ac868c32298b285",
    "short": "f5b9a19",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:52:13+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 6,
    "deletions": 2,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/HealthBar.tsx",
        "additions": 5,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f5b9a197ee99115d92a028ce5ac868c32298b285"
  },
  {
    "hash": "185729b8ad8777a2d8715bde55117b176433fa27",
    "short": "185729b",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:51:55+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 3,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 3,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/185729b8ad8777a2d8715bde55117b176433fa27"
  },
  {
    "hash": "4280bd73a7ca2ab2d6ac7900503c89fab770b18b",
    "short": "4280bd7",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:44:50+00:00",
    "subject": "Animated laser fade in Path Memory",
    "body": "X-Lovable-Edit-ID: edt-d1e636f5-da7d-4806-b99d-fb0476b5cac0",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4280bd73a7ca2ab2d6ac7900503c89fab770b18b"
  },
  {
    "hash": "525c7540d8c37c585c301a29cbd208bbed546e4f",
    "short": "525c754",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:41:02+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/525c7540d8c37c585c301a29cbd208bbed546e4f"
  },
  {
    "hash": "94772cbf8d5c63d0a599d2607b779a2669cd8f08",
    "short": "94772cb",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:40:52+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 3,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 3,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/94772cbf8d5c63d0a599d2607b779a2669cd8f08"
  },
  {
    "hash": "d68a919b87fa3415f1c13812aaa676bd1e72235a",
    "short": "d68a919",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:40:43+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/d68a919b87fa3415f1c13812aaa676bd1e72235a"
  },
  {
    "hash": "e9d51db82c37e7b56bc270748928c53f07c1ab54",
    "short": "e9d51db",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:40:36+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/e9d51db82c37e7b56bc270748928c53f07c1ab54"
  },
  {
    "hash": "4d38c2783ce3588d0249428324e82e317ecb2fa0",
    "short": "4d38c27",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:40:28+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 13,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 13,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4d38c2783ce3588d0249428324e82e317ecb2fa0"
  },
  {
    "hash": "f4b6e870b1dfa859c224b47aaa97575d822a952b",
    "short": "f4b6e87",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:40:19+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 12,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 12,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f4b6e870b1dfa859c224b47aaa97575d822a952b"
  },
  {
    "hash": "2d39c977ddd5d2e844631f3cdc79a2cbc6a16b4e",
    "short": "2d39c97",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:40:12+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 5,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 5,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2d39c977ddd5d2e844631f3cdc79a2cbc6a16b4e"
  },
  {
    "hash": "4f777aa22bad6b74b7a5f7ab9800e7d9694423d3",
    "short": "4f777aa",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:40:05+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 3,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 3,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4f777aa22bad6b74b7a5f7ab9800e7d9694423d3"
  },
  {
    "hash": "e501cca1872748c78aae48cbea39cb1afce9c9e0",
    "short": "e501cca",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:39:57+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/e501cca1872748c78aae48cbea39cb1afce9c9e0"
  },
  {
    "hash": "53c10bce691528e4495ea5efac86162edb9c8dd5",
    "short": "53c10bc",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:39:24+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 131,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/styles.css",
        "additions": 131,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/53c10bce691528e4495ea5efac86162edb9c8dd5"
  },
  {
    "hash": "08486bdc26416c28637f6cba888139973f2e5a62",
    "short": "08486bd",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:39:00+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 5,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/styles.css",
        "additions": 5,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/08486bdc26416c28637f6cba888139973f2e5a62"
  },
  {
    "hash": "906262e3aa2ddc97d4e5eda8abe2d75305ff2eb6",
    "short": "906262e",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:38:43+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 7,
    "deletions": 5,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 7,
        "deletions": 5
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/906262e3aa2ddc97d4e5eda8abe2d75305ff2eb6"
  },
  {
    "hash": "cb71ac57df7584a80d00292d0f7d8871aa19dffb",
    "short": "cb71ac5",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:38:35+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/cb71ac57df7584a80d00292d0f7d8871aa19dffb"
  },
  {
    "hash": "1753acae5bfbbae8677ff22f1989bece265f118a",
    "short": "1753aca",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:38:27+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 3,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 3,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/1753acae5bfbbae8677ff22f1989bece265f118a"
  },
  {
    "hash": "701542e0e53b486eccd0263a0fc38999c8c8ec60",
    "short": "701542e",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:38:20+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 7,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 7,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/701542e0e53b486eccd0263a0fc38999c8c8ec60"
  },
  {
    "hash": "e90cd7a142013677d77968bfef6f0ea550e6ea9c",
    "short": "e90cd7a",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:38:13+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/e90cd7a142013677d77968bfef6f0ea550e6ea9c"
  },
  {
    "hash": "9881007261c759b00574a50ddbaa817515c264b7",
    "short": "9881007",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:38:05+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9881007261c759b00574a50ddbaa817515c264b7"
  },
  {
    "hash": "31319a357ba535f0b728c1b961f1ef93a536a6b8",
    "short": "31319a3",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:37:57+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/31319a357ba535f0b728c1b961f1ef93a536a6b8"
  },
  {
    "hash": "77a838eccb0801ff77d4c376373bf98ecb4731da",
    "short": "77a838e",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:37:47+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/77a838eccb0801ff77d4c376373bf98ecb4731da"
  },
  {
    "hash": "6d688592408e34e4fc11dd6946713f13d410d1fd",
    "short": "6d68859",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:36:52+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 1,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6d688592408e34e4fc11dd6946713f13d410d1fd"
  },
  {
    "hash": "34f741a9019b6979d92327f918f996c26d4d11b8",
    "short": "34f741a",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:36:37+00:00",
    "subject": "Work in progress",
    "body": "",
    "additions": 74,
    "deletions": 20,
    "fileCount": 7,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 8,
        "deletions": 1
      },
      {
        "path": "src/assets/brainpic-2.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 13,
        "deletions": 6
      },
      {
        "path": "src/components/game/BrainOverload.tsx",
        "additions": 5,
        "deletions": 4
      },
      {
        "path": "src/components/game/HealthBar.tsx",
        "additions": 3,
        "deletions": 3
      },
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 2,
        "deletions": 1
      },
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 32,
        "deletions": 5
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/34f741a9019b6979d92327f918f996c26d4d11b8"
  },
  {
    "hash": "8f3042af949604c5952837246ef9c49517e6ad91",
    "short": "8f3042a",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:23:28+00:00",
    "subject": "Adjusted brain explosion trigger",
    "body": "X-Lovable-Edit-ID: edt-aa83b81d-76e5-453d-8da5-1283c14c0bf1",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/8f3042af949604c5952837246ef9c49517e6ad91"
  },
  {
    "hash": "8b373053c4b5a11c0bdf81237edc375f635400d6",
    "short": "8b37305",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:23:15+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/8b373053c4b5a11c0bdf81237edc375f635400d6"
  },
  {
    "hash": "1a8fe140bd2f6bd6fc990a90e6fc2304f9c43e67",
    "short": "1a8fe14",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:21:35+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 11,
    "deletions": 4,
    "fileCount": 2,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 4,
        "deletions": 1
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 7,
        "deletions": 3
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/1a8fe140bd2f6bd6fc990a90e6fc2304f9c43e67"
  },
  {
    "hash": "9004d7c7ffd36766efe5fa7714f4b15093192737",
    "short": "9004d7c",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:21:19+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 203,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/styles.css",
        "additions": 203,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9004d7c7ffd36766efe5fa7714f4b15093192737"
  },
  {
    "hash": "0b82b692f7b50b8e9b9cfe4a4b91d87584a5dd1d",
    "short": "0b82b69",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:20:49+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 93,
    "deletions": 16,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 80,
        "deletions": 13
      },
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 8,
        "deletions": 0
      },
      {
        "path": "src/game/store.tsx",
        "additions": 4,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/0b82b692f7b50b8e9b9cfe4a4b91d87584a5dd1d"
  },
  {
    "hash": "4af32c4c8ead9384017c803f334a108e22028266",
    "short": "4af32c4",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:20:04+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 347,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/MemoryGauntlet.tsx",
        "additions": 347,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4af32c4c8ead9384017c803f334a108e22028266"
  },
  {
    "hash": "4c51fbda8d59e46f0f13b900760995d1ef746466",
    "short": "4c51fbd",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:19:18+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 27,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/audio.ts",
        "additions": 27,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4c51fbda8d59e46f0f13b900760995d1ef746466"
  },
  {
    "hash": "2298d40204caf4c7b909232d1c61a2e6f31eee82",
    "short": "2298d40",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T18:19:06+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 96,
    "deletions": 0,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/BrainOverload.tsx",
        "additions": 34,
        "deletions": 0
      },
      {
        "path": "src/components/game/HealthBar.tsx",
        "additions": 46,
        "deletions": 0
      },
      {
        "path": "src/game/extreme.ts",
        "additions": 16,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2298d40204caf4c7b909232d1c61a2e6f31eee82"
  },
  {
    "hash": "6f1a09a7f21e5cd34e2e3075e31dbe3065832a6e",
    "short": "6f1a09a",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T17:47:46+00:00",
    "subject": "Added Aerodynamics mode",
    "body": "X-Lovable-Edit-ID: edt-f3e3c0a0-f90b-4aa2-8df8-168108757774",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6f1a09a7f21e5cd34e2e3075e31dbe3065832a6e"
  },
  {
    "hash": "c96053b5d99c34eee72fad0a7fbb4c882e7cfb92",
    "short": "c96053b",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T17:47:42+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 49,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": ".lovable/plan.md",
        "additions": 49,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/c96053b5d99c34eee72fad0a7fbb4c882e7cfb92"
  },
  {
    "hash": "3e30b0737bd02f5f3d8e3b5cb617203d1a7fd3a7",
    "short": "3e30b07",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T08:43:38+00:00",
    "subject": "Reoriented Q188 aircraft left",
    "body": "X-Lovable-Edit-ID: edt-83b2c8f8-34e1-43c2-b6f4-84bedbd95b41",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/3e30b0737bd02f5f3d8e3b5cb617203d1a7fd3a7"
  },
  {
    "hash": "74353278589b6b06dab8782db664c4261a1c8f7b",
    "short": "7435327",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T08:42:09+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 11,
    "deletions": 10,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/validate.ts",
        "additions": 11,
        "deletions": 10
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/74353278589b6b06dab8782db664c4261a1c8f7b"
  },
  {
    "hash": "475182bc674e53b6886063cd257ca26f71d54941",
    "short": "475182b",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T08:41:43+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 25,
    "deletions": 6,
    "fileCount": 4,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 2,
        "deletions": 1
      },
      {
        "path": "src/components/game/Diagram.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/data/questions/g-forces.ts",
        "additions": 4,
        "deletions": 4
      },
      {
        "path": "src/game/validate.ts",
        "additions": 18,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/475182bc674e53b6886063cd257ca26f71d54941"
  },
  {
    "hash": "cbb22d3f5832009974883262abcff92c571bfb7c",
    "short": "cbb22d3",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T08:05:05+00:00",
    "subject": "Calibrated moon glow & bloom",
    "body": "X-Lovable-Edit-ID: edt-193c64ae-f083-4c56-8018-f2020d8c9be9",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/cbb22d3f5832009974883262abcff92c571bfb7c"
  },
  {
    "hash": "13ec59c121d93aa91c2447e06cec1b779b6aedc6",
    "short": "13ec59c",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T08:02:44+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 35,
    "deletions": 20,
    "fileCount": 4,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 2,
        "deletions": 1
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 7,
        "deletions": 4
      },
      {
        "path": "src/styles.css",
        "additions": 25,
        "deletions": 14
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/13ec59c121d93aa91c2447e06cec1b779b6aedc6"
  },
  {
    "hash": "b570645dc27a1da25285d14d2195dc27145af6ad",
    "short": "b570645",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:45:34+00:00",
    "subject": "Added blood moon transition",
    "body": "X-Lovable-Edit-ID: edt-66d00a9d-330a-4c3c-a231-c522b8160b20",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b570645dc27a1da25285d14d2195dc27145af6ad"
  },
  {
    "hash": "002403c57c36e38fec175d693e61009082bbf3b0",
    "short": "002403c",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:43:37+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 90,
    "deletions": 5,
    "fileCount": 7,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 2,
        "deletions": 1
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 6,
        "deletions": 0
      },
      {
        "path": "src/components/game/ElectricRecall.tsx",
        "additions": 8,
        "deletions": 2
      },
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 10,
        "deletions": 2
      },
      {
        "path": "src/game/audio.ts",
        "additions": 5,
        "deletions": 0
      },
      {
        "path": "src/game/store.tsx",
        "additions": 3,
        "deletions": 0
      },
      {
        "path": "src/styles.css",
        "additions": 56,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/002403c57c36e38fec175d693e61009082bbf3b0"
  },
  {
    "hash": "4323ff923725f7ed7a8dd4afb147aba0d84a962f",
    "short": "4323ff9",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:42:57+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 0,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": ".lovable/{plan.md => plan/blood-moon-awakening-2026-09-10.md}",
        "additions": 0,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4323ff923725f7ed7a8dd4afb147aba0d84a962f"
  },
  {
    "hash": "4cb97ad55187ada636034445e0c5c3d889d006c7",
    "short": "4cb97ad",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:42:23+00:00",
    "subject": "Persisted blood moon to Q150",
    "body": "X-Lovable-Edit-ID: edt-44215bb1-5411-4a5f-ac4a-682fe1cfd035",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/4cb97ad55187ada636034445e0c5c3d889d006c7"
  },
  {
    "hash": "15bb298d7d6407581588ba5ed48bc1b44526d0c4",
    "short": "15bb298",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:42:15+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 21,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": ".lovable/plan.md",
        "additions": 21,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/15bb298d7d6407581588ba5ed48bc1b44526d0c4"
  },
  {
    "hash": "e87c464539b5be37dcbbd0cdd4b9e1f3404982a1",
    "short": "e87c464",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:33:08+00:00",
    "subject": "Evolved Electric Recall at 150",
    "body": "X-Lovable-Edit-ID: edt-92105453-fe7e-46bc-bd3b-c9846a55dace",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/e87c464539b5be37dcbbd0cdd4b9e1f3404982a1"
  },
  {
    "hash": "6508d473f4d3b716c0a4377fccf27c18a955b8c7",
    "short": "6508d47",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:29:30+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 4,
    "deletions": 2,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/ElectricRecall.tsx",
        "additions": 4,
        "deletions": 2
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6508d473f4d3b716c0a4377fccf27c18a955b8c7"
  },
  {
    "hash": "b860f1aeef7d11f447dad8387c81dc8851fca1da",
    "short": "b860f1a",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:29:16+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 167,
    "deletions": 9,
    "fileCount": 4,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 1,
        "deletions": 0
      },
      {
        "path": "src/components/game/ElectricRecall.tsx",
        "additions": 76,
        "deletions": 9
      },
      {
        "path": "src/game/audio.ts",
        "additions": 4,
        "deletions": 0
      },
      {
        "path": "src/styles.css",
        "additions": 86,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b860f1aeef7d11f447dad8387c81dc8851fca1da"
  },
  {
    "hash": "0b2c4bcf41ee0bb7629329a528580580af3717df",
    "short": "0b2c4bc",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:28:48+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 0,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": ".lovable/{plan.md => plan/evolved-electric-recall-2026-09-10.md}",
        "additions": 0,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/0b2c4bcf41ee0bb7629329a528580580af3717df"
  },
  {
    "hash": "743f865212f0a618e6c01d21d7ad565d2bb7b0bb",
    "short": "743f865",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:27:46+00:00",
    "subject": "Evolved electric recall Q150+",
    "body": "X-Lovable-Edit-ID: edt-c3d9e9e4-ffe7-41eb-96b8-a106d8dd4e79",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/743f865212f0a618e6c01d21d7ad565d2bb7b0bb"
  },
  {
    "hash": "6e8d4ca4bef07d496b7b9f67fa33854215154291",
    "short": "6e8d4ca",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:27:38+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 22,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": ".lovable/plan.md",
        "additions": 22,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/6e8d4ca4bef07d496b7b9f67fa33854215154291"
  },
  {
    "hash": "f1f1d1ba7f3554d48ad925fbe8615fef8c1176f4",
    "short": "f1f1d1b",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:25:56+00:00",
    "subject": "Added 33 aero questions",
    "body": "X-Lovable-Edit-ID: edt-ecd23ed1-7b22-4162-8221-5035ceb0c772",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f1f1d1ba7f3554d48ad925fbe8615fef8c1176f4"
  },
  {
    "hash": "98d88c9f1acfc605d8b6486d5ff78b5d97c28ae8",
    "short": "98d88c9",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:25:47+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 6,
    "deletions": 6,
    "fileCount": 1,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 6,
        "deletions": 6
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/98d88c9f1acfc605d8b6486d5ff78b5d97c28ae8"
  },
  {
    "hash": "7da7c9455c139a911ed22e2c3e008d9447e175ea",
    "short": "7da7c94",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:24:40+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 17,
    "deletions": 3,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/validate.ts",
        "additions": 17,
        "deletions": 3
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/7da7c9455c139a911ed22e2c3e008d9447e175ea"
  },
  {
    "hash": "428bc5f8c03324054cf89bedf1be992f0b9888f3",
    "short": "428bc5f",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:24:24+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 3,
    "deletions": 12,
    "fileCount": 4,
    "files": [
      {
        "path": "src/data/questions/k-high-speed.ts",
        "additions": 0,
        "deletions": 2
      },
      {
        "path": "src/game/authoring-guide.md",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/game/validate.ts",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "tmpscripts/v.ts",
        "additions": 0,
        "deletions": 7
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/428bc5f8c03324054cf89bedf1be992f0b9888f3"
  },
  {
    "hash": "83d70684000d13c36b526978d8b5e8b1fdba6211",
    "short": "83d7068",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:24:00+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 37,
    "deletions": 788,
    "fileCount": 9,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 5,
        "deletions": 5
      },
      {
        "path": "src/components/game/Diagram.tsx",
        "additions": 0,
        "deletions": 1
      },
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 4,
        "deletions": 4
      },
      {
        "path": "src/data/questions/impact.ts",
        "additions": 0,
        "deletions": 747
      },
      {
        "path": "src/data/questions/index.ts",
        "additions": 4,
        "deletions": 12
      },
      {
        "path": "src/game/curriculum.ts",
        "additions": 10,
        "deletions": 10
      },
      {
        "path": "src/game/store.tsx",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/game/types.ts",
        "additions": 1,
        "deletions": 2
      },
      {
        "path": "src/game/validate.ts",
        "additions": 12,
        "deletions": 6
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/83d70684000d13c36b526978d8b5e8b1fdba6211"
  },
  {
    "hash": "89e015316aefc0011dca4998eba70e9b876deace",
    "short": "89e0153",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:23:42+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 106,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/data/questions/k-high-speed.ts",
        "additions": 106,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/89e015316aefc0011dca4998eba70e9b876deace"
  },
  {
    "hash": "b2713228b50746ac224105ec18cf0b726ba40c1c",
    "short": "b271322",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:22:06+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 3,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "roadmap.md",
        "additions": 3,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b2713228b50746ac224105ec18cf0b726ba40c1c"
  },
  {
    "hash": "d047fceae05e15783545e824fc63b5a9b56cf170",
    "short": "d047fce",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:21:12+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 19,
    "deletions": 10,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 19,
        "deletions": 10
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/d047fceae05e15783545e824fc63b5a9b56cf170"
  },
  {
    "hash": "75f135632b0d8d2ad82f065f7385b273a9ddc23e",
    "short": "75f1356",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:20:12+00:00",
    "subject": "Work in progress",
    "body": "",
    "additions": 493,
    "deletions": 17,
    "fileCount": 7,
    "files": [
      {
        "path": ".lovable/{plan.md => plan/neon-maze-intermission-2026-09-10.md}",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "roadmap.md",
        "additions": 6,
        "deletions": 0
      },
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 70,
        "deletions": 16
      },
      {
        "path": "src/components/game/NeonMazeGame.tsx",
        "additions": 372,
        "deletions": 0
      },
      {
        "path": "src/game/audio.ts",
        "additions": 29,
        "deletions": 0
      },
      {
        "path": "src/game/store.tsx",
        "additions": 3,
        "deletions": 0
      },
      {
        "path": "src/styles.css",
        "additions": 13,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/75f135632b0d8d2ad82f065f7385b273a9ddc23e"
  },
  {
    "hash": "0b1f5c51e850ef2b6ad151de381b403ed749e779",
    "short": "0b1f5c5",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:11:07+00:00",
    "subject": "Proposed background task plan",
    "body": "X-Lovable-Edit-ID: edt-e012d108-5fc5-4ef4-b87c-27f7b8a77234",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/0b1f5c51e850ef2b6ad151de381b403ed749e779"
  },
  {
    "hash": "8cd9f9ceb7539e381dda6e9c0feb983b4e23928d",
    "short": "8cd9f9c",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:10:58+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 49,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": ".lovable/plan.md",
        "additions": 49,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/8cd9f9ceb7539e381dda6e9c0feb983b4e23928d"
  },
  {
    "hash": "ea1b71ad3db53a93b42528d2ee8a31c6bb8c8b2d",
    "short": "ea1b71a",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:06:25+00:00",
    "subject": "Added Grid Run arena",
    "body": "X-Lovable-Edit-ID: edt-1c191eaa-9501-4697-b035-146e3e4325b1",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ea1b71ad3db53a93b42528d2ee8a31c6bb8c8b2d"
  },
  {
    "hash": "bfad92f29f784f5eccb3506f9df4662489264208",
    "short": "bfad92f",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:05:59+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 4,
    "deletions": 4,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 4,
        "deletions": 4
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/bfad92f29f784f5eccb3506f9df4662489264208"
  },
  {
    "hash": "85881c5ee71976a4d9a877781cdae3c35125b29e",
    "short": "85881c5",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:03:34+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 15,
    "deletions": 6,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 10,
        "deletions": 3
      },
      {
        "path": "src/components/game/LightCycleGame.tsx",
        "additions": 5,
        "deletions": 3
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/85881c5ee71976a4d9a877781cdae3c35125b29e"
  },
  {
    "hash": "fcbcd36a497ea206f7a75268f670770a73dcdea8",
    "short": "fcbcd36",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:03:08+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 90,
    "deletions": 2,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 51,
        "deletions": 2
      },
      {
        "path": "src/styles.css",
        "additions": 39,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/fcbcd36a497ea206f7a75268f670770a73dcdea8"
  },
  {
    "hash": "b022c55ecc81a42240003d911106cd01b1755689",
    "short": "b022c55",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:02:44+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 360,
    "deletions": 1,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/LightCycleGame.tsx",
        "additions": 334,
        "deletions": 0
      },
      {
        "path": "src/game/audio.ts",
        "additions": 23,
        "deletions": 1
      },
      {
        "path": "src/game/store.tsx",
        "additions": 3,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b022c55ecc81a42240003d911106cd01b1755689"
  },
  {
    "hash": "68b0ba3d4406f707869d3c4ac2e3a17c7bd46596",
    "short": "68b0ba3",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T07:00:42+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 0,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": ".lovable/{plan.md => plan/add-the-grid-run-light-cycle-minigame-2026-09-10.md}",
        "additions": 0,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/68b0ba3d4406f707869d3c4ac2e3a17c7bd46596"
  },
  {
    "hash": "3424923950e337e5aea3992c08f0186a7d2aaee1",
    "short": "3424923",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T06:58:56+00:00",
    "subject": "Implemented background task",
    "body": "X-Lovable-Edit-ID: edt-7634d283-a517-4e75-a3b1-4958e48192cc",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/3424923950e337e5aea3992c08f0186a7d2aaee1"
  },
  {
    "hash": "b68efefa9f24c94567d451c10db910dbf4a99921",
    "short": "b68efef",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T06:58:34+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 43,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": ".lovable/plan.md",
        "additions": 43,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b68efefa9f24c94567d451c10db910dbf4a99921"
  },
  {
    "hash": "5d663dec161288350ccb71654d3c6bb4fc916ef1",
    "short": "5d663de",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T06:53:18+00:00",
    "subject": "Added winged brain variants",
    "body": "X-Lovable-Edit-ID: edt-9cee3a59-af7d-47ea-8703-9a11cc3baaa1",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5d663dec161288350ccb71654d3c6bb4fc916ef1"
  },
  {
    "hash": "66a64186c02cd77cf1eace065a863291f5ee8ac1",
    "short": "66a6418",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T06:52:54+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/BrainCelebration.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/66a64186c02cd77cf1eace065a863291f5ee8ac1"
  },
  {
    "hash": "ab92453c4f90a7e176a92b112f51229cbdf4ae6f",
    "short": "ab92453",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T06:47:55+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 9,
    "deletions": 10,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/BrainCelebration.tsx",
        "additions": 9,
        "deletions": 6
      },
      {
        "path": "src/styles.css",
        "additions": 0,
        "deletions": 4
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ab92453c4f90a7e176a92b112f51229cbdf4ae6f"
  },
  {
    "hash": "dec7117869b927bed7b9d6f16e2c220ba605869b",
    "short": "dec7117",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T06:47:31+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 43,
    "deletions": 11,
    "fileCount": 2,
    "files": [
      {
        "path": "src/components/game/BrainCelebration.tsx",
        "additions": 19,
        "deletions": 7
      },
      {
        "path": "src/styles.css",
        "additions": 24,
        "deletions": 4
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/dec7117869b927bed7b9d6f16e2c220ba605869b"
  },
  {
    "hash": "b0dd0562e1e7a8e041c661a13e3a585764524b06",
    "short": "b0dd056",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T06:46:57+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 33,
    "deletions": 0,
    "fileCount": 6,
    "files": [
      {
        "path": "src/assets/winged-brain-cyan.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/winged-brain-cyan.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/winged-brain-solar.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/winged-brain-solar.png.asset.json",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/assets/winged-brain-volt.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/winged-brain-volt.png.asset.json",
        "additions": 11,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b0dd0562e1e7a8e041c661a13e3a585764524b06"
  },
  {
    "hash": "f5f9fdfd4b4a7f7211e7265f9b2ea80026cebf94",
    "short": "f5f9fdf",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T06:46:18+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 0,
    "deletions": 0,
    "fileCount": 3,
    "files": [
      {
        "path": "src/assets/winged-brain-cyan.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/winged-brain-solar.png",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "src/assets/winged-brain-volt.png",
        "additions": 0,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f5f9fdfd4b4a7f7211e7265f9b2ea80026cebf94"
  },
  {
    "hash": "225f4c6740c4b33850d848d241f6d38da2a5fbea",
    "short": "225f4c6",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:52:43+00:00",
    "subject": "Added flyby celebration",
    "body": "X-Lovable-Edit-ID: edt-4dfe4226-55a3-4445-b413-0a11160720a6",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/225f4c6740c4b33850d848d241f6d38da2a5fbea"
  },
  {
    "hash": "ddc5710c96b39ade08eabd980fe0f7ea7175d9e6",
    "short": "ddc5710",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:52:04+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 151,
    "deletions": 0,
    "fileCount": 3,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 5,
        "deletions": 0
      },
      {
        "path": "src/components/game/BrainCelebration.tsx",
        "additions": 69,
        "deletions": 0
      },
      {
        "path": "src/styles.css",
        "additions": 77,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ddc5710c96b39ade08eabd980fe0f7ea7175d9e6"
  },
  {
    "hash": "01ad811a6dc4f0f1cd588fd40e5bc0fd56a6d78c",
    "short": "01ad811",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:51:35+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 11,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/assets/winged-brain.png.asset.json",
        "additions": 11,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/01ad811a6dc4f0f1cd588fd40e5bc0fd56a6d78c"
  },
  {
    "hash": "17aeedfd3c3ff99ddf92bb42d517c20fafc0ed6f",
    "short": "17aeedf",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:40:10+00:00",
    "subject": "Implemented game UI screens",
    "body": "X-Lovable-Edit-ID: edt-5ec3c64a-b340-4ff4-af40-3eacd169bfe1",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/17aeedfd3c3ff99ddf92bb42d517c20fafc0ed6f"
  },
  {
    "hash": "cc10579545dc46f63a48e2e5b6bb18d5c4c6d3b7",
    "short": "cc10579",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:40:04+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 0,
    "deletions": 4,
    "fileCount": 1,
    "files": [
      {
        "path": "tmpscripts/t.ts",
        "additions": 0,
        "deletions": 4
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/cc10579545dc46f63a48e2e5b6bb18d5c4c6d3b7"
  },
  {
    "hash": "ffa0cf48167b6ecac702c907cb62b5bc75b023cc",
    "short": "ffa0cf4",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:39:55+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 3,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 3,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ffa0cf48167b6ecac702c907cb62b5bc75b023cc"
  },
  {
    "hash": "295f8c9a235b949da4dc4cc5c2bc09561f50abbd",
    "short": "295f8c9",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:38:58+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 4,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "tmpscripts/t.ts",
        "additions": 4,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/295f8c9a235b949da4dc4cc5c2bc09561f50abbd"
  },
  {
    "hash": "336183e5dfbeb157aa25a27b0fc5b051c24ff3d2",
    "short": "336183e",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:32:43+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 6,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/routes/__root.tsx",
        "additions": 6,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/336183e5dfbeb157aa25a27b0fc5b051c24ff3d2"
  },
  {
    "hash": "123fe53d27932cc8a2710d240052d7629693e6d3",
    "short": "123fe53",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:32:25+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 23,
    "deletions": 14,
    "fileCount": 1,
    "files": [
      {
        "path": "src/routes/index.tsx",
        "additions": 23,
        "deletions": 14
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/123fe53d27932cc8a2710d240052d7629693e6d3"
  },
  {
    "hash": "9a48388becf269f228bf310f6efebc5dbab2a667",
    "short": "9a48388",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:32:14+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 401,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/AeroGrid.tsx",
        "additions": 401,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9a48388becf269f228bf310f6efebc5dbab2a667"
  },
  {
    "hash": "b45e3d552345f4275cb9028865a4f5cbd8edce5d",
    "short": "b45e3d5",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:31:24+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 107,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/Finale.tsx",
        "additions": 107,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b45e3d552345f4275cb9028865a4f5cbd8edce5d"
  },
  {
    "hash": "155006553391a440ddee7c088ca7f7b0b60971b7",
    "short": "1550065",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:30:58+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 83,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/SettingsPanel.tsx",
        "additions": 83,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/155006553391a440ddee7c088ca7f7b0b60971b7"
  },
  {
    "hash": "a2244a483340ae01b319f337cac840eca1f68d23",
    "short": "a2244a4",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:30:43+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 55,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/TitleScreen.tsx",
        "additions": 55,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/a2244a483340ae01b319f337cac840eca1f68d23"
  },
  {
    "hash": "5f353d8070c8a3c90d8b0cedd3256317994fb195",
    "short": "5f353d8",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:30:30+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 38,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/ValidationPanel.tsx",
        "additions": 38,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5f353d8070c8a3c90d8b0cedd3256317994fb195"
  },
  {
    "hash": "2138748e43b98c5258f457b1701f3a18f9252eb2",
    "short": "2138748",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:30:19+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 108,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/ElectricRecall.tsx",
        "additions": 108,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2138748e43b98c5258f457b1701f3a18f9252eb2"
  },
  {
    "hash": "fac1d0faad0aea5f1d2e34d9e9c49ad0f3137d45",
    "short": "fac1d0f",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:30:01+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 70,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/WorldBackground.tsx",
        "additions": 70,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/fac1d0faad0aea5f1d2e34d9e9c49ad0f3137d45"
  },
  {
    "hash": "cbab38b8ece00b3a809a41ad07433d8dcd19b99a",
    "short": "cbab38b",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:29:40+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1,
    "deletions": 1,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/Diagram.tsx",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/cbab38b8ece00b3a809a41ad07433d8dcd19b99a"
  },
  {
    "hash": "434c7c5ced1f2c0c86f2dc64e4196aefcc5a496a",
    "short": "434c7c5",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:29:33+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 379,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/Interactions.tsx",
        "additions": 379,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/434c7c5ced1f2c0c86f2dc64e4196aefcc5a496a"
  },
  {
    "hash": "9895ae04994e8bbde111485951bf947c053d20d9",
    "short": "9895ae0",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:28:43+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 65,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/answer.ts",
        "additions": 65,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/9895ae04994e8bbde111485951bf947c053d20d9"
  },
  {
    "hash": "58befff8df80c35dc2318396030ee40dab7a28d2",
    "short": "58befff",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:28:29+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 270,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/components/game/Diagram.tsx",
        "additions": 270,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/58befff8df80c35dc2318396030ee40dab7a28d2"
  },
  {
    "hash": "0be4edee369fad2222ded9728ac2d6519708f651",
    "short": "0be4ede",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:27:16+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 5,
    "deletions": 5,
    "fileCount": 4,
    "files": [
      {
        "path": "src/data/questions/a-foundations.ts",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/data/questions/c-momentum.ts",
        "additions": 2,
        "deletions": 2
      },
      {
        "path": "src/data/questions/e-boundary-layer.ts",
        "additions": 1,
        "deletions": 1
      },
      {
        "path": "src/data/questions/i-coefficients.ts",
        "additions": 1,
        "deletions": 1
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/0be4edee369fad2222ded9728ac2d6519708f651"
  },
  {
    "hash": "96440f279b7959ca31479e90925529d06e741af7",
    "short": "96440f2",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:27:00+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 3,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "tmpscripts/f.ts",
        "additions": 3,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/96440f279b7959ca31479e90925529d06e741af7"
  },
  {
    "hash": "970108d2faf15006c28ad404c1de06d7d475c34b",
    "short": "970108d",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:26:48+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 7,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "tmpscripts/v.ts",
        "additions": 7,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/970108d2faf15006c28ad404c1de06d7d475c34b"
  },
  {
    "hash": "79c6d721ed077d1f24a3f1fd88069ed80571d15c",
    "short": "79c6d72",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:12:05+00:00",
    "subject": "Lovable update",
    "body": "Background task agent_id=sub_q1d4nrkh project=1258e214-74bc-431f-94f1-f1f882ee91d1 completed\n\nX-Lovable-Edit-ID: edt-2665d936-1877-4c87-9fa8-81df5c1518f6",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/79c6d721ed077d1f24a3f1fd88069ed80571d15c"
  },
  {
    "hash": "0a652a4356d344196279be8d11330becbd296347",
    "short": "0a652a4",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:11:48+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 628,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/data/questions/h-drag.ts",
        "additions": 628,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/0a652a4356d344196279be8d11330becbd296347"
  },
  {
    "hash": "227f79eac22a579d6cc9428eead012b112b81cb0",
    "short": "227f79e",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:01:46+00:00",
    "subject": "Lovable update",
    "body": "Background task agent_id=sub_5nv20k72 project=1258e214-74bc-431f-94f1-f1f882ee91d1 completed\n\nX-Lovable-Edit-ID: edt-a091fcc3-ba7a-4d7e-ae4f-4822bdaa9e39",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/227f79eac22a579d6cc9428eead012b112b81cb0"
  },
  {
    "hash": "16d50a6d6801ca1ebfe9db00979e3913537d7453",
    "short": "16d50a6",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:01:37+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 534,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/data/questions/d-viscosity.ts",
        "additions": 534,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/16d50a6d6801ca1ebfe9db00979e3913537d7453"
  },
  {
    "hash": "b225394f40cba8a5918cab9b6a7ac1cace460183",
    "short": "b225394",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:00:46+00:00",
    "subject": "Updated contact fields",
    "body": "X-Lovable-Edit-ID: edt-db8b3a3a-3ba7-4888-817f-e17267b20da0",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b225394f40cba8a5918cab9b6a7ac1cace460183"
  },
  {
    "hash": "fa738bf93c1406073c398f0a63dac378b82a0c24",
    "short": "fa738bf",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:00:42+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1297,
    "deletions": 0,
    "fileCount": 3,
    "files": [
      {
        "path": "src/data/questions/g-forces.ts",
        "additions": 615,
        "deletions": 0
      },
      {
        "path": "src/data/questions/j-mach.ts",
        "additions": 515,
        "deletions": 0
      },
      {
        "path": "src/game/store.tsx",
        "additions": 167,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/fa738bf93c1406073c398f0a63dac378b82a0c24"
  },
  {
    "hash": "e45a82dd5ef9acbc8ffb98694eb138465dd0d2b6",
    "short": "e45a82d",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T04:00:20+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 3270,
    "deletions": 0,
    "fileCount": 5,
    "files": [
      {
        "path": "src/data/questions/b-streamlines.ts",
        "additions": 493,
        "deletions": 0
      },
      {
        "path": "src/data/questions/e-boundary-layer.ts",
        "additions": 860,
        "deletions": 0
      },
      {
        "path": "src/data/questions/f-airfoil.ts",
        "additions": 931,
        "deletions": 0
      },
      {
        "path": "src/data/questions/impact.ts",
        "additions": 747,
        "deletions": 0
      },
      {
        "path": "src/game/audio.ts",
        "additions": 239,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/e45a82dd5ef9acbc8ffb98694eb138465dd0d2b6"
  },
  {
    "hash": "899a23016b29e99379404453eb82b276cd493007",
    "short": "899a230",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T03:59:40+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 3,
    "deletions": 3,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/validate.ts",
        "additions": 3,
        "deletions": 3
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/899a23016b29e99379404453eb82b276cd493007"
  },
  {
    "hash": "dfeaf81468cc3bf371ae2243dc86b9b50076dab5",
    "short": "dfeaf81",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T03:59:31+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 1515,
    "deletions": 0,
    "fileCount": 4,
    "files": [
      {
        "path": "src/data/questions/c-momentum.ts",
        "additions": 647,
        "deletions": 0
      },
      {
        "path": "src/data/questions/i-coefficients.ts",
        "additions": 616,
        "deletions": 0
      },
      {
        "path": "src/data/questions/index.ts",
        "additions": 59,
        "deletions": 0
      },
      {
        "path": "src/game/validate.ts",
        "additions": 193,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/dfeaf81468cc3bf371ae2243dc86b9b50076dab5"
  },
  {
    "hash": "150b820e4a4f76a5e9395a57bf21b577e36f59de",
    "short": "150b820",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T03:58:58+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 658,
    "deletions": 0,
    "fileCount": 2,
    "files": [
      {
        "path": "src/data/questions/a-foundations.ts",
        "additions": 488,
        "deletions": 0
      },
      {
        "path": "src/game/curriculum.ts",
        "additions": 170,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/150b820e4a4f76a5e9395a57bf21b577e36f59de"
  },
  {
    "hash": "82c6030bb2d83655de0dadf6529f3d2e8e89867f",
    "short": "82c6030",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T03:58:28+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 187,
    "deletions": 92,
    "fileCount": 1,
    "files": [
      {
        "path": "src/styles.css",
        "additions": 187,
        "deletions": 92
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/82c6030bb2d83655de0dadf6529f3d2e8e89867f"
  },
  {
    "hash": "2168cd450e4d80fff317619bd011793cf88f9e04",
    "short": "2168cd4",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T03:56:58+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 3,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/seed.ts",
        "additions": 3,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/2168cd450e4d80fff317619bd011793cf88f9e04"
  },
  {
    "hash": "f293825f92d74cae6d06d9d6f755968526b6e530",
    "short": "f293825",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T03:56:48+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 79,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/authoring-guide.md",
        "additions": 79,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/f293825f92d74cae6d06d9d6f755968526b6e530"
  },
  {
    "hash": "a891faf44bebcc995e14812e7f3450eaf180b52a",
    "short": "a891faf",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T03:56:10+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 114,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": "src/game/types.ts",
        "additions": 114,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/a891faf44bebcc995e14812e7f3450eaf180b52a"
  },
  {
    "hash": "ecb65db0bfc88d5cd6393481755d6481543f8663",
    "short": "ecb65db",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T03:55:36+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 0,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": ".lovable/{plan.md => plan/aerogrid-99-flight-dynamics-trivia-2026-09-10.md}",
        "additions": 0,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/ecb65db0bfc88d5cd6393481755d6481543f8663"
  },
  {
    "hash": "1d14eb27464f799f485d4cb18f012686cfc11895",
    "short": "1d14eb2",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T03:54:05+00:00",
    "subject": "Drafted AeroGrid 99 plan",
    "body": "X-Lovable-Edit-ID: edt-01c7a372-e9cf-4e58-a608-9978a92ac122",
    "additions": 0,
    "deletions": 0,
    "fileCount": 0,
    "files": [],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/1d14eb27464f799f485d4cb18f012686cfc11895"
  },
  {
    "hash": "b0acc77ac2c066fd0067fbc1f57bcdf9ca17f89e",
    "short": "b0acc77",
    "author": "gpt-engineer-app[bot]",
    "email": "159125892+gpt-engineer-app[bot]@users.noreply.github.com",
    "date": "2026-09-10T03:54:00+00:00",
    "subject": "Changes",
    "body": "",
    "additions": 57,
    "deletions": 0,
    "fileCount": 1,
    "files": [
      {
        "path": ".lovable/plan.md",
        "additions": 57,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/b0acc77ac2c066fd0067fbc1f57bcdf9ca17f89e"
  },
  {
    "hash": "5081cd08f6bc4621abfca6343b27f1fb2c0914dd",
    "short": "5081cd0",
    "author": "Lovable",
    "email": "noreply@lovable.dev",
    "date": "2026-09-08T08:54:42+02:00",
    "subject": "template: tanstack_start_ts_current-7da8770d11d6",
    "body": "",
    "additions": 6402,
    "deletions": 0,
    "fileCount": 74,
    "files": [
      {
        "path": ".gitignore",
        "additions": 32,
        "deletions": 0
      },
      {
        "path": ".lovable/project.json",
        "additions": 5,
        "deletions": 0
      },
      {
        "path": ".prettierignore",
        "additions": 8,
        "deletions": 0
      },
      {
        "path": ".prettierrc",
        "additions": 6,
        "deletions": 0
      },
      {
        "path": "AGENTS.md",
        "additions": 10,
        "deletions": 0
      },
      {
        "path": "README.md",
        "additions": 29,
        "deletions": 0
      },
      {
        "path": "bun.lock",
        "additions": 1048,
        "deletions": 0
      },
      {
        "path": "bunfig.toml",
        "additions": 7,
        "deletions": 0
      },
      {
        "path": "components.json",
        "additions": 22,
        "deletions": 0
      },
      {
        "path": "eslint.config.js",
        "additions": 40,
        "deletions": 0
      },
      {
        "path": "package.json",
        "additions": 90,
        "deletions": 0
      },
      {
        "path": "public/favicon.ico",
        "additions": 0,
        "deletions": 0
      },
      {
        "path": "public/robots.txt",
        "additions": 14,
        "deletions": 0
      },
      {
        "path": "src/components/ui/accordion.tsx",
        "additions": 51,
        "deletions": 0
      },
      {
        "path": "src/components/ui/alert-dialog.tsx",
        "additions": 115,
        "deletions": 0
      },
      {
        "path": "src/components/ui/alert.tsx",
        "additions": 49,
        "deletions": 0
      },
      {
        "path": "src/components/ui/aspect-ratio.tsx",
        "additions": 5,
        "deletions": 0
      },
      {
        "path": "src/components/ui/avatar.tsx",
        "additions": 47,
        "deletions": 0
      },
      {
        "path": "src/components/ui/badge.tsx",
        "additions": 32,
        "deletions": 0
      },
      {
        "path": "src/components/ui/breadcrumb.tsx",
        "additions": 101,
        "deletions": 0
      },
      {
        "path": "src/components/ui/button.tsx",
        "additions": 49,
        "deletions": 0
      },
      {
        "path": "src/components/ui/calendar.tsx",
        "additions": 177,
        "deletions": 0
      },
      {
        "path": "src/components/ui/card.tsx",
        "additions": 55,
        "deletions": 0
      },
      {
        "path": "src/components/ui/carousel.tsx",
        "additions": 240,
        "deletions": 0
      },
      {
        "path": "src/components/ui/chart.tsx",
        "additions": 331,
        "deletions": 0
      },
      {
        "path": "src/components/ui/checkbox.tsx",
        "additions": 26,
        "deletions": 0
      },
      {
        "path": "src/components/ui/collapsible.tsx",
        "additions": 11,
        "deletions": 0
      },
      {
        "path": "src/components/ui/command.tsx",
        "additions": 143,
        "deletions": 0
      },
      {
        "path": "src/components/ui/context-menu.tsx",
        "additions": 186,
        "deletions": 0
      },
      {
        "path": "src/components/ui/dialog.tsx",
        "additions": 104,
        "deletions": 0
      },
      {
        "path": "src/components/ui/drawer.tsx",
        "additions": 98,
        "deletions": 0
      },
      {
        "path": "src/components/ui/dropdown-menu.tsx",
        "additions": 187,
        "deletions": 0
      },
      {
        "path": "src/components/ui/form.tsx",
        "additions": 171,
        "deletions": 0
      },
      {
        "path": "src/components/ui/hover-card.tsx",
        "additions": 27,
        "deletions": 0
      },
      {
        "path": "src/components/ui/input-otp.tsx",
        "additions": 73,
        "deletions": 0
      },
      {
        "path": "src/components/ui/input.tsx",
        "additions": 22,
        "deletions": 0
      },
      {
        "path": "src/components/ui/label.tsx",
        "additions": 21,
        "deletions": 0
      },
      {
        "path": "src/components/ui/menubar.tsx",
        "additions": 228,
        "deletions": 0
      },
      {
        "path": "src/components/ui/navigation-menu.tsx",
        "additions": 120,
        "deletions": 0
      },
      {
        "path": "src/components/ui/pagination.tsx",
        "additions": 98,
        "deletions": 0
      },
      {
        "path": "src/components/ui/popover.tsx",
        "additions": 31,
        "deletions": 0
      },
      {
        "path": "src/components/ui/progress.tsx",
        "additions": 25,
        "deletions": 0
      },
      {
        "path": "src/components/ui/radio-group.tsx",
        "additions": 36,
        "deletions": 0
      },
      {
        "path": "src/components/ui/resizable.tsx",
        "additions": 37,
        "deletions": 0
      },
      {
        "path": "src/components/ui/scroll-area.tsx",
        "additions": 44,
        "deletions": 0
      },
      {
        "path": "src/components/ui/select.tsx",
        "additions": 152,
        "deletions": 0
      },
      {
        "path": "src/components/ui/separator.tsx",
        "additions": 24,
        "deletions": 0
      },
      {
        "path": "src/components/ui/sheet.tsx",
        "additions": 122,
        "deletions": 0
      },
      {
        "path": "src/components/ui/sidebar.tsx",
        "additions": 744,
        "deletions": 0
      },
      {
        "path": "src/components/ui/skeleton.tsx",
        "additions": 7,
        "deletions": 0
      },
      {
        "path": "src/components/ui/slider.tsx",
        "additions": 23,
        "deletions": 0
      },
      {
        "path": "src/components/ui/sonner.tsx",
        "additions": 23,
        "deletions": 0
      },
      {
        "path": "src/components/ui/switch.tsx",
        "additions": 27,
        "deletions": 0
      },
      {
        "path": "src/components/ui/table.tsx",
        "additions": 94,
        "deletions": 0
      },
      {
        "path": "src/components/ui/tabs.tsx",
        "additions": 53,
        "deletions": 0
      },
      {
        "path": "src/components/ui/textarea.tsx",
        "additions": 21,
        "deletions": 0
      },
      {
        "path": "src/components/ui/toggle-group.tsx",
        "additions": 57,
        "deletions": 0
      },
      {
        "path": "src/components/ui/toggle.tsx",
        "additions": 42,
        "deletions": 0
      },
      {
        "path": "src/components/ui/tooltip.tsx",
        "additions": 32,
        "deletions": 0
      },
      {
        "path": "src/hooks/use-mobile.tsx",
        "additions": 19,
        "deletions": 0
      },
      {
        "path": "src/lib/error-capture.ts",
        "additions": 81,
        "deletions": 0
      },
      {
        "path": "src/lib/error-page.ts",
        "additions": 30,
        "deletions": 0
      },
      {
        "path": "src/lib/lovable-error-reporting.ts",
        "additions": 59,
        "deletions": 0
      },
      {
        "path": "src/lib/utils.ts",
        "additions": 6,
        "deletions": 0
      },
      {
        "path": "src/routeTree.gen.ts",
        "additions": 69,
        "deletions": 0
      },
      {
        "path": "src/router.tsx",
        "additions": 16,
        "deletions": 0
      },
      {
        "path": "src/routes/README.md",
        "additions": 21,
        "deletions": 0
      },
      {
        "path": "src/routes/__root.tsx",
        "additions": 126,
        "deletions": 0
      },
      {
        "path": "src/routes/index.tsx",
        "additions": 24,
        "deletions": 0
      },
      {
        "path": "src/server.ts",
        "additions": 61,
        "deletions": 0
      },
      {
        "path": "src/start.ts",
        "additions": 29,
        "deletions": 0
      },
      {
        "path": "src/styles.css",
        "additions": 144,
        "deletions": 0
      },
      {
        "path": "tsconfig.json",
        "additions": 30,
        "deletions": 0
      },
      {
        "path": "vite.config.ts",
        "additions": 15,
        "deletions": 0
      }
    ],
    "kind": "ai-assisted",
    "githubUrl": "https://github.com/jonathandanangel/aero-flight-trivia/commit/5081cd08f6bc4621abfca6343b27f1fb2c0914dd"
  }
];
