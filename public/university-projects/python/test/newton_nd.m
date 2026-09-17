function [x, nitr, ierr] = newton_nd(func, jac, x0, eps_res, delt_step, maxit)
  x = x0(:);
  ierr = 0;
  nitr = 0;

  v = func(x);

  for k = 1:maxit
    nitr = k;
    J = jac(x);

    [L, U, P] = lu(J);
    if (rcond(U) < eps)
      ierr = 1; % linear solve failure / near singular
      return;
    end

    s = U \ (L \ (P * v)); % solve J*s = v

    if (max(abs(s)) < delt_step)
      return;
    end

    x = x - s;

    v = func(x);
    if (max(abs(v)) < eps_res)
      return;
    end
  end

  ierr = -1; % max iterations exceeded
end
