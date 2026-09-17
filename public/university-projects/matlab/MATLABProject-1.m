filepath = input("Enter file name: ",'s');
%filepath = "Sample Data 01.txt";

if ~isfile(filepath)
    error("notworking")

end

lines = readlines(filepath);

newlines = strtrim(lines);

testing = splitlines(newlines);

new_lines = strip(lines);



%cleanlines = [];

%for i =1:numel(new_lines)
    %indexVal = i;
    %appendIndex = strsplit(strip(new_lines(indexVal)));
    %cleanlines(end+1) = appendIndex;
%end

cleanlines = {}; % cannot use [] or string(0,1)
for i = 5:numel(new_lines)
    cleanlines{end+1} = strsplit(strip(new_lines(i)));   % this only works with {}
end


 


% header from line 3
headerZ = strsplit(strip(new_lines(3)));   % 1xN string array


% --- choose X and Y (insert here, after headerZ is defined) ----------
headerZ = string(headerZ);    % ensure string array
xIdx = showChoiceWindow(headerZ, 'Choose X');
if isempty(xIdx)
    error('No X selected'); % when you press cancel
end
yIdx = showChoiceWindow(headerZ, 'Choose Y');
if isempty(yIdx)
    error('No Y selected');
end
fprintf('Selected X: %s (index %d)\n', headerZ(xIdx), xIdx);
fprintf('Selected Y: %s (index %d)\n', headerZ(yIdx), yIdx);
% --------------------------------------------------------------------

equalAxis = questdlg('Use equal axis scaling (axis equal)?','Axis Scaling','Yes','No','No');
useAxisEqual = strcmp(equalAxis,'Yes');

endStartDot = questdlg('Mark the Beginning and the Ending points?','Marking Ends','Yes','No','No');
useSEDot = strcmp(endStartDot,'Yes');

engAns = questdlg('Enable engineering mode? Click on point(s) then press enter/return.','Engineering Mode','Yes','No','No');
engMode = strcmp(engAns,'Yes');







N = numel(headerZ);

% create N empty cell containers
columns = cell(1,N);
for c = 1:N
    columns{c} = {};   % each columns{c} collects values for column c
end

% iterate data lines (example: lines after header)
for i = 5:numel(new_lines)                 % adjust start index as needed
    tokens = strsplit(strip(new_lines(i)));% 1xM string array, M may vary
    for c = 1:N
        if c <= numel(tokens)
            columns{c}{end+1} = tokens(c); % append token to column c
        else
            columns{c}{end+1} = "";        % placeholder when missing
        end
    end
end

% optional: convert each column to a string column vector
for c = 1:N
    columns{c} = string(columns{c}).';    % make column vector (rows x 1)
end

% access: columns{3} is 3rd column vector; header names in headerZ(c)







hdrLineIndex = 3;
hdrTokens = strsplit(strip(lines(hdrLineIndex)));

function idx = showChoiceWindow(headerZ, winTitle)
    idx = [];
    f = uifigure('Name', winTitle, 'Position', [400 400 360 120], 'Resize','off');
    f.WindowStyle = 'modal';
    uilabel(f, 'Text', winTitle, 'Position', [15 76 200 20], 'FontWeight','bold');
    dd = uidropdown(f, 'Items', cellstr(headerZ), 'Value', headerZ(1), 'Position', [15 46 330 22]);
    uibutton(f, 'Text', 'Continue', 'Position', [200 10 140 28], 'ButtonPushedFcn', @(~,~) onContinue());
    uibutton(f, 'Text', 'Cancel', 'Position', [40 10 120 28], 'ButtonPushedFcn', @(~,~) onCancel());
    uiwait(f);
    function onContinue()
        val = string(dd.Value);
        k = find(headerZ == val, 1, 'first');
        if ~isempty(k), idx = k; else idx = []; end
        uiresume(f); delete(f);
    end
    function onCancel()
        idx = []; uiresume(f); delete(f);
    end
end

% Extract the selected X and Y data
xData = columns{xIdx};
yData = columns{yIdx};


changetoStrX = str2double(xData); %converts data to double

changetoStrY = str2double(yData);




% Create a scatter plot of the selected data

