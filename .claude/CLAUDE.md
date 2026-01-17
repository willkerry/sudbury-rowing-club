# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sudbury Rowing Club website - a pnpm monorepo with three applications and shared packages.

## Commands

```bash
# Development
pnpm install              # Install all dependencies
pnpm dev                  # Start all dev servers via Turbo (web on port 4321)
pnpm build                # Build all packages and apps
pnpm type-check           # TypeScript type checking
pnpm test                 # Run tests
pnpm test:watch           # Run tests in watch mode
pnpm check                # Run Biome linting/formatting with auto-fix

# Per-app commands (from app directory)
pnpm dev --filter@sudburyrc/web     # Web app only
pnpm dev --filter@sudburyrc/cms     # Sanity CMS only
pnpm dev --filter@sudburyrc/results # Results app only
```

## Architecture

**Apps:**
- `apps/web` - Next.js 16 frontend (React 19, Tailwind CSS 4, port 4321)
- `apps/cms` - Sanity Studio CMS (content management, deploys via Wrangler)
- `apps/results` - Static results pages (Nunjucks templates, Parcel bundler)

**Packages:**
- `packages/api` - API utilities and data processing (tsup-built)
- `packages/blue` - Headless UI component library
- `packages/helpers` - Shared utility functions
- `packages/ical-builder` - iCalendar generation
- `packages/images` - Cloudflare CDN image URL builders
- `packages/static` - Shared static data across apps
- `packages/tsconfig` - Shared TypeScript configurations

**Data flow:** Sanity CMS → GROQ queries → Next.js web app

## Code Style

- **Biome** handles linting and formatting (not ESLint/Prettier)
- **Lefthook** pre-commit hook runs `biome check --write` automatically
- Semicolons required, double quotes, trailing commas
- Prefer named exports (default exports only where frameworks require them)
- Use `for...of` instead of `Array.forEach`
- Arrow functions preferred over function expressions
- Use `T[]` array syntax (not `Array<T>`)
- Tailwind classes sorted by `cn`, `cva`, `clsx` functions
- No comments that state what clear code does (code should be self-documenting)
- Nearly always add an empty line before return statements

## Key Technologies

- **Package manager:** pnpm 8.14.1
- **Node version:** 22 (see `.nvmrc`)
- **Build orchestration:** Turbo
- **Testing:** Vitest with React Testing Library
- **UI primitives:** Radix UI, Headless UI
- **State/data fetching:** TanStack React Query, TanStack React Form
- **Type validation:** Zod
- **Email:** React Email + Resend
- **Analytics:** PostHog
- **Search:** Algolia

## Environment Variables

Build-time env vars (configure in `.env.local`):
- `SANITY_STUDIO_*`, `SANITY_AUTH_TOKEN` - CMS access
- `ALGOLIA_API_KEY` - Search
- `RESEND_API_KEY` - Email sending
- `NEXT_PUBLIC_*` - Client-accessible vars
