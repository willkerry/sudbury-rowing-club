import { describe, expect, it } from "bun:test";
import { createSlugger } from "./slug";

const placeholderPattern = /^notice-/;

describe("createSlugger", () => {
  it("slugifies titles", () => {
    const s = createSlugger();
    expect(s("Hello, World!")).toBe("hello-world");
  });

  it("dedupes by appending -2, -3, ...", () => {
    const s = createSlugger();
    expect(s("Notice")).toBe("notice");
    expect(s("Notice")).toBe("notice-2");
    expect(s("Notice")).toBe("notice-3");
  });

  it("falls back to a placeholder for empty results", () => {
    const s = createSlugger();
    expect(s("???")).toMatch(placeholderPattern);
  });
});
