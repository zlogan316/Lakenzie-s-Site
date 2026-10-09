import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { createSvgIcon } from '@mui/material/utils';
import { palette } from '../theme/palette';
import { fontTitle } from '../theme/theme';

const ChevronRightRoundedIcon = createSvgIcon(
  <path d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01" />,
  'ChevronRightRounded',
);

const ROW_SX = {
  flex: 1,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '0.9em',
  py: '0.9em',
  px: 0,
  border: 0,
  borderTop: `0.12em solid ${alpha(palette.goldSoft, 0.3)}`,
  bgcolor: 'transparent',
  font: 'inherit',
  textAlign: 'left',
} as const;

const BUTTON_SX = {
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  transition: 'background-color 200ms ease',
  '&:active': { bgcolor: alpha(palette.goldSoft, 0.08) },
  '@media (hover: hover)': { '&:hover': { bgcolor: alpha(palette.goldSoft, 0.08) } },
  '&:focus-visible': { outline: `2px solid ${palette.goldSoft}`, outlineOffset: '0.2em' },
} as const;

const PLACEHOLDER_SX = { borderTopStyle: 'dashed' } as const;

const ICON_SX = {
  flexShrink: 0,
  width: '3em',
  aspectRatio: '1 / 1',
  display: 'flex',
} as const;

const TEXT_SX = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2em',
} as const;

const TITLE_SX = {
  fontFamily: fontTitle,
  fontSize: '1.35em',
  fontWeight: 400,
  lineHeight: 1.15,
  color: palette.goldSoft,
} as const;

const PLACEHOLDER_TITLE_SX = { color: palette.oliveSoft } as const;

const DESCRIPTION_SX = {
  fontSize: '1em',
  fontWeight: 600,
  lineHeight: 1.45,
  textWrap: 'pretty',
  color: palette.cream,
} as const;

const CHEVRON_SX = { flexShrink: 0, fontSize: '1.6em', color: palette.goldSoft } as const;

export function GameCard({
  title,
  description,
  icon,
  onOpen,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  onOpen?: () => void;
}) {
  const content = (
    <>
      <Box aria-hidden sx={ICON_SX}>
        {icon}
      </Box>

      <Box sx={TEXT_SX}>
        <Typography component="span" sx={[TITLE_SX, !onOpen && PLACEHOLDER_TITLE_SX]}>
          {title}
        </Typography>
        <Typography component="span" sx={DESCRIPTION_SX}>
          {description}
        </Typography>
      </Box>
    </>
  );

  if (!onOpen) return <Box sx={[ROW_SX, PLACEHOLDER_SX]}>{content}</Box>;

  return (
    <Box component="button" type="button" onClick={onOpen} sx={[ROW_SX, BUTTON_SX]}>
      {content}
      <ChevronRightRoundedIcon sx={CHEVRON_SX} />
    </Box>
  );
}
