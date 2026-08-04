/** Every image URL the site uses, in one place. Import `assets` and reference the key —
 *  nothing else should hardcode a path, so a renamed or swapped file is a one-line change here.
 *  Paths are absolute and served straight from /public (Vite copies it to the build root). */
export const assets = {
  /** drifting cloud strip tiled across the landing page */
  clouds: '/clouds.svg',
  /** Ordered frames for the dandelion departure animation, resting frame first. Animation length
   *  is this array's length — never hardcode a count.
   *
   *  Every frame is exported from Inkscape on the same DANDELION_PAGE_MM square page with the stem
   *  base at an identical spot on it. That shared canvas is what lets the flower hold still while
   *  only the seeds move, and it is why no per-frame geometry is needed here: one scale and one
   *  anchor in DandelionLink serve all of them. Frames cropped to their own content would each
   *  need their own, and the flower would lurch and rescale between them. */
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
 *  Changing the export page size means changing this and re-measuring STEM_ANCHOR. */
export const DANDELION_PAGE_MM = 300;

/** Wrap an asset for a CSS image value (`backgroundImage`, etc.). Quoted so data URIs
 *  containing quotes or parens stay valid: cssUrl(assets.hill) → url("/dandelion-heart-hill.png") */
export const cssUrl = (src: string) => `url("${src}")`;
