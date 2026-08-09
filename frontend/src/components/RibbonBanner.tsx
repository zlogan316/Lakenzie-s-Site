import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { palette } from '../theme/palette';
import { fontDisplay } from '../theme/theme';

interface RibbonBannerProps {
  title: string;
}

const VB_W = 600;
const VB_H_STRIP = 90;
const VB_H_RIBBON = 150;

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
  const lTip = g.endOuter + g.notch;
  const rTip = w - lTip;
  return [
    `M${g.endOuter},${g.endTop}`,
    `L${g.endInner},${g.endTop}`,
    `L${g.bandLeft},${g.bandTop}`,
    `L${bandRight},${g.bandTop}`,
    `L${rInner},${g.endTop}`,
    `L${rOuter},${g.endTop}`,
    `L${rTip},${endMid}`,
    `L${rOuter},${g.endBottom}`,
    `L${rInner},${g.endBottom}`,
    `L${bandRight},${g.bandBottom}`,
    `L${g.bandLeft},${g.bandBottom}`,
    `L${g.endInner},${g.endBottom}`,
    `L${g.endOuter},${g.endBottom}`,
    `L${lTip},${endMid}`,
    'Z',
  ].join(' ');
}

const STRIP_D = stripPath(VB_W, STRIP);
const RIBBON_D = ribbonPath(VB_W, RIBBON);

const STRIP_MID = (STRIP.top + STRIP.bottom) / 2;
const RIBBON_MID = (RIBBON.bandTop + RIBBON.bandBottom) / 2;

const STRIP_FONT = (STRIP.bottom - STRIP.top) * 0.62;
const RIBBON_FONT = (RIBBON.bandBottom - RIBBON.bandTop) * 0.6;

const pct = (n: number, total: number) => `${(n / total) * 100}%`;
const cqw = (n: number) => `${(n / VB_W) * 100}cqw`;

const STRIP_OVERLAY = { top: pct(STRIP_MID, VB_H_STRIP), fontSize: cqw(STRIP_FONT) };
const RIBBON_OVERLAY = { top: pct(RIBBON_MID, VB_H_RIBBON), fontSize: cqw(RIBBON_FONT) };

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

export function RibbonBanner({ title }: RibbonBannerProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        containerType: 'inline-size',
        filter: `drop-shadow(0 8px 18px ${alpha(palette.brown, 0.18)})`,
      }}
    >
      <Typography component="h1" sx={visuallyHidden}>
        {title}
      </Typography>

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
