import { memo, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { palette } from '../theme/palette';
import { assets, cssUrl } from '../assets';
import { RibbonBanner, RIBBON_ASPECT } from '../components/RibbonBanner';
import { DrawstringCard } from '../components/DrawstringCard';
import { DandelionLink } from '../components/DandelionLink';
import {
  useDepartureClock,
  DEPARTURE_MS,
  REDUCED_DEPARTURE_MS,
} from '../hooks/useDepartureClock';

const CLOUD_TILES_PER_REEL = 16;

const CLOUD_BAND_TOP_PCT = { xs: 5, sm: -4 };
const CLOUD_BAND_HEIGHT_PCT = { xs: 38, sm: 60 };
const CLOUD_ART_BOTTOM = 0.6;

const CARD_CLOUD_OVERLAP_PCT = 3;

const cardTopPct = (bandTopPct: number, bandHeightPct: number) =>
  bandTopPct + bandHeightPct * CLOUD_ART_BOTTOM - CARD_CLOUD_OVERLAP_PCT;

const CARD_TOP_PCT = {
  xs: cardTopPct(CLOUD_BAND_TOP_PCT.xs, CLOUD_BAND_HEIGHT_PCT.xs),
  sm: cardTopPct(CLOUD_BAND_TOP_PCT.sm, CLOUD_BAND_HEIGHT_PCT.sm),
};
const CARD_COPY = `What does it mean to be weird? Is it a way to describe someone wearing funny clothes and honking a horn? Maybe something you would use to describe a thingamajig, doohickey or whatchamacallit? Or maybe the word is so untamed that you can't pin it down to one definition. I would say that my own personal meaning doesn't fit into any of those bins! Instead, weird is a way of being, something that makes a person stand out in a crowd or the perfect item stand out in a thrift store! It's a word that's unique and full of quirk! And if you've ever been described with it, you might have the same diagnosis... but that's not a bad thing (or at the least, doesn't have to be). You have to harness your weirdness, not for clout or attention but instead for things you're passionate about. Soon you might make a difference, and no matter how small it might seem to others, the true difference is the one you make to yourself.`;

const CARD_COPY_SX = {
  color: palette.brown,
  lineHeight: { xs: 1.4, sm: 1.6 },
  fontWeight: 500,
  textAlign: 'center',
  fontSize: { xs: '5cqw', sm: '3.8cqw', md: '2.6cqw', lg: '2.1cqw', xl: '1.9cqw' },
} as const;

const CARD_PEEK = (
  <Typography sx={CARD_COPY_SX}>
    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
      Soon you might make a difference, and{' '}
    </Box>
    no matter how small it might seem to others, the true difference is the one you make to
    yourself.
  </Typography>
);

const DANDELIONS = [
  { to: '/games', label: 'Games', left: { xs: '8%', sm: '11%', md: '12%' }, mirrored: false },
  { to: '/fun-facts', label: 'Fun Facts', left: { xs: '72%', sm: '79%', md: '80.5%' }, mirrored: true },
] as const;

let framesWarmed = false;
const loadedFrameSrcs = new Set<string>([assets.dandelionFrames[0]]);

const newestLoadedFrame = (frames: readonly string[], upTo: number) => {
  for (let i = upTo; i > 0; i -= 1) {
    if (loadedFrameSrcs.has(frames[i])) return frames[i];
  }
  return frames[0];
};

const CLOUD_BAND_SX = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: { xs: `${CLOUD_BAND_TOP_PCT.xs}%`, sm: `${CLOUD_BAND_TOP_PCT.sm}%` },
  height: { xs: `${CLOUD_BAND_HEIGHT_PCT.xs}%`, sm: `${CLOUD_BAND_HEIGHT_PCT.sm}%` },
  zIndex: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
} as const;

const CLOUD_TRACK_SX = {
  display: 'flex',
  height: '100%',
  width: 'max-content',
  animation: 'cloudDrift 600s steps(9000) infinite',
  '@keyframes cloudDrift': {
    from: { transform: 'translateX(-50%)' },
    to: { transform: 'translateX(0)' },
  },
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
    transform: 'translateX(-50%)',
  },
} as const;

