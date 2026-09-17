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


while x >= 0:
    if x >= dolla:
        count_dollar += 1
        x = x - 100
        print(x)
    elif x >= quarters:
        count_quarters += 1
        x = x - 25
        print(x)
    elif x >= dimes:
        count_dimes += 1
        x = x - 10
    elif x >= nickels:
        count_nickels += 1
        x = x - 5
        print(x)
    elif x >= pennies:
        count_pennies += 1
        x = x - 1
        print(x)
    elif x == 0:
        print(count_dollar, "start here")
        print(count_quarters)
        print(count_dimes)
        print(count_nickels)
        print(count_pennies)
        break