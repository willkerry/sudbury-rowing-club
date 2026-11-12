# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sudbury Rowing Club website - a pnpm monorepo with three applications and shared packages.

## Commands

```bash
# Development
pnpm install              # Install all dependencies
pnpm dev                  # Start all dev servers via Turbo (web on port 4321, in local workerd)
pnpm build                # Build all packages and apps
pnpm type-check           # TypeScript type checking
pnpm test                 # Run tests
pnpm test:watch           # Run tests in watch mode
pnpm check                # Run oxlint and oxfmt with auto-fix

# Web app (from apps/web)
pnpm run deploy           # vite build + vinext-cloudflare deploy (CI deploys on push to master)
pnpm run db:migrate       # Apply D1 migrations from packages/db to production

# Per-app commands (from app directory)
pnpm dev --filter@sudburyrc/web     # Web app only
pnpm dev --filter@sudburyrc/cms     # Sanity CMS only
pnpm dev --filter@sudburyrc/results # Results app only
```

## Architecture

**Apps:**
- `apps/web` - Next.js API on [vinext](https://www.npmjs.com/package/vinext) (Vite), deployed to Cloudflare Workers as `sudbury-web` (React 19, Tailwind CSS 4, port 4321)
- `apps/og` - Share (OG) image Worker, `sudbury-og`. Screenshots the web app's `/og-template` page with Browser Rendering and caches PNGs in R2. Only reachable through `sudbury-web`'s `OG` service binding, which checks each `/api/og` URL's `OG_IMAGE_SECRET` signature first. On push to master, CI deploys each app that changed since the last fully green master run: web in its own job, the rest through `turbo run deploy --affected`.
- `apps/cms` - Sanity Studio CMS (content management; its CI deploy also deploys the schema)
- `apps/results` - Static regatta results archive at results.sudburyrowingclub.org.uk. Astro site: a content loader parses each archival HTML file in `data/<year>/` into an entry rendered through layouts at its original URL; each year's `GeneralStyle.css` is scoped to its pages by a Lightning CSS selector visitor (`src/integrations/archive-assets.ts`). New pages or year folders need no code changes

**Packages:**
- `packages/api` - API utilities and data processing (tsup-built)
- `packages/blue` - Headless UI component library
- `packages/db` - Drizzle schema and client for the web app's D1 database
- `packages/helpers` - Shared utility functions
- `packages/ical-builder` - iCalendar generation
- `packages/images` - Cloudflare CDN image URL builders
- `packages/static` - Shared static data across apps
- `packages/tsconfig` - Shared TypeScript configurations

**Data flow:** Sanity CMS → GROQ queries → web app. A Sanity webhook to `/api/revalidate` invalidates cached pages.

**Cloudflare bindings (apps/web/wrangler.jsonc):** Workers Response Store for pages and data (R2 `CACHE_BODIES` + `CacheMetadata` Durable Object, see vite.config.ts), KV (`DATA_CACHE`), D1 (`DB`), rate limiting, Images, the `OG` service binding to `apps/og`, an hourly cron (`worker.ts`). Keep the Worker under 3 MB gzipped (free plan). `Env` types are generated from each wrangler.jsonc into a gitignored `worker-configuration.d.ts` by `pnpm generate` (`wrangler types`), which turbo runs before dev, build and type-check.

## Code Style

**DO NOT WRITE COMMENTS THAT STATE THE BLEEDING OBVIOUS.** NO COMMENTS THAT
RESTATE WHAT THE CODE, CONFIG OR WORKFLOW STEP ALREADY SAYS. NO NARRATING
STEPS, NO SUMMARISING A FUNCTION ABOVE IT, NO MULTI-LINE ESSAYS. A COMMENT
EARNS ITS PLACE ONLY BY EXPLAINING A NON-OBVIOUS **WHY** (A PLATFORM QUIRK, A
WORKAROUND, A CONSTRAINT) – AND THEN IN ONE SHORT LINE. WHEN IN DOUBT, LEAVE IT
OUT.

- **Oxlint** (`.oxlintrc.json`) and **Oxfmt** (`.oxfmtrc.json`) handle linting and formatting (not ESLint/Prettier/Biome). Their configs are the source of truth; run `pnpm check` rather than memorising them
- **Lefthook** pre-commit hook runs `oxlint --fix` and `oxfmt` on staged files automatically
- Suppress a lint with `// oxlint-disable-next-line <rule> -- <reason>`
- Semicolons required, double quotes, trailing commas
- Prefer named exports (default exports only where frameworks require them)
- Use `for...of` instead of `Array.forEach`
- Arrow functions preferred over function expressions
- Use `T[]` array syntax (not `Array<T>`)
- Tailwind classes sorted by `cn`, `cva`, `clsx` functions
- Use empty lines to break code into short paragraphs of related statements, and nearly always before a `return`

## Key Technologies

- **Package manager:** pnpm 11 (see `packageManager` in package.json)
- **Node version:** 26 (see `.nvmrc`). Node runs `scripts/ci/*.ts` directly via type stripping, so keep them to erasable TypeScript syntax
- **Build orchestration:** Turbo
- **Testing:** Vitest with React Testing Library
- **UI primitives:** Radix UI, Headless UI
- **State/data fetching:** TanStack React Query, TanStack React Form
- **Type validation:** Zod
- **Email:** React Email + Resend
- **Analytics:** PostHog
- **Search:** Algolia

## Environment Variables

Local values live in `apps/web/.env` (validated by `apps/web/env.ts`):
- `NEXT_PUBLIC_*` - Client-accessible vars, inlined at build time (CI reads them from GitHub secrets)
- Server secrets (`ALGOLIA_API_KEY`, `RESEND_API_KEY`, `SANITY_REVALIDATE_SECRET`, etc.) - set on the Worker with `wrangler secret put`
- `SANITY_STUDIO_*`, `SANITY_AUTH_TOKEN` - CMS access