const CLOUD_TILE_SX = { height: '100%', width: 'auto', display: 'block', flex: 'none' } as const;

const CloudStrip = memo(function CloudStrip() {
  return (
    <Box aria-hidden sx={CLOUD_BAND_SX}>
      <Box sx={CLOUD_TRACK_SX}>
        {Array.from({ length: 2 * CLOUD_TILES_PER_REEL }).map((_, i) => (
          <Box
            key={i}
            component="img"
            src={assets.clouds}
            alt=""
            draggable={false}
            sx={CLOUD_TILE_SX}
          />
        ))}
      </Box>
    </Box>
  );
});

export function LandingPage() {
  const navigate = useNavigate();
  const [departingTo, setDepartingTo] = useState<string | null>(null);

  const warmedFrames = useRef<HTMLImageElement[]>([]);

  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const durationMs = reducedMotion ? REDUCED_DEPARTURE_MS : DEPARTURE_MS;
  const frames = assets.dandelionFrames;

  const frameIndex = useDepartureClock(
    departingTo !== null,
    reducedMotion ? 1 : frames.length,
    durationMs,
    () => {
      if (departingTo) navigate(departingTo);
    },
  );

  const startDeparture = (to: string) => {
    if (departingTo !== null) return;
    setDepartingTo(to);
  };

  useEffect(() => {
    if (framesWarmed) return;

    const start = () => {
      framesWarmed = true;
      warmedFrames.current = assets.dandelionFrames.slice(1).map((src) => {
        const img = new Image();
        img.onload = () => {
          loadedFrameSrcs.add(src);
        };
        img.src = src;
        void img.decode().catch(() => {});
        return img;
      });
    };

    if (document.readyState === 'complete') {
      start();
      return;
    }
    window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        minHeight: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `${cssUrl(assets.noise)}, linear-gradient(180deg, ${palette.navy} 1%, ${palette.brightBlue} 29%, ${palette.teal} 80%)`,
        backgroundBlendMode: 'multiply, normal',
        backgroundRepeat: 'repeat, no-repeat',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: { xs: '-3.85%', sm: -50 },
          height: { xs: '100%', sm: 'auto' },
          aspectRatio: { sm: '1123 / 794' },
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: cssUrl(assets.hill),
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center bottom',
          backgroundSize: { xs: 'auto 100%', sm: '100% auto' },
        }}
      />

      <CloudStrip />

      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          pt: 6,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: 'auto' },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: { sm: 'absolute' },
            left: { sm: 0 },
            right: { sm: 0 },
            top: { sm: '-7%' },
            height: { sm: '40%' },
            justifyContent: { sm: 'center' },
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', sm: 'auto' },
              height: { sm: '100%' },
              aspectRatio: { sm: RIBBON_ASPECT },
              maxWidth: { sm: '80%' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <RibbonBanner title="LaKenzie's Lovely Website" />
          </Box>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: { xs: `${CARD_TOP_PCT.xs}%`, sm: `${CARD_TOP_PCT.sm}%` },
            bottom: { xs: '1.5%', sm: '2%' },
            left: { xs: '7%', sm: '10%' },
            right: { xs: '7%', sm: '10%' },
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <DrawstringCard sx={{ height: '100%' }} peek={CARD_PEEK}>
            <Typography sx={CARD_COPY_SX}>{CARD_COPY}</Typography>
          </DrawstringCard>
        </Box>
        {DANDELIONS.map((d) => {
          const isDeparting = departingTo === d.to;
          return (
            <DandelionLink
              key={d.to}
              frame={isDeparting ? newestLoadedFrame(frames, frameIndex) : frames[0]}
              label={d.label}
              to={d.to}
              left={d.left}
              mirrored={d.mirrored}
              departing={isDeparting}
              onActivate={startDeparture}
            />
          );
        })}
      </Container>
    </Box>
  );
}
