clc; close all; clear;

%% Constants
count_per_mm = 160;
N_per_V      = 3.35;

%x1_mm = 18.2;
%x6_mm = 10.9;
Td    = 0.335333;

%% Damping / natural frequency from log decrement
delta = 0.700363;
zeta  = 0.110769;

wd = 18.804833;
wn = 18.922833;

%% --- Load data (ROBUST loader for your file format) ---
stepData = loadBracketMatrix('step.txt');
sin1     = loadBracketMatrix('sin data 1.txt');
sin2     = loadBracketMatrix('sin data 2.txt');
sin3     = loadBracketMatrix('sin data 3.txt');
imp      = loadBracketMatrix('impulse.txt');

%% Extract time and displacement (m)
t_step = stepData(:,2);
y_step = (stepData(:,3) / count_per_mm) / 1000;

t1 = sin1(:,2);  x1_exp = (sin1(:,3) / count_per_mm) / 1000;
t2 = sin2(:,2);  x2_exp = (sin2(:,3) / count_per_mm) / 1000;
t3 = sin3(:,2);  x3_exp = (sin3(:,3) / count_per_mm) / 1000;

t_imp = imp(:,2);
x_imp_exp = (imp(:,3) / count_per_mm) / 1000;

%% Trim step to <= 3 seconds  (FIXED <=)
keep   = (t_step <= 3);
t_step = t_step(keep);
y_step = y_step(keep);

%% Baseline correction (recommended)
% Step: reference displacement relative to initial value
y0_step = mean(y_step(1:min(10,end)));
y_step  = y_step - y0_step;

% Impulse: remove final offset (settled value)
x0_imp     = mean(x_imp_exp(max(1,end-20):end));
x_imp_exp  = x_imp_exp - x0_imp;

% Sin: remove DC offset (if any)
x1_exp = x1_exp - mean(x1_exp);
x2_exp = x2_exp - mean(x2_exp);
x3_exp = x3_exp - mean(x3_exp);

%% Identify parameters from step steady-state
F_step = 0.75 * N_per_V;   % N

% steady-state displacement (relative)
xss_exp = mean(y_step(max(1,end-20):end));

k = 383.445;
m = 1.081425;
c = 4.487617;

%% Inputs for impulse and sinusoidal forcing
J    = 0.05 * N_per_V;  % N*s
Fsin = 0.2 * N_per_V;  % N

w1 = wn/2;
w2 = wn;
w3 = 2*wn;

r1 = w1/wn;
r2 = w2/wn;
r3 = w3/wn;

%% Forced response magnitudes and phases
X1 = (Fsin/k) / sqrt((1-r1^2)^2 + (2*zeta*r1)^2);
X2 = (Fsin/k) / sqrt((1-r2^2)^2 + (2*zeta*r2)^2);
X3 = (Fsin/k) / sqrt((1-r3^2)^2 + (2*zeta*r3)^2);

phi1 = atan2(2*zeta*r1, 1-r1^2);
phi2 = atan2(2*zeta*r2, 1-r2^2);
phi3 = atan2(2*zeta*r3, 1-r3^2);

%% Choose transient constants to satisfy x(0)=0, xdot(0)=0
C11 = -X1*cos(phi1);
C12 = (zeta*wn*C11 - X1*w1*sin(phi1)) / wd;

C21 = -X2*cos(phi2);
C22 = (zeta*wn*C21 - X2*w2*sin(phi2)) / wd;

C31 = -X3*cos(phi3);
C32 = (zeta*wn*C31 - X3*w3*sin(phi3)) / wd;

%% Simulations
x1_sim = exp(-zeta*wn*t1).*(C11*cos(wd*t1) + C12*sin(wd*t1)) + X1*cos(w1*t1 - phi1);
x2_sim = exp(-zeta*wn*t2).*(C21*cos(wd*t2) + C22*sin(wd*t2)) + X2*cos(w2*t2 - phi2);
x3_sim = exp(-zeta*wn*t3).*(C31*cos(wd*t3) + C32*sin(wd*t3)) + X3*cos(w3*t3 - phi3);

x_imp_sim = (J/(m*wd)) * exp(-zeta*wn*t_imp) .* sin(wd*t_imp);

beta = zeta / sqrt(1 - zeta^2);
x_step_sim = xss_exp * (1 - exp(-zeta*wn*t_step) .* (cos(wd*t_step) + beta*sin(wd*t_step)));

