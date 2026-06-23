import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/env", () => ({
  env: { FIRECRAWL_API_KEY: "fc-test-key" },
}));

const { fetchJsonThroughWaf, fetchViaFirecrawl } = await import("./firecrawl");

type FakeResponse = {
  ok: boolean;
  status?: number;
  statusText?: string;
  headers: { get: (name: string) => string | null };
  json: () => Promise<unknown>;
};

const response = (init: {
  ok?: boolean;
  status?: number;
  statusText?: string;
  headers?: { get: (name: string) => string | null };
  body: unknown;
}): FakeResponse => ({
  headers: { get: (name) => init.headers?.get(name) ?? null },
  ok: init.ok ?? true,
  status: init.status ?? 200,
  statusText: init.statusText ?? "OK",
  json: () => Promise.resolve(init.body),
});

const headers = (map: Record<string, string>) => ({
  get: (name: string) => map[name.toLowerCase()] ?? null,
});

const firecrawlOk = (rawHtml: string, statusCode = 200) => ({
  data: { rawHtml, metadata: { statusCode } },
  success: true,
});

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchJsonThroughWaf", () => {
  it("returns parsed JSON from a successful direct fetch without calling Firecrawl", async () => {
    mockFetch.mockResolvedValueOnce(
      response({
        body: [{ a: 1 }],
        headers: headers({ "content-type": "application/json" }),
      }),
    );

    const result = await fetchJsonThroughWaf("https://example.com/data.json");

    expect(result).toEqual([{ a: 1 }]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("falls back to Firecrawl when the direct fetch is challenged", async () => {
    mockFetch
      .mockResolvedValueOnce(
        response({
          body: "",
          headers: headers({ "cf-mitigated": "challenge" }),
          ok: false,
          status: 403,
        }),
      )
      .mockResolvedValueOnce(
        response({ body: firecrawlOk('[{"a":2}]'), headers: headers({}) }),
      );

    const result = await fetchJsonThroughWaf("https://example.com/data.json");

    expect(result).toEqual([{ a: 2 }]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    const [, firecrawlCall] = mockFetch.mock.calls;
    expect(firecrawlCall[0]).toBe("https://api.firecrawl.dev/v2/scrape");
  });
});

describe("fetchViaFirecrawl", () => {
  it("throws when the Firecrawl call is non-2xx", async () => {
    mockFetch.mockResolvedValueOnce(
      response({
        body: {},
        headers: headers({}),
        ok: false,
        status: 402,
        statusText: "Payment Required",
      }),
    );

    await expect(
      fetchViaFirecrawl("https://example.com/data.json"),
    ).rejects.toThrow("402");
  });

  it("throws when the upstream status (metadata.statusCode) is >= 400", async () => {
    mockFetch.mockResolvedValueOnce(
      response({
        body: firecrawlOk("<html>Just a moment</html>", 403),
        headers: headers({}),
      }),
    );

    await expect(
      fetchViaFirecrawl("https://example.com/data.json"),
    ).rejects.toThrow("403");
  });
});
