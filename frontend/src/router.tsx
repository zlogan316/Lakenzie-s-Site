import { createBrowserRouter } from 'react-router';
import { AppShell } from './components/AppShell';
import { LandingPage } from './pages/LandingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppShell,
    children: [
      { index: true, Component: LandingPage },
      // future: { path: 'games/word-guess', Component: WordGuessPage },
      // future: { path: 'games/connections', Component: ConnectionsPage },
    ],
  },
]);
