import { describe, it, expect } from "vitest";
import { initialiseName } from "@/lib/helpers/initialiseName";

describe("initialiseName", () => {
  it("should initialise a name", () => {
    expect(initialiseName("John Smith")).toBe("J Smith");
    expect(initialiseName("John Smith+Jones")).toBe("J Smith Jones");
    expect(initialiseName("John Smith+Jones+Smith")).toBe(
      "J Smith Jones Smith",
    );
  });

  it("should handle names that don't abbreviate to their first letter", () => {
    expect(initialiseName("Tricia Smith")).toBe("P Smith");
    expect(initialiseName("Tricia Smith+Jones")).toBe("P Smith Jones");
    expect(initialiseName("Tricia Smith+Jones+Smith")).toBe(
      "P Smith Jones Smith",
    );
  });
});
