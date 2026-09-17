num_lines = int(input())
vals_2d = []
for row_index in range(num_lines):
    row_elements = []
    for x in input().split():
        row_elements.append(int(x))
    vals_2d.append(row_elements)


#print(vals_2d)

#vals1 = []
"""

count_ing = 0

while len(vals_2d) != 0:
    print(vals_2d[count_ing], end=",")
    count_ing += 1
    vals_2d.pop()
    print(vals_2d)


"""




#for i in vals_2d[0:len(vals_2d) -1]:
    #print(vals_2d)

for row_index, row in enumerate(vals_2d):
    for col_index, col in enumerate(row):
        if col_index < len(row)-1:
            print(col, end=",")
        if col_index == len(row)-1:
            print(col)



    #print()
    #print(f'vals_2d[{row_index}][{col_index}] is {col:}', end=",")
    #print(f'vals_2d[{row_index}] is {row:}', end=",")



"""
If the index of the element is less than the length of the row minus one, then print() is 
called with the element and end="," as the arguments to output the element and a comma.
Otherwise, print() is called with the element as the argument to output the element and a newline.


"""


#count_ing = 0

#for z in range(0,len(vals_2d)):
#    print(vals_2d[z][count_ing])
#    count_ing += 1


"""

enumerate() returns the index and the value of the list element in the current iteration.
print(x, end=",") outputs x and ends with a comma instead of a default newline.


"""



#    vals_2d.pop(0)
 #   print(vals_2d)
#print(vals_2d)


#for i in vals_2d[0:len(vals_2d) -1]:
    #print(vals_2d)

#for row_index, row in enumerate(vals_2d):
    #for col_index, col in enumerate(row):
        #print(f'vals_2d[{row_index}][{col_index}] is {col:}')



"""

3
13 87 85
26 39 24 72
10 91


currency = [
   [1, 5, 10 ],  # US Dollars
   [0.75, 3.77, 7.53],  #Euros
   [0.65, 3.25, 6.50]  # British pounds
]
for row_index, row in enumerate(currency):
   for column_index, item in enumerate(row):
       print(f"currency[{row_index}][{column_index}] is {item:.2f}")






"""
