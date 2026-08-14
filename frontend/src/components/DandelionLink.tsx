import type { MouseEvent } from 'react';
import { Link } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { palette } from '../theme/palette';
import { DANDELION_PAGE_MM, DANDELION_STEM_X } from '../assets';

const STEM_ANCHOR_Y = 0.877;

const FLOWER_WIDTH_MM = 27.675169;
const FLOWER_HEIGHT_MM = 65.392;

const HIGHLIGHT_FRAME = {
  filter: `drop-shadow(0 0 0.4em ${palette.goldSoft})`,
  scale: '1.04',
};

const LABEL_SIDE_PCT = 125;

const FLOWER_W_FRAC = FLOWER_WIDTH_MM / DANDELION_PAGE_MM;
const FLOWER_H_FRAC = FLOWER_HEIGHT_MM / (DANDELION_PAGE_MM * (1512 / 1890));

const CLIP_SIDE_FLOWER_WIDTHS = 1.5;

const clipLeftPct = (DANDELION_STEM_X - FLOWER_W_FRAC * CLIP_SIDE_FLOWER_WIDTHS) * 100;
const clipRightPct = (1 - DANDELION_STEM_X - FLOWER_W_FRAC * CLIP_SIDE_FLOWER_WIDTHS) * 100;
const clipTopPct = (STEM_ANCHOR_Y - FLOWER_H_FRAC * 2) * 100;

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
        '&:active .dandelion-frame, &:focus-visible .dandelion-frame': HIGHLIGHT_FRAME,
        '@media (hover: hover)': {
          '&:hover .dandelion-label': { opacity: 1 },
          '&:hover .dandelion-frame': HIGHLIGHT_FRAME,
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
        className="dandelion-frame"
        component="img"
        src={frame}
        alt=""
        draggable={false}
        sx={{
          position: 'absolute',
          left: '50%',
          top: '100%',
          width: `${100 * (DANDELION_PAGE_MM / FLOWER_WIDTH_MM)}%`,
          transformOrigin: `${DANDELION_STEM_X * 100}% ${STEM_ANCHOR_Y * 100}%`,
          transform:
            `translate(${-100 * DANDELION_STEM_X}%, ${-100 * STEM_ANCHOR_Y}%)` +
            (mirrored ? ' scaleX(-1)' : ''),
          transition: 'filter 200ms ease, scale 200ms ease',
          ...(departing && HIGHLIGHT_FRAME),
          clipPath: departing
            ? 'none'
            : `inset(${clipTopPct}% ${clipRightPct}% 0% ${clipLeftPct}%)`,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}
