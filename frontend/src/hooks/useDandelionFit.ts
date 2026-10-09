import { useCallback, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { assets, DANDELION_PAGE_MM, DANDELION_STEM_X, DANDELION_STEM_Y } from '../assets';
import {
  DANDELION_BOTTOM_PCT,
  DANDELION_MAX_PCT,
  DANDELION_VAR,
  FLOWER_HEAD_REACH,
  FLOWER_WIDTH_MM,
  LABEL_BOTTOM_VAR,
  LABEL_ROOM_VAR,
  NUDGE_SWINGS_DEG,
} from '../landingLayout';

const PUFF_ALPHA = 24;
const FIT_STEPS = 14;

type Line = Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>;
type InnerEdge = { imageWidth: number; points: [number, number][] };

let innerEdge: Promise<InnerEdge> | null = null;

const loadInnerEdge = () => {
  innerEdge ??= new Promise<InnerEdge>((resolve, reject) => {
    const image = new Image();
    image.onerror = reject;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('2d canvas unavailable'));
        return;
      }
      context.drawImage(image, 0, 0);
      const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
      const points: [number, number][] = [];
      for (let y = 0; y < height; y += 1) {
        for (let x = width - 1; x >= 0; x -= 1) {
          if (data[(y * width + x) * 4 + 3] > PUFF_ALPHA) {
            points.push([x + 1 - DANDELION_STEM_X * width, y + 0.5 - DANDELION_STEM_Y * height]);
            break;
          }
        }
      }
      resolve({ imageWidth: width, points });
    };
    image.src = assets.dandelionFrames[0];
  });
  return innerEdge;
};

const SWINGS = NUDGE_SWINGS_DEG.map((deg) => {
  const turn = (deg * Math.PI) / 180;
  return { cos: Math.cos(turn), sin: Math.sin(turn) };
});

export function useDandelionFit(containerRef: RefObject<HTMLElement | null>, enabled: boolean) {
  const fitTo = useRef<(lines: Line[]) => void>(() => {});

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container) return;

    let edge: InnerEdge | null = null;
    let latest: Line[] | null = null;
    let live = true;

    const fit = () => {
      if (!edge || !latest) return;
      const { imageWidth, points } = edge;
      const box = container.getBoundingClientRect();
      const clearance = 1 / window.devicePixelRatio;
      const lines = latest.map((line) => ({
        left: line.left - box.left - clearance,
        right: box.right - line.right - clearance,
        top: line.top - box.top - clearance,
        bottom: line.bottom - box.top + clearance,
      }));
      const stemY = box.height * (1 - DANDELION_BOTTOM_PCT / 100);

      const clears = (flowerWidth: number) => {
        const scale = (flowerWidth * DANDELION_PAGE_MM) / FLOWER_WIDTH_MM / imageWidth;
        const stemX = FLOWER_HEAD_REACH * flowerWidth;
        const halfRow = scale / 2;
        return SWINGS.every(({ cos, sin }) =>
          points.every(([px, py]) => {
            const x = stemX + (px * cos - py * sin) * scale;
            const y = stemY + (px * sin + py * cos) * scale;
            return lines.every(
              (line) =>
                y + halfRow < line.top ||
                y - halfRow > line.bottom ||
                (x <= line.left && x <= line.right),
            );
          }),
        );
      };

      const widest = (DANDELION_MAX_PCT / 100) * box.width;
      let fits = 0;
      let overlaps = widest;
      if (clears(widest)) fits = widest;
      else
        for (let step = 0; step < FIT_STEPS; step += 1) {
          const flowerWidth = (fits + overlaps) / 2;
          if (clears(flowerWidth)) fits = flowerWidth;
          else overlaps = flowerWidth;
        }
      container.style.setProperty(DANDELION_VAR, `${fits}px`);
    };

    fitTo.current = (lines) => {
      latest = lines;
      fit();
    };

    loadInnerEdge()
      .then((loaded) => {
        if (!live) return;
        edge = loaded;
        fit();
      })
      .catch(() => {});

    return () => {
      live = false;
      fitTo.current = () => {};
    };
  }, [containerRef, enabled]);

  return useCallback(
    (lines: Line[], floor: number) => {
      fitTo.current(lines);
      const container = containerRef.current;
      const label = container?.querySelector<HTMLElement>('.dandelion-label');
      if (!container || !label) return;
      const box = container.getBoundingClientRect();
      const stemBase = box.bottom - (DANDELION_BOTTOM_PCT / 100) * box.height;
      const textBottom = Math.max(...lines.map((line) => line.bottom));
      const labelBottom = (textBottom + floor + label.offsetHeight) / 2;
      container.style.setProperty(LABEL_BOTTOM_VAR, `${stemBase - labelBottom}px`);
      container.style.setProperty(LABEL_ROOM_VAR, `${label.offsetHeight}px`);
    },
    [containerRef],
  );
}
