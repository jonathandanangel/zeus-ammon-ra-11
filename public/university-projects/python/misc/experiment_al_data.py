experimental_data = []
for token in input().split():
	experimental_data.append(int(token))

slice_length = len(experimental_data) // 3

morning_group = experimental_data[0:slice_length]

afternoon_group = experimental_data[slice_length:(2*slice_length)]

evening_group = experimental_data[(2*slice_length):]


print(f"Number of data in each third: {slice_length}")
print(f"Complete data list: {experimental_data}")
print(f"Morning group: {morning_group}")
print(f"Afternoon group: {afternoon_group}")
print(f"Evening group: {evening_group}")