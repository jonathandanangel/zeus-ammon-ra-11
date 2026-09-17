x = int(input())
dolla = 100
quarters = 25
dimes = 10
nickels = 5
pennies = 1

count_dollar = 0
count_quarters = 0
count_dimes = 0
count_nickels = 0
count_pennies = 0

if x == 0:
    print("No change")

while x >= 0:
    if x >= dolla:
        count_dollar += 1
        x = x - 100

    elif x >= quarters:
        count_quarters += 1
        x = x - 25

    elif x >= dimes:
        count_dimes += 1
        x = x - 10
    elif x >= nickels:
        count_nickels += 1
        x = x - 5

    elif x >= pennies:
        count_pennies += 1
        x = x - 1

    elif x == 0:
        if count_dollar != 0 and count_dollar > 1:
            print(count_dollar, "Dollars")
        elif count_dollar != 0 and count_dollar == 1:
            print(count_dollar, "Dollar")

        if count_quarters != 0 and count_quarters > 1:
            print(count_quarters, "Quarters")
        elif count_quarters != 0 and count_quarters == 1:
            print(count_quarters, "Quarter")

        if count_dimes != 0 and count_dimes > 1:
            print(count_dimes, "Dimes")
        elif count_dimes != 0 and count_dimes == 1:
            print(count_dimes, "Dime")

        if count_nickels != 0 and count_nickels > 1:
            print(count_nickels, "Nickels")
        elif count_nickels != 0 and count_nickels == 1:
            print(count_nickels, "Nickel")

        if count_pennies != 0 and count_pennies > 1:
            print(count_pennies, "Pennies")
        elif count_pennies != 0 and count_pennies == 1:
            print(count_pennies, "Penny")

        break