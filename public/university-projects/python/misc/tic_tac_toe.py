game_board = [
  input().split(),
  input().split(),
  input().split()
]

#print(game_board[0])

row1 = []
row2 = []
row3 = []

row1.append(game_board[0])
row2.append(game_board[1])
row3.append(game_board[2])

count_x = []

#for i in game_board[:]:
    #row1.append(game_board[i])
if row1[0][0] == "x":
  count_x.append("x")
if row2[0][0] == "x":
    count_x.append("x")
if row3[0][0] == "x":
    count_x.append("x")

if count_x == ["x", "x", "x"]:
    match_column0 = True
else:
    match_column0 = False


#print(f'{row1[0][0]} row1')

#print(row1, row2, row3)



if match_column0:
    print("Player x wins at column 0.")
else:
    print("Player x does not win at column 0.")