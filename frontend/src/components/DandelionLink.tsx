import type { MouseEvent } from 'react';
import { Link } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { palette } from '../theme/palette';
import { DANDELION_PAGE_MM } from '../assets';
import type { DandelionFrame } from '../assets';

const STEM_ANCHOR_Y = 0.877;

const FLOWER_WIDTH_MM = 27.675169;

const FRAME_SCALE = DANDELION_PAGE_MM / FLOWER_WIDTH_MM;

const FLOWER_ASPECT = '27.675 / 65.392';

const FLOWER_WIDTH = { xs: '20%', sm: '10%', md: '7.5%' } as const;

const DANDELION_BOTTOM_PCT = -3;

const HOVER_SCALE = 1.04;

const LABEL_POS = { bottom: 75.7, side: 125 };

const FLOWER_HEIGHT_MM = 65.392;

const FRAME_H_OVER_W = 1512 / 1890;

const FLOWER_W_FRAC = FLOWER_WIDTH_MM / DANDELION_PAGE_MM;
const FLOWER_H_FRAC = FLOWER_HEIGHT_MM / (DANDELION_PAGE_MM * FRAME_H_OVER_W);

const CLIP_SIDE_FLOWER_WIDTHS = 1.5;
const CLIP_TOP_FLOWER_HEIGHTS = 1.0;

type Props = {
  frame: DandelionFrame;
  label: string;
  to: string;
  left: string | Partial<Record<'xs' | 'sm' | 'md', string>>;
  mirrored?: boolean;
  departing?: boolean;
  onActivate: (to: string) => void;
};

export function DandelionLink({
  frame,
  label,
  to,
  left,
  mirrored = false,
  departing = false,
  onActivate,
}: Props) {
  const clipLeftPct = (frame.stemX - FLOWER_W_FRAC * CLIP_SIDE_FLOWER_WIDTHS) * 100;
  const clipRightPct = (1 - frame.stemX - FLOWER_W_FRAC * CLIP_SIDE_FLOWER_WIDTHS) * 100;
  const clipTopPct = (STEM_ANCHOR_Y - FLOWER_H_FRAC * (1 + CLIP_TOP_FLOWER_HEIGHTS)) * 100;

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
        width: FLOWER_WIDTH,
        aspectRatio: FLOWER_ASPECT,
        display: 'block',
        textDecoration: 'none',
        overflow: 'visible',
        zIndex: departing ? 2 : 0,
        '&:hover .dandelion-label, &:focus-visible .dandelion-label': { opacity: 1 },
        '&:hover .dandelion-frame, &:focus-visible .dandelion-frame': {
          filter: `drop-shadow(0 0 0.4em ${palette.goldSoft})`,
          scale: String(HOVER_SCALE),
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
          bottom: { xs: '30%', md: `${LABEL_POS.bottom}%` },
          ...(mirrored
            ? { left: { xs: '50%', md: 'auto' }, right: { xs: 'auto', md: `${LABEL_POS.side}%` } }
            : { left: { xs: '50%', md: `${LABEL_POS.side}%` } }),
          transform: { xs: 'translate(-50%, 50%)', md: 'translateY(50%)' },
          whiteSpace: 'nowrap',
          zIndex: 1,
          opacity: { xs: 1, md: 0 },
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
        src={frame.src}
        alt=""
        draggable={false}
        sx={{
          position: 'absolute',
          left: '50%',
          top: '100%',
          width: `${100 * FRAME_SCALE}%`,
          transformOrigin: `${frame.stemX * 100}% ${STEM_ANCHOR_Y * 100}%`,
          transform:
            `translate(${-100 * frame.stemX}%, ${-100 * STEM_ANCHOR_Y}%)` +
            (mirrored ? ' scaleX(-1)' : ''),
          transition: 'filter 200ms ease, scale 200ms ease',
          clipPath: departing
            ? 'none'
            : `inset(${clipTopPct}% ${clipRightPct}% 0% ${clipLeftPct}%)`,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}
