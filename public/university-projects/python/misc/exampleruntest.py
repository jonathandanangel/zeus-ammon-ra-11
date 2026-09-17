
# Read the first line of integers
nums_input = input().split()
nums = []
for n in nums_input:
    nums.append(int(n))

# Read the lower and upper bounds
bounds_input = input().split()
low = int(bounds_input[0])
high = int(bounds_input[1])

# Print numbers within the range, followed by a comma
for n in nums:
    if low <= n <= high:
        print(str(n) + ",", end="")

# LOOK OVER AGAIN


# Read the first line of name,phone pairs
pairs = input().split()

# Read the name to search for
search_name = input()

# Create a dictionary for name -> phone
contacts = {}
for pair in pairs:
    name, phone = pair.split(",")
    contacts[name] = phone

# Output the phone number for the search name
print(contacts[search_name])