if useAxisEqual == 1 && useSEDot == 0 && engMode == 1
    fig = figure;
    plot(changetoStrX,changetoStrY,'b');
    grid on;
    axis equal;
    hold on;
    scatter(changetoStrX, changetoStrY);
    xlabel(headerZ(xIdx));
    ylabel(headerZ(yIdx));
    xv = changetoStrX(:); yv = changetoStrY(:); % all values after string double conversion
    xv = xv(~isnan(xv)); yv = yv(~isnan(yv)); % check if it is not a number
    xmin = min(xv); xmax = max(xv); ymin = min(yv); ymax = max(yv); % easily find min max in data set
    xr = xmax - xmin; yr = ymax - ymin; % subtraction bounds to find range for plot
    if xr==0, xr = abs(xmin)*0.1 + 1e-6; end % add 1e-6 to make sure it is not zero
    if yr==0, yr = abs(ymin)*0.1 + 1e-6; end
    pad = 0.10; xlim([xmin - xr*pad/2, xmax + xr*pad/2]); % scale and together is 10% larger
    ylim([ymin - yr*pad/2, ymax + yr*pad/2]); % set y and x lim
    title('Scatter Plot of Selected Data');

    % Use crosshair pointer and collect clicks until Enter
    set(fig,'Pointer','crosshair');       % shows crosshair cursor
    [xp, yp] = ginput();                  % no argument: collect until Enter/Return
    set(fig,'Pointer','arrow');           % restore pointer
    
    % Mark clicks on plot
    scatter(xp, yp, 80, 'r', 'filled');
    
    % Save to CSV
    if ~isempty(xp)
        fname = 'picked_points.csv';
        fid = fopen(fname,'w');
        fprintf(fid, 'x,y\n');                       % header
        fprintf(fid, '%.8f,%.8f\n', [xp(:)'; yp(:)']);
        fclose(fid);
        fprintf('Saved %d points to %s\n', numel(xp), fname);
    else
        disp('No points picked.');
    end
elseif useAxisEqual == 1 && useSEDot == 1 && engMode == 1
    fig = figure;
    plot(changetoStrX,changetoStrY,'b');
    grid on;
    axis equal;
    hold on;
    plot(changetoStrX(1), changetoStrY(1), 'g^', 'MarkerFaceColor', 'g', 'MarkerSize', 8); %'go' means green, circle
    plot(changetoStrX(end-1), changetoStrY(end-1),'ro', 'MarkerFaceColor', 'r', 'MarkerSize', 8)
    scatter(changetoStrX, changetoStrY);
    xlabel(headerZ(xIdx));
    ylabel(headerZ(yIdx));
    xv = changetoStrX(:); yv = changetoStrY(:); % all values after string double conversion
    xv = xv(~isnan(xv)); yv = yv(~isnan(yv)); % check if it is not a number
    xmin = min(xv); xmax = max(xv); ymin = min(yv); ymax = max(yv); % easily find min max in data set
    xr = xmax - xmin; yr = ymax - ymin; % subtraction bounds to find range for plot
    if xr==0, xr = abs(xmin)*0.1 + 1e-6; end % add 1e-6 to make sure it is not zero
    if yr==0, yr = abs(ymin)*0.1 + 1e-6; end
    pad = 0.10; xlim([xmin - xr*pad/2, xmax + xr*pad/2]); % scale and together is 10% larger
    ylim([ymin - yr*pad/2, ymax + yr*pad/2]); % set y and x lim
    title('Scatter Plot of Selected Data');

    % Use crosshair pointer and collect clicks until Enter
    set(fig,'Pointer','crosshair');       % shows crosshair cursor
    [xp, yp] = ginput();                  % no argument: collect until Enter/Return
    set(fig,'Pointer','arrow');           % restore pointer
    
    % Mark clicks on plot
    scatter(xp, yp, 80, 'r', 'filled');
    
    % Save to CSV
    if ~isempty(xp)
        fname = 'picked_points.csv';
        fid = fopen(fname,'w');
        fprintf(fid, 'x,y\n');                       % header
        fprintf(fid, '%.8f,%.8f\n', [xp(:)'; yp(:)']);
        fclose(fid);
        fprintf('Saved %d points to %s\n', numel(xp), fname);
    else
        disp('No points picked.');
    end

