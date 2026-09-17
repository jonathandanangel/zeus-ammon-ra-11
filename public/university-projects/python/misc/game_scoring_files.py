import os


tokens = "/Users/jonathanangel10312002/PyCharmMiscProject/.venv/bin/python /Users/jonathanangel10312002/PyCharmMiscProject/HW04b_TeamData.txt".split(os.path.sep)
print(tokens)

file_path = "/Users/jonathanangel10312002/PyCharmMiscProject/"

file = input("Enter a score data file name: ")

path = os.path.join(file_path, file)
with open(path, "r") as f:
    all_lines = f.readlines()                          # raw (includes \n)
    clean_lines = [line.rstrip("\n") for line in all_lines]  # clean (no \n)

print(clean_lines)

with open(path, "r+") as f:
    read_line = f.read()

print(read_line)



new_list = []

integers_only = []

strings_only = []

newfile = "test_file.txt"
path2 = os.path.join(file_path, newfile)

for i in clean_lines:
    splitting_lines = i.split()
    print(splitting_lines)
    new_list.append(splitting_lines)

print(new_list)

print(new_list[3:])

new_list_2 = []

new_list_3 = []

for i in range(len(new_list[3:])):
    print(new_list[3:][i])
    new_list_2.append(new_list[3:][i])

print(new_list_2)

for i in range(len(new_list_2)):
    try:
        print(new_list_2[i][0], new_list_2[i][-1])
        scores_1 = new_list_2[i][0]
        scores_2 = new_list_2[i][-1]
        new_list_3.append((scores_1, scores_2))
    except (IndexError, ValueError, TypeError):
        continue

new_list_2_backup = new_list_2

new_list_nocolon = new_list_2



print(new_list_2_backup)

for i in range(len(new_list_nocolon)):
    try:
        new_list_nocolon[i].remove(":")
    except (IndexError, ValueError, TypeError):
        continue
print(new_list_nocolon, "here")



# new_list_nocolon example row: ['1', 'dark', 'blue', '56']
team_totals = {}
team_counts = {}


for row in new_list_nocolon:
    if len(row) >= 3:
        game_str = row[0].strip()
        score_str = row[-1].strip()
        if game_str.isdigit() and score_str.isdigit():
            team_name = " ".join(row[1:-1]) #the inside no colon
            score = int(score_str)

            team_totals[team_name] = team_totals.get(team_name, 0) + score
            team_counts[team_name] = team_counts.get(team_name, 0) + 1


team_avgs = {team: team_totals[team] / team_counts[team] for team in team_totals}

final_string = []



# dict order should not be sorted(team_avgs) to conserve output
# dict stores every key name once only updating values associated with keys
# dict is easiest way to store values

for team in team_avgs:
    print(f"{team_avgs[team]:.2f} : {team}")
    final_string.append(f"{team_avgs[team]:.2f} : {team}")

print(final_string)

title_string = f'Average : Team Name'

#final_string.insert(0, title_string)
print(final_string)



for i in range(len(final_string)):
    title_string += f'\n{final_string[i]}'

print(title_string)


newfile = "test_file.txt"
path2 = os.path.join(file_path, newfile)
with open(path2, "w") as f:
    f.write(title_string)






for i in range(len(new_list_2_backup)):
    try:
        new_list_2_backup[i].remove(":")
        new_list_2_backup[i].pop(0)
        new_list_2_backup[i].pop(-1)
    except (IndexError, ValueError, TypeError):
        continue
print(new_list_2_backup)



unique_list = []
seen = set()

for sublist in new_list_2_backup:
    # Create a hashable version of the sublist to check if it's been seen.
    sublist_as_tuple = tuple(sublist)
    if sublist_as_tuple not in seen:
        unique_list.append(sublist)
        seen.add(sublist_as_tuple)

print(unique_list)


for i in range(len(new_list_2_backup)):
    try:
        if unique_list[i] in new_list_2_backup:
            print("seen")
    except (IndexError, ValueError, TypeError):
        continue

for i in range(len(unique_list)):
    for i in unique_list[i]:
        print(f'{i},', end="")

#for i in range(len(new_list_2_backup)):







"""

for item in a:
    if item not in seen:
        seen.add(item)
        result.append(item)
        
"""


print(new_list_3)



for i in range(len(new_list_3)):
    try:

        #score1 = [int(v.strip()) for v in new_list_3[i][0]]
        #score2 = [int(v.strip()) for v in new_list_3[i][1]]
        score1 = int("".join(map(str, new_list_3[i][0])))
        score2 = int("".join(map(str, new_list_3[i][1])))

        print(score1, score2)
        integers_only.append((score1, score2))
    except (IndexError, ValueError, TypeError):
        continue

print(integers_only)







"""   
for x in range(len(new_list)):
    try:
        scores = [int(v.strip()) for v in new_list[x][2:]]  # convert each element
        print(scores)                                        # e.g., [70, 45, 59]
        new_list_2.append(scores)
    except (IndexError, ValueError, TypeError):
        continue
    
"""

#for item in new_list:
    #if isinstance(item, int):
        #integers_only.append(item)
#print(integers_only)

#space_remove = ""

#new_list[1].remove(space_remove)
#print(new_list[1])

#nL1 = "".join(new_list[1])
#print(nL1)

"""
output:




"""

