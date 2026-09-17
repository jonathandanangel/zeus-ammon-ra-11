# Read input and split input into tokens
tokens = input().split()

trend_data = []
for token in tokens:
    trend_data.append(int(token))

print(f"Sequence: {trend_data}")

data_trend = []

x=0
y=0
z=0

for i in range(len(trend_data)):
    data_trend.append(i)

try:
    for i in data_trend:
        #print(trend_data[i])

        #if trend_data[i] == trend_data[data_trend.index(i)]:
            #print(trend_data[i])

        if trend_data[i] > trend_data[i-1] and trend_data[i] > trend_data[i+1]:
            x = trend_data[i-1]
            y = trend_data[i]
            z = trend_data[i+1]
            if trend_data[i] > trend_data[i-1] and trend_data[i] > trend_data[i+1]:
                print(f'Bump: {x} {y} {z}')

except IndexError:
    l = 10
    #if trend_data[i] == trend_data[i-1]:
            #print(trend_data[i-1])


#if y > x and y > z:
    #print(f'Bump: {x,y,z}')


#for i in data_trend:
    #if trend_data[i] < trend_data[i-1] and trend_data[i] < trend_data[i+1]:
        #print("test")



