
function NumericalAnalysisToolboxGUI_Octave_V2
% NumericalAnalysisToolboxGUI_Octave_V2
% Octave-compatible GUI (Qt) using figure/uicontrol/axes.
% Improvements vs first Octave port:
%   - Output uses LISTBOX with scrollbar (easy to view long logs)
%   - Fixes MVT integral logical-scalar issues (forces scalar double)
%   - Adds "Save Log" button (writes output to .txt)
%   - Cleans up any HTML entity artifacts in displayed text
%
% Requirements (Octave):
%   pkg load symbolic
%

  if exist('OCTAVE_VERSION','builtin')
    try, graphics_toolkit('qt'); catch, end
  end

  if exist('pkg','file')
    try
      pkg('load','symbolic');
    catch
      warning('Could not load symbolic package. Install with: pkg install -forge symbolic');
    end
  end

  fig = figure('Name','Numerical Analysis Toolbox (Octave V2)','NumberTitle','off',...
               'Position',[80 40 1250 740]);

  ctrlPanel = uipanel('Parent',fig,'Title','Inputs','Units','pixels','Position',[10 10 440 720]);
  outPanel  = uipanel('Parent',fig,'Title','Output','Units','pixels','Position',[460 10 780 720]);

  ax = axes('Parent',outPanel,'Units','pixels','Position',[40 300 700 390]);
  title(ax,'Plot'); xlabel(ax,'x'); ylabel(ax,'y'); grid(ax,'on');

  % LISTBOX supports scrolling for long output
  logBox = uicontrol('Parent',outPanel,'Style','listbox','Units','pixels',...
                     'Position',[40 50 700 240],...
                     'FontName','Courier','FontSize',10,...
                     'Max',2,'Min',0,'String',{'(output will appear here)'});

  saveLogBtn = uicontrol('Parent',outPanel,'Style','pushbutton','Units','pixels',...
                         'Position',[40 15 120 28],'String','Save Log',...
                         'Callback',@onSaveLog);

  % --- Controls layout ---
  y = 670; dy = 28; xL=15; xR=170; wL=145; wR=250; h=22;

  uicontrol(ctrlPanel,'Style','text','Units','pixels','Position',[xL y wL h],...
            'String','f(x)=','HorizontalAlignment','right');
  fEdit = uicontrol(ctrlPanel,'Style','edit','Units','pixels','Position',[xR y-5 wR h+8],...
            'HorizontalAlignment','left','FontName','Courier','String',defaultFunc());
  y -= dy;

  [aEdit,y] = addNum(ctrlPanel,'a','1e-6',xL,xR,wL,wR,h,y,dy);
  [bEdit,y] = addNum(ctrlPanel,'b','2',xL,xR,wL,wR,h,y,dy);

  uicontrol(ctrlPanel,'Style','text','Units','pixels','Position',[xL y wL h],...
            'String','Plot click mode','HorizontalAlignment','right');
  clickModePopup = uicontrol(ctrlPanel,'Style','popupmenu','Units','pixels',...
            'Position',[xR y wR h],...
            'String',{'Off','Set interval [a,b]','Pick Secant seeds'},...
            'Value',2);
  y -= dy;

  uicontrol(ctrlPanel,'Style','text','Units','pixels','Position',[xL y wL h],...
            'String','Secant seeds','HorizontalAlignment','right');
  seedEdit = uicontrol(ctrlPanel,'Style','edit','Units','pixels','Position',[xR y wR h],...
            'String','(not set)','Enable','inactive');
  y -= dy;

  [tolEdit,y] = addNum(ctrlPanel,'TOL','1e-6',xL,xR,wL,wR,h,y,dy);
  [maxitEdit,y] = addNum(ctrlPanel,'MAXIT','200',xL,xR,wL,wR,h,y,dy);
  [gridnEdit,y] = addNum(ctrlPanel,'GRIDN','400',xL,xR,wL,wR,h,y,dy);

  shiftChk = uicontrol(ctrlPanel,'Style','checkbox','Units','pixels','Position',[xR y wR h],...
            'String','Shift-to-zero (y=x-c)','Value',1);
  y -= dy;

  [degEdit,y] = addNum(ctrlPanel,'Taylor degs','2,5',xL,xR,wL,wR,h,y,dy);

  y -= 10;
  uicontrol(ctrlPanel,'Style','text','Units','pixels','Position',[xL y wL+wR h],...
            'String','Vibrations (SDOF)','FontWeight','bold','HorizontalAlignment','left');
  y -= dy;

  uicontrol(ctrlPanel,'Style','text','Units','pixels','Position',[xL y wL h],...
            'String','Mode','HorizontalAlignment','right');
  vibModePopup = uicontrol(ctrlPanel,'Style','popupmenu','Units','pixels','Position',[xR y wR h],...
            'String',{'Free response','Forced steady-state'},'Value',1);
  y -= dy;

  [mEdit,y] = addNum(ctrlPanel,'m (kg)','1',xL,xR,wL,wR,h,y,dy);
  [cEdit,y] = addNum(ctrlPanel,'c (N*s/m)','0.2',xL,xR,wL,wR,h,y,dy);
  [kEdit,y] = addNum(ctrlPanel,'k (N/m)','20',xL,xR,wL,wR,h,y,dy);
  [x0Edit,y]= addNum(ctrlPanel,'x0 (m)','0.1',xL,xR,wL,wR,h,y,dy);
  [v0Edit,y]= addNum(ctrlPanel,'v0 (m/s)','0',xL,xR,wL,wR,h,y,dy);
  [F0Edit,y]= addNum(ctrlPanel,'F0 (N)','1',xL,xR,wL,wR,h,y,dy);
  [wEdit,y] = addNum(ctrlPanel,'omega (rad/s)','2',xL,xR,wL,wR,h,y,dy);
  [tEndEdit,y]=addNum(ctrlPanel,'tEnd (s)','20',xL,xR,wL,wR,h,y,dy);

  y -= 6;
  runBtn = uicontrol(ctrlPanel,'Style','pushbutton','Units','pixels',...
                     'Position',[xL y 205 32],'String','Run Analysis',...
                     'Callback',@onRun);
  vibBtn = uicontrol(ctrlPanel,'Style','pushbutton','Units','pixels',...
                     'Position',[xL+215 y 205 32],'String','Run Vibration',...
                     'Callback',@onVib);
  y -= 40;
  clearBtn = uicontrol(ctrlPanel,'Style','pushbutton','Units','pixels',...
                     'Position',[xL y 420 32],'String','Clear Output',...
                     'Callback',@onClear);

  % ---------------- Click state ----------------
  clickStage = 0; seedStage = 0;
  seed1 = NaN; seed2 = NaN;
  hA = NaN; hB = NaN; hS1 = NaN; hS2 = NaN;

  set(ax,'ButtonDownFcn',@onAxesClick);
  plotX = []; plotY = [];

  % ---------------- Callbacks ----------------
  function onClear(~,~)
    set(logBox,'String',{'(output cleared)'});
    cla(ax);
    title(ax,'Plot'); xlabel(ax,'x'); ylabel(ax,'y'); grid(ax,'on');
    seed1=NaN; seed2=NaN; seedStage=0; clickStage=0;
    set(seedEdit,'String','(not set)');
  end

  function onSaveLog(~,~)
    lines = get(logBox,'String');
    if ischar(lines), lines = {lines}; end
    [fname, fpath] = uiputfile({'*.txt','Text file (*.txt)'},'Save log as');
    if isequal(fname,0)
      return;
    end
    fid = fopen(fullfile(fpath,fname),'w');
    if fid < 0
      errordlg('Could not open file for writing.','Save Log');
      return;
    end
    for i=1:numel(lines)
      fprintf(fid,'%s\n', lines{i});
    end
    fclose(fid);
  end

  function onRun(~,~)
    [ok, params, msg] = readAnalysisParams();
    if ~ok
      errordlg(msg,'Input error');
      return;
    end

    [logStr, summary, plotData] = analyzeCore(params);

    % Put log into listbox
    lines = strsplit(logStr,'\n');
    set(logBox,'String',lines(:));

    plotX = plotData.x; plotY = plotData.f;
    cla(ax);
    if isempty(plotX)
      text(0.5,0.5,'No finite points to plot','Parent',ax,'HorizontalAlignment','center');
      return;
    end
    plt = plot(ax, plotX, plotY, '-');
    set(plt,'ButtonDownFcn',@onAxesClick);
    grid(ax,'on');
    title(ax,'f(x) on [a,b] (finite values)');
    xlabel(ax,'x'); ylabel(ax,'f(x)');
    redrawMarkers();
  end

  function onVib(~,~)
    [ok, vib, msg] = readVibParams();
    if ~ok
      errordlg(msg,'Vibration input error');
      return;
    end

    [logStr, out, plotData] = vibrationCore(vib);

    cur = get(logBox,'String');
    if ischar(cur), cur = {cur}; end
    newLines = [cur; {''}; {'=== VIBRATIONS OUTPUT ==='}; strsplit(logStr,'\n')(:)];
    set(logBox,'String',newLines);

    cla(ax);
    if strcmp(vib.mode,'Free response')
      plot(ax, plotData.t, plotData.x, '-');
      grid(ax,'on');
      title(ax,'Free vibration response x(t)');
      xlabel(ax,'t (s)'); ylabel(ax,'x (m)');
    else
      plot(ax, plotData.wgrid, plotData.Xgrid, '-'); hold(ax,'on');
      plot(ax, vib.w, out.X, 'ro');
      hold(ax,'off'); grid(ax,'on');
      title(ax,'Forced steady-state amplitude X(omega)');
      xlabel(ax,'omega (rad/s)'); ylabel(ax,'Amplitude (m)');
    end
  end

  function onAxesClick(~,~)
    cp = get(ax,'CurrentPoint');
    xClick = cp(1,1);
    if ~isfinite(xClick)
      return;
    end

    modeList = get(clickModePopup,'String');
    modeVal  = modeList{get(clickModePopup,'Value')};

    if strcmp(modeVal,'Off')
      return;
    elseif strcmp(modeVal,'Set interval [a,b]')
      if clickStage == 0
        set(aEdit,'String',num2str(xClick,'%.12g'));
        clickStage = 1;
      else
        set(bEdit,'String',num2str(xClick,'%.12g'));
        clickStage = 0;
        aVal = str2double(get(aEdit,'String'));
        bVal = str2double(get(bEdit,'String'));
        if aVal > bVal
          set(aEdit,'String',num2str(bVal,'%.12g'));
          set(bEdit,'String',num2str(aVal,'%.12g'));
        end
      end
      redrawMarkers();
    elseif strcmp(modeVal,'Pick Secant seeds')
      if seedStage == 0
        seed1 = xClick;
        seedStage = 1;
      else
        seed2 = xClick;
        seedStage = 0;
        if seed1 > seed2
          tmp = seed1; seed1 = seed2; seed2 = tmp;
        end
        set(seedEdit,'String',sprintf('[%.12g, %.12g]', seed1, seed2));
      end
      redrawMarkers();
    end
  end

  function redrawMarkers()
    deleteIfHandle(hA); deleteIfHandle(hB); deleteIfHandle(hS1); deleteIfHandle(hS2);
    hA = NaN; hB = NaN; hS1 = NaN; hS2 = NaN;

    aVal = str2double(get(aEdit,'String'));
    bVal = str2double(get(bEdit,'String'));

    if isfinite(aVal)
      hA = line(ax,[aVal aVal],ylim(ax),'LineStyle','--','Color',[0 0.6 0]);
    end
    if isfinite(bVal)
      hB = line(ax,[bVal bVal],ylim(ax),'LineStyle','--','Color',[0.7 0 0.7]);
    end
    if isfinite(seed1)
      hS1 = line(ax,[seed1 seed1],ylim(ax),'LineStyle',':','Color',[0 0 0]);
    end
    if isfinite(seed2)
      hS2 = line(ax,[seed2 seed2],ylim(ax),'LineStyle',':','Color',[0 0 0]);
    end
  end

  function deleteIfHandle(h)
    if ~isempty(h) && ishandle(h)
      delete(h);
    end
  end

  function [ok, params, msg] = readAnalysisParams()
    ok = false; msg = ''; params = struct();
    params.fStr = get(fEdit,'String');
    params.a = str2double(get(aEdit,'String'));
    params.b = str2double(get(bEdit,'String'));
    params.TOL = str2double(get(tolEdit,'String'));
    params.MAXIT = round(str2double(get(maxitEdit,'String')));
    params.GRIDN = round(str2double(get(gridnEdit,'String')));
    params.SHIFT_TO_ZERO = (get(shiftChk,'Value') ~= 0);
    params.taylorDegs = parseDegs(get(degEdit,'String'));
    params.userSeeds = [seed1 seed2];

    if ~isfinite(params.a) || ~isfinite(params.b) || ~(params.a < params.b)
      msg = 'Interval must satisfy a < b (both numeric).';
      return;
    end
    if ~isfinite(params.TOL) || params.TOL <= 0
      msg = 'TOL must be > 0.';
      return;
    end
    if ~isfinite(params.MAXIT) || params.MAXIT <= 0
      msg = 'MAXIT must be a positive integer.';
      return;
    end
    if ~isfinite(params.GRIDN) || params.GRIDN <= 10
      msg = 'GRIDN must be > 10.';
      return;
    end
    ok = true;
  end

  function [ok, vib, msg] = readVibParams()
    ok = false; msg=''; vib=struct();
    modeList = get(vibModePopup,'String');
    vib.mode = modeList{get(vibModePopup,'Value')};
    vib.m = str2double(get(mEdit,'String'));
    vib.c = str2double(get(cEdit,'String'));
    vib.k = str2double(get(kEdit,'String'));
    vib.x0 = str2double(get(x0Edit,'String'));
    vib.v0 = str2double(get(v0Edit,'String'));
    vib.F0 = str2double(get(F0Edit,'String'));
    vib.w  = str2double(get(wEdit,'String'));
    vib.tEnd = str2double(get(tEndEdit,'String'));

    if ~isfinite(vib.m) || vib.m <= 0
      msg = 'Mass m must be > 0.';
      return;
    end
    if ~isfinite(vib.k) || vib.k <= 0
      msg = 'Stiffness k must be > 0.';
      return;
    end
    if ~isfinite(vib.c) || vib.c < 0
      msg = 'Damping c must be >= 0.';
      return;
    end
    if ~isfinite(vib.tEnd) || vib.tEnd <= 0
      msg = 'tEnd must be > 0.';
      return;
    end
    ok = true;
  end

