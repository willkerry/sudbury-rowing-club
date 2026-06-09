import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { getPayload, type Payload } from "payload";
import { getPlatformProxy } from "wrangler";

const libDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(libDir, "..", "..", "..");
for (const file of [".env.local", ".env"]) {
  loadEnv({ override: false, path: path.join(appRoot, file) });
}

const config = (await import("../../../src/payload.config")).default;

let cached: Payload | undefined;

/**
 * Returns a Payload instance bound to the local wrangler-emulated D1 + R2.
 * Cached so successive calls within one process re-use the same instance.
 */
export async function getPayloadClient(): Promise<Payload> {
  if (cached) return cached;
  await getPlatformProxy({
    environment: process.env.CLOUDFLARE_ENV,
    remoteBindings: false,
  });
  cached = await getPayload({ config });

  return cached;
}
