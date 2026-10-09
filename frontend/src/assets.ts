export const assets = {
  banner: '/banner.png',
  clouds: '/clouds.svg',
  dandelionBloom: '/dandelion_bloom.svg',
  dandelionFrame: '/dandelion_frame.png',
  dandelionFrames: [
    '/Dandelion1.png',
    '/Dandelion2.png',
    '/Dandelion3.png',
    '/Dandelion4.png',
    '/Dandelion5.png',
    '/Dandelion6.png',
    '/Dandelion7.png',
    '/Dandelion8.png',
    '/Dandelion9.png',
    '/Dandelion10.png',
    '/Dandelion11.png',
    '/Dandelion12.png',
    '/Dandelion13.png',
  ],
  dandelionTile: '/dandelion_tile.svg',
  hill: '/dandelion-heart-hill.png',
  leaf: '/Leaf_Left.svg',
  tree: '/Tree_Background_Streched.png',
  ziggy: {
    left: {
      resting: '/Ziggy_Resting_Left.svg',
      angry: '/Ziggy_Angry_Left.svg',
      jumping: '/Ziggy_Jumping_Left_Leaf.svg',
    },
    right: {
      resting: '/Ziggy_Resting_Right.svg',
      angry: '/Ziggy_Angry_Right.svg',
      jumping: '/Ziggy_Jumping_Right_Leaf.svg',
    },
  },
  noise:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E",
} as const;

export const DANDELION_PAGE_MM = 500;

export const DANDELION_STEM_X = 0.2;
export const DANDELION_STEM_Y = 0.877;

export const cssUrl = (src: string) => `url("${src}")`;
