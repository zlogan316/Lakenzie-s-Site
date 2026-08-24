import type { MouseEvent } from 'react';
import { Link } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { palette } from '../theme/palette';
import { DANDELION_PAGE_MM, DANDELION_STEM_X } from '../assets';

const STEM_ANCHOR_Y = 0.877;

const FLOWER_WIDTH_MM = 27.675169;
const FLOWER_HEIGHT_MM = 65.392;

const HIGHLIGHT_GLOW = {
  filter: `drop-shadow(0 0 0.4em ${palette.goldSoft})`,
};

const HIGHLIGHT_SCALE = {
  scale: '1.04',
};

const LABEL_SIDE_PCT = 125;

const FLOWER_H_FRAC = FLOWER_HEIGHT_MM / (DANDELION_PAGE_MM * (1512 / 1890));

const WINDOW_SIDE_FLOWER_WIDTHS = 1.5;
const WINDOW_UP_FLOWER_HEIGHTS = 2;
const WINDOW_BELOW_STEM_FLOWER_HEIGHTS = (1 - STEM_ANCHOR_Y) / FLOWER_H_FRAC;
const WINDOW_HEIGHT_FLOWER_HEIGHTS = WINDOW_UP_FLOWER_HEIGHTS + WINDOW_BELOW_STEM_FLOWER_HEIGHTS;

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
        bottom: '-3%',
        width: { xs: '20%', sm: '10%', md: '7.5%' },
        aspectRatio: `${FLOWER_WIDTH_MM} / ${FLOWER_HEIGHT_MM}`,
        display: 'block',
        textDecoration: 'none',
        overflow: 'visible',
        zIndex: departing ? 2 : 0,
        '&:focus-visible .dandelion-label': { opacity: 1 },
        '&:active .dandelion-frame, &:focus-visible .dandelion-frame': HIGHLIGHT_SCALE,
        ...(!departing && {
          '&:active .dandelion-glow, &:focus-visible .dandelion-glow': HIGHLIGHT_GLOW,
        }),
        '@media (hover: hover)': {
          '&:hover .dandelion-label': { opacity: 1 },
          '&:hover .dandelion-frame': HIGHLIGHT_SCALE,
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
          bottom: { xs: '30%', md: '75.7%' },
          ...(mirrored
            ? { left: { xs: '50%', md: 'auto' }, right: { xs: 'auto', md: `${LABEL_SIDE_PCT}%` } }
            : { left: { xs: '50%', md: `${LABEL_SIDE_PCT}%` } }),
          transform: { xs: 'translate(-50%, 50%)', md: 'translateY(50%)' },
          whiteSpace: 'nowrap',
          zIndex: 1,
          opacity: { xs: 1, md: departing ? 1 : 0 },
          '@media (hover: none)': { opacity: 1 },
          transition: 'opacity 200ms ease',
          color: palette.brown,
          textShadow: `0 0 0.3em ${palette.cream}, 0 0 0.6em ${palette.cream}`,
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
          sx={{
            position: 'absolute',
            inset: 0,
            transform: mirrored ? 'scaleX(-1)' : 'none',
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
              top: `${(WINDOW_UP_FLOWER_HEIGHTS / WINDOW_HEIGHT_FLOWER_HEIGHTS) * 100}%`,
              width: `${(100 * (DANDELION_PAGE_MM / FLOWER_WIDTH_MM)) / (2 * WINDOW_SIDE_FLOWER_WIDTHS)}%`,
              transformOrigin: `${DANDELION_STEM_X * 100}% ${STEM_ANCHOR_Y * 100}%`,
              transform: `translate(${-100 * DANDELION_STEM_X}%, ${-100 * STEM_ANCHOR_Y}%)`,
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
