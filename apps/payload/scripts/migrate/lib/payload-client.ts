import { getPayload, type Payload } from "payload";
import { getPlatformProxy } from "wrangler";
import config from "../../../src/payload.config";

let cached: Payload | undefined;

/**
 * Returns a Payload instance bound to the local wrangler-emulated D1 + R2.
 * Cached so successive calls within one process re-use the same instance.
 */
export async function getPayloadClient(): Promise<Payload> {
  if (cached) return cached;
  await getPlatformProxy({ environment: process.env.CLOUDFLARE_ENV });
  cached = await getPayload({ config });

  return cached;
}