elseif useAxisEqual == 0 && useSEDot == 1 && engMode == 1
    fig = figure;
    plot(changetoStrX,changetoStrY,'b');
    grid on;
    hold on;
    plot(changetoStrX(1), changetoStrY(1), 'g^', 'MarkerFaceColor', 'g', 'MarkerSize', 8); %'go' means green, circle
    plot(changetoStrX(end-1), changetoStrY(end-1),'ro', 'MarkerFaceColor', 'r', 'MarkerSize', 8)
    scatter(changetoStrX, changetoStrY);
    xlabel(headerZ(xIdx));
    ylabel(headerZ(yIdx));
    xv = changetoStrX(:); yv = changetoStrY(:); % all values after string double conversion
    xv = xv(~isnan(xv)); yv = yv(~isnan(yv)); % check if it is not a number
    xmin = min(xv); xmax = max(xv); ymin = min(yv); ymax = max(yv); % easily find min max in data set
    xr = xmax - xmin; yr = ymax - ymin; % subtraction bounds to find range for plot
    if xr==0, xr = abs(xmin)*0.1 + 1e-6; end % add 1e-6 to make sure it is not zero
    if yr==0, yr = abs(ymin)*0.1 + 1e-6; end
    pad = 0.10; xlim([xmin - xr*pad/2, xmax + xr*pad/2]); % scale and together is 10% larger
    ylim([ymin - yr*pad/2, ymax + yr*pad/2]); % set y and x lim
    title('Scatter Plot of Selected Data');

    % Use crosshair pointer and collect clicks until Enter
    set(fig,'Pointer','crosshair');       % shows crosshair cursor
    [xp, yp] = ginput();                  % no argument: collect until Enter/Return
    set(fig,'Pointer','arrow');           % restore pointer
    
    % Mark clicks on plot
    scatter(xp, yp, 80, 'r', 'filled');
    
    % Save to CSV
    if ~isempty(xp)
        fname = 'picked_points.csv';
        fid = fopen(fname,'w');
        fprintf(fid, 'x,y\n');                       % header
        fprintf(fid, '%.8f,%.8f\n', [xp(:)'; yp(:)']);
        fclose(fid);
        fprintf('Saved %d points to %s\n', numel(xp), fname);
    else
        disp('No points picked.');
    end
elseif useAxisEqual == 0 && useSEDot == 0 && engMode == 1
    fig = figure;
    plot(changetoStrX,changetoStrY,'b');
    gird on;
    hold on;
    scatter(changetoStrX, changetoStrY);
    xlabel(headerZ(xIdx));
    ylabel(headerZ(yIdx));
    xv = changetoStrX(:); yv = changetoStrY(:); % all values after string double conversion
    xv = xv(~isnan(xv)); yv = yv(~isnan(yv)); % check if it is not a number
    xmin = min(xv); xmax = max(xv); ymin = min(yv); ymax = max(yv); % easily find min max in data set
    xr = xmax - xmin; yr = ymax - ymin; % subtraction bounds to find range for plot
    if xr==0, xr = abs(xmin)*0.1 + 1e-6; end % add 1e-6 to make sure it is not zero
    if yr==0, yr = abs(ymin)*0.1 + 1e-6; end
    pad = 0.10; xlim([xmin - xr*pad/2, xmax + xr*pad/2]); % scale and together is 10% larger
    ylim([ymin - yr*pad/2, ymax + yr*pad/2]); % set y and x lim
    title('Scatter Plot of Selected Data');

    % Use crosshair pointer and collect clicks until Enter
    set(fig,'Pointer','crosshair');       % shows crosshair cursor
    [xp, yp] = ginput();                  % no argument: collect until Enter/Return
    set(fig,'Pointer','arrow');           % restore pointer
    
    % Mark clicks on plot
    scatter(xp, yp, 80, 'r', 'filled');
    
    % Save to CSV
    if ~isempty(xp)
        fname = 'picked_points.csv';
        fid = fopen(fname,'w');
        fprintf(fid, 'x,y\n');                       % header
        fprintf(fid, '%.8f,%.8f\n', [xp(:)'; yp(:)']);
        fclose(fid);
        fprintf('Saved %d points to %s\n', numel(xp), fname);
    else
        disp('No points picked.');
    end
elseif useAxisEqual == 0 && useSEDot == 0 && engMode == 0
    fig = figure;
    plot(changetoStrX,changetoStrY,'b');
    grid on;
    hold on;
    scatter(changetoStrX, changetoStrY);
    xlabel(headerZ(xIdx));
    ylabel(headerZ(yIdx));
    xv = changetoStrX(:); yv = changetoStrY(:); % all values after string double conversion
    xv = xv(~isnan(xv)); yv = yv(~isnan(yv)); % check if it is not a number
    xmin = min(xv); xmax = max(xv); ymin = min(yv); ymax = max(yv); % easily find min max in data set
    xr = xmax - xmin; yr = ymax - ymin; % subtraction bounds to find range for plot
    if xr==0, xr = abs(xmin)*0.1 + 1e-6; end % add 1e-6 to make sure it is not zero
    if yr==0, yr = abs(ymin)*0.1 + 1e-6; end
    pad = 0.10; xlim([xmin - xr*pad/2, xmax + xr*pad/2]); % scale and together is 10% larger
    ylim([ymin - yr*pad/2, ymax + yr*pad/2]); % set y and x lim
    title('Scatter Plot of Selected Data');
