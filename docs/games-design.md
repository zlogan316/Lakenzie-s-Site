# Games Design (deferred — not yet implemented)

Design notes for the games feature (Wordle, Connections, and future game
types). This is the agreed plan to build against later; nothing here exists in
code yet.

## Goals

- LaKenzie should **never see the same puzzle twice** — enforced by the
  database, not by client-side luck.
- Server-authoritative: the browser never receives the answer, only verdicts.
- One generic schema that supports many game types without new tables.

## Schema

Three tables. `players` already exists in the broader site design; the two new
ones are generic across game types.

### `puzzles` — one row per puzzle, any game type

| column         | type             | notes                                            |
|----------------|------------------|--------------------------------------------------|
| `id`           | int PK           |                                                  |
| `game_type`    | nvarchar         | `'wordle'`, `'connections'`, ...                 |
| `payload`      | nvarchar (JSON)  | game-specific content (answer word, groups, ...) |
| `content_hash` | nvarchar         | hash of canonicalized payload                    |

**Constraint:** `UNIQUE (game_type, content_hash)` — re-importing a word list
or puzzle file can never create duplicate puzzles.

### `attempts` — one row per puzzle a player has been served

| column          | type            | notes                                          |
|-----------------|-----------------|------------------------------------------------|
| `id`            | int PK          |                                                |
| `puzzle_id`     | int FK, **UNIQUE** | see below — this is the core invariant      |
| `player_id`     | int FK          |                                                |
| `status`        | nvarchar        | `'in_progress'`, `'won'`, `'failed'`           |
| `guesses`       | nvarchar (JSON) | full guess history (server-recorded)           |
| `started_at`    | datetime2       |                                                |
| `completed_at`  | datetime2 null  |                                                |

**The never-see-twice invariant:** `UNIQUE (puzzle_id)` on `attempts` means a
puzzle can be attempted at most once, ever. The database makes repeats
impossible regardless of application bugs, races, or refresh shenanigans.
(Single-player site today; if it ever becomes multi-player, the constraint
widens to `UNIQUE (puzzle_id, player_id)`.)

## Serving logic: random-unseen, pinned at serve time

When the player starts a game of type `G`:

1. **Pick a random unseen puzzle:**
   `SELECT TOP 1 ... FROM puzzles p WHERE p.game_type = @G AND NOT EXISTS
   (SELECT 1 FROM attempts a WHERE a.puzzle_id = p.id) ORDER BY NEWID();`
2. **Pin it immediately:** insert an `attempts` row with
   `status = 'in_progress'` in the same transaction, *before* returning the
   puzzle to the client. The unique constraint makes the pin atomic.
3. **Refresh resumes:** if an `in_progress` attempt for this game type already
   exists, `GET .../current` returns that puzzle (with guess history) instead
   of dealing a new one. Refreshing the page is never a re-roll.
4. **Failed counts as seen:** a `failed` attempt keeps its row, so the puzzle
   never comes back. No retries on the same puzzle.
5. **Exhausted pool:** when no unseen puzzles remain, the API returns a
   distinct "pool empty" response and the frontend shows a cute message
   ("You've beaten every puzzle I made for you... more coming soon 💛")
   instead of an error.

## API sketch (server-authoritative)

All verdict computation happens server-side; the payload (answer) is never
sent to the client.

| method & path                          | purpose                                                            |
|----------------------------------------|--------------------------------------------------------------------|
| `GET  /api/stats`                      | win/loss/played counts per game type, for the stats screen         |
| `GET  /api/games/{game}/current`       | the `in_progress` attempt for `{game}` (puzzle id, guess history, state) or 404/none |
| `POST /api/games/{game}/start`         | deal + pin a random unseen puzzle (no-op if one is `in_progress`); may return "pool empty" |
| `POST /api/games/wordle/guess`         | body: the guessed word → server validates, appends to history, returns per-letter verdicts + status |
| `POST /api/games/connections/guess`    | body: four selected words → server returns correct / "one away" / wrong, mistakes remaining, status |

Guess endpoints update `attempts.guesses` and flip `status` to `won`/`failed`
when the game ends; the client only ever renders what the server reports.

## OPEN QUESTION: word-list sourcing for Wordle

The Connections decision is made: **puzzles are hand-written JSON regardless**
(they're personal — inside jokes, shared memories — that's the point of the
gift). The open question is Wordle's word lists, which need two things: an
*answer list* (puzzles to deal) and a *validation dictionary* (which guesses
are legal words). Options:

1. **Hybrid (leaning this way):** hand-curate the answer list (personal,
   meaningful words — keeps the gift feel) but vendor a standard ~12k-word
   guess dictionary one time for validation, so typing a real word is never
   rejected.
2. **Vendor both one-time:** import a public answer list + guess dictionary
   (e.g. the well-known open Wordle lists) into `puzzles` once via a seed
   script. Most content for least effort, least personal.
3. **Fully hand-made, no validation dictionary:** hand-curated answers and
   *any* 5-letter string is an accepted guess. Zero vendored data, simplest
   code, but typos cost a guess.

Decision deferred until the games phase starts.
