bacteria_colonies = []

tokens = input().split()
for token in tokens:
    bacteria_colonies.append(int(token))

print("Original samples:", end=" ")
for sample in bacteria_colonies:
    print(sample, end=" ")
print()



for i in range(len(bacteria_colonies)):
    if i % 2 != 0:
        #print(bacteria_colonies[i], end=" ")
        bacteria_colonies[i] = 0
        #print(sample, end=" ")

print(bacteria_colonies)


#for x, sample in enumerate(bacteria_colonies):
    #if bacteria_colonies[x] % 2 != 0:
        #print(sample, end=" ")






print("Reduced samples:", end=" ")
for sample in bacteria_colonies:
    print(sample, end=" ")
print()