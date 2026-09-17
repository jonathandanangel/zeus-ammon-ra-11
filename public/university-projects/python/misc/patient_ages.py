patient_ages = []

tokens = input().split()
for token in tokens:
    patient_ages.append(int(token))

print("Original ages:", end=" ")
for age in patient_ages:
    print(age, end=" ")
print()

""" Your code goes here """


"""





try:

    print(len(patient_ages))
    for i in range(len(patient_ages)):
        if patient_ages[i] < 25:
            # print(bacteria_colonies[i], end=" ")
            # value = patient_ages[i]
            patient_ages.remove(patient_ages[i])
            # print(f"{patient_ages[i]}: {value}")
            # patient_ages[i].remove(i)
            # print(sample, end=" ")


    for i in range(len(patient_ages)):
        if patient_ages[i] > 60:
            patient_ages.remove(patient_ages[i])
            print(f'{patient_ages[i]}')
    print(len(patient_ages))






except IndexError:
    print("No patient ages found")









"""









for T, patient_age in enumerate(patient_ages):
    if patient_age < 25:
        patient_ages.remove(patient_age)
    elif patient_age > 60:
        patient_ages.remove(patient_age)

#print(len(patient_ages))

for T, patient_age in enumerate(patient_ages):
    if patient_age > 60:
        patient_ages.remove(patient_age)

    #while patient_ages < 25:
        #patient_ages.remove(patient_age)

#print(len(patient_ages))

print(patient_ages)




#for T, patient_age in enumerate(patient_ages):
    #if patient_age < 25:
        #patient_ages.remove(patient_age)
    #elif patient_age > 60:
        #patient_ages.remove(patient_age)

    #while patient_ages < 25:
        #patient_ages.remove(patient_age)







print("Screened ages:", end=" ")
for age in patient_ages:
    print(age, end=" ")
print()