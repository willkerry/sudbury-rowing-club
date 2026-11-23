import { waitUntil } from "cloudflare:workers";
import { BROWSER_CACHE_CONTROL } from "./cache-control";

const CDN_POLICY_HEADER = "cdn-cache-control";
const EDGE_CACHE_STATUS_HEADER = "x-edge-cache";

type Handler = (request: Request) => Promise<Response>;

const getEdgeCache = () =>
  (globalThis.caches as (CacheStorage & { default?: Cache }) | undefined)
    ?.default;

/**
 * Serves cacheable tRPC queries from the Cloudflare Cache API. vinext treats
 * the tRPC route as dynamic (it reads the URL and headers), so its own route
 * cache never applies. Responses opt in through the `cdn-cache-control`
 * policy that cache-control.ts sets for procedures with `cacheSeconds`.
 */
export const withEdgeCache =
  (handler: Handler): Handler =>
  async (request) => {
    const cache = getEdgeCache();

    if (!cache || request.method !== "GET") return handler(request);

    // vinext hands route handlers a proxied Request, which the Cache API
    // rejects, so key entries on a plain request for the same URL.
    const cacheKey = new Request(request.url);
    const cached = await cache.match(cacheKey);

    if (cached) {
      const hit = new Response(cached.body, cached);
      hit.headers.set("cache-control", BROWSER_CACHE_CONTROL);
      hit.headers.set(EDGE_CACHE_STATUS_HEADER, "HIT");

      return hit;
    }

    const response = await handler(request);
    const policy = response.headers.get(CDN_POLICY_HEADER);

    if (!(response.ok && policy)) return response;

    const stored = new Response(response.clone().body, response);
    stored.headers.set("cache-control", policy);
    waitUntil(cache.put(cacheKey, stored));

    return response;
  };
