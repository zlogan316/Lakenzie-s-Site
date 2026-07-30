import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { palette } from '../theme/palette';

/** Placeholder destination for the left dandelion. The real games hub is its own project; this
 *  exists so the departure transition can be built and tested end to end without waiting on it. */
export function GamesPage() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: palette.cream,
      }}
    >
      {/* id and tabIndex are the arrival focus target — see AppShell */}
      <Typography id="page-heading" tabIndex={-1} component="h1" variant="h2" sx={{ color: palette.brown }}>
        Games
      </Typography>
    </Box>
  );
}
