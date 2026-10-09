import { useEffect, useReducer, useRef, useState } from 'react';
import type { MouseEvent, ReactNode, Ref } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha, keyframes, styled } from '@mui/material/styles';
import { createSvgIcon } from '@mui/material/utils';
import { palette } from '../theme/palette';
import { fontTitle } from '../theme/theme';
import { assets } from '../assets';
import { GameButton, GameStage } from '../components/GameStage';
import { FRAME_TITLE_SX } from '../theme/dandelionFrame';
import { readStorage, toWordList, writeStorage } from '../storage';
import {
  BLOOM,
  FILLER_PETALS,
  FLOWER_ABOVE,
  FLOWER_BELOW,
  FLOWER_RADIUS,
  PETAL_BANDS,
  PETALS,
  TRIMMED_BELOW,
} from '../data/dandelionGuess';
import answerList from '../data/wordGuessAnswers.txt?raw';
import allowedList from '../data/wordGuessAllowed.txt?raw';

type Mark = 'correct' | 'present' | 'absent';

type Game = { answer: string; guesses: string[] };

type State = {
  seen: string[];
  game: Game;
  typed: string;
  turn: number;
  revealing: number | null;
  shown: boolean;
  finale: boolean;
  dialogClosed: boolean;
  toast: string | null;
  nudges: number;
};

type Action =
  | { type: 'key'; key: string }
  | { type: 'shown' }
  | { type: 'settle' }
  | { type: 'finale' }
  | { type: 'closeDialog' }
  | { type: 'toastDone' }
  | { type: 'newGame'; roll: number };

const WORD_LENGTH = 5;

const MAX_GUESSES = PETALS.length;

const STORAGE_KEY = 'lakenzie.word-guess';

const ANSWERS = answerList.split(/\s+/).filter(Boolean);

const ANSWER_SET = new Set(ANSWERS);

const ALLOWED = new Set([...allowedList.split(/\s+/), ...ANSWERS]);

const REVEAL_STAGGER_MS = 180;

const REVEAL_FADE_MS = 320;

const REVEAL_MS = REVEAL_STAGGER_MS * (WORD_LENGTH - 1) + REVEAL_FADE_MS;

const HOLD_MS = REVEAL_MS + 1600;

const REDUCED_HOLD_MS = 1200;

const SHAKE_MS = 500;

const NUDGE_MS = 350;

const TURN_MS = 900;

const ZOOM_MS = 1600;

const SPIN_MS = 2400;

const TOAST_MS = 1500;

const KEY_HEIGHT = 2.85;

const KEY_GAP = 0.5;

const KEYBOARD_PAD = 0.6;

const KEYBOARD_HEIGHT = 3 * KEY_HEIGHT + 2 * KEY_GAP + 2 * KEYBOARD_PAD;

const WIDE_PCT = 82;

const VIEW_BOX = `${-FLOWER_RADIUS} ${-FLOWER_RADIUS} ${2 * FLOWER_RADIUS} ${2 * FLOWER_RADIUS}`;

const BAND_WIDTH = Math.min(...PETAL_BANDS.map((band) => band.width));

const LETTER_SIZE = BAND_WIDTH * 0.85;

const SLOT_SIZE = BAND_WIDTH * 0.8;

const BAND_GAP = 0.8;

const ZOOM_FILL = 0.96;

const CLIP_ID = 'dandelion-petal';

const MOTION = '@media (prefers-reduced-motion: no-preference)';

const MARK_RANK: Record<Mark, number> = { absent: 0, present: 1, correct: 2 };

const MARK_LABEL: Record<Mark, string> = {
  correct: 'in the right spot',
  present: 'in the word',
  absent: 'not in the word',
};

const MARK_FILL: Record<Mark, string> = {
  correct: palette.gold,
  present: palette.brownSoft,
  absent: palette.absent,
};

const MARK_INK: Record<Mark, string> = {
  correct: palette.brownDeep,
  present: palette.paper,
  absent: palette.paper,
};

