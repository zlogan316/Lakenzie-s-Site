import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { palette } from '../theme/palette';
import { RibbonBanner } from '../components/RibbonBanner';
import { DrawstringCard } from '../components/DrawstringCard';

/** tiny inline SVG grain, tiled — no colors involved */
const NOISE_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** drifting clouds strip (served from /public). */
const CLOUD_URL = '/clouds.svg';
/** Tiles per reel. The strip is two identical reels; the track slides by exactly one reel for a
 *  seamless loop, so a reel must be at least one screen wide. Each tile is sized off the band
 *  height (so it scales with the viewport), and at ~0.28×band-height-per-tile this many reaches
 *  past even ultrawide aspect ratios. Extra tiles off-screen are clipped — cheap, one cached SVG. */
const CLOUD_TILES_PER_REEL = 16;

/** dandelion-heart-hill scene for the bottom of the page (served from /public) */
const HILL_URL = 'url(/dandelion-heart-hill.svg)';

export function LandingPage() {
  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(180deg, ${palette.navy} 1%, ${palette.brightBlue} 29%, ${palette.teal} 80%)`,
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

      {/* dandelion-heart-hill — full-width scene across the bottom half of the page, painted over
          the gradient but BEHIND the clouds and content. The clouds drift in front of it; it stays
          visible through the gaps between them. Spans 100% width (height follows the artwork's
          aspect) and is anchored to the bottom edge. */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -50,
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: HILL_URL,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center bottom',
          backgroundSize: '100% auto',
        }}
      />

      {/* drifting clouds strip — full-width, sits from 10% of the page, behind content.
          A flat marquee: two identical reels of cloud tiles in one row; the track slides
          left→right by exactly one reel and loops, so it reads like an endless repeating sign.
          Every size is relative (band as a % of the page, tiles as a % of the band) so it scales
          with the viewport. Band height sets the cloud scale: 80% renders them at 4× the original. */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '5%',
          height: '80%',
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            width: 'max-content',
            animation: 'cloudDrift 600s linear infinite',
            '@keyframes cloudDrift': {
              from: { transform: 'translateX(-50%)' },
              to: { transform: 'translateX(0)' },
            },
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
              transform: 'translateX(-50%)',
            },
          }}
        >
          {Array.from({ length: 2 * CLOUD_TILES_PER_REEL }).map((_, i) => (
            <Box
              key={i}
              component="img"
              src={CLOUD_URL}
              alt=""
              draggable={false}
              sx={{ height: '100%', width: 'auto', display: 'block', flex: 'none' }}
            />
          ))}
        </Box>
      </Box>

      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          pt: { xs: 6, md: 9 },
          pb: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* center stack takes ~80% of the page width and fills the height */}
        <Box
          sx={{
            width: '80%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <RibbonBanner title="LaKenzie's Lovely Website" />

          {/* empty framed panel — floats with flexible space above and below; pull the drawstring to collapse it */}
          <DrawstringCard sx={{ my: 'auto', paddingBottom: 10}} />
        </Box>
      </Container>
    </Box>
  );
}
