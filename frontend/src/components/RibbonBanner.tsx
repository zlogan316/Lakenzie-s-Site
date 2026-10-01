import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { palette } from '../theme/palette';
import { assets } from '../assets';

const BANNER_W_PX = 735;
const BANNER_H_PX = 117;
const BAND_MID_PX = 56;

const TITLE_FONT_CQW = 5.5;
const TITLE_STROKE_EM = 0.12;

export const RIBBON_ASPECT = `${BANNER_W_PX} / ${BANNER_H_PX}`;

const titleSx = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: `${(BAND_MID_PX / BANNER_H_PX) * 100}%`,
  transform: 'translateY(-50%)',
  textAlign: 'center',
  fontFamily: "'Lilita One', cursive",
  fontWeight: 400,
  fontSize: `${TITLE_FONT_CQW}cqw`,
  lineHeight: 1,
  color: palette.gold,
  WebkitTextStroke: `${TITLE_STROKE_EM}em ${palette.brown}`,
  paintOrder: 'stroke fill',
  pointerEvents: 'none',
} as const;

const visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;

export function RibbonBanner({ title }: { title: string }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        containerType: 'inline-size',
        filter: `drop-shadow(0 8px 18px ${alpha(palette.brown, 0.18)})`,
      }}
    >
      <Typography id="page-heading" tabIndex={-1} component="h1" sx={visuallyHidden}>
        {title}
      </Typography>

      <Box
        component="img"
        src={assets.banner}
        alt=""
        draggable={false}
        sx={{ display: 'block', width: '100%', height: 'auto', aspectRatio: RIBBON_ASPECT, userSelect: 'none' }}
      />
      <Typography component="span" aria-hidden sx={titleSx}>
        {title}
      </Typography>
    </Box>
  );
}
