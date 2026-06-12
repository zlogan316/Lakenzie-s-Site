import '@mui/material/styles';

/**
 * Module augmentation: game-specific color slots on the MUI palette.
 * Populated in ./theme.ts from ./palette.ts tokens.
 */
interface GamesPalette {
  /** Wordle "correct spot" — olive */
  correct: string;
  /** Wordle "wrong spot" — gold */
  present: string;
  /** Wordle "not in word" — muted warm grey-brown */
  absent: string;
  /** Connections group colors, easiest to hardest: gold, olive, teal, coral */
  groups: [string, string, string, string];
}

declare module '@mui/material/styles' {
  interface Palette {
    games: GamesPalette;
  }
  interface PaletteOptions {
    games?: GamesPalette;
  }
}
