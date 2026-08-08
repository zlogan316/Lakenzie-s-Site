/**
 * The single source of truth for every color in the app.
 * No other file should contain hex tokens — import from here instead.
 */
export const palette = {
  // core brand colors
  olive: '#808000',
  gold: '#FFC800',
  teal: '#5EB1BF',
  coral: '#DB504A',
  brown: '#583E23',

  // sky blues for the landing backdrop gradient
  navy: '#15233D',
  brightBlue: '#2BA3E3',

  // derived surfaces
  cream: '#FBF3E4',
  paper: '#FFFDF7',

  // muted "absent tile" tone (warm grey-brown)
  absent: '#9B8A76',

  // soft variants (tinted toward cream, for glows / accents / hovers)
  oliveSoft: '#A9A95E',
  goldSoft: '#FFDD7A',
  tealSoft: '#9CCFD9',
  coralSoft: '#E98E8A',
  brownSoft: '#8A6E4F',
  creamDeep: '#F3E6CD',
} as const;

export type PaletteToken = keyof typeof palette;