%% ================= SECANT + GA LAG OPTIMIZATION (ALL 5) =================
maxLagSec = 0.10;      % same idea as your compareSignals max lag
lagGridN  = 383.445;       % resolution of correlation-vs-lag curve

% Secant settings (use >10 iterations)
secantMaxIter = 25;
secantTol     = 1e-6;

% GA-style settings (no toolbox)
gaPopSize     = 60;
gaGenerations = 50;
gaElite       = 5;
gaTournamentK = 3;
gaMutProb     = 0.25;
gaMutSigma    = 0.01;  % seconds
rng(7);

% Pack the 5 datasets (time, experimental, simulated)
D(1) = struct('name','Sin 1 (\omega=\omega_n/2)','t',t1,'yExp',x1_exp,'ySim',x1_sim);
D(2) = struct('name','Sin 2 (\omega=\omega_n)','t',t2,'yExp',x2_exp,'ySim',x2_sim);
D(3) = struct('name','Sin 3 (\omega=2\omega_n)','t',t3,'yExp',x3_exp,'ySim',x3_sim);
D(4) = struct('name','Impulse','t',t_imp,'yExp',x_imp_exp,'ySim',x_imp_sim);
D(5) = struct('name','Step','t',t_step,'yExp',y_step,'ySim',x_step_sim);

Results = repmat(struct(), numel(D), 1);

for i = 1:numel(D)
    t    = D(i).t(:);
    yExp = D(i).yExp(:);
    ySim = D(i).ySim(:);

    % Remove NaNs (safety)
    good = isfinite(t) & isfinite(yExp) & isfinite(ySim);
    t = t(good); yExp = yExp(good); ySim = ySim(good);

    % Raw correlation
    r0 = pearsonR(yExp, ySim);

    % Correlation vs lag curve
    lagGrid = linspace(-maxLagSec, maxLagSec, lagGridN);
    rGrid = zeros(size(lagGrid));
    for k = 1:numel(lagGrid)
        rGrid(k) = pearsonR(yExp, shiftByLag(t, ySim, lagGrid(k)));
    end

    % ---- Secant maximize correlation (solve dr/dtau = 0 near best peak)
    [tauSecant, secTauHist, secRHist] = secantMaximizeCorr(t, yExp, ySim, maxLagSec, lagGrid, rGrid, secantMaxIter, secantTol);
    ySecant = shiftByLag(t, ySim, tauSecant);
    rSecant = pearsonR(yExp, ySecant);

    % ---- GA maximize correlation (population search)
    [tauGA, bestR_byGen, bestTau_byGen] = gaMaximizeCorr(t, yExp, ySim, maxLagSec, gaPopSize, gaGenerations, gaElite, gaTournamentK, gaMutProb, gaMutSigma);
    yGA = shiftByLag(t, ySim, tauGA);
    rGA = pearsonR(yExp, yGA);

    % Save results
    Results(i).name = D(i).name;
    Results(i).t = t;
    Results(i).yExp = yExp;
    Results(i).ySim = ySim;

    Results(i).r0 = r0;
    Results(i).lagGrid = lagGrid;
    Results(i).rGrid = rGrid;

    Results(i).tauSecant = tauSecant;
    Results(i).ySecant = ySecant;
    Results(i).rSecant = rSecant;
    Results(i).secTauHist = secTauHist;
    Results(i).secRHist = secRHist;

    Results(i).tauGA = tauGA;
    Results(i).yGA = yGA;
    Results(i).rGA = rGA;
    Results(i).bestR_byGen = bestR_byGen;
    Results(i).bestTau_byGen = bestTau_byGen;
end

%% ===================== FIGURES: OVERLAY + SCATTERS =====================
for i = 1:numel(Results)
    R = Results(i);

    figure('Color','w');
    tiledlayout(2,3,'TileSpacing','compact','Padding','compact');

    % Time overlay across top
    ax = nexttile([1 3]);
    plot(R.t, R.yExp, 'b', 'LineWidth', 1.3); hold on
    plot(R.t, R.ySim, 'r--', 'LineWidth', 1.2);
    plot(R.t, R.ySecant, 'k:', 'LineWidth', 2.0);
    plot(R.t, R.yGA, 'm-.', 'LineWidth', 1.4);
    grid on; xlabel('Time (s)'); ylabel('Displacement (m)');
    title(['Alignment: ' R.name]);
    legend('Experimental','Sim raw','Sim secant','Sim GA','Location','best');

    txt = sprintf('raw r=%.3f | secant r=%.3f @ %+0.4fs | GA r=%.3f @ %+0.4fs', ...
        R.r0, R.rSecant, R.tauSecant, R.rGA, R.tauGA);
    text(ax, 0.02, 0.98, txt, 'Units','normalized', 'VerticalAlignment','top', ...
        'FontName','Consolas', 'FontSize',11, 'BackgroundColor','w', ...
        'EdgeColor',[0.2 0.2 0.2], 'Margin',6);

    % Scatter panels
    nexttile; scatterWithDiag(gca, R.yExp, R.ySim, sprintf('Raw (r=%.3f)', R.r0));
    nexttile; scatterWithDiag(gca, R.yExp, R.ySecant, sprintf('Secant (r=%.3f)', R.rSecant));
    nexttile; scatterWithDiag(gca, R.yExp, R.yGA, sprintf('GA (r=%.3f)', R.rGA));
