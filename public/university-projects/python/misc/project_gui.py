import os
import re
import PySimpleGUI as sg

# ----------------------------- Configuration -----------------------------
# Centralize values that were previously hardcoded so the app is easier to
# customize or reuse. Change these values instead of editing code paths.
THEME = "Dark"
COLORS = {
    "window_bg": "#041428",    # main window background
    "panel_bg": "#02121b",     # multiline / panel background
    "text": "#ffffff",         # default text color on dark bg
}
FONTS = {
    "title": ("Segoe UI", 14, "bold"),
    "mono": ("Courier New", 10),
}
SIZES = {
    "input": (60, 1),
    "out": (100, 28),
}
WINDOW_TITLE = "Game Log Summarizer"
FILE_TYPES = (("Text Files", "*.txt"), ("All Files", "*.*"))

# Regex patterns used for parsing. These are configurable so the parsing
# functions can be adapted to other log formats without changing code.
REGEX = {
    # group 1 should capture the PC name
    "pc_name": r"^\[CHAT WINDOW TEXT\]\s*(?:\[[^\]]+\]\s*)*(.+?) has loot notification turned on\.",
    # expects group 1 to capture the killed target
    "kill": rf"^\[CHAT WINDOW TEXT\]\s*(?:\[[^\]]+\]\s*)*{{pc}} killed (.+)$",
    # expects groups: (target, amount)
    "damage": rf"^\[CHAT WINDOW TEXT\]\s*(?:\[[^\]]+\]\s*)*{{pc}} damages (.+?): (\d+)",
}

# ----------------------------- Parsing Helpers -----------------------------
import re
import PySimpleGUI as sg


# ----------------------------- Parsing Helpers -----------------------------
def extract_pc_name(log_text: str) -> str | None:
    """Find PC name from lines like:
    [CHAT WINDOW TEXT] [<timestamp>] <PC NAME> has loot notification turned on.
    Returns the PC name or None if not found.
    """
    pattern = REGEX["pc_name"]
    m = re.search(pattern, log_text, flags=re.MULTILINE)
    return m.group(1).strip() if m else None


def count_pc_kills(log_text: str, pc_name: str) -> int:
    """Count kills attributed to the PC from lines like:
    [CHAT WINDOW TEXT] [<timestamp>] <PC NAME> killed <enemy>
    """
    pattern = REGEX["kill"].format(pc=re.escape(pc_name))
    return len(re.findall(pattern, log_text, flags=re.MULTILINE))


def list_pc_kills(log_text: str, pc_name: str) -> list[str]:
    """Return the chronological list of enemies killed by the PC.

    This returns a list in the same order the lines appear in the log. If no
    kills are found an empty list is returned.
    """
    pattern = REGEX["kill"].format(pc=re.escape(pc_name))
    # findall returns matches in document order
    return re.findall(pattern, log_text, flags=re.MULTILINE)


