import { useCallback, useLayoutEffect, useRef, useState } from 'react';
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
import { FIT_VAR } from '../landingLayout';

const EMPTY_COLLAPSED_FRACTION = 0.05;
const FULL_PULL_HEIGHT_FRACTION = 0.6;

const CARD_BORDER = 6;
const CONTENT_PAD_X = '6%';
const CONTENT_PAD_Y = '3.5%';

const CORD_RESTING_LENGTH_RATIO = 0.035;
const CORD_THICKNESS_RATIO = 0.008;
const BEAD_DIAMETER_RATIO = { xs: 0.16, sm: 0.05 };
const BEAD_BORDER_RATIO = CORD_THICKNESS_RATIO / BEAD_DIAMETER_RATIO.sm;

const SHADE_RATIO = {
  roller: 0.28,
  rollerOverhang: 0.16,
  bracketWidth: 0.2,
  bracketHeight: 0.45,
  bracketOffset: 0.28,
  bracketRise: 0.08,
  hem: 0.2,
  hemOverhang: 0.08,
  outline: 0.04,
} as const;

const FIT_FLOOR = 0.5;
const FILL_CEILING = 1.6;
const FIT_STEPS = 9;

export type TextLine = Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>;

const SPRING_EASING = 'cubic-bezier(.22,1,.36,1)';
const CARD_COLLAPSE_MS = 520;
const SNAP_BACK_MS = 360;
const RESPECT_REDUCED_MOTION = { '@media (prefers-reduced-motion: reduce)': { transition: 'none' } };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const fullPullFor = (cardHeight: number) => Math.max(cardHeight * FULL_PULL_HEIGHT_FRACTION, 1);

export function DrawstringCard({
  children,
  peek,
  fill = false,
  onFit,
  sx,
}: {
  children?: ReactNode;
  peek?: ReactNode;
  fill?: boolean;
  onFit?: (lines: TextLine[], floor: number) => void;
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
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const rollerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const roller = rollerRef.current;
    const card = cardRef.current;
    const content = contentRef.current;
    const copy = copyRef.current;
    if (!roller || !card || !content || !copy) return;

    const fit = () => {
      const padding = getComputedStyle(content);
      const room =
        content.getBoundingClientRect().height -
        parseFloat(padding.paddingTop) -
        parseFloat(padding.paddingBottom);
      const fitsAt = (scale: number) => {
        card.style.setProperty(FIT_VAR, String(scale));
        return copy.getBoundingClientRect().height <= room;
      };
      const ceiling = fill ? FILL_CEILING : 1;
      if (!fitsAt(ceiling)) {
        let fits = FIT_FLOOR;
        let overflows = ceiling;
        for (let step = 0; step < FIT_STEPS; step += 1) {
          const scale = (fits + overflows) / 2;
          if (fitsAt(scale)) fits = scale;
          else overflows = scale;
        }
        fitsAt(fits);
      }
      if (!onFit) return;
      const restOffset = roller.getBoundingClientRect().bottom - content.getBoundingClientRect().top;
      const floor = content.getBoundingClientRect().bottom + restOffset;
      const lines: TextLine[] = [];
      const range = document.createRange();
      const text = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
      for (let node = text.nextNode(); node; node = text.nextNode()) {
        range.selectNodeContents(node);
        for (const rect of Array.from(range.getClientRects())) {
          if (rect.width > 0)
            lines.push({
              left: rect.left,
              right: rect.right,
              top: rect.top + restOffset,
              bottom: rect.bottom + restOffset,
            });
        }
      }
      onFit(lines, floor);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(content);
    observer.observe(copy);
    document.fonts.addEventListener('loadingdone', fit);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', fit);
    };
  }, [fill, onFit]);

  const isMobile = useMediaQuery((t: Theme) => t.breakpoints.down('sm'));
  const beadRatio = isMobile ? BEAD_DIAMETER_RATIO.xs : BEAD_DIAMETER_RATIO.sm;

  const beadRestingSize = shellWidth * beadRatio;
  const beadBorder = beadRestingSize * BEAD_BORDER_RATIO;
  const cordThickness = shellWidth * CORD_THICKNESS_RATIO;

  const rollerHeight = beadRestingSize * SHADE_RATIO.roller;
  const hemHeight = beadRestingSize * SHADE_RATIO.hem;
  const outlineWidth = beadRestingSize * SHADE_RATIO.outline;
  const shadeOutline = `${outlineWidth}px solid ${palette.brown}`;

  const collapsedHeight =
    rollerHeight +
    hemHeight +
    (peek && peekHeight ? peekHeight : shellHeight * EMPTY_COLLAPSED_FRACTION);
  const cardHeight = isCollapsed ? collapsedHeight : shellHeight;
  const bottomEdgeRise = shellHeight - cardHeight;

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
          ref={cardRef}
          sx={{
            position: 'relative',
            width: '100%',
            flex: 'none',
            height: shellHeight ? cardHeight : '100%',
            clipPath: 'inset(0 -10% 0 -10%)',
            bgcolor: palette.oliveSoft,
            borderLeft: `${CARD_BORDER}px solid ${palette.olive}`,
            borderRight: `${CARD_BORDER}px solid ${palette.olive}`,
            boxShadow: `-${outlineWidth}px 0 0 ${palette.brown}, ${outlineWidth}px 0 0 ${palette.brown}`,
            transition: `height ${CARD_COLLAPSE_MS}ms ${SPRING_EASING}`,
            ...RESPECT_REDUCED_MOTION,
          }}
        >
          <Box
            ref={contentRef}
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: hemHeight,
              height: shellHeight ? shellHeight - rollerHeight - hemHeight : '100%',
              overflow: 'hidden',
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
              <Box ref={copyRef}>{children}</Box>
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
                bottom: hemHeight,
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

          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              left: -(CARD_BORDER + beadRestingSize * SHADE_RATIO.hemOverhang),
              right: -(CARD_BORDER + beadRestingSize * SHADE_RATIO.hemOverhang),
              bottom: 0,
              height: hemHeight,
              bgcolor: palette.olive,
              border: shadeOutline,
            }}
          />
        </Box>

        <Box
          ref={rollerRef}
          aria-hidden
          sx={{
            position: 'absolute',
            top: 0,
            left: -beadRestingSize * SHADE_RATIO.rollerOverhang,
            right: -beadRestingSize * SHADE_RATIO.rollerOverhang,
            height: rollerHeight,
            bgcolor: palette.olive,
            border: shadeOutline,
          }}
        />
        {(['left', 'right'] as const).map((side) => (
          <Box
            key={side}
            aria-hidden
            sx={{
              position: 'absolute',
              top: -beadRestingSize * SHADE_RATIO.bracketRise,
              [side]: -beadRestingSize * SHADE_RATIO.bracketOffset,
              width: beadRestingSize * SHADE_RATIO.bracketWidth,
              height: beadRestingSize * SHADE_RATIO.bracketHeight,
              bgcolor: palette.olive,
              border: shadeOutline,
            }}
          />
        ))}

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
