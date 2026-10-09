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

export function WordGuessIcon() {
  return (
    <Box
      component="img"
      src={assets.dandelionBloom}
      alt=""
      draggable={false}
      sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
    />
  );
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
  return (
    <svg {...svgProps}>
      <path
        d="M12 18.5V11"
        fill="none"
        stroke={palette.oliveSoft}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M12 13.5c-3.8 0-6.4-2.3-6.8-5.9 3.8-.2 6.5 2.1 6.8 5.9z" fill={palette.oliveSoft} />
      <path d="M12 11c.3-4.2 3.2-6.8 7.4-6.9-.1 4.2-3.2 6.8-7.4 6.9z" fill={palette.oliveSoft} />
      <path d="M5 20.5c1.8-1.6 4.3-2.5 7-2.5s5.2.9 7 2.5z" fill={palette.brownSoft} />
    </svg>
  );
}