const SHOWER = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37 + 5) % 100,
  size: 1.8 + ((i * 7) % 5) * 0.5,
  fall: 4200 + ((i * 53) % 7) * 500,
  delay: ((i * 29) % 14) * 160,
  sway: 1600 + ((i * 17) % 5) * 300,
}));

const BackspaceIcon = createSvgIcon(
  <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12z" />,
  'Backspace',
);

const SvgRect = styled('rect')({});

const SvgText = styled('text')({});

const POP = keyframes({
  '0%': { scale: '0.6' },
  '60%': { scale: '1.15' },
  '100%': { scale: '1' },
});

const FADE_IN = keyframes({ from: { opacity: 0 } });

const SPIN = keyframes({ from: { rotate: '0deg' }, to: { rotate: '720deg' } });

const DRIFT = keyframes({ from: { rotate: '0deg' }, to: { rotate: '360deg' } });

const FALL = keyframes({ from: { translate: '0 -120%' }, to: { translate: '0 115cqh' } });

const SWAY = keyframes({
  from: { translate: '-40% 0', rotate: '-20deg' },
  to: { translate: '40% 0', rotate: '20deg' },
});

const WIGGLE_FRAMES = [0, -5, 4, -3, 2, 0].map((deg) => ({ transform: `rotate(${deg}deg)` }));

