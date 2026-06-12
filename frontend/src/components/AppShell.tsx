import { Outlet } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { fontDisplay } from '../theme/theme';

export function AppShell() {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Box component="header" sx={{ py: 2.25 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            component="span"
            sx={{
              fontFamily: fontDisplay,
              fontStyle: 'italic',
              fontWeight: 540,
              fontSize: '1.35rem',
              letterSpacing: '0.01em',
              color: 'text.primary',
            }}
          >
            lakenzie&rsquo;s corner
          </Typography>
          <FavoriteIcon sx={{ fontSize: 13, color: 'secondary.main', mt: '-0.6em' }} />
        </Container>
      </Box>

      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>

      <Box component="footer" sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ color: 'text.secondary', letterSpacing: '0.04em' }}>
            made with <Box component="span" sx={{ color: 'secondary.main' }}>&hearts;</Box> for you
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
