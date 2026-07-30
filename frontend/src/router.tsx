import { createBrowserRouter } from 'react-router';
import { AppShell } from './components/AppShell';
import { LandingPage } from './pages/LandingPage';
import { GamesPage } from './pages/GamesPage';
import { FunFactsPage } from './pages/FunFactsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppShell,
    children: [
      { index: true, Component: LandingPage },
      { path: 'games', Component: GamesPage },
      { path: 'fun-facts', Component: FunFactsPage },
      // future: { path: 'games/word-guess', Component: WordGuessPage },
      // future: { path: 'games/connections', Component: ConnectionsPage },
    ],
  },
]);
