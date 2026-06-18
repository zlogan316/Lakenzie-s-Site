import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { palette } from '../theme/palette';

const SHRINK_Y = 0.05; // collapsed height: only 5% of the card shows (width is never touched)

const PULL_RANGE = 0.6; // drag distance (fraction of card HEIGHT) that counts as a full pull
/** Cord/bead dimensions are fractions of the card's WIDTH — stable, since the card's height now
 *  flexes to fill the page. A matching gap is reserved below the card so the string stays visible. */
const CORD_BASE = 0.035; // resting cord length
const CORD_W = 0.008; // cord thickness
const BEAD = 0.05; // resting bead diameter
const BEAD_GROW = 1.0; // bead grows up to (1 + this)× while pulling

const SPRING = 'cubic-bezier(.22,1,.36,1)';
const CARD_MS = 520; // card shrink / restore
const SNAP_MS = 360; // bead + cord springing back on release
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

interface DrawstringCardProps {
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * The olive panel with a drawstring. The card only ever changes height (scaleY — its width is
 * fixed). Each pull of the string toggles it: first pull shrinks it, the next pull restores it
 * (tracked in `shrunk` state). While you pull, the bead (the circle) grows and the cord pays out;
 * both spring back when you let go. Hover/focus the string for a glow.
 */
export function DrawstringCard({ children, sx }: DrawstringCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardH, setCardH] = useState(0);
  const [cardW, setCardW] = useState(0);
  const [shrunk, setShrunk] = useState(false); // toggled on every pull
  const [pull, setPull] = useState(0); // live pull distance while dragging
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, startY: 0, range: 1 });

  // Measure the card's resting (untransformed) size; offset* ignore the scale transform.
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => {
      setCardH(el.offsetHeight);
      setCardW(el.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onPointerDown = useCallback((e: ReactPointerEvent) => {
    const h = cardRef.current?.offsetHeight ?? 0;
    drag.current = { active: true, startY: e.clientY, range: h * PULL_RANGE || 1 };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    setPull(clamp(e.clientY - d.startY, 0, d.range)); // pull down → cord pays out + bead grows
  }, []);

  const onPointerUp = useCallback((e: ReactPointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
    setPull(0); // bead + cord spring back
    setShrunk((s) => !s); // each pull toggles shrink ↔ regular
  }, []);

  // An aborted gesture (touch stolen, pointer lost) is not a pull — reset without toggling.
  const onPointerCancel = useCallback((e: ReactPointerEvent) => {
    drag.current.active = false;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
    setPull(0);
  }, []);

  const onKeyDown = useCallback((e: ReactKeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      setShrunk((s) => !s);
      e.preventDefault();
    }
  }, []);

  const scaleY = shrunk ? SHRINK_Y : 1;
  // top edge stays put, bottom collapses upward — how far the bottom (and the string) rises:
  const collapseOffset = (1 - scaleY) * cardH;
  const beadScale = 1 + (dragging ? (pull / (cardH * PULL_RANGE || 1)) * BEAD_GROW : 0);
  const restBead = cardW * BEAD;
  const beadSize = restBead * beadScale;
  // the cord (string) only shows while you're actually pulling; at rest just the bead is visible
  const cordLen = dragging ? cardW * CORD_BASE + pull : 0;
  const cordW = cardW * CORD_W;
  const motion = dragging ? 'none' : `${SNAP_MS}ms ${SPRING}`;
  const beadShadow = `0 4px 12px ${alpha(palette.brown, 0.4)}`;
  const glow = `${beadShadow}, 0 0 0 ${Math.max(cordW, 2)}px ${alpha(palette.gold, 0.35)}, 0 0 ${
    restBead * 0.7
  }px ${alpha(palette.gold, 0.85)}`;

  return (
    <Box sx={{ width: '92%', ...sx }}>
      {/* inner positioning context — keeps the drawstring glued to the card's bottom regardless of
          any padding/margins applied to the outer wrapper above (which carries the incoming sx) */}
      <Box sx={{ position: 'relative' }}>
        {/* the card — only its height changes (scaleY); width is fixed. Anchored at the TOP, so the
            top edge stays put and the bottom edge collapses upward. */}
        <Box
          ref={cardRef}
        sx={{
          width: '100%',
          minHeight: 'clamp(380px, 56vh, 600px)',
          bgcolor: palette.oliveSoft,
          border: `6px solid ${palette.olive}`,
          borderRadius: '32px',
          boxShadow: `0 14px 36px ${alpha(palette.brown, 0.12)}`,
          transform: `scaleY(${scaleY})`,
          transformOrigin: 'top center',
          transition: `transform ${CARD_MS}ms ${SPRING}`,
          willChange: 'transform',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        {children}
      </Box>

      {/* drawstring — cord + bead; rides up with the card's collapsing bottom so it stays attached */}
      <Box
        sx={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: `translate(-50%, ${-collapseOffset}px)`,
          transition: `transform ${CARD_MS}ms ${SPRING}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          '&:hover .ds-bead': { boxShadow: glow },
          '&:hover .ds-cord': {
            boxShadow: `0 0 ${Math.max(restBead * 0.4, 6)}px ${alpha(palette.gold, 0.7)}`,
          },
        }}
      >
        <Box
          className="ds-cord"
          sx={{
            width: cordW,
            height: cordLen,
            opacity: dragging ? 1 : 0, // hidden until you grab the bead
            bgcolor: palette.brown,
            borderRadius: 999,
            transition: `height ${motion}, opacity ${motion}, box-shadow 200ms ease`,
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          }}
        />
        <Box
          className="ds-bead"
          role="switch"
          aria-checked={shrunk}
          aria-label="Pull the drawstring to shrink the card; pull again to restore it"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onKeyDown={onKeyDown}
          sx={{
            width: beadSize,
            height: beadSize,
            borderRadius: '50%',
            bgcolor: palette.gold,
            border: `${Math.max(cordW, 1)}px solid ${palette.brown}`,
            boxShadow: beadShadow,
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            transition: `width ${motion}, height ${motion}, box-shadow 200ms ease`,
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            '&:hover': { boxShadow: glow },
            '&:focus-visible': { outline: 'none', boxShadow: glow },
          }}
        />
      </Box>
      </Box>
    </Box>
  );
}
