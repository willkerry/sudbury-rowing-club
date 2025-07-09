import { describe, expect, it, vi } from "vitest";
import { cloudflareLoader } from "@/lib/loaders/cloudflare-loader";

describe("loadCloudflareLoader", () => {
  it("should return the correct URL in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(cloudflareLoader({ src: "test.jpg", width: 100 })).toBe("test.jpg");
  });

  it("should return the correct URL in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(cloudflareLoader({ src: "test.jpg", width: 100 })).toBe(
      "https://cdn.sudburyrowingclub.org.uk/cdn-cgi/image/width=100/test.jpg",
    );
  });

  it("should return the correct URL with quality", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(cloudflareLoader({ src: "test.jpg", width: 100, quality: 80 })).toBe(
      "https://cdn.sudburyrowingclub.org.uk/cdn-cgi/image/width=100,quality=80/test.jpg",
    );
  });

  it("should handle relative URLs", () => {
    expect(cloudflareLoader({ src: "/test.jpg", width: 100 })).toBe(
      "https://cdn.sudburyrowingclub.org.uk/cdn-cgi/image/width=100/test.jpg",
    );
  });
});
