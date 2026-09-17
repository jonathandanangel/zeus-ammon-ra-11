#[item[0]

# name_of_person = list(input("Enter your name: "))


# print(len(name_of_person))

# print(name_of_person


# The colors_list is created from user input
color_names = input()
colors_list = color_names.split()

# Check if every string in the list is title-cased
all_title_cased = all(word.istitle() for word in colors_list)

colors_pop = colors_list.pop()

#print(colors_pop)

colors_list_append = colors_list.append(colors_pop)

#print(colors_pop, colors_list_append)

#print(len(colors_list))

if all_title_cased and len(colors_list) > 1:
   # print("Wow, they are all in title case!")
   # print(all_title_cased)
   # print(colors_list)
    if colors_pop in colors_list and len(colors_list)>1:
        count_colors = len(colors_list)
        everything_before_pop = count_colors - 1
        #print(everything_before_pop, "test")
        #print(colors_list[0:everything_before_pop])

        colors_list_somepart = colors_list[0:everything_before_pop]
        #print(colors_list_somepart, colors_list)

        initials_list = [colors_list_somepart[i].replace(colors_list_somepart[i], f"{colors_list_somepart[i][0]}.") for i in range(len(colors_list_somepart))]

        #print(initials_list)  # Output: ['A.', 'B.', 'C.']

        print(f'{"".join(colors_pop)},', "".join(initials_list))




elif len(colors_list) == 1:
    print(f'{colors_pop}')



#elif len(colors_list) == 1:
 #   print("only one")
 #   print(colors_list)
