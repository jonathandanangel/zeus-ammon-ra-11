# Calculate the extension (stretch) of a simple uniform steel rod
# of circular cross section when subject to a constant tension
# force. Assume that we are given
#   d = the rod diameter (milimeters)
#   l = the rod length (meters)
#   F = the force on the rod (Newtons)

# User enters these values

import math

d = float(input('rod diameter in mm: '))    # we will need to convert this to m
l = float(input('rod length in m: '))
F = float(input('force in Newtons: '))

# some constants (are the units correct?)
E = 190*10**9            # elastic modulus
    # the circular constant (this line is correct)

d_m = d/1000.0           # convert units
A = (math.pi * d_m**2) / 4.0         # cross-sectional area

delta = (l*F)/(A*E)          # The stretch, in meters
delta_mm = delta*1000.0  # now in milimeters

# Show the results

print(f"The rod will stretch {delta_mm:.3f} mm.")