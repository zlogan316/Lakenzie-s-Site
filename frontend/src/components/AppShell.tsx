import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { palette } from '../theme/palette';

/** Heavy art that must be ready before we reveal the page. */
const PRELOAD = ['/dandelion-heart-hill.svg', '/clouds.svg'];

export function AppShell() {
  const [loading, setLoading] = useState(true);

  // Hold a cream veil over everything until the background art has loaded.
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setLoading(false);
    };

    let remaining = PRELOAD.length;
    const onOne = () => {
      remaining -= 1;
      if (remaining <= 0) finish();
    };
    const imgs = PRELOAD.map((src) => {
      const img = new Image();
      img.onload = onOne;
      img.onerror = onOne; // a missing asset shouldn't trap the user
      img.src = src;
      return img;
    });

    // safety net: never strand the user behind the veil if an asset stalls
    const fallback = window.setTimeout(finish, 15000);

    return () => {
      window.clearTimeout(fallback);
      imgs.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* gold frame around the whole site, fixed to the viewport edges */}
      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          inset: 0,
          border: `2px solid ${palette.gold}`,
          pointerEvents: 'none',
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      />

      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>

      {/* full-screen loading veil — cream background + spinner, covering every page until ready */}
      {loading && (
        <Box
          role="status"
          aria-label="Loading"
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: palette.cream,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: (theme) => theme.zIndex.modal + 1,
          }}
        >
          <CircularProgress size="3rem" thickness={4} sx={{ color: palette.olive }} />
        </Box>
      )}
    </Box>
  );
}
