import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { AnimationEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha, keyframes } from '@mui/material/styles';
import { createSvgIcon } from '@mui/material/utils';
import { palette } from '../theme/palette';
import { HIGHLIGHT_SCALE } from '../theme/highlight';
import { assets, cssUrl } from '../assets';
import { BackLink, BACK_LINK_BOTTOM } from '../components/BackLink';

type Side = 'left' | 'right';

const SIDES = ['left', 'right'] as const;

const opposite = (side: Side): Side => (side === 'left' ? 'right' : 'left');

const SIGN: Record<Side, number> = { left: 1, right: -1 };

const InstagramIcon = createSvgIcon(
  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />,
  'Instagram',
);

const TikTokIcon = createSvgIcon(
  <path
    transform="translate(2 2) scale(0.8333)"
    d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
  />,
  'TikTok',
);

const YouTubeIcon = createSvgIcon(
  <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />,
  'YouTube',
);

const ArrowDownIcon = createSvgIcon(
  <path
    d="M6 9l6 6 6-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
  'ArrowDown',
);

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/_lakenzo_/', Icon: InstagramIcon },
  { label: 'TikTok', href: 'https://www.tiktok.com/@_lakenzo_', Icon: TikTokIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/@LaKenzo', Icon: YouTubeIcon },
] as const;

const ABOUT_ME = {
  heading: 'About Me',
  paragraph:
    'Greetings! You’ve made it to my website! My name is LaKenzie. I’m more commonly known as the girl with the dandelion crayon wall and the girl that makes the SpongeBob crafts. I’m all about encouraging others to channel their inner child and create what makes their brain silly and heart happy :)',
  factsHeading: 'Fun Facts',
  factsCredit: 'These amazing questions were provided by my lovely followers on Instagram.',
  questions: [
    {
      question: 'If you could have any random skill what would it be?',
      answer: 'Yodeling',
    },
    {
      question: 'What kinda music do ya listen to?',
      answer: 'Mostly granny music. Classic rock, old country, and folk I’d say are my favorite genres right now',
    },
    {
      question: 'Weirdest food combo you like?',
      answer: 'Chocolate chip cookies dipped in orange juice (you are NOT allowed to call it gross until you try it!)',
    },
    {
      question: 'What’s your favorite niche animal?',
      answer: 'Quokka',
    },
    {
      question: 'Any favorite childhood picture book?',
      answer: 'Arnie the Doughnut (and I Spy books of course)',
    },
    {
      question: 'Of your trinkets, which ones are most likely to start a coup and take over the craft room?',
      answer: 'I have a drawer in my craft room full of stray doll appendages…so maybe them',
    },
    {
      question: 'If you were a little frog, where would you live, and what would your profession be?',
      answer: 'I’d be a cobbler that lives in an old boot.',
    },
    {
      question: 'The oddest scent you enjoy?',
      answer: 'A musty basement',
    },
    {
      question: 'What’s the craziest thing you found while trinket searching at garage sales or thrift shops?',
      answer: 'Loose human teeth in a shoebox',
    },
    {
      question: 'What’s one of your favorite niche lines from SpongeBob?',
      answer: '“Oh! So now the talking CHEESE is gonna preach to us!”',
    },
  ],
} as const;

const YOUTUBE_CHANNEL_ID: string = 'UCQlup0XeMHCYvKE8GPFzwZg';

const DANDELION_COUNT = Number(import.meta.env.VITE_DANDELION_COUNT?.replace(/[\s,]/g, '') || Number.NaN);

const SECTIONS = [
  { id: 'socials', title: 'Socials', side: 'left' },
  { id: 'about', title: ABOUT_ME.heading, side: 'right' },
  { id: 'video', title: 'Latest Video', side: 'left' },
  { id: 'dandelions', title: 'Dandelion Count', side: 'right' },
] as const;

const LEAF_W_MM = 359.25592;
const LEAF_H_MM = 73.059129;
const LEAF_SEAT_MM = { x: 179.297, y: 38.564 };
const STEM_BLEED = 0.015;
const LEAF_STEM_Y_MM = 18.957;

const FROG_W_MM = 113.11551;
const RESTING_H_MM = 129.07625;
const ANGRY_H_MM = 131.70746;
const FROG_SHADOW_MM = { x: 56.002, y: 101.632 };
const FROG_HEAD_MM = { x: 64.3205, y: 22.6655 };

const JUMP_W_MM = 158.6398;
const JUMP_H_MM = 294.99247;
const JUMP_HEAD_MM = { x: 87.1255, y: 201.75 };
const JUMP_CENTROID_MM = { x: 68.12, y: 151.07 };
const RESTING_HEAD_SCALE = 0.71970567;
const JUMP_HEAD_SCALE = 0.79668446;
const JUMP_SCALE = RESTING_HEAD_SCALE / JUMP_HEAD_SCALE;

const LEAF_ASPECT = `${LEAF_W_MM} / ${LEAF_H_MM}`;
const RESTING_ASPECT = `${FROG_W_MM} / ${RESTING_H_MM}`;
const ANGRY_ASPECT = `${FROG_W_MM} / ${ANGRY_H_MM}`;
const JUMP_ASPECT = `${JUMP_W_MM} / ${JUMP_H_MM}`;

const LEAF_HEIGHT = LEAF_H_MM / LEAF_W_MM;
const FROG_TOP_MM = LEAF_SEAT_MM.y - FROG_SHADOW_MM.y;
const FROG_TOP = FROG_TOP_MM / LEAF_W_MM;
const FROG_WIDTH = FROG_W_MM / LEAF_W_MM;
const FROG_EDGE = (LEAF_SEAT_MM.x - FROG_SHADOW_MM.x) / LEAF_W_MM - STEM_BLEED;
const ANGRY_ABOVE_LEAF = (ANGRY_H_MM - RESTING_H_MM - FROG_TOP_MM) / LEAF_W_MM;

