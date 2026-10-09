import { createBrowserRouter } from 'react-router';
import { AppShell } from './components/AppShell';
import { LandingPage } from './pages/LandingPage';
import { GamesPage } from './pages/GamesPage';
import { WordGuessPage } from './pages/WordGuessPage';
import { DictionaryMatchPage } from './pages/DictionaryMatchPage';
import { FunFactsPage } from './pages/FunFactsPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { comingSoon } from './comingSoon';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppShell,
    children: [
      { index: true, Component: comingSoon.landing ? ComingSoonPage : LandingPage },
      { path: 'games', Component: comingSoon.games ? ComingSoonPage : GamesPage },
      {
        path: 'games/word-guess',
        Component: comingSoon.games ? ComingSoonPage : WordGuessPage,
      },
      {
        path: 'games/dictionary-match',
        Component: comingSoon.games ? ComingSoonPage : DictionaryMatchPage,
      },
      { path: 'fun-facts', Component: comingSoon.funFacts ? ComingSoonPage : FunFactsPage },
    ],
  },
]);
