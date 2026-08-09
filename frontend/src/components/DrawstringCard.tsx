import { useCallback, useRef, useState } from 'react';
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { palette } from '../theme/palette';
import { useElementSize } from '../hooks/useElementSize';

const COLLAPSED_SCALE_Y = 0.05;
const FULL_PULL_HEIGHT_FRACTION = 0.6;

const CORD_RESTING_LENGTH_RATIO = 0.035;
const CORD_THICKNESS_RATIO = 0.008;
const BEAD_DIAMETER_RATIO = 0.05;
const BEAD_MAX_GROWTH = 1.0;

const STRING_CLEARANCE = `${(BEAD_DIAMETER_RATIO * 100).toFixed(2)}%`;

const SPRING_EASING = 'cubic-bezier(.22,1,.36,1)';
const CARD_COLLAPSE_MS = 520;
const SNAP_BACK_MS = 360;
const RESPECT_REDUCED_MOTION = { '@media (prefers-reduced-motion: reduce)': { transition: 'none' } };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const fullPullFor = (cardHeight: number) => Math.max(cardHeight * FULL_PULL_HEIGHT_FRACTION, 1);

function releasePointer(event: ReactPointerEvent) {
  try {
    event.currentTarget.releasePointerCapture(event.pointerId);
  } catch {
  }
}

export function DrawstringCard({ children, sx }: { children?: ReactNode; sx?: SxProps<Theme> }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { width: cardWidth, height: cardHeight } = useElementSize(cardRef);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const gesture = useRef({ isActive: false, startY: 0, fullPull: 1, cordRest: 0 });
  const cordRef = useRef<HTMLDivElement>(null);
  const beadRef = useRef<HTMLDivElement>(null);

  const cardScaleY = isCollapsed ? COLLAPSED_SCALE_Y : 1;
  const bottomEdgeRise = (1 - cardScaleY) * cardHeight;

  const beadRestingSize = cardWidth * BEAD_DIAMETER_RATIO;
  const cordThickness = cardWidth * CORD_THICKNESS_RATIO;

  const snapBack = isDragging ? 'none' : `${SNAP_BACK_MS}ms ${SPRING_EASING}`;

  const beadShadow = `0 4px 12px ${alpha(palette.brown, 0.4)}`;
  const beadGlow =
    `${beadShadow}, 0 0 0 ${Math.max(cordThickness, 2)}px ${alpha(palette.gold, 0.35)}` +
    `, 0 0 ${beadRestingSize * 0.7}px ${alpha(palette.gold, 0.85)}`;
  const cordGlow = `0 0 ${Math.max(beadRestingSize * 0.4, 6)}px ${alpha(palette.gold, 0.7)}`;

  const clearDragStyles = useCallback(() => {
    if (cordRef.current) cordRef.current.style.height = '';
    if (beadRef.current) beadRef.current.style.transform = '';
  }, []);

  const startPull = useCallback((event: ReactPointerEvent) => {
    const restingHeight = cardRef.current?.offsetHeight ?? 0;
    const restingWidth = cardRef.current?.offsetWidth ?? 0;
    gesture.current = {
      isActive: true,
      startY: event.clientY,
      fullPull: fullPullFor(restingHeight),
      cordRest: restingWidth * CORD_RESTING_LENGTH_RATIO,
    };
    if (cordRef.current) cordRef.current.style.height = `${gesture.current.cordRest}px`;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const trackPull = useCallback((event: ReactPointerEvent) => {
    const { isActive, startY, fullPull, cordRest } = gesture.current;
    if (!isActive) return;
    const pull = clamp(event.clientY - startY, 0, fullPull);
    if (cordRef.current) cordRef.current.style.height = `${cordRest + pull}px`;
    if (beadRef.current) {
      beadRef.current.style.transform = `scale(${1 + (pull / fullPull) * BEAD_MAX_GROWTH})`;
    }
  }, []);

  const finishPull = useCallback(
    (event: ReactPointerEvent) => {
      if (!gesture.current.isActive) return;
      gesture.current.isActive = false;
      setIsDragging(false);
      releasePointer(event);
      clearDragStyles();
      setIsCollapsed((collapsed) => !collapsed);
    },
    [clearDragStyles],
  );

  const abandonPull = useCallback(
    (event: ReactPointerEvent) => {
      gesture.current.isActive = false;
      setIsDragging(false);
      releasePointer(event);
      clearDragStyles();
    },
    [clearDragStyles],
  );

  const togglePullFromKeyboard = useCallback((event: ReactKeyboardEvent) => {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      setIsCollapsed((collapsed) => !collapsed);
      event.preventDefault();
    }
  }, []);

  return (
    <Box
      sx={{
        width: '92%',
        display: 'flex',
        flexDirection: 'column',
        pb: STRING_CLEARANCE,
        ...sx,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          ref={cardRef}
          sx={{
            width: '100%',
            flex: 1,
            minHeight: 0,
            bgcolor: palette.oliveSoft,
            border: `6px solid ${palette.olive}`,
            borderRadius: '32px',
            boxShadow: `0 14px 36px ${alpha(palette.brown, 0.12)}`,
            transform: `scaleY(${cardScaleY})`,
            transformOrigin: 'top center',
            transition: `transform ${CARD_COLLAPSE_MS}ms ${SPRING_EASING}`,
            ...RESPECT_REDUCED_MOTION,
          }}
        >
          {children}
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: `translate(-50%, ${-bottomEdgeRise}px)`,
            transition: `transform ${CARD_COLLAPSE_MS}ms ${SPRING_EASING}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 2,
            '&:hover .ds-bead': { boxShadow: beadGlow },
            '&:hover .ds-cord': { boxShadow: cordGlow },
            ...RESPECT_REDUCED_MOTION,
          }}
        >
          <Box
            className="ds-cord"
            ref={cordRef}
            sx={{
              width: cordThickness,
              height: 0,
              opacity: isDragging ? 1 : 0,
              bgcolor: palette.brown,
              borderRadius: 999,
              transition: `height ${snapBack}, opacity ${snapBack}, box-shadow 200ms ease`,
              ...RESPECT_REDUCED_MOTION,
            }}
          />
          <Box
            className="ds-bead"
            ref={beadRef}
            role="switch"
            aria-checked={isCollapsed}
            aria-label="Pull the drawstring to shrink the card; pull again to restore it"
            tabIndex={0}
            onPointerDown={startPull}
            onPointerMove={trackPull}
            onPointerUp={finishPull}
            onPointerCancel={abandonPull}
            onKeyDown={togglePullFromKeyboard}
            sx={{
              width: beadRestingSize,
              height: beadRestingSize,
              borderRadius: '50%',
              bgcolor: palette.gold,
              border: `${Math.max(cordThickness, 1)}px solid ${palette.brown}`,
              boxShadow: beadShadow,
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'none',
              transition: `transform ${snapBack}, box-shadow 200ms ease`,
              '&:hover': { boxShadow: beadGlow },
              '&:focus-visible': { outline: 'none', boxShadow: beadGlow },
              ...RESPECT_REDUCED_MOTION,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
