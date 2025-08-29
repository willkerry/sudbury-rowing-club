import { describe, expect, it } from "vitest";
import { makeShareImageURL } from "@/lib/og-image";

describe("makeShareImageURL", () => {
  it("should return the correct URL", () => {
    expect(makeShareImageURL("Test Title")).toBe("/api/og?title=Test+Title");
  });

  it("should return the correct URL with absolute", () => {
    expect(makeShareImageURL("Test Title", true)).toBe(
      "https://sudburyrowingclub.org.uk/api/og?title=Test+Title",
    );
  });
});
