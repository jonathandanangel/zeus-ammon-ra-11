replace_string = input()
sentence = input()


if replace_string in sentence:
    position = sentence.find(replace_string)
    print("At position:", position)
    new_string_sentence = sentence.replace(replace_string, "(deleted)", 1)
    print(new_string_sentence)
else:
    print("None found")





