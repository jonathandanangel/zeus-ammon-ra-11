% Save this as: numerology.m
% Usage (Command Window):
%   numerology("Jonathan")
%   n = numerology("Angel")
%   numerology()            % prompts for input

function final = numbers(word)
  % Numerology (Pythagorean) for a single word
  % - Maps A=1..I=9 repeating (J=1..R=9, S=1..Z=8)
  % - Sums letter values, then reduces to a single digit
  % - Keeps master numbers 11, 22, 33, 44 (stops reducing if reached)
  % - Prints the full addition/reduction process
  %
  % Returns:
  %   final = final numerology number (single digit or master number)

  if (nargin < 1) || isempty(word)
    word = input('Enter a word (English letters): ', 's');
  endif

  if ~ischar(word)
    error('Input must be a character string, e.g., numerology("Hello")');
  endif

  word = regexprep(word, '[^A-Za-z]', '');
  if isempty(word)
    fprintf('No letters found. Please enter a word containing A-Z letters.\n');
    final = NaN;
    return;
  endif

  word = upper(word);
  n = length(word);

  % Letter -> value (A=1..9 repeating)
  vals = zeros(1, n);
  for i = 1:n
    vals(i) = mod(double(word(i)) - double('A'), 9) + 1;
  endfor

  total = sum(vals);

  % Build display strings
  term_letters = '';
  term_values  = '';
  for i = 1:n
    term_letters = [term_letters, sprintf('%c(%d)', word(i), vals(i))];
    term_values  = [term_values,  sprintf('%d', vals(i))];
    if i < n
      term_letters = [term_letters, ' + '];
      term_values  = [term_values,  ' + '];
    endif
  endfor

  % Print process
  fprintf('\nWord: %s\n', word);
  fprintf('Mapping (A=1..I=9 repeating):\n');
  fprintf('  %s\n', term_letters);

  fprintf('Sum of letter values:\n');
  fprintf('  %s = %d\n', term_values, total);

  fprintf('Reduction:\n');
  if is_master_(total)
    fprintf('  %d is a master number -> keep as %d\n', total, total);
    final = total;
  else
    current = total;
    while (current > 9) && (~is_master_(current))
      str = sprintf('%d', current);
      parts = str - '0';

      step_expr = '';
      for k = 1:length(parts)
        step_expr = [step_expr, sprintf('%d', parts(k))];
        if k < length(parts)
          step_expr = [step_expr, ' + '];
        endif
      endfor

      nextv = sum(parts);
      fprintf('  %s = %d\n', step_expr, nextv);

      current = nextv;

      if is_master_(current)
        fprintf('  %d is a master number -> keep as %d\n', current, current);
        break;
      endif
    endwhile
    final = current;
  endif

  fprintf('\nFinal numerology number: %d\n', final);

endfunction

% --- helper (local) function ---
function tf = is_master_(x)
  tf = any(x == [11, 22, 33, 44]);
endfunction