const AREA_SX = {
  position: 'relative',
  flex: 1,
  minHeight: 0,
  width: '100%',
  my: '0.75em',
  containerType: 'size',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

const CARD_SX = {
  '--below': { xs: FLOWER_BELOW, sm: TRIMMED_BELOW },
  '--h': `calc(${FLOWER_ABOVE} + var(--below))`,
  '--u': {
    xs: `min(calc(100cqw / ${FLOWER_RADIUS}), calc(100cqh / var(--h)))`,
    md: `calc(${WIDE_PCT}cqw / ${FLOWER_RADIUS})`,
  },
  '--card-h': {
    xs: 'calc(var(--u) * var(--h))',
    md: 'min(100cqh, calc(var(--u) * var(--h)))',
  },
  position: 'relative',
  width: `calc(var(--u) * ${FLOWER_RADIUS})`,
  height: 'var(--card-h)',
  overflow: 'hidden',
  borderRadius: '1.1em',
  bgcolor: palette.olive,
  boxShadow: `0 0.4em 1em ${alpha(palette.navy, 0.3)}`,
} as const;

const FLOWER_SX = {
  position: 'absolute',
  left: 0,
  top: `calc(var(--card-h) - var(--u) * (var(--below) + ${FLOWER_RADIUS}))`,
  width: `calc(var(--u) * ${2 * FLOWER_RADIUS})`,
  height: `calc(var(--u) * ${2 * FLOWER_RADIUS})`,
  [MOTION]: { transition: `rotate ${TURN_MS}ms ease-in-out` },
} as const;

const ZOOMED_SX = {
  left: `calc(var(--u) * ${-FLOWER_RADIUS / 2})`,
  top: `calc(var(--card-h) / 2 - var(--u) * ${FLOWER_RADIUS})`,
  scale: `tan(atan2(min(var(--card-h), var(--u) * ${FLOWER_RADIUS}) * ${ZOOM_FILL}, var(--u) * ${2 * FLOWER_RADIUS}))`,
  [MOTION]: {
    transition: `left ${ZOOM_MS}ms ease-in-out, top ${ZOOM_MS}ms ease-in-out, scale ${ZOOM_MS}ms ease-in-out`,
  },
} as const;

const FILL_SX = { width: '100%', height: '100%' } as const;

const SPIN_SX = {
  [MOTION]: {
    animation: `${SPIN} ${SPIN_MS}ms ease-in-out, ${DRIFT} 24s linear ${SPIN_MS}ms infinite`,
  },
};

const SVG_SX = { display: 'block', width: '100%', height: '100%', overflow: 'visible' } as const;

const POP_SX = {
  transformBox: 'fill-box',
  transformOrigin: 'center',
  [MOTION]: { animation: `${POP} 140ms ease-out` },
};

const REVEAL_BAND_SX = Array.from({ length: WORD_LENGTH }, (_, b) => ({
  [MOTION]: {
    animation: `${FADE_IN} ${REVEAL_FADE_MS}ms ease-out ${b * REVEAL_STAGGER_MS}ms backwards`,
  },
}));

const REVEAL_INK_SX = Array.from({ length: WORD_LENGTH }, (_, b) => ({
  [MOTION]: { transition: `fill 160ms ease ${b * REVEAL_STAGGER_MS + 120}ms` },
}));

const TOAST_LAYER_SX = {
  position: 'absolute',
  top: '3%',
  left: 0,
  right: 0,
  zIndex: 1,
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none',
} as const;

const TOAST_SX = {
  px: '1em',
  py: '0.55em',
  borderRadius: '0.6em',
  bgcolor: palette.brownDeep,
  color: palette.paper,
  fontWeight: 700,
  boxShadow: `0 0.3em 1em ${alpha(palette.navy, 0.25)}`,
} as const;

const VISUALLY_HIDDEN = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;

const KEYBOARD_SX = {
  ...FRAME_TITLE_SX,
  flexShrink: 0,
  width: { xs: '100%', md: `${WIDE_PCT}%` },
  maxWidth: { xs: '26em', md: 'none' },
  height: `${KEYBOARD_HEIGHT}em`,
  px: `${KEYBOARD_PAD}em`,
  py: `${KEYBOARD_PAD}em`,
  display: 'flex',
  flexDirection: 'column',
  gap: `${KEY_GAP}em`,
  userSelect: 'none',
} as const;

const KEY_ROW_SX = {
  flex: 1,
  display: 'flex',
  gap: '0.375em',
} as const;

const KEY_SX = {
  flex: 1,
  minWidth: 0,
  p: 0,
  border: 0,
  borderRadius: '0.45em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'inherit',
  fontSize: '1.15em',
  fontWeight: 'inherit',
  textTransform: 'uppercase',
  color: 'inherit',
  bgcolor: 'transparent',
  cursor: 'pointer',
  touchAction: 'manipulation',
  WebkitTapHighlightColor: 'transparent',
  transition: 'background-color 200ms ease, color 200ms ease, scale 100ms ease',
  '&:active': { scale: '0.94' },
  '&:focus-visible': { outline: `2px solid ${palette.teal}`, outlineOffset: '0.1em' },
} as const;

const KEY_WIDE_SX = { flex: 1.5, fontSize: '0.8em' } as const;

const KEY_PRESSED = { bgcolor: palette.brownDeep } as const;

const KEY_PRESS_SX = {
  '@media (hover: hover)': { '&:hover': KEY_PRESSED },
  '&:active': KEY_PRESSED,
} as const;

const KEY_SPACER_SX = { flex: 0.5 } as const;

const KEY_MARK_SX = {
  correct: { bgcolor: palette.gold, color: palette.brownDeep },
  present: { bgcolor: palette.brownSoft, color: palette.paper },
  absent: { bgcolor: palette.absent, color: palette.paper },
} as const;

const RESULT_SX = {
  flexShrink: 0,
  width: '100%',
  maxWidth: '26em',
  minHeight: `${KEYBOARD_HEIGHT}em`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

const DIALOG_PAPER_SX = {
  m: '1em',
  maxWidth: 'calc(100% - 2em)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  bgcolor: 'transparent',
  boxShadow: 'none',
  overflow: 'visible',
} as const;

const DIALOG_BACKDROP_SX = { bgcolor: alpha(palette.brownDeep, 0.86) } as const;

const DIALOG_TITLE_SX = {
  fontFamily: fontTitle,
  fontSize: '2.5em',
  lineHeight: 1.05,
  color: palette.gold,
  WebkitTextStroke: `0.1em ${palette.brown}`,
  paintOrder: 'stroke fill',
} as const;

const DIALOG_TEXT_SX = {
  mt: '0.4em',
  mb: '1.35em',
  fontSize: '1.15em',
  fontWeight: 600,
  lineHeight: 1.4,
  color: palette.paper,
} as const;

const SHOWER_SX = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 1400,
} as const;

function score(guess: string, answer: string) {
  const marks = Array.from(guess, (): Mark => 'absent');
  const spare = new Map<string, number>();
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) marks[i] = 'correct';
    else spare.set(answer[i], (spare.get(answer[i]) ?? 0) + 1);
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    const left = spare.get(guess[i]) ?? 0;
    if (marks[i] === 'absent' && left > 0) {
      marks[i] = 'present';
      spare.set(guess[i], left - 1);
    }
  }
  return marks;
}