const JUMP_TOP_MM = FROG_HEAD_MM.y - JUMP_SCALE * JUMP_HEAD_MM.y;
const JUMP_TOP = JUMP_TOP_MM / RESTING_H_MM;
const JUMP_WIDTH = (JUMP_SCALE * JUMP_W_MM) / FROG_W_MM;
const JUMP_INSET = (FROG_HEAD_MM.x - JUMP_SCALE * JUMP_HEAD_MM.x) / FROG_W_MM;
const JUMP_HEAD_SHIFT = (2 * FROG_HEAD_MM.x - FROG_W_MM) / (JUMP_SCALE * JUMP_W_MM);

const CROUCH_SCALE = { x: 1.05, y: 0.9 };
const STRETCH_SCALE = { x: 0.96, y: 1.05 };
const LANDING_SCALE = { x: 1.06, y: 0.91 };
const REBOUND_SCALE = { x: 0.98, y: 1.03 };

const ARC_RISE = 0.08;
const ARC_LIFT = ARC_RISE / (RESTING_H_MM / LEAF_W_MM);

const HOP_HEADROOM =
  (-(FROG_TOP_MM + JUMP_TOP_MM) + (STRETCH_SCALE.y - 1) * (FROG_SHADOW_MM.y - JUMP_TOP_MM)) /
    LEAF_W_MM +
  ARC_RISE;
const HOP_ENVELOPE = HOP_HEADROOM + LEAF_HEIGHT;

const pct = (fraction: number) => `${Number((fraction * 100).toFixed(4))}%`;
const ofLeaf = (fraction: number) => `calc(${fraction} * var(--leaf-width))`;

const LEAF_PIVOT_Y = LEAF_STEM_Y_MM / LEAF_H_MM;
const LEAF_PIVOT: Record<Side, string> = {
  left: `${pct(STEM_BLEED)} ${pct(LEAF_PIVOT_Y)}`,
  right: `${pct(1 - STEM_BLEED)} ${pct(LEAF_PIVOT_Y)}`,
};

const FROG_PIVOT_X = FROG_EDGE / FROG_WIDTH;
const FROG_PIVOT_Y = (LEAF_STEM_Y_MM - FROG_TOP_MM) / RESTING_H_MM;
const FROG_PIVOT: Record<Side, string> = {
  left: `${pct(-FROG_PIVOT_X)} ${pct(FROG_PIVOT_Y)}`,
  right: `${pct(1 + FROG_PIVOT_X)} ${pct(FROG_PIVOT_Y)}`,
};

const SQUASH_ORIGIN: Record<Side, string> = {
  left: `${pct(FROG_SHADOW_MM.x / FROG_W_MM)} ${pct(FROG_SHADOW_MM.y / RESTING_H_MM)}`,
  right: `${pct(1 - FROG_SHADOW_MM.x / FROG_W_MM)} ${pct(FROG_SHADOW_MM.y / RESTING_H_MM)}`,
};

const JUMP_ORIGIN: Record<Side, string> = {
  left: `${pct(JUMP_CENTROID_MM.x / JUMP_W_MM)} ${pct(JUMP_CENTROID_MM.y / JUMP_H_MM)}`,
  right: `${pct(1 - JUMP_CENTROID_MM.x / JUMP_W_MM)} ${pct(JUMP_CENTROID_MM.y / JUMP_H_MM)}`,
};

const LANDSCAPE = '@media (orientation: landscape)';
const PORTRAIT_LEAF_WIDTH = 'min(80cqw, 45cqh)';
const PORTRAIT_LEAF_BOTTOM_CQH = 94;
const LANDSCAPE_LEAF_CQW = 48;
const LANDSCAPE_ENVELOPE_CQH = 92;
const PAGE_GUTTER_CQW = 5;
const CONTENT_TOP_CQH = { portrait: 6, landscape: 8 };
const CONTENT_ABOVE_FROG_CQH = 3;
const CONTENT_BESIDE_LEAF = `calc(${1 - STEM_BLEED} * var(--leaf-width) + ${PAGE_GUTTER_CQW}cqw)`;

const CROUCH_MS = 120;
const FLIGHT_MS = 780;
const SETTLE_MS = 300;
const TAKEOFF_MS = CROUCH_MS;
const APEX_MS = TAKEOFF_MS + FLIGHT_MS * 0.3;
const TOUCHDOWN_MS = TAKEOFF_MS + FLIGHT_MS;
const HOP_MS = TOUCHDOWN_MS + SETTLE_MS;
const LEAVE_LEAF_MS = 200;
const REDUCED_HOP_MS = 320;
const HOP_FALLBACK_MS = 500;

const TAKEOFF_DIP_DEG = 2.5;
const LANDING_DIP_DEG = 3.5;
const REBOUND_DEG = -1;
const APEX_TILT_DEG = -7;

const EASE_ACROSS = 'cubic-bezier(0.37, 0, 0.63, 1)';
const EASE_RISE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const EASE_FALL = 'cubic-bezier(0.55, 0.085, 0.68, 0.53)';
const EASE_PAN = 'cubic-bezier(0.65, 0, 0.35, 1)';

const at = (ms: number) => pct(ms / HOP_MS);
const scaleOf = ({ x, y }: { x: number; y: number }) => `${x} ${y}`;

const travelKeyframes = (from: string, to: string) =>
  keyframes({
    '0%': { translate: from },
    [at(TAKEOFF_MS)]: { translate: from, animationTimingFunction: EASE_ACROSS },
    [at(TOUCHDOWN_MS)]: { translate: to },
    '100%': { translate: to },
  });

const frogTakeoffKeyframes = (sign: number) =>
  keyframes({
    '0%': { rotate: '0deg', animationTimingFunction: 'ease-in' },
    [at(TAKEOFF_MS)]: { rotate: `${sign * TAKEOFF_DIP_DEG}deg`, animationTimingFunction: 'ease-out' },
    [at(TAKEOFF_MS + LEAVE_LEAF_MS)]: { rotate: '0deg' },
    '100%': { rotate: '0deg' },
  });

