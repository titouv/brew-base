# Brew Base

A modern web application that helps Mac users discover and install popular Homebrew packages with ease.

<!-- ![Brew Base](/public/file.svg) -->

## Features

- 🔎 Browse popular Homebrew cask packages
- 🏷️ Filter packages by category
- 📈 Sort by popularity or growth rate
- ✅ Select packages to generate installation commands
- 📋 Copy commands with one click, with or without Homebrew installation
- 🖥️ macOS-inspired interface with light/dark mode support

## Technologies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## Development

```bash
# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Data Source

Package data is sourced from the official Homebrew API:
- Installation analytics
- Package metadata and descriptions
