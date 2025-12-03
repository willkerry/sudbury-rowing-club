import { kv } from "@vercel/kv";
import { parse, stringify } from "devalue";
import { env } from "@/env";

type CacheOptions<T, R = T> = {
  /** Unique cache key */
  key: string;
  /** Time to live in seconds */
  ttl: number;
  /** Async function whose return value should be cached */
  fn: () => Promise<T>;
  /** Optional function to transform cached data (e.g., reconstruct Date objects) */
  transform?: (data: T) => R;
};

type HitMiss = "hit" | "miss";

type CacheHeaders = {
  "X-Cache-Result": HitMiss;
};

type CachedResult<R> = {
  data: R;
  cacheResult: HitMiss;
  headers: CacheHeaders;
};

const withCommitHash = (key: string): string => {
  const commitSha = env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;

  return commitSha ? `${key}:${commitSha}` : key;
};

/**
 * Caches the return value of an async function in KV store with proper
 * serialisation/deserialisation using `devalue`. Returns an object with the
 * data and cache status.
 *
 * If a transform function is provided, it will be applied to cached data after
 * their retrieval from the cache (or the resolution of the async function).
 *
 * Cache validity is managed by the TTL. If the function rejects when there's
 * no cached data, the error will propagate.
 */
export const cached = async <T, R = T>(
  options: CacheOptions<T, R>,
): Promise<CachedResult<R>> => {
  const { key, ttl, fn, transform } = options;
  const cacheKey = withCommitHash(key);

  const cached = await kv.get<string>(cacheKey);

  if (cached) {
    try {
      console.log(new Date(), `${cacheKey} hit cache`);
      const parsed = parse(cached) as T;
      const data = transform ? transform(parsed) : (parsed as unknown as R);

      const cacheResult = "hit";

      return {
        data,
        cacheResult,
        headers: { "X-Cache-Result": cacheResult },
      };
    } catch (parseError) {
      console.error(
        new Date(),
        `${cacheKey} failed to parse cached data, falling back to fresh fetch`,
        parseError,
      );
      // Fall through to fetch fresh data
    }
  }

  console.log(new Date(), `${key} cold start`);
  const data = await fn();
  await kv.set(cacheKey, stringify(data), { ex: ttl });

  const cacheResult = "miss";

  return {
    data: transform ? transform(data) : (data as unknown as R),
    cacheResult,
    headers: { "X-Cache-Result": cacheResult },
  };
};
