import type { ProcedureMeta } from "./init";

const STALE_IF_ERROR_SECONDS = 60 * 60 * 24;

const BROWSER_CACHE_CONTROL = "public, max-age=0, must-revalidate";

export const getProcedureCacheSeconds = (meta: unknown): number => {
  const { cacheSeconds } = (meta ?? {}) as Partial<ProcedureMeta>;

  return typeof cacheSeconds === "number" && cacheSeconds > 0
    ? cacheSeconds
    : 0;
};

export const getCacheHeaders = ({
  cacheSeconds,
  eagerGeneration,
  hasErrors,
  type,
}: {
  cacheSeconds: number[];
  eagerGeneration: boolean;
  hasErrors: boolean;
  type: string;
}): Record<string, string> | undefined => {
  if (type !== "query" || hasErrors || eagerGeneration) return;
  if (cacheSeconds.length === 0) return;

  const ttl = Math.min(...cacheSeconds);

  if (ttl <= 0) return;

  return {
    "cache-control": BROWSER_CACHE_CONTROL,
    "vercel-cdn-cache-control": `public, s-maxage=${ttl}, stale-while-revalidate=${ttl}, stale-if-error=${STALE_IF_ERROR_SECONDS}`,
  };
};
