% Save as: numerology.m
% Usage:
%   numerology("alternative")
%   numerology("vibration")
%   numerology()                 % prompts for input
%
% Auto-saving behavior (to base workspace):
%   After each call, the cleaned word is appended to a cell-array variable:
%     num1, num2, ... num9, num11, num20, num22, num33, num44
%
% Special/master numbers (kept without further reduction):
%   11, 20, 22, 33, 44
%
% Optional utility commands:
%   numerology("__show__")      % displays bucket sizes found in workspace
%   numerology("__clear__")     % clears num* buckets created by this tool

function final = numerology(word)

  % --- utility commands (optional) ---
  if (nargin == 1) && ischar(word)
    if strcmpi(strtrim(word), "__show__")
      show_buckets_();
      final = NaN;
      return;
    elseif strcmpi(strtrim(word), "__clear__")
      clear_buckets_();
      fprintf("Cleared numerology buckets (num1..num9, num11, num20, num22, num33, num44) from base workspace.\n");
      final = NaN;
      return;
    endif
  endif

  % --- input handling ---
  if (nargin < 1) || isempty(word)
    word = input('Enter a word (English letters): ', 's');
  endif

  % Accept string objects if your Octave supports them
  if exist("isstring", "builtin") && isstring(word)
    word = char(word);
  endif

  if ~ischar(word)
    error('Input must be text, e.g., numerology("Hello") or numerology(''Hello'')');
  endif

  % Keep letters only
  word = regexprep(word, '[^A-Za-z]', '');
  if isempty(word)
    fprintf('No letters found. Please enter a word containing A-Z letters.\n');
    final = NaN;
    return;
  endif

  word = upper(word);
  n = length(word);

  % --- letter -> value (A=1..I=9 repeating) ---
  vals = zeros(1, n);
  for i = 1:n
    vals(i) = mod(double(word(i)) - double('A'), 9) + 1;
  endfor

  total = sum(vals);

  % --- build display strings ---
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

  % --- print process ---
  fprintf('\nWord: %s\n', word);
  fprintf('Mapping (A=1..I=9 repeating):\n');
  fprintf('  %s\n', term_letters);

  fprintf('Sum of letter values:\n');
  fprintf('  %s = %d\n', term_values, total);

  fprintf('Reduction:\n');
  if is_special_(total)
    fprintf('  %d is a special/master number -> keep as %d\n', total, total);
    final = total;
  else
    current = total;
    while (current > 9) && (~is_special_(current))
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

      if is_special_(current)
        fprintf('  %d is a special/master number -> keep as %d\n', current, current);
        break;
      endif
    endwhile
    final = current;
  endif

  fprintf('\nFinal numerology number: %d\n', final);

  % --- AUTO-SAVE into base workspace bucket "num<final>" ---
  save_to_bucket_(word, final, total);

endfunction


% ---------------- helpers ----------------

function tf = is_special_(x)
  % Treat 11, 20, 22, 33, 44 as "keep as-is"
  tf = any(x == [11, 20, 22, 33, 44]);
endfunction

function save_to_bucket_(word_clean_upper, final, total)
  % Creates/appends to base-workspace cell array: num<final>
  varname = sprintf("num%d", final);

  % Fetch existing bucket if present; else create
  try
    existing = evalin("base", varname);
    if ~iscell(existing)
      existing = {};
    endif
  catch
    existing = {};
  end_try_catch

  existing{end+1} = word_clean_upper;
  assignin("base", varname, existing);

  % Also keep a simple log in base workspace (optional)
  entry.word  = word_clean_upper;
  entry.sum   = total;          % sum before reduction
  entry.final = final;          % final (after reduction/special stop)
  entry.time  = datestr(now);

  try
    LOG = evalin("base", "NUMEROLOGY_LOG");
    if ~isstruct(LOG)
      LOG = entry;
    else
      LOG(end+1) = entry;
    endif
  catch
    LOG = entry;
  end_try_catch

  assignin("base", "NUMEROLOGY_LOG", LOG);
endfunction

function show_buckets_()
  keys = [1:9, 11, 20, 22, 33, 44];
  fprintf("Numerology buckets in base workspace:\n");
  for k = 1:numel(keys)
    varname = sprintf("num%d", keys(k));
    try
      v = evalin("base", varname);
      if iscell(v)
        fprintf("  %-6s : %d word(s)\n", varname, numel(v));
      else
        fprintf("  %-6s : (exists, not a cell array)\n", varname);
      endif
    catch
      % doesn't exist; skip
    end_try_catch
  endfor

  % Show log size if present
  try
    L = evalin("base", "NUMEROLOGY_LOG");
    if isstruct(L)
      fprintf("  %-12s : %d entr(y/ies)\n", "NUMEROLOGY_LOG", numel(L));
    endif
  catch
  end_try_catch
endfunction

function clear_buckets_()
  keys = [1:9, 11, 20, 22, 33, 44];
  for k = 1:numel(keys)
    varname = sprintf("num%d", keys(k));
    evalin("base", sprintf("if exist('%s','var'), clear %s; end", varname, varname));
  endfor
  evalin("base", "if exist('NUMEROLOGY_LOG','var'), clear NUMEROLOGY_LOG; end");
endfunction