function markKeys(guesses: string[], answer: string) {
  const marks: Partial<Record<string, Mark>> = {};
  for (const guess of guesses) {
    score(guess, answer).forEach((mark, i) => {
      const current = marks[guess[i]];
      if (current === undefined || MARK_RANK[mark] > MARK_RANK[current]) marks[guess[i]] = mark;
    });
  }
  return marks;
}

const describe = (guess: string, marks: Mark[]) =>
  marks.map((mark, i) => `${guess[i].toUpperCase()} ${MARK_LABEL[mark]}`).join(', ');

function startGame(seen: string[], roll: number) {
  const seenSet = new Set(seen);
  const unseen = ANSWERS.filter((word) => !seenSet.has(word));
  const pool = unseen.length > 0 ? unseen : ANSWERS;
  const answer = pool[Math.floor(roll * pool.length)];
  return {
    seen: unseen.length > 0 ? [...seen, answer] : [answer],
    game: { answer, guesses: [] },
  };
}

function resumable(value: unknown): value is Game {
  if (typeof value !== 'object' || value === null) return false;
  const { answer, guesses } = value as Record<string, unknown>;
  return (
    typeof answer === 'string' &&
    ANSWER_SET.has(answer) &&
    Array.isArray(guesses) &&
    guesses.length < MAX_GUESSES &&
    guesses.every(
      (guess) => typeof guess === 'string' && guess.length === WORD_LENGTH && guess !== answer,
    )
  );
}

const isOver = ({ answer, guesses }: Game) =>
  guesses.includes(answer) || guesses.length >= MAX_GUESSES;

function init(): State {
  const saved = readStorage(STORAGE_KEY);
  const seen = toWordList(saved.seen);
  const game = saved.game;
  const start = resumable(game) ? { seen, game } : startGame(seen, Math.random());
  return {
    ...start,
    typed: '',
    turn: start.game.guesses.length,
    revealing: null,
    shown: false,
    finale: false,
    dialogClosed: false,
    toast: null,
    nudges: 0,
  };
}

const complain = (state: State, toast: string): State => ({
  ...state,
  toast,
  nudges: state.nudges + 1,
});

function pressKey(state: State, key: string): State {
  const { game, typed } = state;
  if (state.revealing !== null || isOver(game)) return state;
  if (key === 'enter') {
    if (typed.length < WORD_LENGTH) return complain(state, 'Not enough letters');
    if (!ALLOWED.has(typed)) return complain(state, 'Not in word list');
    return {
      ...state,
      game: { ...game, guesses: [...game.guesses, typed] },
      typed: '',
      revealing: game.guesses.length,
    };
  }
  if (key === 'backspace') return { ...state, typed: typed.slice(0, -1) };
  return typed.length < WORD_LENGTH ? { ...state, typed: typed + key } : state;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'key':
      return pressKey(state, action.key);
    case 'shown':
      return { ...state, shown: true };
    case 'settle':
      return {
        ...state,
        revealing: null,
        shown: false,
        turn: isOver(state.game) ? state.turn : state.game.guesses.length,
      };
    case 'finale':
      return { ...state, finale: true };
    case 'closeDialog':
      return { ...state, dialogClosed: true };
    case 'toastDone':
      return { ...state, toast: null };
    case 'newGame':
      return {
        ...state,
        ...startGame(state.seen, action.roll),
        typed: '',
        turn: 0,
        revealing: null,
        shown: false,
        finale: false,
        dialogClosed: false,
        toast: null,
      };
  }
}

