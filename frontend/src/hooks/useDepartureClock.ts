import { useEffect, useRef, useState } from 'react';

export const DEPARTURE_MS = 1100;

export const REDUCED_DEPARTURE_MS = 250;

function departureState(
  elapsedMs: number,
  frameCount: number,
  durationMs: number,
): { frameIndex: number; done: boolean } {
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
  const [wasActive, setWasActive] = useState(active);

  if (wasActive !== active) {
    setWasActive(active);
    if (!active) setFrameIndex(0);
  }

  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (!active) return;

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

    const fallback = window.setTimeout(finish, durationMs + 2000);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
    };
  }, [active, frameCount, durationMs]);

  return frameIndex;
}
