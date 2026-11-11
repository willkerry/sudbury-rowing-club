import { z } from "zod";

// Public values are inlined into the bundles at build time, so a stray quote
// or space (say, from pasting a quoted .env value into a CI secret) ships to
// production. The build fails on these instead (see vite.config.ts).
const bareValue = z
  .string("is missing")
  .regex(/^[^\s"'`]+$/, "must be a bare value, without quotes or whitespace");

export const clientSchema = {
  NEXT_PUBLIC_ALGOLIA_APP_ID: bareValue,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME: bareValue,
  NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: bareValue,
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "preview", "production"])
    .optional(),
  NEXT_PUBLIC_GIT_COMMIT_SHA: z.string().optional(),
  NEXT_PUBLIC_MAPTILER_KEY: bareValue,
  NEXT_PUBLIC_POSTHOG_HOST: bareValue.pipe(z.url()),
  NEXT_PUBLIC_POSTHOG_KEY: bareValue,
  NEXT_PUBLIC_SANITY_DATASET: bareValue.regex(
    /^[a-z0-9_-]+$/,
    "must be lower-case letters, digits, underscores or dashes",
  ),
  NEXT_PUBLIC_SANITY_PROJECT_ID: bareValue.regex(
    /^[a-z0-9-]+$/,
    "must be lower-case letters, digits or dashes",
  ),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: bareValue,
};

// Keep in step with `secrets.required` in wrangler.jsonc, which makes
// `wrangler deploy` fail when the Worker is missing one.
export const serverSchema = {
  ALGOLIA_API_KEY: z.string().min(1),
  BUG_RECIPIENT_EMAIL: z.string(),
  FIRECRAWL_API_KEY: z.templateLiteral(["fc-", z.string()]),
  OG_IMAGE_SECRET: z.string().min(32),
  REDIRECT_SECRET: z.string().min(32),
  RESEND_API_KEY: z.string().min(1),
  RESEND_WEBHOOK_SECRET: z.string().min(1),
  SANITY_REVALIDATE_SECRET: z.string().min(32),
  TURNSTILE_SECRET_KEY: z.string().min(1),
};

export const sharedSchema = {
  APP_URL: z.string().optional(),
  NODE_ENV: z.enum(["development", "production"]),
};
