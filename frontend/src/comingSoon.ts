export const comingSoon = {
  landing: import.meta.env.VITE_COMING_SOON_LANDING === 'true',
  games: import.meta.env.VITE_COMING_SOON_GAMES === 'true',
  info: import.meta.env.VITE_COMING_SOON_INFO === 'true',
} as const;
