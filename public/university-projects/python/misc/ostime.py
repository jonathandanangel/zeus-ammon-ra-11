
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
splittings2 = all_lines[0].split("\n")

splittings3 = all_lines[1].split("\t")
splittings4 = all_lines[2].split("\t")
splittings5 = all_lines[3].split("\t")
splittings6 = all_lines[4].split("\t")





print(splittings1)
print(splittings2)


print(splittings3)
print(splittings4)
print(splittings5)
print(splittings6)

split_join1 = "\t".join(splittings1)
split_join2 = "\t".join(splittings2)
split_join3 = "\t".join(splittings3)
split_join4 = "\t".join(splittings4)
split_join5 = "\t".join(splittings5)
split_join6 = "\t".join(splittings6)
print(split_join1)
print(split_join2)
print(split_join3)
print(split_join4)
print(split_join5)
print(split_join6)

calculation_barrett = (int(split_join1[13:15]) + int(split_join1[16:18]) + int(split_join1[19:21])) / 3
print(calculation_barrett)

calculation_bradshaw = (int(split_join3[16:18]) + int(split_join3[19:21]) + int(split_join3[22:24])) / 3
print(calculation_bradshaw)

calculation_charlton = (int(split_join4[15:17]) + int(split_join4[18:20]) + int(split_join4[21:24])) / 3
print(calculation_charlton)

calculation_mayo = (int(split_join5[12:14]) + int(split_join5[15:17]) + int(split_join5[18:21])) / 3
print(calculation_mayo)

calculation_stern = (int(split_join6[13:15]) + int(split_join6[16:18]) + int(split_join6[19:21])) / 3
print(calculation_stern)

calculation_1 = int(split_join1[19:21])
calculation_2 = int(split_join3[22:24])
calculation_3 = int(split_join4[21:24])

calculation_4 = int(split_join5[18:21])
calculation_5 = int(split_join6[19:21])

average_exam_3 = float((calculation_1 + calculation_2 + calculation_3 + calculation_4 + calculation_5 ) / 5)
print("Average Exam 3: %.2f" % average_exam_3)
#yes take each number to take average for final line


new_string = split_join1[0:21]
new_string_2 = split_join3[0:24]
new_string_3 = split_join4[0:23]
new_string_4 = split_join5[0:20]
new_string_5 = split_join6[0:21]

newfile = "text.tsv"
path2 = os.path.join(file_path, newfile)

if 90 <= calculation_barrett:
    splitJoin1 = new_string + " A"
    print("RIP")
    with open(path2, "w") as x:
        x.write(splitJoin1)
elif 80 <= calculation_barrett < 90:
    splitJoin1 = new_string + " B"
    print(splitJoin1)
    #lets_add = "F"
    with open(path2, "w") as x:

        x.write(splitJoin1)
    print(splitJoin1)
    print(split_join2)
elif 70 <= calculation_barrett < 80:
    splitJoin1 = new_string + " C"
    print(splitJoin1)
    with open(path2, "w") as x:
        x.write(splitJoin1)
elif 60 <= calculation_barrett < 70:
    splitJoin1 = new_string + " D"
    print(splitJoin1)
    with open(path2, "w") as x:
        x.write(splitJoin1)
elif calculation_barrett < 60:
    splitJoin1 = new_string + " F\n"
    print(splitJoin1)
    with open(path2, "w") as x:
        x.write(splitJoin1)


"""


"""

if 90 <= calculation_bradshaw:
    splitJoin2 = new_string_2 + " A\n"
    print(splitJoin2)
    with open(path2, "a") as x:
        x.write(splitJoin2)
elif 80 <= calculation_bradshaw < 90:
    splitJoin2 = new_string_2 + " B"
    print(splitJoin2)
    # lets_add = "F"
    with open(path2, "a") as x:

        x.write(splitJoin2)
    print(splitJoin2)
    print(split_join2)
elif 70 <= calculation_bradshaw < 80:
    splitJoin2 = new_string_2 + " C"
    print(splitJoin2)
    with open(path2, "a") as x:
        x.write(splitJoin2)
