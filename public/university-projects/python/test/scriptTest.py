# Complete the following program

num_in_tens = int(input("Enter the tens digit: "))
num_in_ones = int(input("Enter the ones digit: "))

num_in = num_in_tens * 10 + num_in_ones

print("You entered", num_in)
print(num_in, "* 11 is", num_in * 11)

# num_out_hundreds = num_in_tens + ((num_in_tens + num_in_ones) // 10)
num_out_hundreds = num_in_tens + ((num_in_tens + num_in_ones) // 10)

# print(num_out_hundreds, num_in_tens)

# Your code goes here

if (num_in_tens + num_in_ones) >= 10:
    x = num_in_tens + num_in_ones

    y = ( x // 10)

    yz = x - 10

    string_yz = str(yz)

    c = y + num_in_tens

    string_c = str(c)

    string_num_out_ones = str(num_in_ones)

    sum_over_ten_num_out = string_c + string_yz + string_num_out_ones
else:
    num_out_tens = num_in_tens + num_in_ones
    string_out_tens = str(num_out_tens)

    string_num_in_tens = str(num_in_tens)
    string_num_in_ones = str(num_in_ones)

    num_out = string_num_in_tens + string_out_tens + string_num_in_ones
    # print("ok")



# num_out_tens = num_in_ones + ((num_in_ones + 0) // 10)  # FINISH
num_out_ones = num_in_ones + ((num_in_ones + 0) // 10)
# num_out_ones = 0 + ((0 + 0) // 10)  # FINISH

# print(num_out_tens, num_out_ones)
# print(num_out_ones)

# string_num_out_ones = str(num_out_ones)

print("An easy mental way to find the answer is:")
print(num_in_tens, ",", num_in_tens, "+", num_in_ones, ",", num_in_ones)
# Your code goes here: Build num_out from its digits
# sum_over_ten_num_out = string_c + string_yz + string_num_out_ones  # FINISH



# Note this line will generate an error until the above program is complete.
if "sum_over_ten_num_out" in globals():
    print(sum_over_ten_num_out)
else:
    print(num_out)