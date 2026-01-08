import { describe, expect, it } from "vitest";
import { buildCloudflareImageUrl, cloudflareLoader } from "../src/cloudflare";

describe("buildCloudflareImageUrl", () => {
  it("should return original URL when no options provided", () => {
    expect(buildCloudflareImageUrl("https://example.com/test.jpg")).toBe(
      "https://example.com/test.jpg",
    );
  });

  it("should build URL with width", () => {
    expect(
      buildCloudflareImageUrl("https://example.com/test.jpg", { width: 100 }),
    ).toBe(
      "https://cdn.sudburyrowingclub.org.uk/cdn-cgi/image/width=100/https://example.com/test.jpg",
    );
  });

  it("should build URL with width and height", () => {
    expect(
      buildCloudflareImageUrl("https://example.com/test.jpg", {
        width: 100,
        height: 50,
      }),
    ).toBe(
      "https://cdn.sudburyrowingclub.org.uk/cdn-cgi/image/width=100,height=50/https://example.com/test.jpg",
    );
  });

  it("should build URL with quality", () => {
    expect(
      buildCloudflareImageUrl("https://example.com/test.jpg", {
        width: 100,
        quality: 80,
      }),
    ).toBe(
      "https://cdn.sudburyrowingclub.org.uk/cdn-cgi/image/width=100,quality=80/https://example.com/test.jpg",
    );
  });

  it("should build URL with fit mode", () => {
    expect(
      buildCloudflareImageUrl("https://example.com/test.jpg", {
        width: 100,
        fit: "cover",
      }),
    ).toBe(
      "https://cdn.sudburyrowingclub.org.uk/cdn-cgi/image/width=100,fit=cover/https://example.com/test.jpg",
    );
  });

  it("should build URL with format", () => {
    expect(
      buildCloudflareImageUrl("https://example.com/test.jpg", {
        width: 100,
        format: "webp",
      }),
    ).toBe(
      "https://cdn.sudburyrowingclub.org.uk/cdn-cgi/image/width=100,format=webp/https://example.com/test.jpg",
    );
  });

  it("should handle relative URLs by stripping leading slash", () => {
    expect(buildCloudflareImageUrl("/test.jpg", { width: 100 })).toBe(
      "https://cdn.sudburyrowingclub.org.uk/cdn-cgi/image/width=100/test.jpg",
    );
  });
});

describe("cloudflareLoader", () => {
  it("should work as a Next.js image loader", () => {
    expect(
      cloudflareLoader({ src: "https://example.com/test.jpg", width: 100 }),
    ).toBe(
      "https://cdn.sudburyrowingclub.org.uk/cdn-cgi/image/width=100/https://example.com/test.jpg",
    );
  });

  it("should include quality when provided", () => {
    expect(
      cloudflareLoader({
        src: "https://example.com/test.jpg",
        width: 100,
        quality: 80,
      }),
    ).toBe(
      "https://cdn.sudburyrowingclub.org.uk/cdn-cgi/image/width=100,quality=80/https://example.com/test.jpg",
    );
  });
});
