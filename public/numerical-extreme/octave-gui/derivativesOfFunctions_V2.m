syms x
f = ((e^(((-x^2)/(2)))));

n = 1;                 % n = number of derivatives to take
Dn_f = diff(f, x, n);  % compute the n-th derivative

disp(['n = ' num2str(n)])
disp('n-th derivative:')
Dn_f

