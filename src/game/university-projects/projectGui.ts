/**
 * TypeScript port of project_gui.py (ME 021 / PySimpleGUI Game Log Summarizer).
 * Client-side only — paste or upload text; no Python exec of the Raw Runner tab.
 */

export const PROJECT_GUI_SOURCE = "/university-projects/python/misc/project_gui.py";

const REGEX = {
  pcName:
    /^\[CHAT WINDOW TEXT\]\s*(?:\[[^\]]+\]\s*)*(.+?) has loot notification turned on\./m,
  kill: (pc: string) =>
    new RegExp(
      `^\\[CHAT WINDOW TEXT\\]\\s*(?:\\[[^\\]]+\\]\\s*)*${escapeRe(pc)} killed (.+)$`,
      "gm",
    ),
  damage: (pc: string) =>
    new RegExp(
      `^\\[CHAT WINDOW TEXT\\]\\s*(?:\\[[^\\]]+\\]\\s*)*${escapeRe(pc)} damages (.+?): (\\d+)`,
      "gm",
    ),
};

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractPcName(logText: string): string | null {
  const m = logText.match(REGEX.pcName);
  return m?.[1]?.trim() ?? null;
}

export function countPcKills(logText: string, pcName: string): number {
  return [...logText.matchAll(REGEX.kill(pcName))].length;
}

export function listPcKills(logText: string, pcName: string): string[] {
  return [...logText.matchAll(REGEX.kill(pcName))].map((m) => m[1]!.trim());
}

export function damageStatsForPc(
  logText: string,
  pcName: string,
): { hits: number; total: number; avg: number } {
  const matches = [...logText.matchAll(REGEX.damage(pcName))];
  const hits = matches.length;
  const total = matches.reduce((acc, m) => acc + Number(m[2]), 0);
  const avg = hits ? Math.round((total / hits) * 10) / 10 : 0;
  return { hits, total, avg };
}

export type GameLogStats = {
  pc: string;
  kills: number;
  hits: number;
  total: number;
  avg: number;
  killList: string[];
};

export function buildGameLogSummary(stats: GameLogStats): string {
  const { pc, kills, hits, total, avg, killList } = stats;
  const parts = [
    `Game Log Summary for PC "${pc}".\n\n`,
    `${pc} defeated ${kills} ${kills === 1 ? "enemy" : "enemies"}.\n`,
    `${pc} did damage:\n`,
    `${String(hits).padStart(12)} times\n`,
    `${String(total).padStart(12)} total hp\n`,
    `${avg.toFixed(1).padStart(12)} average hp per hit.\n`,
  ];
  if (killList.length) {
    parts.push("\nOrder of defeated enemies (first → last):\n");
    killList.forEach((enemy, i) => parts.push(`  ${i + 1}. ${enemy}\n`));
  }
  return parts.join("");
}

export function summarizeGameLog(logText: string): { summary: string; stats: GameLogStats } {
  const pc = extractPcName(logText);
  if (!pc) {
    return {
      summary:
        "Game Log Summary\n\nCould not detect the Player Character (PC).\nTip: I look for a line like:\n  [CHAT WINDOW TEXT] <PC NAME> has loot notification turned on.\n",
      stats: { pc: "—", kills: 0, hits: 0, total: 0, avg: 0, killList: [] },
    };
  }
  const kills = countPcKills(logText, pc);
  const { hits, total, avg } = damageStatsForPc(logText, pc);
  const killList = listPcKills(logText, pc);
  const stats: GameLogStats = { pc, kills, hits, total, avg, killList };
  return { summary: buildGameLogSummary(stats), stats };
}

/** Team averages from TeamData-style score files (project_gui.compute_team_averages). */
export function computeTeamAverages(fileText: string): { text: string; error: string | null } {
  const cleanLines = fileText.split(/\r?\n/).map((l) => l.replace(/\n$/, ""));
  const rows = cleanLines.map((line) => line.split(/\s+/).filter(Boolean));
  const dataRows = rows.length > 3 ? rows.slice(3) : rows.slice(1);

  const teamTotals = new Map<string, number>();
  const teamCounts = new Map<string, number>();

  for (let row of dataRows) {
    if (!row.length) continue;
    row = row.filter((tok) => tok !== ":");
    if (!row.length) continue;
    if (/^\d+$/.test(row[0]!)) row = row.slice(1);
    if (row.length < 2) continue;

    const scoreStr = row[row.length - 1]!;
    let score: number;
    if (/^\d+$/.test(scoreStr)) score = Number(scoreStr);
    else {
      const digits = scoreStr.replace(/\D/g, "");
      if (!digits) continue;
      score = Number(digits);
    }
    const teamName = row.slice(0, -1).join(" ").trim();
    if (!teamName) continue;
    teamTotals.set(teamName, (teamTotals.get(teamName) ?? 0) + score);
    teamCounts.set(teamName, (teamCounts.get(teamName) ?? 0) + 1);
  }

  if (!teamTotals.size) {
    return { text: "", error: "No valid data rows found or couldn't parse scores." };
  }

  const lines = ["Average : Team Name"];
  for (const [team, total] of teamTotals) {
    const count = teamCounts.get(team) ?? 1;
    lines.push(`${(total / count).toFixed(2)} : ${team}`);
  }
  return { text: lines.join("\n"), error: null };
}

