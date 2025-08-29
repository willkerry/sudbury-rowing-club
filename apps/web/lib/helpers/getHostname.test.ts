import { describe, expect, it } from "vitest";
import { getHostname } from "@/lib/helpers/getHostname";

describe("getHostname", () => {
  it("should get the hostname from a URL", () => {
    expect(getHostname("https://example.com")).toBe("example.com");
    expect(getHostname("https://example.com/")).toBe("example.com");
    expect(getHostname("https://example.com/test")).toBe("example.com");
    expect(getHostname("https://example.com/test/")).toBe("example.com");
    expect(getHostname("https://example.com/test/test")).toBe("example.com");
    expect(getHostname("https://example.com/test/test/")).toBe("example.com");
    expect(getHostname("https://example.com/test/test?query=value")).toBe(
      "example.com",
    );
    expect(getHostname("https://example.com/test/test?query=value#hash")).toBe(
      "example.com",
    );

    expect(getHostname("example.com")).toBe("example.com");
    expect(getHostname("example.com/")).toBe("example.com");
    expect(getHostname("example.com/test")).toBe("example.com");
    expect(getHostname("example.com/test/")).toBe("example.com");
    expect(getHostname("example.com/test/test")).toBe("example.com");
    expect(getHostname("example.com/test/test/")).toBe("example.com");
    expect(getHostname("example.com/test/test?query=value")).toBe(
      "example.com",
    );
    expect(getHostname("example.com/test/test?query=value#hash")).toBe(
      "example.com",
    );
  });

  it("should handle URLs www subdomain", () => {
    expect(getHostname("https://www.example.com")).toBe("example.com");
  });
});
