import { kv } from "@vercel/kv";
import { parse as devalueParse, stringify as devalueStringify } from "devalue";
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
  cachedAt: Date;
};

const withCommitHash = (key: string): string => {
  const commitSha = env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;

  return commitSha ? `${key}:${commitSha}` : key;
};

type CachedData<T> = {
  data: T;
  cachedAt: Date;
};

// kv.get() will attempt to parse the string as JSON if it looks like JSON
const stringify = (data: unknown): string =>
  Buffer.from(devalueStringify(data)).toString("base64");
const parse = <T>(data: string): T =>
  devalueParse(Buffer.from(data, "base64").toString());

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
      const parsed = parse<CachedData<T>>(cached);
      const data = transform
        ? transform(parsed.data)
        : (parsed.data as unknown as R);

      const cacheResult = "hit";

      return {
        data,
        cacheResult,
        headers: { "X-Cache-Result": cacheResult },
        cachedAt: parsed.cachedAt,
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
  const fetchedData = await fn();
  const cachedAt = new Date();
  const dataWithTimestamp: CachedData<T> = {
    data: fetchedData,
    cachedAt,
  };
  await kv.set(cacheKey, stringify(dataWithTimestamp), { ex: ttl });

  const cacheResult = "miss";

  return {
    data: transform ? transform(fetchedData) : (fetchedData as unknown as R),
    cacheResult,
    headers: { "X-Cache-Result": cacheResult },
    cachedAt,
  };
};