elseif useAxisEqual == 1 && useSEDot == 0 && engMode == 0 
    fig = figure;
    plot(changetoStrX,changetoStrY,'b');
    grid on;
    axis equal;
    hold on;
    scatter(changetoStrX, changetoStrY);
    xlabel(headerZ(xIdx));
    ylabel(headerZ(yIdx));
    xv = changetoStrX(:); yv = changetoStrY(:); % all values after string double conversion
    xv = xv(~isnan(xv)); yv = yv(~isnan(yv)); % check if it is not a number
    xmin = min(xv); xmax = max(xv); ymin = min(yv); ymax = max(yv); % easily find min max in data set
    xr = xmax - xmin; yr = ymax - ymin; % subtraction bounds to find range for plot
    if xr==0, xr = abs(xmin)*0.1 + 1e-6; end % add 1e-6 to make sure it is not zero
    if yr==0, yr = abs(ymin)*0.1 + 1e-6; end
    pad = 0.10; xlim([xmin - xr*pad/2, xmax + xr*pad/2]); % scale and together is 10% larger
    ylim([ymin - yr*pad/2, ymax + yr*pad/2]); % set y and x lim
    title('Scatter Plot of Selected Data');
elseif useAxisEqual == 0 && useSEDot == 1 && engMode == 0
    fig = figure;
    plot(changetoStrX,changetoStrY,'b');
    grid on;
    hold on;
    plot(changetoStrX(1), changetoStrY(1), 'g^', 'MarkerFaceColor', 'g', 'MarkerSize', 8); %'go' means green, circle
    plot(changetoStrX(end-1), changetoStrY(end-1),'ro', 'MarkerFaceColor', 'r', 'MarkerSize', 8)
    scatter(changetoStrX, changetoStrY);
    xlabel(headerZ(xIdx));
    ylabel(headerZ(yIdx));
    xv = changetoStrX(:); yv = changetoStrY(:); % all values after string double conversion
    xv = xv(~isnan(xv)); yv = yv(~isnan(yv)); % check if it is not a number
    xmin = min(xv); xmax = max(xv); ymin = min(yv); ymax = max(yv); % easily find min max in data set
    xr = xmax - xmin; yr = ymax - ymin; % subtraction bounds to find range for plot
    if xr==0, xr = abs(xmin)*0.1 + 1e-6; end % add 1e-6 to make sure it is not zero
    if yr==0, yr = abs(ymin)*0.1 + 1e-6; end
    pad = 0.10; xlim([xmin - xr*pad/2, xmax + xr*pad/2]); % scale and together is 10% larger
    ylim([ymin - yr*pad/2, ymax + yr*pad/2]); % set y and x lim
    title('Scatter Plot of Selected Data');
elseif useAxisEqual == 1 && useSEDot == 1 && engMode == 0
    fig = figure;
    plot(changetoStrX,changetoStrY,'b');
    grid on;
    axis equal;
    hold on;
    plot(changetoStrX(1), changetoStrY(1), 'g^', 'MarkerFaceColor', 'g', 'MarkerSize', 8); %'go' means green, circle
    plot(changetoStrX(end-1), changetoStrY(end-1),'ro', 'MarkerFaceColor', 'r', 'MarkerSize', 8)
    scatter(changetoStrX, changetoStrY);
    xlabel(headerZ(xIdx));
    ylabel(headerZ(yIdx));
    xv = changetoStrX(:); yv = changetoStrY(:); % all values after string double conversion
    xv = xv(~isnan(xv)); yv = yv(~isnan(yv)); % check if it is not a number
    xmin = min(xv); xmax = max(xv); ymin = min(yv); ymax = max(yv); % easily find min max in data set
    xr = xmax - xmin; yr = ymax - ymin; % subtraction bounds to find range for plot
    if xr==0, xr = abs(xmin)*0.1 + 1e-6; end % add 1e-6 to make sure it is not zero
    if yr==0, yr = abs(ymin)*0.1 + 1e-6; end
    pad = 0.10; xlim([xmin - xr*pad/2, xmax + xr*pad/2]); % scale and together is 10% larger
    ylim([ymin - yr*pad/2, ymax + yr*pad/2]); % set y and x lim
    title('Scatter Plot of Selected Data');
end









