import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { fontDisplay } from '../theme/theme';

interface GameCardProps {
  title: string;
  description: string;
  /** small decorative motif rendered above the title */
  motif: ReactNode;
  /** degrees the card tilts toward on hover (sign controls direction) */
  hoverTilt?: number;
}

export function GameCard({ title, description, motif, hoverTilt = -1.4 }: GameCardProps) {
  return (
    <Card
      sx={(theme) => ({
        position: 'relative',
        overflow: 'visible', // let the ribbon poke past the edge
        px: { xs: 3, sm: 4 },
        py: { xs: 3.5, sm: 4.5 },
        width: { xs: '100%', sm: 340 },
        cursor: 'default',
        transition: 'transform 260ms ease, box-shadow 260ms ease',
        '&:hover': {
          transform: `translateY(-8px) rotate(${hoverTilt}deg)`,
          boxShadow: `0 18px 44px ${alpha(theme.palette.text.primary, 0.18)}`,
        },
      })}
    >
      <Box
        component="span"
        sx={(theme) => ({
          position: 'absolute',
          top: -12,
          right: -10,
          transform: 'rotate(4deg)',
          bgcolor: 'games.present',
          color: 'text.primary',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          px: 1.5,
          py: 0.5,
          borderRadius: 999,
          boxShadow: `0 4px 12px ${alpha(theme.palette.text.primary, 0.18)}`,
        })}
      >
        coming soon
      </Box>

      <Box sx={{ mb: 2.5 }}>{motif}</Box>

      <Typography
        variant="h3"
        sx={{ fontFamily: fontDisplay, fontSize: '1.65rem', mb: 1, lineHeight: 1.2 }}
      >
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {description}
      </Typography>
    </Card>
  );
}
