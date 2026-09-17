# Read input and split input into tokens
tokens = input().split()

input_list = []
for token in tokens:
    input_list.append(int(token))

print(f"All data: {input_list}")

#largest_diff = None
#element_index = 0
#subtraction_index = 0
#largest_diff = 0

# input_list.sort()
# input_list.reverse()
#input_list_sort = input_list.reverse()
#print(f"Sequence: {input_list}")

# 35 36 67 34


odd = input_list[:]
actual_odd = []
#print(odd)



for i in range(len(odd)):
    if len(odd) % 2 != 0:
        actual_odd.append(i)
#print(actual_odd)

for i in actual_odd:

    if odd[i] >= 35 and len(odd) > 2:
        all_accepted = True
        print(f'Index {i}: {odd[i]}')
    elif odd[i] < 35 and len(odd) > 2:
        all_accepted = False
        print(f'Index {i}: {odd[i]}')



"""

for i in range(len(input_list) - 1):
    if  input_list[element_index] > input_list[element_index+1]:
        subtraction_index = input_list[element_index] - input_list[element_index + 1]
    elif input_list[element_index] == input_list[element_index] and input_list[element_index] == largest_diff:
        largest_diff = input_list[element_index]

    if subtraction_index > largest_diff:
        largest_diff = subtraction_index
    print(f'this is i - 1: {i}')
    print(f'this is element index: {element_index}')
    print(f'this is subtraction: {subtraction_index}')
    print(f'this is the largest difference: {largest_diff}')
    element_index += 1


"""


print(f"The largest difference between two neighboring values is {largest_diff}")