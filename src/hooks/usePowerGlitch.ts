import * as React from "react";
import { PowerGlitch, type PowerGlitchOptions, type RecursivePartial } from "powerglitch";

/**
 * React wrapper around https://github.com/7PH/powerglitch
 * Glitches titles / chrome without canvas — CSS layer clones.
 */
export const POWERGLITCH_CREDIT =
  "PowerGlitch · https://github.com/7PH/powerglitch (MIT)";

export type UsePowerGlitchOptions = RecursivePartial<PowerGlitchOptions> & {
  /** Skip when user prefers reduced motion */
  disabled?: boolean;
};

const ZEUS_GLITCH: RecursivePartial<PowerGlitchOptions> = {
  playMode: "always",
  hideOverflow: true,
  timing: {
    duration: 3200,
    iterations: Infinity,
    easing: "ease-in-out",
  },
  glitchTimeSpan: {
    start: 0.42,
    end: 0.62,
  },
  shake: {
    velocity: 12,
    amplitudeX: 0.14,
    amplitudeY: 0.08,
  },
  slice: {
    count: 6,
    velocity: 12,
    minHeight: 0.02,
    maxHeight: 0.14,
    hueRotate: true,
  },
  pulse: false,
};

export function usePowerGlitch<T extends HTMLElement = HTMLElement>(
  options: UsePowerGlitchOptions = {},
) {
  const ref = React.useRef<T | null>(null);
  const ctrl = React.useRef<{ startGlitch: () => void; stopGlitch: () => void } | null>(null);
  const { disabled, ...glitchOpts } = options;

  React.useEffect(() => {
    const el = ref.current;
    if (!el || disabled) {
      ctrl.current?.stopGlitch();
      ctrl.current = null;
      return;
    }

    const { startGlitch, stopGlitch } = PowerGlitch.glitch(el, {
      ...ZEUS_GLITCH,
      ...glitchOpts,
    });
    ctrl.current = { startGlitch, stopGlitch };

    return () => {
      stopGlitch();
      ctrl.current = null;
    };
    // stringify options lightly — callers should memoize heavy option objects
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, JSON.stringify(glitchOpts)]);

  return {
    ref,
    startGlitch: () => ctrl.current?.startGlitch(),
    stopGlitch: () => ctrl.current?.stopGlitch(),
  };
}

/** One-shot hover glitch for buttons / labels. */
export function useHoverPowerGlitch<T extends HTMLElement = HTMLElement>(disabled = false) {
  return usePowerGlitch<T>({
    disabled,
    playMode: "hover",
    timing: { duration: 600, iterations: 1 },
    glitchTimeSpan: { start: 0, end: 1 },
  });
}
