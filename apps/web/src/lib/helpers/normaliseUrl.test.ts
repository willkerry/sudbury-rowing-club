import { describe, expect, it } from "vitest";
import { normaliseUrl } from "./normaliseUrl";

describe("normaliseUrl", () => {
  describe("valid URLs", () => {
    it("should accept URLs with https protocol", () => {
      expect(normaliseUrl("https://example.com")).toBe("https://example.com");
      expect(normaliseUrl("https://britishrowing.org/events")).toBe(
        "https://britishrowing.org/events",
      );
    });

    it("should accept URLs with http protocol", () => {
      expect(normaliseUrl("http://example.com")).toBe("http://example.com");
    });

    it("should add https:// to domain-only URLs", () => {
      expect(normaliseUrl("example.com")).toBe("https://example.com");
      expect(normaliseUrl("peterboroughcityrowingclub.org.uk")).toBe(
        "https://peterboroughcityrowingclub.org.uk",
      );
      expect(normaliseUrl("subdomain.example.com")).toBe(
        "https://subdomain.example.com",
      );
    });

    it("should handle domains with hyphens", () => {
      expect(normaliseUrl("my-rowing-club.org.uk")).toBe(
        "https://my-rowing-club.org.uk",
      );
    });

    it("should handle domains with numbers", () => {
      expect(normaliseUrl("rowing123.com")).toBe("https://rowing123.com");
    });

    it("should trim whitespace", () => {
      expect(normaliseUrl("  example.com  ")).toBe("https://example.com");
      expect(normaliseUrl("\texample.com\n")).toBe("https://example.com");
    });
  });

  describe("invalid inputs", () => {
    it("should reject null and undefined", () => {
      expect(normaliseUrl(null)).toBeNull();
      expect(normaliseUrl(undefined)).toBeNull();
    });

    it("should reject empty strings", () => {
      expect(normaliseUrl("")).toBeNull();
      expect(normaliseUrl("   ")).toBeNull();
    });

    it("should reject common placeholder values", () => {
      expect(normaliseUrl("TBC")).toBeNull();
      expect(normaliseUrl("tbc")).toBeNull();
      expect(normaliseUrl("TBA")).toBeNull();
      expect(normaliseUrl("N/A")).toBeNull();
      expect(normaliseUrl("xxx")).toBeNull();
      expect(normaliseUrl("XXX")).toBeNull();
      expect(normaliseUrl("pending")).toBeNull();
      expect(normaliseUrl("unknown")).toBeNull();
      expect(normaliseUrl("none")).toBeNull();
    });

    it("should reject strings without dots", () => {
      expect(normaliseUrl("notadomain")).toBeNull();
      expect(normaliseUrl("localhost")).toBeNull();
    });

    it("should reject invalid characters", () => {
      expect(normaliseUrl("example com")).toBeNull(); // space
      expect(normaliseUrl("example@com")).toBeNull(); // @ sign
    });

    it("should reject non-http protocols", () => {
      expect(normaliseUrl("ftp://example.com")).toBeNull();
      expect(normaliseUrl("javascript:alert('xss')")).toBeNull();
      expect(normaliseUrl("file:///etc/passwd")).toBeNull();
    });

    it("should reject just dots or dashes", () => {
      expect(normaliseUrl("...")).toBeNull();
      expect(normaliseUrl("---")).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("should handle domains with paths", () => {
      expect(normaliseUrl("example.com/events/123")).toBe(
        "https://example.com/events/123",
      );
    });

    it("should handle domains with query params", () => {
      expect(normaliseUrl("example.com?event=123")).toBe(
        "https://example.com?event=123",
      );
    });

    it("should handle domains with fragments", () => {
      expect(normaliseUrl("example.com#section")).toBe(
        "https://example.com#section",
      );
    });

    it("should handle multiple subdomains", () => {
      expect(normaliseUrl("www.events.rowing.org.uk")).toBe(
        "https://www.events.rowing.org.uk",
      );
    });
  });

  describe("real-world examples from British Rowing", () => {
    it("should normalise partial rowing club URLs", () => {
      expect(normaliseUrl("peterboroughcityrowingclub.org.uk")).toBe(
        "https://peterboroughcityrowingclub.org.uk",
      );
      expect(normaliseUrl("britishrowing.org")).toBe(
        "https://britishrowing.org",
      );
    });

    it("should keep complete URLs unchanged", () => {
      expect(
        normaliseUrl("https://britishrowing.org/events/head-of-the-river"),
      ).toBe("https://britishrowing.org/events/head-of-the-river");
    });

    it("should reject placeholder entries", () => {
      expect(normaliseUrl("TBC")).toBeNull();
      expect(normaliseUrl("N/A")).toBeNull();
    });
  });
});
