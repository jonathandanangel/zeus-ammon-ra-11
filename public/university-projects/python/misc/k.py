x = float(input('Enter x'))
y = float(input('Enter y'))

test1 = ( ( x >= 0 ) and ( y >= 0 ) )
test2 = ( ( x < 0 ) and ( y >= 0 ) )
test3 = ( ( x >= 0 ) and ( y < 0 ) )
test4 = ( ( x < 0 ) and ( y < 0 ) )

f = test1*(x + y) + test2*(x**2 + y) + \
test3*(x + y**2) + test4*(x**2 + y**2)

print('f(',x,',',y,') = ',f)