export const assets = {
  clouds: '/clouds.svg',
  dandelionFrames: [
    { src: '/Dandelion1.png', stemX: 0.2 },
    { src: '/Dandelion2.png', stemX: 0.2 },
    { src: '/Dandelion3.png', stemX: 0.2 },
    { src: '/Dandelion4.png', stemX: 0.2 },
    { src: '/Dandelion5.png', stemX: 0.2 },
    { src: '/Dandelion6.png', stemX: 0.2 },
    { src: '/Dandelion7.png', stemX: 0.2 },
    { src: '/Dandelion8.png', stemX: 0.2 },
    { src: '/Dandelion9.png', stemX: 0.2 },
    { src: '/Dandelion10.png', stemX: 0.2 },
    { src: '/Dandelion11.png', stemX: 0.2 },
    { src: '/Dandelion12.png', stemX: 0.2 },
    { src: '/Dandelion13.png', stemX: 0.2 },
  ],
  hill: '/dandelion-heart-hill.png',
  heart: '/heart.svg',
  icons: '/icons.svg',
  noise:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E",
} as const;

export type AssetKey = keyof typeof assets;

export const DANDELION_PAGE_MM = 500;

export type DandelionFrame = { src: string; stemX: number };

export const cssUrl = (src: string) => `url("${src}")`;