const leafTakeoffKeyframes = (sign: number) =>
  keyframes({
    '0%': { rotate: '0deg', animationTimingFunction: 'ease-in' },
    [at(TAKEOFF_MS)]: { rotate: `${sign * TAKEOFF_DIP_DEG}deg`, animationTimingFunction: 'ease-in-out' },
    [at(TAKEOFF_MS + 150)]: { rotate: `${sign * REBOUND_DEG}deg`, animationTimingFunction: 'ease-in-out' },
    [at(TAKEOFF_MS + 320)]: { rotate: '0deg' },
    '100%': { rotate: '0deg' },
  });

const landingKeyframes = (sign: number) =>
  keyframes({
    '0%': { rotate: '0deg' },
    [at(TOUCHDOWN_MS)]: { rotate: '0deg', animationTimingFunction: 'ease-out' },
    [at(TOUCHDOWN_MS + 90)]: {
      rotate: `${sign * LANDING_DIP_DEG}deg`,
      animationTimingFunction: 'ease-in-out',
    },
    [at(TOUCHDOWN_MS + 200)]: { rotate: `${sign * REBOUND_DEG}deg`, animationTimingFunction: 'ease-in-out' },
    '100%': { rotate: '0deg' },
  });

const headShiftKeyframes = (sign: number) =>
  keyframes({
    '0%': { translate: '0 0' },
    [at(TAKEOFF_MS)]: { translate: '0 0', animationTimingFunction: EASE_ACROSS },
    [at(TOUCHDOWN_MS)]: { translate: `${pct(-sign * JUMP_HEAD_SHIFT)} 0` },
    '100%': { translate: `${pct(-sign * JUMP_HEAD_SHIFT)} 0` },
  });

const tiltKeyframes = (sign: number) =>
  keyframes({
    '0%': { rotate: '0deg' },
    [at(TAKEOFF_MS)]: { rotate: '0deg', animationTimingFunction: 'ease-out' },
    [at(APEX_MS)]: { rotate: `${sign * APEX_TILT_DEG}deg`, animationTimingFunction: 'ease-in-out' },
    [at(TOUCHDOWN_MS)]: { rotate: '0deg' },
    '100%': { rotate: '0deg' },
  });

const arcKeyframes = (side: Side) =>
  keyframes({
    label: side,
    '0%': { translate: '0 0' },
    [at(TAKEOFF_MS)]: { translate: '0 0', animationTimingFunction: EASE_RISE },
    [at(APEX_MS)]: { translate: `0 ${pct(-ARC_LIFT)}`, animationTimingFunction: EASE_FALL },
    [at(TOUCHDOWN_MS)]: { translate: '0 0' },
    '100%': { translate: '0 0' },
  });

const squashKeyframes = (side: Side) =>
  keyframes({
    label: side,
    '0%': { scale: '1 1', animationTimingFunction: 'ease-in' },
    [at(TAKEOFF_MS - 20)]: { scale: scaleOf(CROUCH_SCALE), animationTimingFunction: 'ease-out' },
    [at(TAKEOFF_MS + 90)]: { scale: scaleOf(STRETCH_SCALE), animationTimingFunction: 'ease-in-out' },
    [at(TAKEOFF_MS + 240)]: { scale: '1 1' },
    [at(TOUCHDOWN_MS)]: { scale: '1 1', animationTimingFunction: 'ease-out' },
    [at(TOUCHDOWN_MS + 70)]: { scale: scaleOf(LANDING_SCALE), animationTimingFunction: 'ease-in-out' },
    [at(TOUCHDOWN_MS + 180)]: { scale: scaleOf(REBOUND_SCALE), animationTimingFunction: 'ease-in-out' },
    '100%': { scale: '1 1' },
  });

const fadeKeyframes = (side: Side) =>
  keyframes({ label: side, '0%': { opacity: 1 }, '50%': { opacity: 0 }, '100%': { opacity: 1 } });

const HOP_KEYFRAMES = {
  travel: { left: travelKeyframes('0 0', '100% 0'), right: travelKeyframes('100% 0', '0 0') },
  frogTakeoff: { left: frogTakeoffKeyframes(SIGN.left), right: frogTakeoffKeyframes(SIGN.right) },
  leafTakeoff: { left: leafTakeoffKeyframes(SIGN.left), right: leafTakeoffKeyframes(SIGN.right) },
  landing: { left: landingKeyframes(SIGN.left), right: landingKeyframes(SIGN.right) },
  headShift: { left: headShiftKeyframes(SIGN.left), right: headShiftKeyframes(SIGN.right) },
  tilt: { left: tiltKeyframes(SIGN.left), right: tiltKeyframes(SIGN.right) },
  arc: { left: arcKeyframes('left'), right: arcKeyframes('right') },
  squash: { left: squashKeyframes('left'), right: squashKeyframes('right') },
  leave: keyframes({
    '0%': { opacity: 1 },
    [at(TAKEOFF_MS)]: { opacity: 0 },
    '100%': { opacity: 0 },
  }),
  fly: keyframes({
    '0%': { opacity: 0 },
    [at(TAKEOFF_MS)]: { opacity: 1 },
    [at(TOUCHDOWN_MS)]: { opacity: 0 },
    '100%': { opacity: 0 },
  }),
  arrive: keyframes({
    '0%': { opacity: 0 },
    [at(TOUCHDOWN_MS)]: { opacity: 1 },
    '100%': { opacity: 1 },
  }),
  slideOut: keyframes({
    '0%': { translate: '0 0' },
    [at(TAKEOFF_MS)]: { translate: '0 0', animationTimingFunction: EASE_PAN },
    [at(TOUCHDOWN_MS)]: { translate: '0 -100%' },
    '100%': { translate: '0 -100%' },
  }),
  slideIn: keyframes({
    '0%': { translate: '0 100%' },
    [at(TAKEOFF_MS)]: { translate: '0 100%', animationTimingFunction: EASE_PAN },
    [at(TOUCHDOWN_MS)]: { translate: '0 0' },
    '100%': { translate: '0 0' },
  }),
};

