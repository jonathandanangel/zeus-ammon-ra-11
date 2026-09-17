my_string = input()

first_half = my_string[:len(my_string) // 2]

sliced_lyric = first_half[::3]


print(sliced_lyric)