function toGameKey(key: string) {
  if (key === 'Enter') return 'enter';
  if (key === 'Backspace') return 'backspace';
  return /^[a-z]$/i.test(key) ? key.toLowerCase() : null;
}

function Petal({
  index,
  letters,
  marks,
  revealing,
  typing,
  petalRef,
}: {
  index: number;
  letters: string;
  marks: Mark[] | null;
  revealing: boolean;
  typing: boolean;
  petalRef?: Ref<SVGGElement>;
}) {
  const { d, x, y, turn } = PETALS[index];
  const pose = `translate(${x} ${y}) rotate(${-turn})`;
  return (
    <g ref={petalRef}>
      <path d={d} fill={palette.gold} />

      {marks && (
        <g clipPath={`url(#${CLIP_ID}-${index})`}>
          <g transform={pose}>
            {PETAL_BANDS.map((band, b) => (
              <SvgRect
                key={b}
                x={band.x + BAND_GAP / 2}
                y={-FLOWER_RADIUS}
                width={band.width - BAND_GAP}
                height={2 * FLOWER_RADIUS}
                fill={MARK_FILL[marks[b]]}
                sx={revealing ? REVEAL_BAND_SX[b] : undefined}
              />
            ))}
          </g>
        </g>
      )}

      <g
        transform={pose}
        fontFamily={fontTitle}
        fontSize={LETTER_SIZE}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {PETAL_BANDS.map((band, b) => {
          const cx = band.x + band.width / 2;
          const letter = letters[b] ?? '';
          return (
            <g key={b}>
              {!marks && (
                <rect
                  x={cx - SLOT_SIZE / 2}
                  y={band.cy - SLOT_SIZE / 2}
                  width={SLOT_SIZE}
                  height={SLOT_SIZE}
                  rx={SLOT_SIZE * 0.22}
                  fill={palette.paper}
                  fillOpacity={0.45}
                  stroke={palette.brown}
                  strokeOpacity={0.35}
                  strokeWidth={0.9}
                />
              )}
              {letter !== '' && (
                <SvgText
                  x={cx}
                  y={band.cy}
                  sx={[
                    { fill: marks ? MARK_INK[marks[b]] : palette.brownDeep },
                    typing && POP_SX,
                    revealing && REVEAL_INK_SX[b],
                  ]}
                >
                  {letter.toUpperCase()}
                </SvgText>
              )}
            </g>
          );
        })}
      </g>
    </g>
  );
}

function Flower({
  guesses,
  answer,
  typed,
  turn,
  revealing,
  zoomed,
  petalRef,
}: {
  guesses: string[];
  answer: string;
  typed: string;
  turn: number;
  revealing: number | null;
  zoomed: boolean;
  petalRef: Ref<SVGGElement>;
}) {
  return (
    <Box sx={[FLOWER_SX, { rotate: `${PETALS[turn].turn}deg` }, zoomed && ZOOMED_SX]}>
      <Box sx={[FILL_SX, zoomed && SPIN_SX]}>
        <Box component="svg" viewBox={VIEW_BOX} aria-hidden sx={SVG_SX}>
          <defs>
            {PETALS.map((petal, i) => (
              <clipPath key={i} id={`${CLIP_ID}-${i}`}>
                <path d={petal.d} />
              </clipPath>
            ))}
          </defs>

          {FILLER_PETALS.map((d, i) => (
            <path key={i} d={d} fill={palette.gold} />
          ))}

          {PETALS.map((_, i) => {
            const submitted = i < guesses.length;
            return (
              <Petal
                key={i}
                index={i}
                letters={submitted ? guesses[i] : i === guesses.length ? typed : ''}
                marks={submitted ? score(guesses[i], answer) : null}
                revealing={i === revealing}
                typing={i === guesses.length}
                petalRef={i === turn ? petalRef : undefined}
              />
            );
          })}

          <image
            href={assets.dandelionBloom}
            x={BLOOM.x}
            y={BLOOM.y}
            width={BLOOM.size}
            height={BLOOM.size}
          />
        </Box>
      </Box>
    </Box>
  );
}

