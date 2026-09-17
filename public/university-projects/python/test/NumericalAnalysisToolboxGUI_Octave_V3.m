
function NumericalAnalysisToolboxGUI_Octave_V3
% NumericalAnalysisToolboxGUI_Octave_V3
% Octave-compatible GUI that DOES NOT require the symbolic package.
%
% Why this version:
%  - Your Octave install cannot load the symbolic package, so the analysis part errors.
%  - This V3 uses numeric parsing (string -> function handle) + finite differences.
%  - Vibrations module remains numeric (works as before).
%  - Output uses LISTBOX (scrollbar) + Save Log.
%
% Notes:
%  - Because this is non-symbolic, sections like exact factorization and exact symbolic
%    derivative expressions are replaced with numeric approximations.
%  - For best reliability, write your function using element-wise ops (.^, .*, ./).
%    This GUI will attempt to auto-vectorize your input.
%
% Tested conceptually for GNU Octave 8+ (should work for 11.x).

%% ---------- USER INPUTS (EDIT THESE) ----------
% Set the single function f(x) as either:
%   (A) a string expression (recommended for GUI text box), OR
%   (B) a function handle @(x) ...
%
% IMPORTANT (Octave):
%  - Use element-wise operators for vectors:  .^   .*   ./
%  - Use exp(x), log(x), sin(x), cos(x) etc.
%  - Avoid “e^6x” style; write exp(6*x).
%  - If you type something like x(x/2 + a), write x.*(x/2 + a)

% ===== Option A: Expression string examples (paste directly into GUI f(x) box) =====
% fStr = 'x - cos(x)';                         % simple root ~0.739
% fStr = '(x-1).^3';                           % multiple root at x=1
% fStr = 'x.^5 - 2*x + 0.1';                   % quintic flavor
% fStr = 'x.^5 - 5*x.^3 - x.^2 + 1';
% fStr = 'x.^4 - 8*x.^3 + 24*x.^2 - 32*x + 16';% (x-2)^4 expanded
% fStr = 'x - pi - 0.5*sin(x/2)';              % trig + constant shift
% fStr = 'x.^5 + 5*x.^3 - x.^2 + 1';

% Exponential examples (write exp(...) NOT e^...):
% fStr = 'exp(6*x) + 1.441*exp(2*x) - 2.079*exp(4*x) - 0.333';
% fStr = 'exp(6*x) + 3*(log(2))^2*exp(2*x) - log(8)*exp(4*x) - (log(2))^3';

% “cos(x + sqrt(2)) + x*(x/2 + sqrt(2))” style:
% fStr = 'cos(x + sqrt(2)) + x.*(x/2 + sqrt(2))';
% Suggested interval for that one:  a=-2; b=-1;

% Your finance/IRR style function (Octave-safe elementwise):
% fStr = '-20000 + 7000*((((1+x).^3 - 1)./(x.*(1+x).^3))) + 8000./(1+x).^3';
% Suggested interval: a=1e-6; b=2;

% ===== Option B: Function handle examples (best reliability in Octave scripts) =====
% f = @(x) x - cos(x);
% f = @(x) (x-1).^3;
% f = @(x) x.^5 - 2*x + 0.1;
% f = @(x) x.^5 - 5*x.^3 - x.^2 + 1;
% f = @(x) x.^4 - 8*x.^3 + 24*x.^2 - 32*x + 16;
% f = @(x) x - pi - 0.5*sin(x/2);
% f = @(x) x.^5 + 5*x.^3 - x.^2 + 1;
% f = @(x) exp(6*x) + 1.441*exp(2*x) - 2.079*exp(4*x) - 0.333;
% f = @(x) exp(6*x) + 3*(log(2))^2*exp(2*x) - log(8)*exp(4*x) - (log(2))^3;
% f = @(x) cos(x + sqrt(2)) + x.*(x/2 + sqrt(2));
% f = @(x) -20000 + 7000*((((1+x).^3 - 1)./(x.*(1+x).^3))) + 8000./(1+x).^3;

