import { Link } from 'react-router';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { createSvgIcon } from '@mui/material/utils';
import { palette } from '../theme/palette';
import { HIGHLIGHT_GLOW, HIGHLIGHT_SCALE } from '../theme/highlight';

const ArrowBackRoundedIcon = createSvgIcon(
  <path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1" />,
  'ArrowBackRounded',
);

const INSET_EM = 0.75;
const PADDING_EM = 0.3;
const ICON_EM = 2.4;

export const BACK_LINK_BOTTOM = `calc((${INSET_EM} + ${ICON_EM} + 2 * ${PADDING_EM}) * var(--type))`;

const HIGHLIGHT = { ...HIGHLIGHT_SCALE, ...HIGHLIGHT_GLOW };

const BACK_LINK_SX = {
  position: 'absolute',
  zIndex: (theme: Theme) => theme.zIndex.modal + 1,
  display: 'flex',
  p: `${PADDING_EM}em`,
  borderRadius: '50%',
  fontSize: 'var(--type)',
  color: palette.goldSoft,
  stroke: palette.brown,
  strokeWidth: 2,
  strokeLinejoin: 'round',
  paintOrder: 'stroke',
  filter: `drop-shadow(0 0.1em 0.15em ${alpha(palette.navy, 0.45)})`,
  transition: 'scale 200ms ease, filter 200ms ease',
  WebkitTapHighlightColor: 'transparent',
  '&:active, &:focus-visible': HIGHLIGHT,
  '@media (hover: hover)': { '&:hover': HIGHLIGHT },
  '&:focus-visible': { outline: `2px solid ${palette.gold}`, outlineOffset: '0.1em' },
} as const;

export function BackLink({
  to,
  label,
  inset = `${INSET_EM}em`,
}: {
  to: string;
  label: string;
  inset?: string;
}) {
  return (
    <Box
      component={Link}
      to={to}
      aria-label={label}
      sx={[BACK_LINK_SX, { top: inset, left: inset }]}
    >
      <ArrowBackRoundedIcon sx={{ fontSize: `${ICON_EM}em` }} />
    </Box>
  );
}
