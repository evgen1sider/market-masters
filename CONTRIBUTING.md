# Contributing

Thanks for wanting to contribute! A few basic rules and helpful commands for working with this repository.

## Pre-commit checks
This repository uses Husky and lint-staged.
- A pre-commit hook runs `npm run check:eol` and then `npx lint-staged`.
- `lint-staged` runs ESLint on changed `.js` files, Stylelint on changed `.css` files and HTMLHint on changed `.html` files.

## Line endings
This repo uses `.gitattributes` to normalize line endings to LF in the repository. If you see issues related to line endings, run:

```bash
# Normalize working tree
git add --renormalize .
git commit -m "Normalize line endings"
```

You can also run the project EOL check locally:

```bash
npm run check:eol
```

## Local checks
- Install dependencies:

```bash
npm install
```

- Run lint and tests:

```bash
npm run lint
npm test
```

Thanks! If you add substantial changes, consider opening a PR so CI can run the full checks.
