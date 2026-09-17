tictactoe = [
  input().split(),
  input().split(),
  input().split()
]

new_tictactoe = []
for row_index, row in enumerate(tictactoe):
    # The fix is here: You are already using `row_index` for the index
    # and `row` for the inner list.
    # The `if` statement logic is incorrect and should be removed.

    # You can directly use `row` in the inner loop.
    print(f"Row {row_index}:")  # Or print(f"{row}") to see the whole inner list
    for column_index, item in enumerate(row):
        print(f"tictactoe[{row_index}][{column_index}] is {item:}")
        if tictactoe[row_index][2] == item:
            new_tictactoe.append([item])


print(new_tictactoe)

if new_tictactoe == [['x'],['x'],['x']]:
    print("A win at column 2.")
else:
    print("No win at column 2.")


