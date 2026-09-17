pkg load symbolic      % Ensure the symbolic package is loaded
syms x
f = x*cos(x);

% Perform symbolic integration with respect to x
% To do a definite integral, use: int(f, x, lower_limit, upper_limit)
integral_f = int(f, x);

disp('Original function f(x, y):')
disp(f)
disp('Indefinite integral of f with respect to x:')
disp(integral_f)

