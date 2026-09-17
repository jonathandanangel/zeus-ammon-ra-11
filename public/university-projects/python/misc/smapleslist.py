# Read input and split input into tokens
tokens = input().split()

samples_list = []
for token in tokens:
    samples_list.append(int(token))

print(f"All data: {samples_list}")



odd = samples_list[:]
actual_odd = []
real_odd = []
odd_index = [0]
for w in range(len(samples_list)-1):
    odd_index.append(odd_index[w] + 1)

#print(f"All data: {odd_index}")


all_accepted = None


for i in range(len(odd)-1):
    if odd[i] % 2 != 0:
        actual_odd.append(i)
#print(actual_odd)

for i in range(len(odd_index)):
    if odd_index[i] % 2 == 0:
        real_odd.append(i)
#print(real_odd)

for i in real_odd:
    print(f'Index {i}: {odd[i]}')

for i in real_odd:
    if odd[i] >= 35:
        all_accepted = True
        #print(f'Index {i}: {odd[i]}')
        #print(f'{i}, {odd[i]} TRUE')
    else:
        all_accepted = False
        #print(f'Index {i}: {odd[i]}')
        #print(f'{i}, {odd[i]} FALSE')
        break


if all_accepted:
    print("All integers at even indices are greater than or equal to 35.")
else:
    print("At least one integer at an even index is less than 35.")