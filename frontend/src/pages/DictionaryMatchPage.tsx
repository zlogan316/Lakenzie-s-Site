import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { createSvgIcon } from '@mui/material/utils';
import { palette } from '../theme/palette';
import { FRAME_TITLE_SX } from '../theme/dandelionFrame';
import { GameButton, GameStage } from '../components/GameStage';
import { readStorage, toWordList, writeStorage } from '../storage';
import { DICTIONARY } from '../data/dictionaryMatch';

type Question = { word: string; definition: string; options: string[] };

type Round = {
  seen: string[];
  questions: Question[];
  index: number;
  picked: string | null;
  results: boolean[];
};

const ROUND_SIZE = 10;

const STORAGE_KEY = 'lakenzie.dictionary-match';

const CHEERS = ['Correct!', 'Nailed it!', 'Spot on!', 'Yes!', 'Brilliant!'];

const CheckIcon = createSvgIcon(
  <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7.59 19.59 6.17z" />,
  'Check',
);

const CloseIcon = createSvgIcon(
  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />,
  'Close',
);

const PLAY_SX = {
  flex: 1,
  width: '100%',
  maxWidth: '30em',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '1.2em',
  py: '1em',
} as const;

const DOTS_SX = {
  display: 'flex',
  justifyContent: 'center',
  gap: '0.5em',
} as const;

const DOT_SX = {
  width: '0.75em',
  height: '0.75em',
  boxSizing: 'border-box',
  borderRadius: '50%',
  border: `0.15em solid ${alpha(palette.cream, 0.6)}`,
  transition: 'background-color 200ms ease, border-color 200ms ease, scale 200ms ease',
} as const;

const DOT_RIGHT_SX = { bgcolor: palette.gold, borderColor: palette.gold } as const;

const DOT_WRONG_SX = { bgcolor: palette.coral, borderColor: palette.coral } as const;

const DOT_CURRENT_SX = { borderColor: palette.paper, scale: '1.3' } as const;

const CARD_SX = {
  px: '1.4em',
  py: '1.2em',
  borderRadius: '1em',
  bgcolor: palette.paper,
  border: `0.12em solid ${alpha(palette.brown, 0.12)}`,
  boxShadow: `0 0.4em 1.4em ${alpha(palette.brown, 0.1)}`,
  textAlign: 'center',
} as const;

const LABEL_SX = {
  mb: '0.5em',
  fontSize: '0.8em',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: palette.brownSoft,
} as const;

const DEFINITION_SX = {
  fontSize: '1.45em',
  fontWeight: 500,
  lineHeight: 1.35,
} as const;

const OPTIONS_SX = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.7em',
} as const;

const OPTION_SX = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.35em',
  width: '100%',
  px: '1em',
  py: '0.6em',
  border: `0.12em solid ${alpha(palette.brown, 0.2)}`,
  borderRadius: '0.8em',
  bgcolor: palette.paper,
  color: palette.brown,
  fontFamily: 'inherit',
  fontSize: '1.3em',
  fontWeight: 700,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  transition:
    'background-color 200ms ease, border-color 200ms ease, color 200ms ease, opacity 200ms ease, scale 200ms ease',
  '&:disabled': { cursor: 'default' },
  '&:not(:disabled):active': { scale: '0.98' },
  '@media (hover: hover)': {
    '&:not(:disabled):hover': { bgcolor: alpha(palette.goldSoft, 0.45), borderColor: palette.gold },
  },
  '&:focus-visible': { outline: `2px solid ${palette.teal}`, outlineOffset: '0.15em' },
} as const;

const OPTION_STATE_SX = {
  right: { bgcolor: palette.gold, borderColor: palette.gold, color: palette.brownDeep },
  wrong: { bgcolor: palette.coral, borderColor: palette.coral, color: palette.paper },
  faded: { opacity: 0.45 },
} as const;

const SUMMARY_SX = {
  display: 'flex',
  justifyContent: 'center',
  py: '1.5em',
} as const;

const SUMMARY_TITLE_SX = {
  ...FRAME_TITLE_SX,
  fontSize: '2.6em',
  lineHeight: 1.1,
  textAlign: 'center',
} as const;

const FEEDBACK_SX = {
  minHeight: '5.25em',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.7em',
  textAlign: 'center',
} as const;

const FEEDBACK_TEXT_SX = {
  fontSize: '1.1em',
  fontWeight: 700,
  color: palette.cream,
} as const;

