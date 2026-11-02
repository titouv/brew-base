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

BrewBase follows the [Homebrew website](https://brew.sh) design language:

- Warm brown shell `#2E2A24` with amber text `#FFD79A`, cream highlights and gold links
- System sans-serif for prose and a monospace stack for commands and identifiers
- Hairline brown borders (`rgba(162, 107, 20, 0.3)`), `0.4em` radii and flat surfaces, with no gradients or glass effects
- Cyan `#87C7D8` focus outlines and a minimum 44px target for controls
- Dark theme only, matching brew.sh

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
