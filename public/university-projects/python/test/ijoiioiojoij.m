func = @(x) [ x(1)^2 + x(2)^2 - 1;
             x(1) - x(2) ];

jac  = @(x) [ 2*x(1), 2*x(2);
             1,      -1 ];

x0 = [0.7; 0.6];
[x, nitr, ierr] = newton_nd(func, jac, x0, 1e-10, 1e-10, 25);

x, nitr, ierr
