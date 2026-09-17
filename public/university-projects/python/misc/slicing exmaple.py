usr_text = input("Enter a string: ")
print()

first_half = usr_text[:len(usr_text) // 2]
last_half = usr_text[len(usr_text) // 2:]

print(f"The first half of the string is \"{first_half}\"")
print(f"The second half of the string is \"{last_half}\"")