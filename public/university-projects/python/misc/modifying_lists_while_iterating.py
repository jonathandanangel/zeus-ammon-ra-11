nums1 = []
nums2 = []

user_input = input("Enter first set of numbers: ")
tokens = user_input.split()  # Split into separate strings

# Convert strings to integers
print()
for pos, val in enumerate(tokens):
    nums1.append(int(val))
    print(f"{pos}: {val}")

user_input = input("Enter second set of numbers: ")
tokens = user_input.split()

# Convert strings to integers
print()
for pos, val in enumerate(tokens):
    nums2.append(int(val))
    print(f"{pos}: {val}")

# Remove elements from nums1 if also in nums2
print()
for val in nums1:
    if val in nums2:
        print(f"Deleting {val}")
        nums1.remove(val)

# Print new numbers
print("\nNumbers only in first set:", end=" ")
for num in nums1:
    print(num, end=' ')

