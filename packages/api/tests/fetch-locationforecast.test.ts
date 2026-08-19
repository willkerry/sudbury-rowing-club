import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchLocationForecast } from "../src/queries/fetch-locationforecast";
import fixture from "./fixtures/locationforecast.json";

const mockFetch = (
  body: unknown,
  {
    status = 200,
    headers = {},
  }: { status?: number; headers?: Record<string, string> } = {},
) => {
  const spy = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(
    async () =>
      new Response(status === 304 ? null : JSON.stringify(body), {
        status,
        headers,
      }),
  );

  vi.stubGlobal("fetch", spy);

  return spy;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchLocationForecast", () => {
  it("requests coordinates with at most four decimal places", async () => {
    const spy = mockFetch(fixture);

    await fetchLocationForecast();

    const url = new URL(spy.mock.calls[0][0] as string);

    expect(url.searchParams.get("lat")).toBe("52.0340");
    expect(url.searchParams.get("lon")).toBe("0.7276");
  });

  it("identifies itself per MET's terms of service", async () => {
    const spy = mockFetch(fixture);

    await fetchLocationForecast();

    const { headers } = spy.mock.calls[0][1] as {
      headers: Record<string, string>;
    };

    expect(headers["User-Agent"]).toBe(
      "sudburyrowingclub.org.uk webmaster@sudburyrowingclub.org.uk",
    );
  });

  it("sends If-Modified-Since when given a previous Last-Modified", async () => {
    const spy = mockFetch(fixture);

    await fetchLocationForecast("Tue, 18 Aug 2026 18:11:21 GMT");

    const { headers } = spy.mock.calls[0][1] as {
      headers: Record<string, string>;
    };

    expect(headers["If-Modified-Since"]).toBe("Tue, 18 Aug 2026 18:11:21 GMT");
  });

  it("omits If-Modified-Since when there is no previous value", async () => {
    const spy = mockFetch(fixture);

    await fetchLocationForecast(null);

    const { headers } = spy.mock.calls[0][1] as {
      headers: Record<string, string>;
    };

    expect(headers["If-Modified-Since"]).toBeUndefined();
  });

  it("reports a 304 as not-modified", async () => {
    mockFetch(null, { status: 304 });

    expect(await fetchLocationForecast("anything")).toEqual({
      status: "not-modified",
    });
  });

  it("parses a real response and surfaces the caching headers", async () => {
    mockFetch(fixture, {
      headers: {
        expires: "Tue, 18 Aug 2026 18:43:17 GMT",
        "last-modified": "Tue, 18 Aug 2026 18:11:21 GMT",
      },
    });

    const result = await fetchLocationForecast();

    if (result.status !== "fresh") throw new Error("expected a fresh result");

    expect(result.forecast.properties.timeseries.length).toBeGreaterThan(50);
    expect(result.expires).toBe("Tue, 18 Aug 2026 18:43:17 GMT");
    expect(result.lastModified).toBe("Tue, 18 Aug 2026 18:11:21 GMT");
  });

  it("throws on a server error", async () => {
    mockFetch(null, { status: 500 });

    await expect(fetchLocationForecast()).rejects.toThrow("500");
  });
});