const REDUCED_KEYFRAMES = {
  travel: {
    left: keyframes({ '0%': { translate: '0 0' }, '50%': { translate: '100% 0' }, '100%': { translate: '100% 0' } }),
    right: keyframes({ '0%': { translate: '100% 0' }, '50%': { translate: '0 0' }, '100%': { translate: '0 0' } }),
  },
  fade: { left: fadeKeyframes('left'), right: fadeKeyframes('right') },
  leave: keyframes({ '0%': { opacity: 1 }, '50%': { opacity: 0 }, '100%': { opacity: 0 } }),
  arrive: keyframes({ '0%': { opacity: 0 }, '50%': { opacity: 1 }, '100%': { opacity: 1 } }),
  slideOut: keyframes({ from: { opacity: 1 }, to: { opacity: 0 } }),
  slideIn: keyframes({ from: { opacity: 0 }, to: { opacity: 1 } }),
};

type HopAnimation = {
  travel: string;
  arc: string;
  takeoff: string;
  landing: string;
  squash: string;
  leave: string;
  fly: string;
  arrive: string;
  slideOut: string;
  slideIn: string;
  leafOut: string;
  leafIn: string;
};

const run = (name: string, ms: number, timing = 'linear') => `${name} ${ms}ms ${timing} both`;

const hopAnimation = (from: Side): HopAnimation => {
  const to = opposite(from);
  const k = HOP_KEYFRAMES;
  return {
    travel: run(k.travel[from], HOP_MS),
    arc: run(k.arc[from], HOP_MS),
    takeoff: run(k.frogTakeoff[from], HOP_MS),
    landing: run(k.landing[to], HOP_MS),
    squash: run(k.squash[from], HOP_MS),
    leave: run(k.leave, HOP_MS, 'step-end'),
    fly: [
      run(k.fly, HOP_MS, 'step-end'),
      run(k.headShift[from], HOP_MS),
      run(k.tilt[from], HOP_MS),
    ].join(', '),
    arrive: run(k.arrive, HOP_MS, 'step-end'),
    slideOut: run(k.slideOut, HOP_MS),
    slideIn: run(k.slideIn, HOP_MS),
    leafOut: run(k.leafTakeoff[from], HOP_MS),
    leafIn: run(k.landing[to], HOP_MS),
  };
};

const reducedHopAnimation = (from: Side): HopAnimation => {
  const k = REDUCED_KEYFRAMES;
  return {
    travel: run(k.travel[from], REDUCED_HOP_MS, 'step-end'),
    arc: run(k.fade[from], REDUCED_HOP_MS, 'ease-in-out'),
    takeoff: 'none',
    landing: 'none',
    squash: 'none',
    leave: run(k.leave, REDUCED_HOP_MS, 'step-end'),
    fly: 'none',
    arrive: run(k.arrive, REDUCED_HOP_MS, 'step-end'),
    slideOut: run(k.slideOut, REDUCED_HOP_MS, 'ease'),
    slideIn: run(k.slideIn, REDUCED_HOP_MS, 'ease'),
    leafOut: 'none',
    leafIn: 'none',
  };
};

const HOP_ANIMATIONS: Record<Side, HopAnimation> = {
  left: hopAnimation('left'),
  right: hopAnimation('right'),
};

const REDUCED_HOP_ANIMATIONS: Record<Side, HopAnimation> = {
  left: reducedHopAnimation('left'),
  right: reducedHopAnimation('right'),
};

type Carousel = { current: number; hopping: boolean };

const launch = (carousel: Carousel): Carousel =>
  carousel.hopping ? carousel : { ...carousel, hopping: true };

const land = (carousel: Carousel): Carousel =>
  carousel.hopping
    ? { current: (carousel.current + 1) % SECTIONS.length, hopping: false }
    : carousel;

const VISUALLY_HIDDEN = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;

const FILL = { position: 'absolute', inset: 0 } as const;

const LAYER = { ...FILL, display: 'block' } as const;

const TITLE_FONT = "'Lilita One', cursive";

const STAGE_SX = {
  position: 'relative',
  flex: 1,
  minHeight: 0,
  overflow: 'clip',
  containerType: 'size',
  backgroundColor: palette.brown,
  backgroundImage: cssUrl(assets.tree),
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center top',
  backgroundSize: 'cover',
  '--leaf-width': PORTRAIT_LEAF_WIDTH,
  '--leaf-top': `calc(${PORTRAIT_LEAF_BOTTOM_CQH}cqh - ${LEAF_HEIGHT} * var(--leaf-width))`,
  '--type': { xs: 'min(4.3cqw, 2.3cqh)', sm: 'min(3.2cqw, 2.1cqh)', md: 'min(2.4cqw, 1.8cqh)' },
  [LANDSCAPE]: {
    '--leaf-width': `min(${LANDSCAPE_LEAF_CQW}cqw, ${Number((LANDSCAPE_ENVELOPE_CQH / HOP_ENVELOPE).toFixed(3))}cqh)`,
    '--leaf-top': `calc(50cqh + ${(HOP_HEADROOM - LEAF_HEIGHT) / 2} * var(--leaf-width))`,
    '--type': {
      xs: 'min(1.9cqw, 3.6cqh)',
      md: 'min(1.45cqw, 3.4cqh)',
      lg: 'min(1.25cqw, 3.2cqh)',
      xl: 'min(1.1cqw, 3cqh)',
    },
  },
} as const;

