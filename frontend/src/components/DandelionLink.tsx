import type { MouseEvent } from 'react';
import { Link } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/material/styles';
import { palette } from '../theme/palette';
import { HIGHLIGHT_GLOW, HIGHLIGHT_SCALE } from '../theme/highlight';
import { DANDELION_PAGE_MM, DANDELION_STEM_X, DANDELION_STEM_Y } from '../assets';
import {
  DANDELION_BOTTOM_PCT,
  DANDELION_WIDTH,
  DANDELION_WIDTH_PCT,
  FLOWER_WIDTH_MM,
  LABEL_BOTTOM_VAR,
  NUDGE_SWINGS_DEG,
} from '../landingLayout';

const FLOWER_HEIGHT_MM = 65.392;

const LABEL_SIDE_PCT = 125;

const FLOWER_H_FRAC = FLOWER_HEIGHT_MM / (DANDELION_PAGE_MM * (1512 / 1890));

const WINDOW_SIDE_FLOWER_WIDTHS = 1.5;
const WINDOW_UP_FLOWER_HEIGHTS = 2;
const WINDOW_BELOW_STEM_FLOWER_HEIGHTS = (1 - DANDELION_STEM_Y) / FLOWER_H_FRAC;
const WINDOW_HEIGHT_FLOWER_HEIGHTS = WINDOW_UP_FLOWER_HEIGHTS + WINDOW_BELOW_STEM_FLOWER_HEIGHTS;
const WINDOW_STEM_Y_PCT = (WINDOW_UP_FLOWER_HEIGHTS / WINDOW_HEIGHT_FLOWER_HEIGHTS) * 100;

const NUDGE_PERIOD_MS = 8000;
const NUDGE_SWING_MS = 160;
const NUDGE_START_MS = NUDGE_PERIOD_MS - NUDGE_SWING_MS * NUDGE_SWINGS_DEG.length;

const nudgeAt = (ms: number) => `${Number(((ms / NUDGE_PERIOD_MS) * 100).toFixed(4))}%`;

const nudgeKeyframes = (sign: number) =>
  keyframes({
    '0%': { rotate: '0deg' },
    [nudgeAt(NUDGE_START_MS)]: { rotate: '0deg' },
    ...Object.fromEntries(
      NUDGE_SWINGS_DEG.map((deg, i) => [
        nudgeAt(NUDGE_START_MS + NUDGE_SWING_MS * (i + 1)),
        { rotate: `${sign * deg}deg` },
      ]),
    ),
  });

const NUDGE = nudgeKeyframes(1);
const NUDGE_MIRRORED = nudgeKeyframes(-1);