# ----------------------------- Scoring Helpers -----------------------------
def compute_team_averages(filename: str) -> tuple[str, str | None]:
    """Parse a score file and compute average score per team.

    Returns (result_text, error_message). On success error_message is None.
    The function tries to follow the logic of the provided example: it skips the
    first 3 lines (if present), splits rows, removes stray ':' tokens, handles
    an optional leading index, and expects the final token to be the numeric score.
    """
    try:
        with open(filename, "r", encoding="utf-8", errors="ignore") as f:
            clean_lines = [line.rstrip("\n") for line in f.readlines()]
    except Exception as e:
        return "", f"Couldn't open file: {e}"

    # Split lines into token lists
    rows = [line.split() for line in clean_lines]
    # Use rows[3:] to match the example; if file shorter, use rows[1:]
    data_rows = rows[3:] if len(rows) > 3 else rows[1:]

    team_totals: dict[str, int] = {}
    team_counts: dict[str, int] = {}

    for row in data_rows:
        if not row:
            continue
        # Remove any literal ':' tokens
        row = [tok for tok in row if tok != ':']
        if not row:
            continue
        # If first token looks like an index, drop it
        if row[0].isdigit():
            row = row[1:]
        if len(row) < 2:
            continue
        score_str = row[-1]
        # Try to parse integer score (strip non-digits if necessary)
        if score_str.isdigit():
            score = int(score_str)
        else:
            digits = "".join(ch for ch in score_str if ch.isdigit())
            if not digits:
                continue
            try:
                score = int(digits)
            except Exception:
                continue

        team_name = " ".join(row[:-1]).strip()
        if not team_name:
            continue
        team_totals[team_name] = team_totals.get(team_name, 0) + score
        team_counts[team_name] = team_counts.get(team_name, 0) + 1

    if not team_totals:
        return "", "No valid data rows found or couldn't parse scores."

    team_avgs = {team: team_totals[team] / team_counts[team] for team in team_totals}

    final_lines = [f"{team_avgs[team]:.2f} : {team}" for team in team_avgs]
    title_string = "Average : Team Name"
    # Build the output text preserving insertion order
    output_text = title_string + "\n" + "\n".join(final_lines)

    # Try to save to 'test_file.txt' as the example did; ignore save errors
    try:
        with open("test_file.txt", "w", encoding="utf-8") as outf:
            outf.write(output_text)
    except Exception:
        pass

    return output_text, None


