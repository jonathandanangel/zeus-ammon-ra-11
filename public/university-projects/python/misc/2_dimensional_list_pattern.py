grid_size = int(input())

pattern_2d = []
for m in range(grid_size):
    row = []
    for n in range(grid_size):
        row.append(0)
    pattern_2d.append(row)

""" Your code goes here """







for row in pattern_2d:
    for cell in row:
        print(cell, end=" ")
    print()