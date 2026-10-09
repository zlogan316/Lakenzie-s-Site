import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { palette } from '../theme/palette';
import { fontTitle } from '../theme/theme';
import { DANDELION_FRAME_SX, FRAME_INSET, FRAME_SIZE, FRAME_TYPE } from '../theme/dandelionFrame';
import { BackLink } from '../components/BackLink';
import { GameCard } from '../components/GameCard';
import { WordGuessIcon, ComingSoonIcon } from '../components/gameIcons';

const GAMES = [
  {
    id: 'word-guess',
    title: 'Dandelion Guess',
    description: 'Guess the word in six tries.',
    icon: <WordGuessIcon />,
    to: '/games/word-guess',
  },
] as const;

const SCROLLBAR_HIDE_MS = 800;

const STAGE_SX = {
  position: 'relative',
  flex: 1,
  minHeight: 0,
  containerType: 'size',
  '--type': FRAME_TYPE,
} as const;

const PANE_SX = {
  width: { xs: '100%', md: '60%' },
  maxWidth: '32em',
  minHeight: '80%',
  my: 'auto',
  display: 'flex',
  flexDirection: 'column',
  px: '1.3em',
  pt: '1.3em',
  pb: '0.5em',
  bgcolor: palette.brownDeep,
  fontSize: 'var(--type)',
} as const;

const HEADING_SX = {
  mb: '0.4em',
  fontFamily: fontTitle,
  fontWeight: 400,
  fontSize: '2.5em',
  lineHeight: 1.1,
  color: palette.goldSoft,
} as const;

const FRAME_SX = {
  ...DANDELION_FRAME_SX,
  position: 'absolute',
  inset: 0,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  py: { xs: 8, md: 9 },
  px: 2,
} as const;

const THUMB_SX = {
  '--frame': FRAME_SIZE,
  position: 'absolute',
  right: 'calc(var(--frame) * 1.2)',
  top: 'calc(var(--frame) * 1.2 + (100% - var(--frame) * 2.4) * (1 - var(--thumb-size, 1)) * var(--thumb-pos, 0))',
  width: 'calc(var(--frame) * 0.25)',
  height: 'calc((100% - var(--frame) * 2.4) * var(--thumb-size, 1))',
  borderRadius: 'calc(var(--frame) * 0.125)',
  bgcolor: alpha(palette.cream, 0.85),
  pointerEvents: 'none',
  opacity: 0,
  transition: 'opacity 200ms ease',
} as const;

const THUMB_VISIBLE_SX = { opacity: 1 } as const;

export function GamesPage() {
  const navigate = useNavigate();
  const [scrolling, setScrolling] = useState(false);
  const hideTimer = useRef(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; top: number } | null>(null);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const syncThumb = () => {
    const frame = frameRef.current;
    const thumb = thumbRef.current;
    if (!frame || !thumb) return false;
    const range = frame.scrollHeight - frame.clientHeight;
    if (range <= 0) return false;
    thumb.style.setProperty('--thumb-size', String(frame.clientHeight / frame.scrollHeight));
    thumb.style.setProperty('--thumb-pos', String(frame.scrollTop / range));
    return true;
  };

  const showScrollbar = () => {
    if (!syncThumb()) return;
    setScrolling(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (!drag.current) setScrolling(false);
    }, SCROLLBAR_HIDE_MS);
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    const box = syncThumb() && thumbRef.current?.getBoundingClientRect();
    if (!box) return;
    const { clientX: x, clientY: y } = event;
    if (x < box.left || x > box.right || y < box.top || y > box.bottom) return;
    const frame = event.currentTarget;
    event.preventDefault();
    frame.setPointerCapture(event.pointerId);
    frame.scrollTo({ top: frame.scrollTop, behavior: 'instant' });
    drag.current = { y, top: frame.scrollTop };
    showScrollbar();
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const thumb = thumbRef.current;
    if (!drag.current || !thumb) return;
    const frame = event.currentTarget;
    frame.scrollTop =
      drag.current.top + ((event.clientY - drag.current.y) * frame.clientHeight) / thumb.offsetHeight;
  };

  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    showScrollbar();
  };

  return (
    <Box sx={STAGE_SX}>
      <Box
        ref={frameRef}
        sx={FRAME_SX}
        onScroll={showScrollbar}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <Box sx={PANE_SX}>
          <Typography id="page-heading" tabIndex={-1} component="h1" sx={HEADING_SX}>
            Games
          </Typography>

          {GAMES.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              icon={game.icon}
              onOpen={() => navigate(game.to)}
            />
          ))}
          <GameCard
            title="Coming Soon"
            description="More games are sprouting!"
            icon={<ComingSoonIcon />}
          />
        </Box>
      </Box>

      <Box ref={thumbRef} aria-hidden sx={[THUMB_SX, scrolling && THUMB_VISIBLE_SX]} />

      <BackLink to="/" label="Back to home" inset={FRAME_INSET} />
    </Box>
  );
}
