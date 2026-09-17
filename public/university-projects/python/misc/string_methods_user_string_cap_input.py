user_string = input()

#strip().title() - to take off leading and trailing whitespace and
# capitalize every first sentence like a title to something
# Takes off spaces strip()

if "Paint color:" in user_string:
    print(user_string.strip().title())
else:
    print(user_string.strip().upper())








