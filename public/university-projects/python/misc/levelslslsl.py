# Read input and split input into tokens
tokens = input().split()

samples_list = []
for token in tokens:
    samples_list.append(int(token))

print(f"Raw samples: {samples_list}")

num_rejected = 0
index_num = 0
for i in samples_list:
    if i < 65 and i != 65:
        print(f'{i} at index {index_num} is accepted')

    if i > 65:
        num_rejected += 1
        print(f'{i} at index {index_num} is rejected')
    index_num += 1

print(f"Total rejected samples: {num_rejected}")