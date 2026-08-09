import { useEffect, useRef, useState } from 'react';

export const DEPARTURE_MS = 1100;

export const REDUCED_DEPARTURE_MS = 250;

const SAFETY_MS = 2000;

export type DepartureState = {
  frameIndex: number;
  done: boolean;
};

export function departureState(
  elapsedMs: number,
  frameCount: number,
  durationMs: number = DEPARTURE_MS,
): DepartureState {
  const progress = durationMs <= 0 ? 1 : Math.min(1, Math.max(0, elapsedMs / durationMs));
  const frameIndex =
    frameCount <= 1 ? 0 : Math.min(frameCount - 1, Math.floor(progress * frameCount));
  return { frameIndex, done: progress >= 1 };
}

export function useDepartureClock(
  active: boolean,
  frameCount: number,
  durationMs: number,
  onDone: () => void,
): number {
  const [frameIndex, setFrameIndex] = useState(0);

  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!active) {
      setFrameIndex(0);
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
      const next = departureState(performance.now() - startedAt, frameCount, durationMs);
      setFrameIndex(next.frameIndex);
      if (next.done) finish();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const fallback = window.setTimeout(finish, durationMs + SAFETY_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
    };
  }, [active, frameCount, durationMs]);

  return frameIndex;
}
