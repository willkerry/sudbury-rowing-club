import { describe, expect, it } from "vitest";
import { resolveBladeSource } from "@/components/stour/blade/resolveBladeSource";

const SUDBURY_BLADE =
  "https://britishrowing.justgo.com/store/downloadpublic?t=custom&f=media/images/BladeDesign/117191/465.png";

describe("resolveBladeSource", () => {
  it("should look up a club by id", () => {
    expect(resolveBladeSource(465)).toBe(SUDBURY_BLADE);
  });

  it("should look up a club by numeric string id", () => {
    expect(resolveBladeSource("465")).toBe(SUDBURY_BLADE);
  });

  it("should look up a club by boat code, whatever the case", () => {
    expect(resolveBladeSource("SRC")).toBe(SUDBURY_BLADE);
    expect(resolveBladeSource("src")).toBe(SUDBURY_BLADE);
  });

  it("should look up a club by alias code", () => {
    expect(resolveBladeSource("NEP")).toBe(resolveBladeSource("OUL"));
    expect(resolveBladeSource("NEP")).toContain("616.png");
  });

  it("should pass a URL through untouched", () => {
    expect(resolveBladeSource(SUDBURY_BLADE)).toBe(SUDBURY_BLADE);
  });

  it("should pass a root-relative path through untouched", () => {
    expect(resolveBladeSource("/blades/src.png")).toBe("/blades/src.png");
  });

  it("should return null for an unknown code", () => {
    expect(resolveBladeSource("NOT_A_CLUB")).toBeNull();
  });

  it("should return null for an unknown id", () => {
    expect(resolveBladeSource(999999)).toBeNull();
  });

  it.each([null, undefined, ""])("should handle %p", (src) => {
    expect(resolveBladeSource(src)).toBeNull();
  });
});