const CARD_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.9em',
  width: '100%',
  maxWidth: '34em',
  boxSizing: 'border-box',
  overflowY: 'auto',
  px: '1.6em',
  py: '1.4em',
  color: palette.brown,
  bgcolor: palette.oliveSoft,
  border: `0.3em solid ${palette.olive}`,
  borderRadius: '1.5em',
  boxShadow: `0 0.6em 1.6em ${alpha(palette.navy, 0.4)}`,
} as const;

const PAGER_CARD_SX = { ...CARD_SX, overflow: 'hidden' } as const;

const STRETCH_CARD_SX = { ...PAGER_CARD_SX, flex: 1, minHeight: 0 } as const;

const TITLE_SX = {
  fontFamily: TITLE_FONT,
  fontWeight: 400,
  fontSize: '2em',
  lineHeight: 1.1,
} as const;

const BODY_SX = {
  fontSize: '1em',
  lineHeight: 1.55,
  fontWeight: 500,
  maxWidth: '30em',
} as const;

const DIVIDER_SX = {
  flexShrink: 0,
  width: '100%',
  maxWidth: '30em',
  height: '0.18em',
  m: 0,
  border: 0,
  borderRadius: '999em',
  bgcolor: palette.olive,
} as const;

const QA_LIST_SX = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.9em',
  width: '100%',
  maxWidth: '30em',
  m: 0,
  textAlign: 'left',
} as const;

const QA_LINE_SX = {
  display: 'grid',
  gridTemplateColumns: '1.4em 1fr',
  fontSize: '1em',
  lineHeight: 1.55,
  fontWeight: 500,
} as const;

const HINT_SX = {
  fontSize: '0.85em',
  fontWeight: 700,
  letterSpacing: '0.03em',
  color: alpha(palette.goldSoft, 0.8),
} as const;

const SOCIAL_LINK_SX = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45em',
  px: '1.1em',
  py: '0.7em',
  borderRadius: '999em',
  fontSize: '1em',
  fontWeight: 700,
  textDecoration: 'none',
  color: palette.brownDeep,
  bgcolor: palette.goldSoft,
  boxShadow: `inset 0 0 0 0.1em ${palette.brown}, 0 0.25em 0.9em ${alpha(palette.brown, 0.08)}`,
  transition: 'scale 200ms ease',
  WebkitTapHighlightColor: 'transparent',
  '&:active': { bgcolor: palette.gold, ...HIGHLIGHT_SCALE },
  '@media (hover: hover)': { '&:hover': { bgcolor: palette.gold, ...HIGHLIGHT_SCALE } },
  '&:focus-visible': { outline: `2px solid ${palette.brown}`, outlineOffset: '0.2em' },
} as const;

const PAGE_SX = {
  position: 'relative',
  flex: 1,
  minHeight: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.9em',
} as const;

const PAGE_ITEMS_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.9em',
  width: '100%',
} as const;

const MEASURE_SX = {
  ...PAGE_ITEMS_SX,
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'hidden',
  pointerEvents: 'none',
} as const;

const PAGE_BUTTON_SX = {
  mt: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3em',
  px: '0.6em',
  py: '0.5em',
  border: 0,
  bgcolor: 'transparent',
  fontFamily: TITLE_FONT,
  fontSize: '1.25em',
  fontWeight: 400,
  color: palette.brownDeep,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  '& svg': { transition: 'translate 200ms ease' },
  '&:active svg': { translate: '0 var(--nudge)' },
  '@media (hover: hover)': { '&:hover svg': { translate: '0 var(--nudge)' } },
  '&:focus-visible': { outline: `2px solid ${palette.brownDeep}`, outlineOffset: '0.1em', borderRadius: '0.2em' },
} as const;

const PAGE_BUTTON_LABEL_SX = {
  textDecoration: 'underline',
  textDecorationThickness: '0.1em',
  textUnderlineOffset: '0.18em',
} as const;

const VIDEO_FRAME_SX = {
  width: 'min(100%, 28em)',
  flexShrink: 0,
  aspectRatio: '16 / 9',
  borderRadius: '0.8em',
  overflow: 'hidden',
} as const;

const REST_CLASS: Record<Side, string> = { left: 'ziggy-rest-left', right: 'ziggy-rest-right' };
const ANGRY_CLASS: Record<Side, string> = { left: 'ziggy-angry-left', right: 'ziggy-angry-right' };

const ANGRY_SWAP: Record<Side, Record<string, { opacity: number }>> = {
  left: { [`& .${REST_CLASS.left}`]: { opacity: 0 }, [`& .${ANGRY_CLASS.left}`]: { opacity: 1 } },
  right: { [`& .${REST_CLASS.right}`]: { opacity: 0 }, [`& .${ANGRY_CLASS.right}`]: { opacity: 1 } },
};

const RAIL_SX = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: ofLeaf(FROG_EDGE),
  right: ofLeaf(FROG_EDGE + FROG_WIDTH),
} as const;

const ART_BOX_SX = {
  position: 'absolute',
  display: 'block',
  left: 0,
  bottom: 0,
  width: '100%',
  aspectRatio: ANGRY_ASPECT,
} as const;

const ART_IMG_SX = {
  ...FILL,
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  objectPosition: '50% 100%',
  pointerEvents: 'none',
  userSelect: 'none',
} as const;

function Leaf({ side, animation }: { side: Side; animation: string }) {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        top: 'var(--leaf-top)',
        left: side === 'left' ? ofLeaf(-STEM_BLEED) : 'auto',
        right: side === 'right' ? ofLeaf(-STEM_BLEED) : 'auto',
        width: 'var(--leaf-width)',
        aspectRatio: LEAF_ASPECT,
        transformOrigin: LEAF_PIVOT[side],
        animation,
        pointerEvents: 'none',
      }}
    >
      <Box
        component="img"
        src={assets.leaf}
        alt=""
        draggable={false}
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          scale: side === 'right' ? '-1 1' : 'none',
          userSelect: 'none',
        }}
      />
    </Box>
  );
}

