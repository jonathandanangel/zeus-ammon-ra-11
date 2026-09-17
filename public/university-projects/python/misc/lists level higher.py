m = int(input())
plus_one_animal = input()
animal_names = input().split()

del animal_names[m]


animal_names[0] = plus_one_animal




print(f"My favorite animals: {animal_names}")