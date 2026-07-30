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

const COLLAPSED_SCALE_Y = 0.05; // 5% of the card's height still shows once collapsed
const FULL_PULL_HEIGHT_FRACTION = 0.6; // drag this much of the card's height for a full pull

/** Cord and bead sizes are fractions of the card's WIDTH — the card's height flexes to fill the
 *  page, so sizing the string off it would make the string resize with the viewport. */
const CORD_RESTING_LENGTH_RATIO = 0.035;
const CORD_THICKNESS_RATIO = 0.008;
const BEAD_DIAMETER_RATIO = 0.05;
const BEAD_MAX_GROWTH = 1.0; // bead swells to (1 + this)x its resting size over a full pull

/** Room reserved below the card for the resting bead to hang in. A percentage of width, because
 *  percentage padding resolves against width — the same axis the bead is sized from. A bead at full
 *  stretch is BEAD_MAX_GROWTH bigger than this and overhangs it mid-drag, which is fine; reserving
 *  for the stretched size instead costs the card that height permanently. */
const STRING_CLEARANCE = `${(BEAD_DIAMETER_RATIO * 100).toFixed(2)}%`;

const SPRING_EASING = 'cubic-bezier(.22,1,.36,1)';
const CARD_COLLAPSE_MS = 520;
const SNAP_BACK_MS = 360;
const RESPECT_REDUCED_MOTION = { '@media (prefers-reduced-motion: reduce)': { transition: 'none' } };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Floored at a pixel so an unmeasured card can't divide by zero. */
const fullPullFor = (cardHeight: number) => Math.max(cardHeight * FULL_PULL_HEIGHT_FRACTION, 1);

function releasePointer(event: ReactPointerEvent) {
  try {
    event.currentTarget.releasePointerCapture(event.pointerId);
  } catch {
    /* already released */
  }
}

/**
 * The olive panel with a drawstring hanging off its bottom edge. Each pull toggles the card: the
 * first collapses it, the next restores it. Only its height changes, and it stays anchored at the
 * top, so the bottom edge — and the attached string — travels upward.
 */
export function DrawstringCard({ children, sx }: { children?: ReactNode; sx?: SxProps<Theme> }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { width: cardWidth, height: cardHeight } = useElementSize(cardRef); // resting size
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const gesture = useRef({ isActive: false, startY: 0, fullPull: 1 });

  const cardScaleY = isCollapsed ? COLLAPSED_SCALE_Y : 1;
  /** How far the collapsing card's bottom edge has climbed; the drawstring shifts up to match. */
  const bottomEdgeRise = (1 - cardScaleY) * cardHeight;
  const pullProgress = isDragging ? pullDistance / fullPullFor(cardHeight) : 0;

  const beadRestingSize = cardWidth * BEAD_DIAMETER_RATIO;
  const beadSize = beadRestingSize * (1 + pullProgress * BEAD_MAX_GROWTH);
  const cordThickness = cardWidth * CORD_THICKNESS_RATIO;
  const cordLength = isDragging ? cardWidth * CORD_RESTING_LENGTH_RATIO + pullDistance : 0;

  /** Nothing eases mid-drag — the bead has to track the pointer exactly. Restoring the spring on
   *  release is what reads as the string snapping back. */
  const snapBack = isDragging ? 'none' : `${SNAP_BACK_MS}ms ${SPRING_EASING}`;

  const beadShadow = `0 4px 12px ${alpha(palette.brown, 0.4)}`;
  const beadGlow =
    `${beadShadow}, 0 0 0 ${Math.max(cordThickness, 2)}px ${alpha(palette.gold, 0.35)}` +
    `, 0 0 ${beadRestingSize * 0.7}px ${alpha(palette.gold, 0.85)}`;
  const cordGlow = `0 0 ${Math.max(beadRestingSize * 0.4, 6)}px ${alpha(palette.gold, 0.7)}`;

  const startPull = useCallback((event: ReactPointerEvent) => {
    // Measured fresh rather than read from state, which can trail a resize by a frame.
    const restingHeight = cardRef.current?.offsetHeight ?? 0;
    gesture.current = {
      isActive: true,
      startY: event.clientY,
      fullPull: fullPullFor(restingHeight),
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const trackPull = useCallback((event: ReactPointerEvent) => {
    const { isActive, startY, fullPull } = gesture.current;
    if (!isActive) return;
    setPullDistance(clamp(event.clientY - startY, 0, fullPull));
  }, []);

  const finishPull = useCallback((event: ReactPointerEvent) => {
    if (!gesture.current.isActive) return;
    gesture.current.isActive = false;
    setIsDragging(false);
    releasePointer(event);
    setPullDistance(0);
    setIsCollapsed((collapsed) => !collapsed);
  }, []);

  /** An abandoned gesture (touch stolen, pointer lost) is not a pull — reset without toggling. */
  const abandonPull = useCallback((event: ReactPointerEvent) => {
    gesture.current.isActive = false;
    setIsDragging(false);
    releasePointer(event);
    setPullDistance(0);
  }, []);

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
        pb: STRING_CLEARANCE, // the bead hangs here
        ...sx,
      }}
    >
      {/* Inner positioning context, so the drawstring stays glued to the card's bottom edge
          regardless of any padding or margins the caller's sx puts on the wrapper above. */}
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
            // grows to fill the box above rather than height: '100%' — nothing in the ancestor chain
            // has a definite height, so a percentage would resolve to auto and collapse the card
            flex: 1,
            minHeight: 0,
            bgcolor: palette.oliveSoft,
            border: `6px solid ${palette.olive}`,
            borderRadius: '32px',
            boxShadow: `0 14px 36px ${alpha(palette.brown, 0.12)}`,
            transform: `scaleY(${cardScaleY})`,
            transformOrigin: 'top center', // top edge holds still, bottom collapses up toward it
            transition: `transform ${CARD_COLLAPSE_MS}ms ${SPRING_EASING}`,
            willChange: 'transform',
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
            sx={{
              width: cordThickness,
              height: cordLength,
              opacity: isDragging ? 1 : 0,
              bgcolor: palette.brown,
              borderRadius: 999,
              transition: `height ${snapBack}, opacity ${snapBack}, box-shadow 200ms ease`,
              ...RESPECT_REDUCED_MOTION,
            }}
          />
          <Box
            className="ds-bead"
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
              width: beadSize,
              height: beadSize,
              borderRadius: '50%',
              bgcolor: palette.gold,
              border: `${Math.max(cordThickness, 1)}px solid ${palette.brown}`,
              boxShadow: beadShadow,
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'none', // or the browser steals the drag for scrolling
              transition: `width ${snapBack}, height ${snapBack}, box-shadow 200ms ease`,
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
