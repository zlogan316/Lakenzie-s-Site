import type { MouseEvent } from 'react';
import { Link } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { palette } from '../theme/palette';
import { DANDELION_PAGE_MM } from '../assets';

/** Where the stem base sits on the shared export page, as a fraction of it: x from the left edge,
 *  y from the top. Measured off the exported frames, where it is identical in every one of them to
 *  within a pixel — that shared position is what keeps the flower planted while the seeds move.
 *  It doubles as the transform origin, so mirroring and the hover scale both pivot on the ground. */
const STEM_ANCHOR = { x: 0.332, y: 0.8536 };

/** The flower's own width in mm, from Dandelion1's original crop-to-content export. This is the
 *  flower itself, NOT the page it sits on, and it does not change when the frames are re-exported
 *  on a larger page. */
const FLOWER_WIDTH_MM = 27.675169;

/** How much wider the frame image is than the flower on screen. The page is 300mm and the flower
 *  only 27.7mm of it, so the element is ~10.8x the flower's width and mostly transparent — that is
 *  what renders the flower at FLOWER_WIDTH_PCT while letting the seeds spill across the page. */
const FRAME_SCALE = DANDELION_PAGE_MM / FLOWER_WIDTH_MM;

/** Aspect ratio of the flower itself, from the original crop-to-content export (27.675 x 65.392mm).
 *  This shapes the small interactive wrapper, which is flower-sized — not the frame image, which is
 *  the whole square page. */
const FLOWER_ASPECT = '27.675 / 65.392';

/** Flower width as a percentage of the Container — preserves the scene's current proportions. */
const FLOWER_WIDTH_PCT = 7.5;

/** How far the flower's base sits below the Container's bottom edge, as a percentage of the
 *  page. Negative so the stem runs off the bottom edge and gets clipped by the page's overflow. */
const DANDELION_BOTTOM_PCT = -3;

/** How much the flower swells on hover/focus. Named rather than inline because the label's
 *  clearance is derived from it — at rest the flower exactly fills the wrapper, so any growth goes
 *  straight into the text sitting above it. */
const HOVER_SCALE = 1.04;

/** Label placement, relative to the flower rather than the page so it holds at any viewport.
 *
 *  `bottom` is a percentage of the flower's height measured up from its base, and the label is
 *  centred on that line rather than sitting above it. 75.7 is the bud's own centre, measured off the
 *  exported frames: bud centroid at 0.6885 of the page, stem base at 0.8536, flower 0.218 of the
 *  page tall. Aiming at the bud is what makes the label read as labelling the head instead of
 *  floating near it — the previous 88 put it above the flower entirely, which looked adrift.
 *
 *  `side` is a percentage of the flower's width from whichever edge the label hangs off, so anything
 *  over 100 clears the flower. The bud sits about 0.29 flower-widths off-centre, so the mirrored
 *  flower's head leans the other way and its label follows — 125 leaves the same head-to-label gap
 *  on both sides. */
const LABEL_POS = { bottom: 75.7, side: 125 };

type Props = {
  /** which frame to paint right now — the resting frame unless this one is departing */
  frame: string;
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
  label,
  to,
  left,
  mirrored = false,
  departing = false,
  onActivate,
}: Props) {
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
          scale: String(HOVER_SCALE),
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
        variant="h4"
        sx={{
          position: 'absolute',
          // measured against the flower-sized wrapper — see LABEL_POS. The mirrored flower anchors
          // from the opposite edge, so the pair splays outward and matches the flipped artwork
          // instead of both labels trailing off to the right.
          bottom: `${LABEL_POS.bottom}%`,
          ...(mirrored
            ? { right: `${LABEL_POS.side}%` }
            : { left: `${LABEL_POS.side}%` }),
          // centres the label on the bud's line instead of resting its baseline there
          transform: 'translateY(50%)',
          whiteSpace: 'nowrap',
          opacity: 0,
          transition: 'opacity 200ms ease',
          color: palette.brown,
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
        src={frame}
        alt=""
        draggable={false}
        sx={{
          position: 'absolute',
          // the wrapper's bottom centre is the ground the flower stands on; the translate below
          // slides the image so its stem base lands exactly there, seeds overflowing freely
          left: '50%',
          top: '100%',
          width: `${100 * FRAME_SCALE}%`,
          // origin at the stem base means mirroring and the hover scale both pivot on the ground:
          // the flower never slides sideways or lifts off when either is applied
          transformOrigin: `${STEM_ANCHOR.x * 100}% ${STEM_ANCHOR.y * 100}%`,
          transform:
            `translate(${-100 * STEM_ANCHOR.x}%, ${-100 * STEM_ANCHOR.y}%)` +
            (mirrored ? ' scaleX(-1)' : ''),
          transition: 'filter 200ms ease, scale 200ms ease',
          // never the hit area — that belongs to the small wrapper above
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}
