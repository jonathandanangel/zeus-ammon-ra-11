# Read input and split into integers
tokens = input().split()
trend_data = [int(t) for t in tokens]

# Collect all bumps as (left, peak, right)
bumps = []
for i in range(1, len(trend_data) - 1):
    if trend_data[i] > trend_data[i - 1] and trend_data[i] > trend_data[i + 1]:
        bumps.append((trend_data[i - 1], trend_data[i], trend_data[i + 1]))

# Print only the last two bumps (if fewer exist, print those)
for x, y, z in bumps[-2:]:
    print(f'Bump: {x} {y} {z}')
