import '@mui/material/styles';

interface GamesPalette {
  correct: string;
  present: string;
  absent: string;
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
