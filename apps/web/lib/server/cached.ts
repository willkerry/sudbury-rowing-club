import { env as workerEnv } from "cloudflare:workers";
import type { Cache, CacheEntry } from "@epic-web/cachified";
import { configure, totalTtl } from "@epic-web/cachified";
import { parse as devalueParse, stringify as devalueStringify } from "devalue";

const SEPARATOR = ":";
// Workers KV rejects expirations less than 60 seconds away.
const MIN_KV_TTL_SECONDS = 60;
// KV writes are metered (1,000/day on the free plan), so only entries that
// refresh at most this often are shared through KV. Faster-refreshing entries,
// such as the 60-second regatta notice, stay in each Worker instance's memory.
const MIN_KV_FRESH_TTL_MS = 10 * 60 * 1000;

// Scope entries to the deployed version so a deploy starts with a fresh cache.
const withVersion = (key: string): string => {
  const version = workerEnv.CF_VERSION_METADATA?.id;
  return version ? `${key}${SEPARATOR}${version}` : key;
};

const expiresAt = (entry: CacheEntry) => {
  const lifetime = totalTtl(entry.metadata);

  return lifetime === Number.POSITIVE_INFINITY
    ? Number.POSITIVE_INFINITY
    : entry.metadata.createdTime + lifetime;
};

const memory = new Map<string, CacheEntry>();

const tieredCacheAdapter = (): Cache => ({
  name: "Memory + Workers KV",
  delete: async (key) => {
    memory.delete(key);
    await workerEnv.DATA_CACHE.delete(withVersion(key));
  },
  get: async (key) => {
    const local = memory.get(key);

    if (local && expiresAt(local) > Date.now()) return local;

    memory.delete(key);

    const value = await workerEnv.DATA_CACHE.get(withVersion(key));

    if (typeof value !== "string") return null;

    const entry = devalueParse(value) as CacheEntry;
    memory.set(key, entry);

    return entry;
  },

  set: async (key, entry) => {
    memory.set(key, entry);

    const freshTtl = entry.metadata.ttl ?? Number.POSITIVE_INFINITY;

    if (freshTtl < MIN_KV_FRESH_TTL_MS) return;

    const expiry = expiresAt(entry);
    const expiresInSeconds =
      expiry === Number.POSITIVE_INFINITY
        ? undefined
        : Math.ceil((expiry - Date.now()) / 1000);

    await workerEnv.DATA_CACHE.put(
      withVersion(key),
      devalueStringify(entry),
      expiresInSeconds === undefined
        ? undefined
        : { expirationTtl: Math.max(expiresInSeconds, MIN_KV_TTL_SECONDS) },
    );
  },
});

const cache = tieredCacheAdapter();

export const cached = configure({ cache });

/**
 * Reads a cached value without refreshing it, for callers that need the
 * previous entry while computing the next one. Returns null once the entry has
 * aged out of its stale-while-revalidate window.
 */
export const getCachedEntry = async <Value>(
  key: string,
): Promise<Value | null> => {
  const entry = await cache.get(key);

  return (entry?.value as Value | undefined) ?? null;
};
