import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    ALGOLIA_API_KEY: z.string().min(1),
    BUG_RECIPIENT_EMAIL: z.string(),
    CLERK_SECRET_KEY: z.string().min(1),
    KV_REST_API_READ_ONLY_TOKEN: z.string().min(1),
    KV_REST_API_TOKEN: z.string().min(1),
    KV_REST_API_URL: z.url(),
    KV_URL: z.url(),
    RESEND_API_KEY: z.string().min(1),
  },
  shared: {
    APP_URL: z.string().optional(),
    NEXT_ENV: z.enum(["development", "production"]).optional(),
    NODE_ENV: z.enum(["development", "production"]),
  },
  client: {
    NEXT_PUBLIC_ALGOLIA_APP_ID: z.string(),
    NEXT_PUBLIC_ALGOLIA_INDEX_NAME: z.string(),
    NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: z.string(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID: z.string(),
    NEXT_PUBLIC_MAPTILER_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_SANITY_DATASET: z.string(),
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string(),
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  },
  runtimeEnv: {
    APP_URL: process.env.APP_URL,
    ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
    BUG_RECIPIENT_EMAIL: process.env.BUG_RECIPIENT_EMAIL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_URL: process.env.KV_URL,
    NEXT_ENV: process.env.NEXT_ENV,
    NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    NEXT_PUBLIC_ALGOLIA_INDEX_NAME: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
    NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID:
      process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
    NEXT_PUBLIC_MAPTILER_KEY: process.env.NEXT_PUBLIC_MAPTILER_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA:
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    NODE_ENV: process.env.NODE_ENV,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
});
