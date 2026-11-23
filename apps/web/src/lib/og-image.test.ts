import { describe, expect, it, vi } from "vitest";
import { makeShareImageURL } from "@/lib/og-image";

vi.mock("@/env", () => ({
  env: { OG_IMAGE_SECRET: "test-secret-that-is-at-least-32-characters" },
}));

const SIGNED_RELATIVE_URL = /^\/api\/og\?title=Test\+Title&sig=[\w-]+$/;
const SIGNED_ABSOLUTE_URL =
  /^https:\/\/sudburyrowingclub\.org\.uk\/api\/og\?title=Test\+Title&sig=[\w-]+$/;

describe("makeShareImageURL", () => {
  it("returns a signed relative URL", () => {
    expect(makeShareImageURL("Test Title")).toMatch(SIGNED_RELATIVE_URL);
  });

  it("returns a signed absolute URL", () => {
    expect(makeShareImageURL("Test Title", true)).toMatch(SIGNED_ABSOLUTE_URL);
  });

  it("omits default options", () => {
    expect(
      makeShareImageURL("Test Title", false, { subtitle: "", variant: "blue" }),
    ).toMatch(SIGNED_RELATIVE_URL);
  });
});
