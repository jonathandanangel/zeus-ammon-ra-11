% Numerology (Pythagorean) for a single word
% - Prompts for a word (letters only; non-letters are ignored)
% - Maps A=1..I=9, J=1..R=9, S=1..Z=8
% - Sums letter values, then reduces to a single digit
% - Keeps master numbers 11, 22, 33, 44 (stops reducing if reached)
% - Shows the full addition/reduction process

clear; clc;

function tf = is_master(n)
  tf = any(n == [11, 22, 33, 44]);
endfunction

function s = digit_sum(n)
  str = sprintf('%d', abs(n));
  s = sum(str - '0');
endfunction

word_raw = input('Enter a word (English letters): ', 's');
word = regexprep(word_raw, '[^A-Za-z]', '');

if isempty(word)
  fprintf('No letters found. Please run again and enter a word with A-Z letters.\n');
  return;
endif

word = upper(word);
n = length(word);

vals = zeros(1, n);
for i = 1:n
  vals(i) = mod(double(word(i)) - double('A'), 9) + 1;
endfor

total = sum(vals);

% Build "letter(value) + ..." and "value + ..." strings
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

fprintf('\nWord: %s\n', word);
fprintf('Mapping (A=1..I=9 repeating):\n');
fprintf('  %s\n', term_letters);
fprintf('Sum of letter values:\n');
fprintf('  %s = %d\n', term_values, total);

% Reduction steps
fprintf('Reduction:\n');
if is_master(total)
  fprintf('  %d is a master number -> keep as %d\n', total, total);
else
  current = total;
  while (current > 9) && (~is_master(current))
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
    if is_master(current)
      fprintf('  %d is a master number -> keep as %d\n', current, current);
      break;
    endif
  endwhile
  total = current;
endif

fprintf('\nFinal numerology number: %d\n', total);