% ===== Suggested default interval settings (edit as needed) =====
% a = 1e-6;        % interval left endpoint
% b = 2;           % interval right endpoint
% TOL = 1e-6;      % tolerance
% MAXIT = 200;     % max iterations
% GRIDN = 400;     % scan grid resolution




  if exist('OCTAVE_VERSION','builtin')
    try, graphics_toolkit('qt'); catch, end
  end

  fig = figure('Name','Numerical Analysis Toolbox (Octave V3 - No Symbolic)',...
               'NumberTitle','off','Position',[70 40 1280 760]);

  ctrlPanel = uipanel('Parent',fig,'Title','Inputs','Units','pixels','Position',[10 10 460 740]);
  outPanel  = uipanel('Parent',fig,'Title','Output','Units','pixels','Position',[480 10 790 740]);

  ax = axes('Parent',outPanel,'Units','pixels','Position',[40 320 720 390]);
  title(ax,'Plot'); xlabel(ax,'x'); ylabel(ax,'y'); grid(ax,'on');

  logBox = uicontrol('Parent',outPanel,'Style','listbox','Units','pixels',...
                     'Position',[40 55 720 255],...
                     'FontName','Courier','FontSize',10,...
                     'Max',2,'Min',0,'String',{'(output will appear here)'});

  uicontrol('Parent',outPanel,'Style','pushbutton','Units','pixels',...
            'Position',[40 15 120 30],'String','Save Log','Callback',@onSaveLog);

  % --- Controls layout ---
  y = 690; dy = 30; xL=15; xR=190; wL=160; wR=250; h=24;

  uicontrol(ctrlPanel,'Style','text','Units','pixels','Position',[xL y wL h],...
            'String','f(x)=','HorizontalAlignment','right');
  fEdit = uicontrol(ctrlPanel,'Style','edit','Units','pixels','Position',[xR y-4 wR h+8],...
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

  [tolEdit,y]   = addNum(ctrlPanel,'TOL','1e-6',xL,xR,wL,wR,h,y,dy);
  [maxitEdit,y] = addNum(ctrlPanel,'MAXIT','200',xL,xR,wL,wR,h,y,dy);
  [gridnEdit,y] = addNum(ctrlPanel,'GRIDN','400',xL,xR,wL,wR,h,y,dy);

  shiftChk = uicontrol(ctrlPanel,'Style','checkbox','Units','pixels',...
            'Position',[xR y wR h],'String','Shift-to-zero (y=x-c)','Value',1);
  y -= dy;

  [degEdit,y] = addNum(ctrlPanel,'Taylor degs','2,5',xL,xR,wL,wR,h,y,dy);

  y -= 10;
  uicontrol(ctrlPanel,'Style','text','Units','pixels','Position',[xL y wL+wR h],...
            'String','Vibrations (SDOF)','FontWeight','bold','HorizontalAlignment','left');
  y -= dy;

  uicontrol(ctrlPanel,'Style','text','Units','pixels','Position',[xL y wL h],...
            'String','Mode','HorizontalAlignment','right');
  vibModePopup = uicontrol(ctrlPanel,'Style','popupmenu','Units','pixels',...
            'Position',[xR y wR h],...
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
  uicontrol(ctrlPanel,'Style','pushbutton','Units','pixels',...
            'Position',[xL y 215 34],'String','Run Analysis','Callback',@onRun);
  uicontrol(ctrlPanel,'Style','pushbutton','Units','pixels',...
            'Position',[xL+225 y 215 34],'String','Run Vibration','Callback',@onVib);
  y -= 42;
  uicontrol(ctrlPanel,'Style','pushbutton','Units','pixels',...
            'Position',[xL y 440 34],'String','Clear Output','Callback',@onClear);

  % Click state
  clickStage = 0; seedStage = 0;
  seed1 = NaN; seed2 = NaN;
  hA = NaN; hB = NaN; hS1 = NaN; hS2 = NaN;


  % --- NEW: point-click overlays ---
  hPts = [];        % handle(s) to plotted points
  hTxt = [];        % handle(s) to coordinate text
  clickedXY = [];  % Nx2 array of clicked coordinates

  function addClickedPoint(x, y)
  hold(ax,'on');
  hPt = plot(ax, x, y, 'ro', 'MarkerFaceColor','r', 'MarkerSize',6, 'HitTest','off');
  hLabel = text(ax, x, y, sprintf(' (%.5g, %.5g)', x, y), ...
                'VerticalAlignment','bottom','HorizontalAlignment','left', ...
                'Color',[0.15 0.15 0.15],'FontSize',9,'Interpreter','none','HitTest','off');
  hold(ax,'off');

  hPts(end+1) = hPt;
  hTxt(end+1) = hLabel;
  clickedXY(end+1, :) = [x, y];

  % Log it
  cur = get(logBox,'String'); if ischar(cur), cur={cur}; end
  cur{end+1} = sprintf('Clicked point: x=%.12g, y=%.12g', x, y);
  set(logBox,'String',cur);
end

function clearClickedPoints()
  if ~isempty(hPts)
    for k=1:numel(hPts)
      if ishandle(hPts(k)), delete(hPts(k)); end
    end
  end
  if ~isempty(hTxt)
    for k=1:numel(hTxt)
      if ishandle(hTxt(k)), delete(hTxt(k)); end
    end
  end
  hPts = []; hTxt = []; clickedXY = [];

  cur = get(logBox,'String'); if ischar(cur), cur={cur}; end
  cur{end+1} = '(cleared clicked points)';
  set(logBox,'String',cur);
end


  set(ax,'ButtonDownFcn',@onAxesClick);

  function onClear(~,~)
    set(logBox,'String',{'(output cleared)'});
    cla(ax); title(ax,'Plot'); xlabel(ax,'x'); ylabel(ax,'y'); grid(ax,'on');
    seed1=NaN; seed2=NaN; seedStage=0; clickStage=0;
    set(seedEdit,'String','(not set)');
  end

  function onSaveLog(~,~)
    lines = get(logBox,'String');
    if ischar(lines), lines = {lines}; end
    [fname, fpath] = uiputfile({'*.txt','Text file (*.txt)'},'Save log as');
    if isequal(fname,0), return; end
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
    try
      [logStr, plotData] = analyzeNumeric(params);
    catch ME
      errordlg(ME.message,'Analysis Error');
      return;
    end

    set(logBox,'String',strsplit(logStr,'\n')(:));

    cla(ax);
    if isempty(plotData.x)
      text(0.5,0.5,'No finite points to plot','Parent',ax,'HorizontalAlignment','center');
      return;
    end
    plt = plot(ax, plotData.x, plotData.f, '-');
    set(plt,'HitTest','off');          % allow axes to receive clicks
    set(ax,'ButtonDownFcn',@onAxesClick);
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
      plot(ax, plotData.t, plotData.x, '-'); grid(ax,'on');
      title(ax,'Free vibration response x(t)'); xlabel(ax,'t (s)'); ylabel(ax,'x (m)');
    else
      plot(ax, plotData.wgrid, plotData.Xgrid, '-'); hold(ax,'on');
      plot(ax, vib.w, out.X, 'ro'); hold(ax,'off'); grid(ax,'on');
      title(ax,'Forced steady-state amplitude X(omega)'); xlabel(ax,'omega'); ylabel(ax,'Amplitude');
    end
  end

  function onAxesClick(~,~)
    % Get click in data coordinates
    cp = get(ax,'CurrentPoint');
    xClick = cp(1,1);
    yClick = cp(1,2);

    % Ignore clicks outside current axes limits
    xl = xlim(ax); yl = ylim(ax);
    if ~(isfinite(xClick) && isfinite(yClick) && ...
         xClick >= xl(1) && xClick <= xl(2) && ...
         yClick >= yl(1) && yClick <= yl(2))
      return;
    end

    % Mouse button type
    btn = get(fig,'SelectionType');  % 'normal' (left), 'alt' (right), 'extend' (middle), 'open' (double)

    % --- Simple point plotting ---
    if strcmp(btn,'normal')
      addClickedPoint(xClick, yClick);   % left click -> add a point
    elseif strcmp(btn,'alt')
      clearClickedPoints();              % right click -> clear all points
    end

    % --- Preserve existing interval/seeds modes ---
    modeList = get(clickModePopup,'String');
    modeVal  = modeList{get(clickModePopup,'Value')};

    if strcmp(modeVal,'Set interval [a,b]')
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
        seed1 = xClick; seedStage = 1;
      else
        seed2 = xClick; seedStage = 0;
        if seed1 > seed2
          tmp=seed1; seed1=seed2; seed2=tmp;
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
    ok=false; msg=''; params=struct();
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
      msg = 'Interval must satisfy a < b (both numeric).'; return;
    end
    if ~isfinite(params.TOL) || params.TOL <= 0
      msg = 'TOL must be > 0.'; return;
    end
    if ~isfinite(params.MAXIT) || params.MAXIT <= 0
      msg = 'MAXIT must be a positive integer.'; return;
    end
    if ~isfinite(params.GRIDN) || params.GRIDN <= 10
      msg = 'GRIDN must be > 10.'; return;
    end
    ok=true;
  end

  function [ok, vib, msg] = readVibParams()
    ok=false; msg=''; vib=struct();
    modeList = get(vibModePopup,'String');
    vib.mode = modeList{get(vibModePopup,'Value')};
    vib.m = str2double(get(mEdit,'String'));
    vib.c = str2double(get(cEdit,'String'));
    vib.k = str2double(get(kEdit,'String'));
    vib.x0 = str2double(get(x0Edit,'String'));
    vib.v0 = str2double(get(v0Edit,'String'));
    vib.F0 = str2double(get(F0Edit,'String'));
    vib.w = str2double(get(wEdit,'String'));
    vib.tEnd = str2double(get(tEndEdit,'String'));

    if ~isfinite(vib.m) || vib.m <= 0
      msg='Mass m must be > 0.'; return;
    end
    if ~isfinite(vib.k) || vib.k <= 0
      msg='Stiffness k must be > 0.'; return;
    end
    if ~isfinite(vib.c) || vib.c < 0
      msg='Damping c must be >= 0.'; return;
    end
    if ~isfinite(vib.tEnd) || vib.tEnd <= 0
      msg='tEnd must be > 0.'; return;
    end
    ok=true;
  end

end

% ------------------- Core numeric analysis (no symbolic) -------------------
function [logStr, plotData] = analyzeNumeric(p)
  lines = {};
  add = @(s) assignin('caller','lines',[evalin('caller','lines'); {s}]);

  expr = sanitizeFuncString(p.fStr);
  f = makeFunc(expr);

  add('=== Function f(x) (numeric) ===');
  add(expr);

  % Numeric derivative handle (central difference)
  fp = @(x) fd1(f, x);

  % 1) Factorization attempt
  add('');
  add('1) Factorization attempt:');
  add('  (symbolic not available in this Octave build)');

  % 2) Shifted representation
  add('');
  add('2) Shifted representation:');
  add('  (symbolic not available; using numeric evaluation only)');

  % 3) IVT scan + refined bisection
  a = p.a; b = p.b; N = p.GRIDN;
  add('');
  add(sprintf('3) IVT scan on [%g,%g] and refined bisection:', a, b));

  X = linspace(a,b,N+1);
  F = arrayfun(@(z) safeEval(f,z), X);

  finitePair = isfinite(F(1:end-1)) & isfinite(F(2:end));
  signChangeIdx = find(finitePair & (F(1:end-1).*F(2:end) < 0));

  brackets = [];
  for k = signChangeIdx(:).'
    brackets(end+1,:) = [X(k), X(k+1)];
  end

  if isempty(brackets)
    add('  No sign-change brackets detected.');
  else
    add(sprintf('  Detected %d bracket(s):', rows(brackets)));
    add(mat2str(brackets,4));
  end

  bestBracket = [];
  bisectionRoot = NaN;
  if ~isempty(brackets)
    left = brackets(1,1); right = brackets(1,2);
    for iter=1:20
      mid = 0.5*(left+right);
      fm = safeEval(f, mid);
      fl = safeEval(f, left);
      if ~isfinite(fm) || ~isfinite(fl)
        break;
      end
      if fm == 0
        left=mid; right=mid; break;
      end
      if fl*fm < 0
        right = mid;
      else
        left = mid;
      end
      if abs(right-left) < 10*p.TOL
        break;
      end
    end
    bestBracket = [left,right];
    bisectionRoot = mid;
    add(sprintf('  Refined bracket: [%.12g, %.12g]', left, right));
    add(sprintf('  Bisection root approx: c ≈ %.12g, f(c)=%.3e', mid, safeEval(f,mid)));
  end

  % 4) Secant pairs
  add('');
  add('4) Proposed Secant seed pairs (safer choices):');
  secantPairs = [];
  if ~isempty(bestBracket)
    secantPairs(end+1,:) = bestBracket;
    add(sprintf('  - Bracket endpoints: [%.6g, %.6g]', bestBracket(1), bestBracket(2)));
  end
  if isfield(p,'userSeeds') && numel(p.userSeeds)==2 && all(isfinite(p.userSeeds)) && p.userSeeds(1) ~= p.userSeeds(2)
    secantPairs(end+1,:) = sort(p.userSeeds);
  end
  [~,idx] = sort(abs(F));
  cand = unique(sort(X(idx(1:min(12,numel(X))))));
  for i=1:min(6,numel(cand)-1)
    secantPairs(end+1,:) = [cand(i), cand(i+1)];
  end
  if isempty(secantPairs)
    add('  No suggestions available.');
  else
    secantPairs = unique(sort(secantPairs,2),'rows');
    add(mat2str(secantPairs,6));
  end

  % 5) MVT derivative (numeric)
  add('');
  add(sprintf("5) Mean Value Theorem on [%g,%g]: find c with f'(c) = (f(b)-f(a))/(b-a)", a, b));
  slope = (safeEval(f,b) - safeEval(f,a)) / (b-a);
  fun = @(z) fd1(f,z) - slope;
  MVT_c = NaN;
  try
    MVT_c = fzero(fun, 0.5*(a+b));
    if isfinite(MVT_c)
      add(sprintf('  MVT c ≈ %.6g', MVT_c));
    else
      add('  MVT numeric solve returned non-finite.');
    end
  catch
    add('  MVT computation failed (numeric solve).');
  end

  % 6) MVT integral average (numeric)
  add('');
  add(sprintf('6) MVT for integrals on [%g,%g] (average value):', a, b));
  avg_val = NaN;
  try
    avg_val = quad(@(z) safeEval(f,z), a, b) / (b-a);
    add(sprintf('  Average(f) = %g', avg_val));
    fun2 = @(z) safeEval(f,z) - avg_val;
    try
      c2 = fzero(fun2, 0.5*(a+b));
      add(sprintf('  c with f(c)=average ≈ %.6g', c2));
    catch
      add('  Could not locate c numerically (fzero failed).');
    end
  catch ME
    add(['  Integral step failed: ' ME.message]);
  end

  % 7) Taylor approx about x=0 using finite-difference derivatives
  add('');
  add('7) Taylor polynomials (numeric finite-diff) about x=0:');
  for n = p.taylorDegs
    coeffs = zeros(n+1,1);
    ok = true;
    for k=0:n
      try
        coeffs(k+1) = fdNth(f, 0, k) / factorial(k);
      catch
        ok=false; break;
      end
    end
    if ok
      add(sprintf('  Taylor degree %d coefficients (c0..c%d):', n, n));
      add(['    ' mat2str(coeffs.',6)]);
    else
      add(sprintf('  Taylor degree %d: (failed near x=0; possible singularity)', n));
    end
  end

  % 8) Newton + Secant iterations (shift mode)
  add('');
  add('8) Iterations: Newton & Secant');

  xN = NaN;
  if p.SHIFT_TO_ZERO
    c0 = 0.5*(a+b);
    if ~isempty(bestBracket), c0 = mean(bestBracket); end
    add(sprintf('*** Shift-to-zero mode: y = x - c, with c = %.12g ***', c0));
    g  = @(y) safeEval(f, y + c0);
    gp = @(y) fd1(f, y + c0);

    y = 0.5*(a+b) - c0;
    if ~isempty(bestBracket), y = mean(bestBracket) - c0; end

    add('-- Newton (y-space) --');
    for k=1:p.MAXIT
      d = gp(y);
      if ~isfinite(d) || d==0
        add(sprintf('  Breakdown at iter %d (g''=0/NaN).', k));
        break;
      end
      y1 = y - g(y)/d;
      add(sprintf('  k=%3d: y=%.12g  |g(y)|=%.3e', k, y1, abs(g(y1))));
      y = y1;
      if abs(g(y)) < p.TOL
        break;
      end
    end
    xN = y + c0;
    add(sprintf('Newton result: x ≈ %.12g, f(x)=%.3e', xN, safeEval(f,xN)));

    add('-- Secant (y-space) --');
    for pidx=1:rows(secantPairs)
      y0 = secantPairs(pidx,1) - c0;
      y1 = secantPairs(pidx,2) - c0;
      add(sprintf('  Pair %d: y0=%.12g, y1=%.12g', pidx, y0, y1));
      yp=y0; yc=y1;
      for k=1:p.MAXIT
        fpv = g(yp); fcv = g(yc);
        denom = fcv - fpv;
        if ~isfinite(denom) || denom==0
          add(sprintf('    Breakdown at step %d (denom=0).', k));
          break;
        end
        yn = yc - fcv*(yc-yp)/denom;
        add(sprintf('    k=%3d: y=%.12g  |g(y)|=%.3e', k, yn, abs(g(yn))));
        if abs(g(yn)) < p.TOL
          yc = yn;
          break;
        end
        yp = yc; yc = yn;
      end
      add(sprintf('  Secant result: x ≈ %.12g, f(x)=%.3e', yc+c0, safeEval(f,yc+c0)));
    end
  else
    add('  x-space mode not implemented in this minimal no-symbolic port.');
  end

  plotMask = isfinite(F);
  plotData = struct('x', X(plotMask), 'f', F(plotMask));
  logStr = strjoin(lines,'\n');
end

function fh = makeFunc(expr)
  % Attempt to create a vectorized function handle from an expression string
  expr = strtrim(expr);
  % If user already provided @(x) ...
  if startsWith(expr,'@')
    fh = str2func(expr);
    return;
  end
  % Vectorize common operators
  try
    exprV = vectorize(expr);
  catch
    exprV = expr;
    exprV = strrep(exprV,'^','.^');
    exprV = strrep(exprV,'*','.*');
    exprV = strrep(exprV,'/','./');
  end
  fh = str2func(['@(x) ' exprV]);
  % quick sanity check
  y = fh(1.0);
  if ~isnumeric(y)
    error('Expression did not evaluate to numeric.');
  end
end

function d = fd1(f, x)
  h = 1e-6*(1+abs(x));
  d = (safeEval(f,x+h) - safeEval(f,x-h)) / (2*h);
end

function dk = fdNth(f, x0, n)
  % Very simple finite-difference derivative approximation
  if n==0
    dk = safeEval(f,x0);
    return;
  end
  h = 1e-4*(1+abs(x0));
  % Use recursive central differences
  dk = (fdNth(f,x0+h,n-1) - fdNth(f,x0-h,n-1)) / (2*h);
end

function y = safeEval(f, x)
  try
    y = f(x);
  catch
    y = NaN;
  end
end

function s = sanitizeFuncString(s)
  s = strtrim(s);
  s = regexprep(s,'^\s*f\s*\(\s*x\s*\)\s*=\s*','');
  s = regexprep(s,';\s*$','');
  s = strrep(s, char(8722), '-');
  s = regexprep(s,'\s+',' ');
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

function s = defaultFunc()
  % Use element-wise operators for maximum Octave reliability.
  s = '-20000 + 7000*((((1+x).^3 - 1) ./ (x.*(1+x).^3))) + 8000 ./ (1+x).^3';
end