export function DandelionLink({
  frame,
  label,
  to,
  left,
  mirrored = false,
  departing = false,
  onActivate,
}: {
  frame: string;
  label: string;
  to: string;
  left: Partial<Record<'xs' | 'sm' | 'md', string>>;
  mirrored?: boolean;
  departing?: boolean;
  onActivate: (to: string) => void;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    onActivate(to);
  };

  return (
    <Box
      component={Link}
      to={to}
      onClick={handleClick}
      sx={{
        position: 'absolute',
        left,
        bottom: `${DANDELION_BOTTOM_PCT}%`,
        width: {
          xs: DANDELION_WIDTH,
          sm: `${DANDELION_WIDTH_PCT.sm}%`,
          md: `${DANDELION_WIDTH_PCT.md}%`,
        },
        aspectRatio: `${FLOWER_WIDTH_MM} / ${FLOWER_HEIGHT_MM}`,
        display: 'block',
        textDecoration: 'none',
        overflow: 'visible',
        zIndex: departing ? 2 : 0,
        '&:focus-visible .dandelion-label': { opacity: 1 },
        '&:active .dandelion-frame, &:focus-visible .dandelion-frame': HIGHLIGHT_SCALE,
        '&:active .dandelion-nudge, &:focus-visible .dandelion-nudge': { rotate: '0deg !important' },
        ...(!departing && {
          '&:active .dandelion-glow, &:focus-visible .dandelion-glow': HIGHLIGHT_GLOW,
        }),
        '@media (hover: hover)': {
          '&:hover .dandelion-label': { opacity: 1 },
          '&:hover .dandelion-frame': HIGHLIGHT_SCALE,
          '&:hover .dandelion-nudge': { rotate: '0deg !important' },
          ...(!departing && { '&:hover .dandelion-glow': HIGHLIGHT_GLOW }),
        },
        '&:focus-visible': {
          outline: `2px solid ${palette.gold}`,
          outlineOffset: '0.25em',
        },
      }}
    >
      <Typography
        className="dandelion-label"
        component="span"
        sx={{
          typography: { xs: 'h6', md: 'h4' },
          position: 'absolute',
          bottom: { xs: '30%', md: `var(${LABEL_BOTTOM_VAR})` },
          ...(mirrored
            ? {
                left: { xs: 'auto', sm: '50%', md: 'auto' },
                right: { xs: 0, sm: 'auto', md: `${LABEL_SIDE_PCT}%` },
              }
            : { left: { xs: 0, sm: '50%', md: `${LABEL_SIDE_PCT}%` } }),
          transform: { xs: 'translateY(50%)', sm: 'translate(-50%, 50%)', md: 'none' },
          px: { md: '0.4em' },
          py: { md: '0.1em' },
          borderRadius: { md: '0.35em' },
          bgcolor: { md: palette.brown },
          whiteSpace: 'nowrap',
          zIndex: 1,
          opacity: { xs: 1, md: departing ? 1 : 0 },
          '@media (hover: none)': { opacity: 1 },
          transition: 'opacity 200ms ease',
          color: { xs: palette.brown, md: palette.goldSoft },
          textShadow: {
            xs: `0 0 0.3em ${palette.cream}, 0 0 0.6em ${palette.cream}`,
            md: 'none',
          },
          pointerEvents: 'none',
        }}
      >
        {label}
      </Typography>

      <Box
        className="dandelion-glow"
        sx={{
          position: 'absolute',
          left: `${(0.5 - WINDOW_SIDE_FLOWER_WIDTHS) * 100}%`,
          top: `${(1 - WINDOW_UP_FLOWER_HEIGHTS) * 100}%`,
          width: `${WINDOW_SIDE_FLOWER_WIDTHS * 2 * 100}%`,
          height: `${WINDOW_HEIGHT_FLOWER_HEIGHTS * 100}%`,
          overflow: departing ? 'visible' : 'hidden',
          transition: 'filter 200ms ease',
          pointerEvents: 'none',
        }}
      >
        <Box
          className="dandelion-nudge"
          sx={{
            position: 'absolute',
            inset: 0,
            transform: mirrored ? 'scaleX(-1)' : 'none',
            transformOrigin: `50% ${WINDOW_STEM_Y_PCT}%`,
            animation: departing
              ? 'none'
              : `${mirrored ? NUDGE_MIRRORED : NUDGE} ${NUDGE_PERIOD_MS}ms ease-in-out infinite`,
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          <Box
            className="dandelion-frame"
            component="img"
            src={frame}
            alt=""
            draggable={false}
            sx={{
              position: 'absolute',
              left: '50%',
              top: `${WINDOW_STEM_Y_PCT}%`,
              width: `${(100 * (DANDELION_PAGE_MM / FLOWER_WIDTH_MM)) / (2 * WINDOW_SIDE_FLOWER_WIDTHS)}%`,
              transformOrigin: `${DANDELION_STEM_X * 100}% ${DANDELION_STEM_Y * 100}%`,
              transform: `translate(${-100 * DANDELION_STEM_X}%, ${-100 * DANDELION_STEM_Y}%)`,
              transition: 'scale 200ms ease',
              ...(departing && HIGHLIGHT_SCALE),
              pointerEvents: 'none',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
