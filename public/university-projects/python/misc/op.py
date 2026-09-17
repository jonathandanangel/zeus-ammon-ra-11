# repeat some math until user quits
DoMore = 'y' # do at least the first one
while ( DoMore[0].lower()=='y' ):
    x = float(input('Enter a value: '))
    sqrt_x = x**0.5
    print('The square root of',x,'=',sqrt_x,'\n')
    DoMore = input('Do another (y/n) ? ')