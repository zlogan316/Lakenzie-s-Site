import { useEffect, useRef, useState } from 'react';

/** Total departure duration, independent of frame count: drawing more frames makes the animation
 *  smoother, never makes navigation slower. */
export const DEPARTURE_MS = 1100;

/** Reduced-motion departures skip the flipbook entirely and just cross-fade. */
export const REDUCED_DEPARTURE_MS = 250;

/** Fraction of the departure that plays at full clarity before the white wash starts ramping.
 *  The early frames are where the seeds visibly detach; the wash then covers the busiest ones. */
const WASH_START = 0.6;

/** How long after the expected end we force completion if rAF never delivers a final tick. */
const SAFETY_MS = 2000;

export type DepartureState = {
  frameIndex: number;
  washOpacity: number;
  done: boolean;
};

/**
 * Derives everything the departure renders from elapsed time alone. Pure — no DOM, no clock — so
 * the frames and the wash are guaranteed to stay in lockstep and this is trivially checkable.
 *
 * Pass frameCount 1 to freeze on the resting frame (how reduced motion is expressed).
 */
export function departureState(
  elapsedMs: number,
  frameCount: number,
  durationMs: number = DEPARTURE_MS,
): DepartureState {
  const progress = durationMs <= 0 ? 1 : Math.min(1, Math.max(0, elapsedMs / durationMs));
  const frameIndex =
    frameCount <= 1 ? 0 : Math.min(frameCount - 1, Math.floor(progress * frameCount));
  const washOpacity = progress <= WASH_START ? 0 : (progress - WASH_START) / (1 - WASH_START);
  return { frameIndex, washOpacity, done: progress >= 1 };
}

/**
 * Runs one rAF clock while `active`, returning elapsed ms and calling `onDone` once at the end.
 *
 * Elapsed time is always measured from the start timestamp, never accumulated per tick: rAF stops
 * in a backgrounded tab, and measuring means returning to the tab snaps straight to the correct
 * state instead of resuming a stale count.
 */
export function useDepartureClock(
  active: boolean,
  durationMs: number,
  onDone: () => void,
): number {
  const [elapsed, setElapsed] = useState(0);

  // held in a ref so a new callback identity each render doesn't restart the clock
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!active) {
      setElapsed(0);
      return;
    }

    const startedAt = performance.now();
    let frame = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      onDoneRef.current();
    };

    const tick = () => {
      const next = performance.now() - startedAt;
      setElapsed(next);
      if (next >= durationMs) finish();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    // never strand the user mid-transition if rAF stops and never resumes
    const fallback = window.setTimeout(finish, durationMs + SAFETY_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
    };
  }, [active, durationMs]);

  return elapsed;
}
