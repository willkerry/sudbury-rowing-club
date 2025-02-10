import { expect, test } from "vitest";
import { clampString } from "../src/clampString";

test("clampString", () => {
  // Should return the original string if it's shorter than the limit
  expect(clampString("hello", 10)).toBe("hello");
  expect(clampString("", 5)).toBe("");

  // Should clamp strings that are longer than the limit
  expect(clampString("hello world", 5)).toBe("hell…");
  expect(clampString("hello world", 8)).toBe("hello w…");

  // Should handle exact length
  expect(clampString("hello", 5)).toBe("hello");

  // Should handle spaces
  expect(clampString("hello world", 6)).toBe("hello…");
});
