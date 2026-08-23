import { palette } from '../theme/palette';


const svgProps = {
  viewBox: '0 0 24 24',
  width: '100%',
  height: '100%',
  'aria-hidden': true,
  focusable: false,
} as const;

export function WordGuessIcon() {
  return (
    <svg {...svgProps}>
      <rect x="1.5" y="1.5" width="9.5" height="9.5" rx="2" fill={palette.olive} />
      <rect x="13" y="1.5" width="9.5" height="9.5" rx="2" fill={palette.gold} />
      <rect x="1.5" y="13" width="9.5" height="9.5" rx="2" fill={palette.absent} />
      <rect x="13" y="13" width="9.5" height="9.5" rx="2" fill={palette.goldSoft} />
    </svg>
  );
}

export function RelationsIcon() {
  return (
    <svg {...svgProps}>
      <rect x="2" y="2" width="20" height="3.8" rx="1.9" fill={palette.gold} />
      <rect x="2" y="7.4" width="20" height="3.8" rx="1.9" fill={palette.olive} />
      <rect x="2" y="12.8" width="20" height="3.8" rx="1.9" fill={palette.teal} />
      <rect x="2" y="18.2" width="20" height="3.8" rx="1.9" fill={palette.coral} />
    </svg>
  );
}

export function ConnectTheDotsIcon() {
  return (
    <svg {...svgProps}>
      <polyline
        points="4,19 9,7 15,14 20,4"
        fill="none"
        stroke={palette.brownSoft}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4" cy="19" r="2.4" fill={palette.teal} />
      <circle cx="9" cy="7" r="2.4" fill={palette.coral} />
      <circle cx="15" cy="14" r="2.4" fill={palette.gold} />
      <circle cx="20" cy="4" r="2.4" fill={palette.olive} />
    </svg>
  );
}