export type StudentGradeRow = {
  cells: string[];
  scores: number[];
  average: number;
  letter: string;
};

function letterGrade(avg: number): string {
  if (avg >= 90) return "A";
  if (avg >= 80) return "B";
  if (avg >= 70) return "C";
  if (avg >= 60) return "D";
  return "F";
}

/**
 * Grade assigner inspired by RAW_USER_CODE in project_gui.py:
 * TSV/CSV rows → average of numeric score columns → letter grade column.
 * Improved: works for any row count (not hardcoded 5), any score-column span.
 */
export function assignStudentGrades(
  fileText: string,
  opts?: { scoreStart?: number; scoreCount?: number; delimiter?: string },
): { text: string; rows: StudentGradeRow[]; error: string | null } {
  const delim = opts?.delimiter ?? (fileText.includes("\t") ? "\t" : ",");
  const scoreStart = opts?.scoreStart ?? 2;
  const scoreCount = opts?.scoreCount ?? 3;
  const lines = fileText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return { text: "", rows: [], error: "Empty grade file." };

  const rows: StudentGradeRow[] = [];
  const outLines: string[] = [];

  for (const line of lines) {
    const cells = line.split(delim).map((c) => c.trim());
    if (cells.length && cells[0]!.toLowerCase() === "label") {
      outLines.push([...cells, "Grade"].join(delim));
      continue;
    }
    const slice = cells.slice(scoreStart, scoreStart + scoreCount);
    const scores = slice.map(Number).filter((n) => Number.isFinite(n));
    if (scores.length < 1) continue;
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const letter = letterGrade(average);
    const graded = [...cells, letter];
    rows.push({ cells, scores, average, letter });
    outLines.push(graded.join(delim));
  }

  if (!rows.length) {
    return { text: "", rows: [], error: "No numeric score rows found." };
  }
  return { text: outLines.join("\n"), rows, error: null };
}

export type DataDict = {
  LABEL: string[];
  Name: string[];
  appearance: string[];
};

/** GetDataDict_original from project_gui.py */
export function getDataDict(fileText: string): DataDict {
  const data: DataDict = { LABEL: [], Name: [], appearance: [] };
  for (const raw of fileText.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.toLowerCase().startsWith("label")) continue;

    if (line.includes(",")) {
      const parts = line.split(",").map((p) => p.trim());
      if (parts.length < 3) continue;
      data.LABEL.push(parts[0]!);
      data.Name.push(parts[1]!);
      data.appearance.push(parts.slice(2).join(", "));
    } else {
      const tokens = line.split(/\s+/);
      if (tokens.length < 3) continue;
      let label: string;
      let name: string;
      if (/^\d+$/.test(tokens[0]!)) {
        label = tokens[1]!;
        name = tokens[2]!;
      } else {
        label = tokens[0]!;
        name = tokens[1]!;
      }
      data.LABEL.push(label);
      data.Name.push(name);
      data.appearance.push(tokens[tokens.length - 1]!);
    }
  }
  return data;
}

export function getDataByHeaderAndRow(
  fileText: string,
  header: keyof DataDict | string,
  rowNum1Based: number,
): { value: string | null; error: string | null } {
  const d = getDataDict(fileText);
  if (!(header in d)) {
    return {
      value: null,
      error: `Warning: header <${header}> was not in the data. Quitting.`,
    };
  }
  const col = d[header as keyof DataDict];
  if (rowNum1Based < 1 || rowNum1Based > col.length) {
    return {
      value: null,
      error: `Warning: row numbers go from 1 to ${col.length}. Quitting.`,
    };
  }
  return { value: col[rowNum1Based - 1]!, error: null };
}
