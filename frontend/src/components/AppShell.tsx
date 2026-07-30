import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { palette } from '../theme/palette';
import { assets } from '../assets';

/** Heavy art that must be ready before we reveal the page. */
const PRELOAD = [assets.hill, assets.clouds];

export function AppShell() {
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const [arriving, setArriving] = useState(false);
  const firstRender = useRef(true);

  // The dandelion departure hands over at full white, so a new route starts under a white veil and
  // fades it out — otherwise the destination snaps in. Focus moves to the page heading in the same
  // beat: a programmatic navigate() otherwise drops keyboard focus with no indication anything
  // happened.
  //
  // useLayoutEffect, not useEffect: the departure wash lives on the page being left, so it
  // unmounts the moment the route changes. Applying this veil after paint would leave one frame
  // where neither is covering, flashing the destination through.
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setArriving(true);
    document.getElementById('page-heading')?.focus();
    const id = window.setTimeout(() => setArriving(false), 400);
    return () => window.clearTimeout(id);
  }, [location.pathname]);

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
        height: '100dvh',
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

      {/* arrival veil — picks up where the departure wash left off and fades the new page in.
          transition is none on the way in so it appears instantly at full white; the fade only
          runs on the way out. Hidden at rest so it never blocks anything. */}
      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          inset: 0,
          bgcolor: palette.white,
          opacity: arriving ? 1 : 0,
          transition: arriving ? 'none' : 'opacity 400ms ease',
          visibility: arriving ? 'visible' : 'hidden',
          pointerEvents: 'none',
          zIndex: (theme) => theme.zIndex.modal + 2,
        }}
      />

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
