// Env itself comes from worker-configuration.d.ts (`pnpm generate`), built
// without runtime types because they clash with the DOM lib this app needs.
type D1Database = import("@cloudflare/workers-types").D1Database;
type DurableObjectNamespace<
  T extends
    | import("@cloudflare/workers-types").Rpc.DurableObjectBranded
    | undefined = undefined,
> = import("@cloudflare/workers-types").DurableObjectNamespace<T>;
type Fetcher = import("@cloudflare/workers-types").Fetcher;
type ImagesBinding = import("@cloudflare/workers-types").ImagesBinding;
type KVNamespace = import("@cloudflare/workers-types").KVNamespace;
type R2Bucket = import("@cloudflare/workers-types").R2Bucket;
type RateLimit = import("@cloudflare/workers-types").RateLimit;
type WorkerVersionMetadata =
  import("@cloudflare/workers-types").WorkerVersionMetadata;

declare module "cloudflare:workers" {
  export function waitUntil(promise: Promise<unknown>): void;

  export const env: Cloudflare.Env;
}
