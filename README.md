# Brew Base

An independent browser for popular Homebrew casks. Pick the apps you need, then copy a single `brew install --cask` command.

## Features

- Browse the most installed Homebrew casks
- Filter casks by category
- Sort by install count or growth rate
- Select casks to generate an installation command
- Copy the command with one click, with or without the Homebrew installer
- Search across cask names, identifiers and descriptions

## Design

BrewBase uses a modern interpretation of Homebrew's visual language, documented
in [DESIGN.md](./DESIGN.md):

- Neutral espresso canvas with three warm surface steps and cream reading text
- Cream actions and selected states, with amber reserved for the brand mark
- System sans-serif for prose and a monospace stack for commands and identifiers
- Hairline neutral borders, a 6/8/12px radius scale, no gradients or shadows
- Sticky top bar, full-bleed command bar, split hero and responsive cask grid
- Visible keyboard focus, live copy feedback and reduced-motion support
- Dark-first by design, preserving Homebrew's warm brown identity

The beer mark in the navigation is a generic icon, not the Homebrew logo. BrewBase is not affiliated with or endorsed by Homebrew.

## Technologies

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- [Lucide](https://lucide.dev) icons

## Development

```bash
# Install dependencies
bun install

# Start the development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Data Source

Package data is sourced from the official Homebrew API:

- [365-day cask install analytics](https://formulae.brew.sh/api/analytics/cask-install/365d.json)
- [90-day cask install analytics](https://formulae.brew.sh/api/analytics/cask-install/90d.json)
- [Cask metadata](https://formulae.brew.sh/api/cask.json)
