declare module "cloudflare:workers" {
  import type {
    D1Database,
    Fetcher,
    KVNamespace,
    RateLimit,
    WorkerVersionMetadata,
  } from "@cloudflare/workers-types";

  export function waitUntil(promise: Promise<unknown>): void;

  // Keep in step with the bindings in wrangler.jsonc.
  export const env: {
    ASSETS: Fetcher;
    CF_VERSION_METADATA: WorkerVersionMetadata;
    DATA_CACHE: KVNamespace;
    DB: D1Database;
    RATE_LIMITER: RateLimit;
  };
}
