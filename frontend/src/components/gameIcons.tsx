import Box from '@mui/material/Box';
import { palette } from '../theme/palette';
import { assets } from '../assets';


const svgProps = {
  viewBox: '0 0 24 24',
  width: '100%',
  height: '100%',
  'aria-hidden': true,
  focusable: false,
} as const;

const IMG_SX = { display: 'block', width: '100%', height: '100%', objectFit: 'contain' } as const;

const BLOOM_ART_WIDTH = 120.566 / 194.87;

const SPROUT_ART_ASPECT = 66.056 / 67.832;

const BLOOM_SX = { ...IMG_SX, scale: String(SPROUT_ART_ASPECT / BLOOM_ART_WIDTH) } as const;

export function WordGuessIcon() {
  return <Box component="img" src={assets.dandelionBloom} alt="" draggable={false} sx={BLOOM_SX} />;
}

export function DictionaryMatchIcon() {
  return (
    <svg {...svgProps}>
      <path d="M11.5 5.8C9 4 5.4 3.8 2 4.8v14.8c3.4-1 7-.8 9.5.9z" fill={palette.teal} />
      <path d="M12.5 5.8C15 4 18.6 3.8 22 4.8v14.8c-3.4-1-7-.8-9.5.9z" fill={palette.olive} />
      <path
        d="M4.2 8.6c1.8-.5 3.7-.4 5.4.3M4.2 11.6c1.8-.5 3.7-.4 5.4.3M4.2 14.6c1.8-.5 3.7-.4 5.4.3"
        fill="none"
        stroke={palette.paper}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <polyline
        points="14.6,12.6 16.5,14.5 19.6,10.4"
        fill="none"
        stroke={palette.paper}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ComingSoonIcon() {
  return <Box component="img" src={assets.comingSoonIcon} alt="" draggable={false} sx={IMG_SX} />;
}
