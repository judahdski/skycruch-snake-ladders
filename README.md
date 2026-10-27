# Snakes & Ladders

## Overview

A single-player Snakes & Ladders game built with React and Vite. The 10 x 10 board follows a serpentine order, from square 1 at the bottom left to square 100 at the top left. The player's position is highlighted, with predefined snake/ladder transitions, a winner badge, and a reset control.

## Getting Started

Prerequisites: **Node.js 24.x** and **npm**. Local verification used Node.js 24.11.0 and npm 11.6.4.

From the project directory, install the locked dependencies and start the development server:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

To build and preview the production version:

```sh
npm run build
npm run preview
```

The build output is written to `dist/`. The preview URL is usually `http://localhost:4173`.

Run ESLint with `npm run lint`. There is currently no automated test script; lint reports existing unused variables in `App.jsx`.

## How to Play

1. Start at square **1**. Enter a whole number from **1 to 6** and click **Move!**.
2. The player advances by that number of squares. Landing on a ladder's source moves the player forward to its destination; landing on a snake's source moves the player backward to its destination. For example, landing on **8** moves the player to **31**.
3. Reach square **100** to win. The winner badge appears and **Reset Game** replaces the movement controls.
4. Click **Reset Game** to return to square 1. The movement input returns to 1 and the position text is cleared. The win counter is preserved across resets; reloading the page clears it.

The Rules List remains visible below the active controls.

## Implementation Notes

### Developer-Authored Core Gameplay

**I designed and implemented the original core gameplay myself, without AI-generated source code or coding-agent implementation of these algorithms.** This includes:

- Serpentine board numbering and the original board rendering.
- Movement input handling, step calculations, and player-position updates.
- Snake/ladder landing checks and source-to-destination transitions.
- Board-boundary and overshoot handling.
- Divisibility checks and position-text composition.

AI discussions, explanations, code review, and verification are disclosed separately below. They do not imply AI authorship of the original core implementation.

### Gameplay Decisions

- **Configuration:** board settings, fixed snake/ladder pairs, and position-text mappings are defined in `src/contracts.js`. Moves use the entered value rather than a random dice roll.
- **Overshoot:** the assessment does not specify what happens when a move passes square 100. This implementation clamps the resulting position to **100** and counts it as a win; an exact roll is not required.
- **Position text:** divisibility is evaluated using the final position after a snake/ladder transition. All matching labels are concatenated without separators in this order:

| Divisor | Label |
| --- | --- |
| 3 | `foo` |
| 4 | `baz` |
| 5 | `bar` |
| 7 | `jazz` |
| 9 | `huzz` |

For example, position **15** displays `foobar`, **9** displays `foohuzz`, and **100** displays `bazbar`. The ordering is explicit because the assessment's examples do not cover every overlapping combination.

**Current limitations:** input validation still needs correction: out-of-range integers can be accepted, and rejected non-integer input sets the position to `-1`. When no divisor matches, the position text is currently empty instead of falling back to the square number. These are implementation gaps, not intended game rules.

## AI Assistance Disclosure

ChatGPT was used for requirement clarification, React/state explanations, code review, and debugging guidance.

The Git history explicitly marks these Codex-generated feature contributions:

| Commit | AI-generated contribution |
| --- | --- |
| `ef97cf4` - `feat(codex): add snake and ladder image overlays` | Snake/ladder image overlay, coordinate and anchor transforms, overlay styling, and integration with the board. |
| `3aa8229` - `feat(codex): show winner overlay when reaching the final position` | Winner badge overlay, its styling, and conditional integration when the player reaches the final position. |

These descriptions identify specific feature contributions, not authorship of every line or asset in each commit. The provided snake, ladder, and winner artwork was reused. The overlay coordinate/anchor calculations are AI-generated presentation code, separate from the developer-authored movement calculations and gameplay algorithms described above.
