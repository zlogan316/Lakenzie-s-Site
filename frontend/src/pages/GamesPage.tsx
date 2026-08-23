import { useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { palette } from '../theme/palette';
import { GameCard } from '../components/GameCard';
import { WordGuessIcon, RelationsIcon, ConnectTheDotsIcon } from '../components/gameIcons';

const GAMES = [
  {
    id: 'word-guess',
    title: 'Word-Guess',
    description: 'Guess the word in six tries.',
    icon: <WordGuessIcon />,
  },
  {
    id: 'relations',
    title: 'Relations',
    description: 'Sort sixteen words into four groups.',
    icon: <RelationsIcon />,
  },
  {
    id: 'connect-the-dots',
    title: 'Connect The Dots',
    description: 'Connect the dots to reveal the picture.',
    icon: <ConnectTheDotsIcon />,
  },
] as const;

export function GamesPage() {
  const [selected, setSelected] = useState<(typeof GAMES)[number] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: palette.cream,
        pt: { xs: 6, md: 9 },
        pb: { xs: 4, md: 6 },
        px: 2,
      }}
    >
      <Typography
        id="page-heading"
        tabIndex={-1}
        component="h1"
        variant="h2"
        sx={{ color: palette.brown, mb: { xs: 3, md: 5 } }}
      >
        Games
      </Typography>

      <Box
        sx={{
          width: '80%',
          maxWidth: '65ch',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 2.5 },
        }}
      >
        {GAMES.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            icon={game.icon}
            onOpen={() => {
              setSelected(game);
              setDialogOpen(true);
            }}
          />
        ))}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="game-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="game-dialog-title">{selected?.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Coming soon — {selected?.title} will live here.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
