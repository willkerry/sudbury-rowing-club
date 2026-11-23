import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { draft, kv, edge } = vi.hoisted(() => ({
  draft: { enabled: false },
  edge: { match: vi.fn(), put: vi.fn() },
  kv: { delete: vi.fn(), get: vi.fn(), put: vi.fn() },
}));

vi.mock("@/lib/server/draft-mode", () => ({
  isDraftModeRequest: async () => draft.enabled,
}));
vi.mock("cloudflare:workers", () => ({
  env: { CF_VERSION_METADATA: { id: "test" }, DATA_CACHE: kv },
  waitUntil: (promise: Promise<unknown>) => promise,
}));

const { cached } = await import("./cached");
const { withEdgeCache } = await import("@/lib/trpc/edge-cache");

const TWENTY_MINUTES = 20 * 60 * 1000;

let keyCount = 0;
const uniqueKey = () => `draft-bypass-${keyCount++}`;

beforeEach(() => {
  vi.clearAllMocks();
  kv.get.mockResolvedValue(null);
  vi.stubGlobal("caches", { default: edge });
});

afterEach(() => {
  draft.enabled = false;
  vi.unstubAllGlobals();
});

describe("cached (memory + KV)", () => {
  it("stores public values in memory and KV", async () => {
    const key = uniqueKey();
    const getFreshValue = vi.fn(async () => "published");

    await cached({ getFreshValue, key, ttl: TWENTY_MINUTES });
    await cached({ getFreshValue, key, ttl: TWENTY_MINUTES });

    expect(getFreshValue).toHaveBeenCalledOnce();
    expect(kv.put).toHaveBeenCalledOnce();
  });

  it("never reads or writes the shared caches in draft mode", async () => {
    draft.enabled = true;
    const key = uniqueKey();
    const getFreshValue = vi.fn(async () => "draft");

    await cached({ getFreshValue, key, ttl: TWENTY_MINUTES });
    await cached({ getFreshValue, key, ttl: TWENTY_MINUTES });

    expect(getFreshValue).toHaveBeenCalledTimes(2);
    expect(kv.get).not.toHaveBeenCalled();
    expect(kv.put).not.toHaveBeenCalled();
  });

  it("doesn't serve a draft request a value cached by a public one", async () => {
    const key = uniqueKey();

    await cached({
      getFreshValue: async () => "published",
      key,
      ttl: TWENTY_MINUTES,
    });

    draft.enabled = true;

    const value = await cached({
      getFreshValue: async () => "draft",
      key,
      ttl: TWENTY_MINUTES,
    });

    expect(value).toBe("draft");
  });
});

describe("withEdgeCache (tRPC)", () => {
  const cacheable = () =>
    new Response("{}", { headers: { "cdn-cache-control": "max-age=60" } });

  it("serves and stores public GET responses through the Cache API", async () => {
    edge.match.mockResolvedValue(undefined);
    const handler = vi.fn(async () => cacheable());

    await withEdgeCache(handler)(new Request("https://example.org/api/trpc/x"));

    expect(edge.match).toHaveBeenCalledOnce();
    expect(edge.put).toHaveBeenCalledOnce();
  });

  it("bypasses the Cache API entirely in draft mode", async () => {
    draft.enabled = true;
    const handler = vi.fn(async () => cacheable());

    await withEdgeCache(handler)(new Request("https://example.org/api/trpc/x"));

    expect(handler).toHaveBeenCalledOnce();
    expect(edge.match).not.toHaveBeenCalled();
    expect(edge.put).not.toHaveBeenCalled();
  });
});