end

%% ===================== FIGURES: SECANT STEPS + GA EVOLUTION =====================
for i = 1:numel(Results)
    R = Results(i);

    figure('Color','w');
    tiledlayout(1,2,'TileSpacing','compact','Padding','compact');

    % r(tau) curve + secant iterates
    nexttile;
    plot(R.lagGrid, R.rGrid, 'b', 'LineWidth', 1.5); hold on; grid on
    xlabel('Lag \tau (s)'); ylabel('Correlation r(\tau)');
    title(['r(\tau) + Secant iterates: ' R.name]);

    valid = isfinite(R.secTauHist) & isfinite(R.secRHist);
    plot(R.secTauHist(valid), R.secRHist(valid), 'ko-', 'LineWidth', 1.1, 'MarkerFaceColor','k');
    plot(R.tauSecant, R.rSecant, 'gp', 'MarkerSize', 12, 'MarkerFaceColor','g');
    legend('r(\tau)','secant steps','secant result','Location','best');

    % GA best r by generation
    nexttile;
    plot(1:numel(R.bestR_byGen), R.bestR_byGen, 'm-o', 'LineWidth', 1.2, 'MarkerSize', 4); grid on
    xlabel('Generation'); ylabel('Best correlation');
    title(['GA best r vs gen: ' R.name]);
end

%% (Optional) Print summary table
fprintf('\n===== Secant vs GA Lag Alignment Summary =====\n');
fprintf('%-22s | raw r | secant r @ tau | GA r @ tau\n', 'Dataset');
fprintf('%s\n', repmat('-',1,70));
for i = 1:numel(Results)
    R = Results(i);
    fprintf('%-22s | %+.3f | %+.3f @ %+0.4fs | %+.3f @ %+0.4fs\n', ...
        R.name, R.r0, R.rSecant, R.tauSecant, R.rGA, R.tauGA);
end

%% --- Similarity Metrics (Pearson + best-lag) ---
maxLagSec = 0.10;   % adjust if needed (0.05–0.20 typical)

M1 = compareSignals(t1,   x1_exp,    x1_sim,     maxLagSec, 'Sin \omega=\omega_n/2');
M2 = compareSignals(t2,   x2_exp,    x2_sim,     maxLagSec, 'Sin \omega=\omega_n');
M3 = compareSignals(t3,   x3_exp,    x3_sim,     maxLagSec, 'Sin \omega=2\omega_n');
Mi = compareSignals(t_imp,x_imp_exp, x_imp_sim,  maxLagSec, 'Impulse');
Ms = compareSignals(t_step,y_step,   x_step_sim, maxLagSec, 'Step');

%% Plots (with metrics on each visual)
figure
plot(t1, x1_exp, 'b', 'LineWidth', 1.2); hold on
plot(t1, x1_sim, 'r--', 'LineWidth', 1.5)
grid on; xlabel('Time (s)'); ylabel('Displacement (m)')
title('Sinusoidal Input, \omega = \omega_n / 2')
legend('Experimental','Simulated','Location','best')
addMetricsBox(gca, M1);

figure
plot(t2, x2_exp, 'b', 'LineWidth', 1.2); hold on
plot(t2, x2_sim, 'r--', 'LineWidth', 1.5)
grid on; xlabel('Time (s)'); ylabel('Displacement (m)')
title('Sinusoidal Input, \omega = \omega_n')
legend('Experimental','Simulated','Location','best')
addMetricsBox(gca, M2);

figure
plot(t3, x3_exp, 'b', 'LineWidth', 1.2); hold on
plot(t3, x3_sim, 'r--', 'LineWidth', 1.5)
grid on; xlabel('Time (s)'); ylabel('Displacement (m)')
title('Sinusoidal Input, \omega = 2\omega_n')
legend('Experimental','Simulated','Location','best')
addMetricsBox(gca, M3);