end

% ------------------- helpers -------------------
function s = defaultFunc()
  s = '-20000 + 7000*(((1+x)^3 - 1)/(x*(1+x)^3)) + 8000/(1+x)^3';
end

function [hEdit, yOut] = addNum(parent, label, init, xL,xR,wL,wR,h,y,dy)
  uicontrol(parent,'Style','text','Units','pixels','Position',[xL y wL h],...
            'String',label,'HorizontalAlignment','right');
  hEdit = uicontrol(parent,'Style','edit','Units','pixels','Position',[xR y wR h],...
            'String',init);
  yOut = y - dy;
end

function degs = parseDegs(txt)
  parts = regexp(txt,'[0-9]+','match');
  if isempty(parts)
    degs = [2 5];
  else
    degs = unique(cellfun(@str2double, parts));
  end
end

function [logStr, summary, plotData] = analyzeCore(p)
  logLines = {};
  push = @(s) assignin('caller','logLines',[evalin('caller','logLines'); {cleanText(s)}]);

  try
    syms x
  catch
    error('Symbolic package not loaded. Run: pkg load symbolic');
  end

  fStr = sanitizeFuncString(p.fStr);
  try
    f_sym = sym(fStr);
  catch
    error('Could not parse f(x). Check syntax.');
  end

  push('=== Function f(x) ===');
  push(char(f_sym));

  fp_sym = [];
  try
    fp_sym = diff(f_sym, x);
    push('');
    push("f'(x):");
    push(char(fp_sym));
  catch
    push('');
    push("Could not obtain f'(x) symbolically.");
  end

  f_num  = @(z) double(subs(f_sym, x, z));
  fp_num = [];
  if ~isempty(fp_sym)
    fp_num = @(z) double(subs(fp_sym, x, z));
  end

  push('');
  push('1) Factorization attempt:');
  try
    push(char(factor(f_sym)));
  catch
    push('Factorization failed or not simpler.');
  end

  push('');
  push('2) Shifted representation in powers of (x - h):');
  try
    h = sym('h'); t = sym('t');
    f_t = expand(subs(f_sym, x, t + h));
    f_t_col = collect(f_t, t);
    f_shifted = subs(f_t_col, t, x - h);
    push(char(f_shifted));
    push('');
    push('  Shifted about h=0:');
    push(char(simplify(subs(f_shifted, h, 0))));
  catch
    push('Shifted representation failed.');
  end

  a=p.a; b=p.b; GRIDN=p.GRIDN;
  push('');
  push(sprintf('3) IVT scan on [%g,%g] and refined bisection:', a, b));

  Xgrid = linspace(a,b,GRIDN+1);
  Fgrid = arrayfun(@(z) safeEval(f_num,z), Xgrid);
  finitePair = isfinite(Fgrid(1:end-1)) & isfinite(Fgrid(2:end));
  signChangeIdx = find(finitePair & (Fgrid(1:end-1).*Fgrid(2:end) < 0));

  brackets = [];
  for k = signChangeIdx(:).'
    brackets(end+1,:) = [Xgrid(k), Xgrid(k+1)];
  end

  if isempty(brackets)
    push(sprintf('  No sign-change brackets on [%g,%g].', a, b));
  else
    push(sprintf('  Detected %d bracket(s):', rows(brackets)));
    push(mat2str(brackets,4));
  end

  bestBracket=[]; bisectionRoot=NaN;
  if ~isempty(brackets)
    left = brackets(1,1); right = brackets(1,2);
    for iter=1:12
      mid = 0.5*(left+right);
      fm = safeEval(f_num,mid);
      if fm == 0
        left=mid; right=mid; break;
      end
      fl = safeEval(f_num,left);
      if isfinite(fl) && isfinite(fm) && fl*fm < 0
        right = mid;
      else
        left = mid;
      end
    end
    bestBracket=[left,right];
    bisectionRoot=mid;
    push(sprintf('  Refined bracket: [%.12g, %.12g]', bestBracket(1), bestBracket(2)));
    push(sprintf('  Bisection root approx: c ≈ %.12g, f(c)=%.3e', mid, safeEval(f_num,mid)));
  end

  push('');
  push('4) Proposed Secant seed pairs (safer choices):');
  secantPairs=[];
  if ~isempty(bestBracket)
    secantPairs(end+1,:) = bestBracket;
    push(sprintf('  - Bracket endpoints: [%.6g, %.6g]', bestBracket(1), bestBracket(2)));
  end
  if isfield(p,'userSeeds') && numel(p.userSeeds)==2 && all(isfinite(p.userSeeds)) && p.userSeeds(1)~=p.userSeeds(2)
    s = sort(p.userSeeds);
    secantPairs(end+1,:) = s;
  end
  [~,idxSort] = sort(abs(Fgrid));
  cand = unique(sort(Xgrid(idxSort(1:min(12,numel(Xgrid))))));
  for i=1:min(5,numel(cand)-1)
    secantPairs(end+1,:) = [cand(i), cand(i+1)];
  end
  if isempty(secantPairs)
    push('  No suggestions available.');
  else
    secantPairs = unique(sort(secantPairs,2),'rows');
    push(mat2str(secantPairs,6));
  end

  push('');
  push(sprintf("5) Mean Value Theorem on [%g,%g]: find c with f'(c) = (f(b)-f(a))/(b-a)", a, b));
  MVT_c = NaN;
  if ~isempty(fp_num)
    slope = (safeEval(f_num,b) - safeEval(f_num,a)) / (b-a);
    fun = @(z) safeEval(fp_num,z) - slope;
    try
      MVT_c = fzero(fun, 0.5*(a+b));
      MVT_c = double(MVT_c(1));
      if isfinite(MVT_c) && (MVT_c>a) && (MVT_c<b)
        push(sprintf('  MVT c in (a,b): %.4f', MVT_c));
      else
        push('  Numeric c not in (a,b).');
      end
    catch
      push('  MVT computation failed (numeric solve).');
    end
  else
    push('  Derivative unavailable.');
  end

  push('');
  push(sprintf('6) MVT for integrals on [%g,%g] (average value):', a, b));
  avg_val = NaN; MVTint_c = NaN;
  try
    avg_val = quad(@(z) safeEval(f_num,z), a, b) / (b-a);
    push(sprintf('  Average(f) = %g', avg_val));
    fun2 = @(z) safeEval(f_num,z) - avg_val;
    try
      MVTint_c = fzero(fun2, 0.5*(a+b));
      MVTint_c = double(MVTint_c(1));
      if isfinite(MVTint_c) && (MVTint_c>=a) && (MVTint_c<=b)
        push(sprintf('  c in [a,b] with f(c)=average: %.4f', MVTint_c));
      else
        push('  No c in [a,b] found.');
      end
    catch
      push('  Integral step failed (root solve).');
    end
  catch ME
    push(['  Integral step failed: ' ME.message]);
  end

  push('');
  push('7) Taylor polynomials & derivative tables (by hand):');
  for order = p.taylorDegs
    try
      poly = sym(0);
      for k=0:order
        dk = diff(f_sym, x, k);
        coef = subs(dk, x, 0) / factorial(k);
        poly = poly + coef * x^k;
      end
      push(sprintf('  Taylor degree %d about x=0:', order));
      push(char(simplify(poly)));
    catch
      push(sprintf('  Taylor degree %d about x=0: (failed)', order));
    end
    push('  Derivatives at x=0:');
    for k=0:order+1
      try
        dk = subs(diff(f_sym,x,k), x, 0);
        push(sprintf('    f^{(%d)}(0) = %s', k, char(dk)));
      catch
        push(sprintf('    f^{(%d)} unavailable.', k));
      end
    end
  end

  push('');
  push('8) Iterations: Newton & Secant');
  xN = NaN;
  if p.SHIFT_TO_ZERO && ~isempty(fp_num)
    if ~isempty(bestBracket)
      c0 = mean(bestBracket);
    else
      [~,iMin] = min(abs(Fgrid));
      c0 = Xgrid(iMin);
    end
    push(sprintf('*** Shift-to-zero mode: y = x - c, with c = %.12g ***', c0));
    g = @(y) safeEval(f_num,y+c0);
    gp = @(y) safeEval(fp_num,y+c0);
    yN = 0.5*(a+b) - c0;
    if ~isempty(bestBracket)
      yN = mean(bestBracket) - c0;
    end
    for k=1:p.MAXIT
      d = gp(yN);
      if ~isfinite(d) || d==0
        push(sprintf('  Breakdown at iter %d (g''=0/NaN).', k));
        break;
      end
      yN1 = yN - g(yN)/d;
      push(sprintf('  k=%3d: y=%.12g  |g(y)|=%.3e', k, yN1, abs(g(yN1))));
      if abs(g(yN1)) < p.TOL
        yN = yN1;
        break;
      end
      yN = yN1;
    end
    xN = yN + c0;
    push(sprintf('Newton result: x ≈ %.12g, f(x)=%.3e', xN, safeEval(f_num,xN)));
  else
    push('Newton skipped (derivative unavailable or shift off).');
  end

  summary = struct();
  summary.f_sym = f_sym;
  summary.interval = [a b];
  summary.brackets = brackets;
  summary.refinedBracket = bestBracket;
  summary.bisectionRoot = bisectionRoot;
  summary.secantPairs = secantPairs;
  summary.newtonRoot = xN;
  summary.MVT_c = MVT_c;
  summary.MVTint_c = MVTint_c;
  summary.avg_val = avg_val;

  plotMask = isfinite(Fgrid);
  plotData.x = Xgrid(plotMask);
  plotData.f = Fgrid(plotMask);

  logStr = strjoin(logLines,'\n');
