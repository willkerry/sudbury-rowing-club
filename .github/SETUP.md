# CI/CD Setup Guide

Everything needed in the GitHub repo settings to make the CI/CD workflows functional.

## GitHub Secrets

Settings > Secrets and variables > Actions > **Secrets**

| Secret | Source | Notes |
|---|---|---|
| `VERCEL_TOKEN` | Vercel Dashboard > Settings > Tokens > Create | Full account scope. Also used as `VERCEL_TOKEN` for remote cache. |
| `VERCEL_ORG_ID` | Vercel Dashboard > Settings > General > ID | Current: `team_bKRQFvACTWs20HMo8eS0eJLN` |
| `VERCEL_PROJECT_ID` | Vercel Dashboard > Project > Settings > General > ID | Current: `prj_aSi6kK1McEFWy6AW6gGJyMSIfC5i` |
| `CLOUDFLARE_API_TOKEN` | CF Dashboard > My Profile > API Tokens > Create | Needs "Workers Scripts: Edit" permission |
| `CLOUDFLARE_ACCOUNT_ID` | CF Dashboard > any zone > Overview sidebar | |
| `SANITY_AUTH_TOKEN` | Sanity > Project > API > Tokens | Read token for GROQ queries at build time |
| `ALGOLIA_API_KEY` | Algolia Dashboard > API Keys | Search/indexing key |
| `RESEND_API_KEY` | Resend Dashboard > API Keys | For contact form emails |
| `REDIRECT_SECRET` | Self-generated (`openssl rand -hex 32`) | Salt for hashed external redirect URL codes |

## GitHub Variables

Settings > Secrets and variables > Actions > **Variables**

| Variable | Value |
|---|---|
| `TURBO_TEAM` | Your Vercel team slug |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `gvxge7ps` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `APP_URL` | `https://sudburyrowingclub.org.uk` |
| `BUG_RECIPIENT_EMAIL` | *(set appropriately)* |

## Platform Configuration

### Vercel

1. **Disconnect git integration** — Vercel Dashboard > Project > Settings > Git > Disconnect. GitHub Actions handles all deployments now.

2. **Add staging domain** — Vercel Dashboard > Project > Settings > Domains > Add `staging.sudburyrowingclub.org.uk`. Then add a DNS CNAME record: `staging` → `cname.vercel-dns.com`.

### Cloudflare

1. **Disconnect git-triggered builds** — CF Dashboard > Workers & Pages > each project (CMS, results) > Settings > Builds & Deployments > disconnect the GitHub repo or disable automatic deployments. GitHub Actions handles all deploys now.

2. **API token permissions** — When creating the token:
   - Account > Workers Scripts > Edit
   - Account > Account Settings > Read
   - Zone > Zone > Read (if using custom domains on workers)

3. **First results deploy** — The first `wrangler deploy` for `sudbury-regatta-results-staging` automatically creates the Workers service. No pre-setup needed.

### Turbo Remote Cache

Verify locally:

```bash
npx turbo login
npx turbo link
pnpm build  # should show "Remote caching enabled"
```

The `VERCEL_TOKEN` and `TURBO_TEAM` values from this setup go into the GitHub secrets/variables above.

## What Uses What

| Workflow | Secrets | Variables |
|---|---|---|
| **test.yml** | `VERCEL_TOKEN` | `TURBO_TEAM` |
| **deploy.yml** (build) | `VERCEL_TOKEN`, `SANITY_AUTH_TOKEN`, `ALGOLIA_API_KEY`, `RESEND_API_KEY`, `REDIRECT_SECRET` | `TURBO_TEAM`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `APP_URL`, `BUG_RECIPIENT_EMAIL` |
| **deploy.yml** (web staging/prod) | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | `TURBO_TEAM` |
| **deploy.yml** (cms/results) | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | — |
| **preview.yml** | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | `TURBO_TEAM` |

### release-please

No additional tokens needed — uses the default `GITHUB_TOKEN` provided by Actions. The deploy workflow declares `permissions: contents: write, pull-requests: write`.