figure
plot(t_imp, x_imp_exp, 'b', 'LineWidth', 1.2); hold on
plot(t_imp, x_imp_sim, 'r--', 'LineWidth', 1.5)
grid on; xlabel('Time (s)'); ylabel('Displacement (m)')
title('Impulse Response')
legend('Experimental','Simulated','Location','best')
addMetricsBox(gca, Mi);

figure
plot(t_step, y_step, 'b', 'LineWidth', 1.2); hold on
plot(t_step, x_step_sim, 'r--', 'LineWidth', 1.5)
grid on; xlabel('Time (s)'); ylabel('Displacement (m)')
title('Step Response')
legend('Experimental','Simulated','Location','best')
addMetricsBox(gca, Ms);

%% Print results
fprintf('zeta = %.6f\n', zeta)
fprintf('wn   = %.6f rad/s\n', wn)
fprintf('wd   = %.6f rad/s\n', wd)
fprintf('k    = %.6f N/m\n', k)
fprintf('m    = %.6f kg\n', m)
fprintf('c    = %.6f N*s/m\n', c)
fprintf('Impulse magnitude J = %.6f N*s\n', J)
fprintf('Step steady-state displacement = %.6f m\n', xss_exp)
fprintf('Sin 1 amplitude ratio r = %.6f\n', r1)
fprintf('Sin 2 amplitude ratio r = %.6f\n', r2)
fprintf('Sin 3 amplitude ratio r = %.6f\n', r3)

%% ---------- Helper functions (must be at the end of the script) ----------
function A = loadBracketMatrix(filename)
    % Loads data stored like:
    %   Sample Time Encoder 1 Pos
    %   [ 0 0.000 15;
    %     1 0.009 66;
    %     ... ]
    txt = fileread(filename);

    tok = regexp(txt, '\[(.*)\]', 'tokens', 'once');
    if isempty(tok)
        error('Could not find bracketed matrix in "%s".', filename);
    end

    body = tok{1};
    body = strrep(body, ';', newline);
    body = strrep(body, ',', ' ');

    nums = sscanf(body, '%f');
    if mod(numel(nums), 3) ~= 0
        error('File "%s": expected 3 columns; got %d numbers.', filename, numel(nums));
    end

    A = reshape(nums, 3, []).';
end

function M = compareSignals(t, yExp, ySim, maxLagSec, label)
    t    = t(:);
    yExp = yExp(:);
    ySim = ySim(:);

    good = isfinite(t) & isfinite(yExp) & isfinite(ySim);
    t = t(good); yExp = yExp(good); ySim = ySim(good);

    % Pearson correlation at zero lag
    r0 = pearsonR(yExp, ySim);

    % Errors at zero lag
    rmse0 = sqrt(mean((yExp - ySim).^2));

    % best-lag search
    dt = median(diff(t));
    if dt <= 0 || ~isfinite(dt)
        dt = (t(end) - t(1)) / max(1, numel(t)-1);
    end

    maxLagSamples = max(1, round(maxLagSec / dt));
    lagVec = (-maxLagSamples:maxLagSamples) * dt;

    rBest = -Inf;
    lagBest = 0;
    yBest = ySim;

    for L = lagVec
        yShift = interp1(t, ySim, t + L, 'linear', 'extrap');
        r = pearsonR(yExp, yShift);
        if r > rBest
            rBest = r;
            lagBest = L;
            yBest = yShift;
        end
    end

    rmseBest = sqrt(mean((yExp - yBest).^2));

    M.label = label;
    M.r0 = r0;
    M.rBest = rBest;
    M.lagBest = lagBest;
    M.rmse0 = rmse0;
    M.rmseBest = rmseBest;
end

