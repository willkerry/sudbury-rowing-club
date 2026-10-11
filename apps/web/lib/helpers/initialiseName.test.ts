import { describe, expect, it } from "vitest";
import { initialiseName, monogramName } from "@/lib/helpers/initialiseName";

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

describe("monogramName", () => {
  it("should take the first forename and surname initials", () => {
    expect(monogramName("John Smith")).toBe("JS");
    expect(monogramName("John Paul Smith")).toBe("JS");
    expect(monogramName("John Smith+Jones")).toBe("JS");
  });

  it("should handle names that don't abbreviate to their first letter", () => {
    expect(monogramName("Tricia Smith")).toBe("PS");
  });
});
