import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchBritishRowingFeed } from "@/lib/server/fetchBritishRowingFeed";

// Mock the he module
vi.mock("he", () => ({
  decode: vi.fn((str: string) =>
    str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
  ),
}));

describe("fetchBritishRowingFeed", () => {
  const mockResponse = [
    {
      id: 1,
      title: {
        rendered: "Test Article &amp; Title",
      },
      date: "2023-10-01T12:00:00Z",
      link: "https://example.com/article-1",
    },
    {
      id: 2,
      title: {
        rendered: "Another Article &lt;Title&gt;",
      },
      date: "2023-10-02T12:00:00Z",
      link: "https://example.com/article-2",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch and parse British Rowing feed successfully", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchBritishRowingFeed();

    expect(fetch).toHaveBeenCalledWith(
      "https://www.britishrowing.org/wp-json/wp/v2/posts?_fields=id,title,date,link&per_page=12",
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 1,
      title: {
        rendered: "Test Article & Title",
      },
      date: new Date("2023-10-01T12:00:00Z"),
      link: "https://example.com/article-1",
    });
    expect(result[1]).toEqual({
      id: 2,
      title: {
        rendered: "Another Article <Title>",
      },
      date: new Date("2023-10-02T12:00:00Z"),
      link: "https://example.com/article-2",
    });
  });

  it("should throw error when API request fails", async () => {
    // Mock failed fetch response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(fetchBritishRowingFeed()).rejects.toThrow(
      "British Rowing API request failed",
    );
  });

  it("should throw error when response has invalid schema", async () => {
    // Mock response with invalid schema
    const invalidResponse = [
      {
        id: "invalid-id", // should be number
        title: "Missing title object",
        date: "2023-10-01T12:00:00Z",
        link: "https://example.com/article-1",
      },
    ];

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => invalidResponse,
    });

    await expect(fetchBritishRowingFeed()).rejects.toThrow(
      "Unparseable response provided by British Rowing API",
    );
  });

  it("should handle empty response array", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const result = await fetchBritishRowingFeed();

    expect(result).toEqual([]);
  });

  it("should decode HTML entities in article titles", async () => {
    const responseWithEntities = [
      {
        id: 1,
        title: {
          rendered: "Article with &quot;quotes&quot; &amp; symbols",
        },
        date: "2023-10-01T12:00:00Z",
        link: "https://example.com/article-1",
      },
    ];

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => responseWithEntities,
    });

    const { decode } = await import("he");
    vi.mocked(decode).mockReturnValue('Article with "quotes" & symbols');

    const result = await fetchBritishRowingFeed();

    expect(decode).toHaveBeenCalledWith(
      "Article with &quot;quotes&quot; &amp; symbols",
    );
    expect(result[0].title.rendered).toBe('Article with "quotes" & symbols');
  });

  it("should handle network errors", async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchBritishRowingFeed()).rejects.toThrow("Network error");
  });

  it("should validate all required fields in response", async () => {
    const responseWithMissingFields = [
      {
        id: 1,
        title: {
          rendered: "Test Article",
        },
        date: "2023-10-01T12:00:00Z",
        // missing link field
      },
    ];

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => responseWithMissingFields,
    });

    await expect(fetchBritishRowingFeed()).rejects.toThrow(
      "Unparseable response provided by British Rowing API",
    );
  });
});
