import { describe, expect, it } from "vitest";
import {
  getCacheHeaders,
  getProcedureCacheSeconds,
} from "@/lib/trpc/cache-control";

const request = (overrides: Partial<Parameters<typeof getCacheHeaders>[0]>) =>
  getCacheHeaders({
    cacheSeconds: [60],
    eagerGeneration: false,
    hasErrors: false,
    type: "query",
    ...overrides,
  });

describe("getProcedureCacheSeconds", () => {
  it("reads cacheSeconds from procedure meta", () => {
    expect(getProcedureCacheSeconds({ cacheSeconds: 60 })).toBe(60);
  });

  it("treats missing or malformed meta as uncacheable", () => {
    expect(getProcedureCacheSeconds(undefined)).toBe(0);
    expect(getProcedureCacheSeconds(null)).toBe(0);
    expect(getProcedureCacheSeconds({})).toBe(0);
    expect(getProcedureCacheSeconds({ cacheSeconds: "60" })).toBe(0);
  });

  it("treats zero and negative TTLs as uncacheable", () => {
    expect(getProcedureCacheSeconds({ cacheSeconds: 0 })).toBe(0);
    expect(getProcedureCacheSeconds({ cacheSeconds: -60 })).toBe(0);
  });
});

describe("getCacheHeaders", () => {
  it("caches a query on the CDN but not in the browser", () => {
    expect(request({ cacheSeconds: [60] })).toEqual({
      "cache-control": "public, max-age=0, must-revalidate",
      "vercel-cdn-cache-control":
        "public, s-maxage=60, stale-while-revalidate=60, stale-if-error=86400",
    });
  });

  it("uses the shortest TTL in a batch", () => {
    expect(
      request({ cacheSeconds: [3600, 60] })?.["vercel-cdn-cache-control"],
    ).toContain("s-maxage=60");
  });

  it("does not cache a batch containing an uncacheable procedure", () => {
    expect(request({ cacheSeconds: [3600, 0] })).toBeUndefined();
  });

  it("does not cache mutations", () => {
    expect(request({ type: "mutation" })).toBeUndefined();
  });

  it("does not cache responses containing errors", () => {
    expect(request({ hasErrors: true })).toBeUndefined();
  });

  it("does not cache when the response is generated before the data is known", () => {
    expect(request({ eagerGeneration: true })).toBeUndefined();
  });

  it("does not cache when there are no calls", () => {
    expect(request({ cacheSeconds: [] })).toBeUndefined();
  });
});
