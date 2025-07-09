import { QueryClient, useQuery } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { renderHook } from "./renderHook";

describe("renderHook utility", () => {
  it("should provide QueryClient by default", () => {
    const { result } = renderHook(() =>
      useQuery({
        queryKey: ["test"],
        queryFn: () => Promise.resolve("test data"),
      }),
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("should allow custom QueryClient configuration", () => {
    const customQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 3, // Different from default
          staleTime: 10000,
        },
      },
    });

    const { result } = renderHook(
      () =>
        useQuery({
          queryKey: ["test"],
          queryFn: () => Promise.resolve("test data"),
        }),
      {
        queryClient: customQueryClient,
      },
    );

    // The hook should use the custom QueryClient
    expect(result.current).toBeDefined();
    expect(result.current.isLoading).toBe(true);
  });

  it("should handle initial props correctly", () => {
    const testHook = (props: { value: string }) => {
      return { value: props.value.toUpperCase() };
    };

    const { result } = renderHook(testHook, {
      initialProps: { value: "hello" },
    });

    expect(result.current.value).toBe("HELLO");
  });
});
