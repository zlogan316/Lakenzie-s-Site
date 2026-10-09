import { palette } from './palette';
import { fontTitle } from './theme';
import { assets, cssUrl } from '../assets';

const FRAME_CQMIN = 4.85;

export const FRAME_SIZE = `${FRAME_CQMIN}cqmin`;

export const FRAME_INSET = `calc(${FRAME_SIZE} * 1.2)`;

const FRAME_SLICE = 108;

const FRAME_COLOR = '#2b1100';

const TILE_WIDTH = 6.128;

const TILE_HEIGHT = 5.42;

const MARGIN_X = 0.3;

const MARGIN_Y = 0.2;

export const FRAME_TYPE = {
  xs: 'min(4.1cqw, 2.3cqh)',
  sm: 'min(2.6cqw, 2.3cqh)',
  md: 'min(1.4cqw, 2.3cqh)',
} as const;

export const DANDELION_FRAME_SX = {
  '--frame': FRAME_SIZE,
  '--inner-w': 'calc(100cqw - 2 * var(--frame))',
  '--inner-h': 'calc(100cqh - 2 * var(--frame))',
  '--across': `calc(max(0, round(tan(atan2(var(--inner-w), var(--frame) * ${TILE_WIDTH})) - ${2 * MARGIN_X})) + ${2 * MARGIN_X})`,
  '--down': `calc(max(0, round(tan(atan2(var(--inner-h), var(--frame) * ${TILE_HEIGHT})) - ${2 * MARGIN_Y})) + ${2 * MARGIN_Y})`,
  '--tile-w': 'calc(var(--inner-w) / var(--across))',
  '--tile-h': 'calc(var(--inner-h) / var(--down))',
  borderStyle: 'solid',
  borderColor: 'transparent',
  borderWidth: 'var(--frame)',
  borderImage: `${cssUrl(assets.dandelionFrame)} ${FRAME_SLICE} round`,
  backgroundColor: FRAME_COLOR,
  backgroundImage: `${cssUrl(assets.dandelionTile)}, linear-gradient(${palette.olive}, ${palette.olive})`,
  backgroundOrigin: 'padding-box, border-box',
  backgroundClip: 'padding-box, border-box',
  backgroundPosition: `calc(var(--tile-w) * ${MARGIN_X} - var(--tile-w) / 4) calc(var(--tile-h) * ${MARGIN_Y} - var(--tile-h) / 4), center`,
  backgroundSize: 'var(--tile-w) var(--tile-h), calc(100% - var(--frame)) calc(100% - var(--frame))',
  backgroundRepeat: 'repeat, no-repeat',
} as const;

const TITLE_CORNER = '0.31em';

export const FRAME_TITLE_SX = {
  px: '0.55em',
  py: '0.1em',
  fontFamily: fontTitle,
  fontWeight: 400,
  color: palette.goldSoft,
  bgcolor: palette.brown,
  clipPath: `polygon(${TITLE_CORNER} 0, calc(100% - ${TITLE_CORNER}) 0, 100% ${TITLE_CORNER}, 100% calc(100% - ${TITLE_CORNER}), calc(100% - ${TITLE_CORNER}) 100%, ${TITLE_CORNER} 100%, 0 calc(100% - ${TITLE_CORNER}), 0 ${TITLE_CORNER})`,
} as const;
