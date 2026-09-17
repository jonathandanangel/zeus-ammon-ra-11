beverage_choices = input()
new_index = int(input())


beverage_list = beverage_choices.split(";")

beverage_list.pop(new_index)

beverage_list.insert(new_index, "eggnog")


print(beverage_list)