# Wordle

A Wordle clone built with Next.js that plays against the public
[Votee Wordle API](https://wordle.votee.dev:8000/redoc). You get six tries to
guess a hidden word; every guess is scored letter by letter by the API and
revealed on the board.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to
`/wordle`, where the game lives.

## How to Play

Type a guess of the configured length and press **Enter** or **Submit**. Each
tile is colored with the result the API returns:

| Color  | Result    | Meaning                                       |
| ------ | --------- | --------------------------------------------- |
| Green  | `correct` | Right letter in the right slot                |
| Yellow | `present` | Right letter in the wrong slot                |
| Grey   | `absent`  | Letter is not in the word                     |

You have six attempts. Changing the mode, the seed, or the custom word starts a
fresh board, as does the **New game** button.

### Modes

- **Daily** — everyone guesses the same word for the current day (`GET /daily`).
- **Random** — a random word chosen from a numeric seed (`GET /random`), so the
  same seed always yields the same word.
- **Custom** — you supply the word to be guessed (`GET /word/{word}`), useful for
  testing or for handing a puzzle to someone else.

Word length is configurable from 3 to 10 letters and defaults to 5. The board
tiles shrink to keep even a ten-letter game on screen without scrolling.

## Scripts

| Command      | Description                          |
| ------------ | ------------------------------------ |
| `pnpm dev`   | Start the development server         |
| `pnpm build` | Create a production build            |
| `pnpm start` | Serve the production build           |
| `pnpm lint`  | Run ESLint                           |
| `pnpm test`  | Run the Vitest unit tests            |

## Project Structure

```
app/
  layout.tsx              Root layout, Ant Design registry and theme provider
  theme.ts                Dark purple palette and Ant Design theme tokens
  globals.css             Tailwind entry point, tile animations, CSS variables
  page.tsx                Redirects / to /wordle
  wordle/
    page.tsx              Game screen: mode, board and guess state
    api.ts                Typed wrappers around the daily/random/custom endpoints
    gameRules.ts          Word length limits, attempt limit, win/lose resolution
    errorMessage.ts       Normalizes API errors into a displayable string
    types.ts              Shared game types
    components/
      WordleGrid.tsx      The six-by-N tile board
lib/
  api.ts                  Shared axios instance pointing at the Wordle API
```

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) and React 19
- [Ant Design 6](https://ant.design) for the form and feedback components
- [Tailwind CSS 4](https://tailwindcss.com) for layout and the board styling
- [axios](https://axios-http.com) for API calls
- [Vitest](https://vitest.dev) for unit tests
- TypeScript throughout

## Testing

Game logic is kept out of the React components so it can be tested directly.
`gameRules.test.ts` covers word length validation and win/lose resolution, and
`errorMessage.test.ts` covers turning the API's two error shapes — a plain string
for its own 4xx checks and a FastAPI validation object for 422 — into a single
message.

```bash
pnpm test
```

## Configuration

The API base URL is set in `lib/api.ts` and currently points at
`https://wordle.votee.dev:8000`. Change it there to run against a different
backend.