function r = pearsonR(x, y)
    x = x(:) - mean(x);
    y = y(:) - mean(y);
    denom = sqrt(sum(x.^2) * sum(y.^2));
    if denom < eps
        r = NaN;
    else
        r = (x' * y) / denom;
    end
end

function addMetricsBox(ax, M)
    % One-line compact overlay like:
    % r0=0.982 | best r=0.991 @ +0.012s

    txt = sprintf('r0=%.3f | best r=%.3f @ %+0.3fs', M.r0, M.rBest, M.lagBest);

    text(ax, 0.02, 0.98, txt, ...
        'Units','normalized', ...
        'HorizontalAlignment','left', ...
        'VerticalAlignment','top', ...
        'FontName','Consolas', ...
        'FontSize',11, ...
        'BackgroundColor','w', ...
        'EdgeColor',[0.2 0.2 0.2], ...
        'Margin',6);
end

function yShift = shiftByLag(t, y, tau)
    % yShift(t) = y(t + tau) using interpolation
    yShift = interp1(t, y, t + tau, 'linear', 'extrap');
end

function d = dCorr_dTau(t, yExp, ySim, tau)
    % Numerical derivative dr/dtau (central difference)
    h = 1e-3;  % seconds
    rP = pearsonR(yExp, shiftByLag(t, ySim, tau + h));
    rM = pearsonR(yExp, shiftByLag(t, ySim, tau - h));
    d = (rP - rM) / (2*h);
end

function [tauBest, tauHist, rHist] = secantMaximizeCorr(t, yExp, ySim, maxLagSec, lagGrid, rGrid, maxIter, tol)
    % Maximize r(tau) by solving dr/dtau=0 with secant, starting near best peak

    [~, idx] = max(rGrid);
    idxL = max(1, idx-1);
    idxR = min(numel(lagGrid), idx+1);

    tau_nm1 = lagGrid(idxL);
    tau_n   = lagGrid(idxR);

    f = @(tau) dCorr_dTau(t, yExp, ySim, tau);

    tauHist = nan(maxIter,1);
    rHist   = nan(maxIter,1);

    for k = 1:maxIter
        f_nm1 = f(tau_nm1);
        f_n   = f(tau_n);

        denom = (f_n - f_nm1);
        if abs(denom) < 1e-12
            break;
        end

        % Secant update (textbook):
        % tau_{n+1} = tau_n - f(tau_n)*(tau_n-tau_{n-1})/(f(tau_n)-f(tau_{n-1}))
        tau_np1 = tau_n - f_n * (tau_n - tau_nm1) / denom;

        % clamp
        tau_np1 = min(max(tau_np1, -maxLagSec), maxLagSec);

        tauHist(k) = tau_n;
        rHist(k)   = pearsonR(yExp, shiftByLag(t, ySim, tau_n));

        if abs(tau_np1 - tau_n) < tol
            tau_n = tau_np1;
            break;
        end

        tau_nm1 = tau_n;
        tau_n   = tau_np1;
    end

    tauBest = tau_n;
end

function [tauBest, bestR_byGen, bestTau_byGen] = gaMaximizeCorr(t, yExp, ySim, maxLagSec, popSize, generations, elite, tournamentK, mutProb, mutSigma)
    % Simple GA-style optimizer on tau in [-maxLagSec, +maxLagSec]
    pop = -maxLagSec + (2*maxLagSec)*rand(popSize,1);

    bestR_byGen = nan(generations,1);
    bestTau_byGen = nan(generations,1);

    for g = 1:generations
        rPop = zeros(popSize,1);
        for i = 1:popSize
            rPop(i) = pearsonR(yExp, shiftByLag(t, ySim, pop(i)));
        end

        [rSorted, idx] = sort(rPop, 'descend');
        popSorted = pop(idx);

        bestR_byGen(g) = rSorted(1);
        bestTau_byGen(g) = popSorted(1);

        % elitism
        newPop = popSorted(1:elite);

        % reproduction
        while numel(newPop) < popSize
            p1 = tournamentSelect(popSorted, rSorted, tournamentK);
            p2 = tournamentSelect(popSorted, rSorted, tournamentK);

            % crossover (blend)
            a = rand;
            child = a*p1 + (1-a)*p2;

            % mutation
            if rand < mutProb
                child = child + mutSigma*randn;
            end

            % clamp
            child = min(max(child, -maxLagSec), maxLagSec);

            newPop(end+1,1) = child; %#ok<AGROW>
        end

        pop = newPop;
    end

    tauBest = bestTau_byGen(end);
end

function parent = tournamentSelect(popSorted, rSorted, k)
    n = numel(popSorted);
    idx = randi(n, k, 1);
    [~, bestLocal] = max(rSorted(idx));
    parent = popSorted(idx(bestLocal));
end

function scatterWithDiag(ax, x, y, ttl)
    axes(ax); %#ok<LAXES>
    scatter(x, y, 8, 'filled'); grid on
    xlabel('Experimental'); ylabel('Simulated');
    title(ttl);

    mn = min([x; y]); mx = max([x; y]);
    hold on; plot([mn mx], [mn mx], 'k-', 'LineWidth', 1.2);
    axis tight;
end
