import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { palette } from '../theme/palette';

export function GameCard({
  title,
  description,
  icon,
  onOpen,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  onOpen: () => void;
}) {
  return (
    <Card>
      <Box
        component="button"
        type="button"
        onClick={onOpen}
        sx={{
          width: '100%',
          boxSizing: 'border-box',
          border: 0,
          background: 'none',
          font: 'inherit',
          color: 'inherit',
          textAlign: 'inherit',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          display: 'flex',
          alignItems: 'stretch',
          gap: { xs: 2, sm: 2.5 },
          p: { xs: 2, sm: 2.5 },
          '&:focus-visible': {
            outline: `2px solid ${palette.teal}`,
            outlineOffset: '-2px',
          },
        }}
      >
        <Box
          aria-hidden
          sx={{
            aspectRatio: '1 / 1',
            alignSelf: 'stretch',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1.25,
            borderRadius: 1,
            bgcolor: palette.cream,
            border: `1px solid ${alpha(palette.brown, 0.08)}`,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography
            variant="h3"
            component="span"
            sx={{ fontSize: '1.4rem', lineHeight: 1.25, mb: 0.5 }}
          >
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
