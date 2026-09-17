function NumericalAnalysisToolboxGUI_V2
% NumericalAnalysisToolboxGUI_V2
% V2 GUI: Function analyzer + starter vibrations + interactive plot clicking.
% Fixes:
% - Robust plot click coordinate acquisition (uses event.IntersectionPoint).
% - onPlotClick is a nested function (has access to ax and UI state).
% - No row collisions (click controls no longer overwrite TOL/MAXIT fields).
% - User-friendly uialert validation for common input errors.
%
% Requires: Symbolic Math Toolbox.
% Optional: hompackDenseZero.m on MATLAB path.

    % ---------------- UI ----------------
    fig = uifigure('Name','Numerical Analysis Toolbox GUI (V2)','Position',[100 100 1300 740]);
    gl = uigridlayout(fig,[1 2]);
    gl.ColumnWidth = {460,'1x'};

    left = uipanel(gl,'Title','Inputs');
    left.Layout.Row = 1; left.Layout.Column = 1;

    % Layout rows (scrollable when supported)
    lg = uigridlayout(left,[34 2]);
    lg.ColumnWidth = {150,'1x'};
    lg.RowHeight = repmat({22},1,34);
    lg.RowHeight{3} = 90;   % f(x) text area
    lg.RowHeight{16} = 26;  % buttons row 1
    lg.RowHeight{17} = 26;  % buttons row 2
    lg.RowHeight{18} = 10;  % spacer

    try
        lg.Scrollable = 'on';
    catch
        % older MATLAB: ignore
    end

    % --- Function input ---
    lblFx = uilabel(lg,'Text','f(x)=','HorizontalAlignment','right');
    lblFx.Layout.Row = 1; lblFx.Layout.Column = 1;
    fEdit = uitextarea(lg,'Value',defaultFunc(),'FontName','Consolas');
    fEdit.Layout.Row = 2; fEdit.Layout.Column = [1 2];

    % --- Interval ---
    lblA = uilabel(lg,'Text','a','HorizontalAlignment','right');
    lblA.Layout.Row = 4; lblA.Layout.Column = 1;
    aField = uieditfield(lg,'numeric','Value',1e-6);
    aField.Layout.Row = 4; aField.Layout.Column = 2;

    lblB = uilabel(lg,'Text','b','HorizontalAlignment','right');
    lblB.Layout.Row = 5; lblB.Layout.Column = 1;
    bField = uieditfield(lg,'numeric','Value',2);
    bField.Layout.Row = 5; bField.Layout.Column = 2;

    % --- Plot click controls ---
    lblClick = uilabel(lg,'Text','Plot click mode','HorizontalAlignment','right');
    lblClick.Layout.Row = 6; lblClick.Layout.Column = 1;
    clickMode = uidropdown(lg,'Items',{'Off','Set interval [a,b]','Pick Secant seeds'},...
                               'Value','Set interval [a,b]');
    clickMode.Layout.Row = 6; clickMode.Layout.Column = 2;

    lblSeeds = uilabel(lg,'Text','Secant seeds','HorizontalAlignment','right');
    lblSeeds.Layout.Row = 7; lblSeeds.Layout.Column = 1;
    seedField = uieditfield(lg,'text','Value','(not set)','Editable','off');
    seedField.Layout.Row = 7; seedField.Layout.Column = 2;

    % --- Iteration settings ---
    lblT = uilabel(lg,'Text','TOL','HorizontalAlignment','right');
    lblT.Layout.Row = 8; lblT.Layout.Column = 1;
    tolField = uieditfield(lg,'numeric','Value',1e-6);
    tolField.Layout.Row = 8; tolField.Layout.Column = 2;

    lblM = uilabel(lg,'Text','MAXIT','HorizontalAlignment','right');
    lblM.Layout.Row = 9; lblM.Layout.Column = 1;
    maxitField = uieditfield(lg,'numeric','Value',200);
    maxitField.Layout.Row = 9; maxitField.Layout.Column = 2;

    lblG = uilabel(lg,'Text','GRIDN','HorizontalAlignment','right');
    lblG.Layout.Row = 10; lblG.Layout.Column = 1;
    gridnField = uieditfield(lg,'numeric','Value',400);
    gridnField.Layout.Row = 10; gridnField.Layout.Column = 2;

    % Shift toggle
    lblS = uilabel(lg,'Text','Shift-to-zero','HorizontalAlignment','right');
    lblS.Layout.Row = 11; lblS.Layout.Column = 1;
    shiftChk = uicheckbox(lg,'Text','y=x-c','Value',true);
    shiftChk.Layout.Row = 11; shiftChk.Layout.Column = 2;

    % Taylor degrees
    lblD = uilabel(lg,'Text','Taylor degs','HorizontalAlignment','right');
    lblD.Layout.Row = 12; lblD.Layout.Column = 1;
    degField = uieditfield(lg,'text','Value','2,5');
    degField.Layout.Row = 12; degField.Layout.Column = 2;

    % Homotopy options
    lblH0 = uilabel(lg,'Text','Homotopy h0','HorizontalAlignment','right');
    lblH0.Layout.Row = 13; lblH0.Layout.Column = 1;
    h0Field = uieditfield(lg,'numeric','Value',0.1);
    h0Field.Layout.Row = 13; h0Field.Layout.Column = 2;

    lblHx = uilabel(lg,'Text','Homotopy hMax','HorizontalAlignment','right');
    lblHx.Layout.Row = 14; lblHx.Layout.Column = 1;
    hmaxField = uieditfield(lg,'numeric','Value',0.5);
    hmaxField.Layout.Row = 14; hmaxField.Layout.Column = 2;

    lblHs = uilabel(lg,'Text','Homotopy steps','HorizontalAlignment','right');
    lblHs.Layout.Row = 15; lblHs.Layout.Column = 1;
    hstepsField = uieditfield(lg,'numeric','Value',2000);
    hstepsField.Layout.Row = 15; hstepsField.Layout.Column = 2;

    % Buttons
    runBtn = uibutton(lg,'Text','Run Analysis','ButtonPushedFcn',@onRun);
    runBtn.Layout.Row = 16; runBtn.Layout.Column = 1;
    saveBtn = uibutton(lg,'Text','Export summary.mat','ButtonPushedFcn',@onExport);
    saveBtn.Layout.Row = 16; saveBtn.Layout.Column = 2;

    clearBtn = uibutton(lg,'Text','Clear Output','ButtonPushedFcn',@onClear);
    clearBtn.Layout.Row = 17; clearBtn.Layout.Column = 1;
    vibBtn = uibutton(lg,'Text','Run Vibration','ButtonPushedFcn',@onVibRun);
    vibBtn.Layout.Row = 17; vibBtn.Layout.Column = 2;

    % spacer row 18

    % ---------------- VIBRATIONS (SDOF) ----------------
    vibTitle = uilabel(lg,'Text','Vibrations (SDOF)','FontWeight','bold');
    vibTitle.Layout.Row = 19; vibTitle.Layout.Column = [1 2];

    lblMode = uilabel(lg,'Text','Mode','HorizontalAlignment','right');
    lblMode.Layout.Row = 20; lblMode.Layout.Column = 1;
    modeDrop = uidropdown(lg,'Items',{'Free response','Forced steady-state'},'Value','Free response');
    modeDrop.Layout.Row = 20; modeDrop.Layout.Column = 2;

    lblm = uilabel(lg,'Text','m (kg)','HorizontalAlignment','right');
    lblm.Layout.Row = 21; lblm.Layout.Column = 1;
    mField = uieditfield(lg,'numeric','Value',1);
    mField.Layout.Row = 21; mField.Layout.Column = 2;

    lblc = uilabel(lg,'Text','c (N*s/m)','HorizontalAlignment','right');
    lblc.Layout.Row = 22; lblc.Layout.Column = 1;
    cField = uieditfield(lg,'numeric','Value',0.2);
    cField.Layout.Row = 22; cField.Layout.Column = 2;

    lblk = uilabel(lg,'Text','k (N/m)','HorizontalAlignment','right');
    lblk.Layout.Row = 23; lblk.Layout.Column = 1;
    kField = uieditfield(lg,'numeric','Value',20);
    kField.Layout.Row = 23; kField.Layout.Column = 2;

    lblx0 = uilabel(lg,'Text','x0 (m)','HorizontalAlignment','right');
    lblx0.Layout.Row = 24; lblx0.Layout.Column = 1;
    x0Field = uieditfield(lg,'numeric','Value',0.1);
    x0Field.Layout.Row = 24; x0Field.Layout.Column = 2;

    lblv0 = uilabel(lg,'Text','v0 (m/s)','HorizontalAlignment','right');
    lblv0.Layout.Row = 25; lblv0.Layout.Column = 1;
    v0Field = uieditfield(lg,'numeric','Value',0);
    v0Field.Layout.Row = 25; v0Field.Layout.Column = 2;

    lblF0 = uilabel(lg,'Text','F0 (N)','HorizontalAlignment','right');
    lblF0.Layout.Row = 26; lblF0.Layout.Column = 1;
    F0Field = uieditfield(lg,'numeric','Value',1);
    F0Field.Layout.Row = 26; F0Field.Layout.Column = 2;

    lblw = uilabel(lg,'Text','omega (rad/s)','HorizontalAlignment','right');
    lblw.Layout.Row = 27; lblw.Layout.Column = 1;
    wField = uieditfield(lg,'numeric','Value',2);
    wField.Layout.Row = 27; wField.Layout.Column = 2;

    lblTend = uilabel(lg,'Text','tEnd (s)','HorizontalAlignment','right');
    lblTend.Layout.Row = 28; lblTend.Layout.Column = 1;
    tEndField = uieditfield(lg,'numeric','Value',20);
    tEndField.Layout.Row = 28; tEndField.Layout.Column = 2;

    % ---------------- Output panel ----------------
    right = uipanel(gl,'Title','Output');
    right.Layout.Row = 1; right.Layout.Column = 2;
    rg = uigridlayout(right,[2 1]);
    rg.RowHeight = {'1x',260};

    outBox = uitextarea(rg,'Editable','off','FontName','Consolas');
    outBox.Layout.Row = 1;

    ax = uiaxes(rg);
    ax.Layout.Row = 2;
    title(ax,'Plot'); xlabel(ax,'x'); ylabel(ax,'y');

    % Enable zoom/pan if supported
    try
        ax.Interactions = [zoomInteraction panInteraction];
    catch
    end

    % store latest summary
    latestSummary = [];

    % --- Plot-click state ---
    clickStage = 0;    % 0 first click, 1 second click
    seedStage  = 0;
    seed1 = NaN; seed2 = NaN;
    hA = []; hB = []; hS1 = []; hS2 = [];

    % ---------------- callbacks ----------------
    function onRun(~,~)
        % Validate interval
        if ~(aField.Value < bField.Value)
            uialert(fig,'Interval must satisfy a < b.','Input error');
            return;
        end
        if tolField.Value <= 0
            uialert(fig,'TOL must be > 0.','Input error');
            return;
        end
        if maxitField.Value <= 0
            uialert(fig,'MAXIT must be > 0.','Input error');
            return;
        end

        try
            params = struct();
            params.fStr = strjoin(fEdit.Value,' ');
            params.a = aField.Value;
            params.b = bField.Value;
            params.TOL = tolField.Value;
            params.MAXIT = round(maxitField.Value);
            params.GRIDN = round(gridnField.Value);
            params.SHIFT_TO_ZERO = logical(shiftChk.Value);
            params.taylorDegs = parseDegs(degField.Value);
            params.hopts = struct('h0',h0Field.Value,'hMin',1e-10,'hMax',hmaxField.Value, ...
                                 'newtonTol',params.TOL,'newtonMax',min(25,params.MAXIT), ...
                                 'maxSteps',round(hstepsField.Value),'verbose',1,'lambdaTol',1e-10);

            % pass user-chosen seeds if available
            params.userSeeds = [seed1 seed2];

            [logStr, summary, plotData] = runAnalysis(params);
            outBox.Value = splitlines(string(logStr));
            latestSummary = summary;

            cla(ax);
            if ~isempty(plotData.x)
                plt = plot(ax, plotData.x, plotData.f, '-', 'LineWidth', 1.2);
                grid(ax,'on');
                title(ax,'f(x) on [a,b] (finite values)');
                xlabel(ax,'x'); ylabel(ax,'f(x)');

                % Make line clickable
                plt.HitTest = 'on';
                try, plt.PickableParts = 'all'; catch, end
                plt.ButtonDownFcn = @onPlotClick;

                % Re-draw any existing markers
                redrawMarkers();
            else
                text(ax,0.5,0.5,'No finite points to plot','HorizontalAlignment','center');
            end
        catch ME
            uialert(fig, ME.message, 'Run Analysis Error');
            outBox.Value = splitlines(string(getReport(ME,'extended','hyperlinks','off')));
        end
    end

    function onPlotClick(~, event)
        % Robust x extraction across MATLAB versions
        xClick = NaN;
        try
            if isprop(event,'IntersectionPoint') && ~isempty(event.IntersectionPoint)
                xClick = event.IntersectionPoint(1);
            end
        catch
        end
        if ~isfinite(xClick)
            % fallback (some versions): use CurrentPoint if present
            try
                cp = ax.CurrentPoint;
                xClick = cp(1,1);
            catch
                % can't read click
                return
            end
        end

        if ~isfinite(xClick)
            return;
        end

        switch clickMode.Value
            case 'Off'
                return

            case 'Set interval [a,b]'
                if clickStage == 0
                    aField.Value = xClick;
                    clickStage = 1;
                else
                    bField.Value = xClick;
                    clickStage = 0;
                    if aField.Value > bField.Value
                        tmp = aField.Value; aField.Value = bField.Value; bField.Value = tmp;
                    end
                end
                redrawMarkers();

            case 'Pick Secant seeds'
                if seedStage == 0
                    seed1 = xClick;
                    seedStage = 1;
                else
                    seed2 = xClick;
                    seedStage = 0;
                    if seed1 > seed2
                        tmp = seed1; seed1 = seed2; seed2 = tmp;
                    end
                    seedField.Value = sprintf('[%.12g, %.12g]', seed1, seed2);
                end
                redrawMarkers();
        end
    end

    function redrawMarkers()
        % Clear old markers
        if isgraphics(hA), delete(hA); end
        if isgraphics(hB), delete(hB); end
        if isgraphics(hS1), delete(hS1); end
        if isgraphics(hS2), delete(hS2); end
        hA=[]; hB=[]; hS1=[]; hS2=[];

        % Interval markers
        try
            hA = xline(ax, aField.Value, '--g', 'a');
            hB = xline(ax, bField.Value, '--m', 'b');
        catch
        end

        % Seed markers
        if isfinite(seed1)
            try, hS1 = xline(ax, seed1, ':k', 'x0'); catch, end
        end
        if isfinite(seed2)
            try, hS2 = xline(ax, seed2, ':k', 'x1'); catch, end
        end
    end

    function onVibRun(~,~)
        % Friendly validation
        if mField.Value <= 0
            uialert(fig,'Error: Mass (m) must be > 0.','Vibration input error');
            return;
        end
        if kField.Value <= 0
            uialert(fig,'Error: Stiffness (k) must be > 0.','Vibration input error');
            return;
        end
        if cField.Value < 0
            uialert(fig,'Error: Damping (c) must be ≥ 0.','Vibration input error');
            return;
        end

        try
            vib = struct();
            vib.mode = modeDrop.Value;
            vib.m = mField.Value;
            vib.c = cField.Value;
            vib.k = kField.Value;
            vib.x0 = x0Field.Value;
            vib.v0 = v0Field.Value;
            vib.F0 = F0Field.Value;
            vib.w  = wField.Value;
            vib.tEnd = tEndField.Value;

            [logV, vibOut, plotV] = runVibration(vib);
            outBox.Value = [outBox.Value; ""; "=== VIBRATIONS OUTPUT ==="; splitlines(string(logV))];

            cla(ax);
            if strcmp(vib.mode,'Free response')
                plot(ax, plotV.t, plotV.x, 'LineWidth', 1.2);
                grid(ax,'on');
                title(ax,'Free vibration response x(t)');
                xlabel(ax,'t (s)'); ylabel(ax,'x (m)');
            else
                plot(ax, plotV.wgrid, plotV.Xgrid, '-', 'LineWidth', 1.2); hold(ax,'on');
                plot(ax, vib.w, vibOut.X, 'ro', 'MarkerSize', 7, 'LineWidth', 1.5);
                grid(ax,'on'); hold(ax,'off');
                title(ax,'Forced steady-state amplitude X(\omega)');
                xlabel(ax,'\omega (rad/s)'); ylabel(ax,'Amplitude (m)');
            end

            if isempty(latestSummary)
                latestSummary = struct();
            end
            latestSummary.vibration = vibOut;

        catch ME
            uialert(fig, ME.message, 'Vibration Error');
        end
    end

    function onExport(~,~)
        if isempty(latestSummary)
            uialert(fig,'Nothing to export. Run analysis or vibration first.','Export');
            return;
        end
        [file, path] = uiputfile('summary.mat','Save summary as');
        if isequal(file,0), return; end
        summary = latestSummary; %#ok<NASGU>
        save(fullfile(path,file),'summary');
        uialert(fig,'Saved summary.mat','Export');
    end

    function onClear(~,~)
        outBox.Value = "";
        cla(ax);
        seed1 = NaN; seed2 = NaN;
        seedStage = 0; clickStage = 0;
        seedField.Value = '(not set)';
        if isgraphics(hA), delete(hA); end
        if isgraphics(hB), delete(hB); end
        if isgraphics(hS1), delete(hS1); end
        if isgraphics(hS2), delete(hS2); end
        hA=[]; hB=[]; hS1=[]; hS2=[];
    end

