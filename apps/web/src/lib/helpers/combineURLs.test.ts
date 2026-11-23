import { describe, expect, it } from "vitest";
import { combineURLs } from "@/lib/helpers/combineURLs";

describe("combineURLs", () => {
  it("should combine two URLs", () => {
    expect(combineURLs("https://example.com", "/test")).toBe(
      "https://example.com/test",
    );
  });

  it("should combine two URLs with a trailing slash", () => {
    expect(combineURLs("https://example.com/", "/test")).toBe(
      "https://example.com/test",
    );
  });

  it("should handle relative URLs without a base URL", () => {
    expect(combineURLs("/test")).toBe("/test");
  });
});
