import type { CSSProperties } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { GameCard } from '../components/GameCard';

const HERO_NAME = 'LAKENZIE';

/** tiny inline SVG grain, tiled — no colors involved */
const NOISE_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** floating background tiles: letters of the games to come */
const FLOATERS = [
  { letter: 'W', top: '14%', left: '64%', size: 44, delay: '0s', duration: '6.5s', rotate: '-9deg', group: 2 },
  { letter: 'O', top: '36%', left: '88%', size: 34, delay: '1.2s', duration: '7.6s', rotate: '7deg', group: 1 },
  { letter: 'R', top: '70%', left: '78%', size: 40, delay: '0.6s', duration: '5.8s', rotate: '-5deg', group: 0 },
  { letter: 'D', top: '82%', left: '8%', size: 36, delay: '2s', duration: '7s', rotate: '8deg', group: 3 },
  { letter: 'C', top: '12%', left: '6%', size: 30, delay: '0.9s', duration: '8.2s', rotate: '-12deg', group: 1 },
  { letter: 'N', top: '55%', left: '3%', size: 42, delay: '1.6s', duration: '6.2s', rotate: '6deg', group: 2 },
] as const;

export function LandingPage() {
  const theme = useTheme();
  const games = theme.palette.games;
  const inkOnTile = theme.palette.background.paper; // warm white letters on colored tiles
  const brown = theme.palette.text.primary;

  // hand-picked mix of olive / gold / teal / coral across the 8 letters
  const tileColors = [
    games.correct, // L olive
    games.present, // A gold
    games.groups[2], // K teal
    games.groups[3], // E coral
    games.present, // N gold
    games.groups[2], // Z teal
    games.correct, // I olive
    games.groups[3], // E coral
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
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

      {/* floating mini-tiles, behind content */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          display: { xs: 'none', sm: 'block' },
          '@keyframes float-bob': {
            from: { transform: 'translateY(0)' },
            to: { transform: 'translateY(-14px)' },
          },
        }}
      >
        {FLOATERS.map((f) => (
          <Box
            key={`${f.letter}-${f.top}`}
            sx={{
              position: 'absolute',
              top: f.top,
              left: f.left,
              width: f.size,
              height: f.size,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '22%',
              bgcolor: games.groups[f.group],
              color: inkOnTile,
              fontWeight: 700,
              fontSize: f.size * 0.5,
              opacity: 0.16,
              rotate: f.rotate,
              animation: `float-bob ${f.duration} ease-in-out ${f.delay} infinite alternate`,
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          >
            {f.letter}
          </Box>
        ))}
      </Box>

      {/* ---- hero, off-center left ---- */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: 660, pt: { xs: 6, md: 11 }, pb: { xs: 6, md: 8 } }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 0.75, sm: 1 },
              perspective: '900px',
              mb: { xs: 3.5, md: 4.5 },
              '@keyframes tile-flip': {
                '0%': {
                  transform: 'rotateX(0deg)',
                  backgroundColor: 'transparent',
                  borderColor: alpha(brown, 0.3),
                  color: alpha(brown, 0.85),
                },
                '45%': {
                  transform: 'rotateX(90deg)',
                  backgroundColor: 'transparent',
                  borderColor: alpha(brown, 0.3),
                  color: alpha(brown, 0.85),
                },
                '55%': {
                  transform: 'rotateX(90deg)',
                  backgroundColor: 'var(--tile)',
                  borderColor: 'transparent',
                  color: inkOnTile,
                },
                '100%': {
                  transform: 'rotateX(0deg)',
                  backgroundColor: 'var(--tile)',
                  borderColor: 'transparent',
                  color: inkOnTile,
                },
              },
            }}
          >
            {HERO_NAME.split('').map((letter, i) => (
              <Box
                key={i}
                component="span"
                style={{ '--tile': tileColors[i], animationDelay: `${0.3 + i * 0.14}s` } as CSSProperties}
                sx={{
                  width: 'clamp(40px, 9vw, 72px)',
                  height: 'clamp(40px, 9vw, 72px)',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '16%',
                  border: '2.5px solid',
                  fontWeight: 700,
                  fontSize: 'clamp(1.35rem, 4.5vw, 2.5rem)',
                  lineHeight: 1,
                  animation: 'tile-flip 680ms cubic-bezier(0.45, 0.05, 0.3, 1) both',
                  boxShadow: `0 4px 14px ${alpha(brown, 0.12)}`,
                  '@media (prefers-reduced-motion: reduce)': {
                    animation: 'none',
                    backgroundColor: 'var(--tile)',
                    borderColor: 'transparent',
                    color: inkOnTile,
                  },
                }}
              >
                {letter}
              </Box>
            ))}
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: 'clamp(2.1rem, 4.6vw, 3.3rem)',
              maxWidth: '18ch',
              mb: 2,
            }}
          >
            a little corner of the internet,{' '}
            <Box component="em" sx={{ color: 'secondary.main', fontStyle: 'italic' }}>
              just for you
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', maxWidth: '44ch', fontSize: '1.05rem' }}
          >
            two tiny games are on their way — little daily puzzles, picked with you in mind.
            check back soon, or just enjoy the view.
          </Typography>
        </Box>
      </Container>

      {/* ---- game cards, staggered ---- */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pb: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: 6 },
            alignItems: { xs: 'stretch', md: 'flex-start' },
            ml: { md: '10%' },
            maxWidth: { xs: 420, md: 'none' },
          }}
        >
          <GameCard
            title="word guess"
            description="five letters, six tries, one word picked just for you."
            hoverTilt={-1.4}
            motif={
              <Box sx={{ display: 'flex', gap: 0.75 }}>
                {(
                  [
                    ['Y', games.correct],
                    ['A', games.present],
                    ['Y', games.absent],
                  ] as const
                ).map(([letter, color], i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 36,
                      height: 36,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '20%',
                      bgcolor: color,
                      color: inkOnTile,
                      fontWeight: 700,
                      fontSize: '1.05rem',
                    }}
                  >
                    {letter}
                  </Box>
                ))}
              </Box>
            }
          />

          {/* second card sits lower on desktop for a staggered, editorial feel */}
          <Box sx={{ mt: { xs: 0, md: 9 } }}>
            <GameCard
              title="connections"
              description="sixteen words, four secret groups — find what belongs together."
              hoverTilt={1.2}
              motif={
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 26px)',
                    gap: 0.75,
                    rotate: '-3deg',
                    width: 'fit-content',
                  }}
                >
                  {games.groups.map((color, i) => (
                    <Box key={i} sx={{ width: 26, height: 26, borderRadius: '24%', bgcolor: color }} />
                  ))}
                </Box>
              }
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
