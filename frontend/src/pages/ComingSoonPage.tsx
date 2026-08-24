import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { palette } from '../theme/palette';

export function ComingSoonPage() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        px: 2,
        textAlign: 'center',
        bgcolor: palette.cream,
      }}
    >
      <Typography id="page-heading" tabIndex={-1} component="h1" variant="h2" sx={{ color: palette.brown }}>
        Coming Soon
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        This page isn&apos;t quite ready yet — check back soon!
      </Typography>
    </Box>
  );
}
