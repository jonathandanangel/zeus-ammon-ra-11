import os
tokens = "/Users/jonathanangel10312002/PyCharmMiscProject/.venv/bin/python /Users/jonathanangel10312002/PyCharmMiscProject/text.tsv".split(os.path.sep)
print(tokens)




file_path = "/Users/jonathanangel10312002/PyCharmMiscProject/"

#with open(file_path, "r+") as f:
#    print(f.read())
#    print(f.write())

file = "StudentInfo copy 2.tsv"
path = os.path.join(file_path, file)
with open(path, "r") as f:
    all_lines = f.readlines()                          # raw (includes \n)
    clean_lines = [line.rstrip("\n") for line in all_lines]  # clean (no \n)

print(clean_lines)

new_list = []

new_list_2 = []

newfile = "text.tsv"
path2 = os.path.join(file_path, newfile)

for i in clean_lines:
    splitting_lines = i.split("\t")
    print(splitting_lines)
    new_list.append(splitting_lines)



for x in range(len(new_list)):
    try:
        scores = [int(v.strip()) for v in new_list[x][2:]]  # convert each element
        print(scores)                                        # e.g., [70, 45, 59]
        new_list_2.append(scores)
    except (IndexError, ValueError, TypeError):
        continue

for i in range(len(new_list_2)):
    list_calculus = sum(new_list_2[i]) / (len(new_list[0][2:]) )
    print(list_calculus)

    if 90 <= list_calculus:
        # build a new list with the grade as a separate column
        row_with_grade = new_list[i] + ["A"]
        line = "\t".join(row_with_grade) + "\n"
        with open(path2, "a") as f:
            f.write(line)

    elif 80 <= list_calculus < 90:
        row_with_grade = new_list[i] + ["B"]
        line = "\t".join(row_with_grade) + "\n"
        with open(path2, "a") as f:
            f.write(line)

    elif 70 <= list_calculus < 80:
        row_with_grade = new_list[i] + ["C"]
        line = "\t".join(row_with_grade) + "\n"
        with open(path2, "a") as f:
            f.write(line)

    elif 60 <= list_calculus < 70:
        row_with_grade = new_list[i] + ["D"]
        line = "\t".join(row_with_grade) + "\n"
        with open(path2, "a") as f:
            f.write(line)

    elif list_calculus < 60:
        row_with_grade = new_list[i] + ["F"]
        line = "\t".join(row_with_grade) + "\n"
        print(row_with_grade)  # for debugging
        with open(path2, "a") as f:
            f.write(line)


print(new_list_2[0][0])

exams = len(new_list_2[0])
print(exams)

total_1 = 0
total_2 = 0
total_3 = 0
string = f'Averages:\t'
for i in range(len(new_list_2)):
    try:
        for x in range(len(new_list_2)):
            print(new_list_2[i][x])

    except (IndexError, ValueError, TypeError):
        continue


col_sums = [sum(col) for col in zip(*new_list_2)]
print(col_sums)  # [215, 208, 234]



for i in range(exams):
    string += f'exam {i+1}: %.2f, ' % (col_sums[i] / len(new_list_2))
print(string)


with open(path2, "a") as f:
    f.write("\n")
    f.write(string)