end

% =================== core analysis ===================
function [logStr, summary, plotData] = runAnalysis(p)
    L = strings(0,1);
    add = @(s) assignin('caller','L',[evalin('caller','L'); string(s)]);

    syms x

    fStrClean = sanitizeFuncString(p.fStr);
    try
        f_sym = str2sym(fStrClean);
    catch ME
        error(['Could not parse f(x). Check parentheses and MATLAB syntax.\n' ...
               'Example: -20000 + 7000*(((1+x)^3-1)/(x*(1+x)^3)) + 8000/(1+x)^3\n\n' ...
               'Parser said: ' ME.message]);
    end

    add("=== Function f(x) ===");
    add(char(f_sym));
    f_num = matlabFunction(f_sym,'Vars',x);

    fp_sym = [];
    fp_num = [];
    try
        fp_sym = diff(f_sym,x);
        add("\nf'(x):");
        add(char(fp_sym));
        fp_num = matlabFunction(fp_sym,'Vars',x);
    catch
        add("\nCould not obtain f'(x) symbolically.");
    end

    add("\n\n1) Factorization attempt:");
    try
        add(char(factor(f_sym)));
    catch
        add("Factorization failed or not simpler.");
    end

    a = p.a; b = p.b; GRIDN = p.GRIDN;
    add(sprintf("\n\n3) IVT scan on [%g,%g] and refined bisection:",a,b));
    Xgrid = linspace(a,b,GRIDN+1);
    Fgrid = arrayfun(@(z) safeEval(f_num,z), Xgrid);
    finitePair = isfinite(Fgrid(1:end-1)) & isfinite(Fgrid(2:end));
    signChangeIdx = find(finitePair & (Fgrid(1:end-1).*Fgrid(2:end) < 0));

    brackets = [];
    for k = signChangeIdx(:).'
        brackets(end+1,:) = [Xgrid(k), Xgrid(k+1)]; %#ok<AGROW>
    end

    if isempty(brackets)
        add(sprintf("  No sign-change brackets on [%g,%g].",a,b));
    else
        add(sprintf("  Detected %d bracket(s):",size(brackets,1)));
        add(mat2str(brackets,6));
    end

    bestBracket = [];
    bisectionRoot = NaN;
    if ~isempty(brackets)
        left = brackets(1,1); right = brackets(1,2);
        mid = NaN;
        for iter = 1:12
            mid = 0.5*(left+right);
            fm = safeEval(f_num,mid);
            if fm == 0
                left = mid; right = mid; break;
            end
            fl = safeEval(f_num,left);
            if isfinite(fl) && isfinite(fm) && fl*fm < 0
                right = mid;
            else
                left = mid;
            end
        end
        bestBracket = [left,right];
        bisectionRoot = mid;
        add(sprintf("  Refined bracket: [%.12g, %.12g]",bestBracket(1),bestBracket(2)));
        add(sprintf("  Bisection root approx: c ≈ %.12g, f(c)=%.3e",mid,safeEval(f_num,mid)));
    end

    add("\n4) Proposed Secant seed pairs (safer choices):");
    secantPairs = [];
    if ~isempty(bestBracket)
        secantPairs(end+1,:) = bestBracket; %#ok<AGROW>
    end
    K = 6;
    [~, idxSort] = sort(abs(Fgrid));
    cand = unique(sort(Xgrid(idxSort(1:min(2*K,numel(Xgrid))))));
    for i = 1:min(K-1, numel(cand)-1)
        secantPairs(end+1,:) = [cand(i), cand(i+1)]; %#ok<AGROW>
    end
    if ~isempty(bestBracket)
        m = mean(bestBracket);
        eps0 = 0.05*max(1,abs(m));
        secantPairs(end+1,:) = [m-eps0, m+eps0]; %#ok<AGROW>
    end

    % Inject user-picked secant seeds if provided
    if isfield(p,'userSeeds') && numel(p.userSeeds)==2 && all(isfinite(p.userSeeds)) && p.userSeeds(1) ~= p.userSeeds(2)
        secantPairs = [p.userSeeds; secantPairs];
    end

    if isempty(secantPairs)
        add("  No suggestions available.");
    else
        secantPairs = unique(sort(secantPairs,2),'rows');
        add(mat2str(secantPairs,6));
    end

    % Iterations (kept minimal here; your earlier full pipeline can be swapped in)
    TOL = p.TOL; MAXIT = p.MAXIT;
    add("\n8) Iterations: Newton & Secant");

    xN = NaN; xN_prev = NaN;
    if p.SHIFT_TO_ZERO && ~isempty(fp_num)
        c0 = 0.5*(a+b);
        if ~isempty(bestBracket), c0 = mean(bestBracket); end
        g_num = @(y) safeEval(f_num,y+c0);
        gp_num = @(y) safeEval(fp_num,y+c0);
        y = 0.5*(a+b)-c0; y_prev = NaN;
        for k=1:MAXIT
            d = gp_num(y);
            if ~isfinite(d) || d==0, break; end
            y1 = y - g_num(y)/d;
            y_prev = y;
            if abs(g_num(y1)) < TOL
                y = y1; break
            end
            y = y1;
        end
        xN = y + c0;
        xN_prev = y_prev + c0;
        add(sprintf("Newton result: x ≈ %.12g, |f|=%.3e", xN, abs(safeEval(f_num,xN))));
    end

    % Homotopy (optional)
    add("\n9) HOMPACK-like dense homotopy continuation solve for f(x)=0");
    a0 = 0.5*(a+b);
    if ~isempty(bestBracket), a0 = mean(bestBracket); end

    hopts = p.hopts;
    if isempty(fp_num)
        JH = @(z) reshape(fdDiffScalar(@(u) safeEval(f_num,u), z), 1, 1);
    else
        JH = @(z) reshape(safeEval(fp_num,z),1,1);
    end

    homotopyInfo = struct('a0',a0);
    if exist('hompackDenseZero','file') == 2
        try
            [xH, infoH] = hompackDenseZero(@(z) safeEval(f_num,z), JH, a0, hopts);
            homotopyInfo.x = xH;
            homotopyInfo.info = infoH;
            add(sprintf("  Homotopy result: flag=%d, lambda=%.6f, x≈%.12g, |f|=%.3e", infoH.flag, infoH.lambda, xH, abs(safeEval(f_num,xH))));
        catch ME
            add("  Homotopy call failed: " + string(ME.message));
        end
    else
        add("  hompackDenseZero.m not found; skipping homotopy.");
    end

    summary = struct();
    summary.f_sym = f_sym;
    summary.interval = [a b];
    summary.brackets = brackets;
    summary.refinedBracket = bestBracket;
    summary.bisectionRoot = bisectionRoot;
    summary.secantPairs = secantPairs;
    summary.newtonRoot = xN;
    summary.newtonPrev = xN_prev;
    summary.homotopy = homotopyInfo;

    plotMask = isfinite(Fgrid);
    plotData.x = Xgrid(plotMask);
    plotData.f = Fgrid(plotMask);

    logStr = strjoin(L,newline);
