import type { Cache } from "@epic-web/cachified";
import { configure, totalTtl } from "@epic-web/cachified";
import { kv, type VercelKV } from "@vercel/kv";
import { parse as devalueParse, stringify as devalueStringify } from "devalue";
import { env } from "@/env";

const SEPARATOR = ":";

const withCommitHash = (key: string): string => {
  const commitSha = env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
  return commitSha ? `${key}${SEPARATOR}${commitSha}` : key;
};

const redisCacheAdapter = (redisCache: VercelKV): Cache => ({
  name: "Redis",
  delete: (key) => redisCache.del(withCommitHash(key)),
  get: async (key) => {
    const value = await redisCache.get(withCommitHash(key));

    if (typeof value !== "string") return null;

    return devalueParse(value);
  },
  set: (key, value) => {
    const ttl = totalTtl(value?.metadata);
    const createdAt = value?.metadata?.createdTime;

    return redisCache.set(
      withCommitHash(key),
      devalueStringify(value),
      ttl > 0 && ttl < Number.POSITIVE_INFINITY && typeof createdAt === "number"
        ? {
            exat: Math.ceil((ttl + createdAt) / 1000),
          }
        : undefined,
    );
  },
});

const cache = redisCacheAdapter(kv);

export const cached = configure({ cache });
