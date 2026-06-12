/// <reference path="./theme.d.ts" />
import { alpha, createTheme } from '@mui/material/styles';
import { palette } from './palette';

export const fontDisplay = "'Fraunces Variable', Georgia, serif";
export const fontBody = "'Quicksand Variable', 'Trebuchet MS', sans-serif";

const softShadow = `0 6px 24px ${alpha(palette.brown, 0.1)}`;
const softShadowLifted = `0 14px 36px ${alpha(palette.brown, 0.16)}`;

export const theme = createTheme({
  palette: {
    primary: { main: palette.teal, contrastText: palette.paper },
    secondary: { main: palette.coral, contrastText: palette.paper },
    background: { default: palette.cream, paper: palette.paper },
    text: {
      primary: palette.brown,
      secondary: alpha(palette.brown, 0.72),
    },
    divider: alpha(palette.brown, 0.12),
    games: {
      correct: palette.olive,
      present: palette.gold,
      absent: palette.absent,
      groups: [palette.gold, palette.olive, palette.teal, palette.coral],
    },
  },

  typography: {
    fontFamily: fontBody,
    h1: { fontFamily: fontDisplay, fontWeight: 560, letterSpacing: '-0.015em' },
    h2: { fontFamily: fontDisplay, fontWeight: 540, letterSpacing: '-0.01em' },
    h3: { fontFamily: fontDisplay, fontWeight: 520 },
    h4: { fontFamily: fontBody, fontWeight: 700 },
    h5: { fontFamily: fontBody, fontWeight: 700 },
    h6: { fontFamily: fontBody, fontWeight: 700 },
    button: { fontFamily: fontBody, fontWeight: 700, textTransform: 'none' },
    body1: { lineHeight: 1.65 },
  },

  shape: { borderRadius: 14 },

  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
          paddingInline: 22,
          paddingBlock: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        elevation1: { boxShadow: softShadow },
        elevation2: { boxShadow: softShadowLifted },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: softShadow,
          border: `1px solid ${alpha(palette.brown, 0.08)}`,
        },
      },
    },
  },
});
