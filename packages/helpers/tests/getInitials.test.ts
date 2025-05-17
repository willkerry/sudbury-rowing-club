import { expect, test } from "vitest";
import { getInitials } from "../src/getInitials";

test("getInitials", () => {
  // Basic cases
  expect(getInitials("John Smith")).toBe("JS");
  expect(getInitials("Jane Mary Smith")).toBe("JMS");

  // Edge cases
  expect(getInitials("")).toBe("");
  expect(getInitials(" ")).toBe("");
  expect(getInitials("John")).toBe("J");

  // Should handle extra spaces
  expect(getInitials("John  Smith")).toBe("JS");
  expect(getInitials(" John Smith ")).toBe("JS");

  // Should handle lowercase
  expect(getInitials("john smith")).toBe("JS");

  // Should handle hyphenated names
  expect(getInitials("Mary-Jane Smith")).toBe("MJS");
});
