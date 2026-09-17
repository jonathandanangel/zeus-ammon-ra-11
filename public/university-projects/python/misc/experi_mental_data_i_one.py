experimental_data = []
for token in input().split():
	experimental_data.append(int(token))

""" Your code goes here """





backup_data = experimental_data[:]

samples_picked = experimental_data[1::3]



experimental_data.clear()
print(f"Backup data list: {backup_data}")
print(f"Samples selected: {samples_picked}")




