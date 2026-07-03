# GKU Performance Program

Goalkeeper-specific strength & conditioning program for [Goalkeepers University](https://goalkeepersuniversity.com) — built by [Performance Bacon](https://performancebacon.com).

Static site, no build step. Open `index.html` or serve the folder with any static file server.

## Structure

- `index.html` — landing page, tier picker
- `off-season.html` — 12-week Triphasic block program (Eccentric → Isometric → Concentric/Power), 3x/week, 3 tiers
- `in-season.html` — 18-week MED maintenance program, 2 strength + 2 mobility sessions/week, plus practice-day and game-day primers
- `testing-guide.html` — 5-test battery (10m sprint, CMJ, broad jump, SL broad jump, SL lateral bound), norms, retest cadence
- `exercise-library.html` — every exercise used across both programs, searchable, with cues and rationale
- `assets/js/data-offseason.js`, `assets/js/data-inseason.js` — generated program data (see `tools/`)
- `tools/generate-offseason.mjs`, `tools/generate-inseason.mjs` — periodization logic that produces the data files above; edit the tables in these files and re-run with `node tools/generate-<name>.mjs` to regenerate

## Editing the program

Don't hand-edit `assets/js/data-*.js` — those are generated. Change the block/wave/exercise tables in the matching `tools/generate-*.mjs` script and re-run it.

## Disclaimer

S&C guidance, not medical advice. Any current pain, injury, or movement restriction should be cleared by a physio, athletic trainer, or doctor before training.