function Ziggy({
  side,
  hop,
  label,
  onHop,
  onHopEnd,
}: {
  side: Side;
  hop: HopAnimation | null;
  label: string;
  onHop: () => void;
  onHopEnd: (event: AnimationEvent<HTMLDivElement>) => void;
}) {
  return (
    <Box sx={{ ...FILL, zIndex: 1, pointerEvents: 'none' }}>
      <Box sx={RAIL_SX}>
        <Box
          onAnimationEnd={onHopEnd}
          sx={{
            ...FILL,
            translate: side === 'left' ? '0 0' : '100% 0',
            animation: hop?.travel ?? 'none',
          }}
        >
          <Box
            component="button"
            type="button"
            aria-label={label}
            aria-disabled={hop ? true : undefined}
            onClick={onHop}
            sx={{
              position: 'absolute',
              left: 0,
              top: `calc(var(--leaf-top) + ${FROG_TOP} * var(--leaf-width))`,
              width: ofLeaf(FROG_WIDTH),
              aspectRatio: RESTING_ASPECT,
              display: 'block',
              m: 0,
              p: 0,
              border: 0,
              borderRadius: '24%',
              background: 'none',
              font: 'inherit',
              cursor: hop ? 'default' : 'pointer',
              pointerEvents: 'auto',
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
              '&:focus-visible': {
                outline: hop ? 'none' : `2px solid ${palette.brown}`,
                outlineOffset: '0.25em',
              },
              ...(!hop && {
                '&:active, &:focus-visible': ANGRY_SWAP[side],
                '@media (hover: hover)': { '&:hover': ANGRY_SWAP[side] },
              }),
            }}
          >
            <Box component="span" sx={{ ...LAYER, animation: hop?.arc ?? 'none' }}>
              <Box
                component="span"
                sx={{ ...LAYER, transformOrigin: FROG_PIVOT[side], animation: hop?.takeoff ?? 'none' }}
              >
                <Box
                  component="span"
                  sx={{
                    ...LAYER,
                    transformOrigin: FROG_PIVOT[opposite(side)],
                    animation: hop?.landing ?? 'none',
                  }}
                >
                  <Box
                    component="span"
                    sx={{ ...LAYER, transformOrigin: SQUASH_ORIGIN[side], animation: hop?.squash ?? 'none' }}
                  >
                    <Box component="span" sx={ART_BOX_SX}>
                      {SIDES.map((s) => (
                        <Box
                          key={s}
                          component="img"
                          className={REST_CLASS[s]}
                          src={assets.ziggy[s].resting}
                          alt=""
                          draggable={false}
                          sx={{
                            ...ART_IMG_SX,
                            opacity: !hop && s === side ? 1 : 0,
                            animation: hop && s !== side ? hop.arrive : 'none',
                          }}
                        />
                      ))}
                      {SIDES.map((s) => (
                        <Box
                          key={s}
                          component="img"
                          className={ANGRY_CLASS[s]}
                          src={assets.ziggy[s].angry}
                          alt=""
                          draggable={false}
                          sx={{
                            ...ART_IMG_SX,
                            opacity: 0,
                            animation: hop && s === side ? hop.leave : 'none',
                          }}
                        />
                      ))}
                    </Box>
                    {SIDES.map((s) => (
                      <Box
                        key={s}
                        component="img"
                        src={assets.ziggy[s].jumping}
                        alt=""
                        draggable={false}
                        sx={{
                          position: 'absolute',
                          display: 'block',
                          top: pct(JUMP_TOP),
                          left: s === 'left' ? pct(JUMP_INSET) : 'auto',
                          right: s === 'right' ? pct(JUMP_INSET) : 'auto',
                          width: pct(JUMP_WIDTH),
                          height: 'auto',
                          aspectRatio: JUMP_ASPECT,
                          transformOrigin: JUMP_ORIGIN[s],
                          opacity: 0,
                          animation: hop && s === side ? hop.fly : 'none',
                          pointerEvents: 'none',
                          userSelect: 'none',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function SectionContent({
  headingId,
  title,
  side,
  nextTitle,
  pager = false,
  stretch = false,
  children,
}: {
  headingId: string;
  title: string;
  side: Side;
  nextTitle: string;
  pager?: boolean;
  stretch?: boolean;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: pager
          ? `max(${CONTENT_TOP_CQH.portrait}cqh, ${BACK_LINK_BOTTOM})`
          : `${CONTENT_TOP_CQH.portrait}cqh`,
        left: `${PAGE_GUTTER_CQW}cqw`,
        right: `${PAGE_GUTTER_CQW}cqw`,
        bottom: `calc(100cqh - var(--leaf-top) + ${ANGRY_ABOVE_LEAF} * var(--leaf-width) + ${CONTENT_ABOVE_FROG_CQH}cqh)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: pager ? 'flex-start' : 'center',
        gap: '0.9em',
        textAlign: 'center',
        fontSize: 'var(--type)',
        [LANDSCAPE]: {
          top: `${CONTENT_TOP_CQH.landscape}cqh`,
          bottom: `${CONTENT_TOP_CQH.landscape}cqh`,
          left: side === 'left' ? CONTENT_BESIDE_LEAF : `${PAGE_GUTTER_CQW}cqw`,
          right: side === 'right' ? CONTENT_BESIDE_LEAF : `${PAGE_GUTTER_CQW}cqw`,
        },
      }}
    >
      <Box sx={stretch ? STRETCH_CARD_SX : pager ? PAGER_CARD_SX : CARD_SX}>
        <Typography id={headingId} component="h2" sx={TITLE_SX}>
          {title}
        </Typography>
        {children}
      </Box>
      <Typography aria-hidden sx={HINT_SX}>
        Poke Ziggy to hop to {nextTitle}
      </Typography>
    </Box>
  );
}

function PlayIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 48 48"
      aria-hidden
      focusable="false"
      sx={{ width: '3.2em', height: '3.2em' }}
    >
      <circle cx="24" cy="24" r="22" fill={palette.coral} />
      <path d="M19 15.5v17l14-8.5z" fill={palette.paper} />
    </Box>
  );
}

function SocialLinks() {
  return (
    <Box
      component="ul"
      role="list"
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0,
        maxWidth: '26em',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.7em',
      }}
    >
      {SOCIALS.map((social) => (
        <Box component="li" key={social.label} sx={{ display: 'flex' }}>
          <Box
            component="a"
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            sx={SOCIAL_LINK_SX}
          >
            <social.Icon sx={{ fontSize: '1.3em' }} />
            {social.label}
            <Box component="span" sx={VISUALLY_HIDDEN}>
              (opens in a new tab)
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

type Qa = { question: string; answer: string };

type Plan = { single: boolean; factPages: number[][] };

const spareRoom = (page: HTMLElement) => {
  const card = page.parentElement;
  const area = card?.parentElement;
  const hint = card?.nextElementSibling;
  if (!card || !area || !hint) return 0;
  return (
    area.getBoundingClientRect().height -
    (hint.getBoundingClientRect().bottom - card.getBoundingClientRect().top)
  );
};

const fullestPage = (left: number[], heights: number[], gap: number, room: number) => {
  let best = [left[0]];
  let bestHeight = 0;
  const extend = (pick: number[], height: number, from: number) => {
    if (height > bestHeight) {
      best = pick;
      bestHeight = height;
    }
    for (let next = from; next < left.length; next += 1) {
      const nextHeight = height + (pick.length > 0 ? gap : 0) + heights[left[next]];
      if (nextHeight <= room) extend([...pick, left[next]], nextHeight, next + 1);
    }
  };
  extend([], 0, 0);
  return best;
};

const packFactPages = (heights: number[], gap: number, firstRoom: number, room: number) => {
  const pages: number[][] = [];
  let left = heights.map((_, index) => index);
  while (left.length > 0) {
    const pick = fullestPage(left, heights, gap, pages.length === 0 ? firstRoom : room);
    pages.push(pick);
    left = left.filter((index) => !pick.includes(index));
  }
  return pages;
};

const readPlan = (page: HTMLElement, measure: HTMLElement): Plan => {
  const [paragraph, , credit, , list, button] = Array.from(measure.children);
  const questions = Array.from(list.children).map((item) => item.getBoundingClientRect());
  const lastBottom = questions[questions.length - 1].bottom;
  const room = page.getBoundingClientRect().height + spareRoom(page);
  const buttonRoom = button.getBoundingClientRect().bottom - lastBottom;
  const creditRoom = questions[0].top - credit.getBoundingClientRect().top;
  return {
    single: lastBottom - paragraph.getBoundingClientRect().top - creditRoom <= room,
    factPages: packFactPages(
      questions.map((question) => question.height),
      parseFloat(getComputedStyle(list).rowGap),
      room - buttonRoom - creditRoom,
      room - buttonRoom,
    ),
  };
};

function FactsCredit() {
  return (
    <>
      <Typography sx={BODY_SX}>{ABOUT_ME.factsCredit}</Typography>
      <Box component="hr" sx={DIVIDER_SX} />
    </>
  );
}

function QaList({ questions }: { questions: readonly Qa[] }) {
  return (
    <Box component="dl" sx={QA_LIST_SX}>
      {questions.map(({ question, answer }) => (
        <div key={question}>
          <Typography component="dt" sx={{ ...QA_LINE_SX, fontWeight: 700 }}>
            <span>Q:</span>
            {question}
          </Typography>
          <Typography component="dd" sx={QA_LINE_SX}>
            <Box component="span" sx={{ fontWeight: 700 }}>
              A:
            </Box>
            {answer}
          </Typography>
        </div>
      ))}
    </Box>
  );
}

function PageButton({ back, onClick }: { back: boolean; onClick?: () => void }) {
  return (
    <Box component="button" type="button" onClick={onClick} sx={PAGE_BUTTON_SX}>
      <Box component="span" sx={PAGE_BUTTON_LABEL_SX}>
        {back ? 'Back to start' : 'Show more'}
      </Box>
      <ArrowDownIcon
        sx={{ fontSize: '1em', rotate: back ? '180deg' : 'none', '--nudge': back ? '-0.15em' : '0.15em' }}
      />
    </Box>
  );
}

function AboutMe({ page, onPage }: { page: number; onPage: (page: number) => void }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [plan, setPlan] = useState<Plan | null>(null);

  useLayoutEffect(() => {
    const pageBox = pageRef.current;
    const measure = measureRef.current;
    const area = pageBox?.parentElement?.parentElement;
    if (!pageBox || !measure || !area) return;
    const observer = new ResizeObserver(() => setPlan(readPlan(pageBox, measure)));
    observer.observe(area);
    observer.observe(pageBox);
    observer.observe(measure);
    return () => observer.disconnect();
  }, []);

  const single = !plan || plan.single;
  const factPages = plan?.factPages ?? [];
  const shown = Math.min(page, factPages.length);
  const atEnd = shown === factPages.length;
  const questions =
    shown > 0
      ? factPages[shown - 1].map((index) => ABOUT_ME.questions[index])
      : single
        ? ABOUT_ME.questions
        : [];

  return (
    <Box ref={pageRef} sx={PAGE_SX}>
      <Box aria-live="polite" sx={PAGE_ITEMS_SX}>
        {shown === 0 && <Typography sx={BODY_SX}>{ABOUT_ME.paragraph}</Typography>}
        {shown === 0 && single && <Box component="hr" sx={DIVIDER_SX} />}
        {shown === 1 && <FactsCredit />}
        {questions.length > 0 && <QaList questions={questions} />}
      </Box>
      {(shown > 0 || !single) && (
        <PageButton back={atEnd} onClick={() => onPage(atEnd ? 0 : shown + 1)} />
      )}
      <Box ref={measureRef} inert sx={MEASURE_SX}>
        <Typography sx={BODY_SX}>{ABOUT_ME.paragraph}</Typography>
        <Box component="hr" sx={DIVIDER_SX} />
        <FactsCredit />
        <QaList questions={ABOUT_ME.questions} />
        <PageButton back={false} />
      </Box>
    </Box>
  );
}

function LatestVideo({ shown }: { shown: boolean }) {
  if (!YOUTUBE_CHANNEL_ID) {
    return (
      <Box
        sx={{
          ...VIDEO_FRAME_SX,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6em',
          bgcolor: alpha(palette.tealSoft, 0.35),
          border: `2px dashed ${alpha(palette.brown, 0.25)}`,
        }}
      >
        <PlayIcon />
        <Typography sx={{ fontSize: '1em', fontWeight: 700, color: palette.brown }}>
          Video coming soon
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ ...VIDEO_FRAME_SX, bgcolor: palette.navy }}>
      {shown && (
        <Box
          component="iframe"
          src={`https://www.youtube-nocookie.com/embed/videoseries?list=UU${encodeURIComponent(YOUTUBE_CHANNEL_ID.slice(2))}`}
          title="Latest video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          sx={{ display: 'block', width: '100%', height: '100%', border: 0 }}
        />
      )}
    </Box>
  );
}

const DOT_PULSE_MS = 1200;
const DOT_STAGGER_MS = 200;

const DOT_PULSE = keyframes({
  '0%, 80%, 100%': { opacity: 0.2 },
  '40%': { opacity: 1 },
});

function DandelionCount({ shown }: { shown: boolean }) {
  const counted = Number.isFinite(DANDELION_COUNT);

  return (
    <>
      <Typography
        sx={{
          fontFamily: TITLE_FONT,
          fontWeight: 400,
          fontSize: '4.6em',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {counted ? DANDELION_COUNT.toLocaleString() : <span aria-hidden>—</span>}
        {counted && (
          <Box component="span" aria-hidden>
            {Array.from({ length: 3 }).map((_, i) => (
              <Box
                key={i}
                component="span"
                sx={{
                  opacity: 0.2,
                  animation: shown
                    ? `${DOT_PULSE} ${DOT_PULSE_MS}ms ease-in-out ${i * DOT_STAGGER_MS}ms infinite both`
                    : 'none',
                  '@media (prefers-reduced-motion: reduce)': { animation: 'none', opacity: 1 },
                }}
              >
                .
              </Box>
            ))}
          </Box>
        )}
      </Typography>
      <Typography sx={BODY_SX}>{counted ? 'dandelions and counting' : 'The count is coming soon.'}</Typography>
    </>
  );
}

export function InfoPage() {
  const [carousel, setCarousel] = useState<Carousel>({ current: 0, hopping: false });
  const [aboutPage, setAboutPage] = useState(0);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const { current, hopping } = carousel;
  const next = (current + 1) % SECTIONS.length;
  const side = SECTIONS[current].side;
  const hop = hopping ? (reducedMotion ? REDUCED_HOP_ANIMATIONS : HOP_ANIMATIONS)[side] : null;
  const hopMs = reducedMotion ? REDUCED_HOP_MS : HOP_MS;

  useEffect(() => {
    if (!hopping) return;
    const fallback = window.setTimeout(() => setCarousel(land), hopMs + HOP_FALLBACK_MS);
    return () => window.clearTimeout(fallback);
  }, [hopping, hopMs]);

  const handleHopEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setCarousel(land);
  };

  return (
    <Box sx={STAGE_SX}>
      <Typography id="page-heading" tabIndex={-1} component="h1" sx={VISUALLY_HIDDEN}>
        Info
      </Typography>

      <BackLink to="/" label="Back to home" />

      <Ziggy
        side={side}
        hop={hop}
        label={`Poke Ziggy to hop to ${SECTIONS[next].title}`}
        onHop={() => {
          if (!hopping) setCarousel(launch);
        }}
        onHopEnd={handleHopEnd}
      />

      {SECTIONS.map((section, index) => {
        const isCurrent = index === current;
        const isNext = hopping && index === next;
        const headingId = `info-${section.id}`;
        const isAbout = section.id === 'about';
        const isFunFacts = isAbout && aboutPage > 0;
        const slideAnimation =
          hop && isCurrent ? hop.slideOut : hop && isNext ? hop.slideIn : 'none';
        const leafAnimation =
          hop && isCurrent ? hop.leafOut : hop && isNext ? hop.leafIn : 'none';

        return (
          <Box
            key={section.id}
            component="section"
            aria-labelledby={headingId}
            inert={!isCurrent || hopping}
            sx={{
              ...FILL,
              visibility: isCurrent || isNext ? 'visible' : 'hidden',
              animation: slideAnimation,
            }}
          >
            <Leaf side={section.side} animation={leafAnimation} />
            <SectionContent
              headingId={headingId}
              title={isFunFacts ? ABOUT_ME.factsHeading : section.title}
              side={section.side}
              nextTitle={SECTIONS[(index + 1) % SECTIONS.length].title}
              pager={isAbout}
              stretch={isFunFacts}
            >
              {section.id === 'socials' && <SocialLinks />}
              {section.id === 'about' && <AboutMe page={aboutPage} onPage={setAboutPage} />}
              {section.id === 'video' && <LatestVideo shown={isCurrent || isNext} />}
              {section.id === 'dandelions' && <DandelionCount shown={isCurrent || isNext} />}
            </SectionContent>
          </Box>
        );
      })}

      <Box role="status" sx={VISUALLY_HIDDEN}>
        {`${SECTIONS[current].title}, ${current + 1} of ${SECTIONS.length}`}
      </Box>
    </Box>
  );
}
