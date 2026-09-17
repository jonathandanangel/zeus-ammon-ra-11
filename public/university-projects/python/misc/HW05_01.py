currency = [
    [1, 5, 10],  # US Dollars
    [0.75, 3.77, 7.53],  # Euros
    [0.65, 3.25, 6.50]  # British pounds
]

new_currency = []
for row_index, row in enumerate(currency):
    # The fix is here: You are already using `row_index` for the index
    # and `row` for the inner list.
    # The `if` statement logic is incorrect and should be removed.

    # You can directly use `row` in the inner loop.
    print(f"Row {row_index}:")  # Or print(f"{row}") to see the whole inner list
    for column_index, item in enumerate(row):
        print(f"currency[{row_index}][{column_index}] is {item:.2f}")
        if currency[row_index][2] == item:
            new_currency.append([item])


print(new_currency)

#print(new_currency[2])

item_currency = [10]

for i in range(len(new_currency)):
    if new_currency[i] == [10]:
        print(new_currency[i])

