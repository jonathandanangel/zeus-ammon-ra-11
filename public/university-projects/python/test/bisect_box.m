function [box1, curpt, box2, errflg, errval] = bisect_box(box1, ip, dp)
%BISECT_BOX  Octave version of Algorithm 681 BISECT.
%   box1 is 2xN: box1(1,i)=left endpoint, box1(2,i)=right endpoint.
%   ip is coordinate index to bisect (1..N).
%   dp selects which half becomes new current box:
%      dp = true  -> LEFT half becomes box1 (right endpoint set to midpoint)
%      dp = false -> RIGHT half becomes box1 (left endpoint set to midpoint)
%
% Returns:
%   box1 : updated current box
%   curpt: midpoint of updated box1
%   box2 : the "other" half (to put on stack)
%   errflg/errval: compatible with Fortran style errors

  errflg = 0; errval = 0;

  N = columns(box1);
  if (ip <= 0 || ip > N)
    errflg = 32; errval = ip;  % illegal coordinate to bisect
    box2 = []; curpt = [];
    return;
  end

  % Midpoint of the selected interval
  tmid = (box1(1,ip) + box1(2,ip)) / 2.0;

  % Adjacent machine-number check (midpoint collapsed to endpoint)
  if (tmid <= box1(1,ip) || tmid >= box1(2,ip))
    errflg = 33; errval = ip;  % endpoints too close / no representable midpoint
    box2 = []; curpt = [];
    return;
  end

  % Copy full box into box2
  box2 = box1;

  % Split according to dp (LEFT = true, RIGHT = false)
  if (dp)  % LEFT
    box1(2,ip) = tmid;
    box2(1,ip) = tmid;
  else     % RIGHT
    box1(1,ip) = tmid;
    box2(2,ip) = tmid;
  end

  % Midpoint of new current box
  curpt = (box1(1,:) + box1(2,:)) / 2.0;
end
