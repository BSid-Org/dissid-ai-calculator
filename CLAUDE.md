# DISSID AI Savings Calculator

## Overview

Next.js 16 static site deployed to Firebase Hosting. Calculates potential AI automation savings for small businesses.

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4 with CSS custom properties
- **Animation**: Framer Motion
- **Icons**: Material Symbols Outlined
- **Deployment**: Firebase Hosting (static export)
- **Runtime**: Bun (npm is banned)

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Start dev server (localhost:3000)
bun run build        # Static export to out/
bun run test         # Run vitest in watch mode
bun run test:run     # Run vitest once (CI)
bunx firebase deploy # Deploy to Firebase
```

## Project Structure

```
src/app/
  components/
    Calculator.tsx      # Multi-step wizard (588 lines)
    calculator-data.ts  # Industries, pain points, calculation logic
    ErrorBoundary.tsx   # Error boundary wrapper
  layout.tsx            # Root layout with fonts/metadata
  page.tsx              # Home page
  globals.css           # Tailwind + CSS variables
```

## Firebase Configuration

- **Project**: dis-sid
- **Target**: calculator
- **Site**: dissid-ai-calculator.web.app
- **Public folder**: out/ (static export)

## Calculator Flow

1. Industry Selection (8 options)
2. Pain Point Selection (max 3 of 8)
3. Team Size + Hours/Week slider
4. Results with ROI breakdown

## Key Patterns

- **CSS Variables**: All colors use `var(--name)` for theming
- **Glass morphism**: `.glass-panel` and `.glass-panel-selected` classes
- **Gradients**: `.gradient-text` and `.gradient-btn` for branding
- **Animations**: Framer Motion for step transitions

## Conventions

- Use `bun` for all package management and script execution
- Static export only (`output: "export"` in next.config.ts)
- No server components that require runtime
- All interactive components must use `"use client"`
