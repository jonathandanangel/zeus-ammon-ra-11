student_grades = {}  # Create an empty dict
grade_prompt = "Enter name and grade (Ex. \"Bob A+\"):"
del_prompt = "Enter a name to delete:"
menu_prompt = ("1. Add/modify student grade\n"
               "2. Delete student grade\n"
               "3. Print student grades\n"
               "4. Quit\n")

while True:
    command = input(menu_prompt).lower().strip()
    if command == "1":
        name, grade = input(grade_prompt).split()
        student_grades[name] = grade
    elif command == "2":
        name = input(del_prompt)
        del student_grades[name]
    elif command == "3":
        print(student_grades)
    elif command == "4":
        break
    else:
        print("Unrecognized command.")
    print()