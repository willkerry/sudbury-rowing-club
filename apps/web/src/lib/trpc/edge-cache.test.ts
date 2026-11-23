import { afterEach, describe, expect, it, vi } from "vitest";
import { BROWSER_CACHE_CONTROL } from "@/lib/trpc/cache-control";
import { withEdgeCache } from "@/lib/trpc/edge-cache";

const URL_ = "https://example.com/api/trpc/content.notice";
const POLICY = "public, s-maxage=60";

const createFakeCache = () => {
  const store = new Map<string, Response>();

  return {
    match: vi.fn(async (request: Request) => store.get(request.url)?.clone()),
    put: vi.fn((request: Request, response: Response) => {
      store.set(request.url, response);

      return Promise.resolve();
    }),
    store,
  };
};

const respond = (headers: Record<string, string>, status = 200) =>
  vi.fn(async () => new Response("body", { headers, status }));

const installCache = (cache: ReturnType<typeof createFakeCache>) => {
  vi.stubGlobal("caches", { default: cache });
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("withEdgeCache", () => {
  it("passes requests through when no edge cache is available", async () => {
    const handler = respond({ "cdn-cache-control": POLICY });

    const response = await withEdgeCache(handler)(new Request(URL_));

    expect(handler).toHaveBeenCalledOnce();
    expect(response.headers.get("x-edge-cache")).toBeNull();
  });

  it("stores responses that carry a CDN policy, then serves them", async () => {
    const cache = createFakeCache();
    installCache(cache);
    const handler = respond({
      "cache-control": BROWSER_CACHE_CONTROL,
      "cdn-cache-control": POLICY,
    });
    const cachedHandler = withEdgeCache(handler);

    await cachedHandler(new Request(URL_));
    const hit = await cachedHandler(new Request(URL_));

    expect(handler).toHaveBeenCalledOnce();
    expect(cache.store.get(URL_)?.headers.get("cache-control")).toBe(POLICY);
    expect(hit.headers.get("x-edge-cache")).toBe("HIT");
    expect(hit.headers.get("cache-control")).toBe(BROWSER_CACHE_CONTROL);
    expect(await hit.text()).toBe("body");
  });

  it("does not store responses without a CDN policy", async () => {
    const cache = createFakeCache();
    installCache(cache);

    await withEdgeCache(respond({}))(new Request(URL_));

    expect(cache.put).not.toHaveBeenCalled();
  });

  it("does not store failed responses", async () => {
    const cache = createFakeCache();
    installCache(cache);

    await withEdgeCache(respond({ "cdn-cache-control": POLICY }, 500))(
      new Request(URL_),
    );

    expect(cache.put).not.toHaveBeenCalled();
  });

  it("never caches POST requests", async () => {
    const cache = createFakeCache();
    installCache(cache);
    const handler = respond({ "cdn-cache-control": POLICY });

    await withEdgeCache(handler)(new Request(URL_, { method: "POST" }));

    expect(cache.match).not.toHaveBeenCalled();
    expect(cache.put).not.toHaveBeenCalled();
  });
});
