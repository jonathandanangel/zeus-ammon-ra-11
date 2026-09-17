x = float(input('Enter x '))
y = float(input('Enter y '))


if ( ( x >= 0 ) and ( y >= 0 ) ):
    f = x + y
elif ( ( x < 0 ) and ( y >= 0 ) ):
    f = x**2 + y
elif ( ( x >= 0 ) and ( y < 0 ) ):
    f = x + y**2
else:
    f = x**2 + y**2
    print('f(',x,',',y,') = ',f)