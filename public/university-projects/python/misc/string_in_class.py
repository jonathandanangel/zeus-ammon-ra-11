name = "Alice"
age = 30
height = 5.789

# Using %s for string, %d for integer, %f for float
message1 = "Hello, %s! You are %d years old." % (name, age)
print(message1)

# Using width specifiers and precision for floats
message2 = "Your height is %7.3f feet." % height
print(message2)

# Left-justification with negative width
item = "Book"
price = 19.99
receipt = "Item: %-10s Price: $%.2f" % (item, price)
print(receipt)