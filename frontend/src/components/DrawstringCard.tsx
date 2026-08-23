import { useCallback, useRef, useState } from 'react';
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { palette } from '../theme/palette';
import { useElementSize } from '../hooks/useElementSize';

const EMPTY_COLLAPSED_FRACTION = 0.05;
const FULL_PULL_HEIGHT_FRACTION = 0.6;

const CARD_BORDER = 6;
const CONTENT_PAD_X = '6%';
const CONTENT_PAD_Y = '3.5%';

const CORD_RESTING_LENGTH_RATIO = 0.035;
const CORD_THICKNESS_RATIO = 0.008;
const BEAD_DIAMETER_RATIO = { xs: 0.16, sm: 0.05 };
const BEAD_BORDER_RATIO = CORD_THICKNESS_RATIO / BEAD_DIAMETER_RATIO.sm;

const SPRING_EASING = 'cubic-bezier(.22,1,.36,1)';
const CARD_COLLAPSE_MS = 520;
const SNAP_BACK_MS = 360;
const RESPECT_REDUCED_MOTION = { '@media (prefers-reduced-motion: reduce)': { transition: 'none' } };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const fullPullFor = (cardHeight: number) => Math.max(cardHeight * FULL_PULL_HEIGHT_FRACTION, 1);

export function DrawstringCard({
  children,
  peek,
  sx,
}: {
  children?: ReactNode;
  peek?: ReactNode;
  sx?: SxProps<Theme>;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const { width: shellWidth, height: shellHeight } = useElementSize(shellRef);
  const { height: peekHeight } = useElementSize(peekRef);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const gesture = useRef({ isActive: false, startY: 0, fullPull: 1, cordRest: 0 });
  const cordRef = useRef<HTMLDivElement>(null);
  const beadRef = useRef<HTMLDivElement>(null);

  const collapsedHeight =
    peek && peekHeight ? peekHeight + CARD_BORDER * 2 : shellHeight * EMPTY_COLLAPSED_FRACTION;
  const cardHeight = isCollapsed ? collapsedHeight : shellHeight;
  const bottomEdgeRise = shellHeight - cardHeight;

  const isMobile = useMediaQuery((t: Theme) => t.breakpoints.down('sm'));
  const beadRatio = isMobile ? BEAD_DIAMETER_RATIO.xs : BEAD_DIAMETER_RATIO.sm;

  const beadRestingSize = shellWidth * beadRatio;
  const beadBorder = beadRestingSize * BEAD_BORDER_RATIO;
  const cordThickness = shellWidth * CORD_THICKNESS_RATIO;

  const snapBack = isDragging ? 'none' : `${SNAP_BACK_MS}ms ${SPRING_EASING}`;
  const fade = `opacity ${CARD_COLLAPSE_MS}ms ${SPRING_EASING}`;

  const beadShadow = `0 4px 12px ${alpha(palette.brown, 0.4)}`;
  const beadGlow =
    `${beadShadow}, 0 0 0 ${Math.max(beadBorder, 2)}px ${alpha(palette.gold, 0.35)}` +
    `, 0 0 ${beadRestingSize * 0.7}px ${alpha(palette.gold, 0.85)}`;
  const cordGlow = `0 0 ${Math.max(beadRestingSize * 0.4, 6)}px ${alpha(palette.gold, 0.7)}`;

  const clearDragStyles = useCallback(() => {
    if (cordRef.current) cordRef.current.style.height = '';
    if (beadRef.current) beadRef.current.style.transform = '';
  }, []);

  const startPull = useCallback((event: ReactPointerEvent) => {
    if (gesture.current.isActive) return;
    const restingHeight = shellRef.current?.offsetHeight ?? 0;
    const restingWidth = shellRef.current?.offsetWidth ?? 0;
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
      beadRef.current.style.transform = `scale(${1 + pull / fullPull})`;
    }
  }, []);

  const finishPull = useCallback(() => {
    if (!gesture.current.isActive) return;
    gesture.current.isActive = false;
    setIsDragging(false);
    clearDragStyles();
    setIsCollapsed((collapsed) => !collapsed);
  }, [clearDragStyles]);

  const abandonPull = useCallback(() => {
    gesture.current.isActive = false;
    setIsDragging(false);
    clearDragStyles();
  }, [clearDragStyles]);

  const togglePullFromKeyboard = useCallback((event: ReactKeyboardEvent) => {
    if (event.repeat) return;
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
        pb: `${beadRatio * 100}%`,
        ...sx,
      }}
    >
      <Box
        ref={shellRef}
        sx={{
          position: 'relative',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            flex: 'none',
            height: shellHeight ? cardHeight : '100%',
            overflow: 'hidden',
            bgcolor: palette.oliveSoft,
            border: `${CARD_BORDER}px solid ${palette.olive}`,
            borderRadius: '32px',
            boxShadow: `0 14px 36px ${alpha(palette.brown, 0.12)}`,
            transition: `height ${CARD_COLLAPSE_MS}ms ${SPRING_EASING}`,
            ...RESPECT_REDUCED_MOTION,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: shellHeight ? shellHeight - CARD_BORDER * 2 : '100%',
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              containerType: 'inline-size',
              px: CONTENT_PAD_X,
              py: CONTENT_PAD_Y,
              opacity: isCollapsed ? 0 : 1,
              pointerEvents: isCollapsed ? 'none' : 'auto',
              transition: fade,
              ...RESPECT_REDUCED_MOTION,
            }}
          >
            <Box
              sx={{
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {children}
            </Box>
          </Box>

          {peek && (
            <Box
              aria-hidden
              ref={peekRef}
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                containerType: 'inline-size',
                px: CONTENT_PAD_X,
                py: CONTENT_PAD_Y,
                opacity: isCollapsed ? 1 : 0,
                pointerEvents: 'none',
                transition: fade,
                ...RESPECT_REDUCED_MOTION,
              }}
            >
              {peek}
            </Box>
          )}
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
              boxShadow: isDragging ? cordGlow : 'none',
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
              border: `${Math.max(beadBorder, 1)}px solid ${palette.brown}`,
              boxShadow: isDragging ? beadGlow : beadShadow,
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'none',
              transition: `transform ${snapBack}, box-shadow 200ms ease`,
              '&:focus-visible': { outline: 'none', boxShadow: beadGlow },
              ...RESPECT_REDUCED_MOTION,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
