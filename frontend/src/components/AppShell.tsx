import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { palette } from '../theme/palette';
import { assets } from '../assets';

const PRELOAD = [assets.hill, assets.clouds];

export function AppShell() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const [assetsReady, setAssetsReady] = useState(false);
  const loading = isLanding && !assetsReady;

  const lastPath = useRef(location.pathname);

  useEffect(() => {
    if (lastPath.current === location.pathname) return;
    lastPath.current = location.pathname;
    document.getElementById('page-heading')?.focus();
  }, [location.pathname]);

  useEffect(() => {
    if (!isLanding) return;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setAssetsReady(true);
    };

    let remaining = PRELOAD.length;
    const onOne = () => {
      remaining -= 1;
      if (remaining <= 0) finish();
    };
    const imgs = PRELOAD.map((src) => {
      const img = new Image();
      img.onload = onOne;
      img.onerror = onOne;
      img.src = src;
      return img;
    });

    const fallback = window.setTimeout(finish, 15000);

    return () => {
      window.clearTimeout(fallback);
      imgs.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [isLanding]);

  return (
    <Box
      sx={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
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

      <Box
        component="main"
        inert={loading}
        sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Outlet />
      </Box>

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