function shuffle<T>(items: readonly T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startRound(seen: string[]): Round {
  const seenSet = new Set(seen);
  const unseen = DICTIONARY.filter((entry) => !seenSet.has(entry.word));
  const fresh = unseen.length >= ROUND_SIZE;
  return {
    seen: fresh ? seen : [],
    questions: shuffle(fresh ? unseen : DICTIONARY)
      .slice(0, ROUND_SIZE)
      .map(({ word, definition, decoys }) => ({
        word,
        definition,
        options: shuffle([word, ...decoys]),
      })),
    index: 0,
    picked: null,
    results: [],
  };
}

function verdict(correct: number, total: number) {
  if (correct === total) return 'Flawless!';
  if (correct >= total * 0.8) return 'Brilliant!';
  if (correct >= total / 2) return 'Nicely done!';
  return 'Good try!';
}

export function DictionaryMatchPage() {
  const [round, setRound] = useState(() =>
    startRound(toWordList(readStorage(STORAGE_KEY).seen)),
  );
  const { seen, questions, index, picked, results } = round;
  const finished = index >= questions.length;
  const question = finished ? null : questions[index];
  const correct = results.filter(Boolean).length;

  useEffect(() => {
    writeStorage(STORAGE_KEY, { seen });
  }, [seen]);

  const pick = (option: string) =>
    setRound((current) => {
      if (current.picked !== null) return current;
      const { word } = current.questions[current.index];
      return {
        ...current,
        picked: option,
        results: [...current.results, option === word],
        seen: current.seen.includes(word) ? current.seen : [...current.seen, word],
      };
    });

  const next = () =>
    setRound((current) => ({ ...current, index: current.index + 1, picked: null }));

  const feedback = finished
    ? `You matched ${correct} of ${questions.length} words.`
    : picked === null || question === null
      ? ''
      : picked === question.word
        ? CHEERS[index % CHEERS.length]
        : `Not quite — it’s “${question.word}.”`;

  return (
    <GameStage title="Dictionary Match">
      <Box sx={PLAY_SX}>
        <Box
          role="img"
          aria-label={
            finished
              ? `Round complete: ${correct} of ${questions.length} correct`
              : `Question ${index + 1} of ${questions.length}, ${correct} correct so far`
          }
          sx={DOTS_SX}
        >
          {questions.map((_, i) => (
            <Box
              key={i}
              sx={[
                DOT_SX,
                i < results.length && (results[i] ? DOT_RIGHT_SX : DOT_WRONG_SX),
                i === index && DOT_CURRENT_SX,
              ]}
            />
          ))}
        </Box>

        {question ? (
          <>
            <Box sx={CARD_SX}>
              <Typography sx={LABEL_SX}>Definition</Typography>
              <Typography sx={DEFINITION_SX}>{question.definition}</Typography>
            </Box>

            <Box key={index} role="group" aria-label="Which word matches?" sx={OPTIONS_SX}>
              {question.options.map((option, i) => {
                const state =
                  picked === null
                    ? null
                    : option === question.word
                      ? 'right'
                      : option === picked
                        ? 'wrong'
                        : 'faded';
                return (
                  <Box
                    key={option}
                    component="button"
                    type="button"
                    autoFocus={index > 0 && i === 0}
                    disabled={picked !== null}
                    onClick={() => pick(option)}
                    sx={[OPTION_SX, state !== null && OPTION_STATE_SX[state]]}
                  >
                    {option}
                    {state === 'right' && <CheckIcon fontSize="inherit" />}
                    {state === 'wrong' && <CloseIcon fontSize="inherit" />}
                  </Box>
                );
              })}
            </Box>
          </>
        ) : (
          <Box sx={SUMMARY_SX}>
            <Typography sx={SUMMARY_TITLE_SX}>{verdict(correct, questions.length)}</Typography>
          </Box>
        )}

        <Box sx={FEEDBACK_SX}>
          <Typography role="status" sx={FEEDBACK_TEXT_SX}>
            {feedback}
          </Typography>
          {finished ? (
            <GameButton autoFocus onClick={() => setRound(startRound(seen))}>
              Play again
            </GameButton>
          ) : (
            picked !== null && (
              <GameButton autoFocus onClick={next}>
                {index + 1 < questions.length ? 'Next word' : 'See results'}
              </GameButton>
            )
          )}
        </Box>
      </Box>
    </GameStage>
  );
}