end

% =================== utilities ===================
function degs = parseDegs(txt)
    if isstring(txt) || ischar(txt)
        s = char(txt);
    else
        s = strjoin(txt,' ');
    end
    s = regexprep(s,'[^0-9, ]','');
    parts = regexp(s,'[0-9]+','match');
    if isempty(parts)
        degs = [2 5];
    else
        degs = unique(cellfun(@str2double,parts));
    end
end

function y = safeEval(f, x)
    try
        y = f(x);
    catch
        y = NaN;
    end
end

function d = fdDiffScalar(F, x)
    h = 1e-8*(1+abs(x));
    d = (F(x+h) - F(x)) / h;
end

function s = sanitizeFuncString(s)
    s = strtrim(s);
    s = regexprep(s,'^\s*f\s*\(\s*x\s*\)\s*=\s*','');
    s = regexprep(s,'^\s*f_sym\s*=\s*','');
    s = regexprep(s,';\s*$','');
    s = strrep(s, char(8722), '-'); % unicode minus
    s = regexprep(s,'\s+',' ');
end

function val = defaultFunc()
    val = {'-20000 + 7000*(((1+x)^3 - 1)/(x*(1+x)^3)) + 8000/(1+x)^3'};
end

function [logStr, out, plotData] = runVibration(v)
    if v.m <= 0 || v.k <= 0
        error('m and k must be > 0.');
    end
    if v.c < 0
        error('c must be >= 0.');
    end

    wn = sqrt(v.k / v.m);
    z  = v.c / (2*sqrt(v.k*v.m));

    out = struct();
    out.m=v.m; out.c=v.c; out.k=v.k;
    out.wn=wn; out.zeta=z;

    L = strings(0,1);
    L(end+1) = sprintf('m=%.6g, c=%.6g, k=%.6g', v.m, v.c, v.k);
    L(end+1) = sprintf('wn=%.6g rad/s (fn=%.6g Hz)', wn, wn/(2*pi));
    L(end+1) = sprintf('zeta=%.6g', z);

    if strcmp(v.mode,'Free response')
        tEnd = max(0, v.tEnd);
        dt = max(1e-4, tEnd/2000);
        t = 0:dt:tEnd;

        if z < 1
            wd = wn*sqrt(1 - z^2);
            out.wd = wd;
            A = v.x0;
            B = (v.v0 + z*wn*v.x0)/wd;
            x = exp(-z*wn*t).*(A*cos(wd*t) + B*sin(wd*t));
            L(end+1) = sprintf('Underdamped: wd=%.6g rad/s', wd);
        elseif abs(z-1) < 1e-8
            x = (v.x0 + (v.v0 + wn*v.x0).*t).*exp(-wn*t);
            out.wd = NaN;
            L(end+1) = 'Critically damped.';
        else
            r1 = -wn*(z - sqrt(z^2-1));
            r2 = -wn*(z + sqrt(z^2-1));
            C1 = (v.v0 - r2*v.x0)/(r1 - r2);
            C2 = v.x0 - C1;
            x = C1*exp(r1*t) + C2*exp(r2*t);
            out.wd = NaN;
            L(end+1) = sprintf('Overdamped: r1=%.6g, r2=%.6g', r1, r2);
        end

        out.x0=v.x0; out.v0=v.v0; out.tEnd=tEnd;
        plotData = struct('t',t,'x',x);
        L(end+1) = sprintf('Peak |x| ≈ %.6g m', max(abs(x)));

    else
        w = v.w; F0=v.F0;
        denom = sqrt((v.k - v.m*w^2)^2 + (v.c*w)^2);
        X = F0 / denom;
        phi = atan2(v.c*w, v.k - v.m*w^2);
        out.F0=F0; out.w=w; out.X=X; out.phi=phi;

        L(end+1) = sprintf('Forced steady-state at w=%.6g rad/s', w);
        L(end+1) = sprintf('Amplitude X=%.6g m', X);
        L(end+1) = sprintf('Phase phi=%.6g rad (%.3g deg)', phi, phi*180/pi);

        wgrid = linspace(max(0,0.1*wn), 3*wn, 400);
        denomGrid = sqrt((v.k - v.m*wgrid.^2).^2 + (v.c*wgrid).^2);
        Xgrid = F0 ./ denomGrid;
        plotData = struct('wgrid',wgrid,'Xgrid',Xgrid);
    end

    logStr = strjoin(L,newline);
end

