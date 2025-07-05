import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import useFilter from "@/hooks/useFilter";

describe("useFilter", () => {
  it("should return the correct filter", () => {
    const { result } = renderHook(() =>
      useFilter([{ test: "test" }], "test", "test"),
    );

    expect(result.current).toEqual([{ test: "test" }]);
  });
});
