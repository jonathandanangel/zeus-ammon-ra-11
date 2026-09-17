import math

q = 5
r= q -2
q=2*q

s= q -r

print("s = ", s)

# quiz example
print("quiz example 2\n")

#quiz example 2
for odds in range(1,20):
    if (odds % 2 !=0):
        print(odds)
    if (odds >= 10):
        break
print("quiz example 3 \n")

# quiz example 3

q = float(input('enter x: '))
b = (q**9)/math.cos(6)
print("b =", b) # print('b = %f' %(b)) ?




print("quiz example 4 \n")

print('x=%7.2f' % x) # x = 13.65

print('x =%10.4f' % x) # x = 13.6547

print('x =%9.5f'% x) # x = 13.65472

