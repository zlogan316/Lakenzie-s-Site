/** Every image URL the site uses, in one place. Import `assets` and reference the key —
 *  nothing else should hardcode a path, so a renamed or swapped file is a one-line change here.
 *  Paths are absolute and served straight from /public (Vite copies it to the build root). */
export const assets = {
  /** drifting cloud strip tiled across the landing page */
  clouds: '/clouds.svg',
  /** Ordered frames for the dandelion departure animation, resting frame first. Animation length
   *  is this array's length — never hardcode a count.
   *
   *  Every frame is exported from Inkscape on the same DANDELION_PAGE_MM square page, which is what
   *  lets the flower hold still while only the seeds move.
   *
   *  `stemX` is where that frame's stem base sits across the page, as a fraction of the page width,
   *  measured off the PNGs. It OUGHT to be one shared number — a common export page is the whole
   *  point — but frames 1-8 and 9-13 were aligned in separate Inkscape sessions and sit 0.0603 of
   *  the page (~30mm, ~157px on screen) apart, which reads as the flower lurching sideways between
   *  frame 8 and frame 9. Recording it per frame corrects that in CSS. It is a workaround, not the
   *  design: re-export one group to match the other, then collapse this back to a single constant.
   *  Note it will silently go stale if frames are re-exported without re-measuring. */
  dandelionFrames: [
    { src: '/Dandelion1.png', stemX: 0.2 },
    { src: '/Dandelion2.png', stemX: 0.2 },
    { src: '/Dandelion3.png', stemX: 0.2 },
    { src: '/Dandelion4.png', stemX: 0.2 },
    { src: '/Dandelion5.png', stemX: 0.2 },
    { src: '/Dandelion6.png', stemX: 0.2 },
    { src: '/Dandelion7.png', stemX: 0.2 },
    { src: '/Dandelion8.png', stemX: 0.2 },
    { src: '/Dandelion9.png', stemX: 0.2603 },
    { src: '/Dandelion10.png', stemX: 0.2603 },
    { src: '/Dandelion11.png', stemX: 0.2603 },
    { src: '/Dandelion12.png', stemX: 0.2603 },
    { src: '/Dandelion13.png', stemX: 0.2603 },
  ],
  /** dandelion-heart-hill scene anchored to the bottom of the landing page. A PNG, not a vector:
   *  the artwork is a 1123x794 raster (the old .svg was just an Inkscape wrapper around this exact
   *  image, base64-inlined at a 33% size premium). Alpha above the horizon lets the sky show through. */
  hill: '/dandelion-heart-hill.png',
  /** site favicon — also referenced directly in index.html, which can't import this module */
  heart: '/heart.svg',
  icons: '/icons.svg',
  /** generated grain texture, not a file in /public: a tiny tiled fractal-noise SVG */
  noise:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E",
} as const;

export type AssetKey = keyof typeof assets;

/** Side of the square Inkscape page every dandelion frame is exported on, in mm. All frames share
 *  it, so a single scale factor converts page millimetres to screen size for the whole animation.
 *  Changing the export page size means changing this and re-measuring the stem positions. */
export const DANDELION_PAGE_MM = 500;

/** One frame of the departure: its path and where its stem base sits across the page. */
export type DandelionFrame = { src: string; stemX: number };

/** Wrap an asset for a CSS image value (`backgroundImage`, etc.). Quoted so data URIs
 *  containing quotes or parens stay valid: cssUrl(assets.hill) → url("/dandelion-heart-hill.png") */
export const cssUrl = (src: string) => `url("${src}")`;