# ----------------------------- Data Reader Helpers -----------------------------
def GetDataDict_original(filename):
    data = {'LABEL': [], 'Name': [], 'Appearance': []}
    try:
        with open(filename, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                line = line.strip()
                if line == "" or line.lower().startswith("label"):
                    continue

                # Try comma first
                if "," in line:
                    parts = [p.strip() for p in line.split(",", 2)]
                    if len(parts) != 3:
                        continue
                    label, name, appearance = parts[0], parts[1], parts[2]
                else:
                    # whitespace split
                    tokens = line.split()
                    if len(tokens) < 3:
                        continue
                    # If first token is an index, skip it
                    if tokens[0].isdigit():
                        label = tokens[1]
                        name = tokens[2]
                    else:
                        label = tokens[0]
                        name = tokens[1]
                    appearance = tokens[-1]  # last token (e.g., **** or 194)

                data['LABEL'].append(label)
                data['Name'].append(name)
                data['Appearance'].append(appearance)
    except Exception:
        return {'LABEL': [], 'Name': [], 'Appearance': []}
    return data


def GetDataByHeaderAndRow_original(filename, header, row_num):
    d = GetDataDict_original(filename)
    if header not in d:
        return None, f'Warning: header <{header}> was not in the data read from file "{filename}". Quitting.'
    # original uses 1-based indexing
    if row_num < 1 or row_num > len(d[header]):
        return None, f'Warning: file "{filename}" has row numbers going from 0 to {max(0, len(d[header]) - 1)}. Quitting.'
    # convert 1-based to 0-based
    return d[header][row_num - 1], None


# ----------------------------- Raw Runner (user code) -----------------------------
RAW_USER_CODE = r'''import os

tokens = "/Users/jonathanangel10312002/PyCharmMiscProject/.venv/bin/python /Users/jonathanangel10312002/PyCharmMiscProject/text.tsv".split(os.path.sep)
print(tokens)




file_path = "C:/Users/jonathanangel1031200/PyCharmMiscProject"

file = input("Enter file name: ")
path = os.path.join(file_path, file)
with open(path, "r+") as f:
    all_lines = f.readlines()

    print(all_lines)

print(all_lines[1:2])
splittings1 = all_lines[0].split("\t")
splittings2 = all_lines[1].split("\t")
splittings3 = all_lines[2].split("\t")
splittings4 = all_lines[3].split("\t")
splittings5 = all_lines[4].split("\t")

split_join1 = "\t".join(splittings1)
split_join2 = "\t".join(splittings2)
split_join3 = "\t".join(splittings3)
split_join4 = "\t".join(splittings4)
split_join5 = "\t".join(splittings5)


clean_slice_1 = [x.strip() for x in splittings1]
print(clean_slice_1)

clean_slice_2 = [x.strip() for x in splittings2]
print(clean_slice_2)

clean_slice_3 = [x.strip() for x in splittings3]
print(clean_slice_3)

clean_slice_4 = [x.strip() for x in splittings4]
print(clean_slice_4)

clean_slice_5 = [x.strip() for x in splittings5]
print(clean_slice_5)


int_list_1 = [int(x) for x in clean_slice_1[2:5]]
print(int_list_1)

int_list_2 = [int(x) for x in clean_slice_2[2:5]]
print(int_list_2)

int_list_3 = [int(x) for x in clean_slice_3[2:5]]
print(int_list_3)

int_list_4 = [int(x) for x in clean_slice_4[2:5]]
print(int_list_4)

int_list_5 = [int(x) for x in clean_slice_5[2:5]]
print(int_list_5)

calc_1 = sum(int_list_1) / 3
print(calc_1)
calc_2 = sum(int_list_2) / 3
print(calc_2)
calc_3 = sum(int_list_3) / 3
print(calc_3)
calc_4 = sum(int_list_4) / 3
print(calc_4)
calc_5 = sum(int_list_5) / 3
print(calc_5)

newfile = "text.tsv"
path2 = os.path.join(file_path, newfile)

# NOTE: make sure in your real file you use real operators: <=, < (not &lt;)
if 90 <= calc_1:
    # build a new list with the grade as a separate column
    row_with_grade = clean_slice_1 + ["A"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "w") as f:
        f.write(line)

elif 80 <= calc_1 < 90:
    row_with_grade = clean_slice_1 + ["B"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "w") as f:
        f.write(line)

elif 70 <= calc_1 < 80:
    row_with_grade = clean_slice_1 + ["C"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "w") as f:
        f.write(line)

elif 60 <= calc_1 < 70:
    row_with_grade = clean_slice_1 + ["D"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "w") as f:
        f.write(line)

elif calc_1 < 60:
    row_with_grade = clean_slice_1 + ["F"]
    line = "\t".join(row_with_grade) + "\n"
    print(row_with_grade)  # for debugging
    with open(path2, "w") as f:
        f.write(line)



"""

2

"""

if 90 <= calc_2:
    # build a new list with the grade as a separate column
    row_with_grade = clean_slice_2 + ["A"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif 80 <= calc_2 < 90:
    row_with_grade = clean_slice_2 + ["B"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif 70 <= calc_2 < 80:
    row_with_grade = clean_slice_2 + ["C"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif 60 <= calc_2 < 70:
    row_with_grade = clean_slice_2 + ["D"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif calc_2 < 60:
    row_with_grade = clean_slice_2 + ["F"]
    line = "\t".join(row_with_grade) + "\n"
    print(row_with_grade)  # for debugging
    with open(path2, "a") as f:
        f.write(line)

"""

3

"""


if 90 <= calc_3:
    # build a new list with the grade as a separate column
    row_with_grade = clean_slice_3 + ["A"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif 80 <= calc_3 < 90:
    row_with_grade = clean_slice_3 + ["B"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif 70 <= calc_3 < 80:
    row_with_grade = clean_slice_3 + ["C"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif 60 <= calc_3 < 70:
    row_with_grade = clean_slice_3 + ["D"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif calc_3 < 60:
    row_with_grade = clean_slice_3 + ["F"]
    line = "\t".join(row_with_grade) + "\n"
    print(row_with_grade)  # for debugging
    with open(path2, "a") as f:
        f.write(line)



"""

4

"""


if 90 <= calc_4:
    # build a new list with the grade as a separate column
    row_with_grade = clean_slice_4 + ["A"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif 80 <= calc_4 < 90:
    row_with_grade = clean_slice_4 + ["B"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif 70 <= calc_4 < 80:
    row_with_grade = clean_slice_4 + ["C"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif 60 <= calc_4 < 70:
    row_with_grade = clean_slice_4 + ["D"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif calc_4 < 60:
    row_with_grade = clean_slice_4 + ["F"]
    line = "\t".join(row_with_grade) + "\n"
    print(row_with_grade)  # for debugging
    with open(path2, "a") as f:
        f.write(line)



"""

5

"""


if 90 <= calc_5:
    # build a new list with the grade as a separate column
    row_with_grade = clean_slice_5 + ["A"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif 80 <= calc_5 < 90:
    row_with_grade = clean_slice_5 + ["B"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif 70 <= calc_5 < 80:
    row_with_grade = clean_slice_5 + ["C"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif 60 <= calc_5 < 70:
    row_with_grade = clean_slice_5 + ["D"]
    line = "\t".join(row_with_grade) + "\n"
    with open(path2, "a") as f:
        f.write(line)

elif calc_5 < 60:
    row_with_grade = clean_slice_5 + ["F"]
    line = "\t".join(row_with_grade) + "\n"
    print(row_with_grade)  # for debugging
    with open(path2, "a") as f:
        f.write(line)
'''




def damage_stats_for_pc(log_text: str, pc_name: str) -> tuple[int, int, float]:
    """Compute (#hits, total_damage, avg_damage) from lines like:
    [CHAT WINDOW TEXT] [<timestamp>] <PC NAME> damages <target>: <amount>
    """
    pattern = REGEX["damage"].format(pc=re.escape(pc_name))
    matches = re.findall(pattern, log_text, flags=re.MULTILINE)

    hits = len(matches)
    total = sum(int(dmg) for _, dmg in matches) if hits else 0
    avg = round(total / hits, 1) if hits else 0.0
    return hits, total, avg


def build_summary(pc: str, kills: int, hits: int, total: int, avg: float, kill_list: list[str] | None = None) -> str:
    """Format the summary block to a readable multi-line string."""
    parts = [
        f'Game Log Summary for PC "{pc}".\n\n',
        f'{pc} defeated {kills} {"enemy" if kills == 1 else "enemies"}.\n',
        f'{pc} did damage:\n',
        f'{hits:>12} times\n',
        f'{total:>12} total hp\n',
        f'{avg:>12.1f} average hp per hit.\n',
    ]

    # If an ordered kill list is provided, include it in the summary.
    if kill_list:
        parts.append("\nOrder of defeated enemies (first → last):\n")
        # Number the kills for clarity
        for i, enemy in enumerate(kill_list, start=1):
            parts.append(f"  {i}. {enemy}\n")

    return "".join(parts)


def summarize_log(log_text: str) -> tuple[str, dict]:
    """Return (summary_text, stats_dict). stats_dict keys: pc, kills, hits, total, avg."""
    pc = extract_pc_name(log_text)
    if not pc:
        text = (
            "Game Log Summary\n\n"
            "Could not detect the Player Character (PC).\n"
            "Tip: I look for a line like:\n"
            "  [CHAT WINDOW TEXT] <PC NAME> has loot notification turned on.\n"
        )
        return text, {"pc": "—", "kills": 0, "hits": 0, "total": 0, "avg": 0.0}

    kills = count_pc_kills(log_text, pc)
    hits, total, avg = damage_stats_for_pc(log_text, pc)
    # Get chronological list of enemies killed and include only in the human
    # readable summary (do not add the list to the stats dict unless you want to).
    kill_list = list_pc_kills(log_text, pc)
    summary = build_summary(pc, kills, hits, total, avg, kill_list)
    return summary, {"pc": pc, "kills": kills, "hits": hits, "total": total, "avg": avg}


# ----------------------------- GUI Layout ----------------------------------
def main() -> None:
    # Use a dark base and apply a darker navy-blue palette for window and elements
    sg.theme(THEME)
    # Window/element background: use configured colors
    sg.set_options(background_color=COLORS["window_bg"], element_background_color=COLORS["window_bg"])

    # --- Tab: Log Summary ---
    tab_summary = [
        [sg.Text(WINDOW_TITLE, font=FONTS["title"])],
        [
            sg.Text("Log file:"),
            sg.Input(key="-FILE-", size=SIZES["input"]),
            sg.FileBrowse(file_types=FILE_TYPES, key="-FILE_BROWSE-"),
        ],
        [
            sg.Button("Show Raw Log", key="-RAW-"),
            sg.Button("Show Summary", key="-SUMMARY-"),
            sg.Button("Paste Raw Log", key="-PASTE_RAW-"),
            sg.Button("Paste Summary", key="-PASTE_SUM-"),
            sg.Button("Copy Summary", key="-COPY-"),
            sg.Button("Save Summary", key="-SAVE-"),
            sg.Button("Clear", key="-CLEAR-"),
            sg.Button("Exit", key="-EXIT-"),
        ],
        [
            sg.Text("PC:"), sg.Text("—", key="-PC-", size=(20, 1)),
            sg.Text("Kills:"), sg.Text("0", key="-KILLS-"),
            sg.Text("Hits:"),  sg.Text("0", key="-HITS-"),
            sg.Text("Total:"), sg.Text("0", key="-TOTAL-"),
            sg.Text("Avg:"),   sg.Text("0.0", key="-AVG-"),
        ],
        [sg.Multiline(size=SIZES["out"], font=FONTS["mono"], key="-OUT-", autoscroll=True,
            background_color=COLORS["panel_bg"], text_color=COLORS["text"])],
    ]

    # --- Tab: Scoring ---
    tab_scoring = [
        [sg.Text("Score file:"), sg.Input(key="-SCORE_FILE-", size=(50,1)), sg.FileBrowse(file_types=FILE_TYPES, key="-SCORE_FILE_BROWSE-")],
        [sg.Button("Compute Averages", key="-COMPUTE_SCORES-"), sg.Text("(saves to test_file.txt)")],
        [sg.Multiline(size=(100,12), key="-SCORE_OUT-", disabled=True, autoscroll=True)],
    ]

    # --- Tab: Data Reader (original functions) ---
    tab_datareader = [
        [sg.Text("Data file:"), sg.Input(key="-DR_FILE-", size=(50,1)), sg.FileBrowse(file_types=FILE_TYPES, key="-DR_FILE_BROWSE-")],
        [sg.Button("Load Headers", key="-DR_LOAD_HEADERS-"), sg.Text("Header:"), sg.Combo(values=[], key="-DR_HEADER_LIST-", size=(20,1)),
         sg.Text("Row (1-based):"), sg.Input(key="-DR_ROW_NUM-", size=(6,1)), sg.Button("Get Data", key="-DR_GET_DATA-")],
        [sg.Text("Value:"), sg.Text("", key="-DR_DATA_VALUE-", size=(60,1))],
        [sg.Multiline(size=(100,12), key="-DR_DATA_OUT-", disabled=True)],
    ]

    # --- Tab: Raw Runner (show and run user code) ---
    tab_rawrunner = [
        [sg.Text("User code (read-only):")],
        [sg.Multiline(RAW_USER_CODE, size=(100, 20), disabled=True, key='-RAW_CODE_DISPLAY-')],
        [sg.Text("Filename to pass to input():"), sg.Input(key='-RAW_INPUT_VALUE-', size=(40,1)), sg.Button('Run', key='-RAW_RUN-'), sg.Button('Save Output', key='-RAW_SAVE-')],
        [sg.Multiline(size=(100,12), key='-RAW_RUN_OUT-', disabled=True)]
    ]

    layout = [[sg.TabGroup([[sg.Tab('Summary', tab_summary), sg.Tab('Scoring', tab_scoring), sg.Tab('Data Reader', tab_datareader), sg.Tab('Raw Runner', tab_rawrunner)]], key='-TABGROUP-')]]

    # Make the window background match the darker navy-blue palette
    window = sg.Window(WINDOW_TITLE, layout, resizable=True, background_color=COLORS["window_bg"]) 

    last_summary = ""
    last_raw_output = ""

    def update_stats_display(stats: dict) -> None:
        window["-PC-"].update(stats.get("pc", "—"))
        window["-KILLS-"].update(str(stats.get("kills", 0)))
        window["-HITS-"].update(str(stats.get("hits", 0)))
        window["-TOTAL-"].update(str(stats.get("total", 0)))
        window["-AVG-"].update(f"{stats.get('avg', 0.0):.1f}")

    while True:
        event, values = window.read()
        if event in (sg.WINDOW_CLOSED, "-EXIT-"):
            break

        if event == "-CLEAR-":
            window["-OUT-"].update("")
            update_stats_display({})
            last_summary = ""
            continue

        def open_file_path(path: str) -> str | None:
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    return f.read()
            except Exception as e:
                sg.popup_error(f"Couldn't open file:\n{e}")
                return None

        if event in ("-RAW-", "-SUMMARY-"):
            path = values.get("-FILE-")
            if not path:
                sg.popup("Please choose a log file first.")
                continue

            text = open_file_path(path)
            if text is None:
                continue

            if event == "-RAW-":
                window["-OUT-"].update(text)
            else:
                summary, stats = summarize_log(text)
                last_summary = summary
                window["-OUT-"].update(summary)
                update_stats_display(stats)

        elif event == "-PASTE_RAW-":
            try:
                text = sg.clipboard_get()
            except Exception:
                sg.popup_error("Clipboard is empty or unavailable.")
                continue
            window["-OUT-"].update(text)

        # --- Scoring tab events ---
        elif event == "-COMPUTE_SCORES-":
            score_path = values.get("-SCORE_FILE-")
            if not score_path:
                sg.popup("Please choose a score file first.")
                continue
            out_text, err = compute_team_averages(score_path)
            if err:
                window["-SCORE_OUT-"].update(err)
            else:
                window["-SCORE_OUT-"].update(out_text)

        # --- Data Reader tab events ---
        elif event == "-DR_LOAD_HEADERS-":
            dr_path = values.get("-DR_FILE-")
            if not dr_path:
                sg.popup("Please choose a data file first.")
                continue
            d = GetDataDict_original(dr_path)
            headers = [h for h in d.keys()]
            window["-DR_HEADER_LIST-"].update(values=headers)
            window["-DR_DATA_OUT-"].update(f"Loaded headers: {', '.join(headers)}")

        elif event == "-DR_GET_DATA-":
            dr_path = values.get("-DR_FILE-")
            header = values.get("-DR_HEADER_LIST-")
            row_raw = values.get("-DR_ROW_NUM-")
            try:
                row_num = int(row_raw)
            except Exception:
                sg.popup("Row number must be an integer (1-based).")
                continue
            val, err = GetDataByHeaderAndRow_original(dr_path, header, row_num)
            if err:
                window["-DR_DATA_VALUE-"].update("")
                window["-DR_DATA_OUT-"].update(err)
            else:
                window["-DR_DATA_VALUE-"].update(str(val))
                window["-DR_DATA_OUT-"].update(f"Value at header '{header}', row {row_num}: {val}")

        elif event == '-RAW_RUN-':
            # Run the user's raw code, supply the given filename to input()
            user_input_value = values.get('-RAW_INPUT_VALUE-', '')
            import io, sys, traceback

            stdout_buf = io.StringIO()
            stderr_buf = io.StringIO()

            # Prepare a fake input function
            def fake_input(prompt=''):
                # mimic the blocking behavior but return the provided value
                return user_input_value

            # Execution environment
            g = {'__name__': '__main__', 'input': fake_input, 'os': __import__('os')}

            try:
                old_stdout, old_stderr = sys.stdout, sys.stderr
                sys.stdout, sys.stderr = stdout_buf, stderr_buf
                exec(RAW_USER_CODE, g)
            except Exception:
                tb = traceback.format_exc()
                # restore streams before writing to UI
                sys.stdout, sys.stderr = old_stdout, old_stderr
                window['-RAW_RUN_OUT-'].update(tb)
                last_raw_output = tb
            else:
                sys.stdout, sys.stderr = old_stdout, old_stderr
                out = stdout_buf.getvalue()
                err = stderr_buf.getvalue()
                combined = out
                if err:
                    combined += '\n--- stderr ---\n' + err
                window['-RAW_RUN_OUT-'].update(combined)
                last_raw_output = combined

                # After running the user's script, check for a common output file
                try:
                    # The script writes 'text.tsv' next to file_path; build candidate path
                    # Use the user-supplied input from the UI to determine directory
                    user_input = values.get('-RAW_INPUT_VALUE-', '').strip()
                    if user_input:
                        # If user passed an absolute path, use its directory; otherwise join with file_path
                        import pathlib, shutil
                        if os.path.isabs(user_input):
                            candidate_dir = str(pathlib.Path(user_input).parent)
                        else:
                            # Fall back to the workspace directory for relative filenames
                            candidate_dir = os.path.dirname(__file__)
                        candidate = os.path.join(candidate_dir, 'text.tsv')
                        if os.path.exists(candidate):
                            dest = os.path.join(os.path.dirname(__file__), 'text_from_raw.tsv')
                            shutil.copy(candidate, dest)
                            sg.popup_no_titlebar(f"Detected output 'text.tsv' and copied to:\n{dest}")
                except Exception:
                    # Do not fail the whole GUI if copy fails; show a small popup
                    try:
                        import traceback
                        sg.popup_error('Could not copy generated file: ' + traceback.format_exc())
                    except Exception:
                        pass

        elif event == '-RAW_SAVE-':
            if not last_raw_output.strip():
                sg.popup('No output to save. Run the script first.')
                continue
            save_path = sg.popup_get_file('Save raw run output as', save_as=True, no_window=True, default_extension='.txt', file_types=(('Text Files','*.txt'),))
            if save_path:
                try:
                    with open(save_path, 'w', encoding='utf-8') as outf:
                        outf.write(last_raw_output)
                    sg.popup('Output saved.')
                except Exception as e:
                    sg.popup_error(f"Couldn't save file:\n{e}")

        elif event == "-PASTE_SUM-":
            try:
                text = sg.clipboard_get()
            except Exception:
                sg.popup_error("Clipboard is empty or unavailable.")
                continue
            summary, stats = summarize_log(text)
            last_summary = summary
            window["-OUT-"].update(summary)
            update_stats_display(stats)

        elif event == "-COPY-":
            if last_summary.strip():
                sg.clipboard_set(last_summary)
                sg.popup_no_titlebar("Summary copied to clipboard.")
            else:
                sg.popup("No summary yet. Click 'Show Summary' or 'Paste Summary' first.")

        elif event == "-SAVE-":
            if not last_summary.strip():
                sg.popup("No summary to save. Generate a summary first.")
                continue
            save_path = sg.popup_get_file("Save summary as", save_as=True, no_window=True, default_extension=".txt", file_types=(("Text Files", "*.txt"),))
            if save_path:
                try:
                    with open(save_path, "w", encoding="utf-8") as f:
                        f.write(last_summary)
                    sg.popup("Summary saved.")
                except Exception as e:
                    sg.popup_error(f"Couldn't save file:\n{e}")

    window.close()


if __name__ == "__main__":
    main()