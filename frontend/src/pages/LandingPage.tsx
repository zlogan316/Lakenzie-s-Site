import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import { palette } from '../theme/palette';
import { assets, cssUrl } from '../assets';
import { RibbonBanner } from '../components/RibbonBanner';
import { DrawstringCard } from '../components/DrawstringCard';
import { DandelionLink } from '../components/DandelionLink';
import {
  departureState,
  useDepartureClock,
  DEPARTURE_MS,
  REDUCED_DEPARTURE_MS,
} from '../hooks/useDepartureClock';

/** Tiles per reel. The strip is two identical reels; the track slides by exactly one reel for a
 *  seamless loop, so a reel must be at least one screen wide. Each tile is sized off the band
 *  height (so it scales with the viewport), and at ~0.28×band-height-per-tile this many reaches
 *  past even ultrawide aspect ratios. Extra tiles off-screen are clipped — cheap, one cached SVG. */
const CLOUD_TILES_PER_REEL = 16;

/** The scene is a fixed-height stage; every layer is placed as a fraction of it, so this is the one
 *  number that scales the whole scene vertically — the cloud band, the card, and the tile size that
 *  follows the band all move with it. Horizontal sizes are percentages of the viewport instead, so
 *  they are deliberately unaffected. */
const PAGE_HEIGHT = 1300;

/** Where the cloud band sits on the page, in percent. */
const CLOUD_BAND_TOP_PCT = 5;
const CLOUD_BAND_HEIGHT_PCT = 60;
/** Fraction of clouds.svg's own height that holds cloud shapes — the rest of the file is empty sky.
 *  Measured from its path extents (curve control points included) in the 297x210 viewBox. */
const CLOUD_ART_BOTTOM = 0.6;
/** How far down the page the lowest cloud actually reaches — 41%, not the band's 65%, because the
 *  bottom two fifths of the band is empty sky. */
const CLOUDS_BOTTOM_PCT = CLOUD_BAND_TOP_PCT + CLOUD_BAND_HEIGHT_PCT * CLOUD_ART_BOTTOM;

/** How far the card's top rises past the lowest cloud, as a percentage of the page. At 0 the two
 *  merely touch, which reads as the card hanging below the clouds; a small overlap reads as it
 *  tucking up behind them. */
const CARD_CLOUD_OVERLAP_PCT = 3;

/** The card is placed like the scene art — a layer with top and bottom each a % of the page, so its
 *  height is whatever sits between them and scales with PAGE_HEIGHT.
 *
 *  CARD_BOTTOM_PCT is load-bearing for how the card reads: DrawstringCard is anchored at its top and
 *  only changes height, so this alone fixes where the expanded card's bottom edge sits. Raising the
 *  top makes the card taller without moving that edge — change the top freely, leave this be. */
const CARD_TOP_PCT = CLOUDS_BOTTOM_PCT - CARD_CLOUD_OVERLAP_PCT;
const CARD_BOTTOM_PCT = 2;

/** The two dandelions and where each one leads. Order is left-to-right on the page. The right one's
 *  left is the mirror of the left one's: 100 - 12 - 7.5 (the flower's own width), so the pair sits
 *  symmetrically about the page centre. At a plain 80% it was half a percent off and read as uneven. */
const DANDELIONS = [
  { to: '/games', label: 'Games', left: '12%', mirrored: false },
  { to: '/fun-facts', label: 'Fun Facts', left: '80.5%', mirrored: true },
] as const;

export function LandingPage() {
  const navigate = useNavigate();
  const [departingTo, setDepartingTo] = useState<string | null>(null);

  /** Holds the preloaded frame images for the page's lifetime so their decoded bitmaps survive. */
  const warmedFrames = useRef<HTMLImageElement[]>([]);

  // reduced motion holds the resting frame and just cross-fades, matching how the cloud
  // drift already opts out
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const durationMs = reducedMotion ? REDUCED_DEPARTURE_MS : DEPARTURE_MS;
  const frames = assets.dandelionFrames;

  // one clock drives both the frames and the wash, so they cannot drift apart
  const elapsed = useDepartureClock(departingTo !== null, durationMs, () => {
    if (departingTo) navigate(departingTo);
  });
  const { frameIndex, washOpacity } = departureState(
    elapsed,
    reducedMotion ? 1 : frames.length,
    durationMs,
  );

  const startDeparture = (to: string) => {
    // ignore repeat clicks and the other flower while one departure is already running
    if (departingTo !== null) return;
    setDepartingTo(to);
  };

  // Warm the animation frames so the first click plays smoothly. Deliberately NOT added to
  // AppShell's PRELOAD array: that gates the cream loading veil over the entire site, and holding
  // first paint for animation art nobody has asked for yet is the wrong trade. Preloading on hover
  // was rejected too — phones have no hover, so a first tap would enter an unloaded animation.
  useEffect(() => {
    const start = () => {
      // frame 0 is already on screen; the rest are what need warming. Held in a ref, not dropped
      // on the floor: the browser keeps an image's decoded bitmap while something references it,
      // and letting these go out of scope means re-decoding every frame during playback.
      warmedFrames.current = assets.dandelionFrames.slice(1).map((src) => {
        const img = new Image();
        img.src = src;
        // src alone only fetches the bytes — a PNG this size stays undecoded until something
        // paints it, which during a 100ms-per-frame flipbook is far too late. decode() forces it
        // now. A 404 or an abort must not break the page, hence the swallow.
        void img.decode().catch(() => {});
        return img;
      });
    };

    // Waiting for `load` rather than an arbitrary timer: it means ~1.9MB of frames never competes
    // for bandwidth with the hill and clouds, which DO gate the loading veil.
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
        minHeight: PAGE_HEIGHT,
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
          backgroundImage: cssUrl(assets.noise),
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
          backgroundImage: cssUrl(assets.hill),
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
          top: `${CLOUD_BAND_TOP_PCT}%`,
          height: `${CLOUD_BAND_HEIGHT_PCT}%`,
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
              src={assets.clouds}
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
        </Box>

        {/* the card, placed as its own layer between the clouds and the page's bottom edge. Its top
            and bottom are each a % of the page, so nothing here is a fixed size — the card grows and
            shrinks with PAGE_HEIGHT while always clearing the clouds. */}
        <Box
          sx={{
            position: 'absolute',
            top: `${CARD_TOP_PCT}%`,
            bottom: `${CARD_BOTTOM_PCT}%`,
            left: '10%',
            right: '10%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <DrawstringCard sx={{ height: '100%' }} />
        </Box>
        {/* the two dandelions are the site's navigation: each is a real link whose seeds blow
            away on click before the page washes to white. See the departure spec. */}
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

      {/* departure wash — fixed so it covers the whole viewport including the gold frame, and
          stacked above AppShell's loading veil (modal + 1) so nothing shows through */}
      {departingTo !== null && (
        <Box
          aria-hidden
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: palette.white,
            opacity: washOpacity,
            pointerEvents: 'none',
            zIndex: (theme) => theme.zIndex.modal + 2,
          }}
        />
      )}
    </Box>
  );
}
