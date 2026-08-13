import { memo, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
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

const RIBBON_TOP_PCT = -7;
const RIBBON_HEIGHT_PCT = 40;

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
const CARD_BOTTOM_PCT = { xs: 1.5, sm: 2 };

const DANDELIONS = [
  { to: '/games', label: 'Games', left: { xs: '8%', sm: '11%', md: '12%' }, mirrored: false },
  { to: '/fun-facts', label: 'Fun Facts', left: { xs: '72%', sm: '79%', md: '80.5%' }, mirrored: true },
] as const;

let framesWarmed = false;

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

const DRIFT_STEPS = 9000;

const CLOUD_TRACK_SX = {
  display: 'flex',
  height: '100%',
  width: 'max-content',
  animation: `cloudDrift 600s steps(${DRIFT_STEPS}) infinite`,
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
      warmedFrames.current = assets.dandelionFrames.slice(1).map((frame) => {
        const img = new Image();
        img.src = frame.src;
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
          height: '100%',
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
          pt: { xs: 6, md: 9 },
          pb: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
            top: { sm: `${RIBBON_TOP_PCT}%` },
            height: { sm: `${RIBBON_HEIGHT_PCT}%` },
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
            bottom: { xs: `${CARD_BOTTOM_PCT.xs}%`, sm: `${CARD_BOTTOM_PCT.sm}%` },
            left: '10%',
            right: '10%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <DrawstringCard sx={{ height: '100%' }} />
        </Box>
        {DANDELIONS.map((d) => {
          const isDeparting = departingTo === d.to;
          return (
            <DandelionLink
              key={d.to}
              frame={isDeparting ? frames[frameIndex] : frames[0]}
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
