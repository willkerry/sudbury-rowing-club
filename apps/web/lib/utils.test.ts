import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("should return the correct class name", () => {
    expect(cn("test", "test2")).toBe("test test2");
  });
});