function DandelionShower() {
  return (
    <Box aria-hidden sx={SHOWER_SX}>
      {SHOWER.map((flake, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: 0,
            left: `${flake.left}%`,
            width: `${flake.size}em`,
            animation: `${FALL} ${flake.fall}ms linear ${flake.delay}ms both`,
          }}
        >
          <Box
            component="img"
            src={assets.dandelionBloom}
            alt=""
            sx={{
              display: 'block',
              width: '100%',
              animation: `${SWAY} ${flake.sway}ms ease-in-out infinite alternate`,
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

function Key({
  value,
  label,
  mark,
  wide = false,
  onPress,
  children,
}: {
  value: string;
  label?: string;
  mark?: Mark;
  wide?: boolean;
  onPress: (key: string) => void;
  children: ReactNode;
}) {
  return (
    <Box
      component="button"
      type="button"
      aria-label={label}
      onClick={(event: MouseEvent<HTMLElement>) => {
        if (event.detail > 0) event.currentTarget.blur();
        onPress(value);
      }}
      sx={[KEY_SX, wide && KEY_WIDE_SX, mark === undefined ? KEY_PRESS_SX : KEY_MARK_SX[mark]]}
    >
      {children}
    </Box>
  );
}

function Keyboard({
  marks,
  onPress,
}: {
  marks: Partial<Record<string, Mark>>;
  onPress: (key: string) => void;
}) {
  const letterKey = (letter: string) => {
    const mark = marks[letter];
    return (
      <Key
        key={letter}
        value={letter}
        mark={mark}
        label={mark && `${letter.toUpperCase()}, ${MARK_LABEL[mark]}`}
        onPress={onPress}
      >
        {letter}
      </Key>
    );
  };

  return (
    <Box role="group" aria-label="Keyboard" sx={KEYBOARD_SX}>
      <Box sx={KEY_ROW_SX}>{[...'qwertyuiop'].map(letterKey)}</Box>
      <Box sx={KEY_ROW_SX}>
        <Box sx={KEY_SPACER_SX} />
        {[...'asdfghjkl'].map(letterKey)}
        <Box sx={KEY_SPACER_SX} />
      </Box>
      <Box sx={KEY_ROW_SX}>
        <Key value="enter" wide onPress={onPress}>
          Enter
        </Key>
        {[...'zxcvbnm'].map(letterKey)}
        <Key value="backspace" label="Delete letter" wide onPress={onPress}>
          <BackspaceIcon sx={{ fontSize: '1.6em' }} />
        </Key>
      </Box>
    </Box>
  );
}

export function WordGuessPage() {
  const [state, dispatch] = useReducer(reducer, null, init);
  const { seen, game, typed, turn, revealing, shown, finale, dialogClosed, toast, nudges } = state;
  const { answer, guesses } = game;
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const petalRef = useRef<SVGGElement>(null);

  const won = guesses.at(-1) === answer;
  const over = isOver(game);
  const settled = revealing === null;
  const zoomed = won && settled;
  const dialogOpen = over && settled && (!won || finale) && !dialogClosed;
  const keyMarks = markKeys(
    revealing === null || shown ? guesses : guesses.slice(0, revealing),
    answer,
  );
  const result = won
    ? {
        title: 'Congratulations!',
        message: `You guessed the word in only ${guesses.length} ${guesses.length === 1 ? 'guess' : 'guesses'}.`,
      }
    : { title: 'So close!', message: `The word was ${answer.toUpperCase()}.` };
  const [dialogResult, setDialogResult] = useState(result);
  if (
    dialogOpen &&
    (dialogResult.title !== result.title || dialogResult.message !== result.message)
  ) {
    setDialogResult(result);
  }
  const announcement =
    toast ??
    (revealing !== null && shown
      ? `${guesses[revealing].toUpperCase()}: ${describe(guesses[revealing], score(guesses[revealing], answer))}`
      : over && settled
        ? `${result.title} ${result.message}`
        : '');

  useEffect(() => {
    writeStorage(STORAGE_KEY, { seen, game });
  }, [seen, game]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
      const key = toGameKey(event.key);
      if (key === null) return;
      if (key === 'enter') {
        if (event.repeat) return;
        if (event.target instanceof Element && event.target.closest('a, button')) return;
      }
      event.preventDefault();
      dispatch({ type: 'key', key });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (revealing === null) return;
    const ending = guesses.length >= MAX_GUESSES || guesses[revealing] === answer;
    const hold = reducedMotion ? REDUCED_HOLD_MS : HOLD_MS;
    const shake = ending || reducedMotion ? 0 : SHAKE_MS;
    const timers = [
      window.setTimeout(() => dispatch({ type: 'shown' }), reducedMotion ? 0 : REVEAL_MS),
      window.setTimeout(() => dispatch({ type: 'settle' }), hold + shake),
    ];
    if (shake > 0) {
      timers.push(
        window.setTimeout(
          () => petalRef.current?.animate(WIGGLE_FRAMES, { duration: SHAKE_MS, easing: 'ease-in-out' }),
          hold,
        ),
      );
    }
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [revealing, guesses, answer, reducedMotion]);

  useEffect(() => {
    if (!zoomed || finale) return;
    const timer = window.setTimeout(
      () => dispatch({ type: 'finale' }),
      reducedMotion ? 0 : ZOOM_MS,
    );
    return () => window.clearTimeout(timer);
  }, [zoomed, finale, reducedMotion]);

  useEffect(() => {
    if (toast === null) return;
    const timer = window.setTimeout(() => dispatch({ type: 'toastDone' }), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast, nudges]);

  useEffect(() => {
    if (nudges === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    petalRef.current?.animate(WIGGLE_FRAMES, { duration: NUDGE_MS, easing: 'ease-in-out' });
  }, [nudges]);

  const press = (key: string) => dispatch({ type: 'key', key });

  const newGame = () => dispatch({ type: 'newGame', roll: Math.random() });

  return (
    <GameStage title="Dandelion Guess">
      <Box sx={AREA_SX}>
        <Box sx={CARD_SX}>
          <Flower
            key={answer}
            guesses={guesses}
            answer={answer}
            typed={typed}
            turn={turn}
            revealing={revealing}
            zoomed={zoomed}
            petalRef={petalRef}
          />
        </Box>

        <Box aria-hidden sx={TOAST_LAYER_SX}>
          {toast !== null && (
            <Box component="span" sx={TOAST_SX}>
              {toast}
            </Box>
          )}
        </Box>

        <Box role="status" sx={VISUALLY_HIDDEN}>
          {announcement}
        </Box>
      </Box>

      {over && settled ? (
        <Box sx={RESULT_SX}>
          {dialogClosed && <GameButton onClick={newGame}>New word</GameButton>}
        </Box>
      ) : (
        <Keyboard marks={keyMarks} onPress={press} />
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => dispatch({ type: 'closeDialog' })}
        disablePortal
        aria-labelledby="word-guess-result-title"
        aria-describedby="word-guess-result-message"
        slotProps={{ paper: { sx: DIALOG_PAPER_SX }, backdrop: { sx: DIALOG_BACKDROP_SX } }}
      >
        <Typography id="word-guess-result-title" sx={DIALOG_TITLE_SX}>
          {dialogResult.title}
        </Typography>
        <Typography id="word-guess-result-message" sx={DIALOG_TEXT_SX}>
          {dialogResult.message}
        </Typography>
        <GameButton autoFocus onClick={newGame}>
          New word
        </GameButton>
      </Dialog>

      {won && finale && !reducedMotion && <DandelionShower />}
    </GameStage>
  );
}
