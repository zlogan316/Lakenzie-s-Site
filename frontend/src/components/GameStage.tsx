import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { palette } from '../theme/palette';
import { fontTitle } from '../theme/theme';
import { HIGHLIGHT_SCALE } from '../theme/highlight';
import {
  DANDELION_FRAME_SX,
  FRAME_INSET,
  FRAME_SIZE,
  FRAME_TITLE_SX,
  FRAME_TYPE,
} from '../theme/dandelionFrame';
import { BackLink } from './BackLink';

const STAGE_SX = {
  position: 'relative',
  flex: 1,
  minHeight: 0,
  containerType: 'size',
  '--type': FRAME_TYPE,
} as const;

const CONTENT_SX = {
  ...DANDELION_FRAME_SX,
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'auto',
  fontSize: 'var(--type)',
  color: palette.brown,
  px: '4%',
  pt: `calc(${FRAME_SIZE} * 0.2)`,
  pb: '1em',
} as const;

const HEADER_SX = {
  flexShrink: 0,
  width: '100%',
  minHeight: '3em',
  boxSizing: 'border-box',
  px: '3em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

const TITLE_SX = {
  ...FRAME_TITLE_SX,
  fontSize: { xs: '1.6em', sm: '1.9em' },
  lineHeight: 1.1,
  textAlign: 'center',
} as const;

const BUTTON_SX = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: '1.4em',
  py: '0.55em',
  border: 0,
  borderRadius: '0.35em',
  fontFamily: fontTitle,
  fontSize: '1.2em',
  fontWeight: 400,
  color: palette.brownDeep,
  bgcolor: palette.gold,
  cursor: 'pointer',
  transition: 'scale 200ms ease',
  WebkitTapHighlightColor: 'transparent',
  '&:active': HIGHLIGHT_SCALE,
  '@media (hover: hover)': { '&:hover': HIGHLIGHT_SCALE },
  '&:focus-visible': { outline: `2px solid ${palette.goldSoft}`, outlineOffset: '0.2em' },
} as const;

export function GameStage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box sx={STAGE_SX}>
      <Box sx={CONTENT_SX}>
        <Box sx={HEADER_SX}>
          <Typography id="page-heading" tabIndex={-1} component="h1" variant="h3" sx={TITLE_SX}>
            {title}
          </Typography>
        </Box>
        {children}
      </Box>
      <BackLink to="/games" label="Back to games" inset={FRAME_INSET} />
    </Box>
  );
}

export function GameButton({
  children,
  onClick,
  autoFocus = false,
}: {
  children: ReactNode;
  onClick: () => void;
  autoFocus?: boolean;
}) {
  return (
    <Box component="button" type="button" autoFocus={autoFocus} onClick={onClick} sx={BUTTON_SX}>
      {children}
    </Box>
  );
}
