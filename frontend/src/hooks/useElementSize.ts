import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

/**
 * An element's rendered size in pixels, kept current as layout changes. Reads offsetWidth/Height,
 * which report the pre-transform box, so an element that is scaled or mid-animation still reports
 * the size it rests at.
 */
export function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const { offsetWidth: width, offsetHeight: height } = element;
      // unchanged size keeps the same object, so a no-op observer callback costs no render
      setSize((current) =>
        current.width === width && current.height === height ? current : { width, height },
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
