export const comingSoon = {
  landing: import.meta.env.VITE_COMING_SOON_LANDING === 'true',
  games: import.meta.env.VITE_COMING_SOON_GAMES === 'true',
  funFacts: import.meta.env.VITE_COMING_SOON_FUN_FACTS === 'true',
} as const;