elif 60 <= calculation_bradshaw < 70:
    splitJoin2 = new_string_2 + " D"
    print(splitJoin2)
    with open(path2, "a") as x:
        x.write(splitJoin2)
elif calculation_bradshaw < 60:
    splitJoin2 = new_string_2 + " F"
    print(splitJoin2)
    with open(path2, "a") as x:
        x.write(splitJoin2)

"""


"""



if 90 <= calculation_charlton:
    splitJoin3 = new_string_3 + " A"
    print(splitJoin3)
    with open(path2, "a") as x:
        x.write(splitJoin3)
elif 80 <= calculation_charlton < 90:
    splitJoin3 = new_string_3 + " B\n"
    print(splitJoin3)
    # lets_add = "F"
    with open(path2, "a") as x:

        x.write(splitJoin3)
    print(splitJoin3)
    print(split_join2)
elif 70 <= calculation_charlton < 80:
    splitJoin3 = new_string_3 + " C"
    print(splitJoin3)
    with open(path2, "a") as x:
        x.write(splitJoin3)
elif 60 <= calculation_charlton < 70:
    splitJoin3 = new_string_3 + " D"
    print(splitJoin3)
    with open(path2, "a") as x:
        x.write(splitJoin3)
elif calculation_charlton < 60:
    splitJoin3 = new_string_3 + " F"
    print(splitJoin3)
    with open(path2, "a") as x:
        x.write(splitJoin3)

"""



"""


if 90 <= calculation_mayo:
    splitJoin4 = new_string_4 + " A"
    print(splitJoin4)
    with open(path2, "a") as x:
        x.write(splitJoin4)
elif 80 <= calculation_mayo < 90:
    splitJoin4 = new_string_4 + " B"
    print(splitJoin4)
    # lets_add = "F"
    with open(path2, "a") as x:

        x.write(splitJoin4)
    print(splitJoin4)
    print(split_join2)
elif 70 <= calculation_mayo < 80:
    splitJoin4 = new_string_4 + " C"
    print(splitJoin4)
    with open(path2, "a") as x:
        x.write(splitJoin4)
elif 60 <= calculation_mayo < 70:
    splitJoin4 = new_string_4 + " D\n"
    print(splitJoin4)
    with open(path2, "a") as x:
        x.write(splitJoin4)
elif calculation_mayo < 60:
    splitJoin4 = new_string_4 + " F"
    print(splitJoin4)
    with open(path2, "a") as x:
        x.write(splitJoin4)


"""



"""



if 90 <= calculation_stern:
    splitJoin5 = new_string_5 + " A"
    print(splitJoin5)
    with open(path2, "a") as x:
        x.write(splitJoin5)
elif 80 <= calculation_stern < 90:
    splitJoin5 = new_string_5 + " B"
    print(splitJoin5)
    # lets_add = "F"
    with open(path2, "a") as x:

        x.write(splitJoin5)
    print(splitJoin5)
    print(split_join2)
elif 70 <= calculation_stern < 80:
    splitJoin5 = new_string_5 + " C"
    print(splitJoin5)
    with open(path2, "a") as x:
        x.write(splitJoin5)
elif 60 <= calculation_stern < 70:
    splitJoin5 = new_string_5 + " D"
    print(splitJoin5)
    with open(path2, "a") as x:
        x.write(splitJoin5)
elif calculation_stern < 60:
    splitJoin5 = new_string_5 + " F"
    print(splitJoin5)
    with open(path2, "a") as x:
        x.write(splitJoin5)





    with open(path2, "r+") as x:
        all_lines = x.read()
        print(all_lines)







#print(five_elements)


#with open(path2, "w") as f_2:
    #new_lines = f_2.write(split_join1)
    #print(new_lines)





    #new_lines = []
    #for line in all_lines:
        #new_lines.append(line)


#with open(path2, "r+") as x:
    #all_lines = x.readline()
    #print(all_lines)


