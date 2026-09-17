import os

tokens = "/Users/jonathanangel10312002/PyCharmMiscProject/.venv/bin/python /Users/jonathanangel10312002/PyCharmMiscProject/text.tsv".split(os.path.sep)
print(tokens)

file_path = "/Users/jonathanangel10312002/PyCharmMiscProject/"

#with open(file_path, "r+") as f:
#    print(f.read())
#    print(f.write())

file = input("Enter file name: ")
path = os.path.join(file_path, file)
with open(path, "r") as f:   # read-only is enough
    all_lines = f.readlines()
    print(all_lines, "here")

print(all_lines[1:2])  # safe even if only 1 line (prints [])

newfile = "text.tsv"
path2 = os.path.join(file_path, newfile)

# We will remember the last valid 'splittings' so the debug after the loop works
splittings = None

# >>> Store every raw (non-blank) line you process <<<
raw_lines_kept = []

# Process every line, no matter how many there are
with open(path2, "w") as out_f:
    for raw_line in all_lines:
        # Only proceed if the line isn't blank
        if raw_line.strip():
            # Keep the original raw line (as read, including its newline)
            raw_lines_kept.append(raw_line)

            # Split → strip (same idea as your clean_slice_*)
            temp_splittings = raw_line.rstrip("\n").split("\t")
            clean_slice = [x.strip() for x in temp_splittings]
            print(clean_slice)  # debug per-row

            # Proceed only if we have at least 5 columns
            if len(clean_slice) >= 5:
                # Take the three scores from columns 2..4 (same assumption as your code)
                score_strs = clean_slice[2:5]

                # Try to convert scores to ints (no continue; just gate on success)
                int_list = None
                try:
                    int_list = [int(x) for x in score_strs]
                except ValueError:
                    int_list = None  # non-numeric row (e.g., header)

                if int_list is not None:
                    # Average and letter (same if/elif style)
                    calc = sum(int_list) / 3.0
                    if 90 <= calc:
                        grade = "A"
                    elif 80 <= calc < 90:
                        grade = "B"
                    elif 70 <= calc < 80:
                        grade = "C"
                    elif 60 <= calc < 70:
                        grade = "D"
                    else:
                        grade = "F"

                    # Original columns + Letter at the end
                    row_with_grade = clean_slice + [grade]
                    line = "\t".join(row_with_grade) + "\n"
                    out_f.write(line)

                    # Keep the last valid 'splittings' for the debug after the loop
                    splittings = temp_splittings

# Optional debug using the last valid row's 3rd column
if splittings is not None and len(splittings) >= 3:
    try:
        score_1 = int(splittings[2].strip())
        print(score_1, "here")
    except ValueError:
        print("Third column was not numeric in the last valid row", "here")

# Optional: read back and show what got written
with open(path2, "r") as x:
    print(x.read())

# >>> Use your stored raw lines here (instead of the single 'raw_line')
print("Stored raw lines count:", len(raw_lines_kept))
if raw_lines_kept:
    print("First stored raw line:", repr(raw_lines_kept[0]))
    print("Last stored raw line:", repr(raw_lines_kept[-1]))
    print(raw_lines_kept)



# If you still want to print the old 'raw_line' variable, note it's just the last iterated value.
# print(raw_line)