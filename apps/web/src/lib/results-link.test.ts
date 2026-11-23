import { describe, expect, it } from "vitest";
import { withReturnPath } from "@/lib/results-link";

describe("withReturnPath", () => {
  it("adds the return path to results archive links", () => {
    expect(
      withReturnPath(
        "https://results.sudburyrowingclub.org.uk/regatta2025/",
        "/regatta/results",
      ),
    ).toBe(
      "https://results.sudburyrowingclub.org.uk/regatta2025/?from=%2Fregatta%2Fresults",
    );
  });

  it("leaves other links alone", () => {
    expect(withReturnPath("https://example.com/", "/regatta/results")).toBe(
      "https://example.com/",
    );
    expect(withReturnPath("/results/regatta2010/", "/regatta/results")).toBe(
      "/results/regatta2010/",
    );
  });
});
