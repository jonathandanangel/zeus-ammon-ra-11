my_list = [['dark', 'blue'], ['light', 'orange'], ['dark', 'blue'], ['light', 'orange'], ['red'], ['dark', 'blue'], ['dark', 'blue'], ['light', 'orange'], ['red'], ['red'], ['light', 'orange'], ['light', 'orange'], ['dark', 'blue'], ['dark', 'blue'], ['red']]

unique_list = []
seen = set()

for sublist in my_list:
    # Create a hashable version of the sublist to check if it's been seen.
    sublist_as_tuple = tuple(sublist)
    if sublist_as_tuple not in seen:
        unique_list.append(sublist)
        seen.add(sublist_as_tuple)

print(unique_list)
# Output: [['dark', 'blue'], ['light', 'orange'], ['red']]
