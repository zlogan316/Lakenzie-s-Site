import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { palette } from '../theme/palette';

export function FunFactsPage() {
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
      <Typography id="page-heading" tabIndex={-1} component="h1" variant="h2" sx={{ color: palette.brown }}>
        Fun Facts
      </Typography>
    </Box>
  );
}
