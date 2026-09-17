import os

tokens = "/Users/jonathanangel10312002/PyCharmMiscProject/.venv/bin/python /Users/jonathanangel10312002/PyCharmMiscProject/text.tsv".split(os.path.sep)
print(tokens)




file_path = "/Users/jonathanangel10312002/PyCharmMiscProject/"

#with open(file_path, "r+") as f:
#    print(f.read())
#    print(f.write())

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

