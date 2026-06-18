import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { palette } from '../theme/palette';
import { fontDisplay } from '../theme/theme';

interface RibbonBannerProps {
  title: string;
}

/** all geometry lives in a 600-wide viewBox; shapes are symmetric about the centre */
const VB_W = 600;
/** viewBox heights per breakpoint — used to place the title overlay vertically */
const VB_H_STRIP = 90;
const VB_H_RIBBON = 150;

/**
 * Mobile: one full-width strip with swallowtail ends.
 * `inset` is the side margin, `notch` how deep the swallowtail V cuts in.
 */
const STRIP = { top: 20, bottom: 65, inset: 20, notch: 24 };

function stripPath(w: number, g: typeof STRIP): string {
  const mid = (g.top + g.bottom) / 2;
  const right = w - g.inset;
  return [
    `M${g.inset},${g.top}`,
    `L${right},${g.top}`,
    `L${right - g.notch},${mid}`,
    `L${right},${g.bottom}`,
    `L${g.inset},${g.bottom}`,
    `L${g.inset + g.notch},${mid}`,
    'Z',
  ].join(' ');
}

/**
 * sm and up: a draped flat-angle-flat ribbon, built as one continuous outline.
 * Raised flat end pieces (`end*`) drop through angled folds into the lower,
 * flat centre band (`band*`). Right side mirrors the left about VB_W.
 */
const RIBBON = {
  endOuter: 40,
  endInner: 110,
  endTop: 42,
  endBottom: 76,
  bandLeft: 155,
  bandTop: 84,
  bandBottom: 118,
  notch: 26,
};

function ribbonPath(w: number, g: typeof RIBBON): string {
  const endMid = (g.endTop + g.endBottom) / 2;
  const rInner = w - g.endInner;
  const rOuter = w - g.endOuter;
  const bandRight = w - g.bandLeft;
  const lTip = g.endOuter + g.notch; // left swallowtail tip
  const rTip = w - lTip;
  return [
    `M${g.endOuter},${g.endTop}`, // left end, outer-top
    `L${g.endInner},${g.endTop}`, // left end, inner-top
    `L${g.bandLeft},${g.bandTop}`, // fold down to band top-left
    `L${bandRight},${g.bandTop}`, // band top-right
    `L${rInner},${g.endTop}`, // fold up to right end inner-top
    `L${rOuter},${g.endTop}`, // right end, outer-top
    `L${rTip},${endMid}`, // right swallowtail notch
    `L${rOuter},${g.endBottom}`, // right end, outer-bottom
    `L${rInner},${g.endBottom}`, // right end, inner-bottom
    `L${bandRight},${g.bandBottom}`, // fold down to band bottom-right
    `L${g.bandLeft},${g.bandBottom}`, // band bottom-left
    `L${g.endInner},${g.endBottom}`, // fold up to left end inner-bottom
    `L${g.endOuter},${g.endBottom}`, // left end, outer-bottom
    `L${lTip},${endMid}`, // left swallowtail notch
    'Z',
  ].join(' ');
}

const STRIP_D = stripPath(VB_W, STRIP);
const RIBBON_D = ribbonPath(VB_W, RIBBON);

/** centre of each band, in viewBox units — the title sits here */
const STRIP_MID = (STRIP.top + STRIP.bottom) / 2;
const RIBBON_MID = (RIBBON.bandTop + RIBBON.bandBottom) / 2;

/** title size derived from band height, so it scales with the ribbon, not breakpoints */
const STRIP_FONT = (STRIP.bottom - STRIP.top) * 0.62;
const RIBBON_FONT = (RIBBON.bandBottom - RIBBON.bandTop) * 0.6;

/**
 * The title is an HTML <Typography> overlaid on the SVG ribbon. To keep it
 * fluid with the ribbon (not snapping at breakpoints) the overlay is sized and
 * placed in viewBox-relative units: `cqw` for the font (% of the container's
 * width, which equals viewBox width) and `%` for the vertical band centre.
 */
const pct = (n: number, total: number) => `${(n / total) * 100}%`;
const cqw = (n: number) => `${(n / VB_W) * 100}cqw`;

const STRIP_OVERLAY = { top: pct(STRIP_MID, VB_H_STRIP), fontSize: cqw(STRIP_FONT) };
const RIBBON_OVERLAY = { top: pct(RIBBON_MID, VB_H_RIBBON), fontSize: cqw(RIBBON_FONT) };

/** shared look for the overlaid title, matching the old SVG <text> styling */
const titleSx = {
  position: 'absolute',
  left: 0,
  right: 0,
  transform: 'translateY(-50%)',
  textAlign: 'center',
  fontFamily: fontDisplay,
  fontWeight: 560,
  letterSpacing: '-0.015em',
  lineHeight: 1,
  color: palette.gold,
  pointerEvents: 'none',
} as const;

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;

/**
 * Heraldic swallowtail ribbon. On small screens it's a single full-width
 * strip so the title fits; from `sm` up it drapes (flat ends → angled folds
 * → lower centre band). The ribbon is SVG; the title is an HTML <Typography>
 * overlaid on the band and sized in container units so it still scales fluidly
 * with the ribbon. A visually-hidden <h1> carries the heading semantics.
 */
export function RibbonBanner({ title }: RibbonBannerProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        containerType: 'inline-size', // anchor for the overlay's `cqw` font size
        filter: `drop-shadow(0 8px 18px ${alpha(palette.brown, 0.18)})`,
      }}
    >
      <Typography component="h1" sx={visuallyHidden}>
        {title}
      </Typography>

      {/* mobile: single full-width strip with swallowtail ends */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, position: 'relative' }} aria-hidden>
        <Box
          component="svg"
          viewBox={`0 0 ${VB_W} ${VB_H_STRIP}`}
          sx={{ display: 'block', width: '100%', height: 'auto' }}
        >
          <path
            d={STRIP_D}
            fill={palette.brownSoft}
            stroke={palette.brown}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </Box>
        <Typography component="span" sx={{ ...titleSx, ...STRIP_OVERLAY }}>
          {title}
        </Typography>
      </Box>

      {/* sm and up: draped flat-angle-flat ribbon */}
      <Box sx={{ display: { xs: 'none', sm: 'block' }, position: 'relative' }} aria-hidden>
        <Box
          component="svg"
          viewBox={`0 0 ${VB_W} ${VB_H_RIBBON}`}
          sx={{ display: 'block', width: '100%', height: 'auto' }}
        >
          <path
            d={RIBBON_D}
            fill={palette.brownSoft}
            stroke={palette.brown}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </Box>
        <Typography component="span" sx={{ ...titleSx, ...RIBBON_OVERLAY }}>
          {title}
        </Typography>
      </Box>
    </Box>
  );
}