end

function s = sanitizeFuncString(s)
  s = strtrim(s);
  s = regexprep(s,'^\s*f\s*\(\s*x\s*\)\s*=\s*','');
  s = regexprep(s,'^\s*f_sym\s*=\s*','');
  s = regexprep(s,';\s*$','');
  s = strrep(s, char(8722), '-');
  s = regexprep(s,'\s+',' ');
end

function t = cleanText(t)
  % Replace HTML entities that may have been pasted
  t = strrep(t,'&lt;','<');
  t = strrep(t,'&gt;','>');
  t = strrep(t,'&amp;','&');
end

function y = safeEval(f, x)
  try
    y = f(x);
  catch
    y = NaN;
  end
end

function [logStr, out, plotData] = vibrationCore(v)
  wn = sqrt(v.k / v.m);
  z  = v.c / (2*sqrt(v.k*v.m));
  out = struct('m',v.m,'c',v.c,'k',v.k,'wn',wn,'zeta',z);

  lines = {};
  lines{end+1} = sprintf('m=%.6g, c=%.6g, k=%.6g', v.m, v.c, v.k);
  lines{end+1} = sprintf('wn=%.6g rad/s (fn=%.6g Hz)', wn, wn/(2*pi));
  lines{end+1} = sprintf('zeta=%.6g', z);

  if strcmp(v.mode,'Free response')
    tEnd = v.tEnd;
    dt = max(1e-4, tEnd/2000);
    t = 0:dt:tEnd;

    if z < 1
      wd = wn*sqrt(1 - z^2);
      out.wd = wd;
      A = v.x0;
      B = (v.v0 + z*wn*v.x0)/wd;
      xresp = exp(-z*wn*t).*(A*cos(wd*t) + B*sin(wd*t));
      lines{end+1} = sprintf('Underdamped: wd=%.6g rad/s', wd);
    else
      xresp = exp(-z*wn*t).*v.x0;
      out.wd = NaN;
      lines{end+1} = 'Non-underdamped: using simple decaying response placeholder.';
    end

    plotData = struct('t',t,'x',xresp);
  else
    w = v.w; F0 = v.F0;
    denom = sqrt((v.k - v.m*w^2)^2 + (v.c*w)^2);
    X = F0/denom;
    phi = atan2(v.c*w, v.k - v.m*w^2);
    out.X = X; out.phi = phi;
    lines{end+1} = sprintf('Forced at w=%.6g rad/s: X=%.6g, phi=%.6g rad', w, X, phi);
    wgrid = linspace(max(0,0.1*wn), 3*wn, 400);
    denomGrid = sqrt((v.k - v.m*wgrid.^2).^2 + (v.c*wgrid).^2);
    Xgrid = F0 ./ denomGrid;
    plotData = struct('wgrid',wgrid,'Xgrid',Xgrid);
  end

  logStr = strjoin(lines,'\n');
end

