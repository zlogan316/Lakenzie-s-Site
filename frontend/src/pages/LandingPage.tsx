import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

/** tiny inline SVG grain, tiled — no colors involved */
const NOISE_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function LandingPage() {
  const theme = useTheme();
  const games = theme.palette.games;

  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        // soft radial glows over the cream base
        backgroundImage: `
          radial-gradient(ellipse 60% 45% at 82% 8%, ${alpha(games.groups[2], 0.2)}, transparent 70%),
          radial-gradient(ellipse 50% 40% at 4% 42%, ${alpha(games.present, 0.18)}, transparent 70%),
          radial-gradient(ellipse 55% 45% at 72% 96%, ${alpha(games.groups[3], 0.1)}, transparent 70%)
        `,
      }}
    >
      {/* grain overlay */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: NOISE_URL,
          opacity: 0.05,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', py: { xs: 10, md: 14 } }}>
        <Typography
          variant="h1"
          sx={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', mb: 2.5 }}
        >
          Lakenzie&apos;s Lovely Website
        </Typography>
        <Typography
          variant="h3"
          component="p"
          sx={{
            color: 'secondary.main',
            fontStyle: 'italic',
            fontSize: 'clamp(1.3rem, 3vw, 2rem)',
          }}
        >
          Coming Soon...
        </Typography>
      </Container>
    </Box>
  );
}
