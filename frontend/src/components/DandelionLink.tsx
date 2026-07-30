import type { MouseEvent } from 'react';
import { Link } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { palette } from '../theme/palette';
import type { DandelionFrame } from '../assets';

/** Where the stem base sits inside the RESTING frame's canvas, as a fraction of it: x from the
 *  left edge, y from the top. Frame 1 is cropped tight to the flower, so the stem base is its
 *  bottom centre. Later frames derive their own anchor from this — see the maths below. */
const STEM_ANCHOR = { x: 0.5, y: 1 };

/** Aspect ratio of the resting flower, taken from Dandelion1.svg's viewBox (27.675 x 65.392mm). */
const FLOWER_ASPECT = '27.675 / 65.392';

/** Flower width as a percentage of the Container — preserves the scene's current proportions. */
const FLOWER_WIDTH_PCT = 7.5;

/** How far the flower's base sits below the Container's bottom edge, as a percentage of the
 *  page. Negative so the stem runs off the bottom edge and gets clipped by the page's overflow. */
const DANDELION_BOTTOM_PCT = -3;

type Props = {
  /** which frame to paint right now — the resting frame unless this one is departing */
  frame: DandelionFrame;
  /** the resting frame, which sets the scale every other frame is measured against */
  resting: DandelionFrame;
  /** destination name, shown on hover/focus and used as the link's accessible name */
  label: string;
  to: string;
  /** horizontal placement of the flower within the Container, e.g. '12%' */
  left: string;
  /** mirror the artwork left-to-right */
  mirrored?: boolean;
  /** true while this dandelion is the one departing — lifts its seeds in front of the card */
  departing?: boolean;
  onActivate: (to: string) => void;
};

export function DandelionLink({
  frame,
  resting,
  label,
  to,
  left,
  mirrored = false,
  departing = false,
  onActivate,
}: Props) {
  // Every frame is cropped tight to its own content, so a frame whose canvas is 6.8x wider in mm
  // must render 6.8x wider on screen for the flower inside it to stay the same size. Without this
  // the flower shrinks away as the canvas fills up with seeds.
  const scale = frame.width / resting.width;

  // The crop grows right and up as the seeds spread, leaving the bottom-left corner fixed. The
  // frame offsets bear this out: frames 1 and 2 share an identical content offset while only the
  // width grows (left edge fixed), and the offsets move the content progressively further down
  // each canvas (space added at the top, so the bottom edge is fixed).
  //
  // So what stays constant is the stem's distance from the LEFT and from the BOTTOM, and the
  // anchor is that fixed distance as a fraction of each frame's own canvas. Measuring y from the
  // top instead is what sank the flower: on frame 10 that put the anchor 31% down a canvas whose
  // stem sits at the very bottom.
  // A frame can override the inferred position outright — by the late frames the seeds spread in
  // every direction, so the crop expands on all four sides and the fixed-corner assumption breaks.
  const stemFromLeftMm = STEM_ANCHOR.x * resting.width;
  const stemFromBottomMm = (1 - STEM_ANCHOR.y) * resting.height;
  const anchorX = frame.stem?.x ?? stemFromLeftMm / frame.width;
  const anchorY = frame.stem?.y ?? 1 - stemFromBottomMm / frame.height;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // let the browser handle modified and non-primary clicks, so open-in-new-tab, middle-click
    // and copy-link keep behaving like the real links these are
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    onActivate(to);
  };

  return (
    <Box
      component={Link}
      to={to}
      onClick={handleClick}
      sx={{
        position: 'absolute',
        left,
        bottom: `${DANDELION_BOTTOM_PCT}%`,
        width: `${FLOWER_WIDTH_PCT}%`,
        aspectRatio: FLOWER_ASPECT,
        display: 'block',
        textDecoration: 'none',
        // the frame image overflows this box on purpose: only the flower is the hit area, so the
        // seeds can spread across the page without swallowing hover and clicks
        overflow: 'visible',
        zIndex: departing ? 2 : 0,
        '&:hover .dandelion-label, &:focus-visible .dandelion-label': { opacity: 1 },
        '&:hover .dandelion-frame, &:focus-visible .dandelion-frame': {
          filter: `drop-shadow(0 0 0.4em ${palette.goldSoft})`,
          scale: '1.04',
        },
        // filter is dropped in forced-colors mode, so focus needs a real outline as well
        '&:focus-visible': {
          outline: `2px solid ${palette.gold}`,
          outlineOffset: '0.25em',
        },
      }}
    >
      <Typography
        className="dandelion-label"
        component="span"
        sx={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          opacity: 0,
          transition: 'opacity 200ms ease',
          color: palette.brown,
          fontWeight: 700,
          // halo so the name reads over the cream card and the sky alike
          textShadow: `0 0 0.3em ${palette.cream}, 0 0 0.6em ${palette.cream}`,
          // kept out of the hit area: at opacity 0 it would still catch the pointer above the flower
          pointerEvents: 'none',
        }}
      >
        {label}
      </Typography>

      <Box
        className="dandelion-frame"
        component="img"
        src={frame.src}
        alt=""
        draggable={false}
        sx={{
          position: 'absolute',
          // the wrapper's bottom centre is the ground the flower stands on
          left: '50%',
          top: '100%',
          width: `${100 * scale}%`,
          // origin at the stem base means mirroring and the hover scale both pivot on the ground:
          // the flower never slides sideways or lifts off when either is applied
          transformOrigin: `${anchorX * 100}% ${anchorY * 100}%`,
          transform:
            `translate(${-100 * anchorX}%, ${-100 * anchorY}%)` +
            (mirrored ? ' scaleX(-1)' : ''),
          transition: 'filter 200ms ease, scale 200ms ease',
          // never the hit area — that belongs to the small wrapper above
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}
