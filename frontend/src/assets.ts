/** Every image URL the site uses, in one place. Import `assets` and reference the key —
 *  nothing else should hardcode a path, so a renamed or swapped file is a one-line change here.
 *  Paths are absolute and served straight from /public (Vite copies it to the build root). */
export const assets = {
  /** drifting cloud strip tiled across the landing page */
  clouds: '/clouds.svg',
  /** Ordered frames for the dandelion departure animation, resting frame first. Animation length
   *  is this array's length — never hardcode a count.
   *
   *  width/height are each frame's own viewBox in mm. They are load-bearing, not documentation:
   *  every frame is currently cropped tight to its own content, so a frame whose canvas is 6.8x
   *  wider has to render 6.8x wider on screen for the flower inside it to stay the same size.
   *  Once the frames share one canvas these all become equal and the scaling reduces to a no-op. */
  dandelionFrames: [
    { src: '/Dandelion1.svg', width: 27.675169, height: 65.391815 },
    { src: '/Dandelion2.svg', width: 33.049179, height: 65.391823 },
    { src: '/Dandelion3.svg', width: 40.961819, height: 65.391823 },
    { src: '/Dandelion4.svg', width: 48.797699, height: 72.292572 },
    { src: '/Dandelion5.svg', width: 53.671337, height: 76.976822 },
    { src: '/Dandelion6.svg', width: 60.165062, height: 88.96167 },
    { src: '/Dandelion7.svg', width: 88.1399, height: 108.55926 },
    { src: '/Dandelion8.svg', width: 123.03648, height: 142.43921 },
    { src: '/Dandelion9.svg', width: 162.46928, height: 175.37787 },
    { src: '/Dandelion10.svg', width: 188.92334, height: 212.68629 },
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

/** One frame of the dandelion departure: its path, plus its own canvas size in mm.
 *
 *  `stem` is an optional escape hatch. DandelionLink normally infers where the stem base sits by
 *  assuming the crop grew right and up from a fixed bottom-left corner, which holds while the
 *  seeds are still travelling in one direction. Once they spread every way the crop expands on all
 *  four sides and that assumption fails, so such a frame can state its stem position outright:
 *  x from the left edge, y from the top, each as a fraction of that frame's own canvas. */
export type DandelionFrame = {
  src: string;
  width: number;
  height: number;
  stem?: { x: number; y: number };
};

/** Wrap an asset for a CSS image value (`backgroundImage`, etc.). Quoted so data URIs
 *  containing quotes or parens stay valid: cssUrl(assets.hill) → url("/dandelion-heart-hill.png") */
export const cssUrl = (src: string) => `url("${src}")`;
