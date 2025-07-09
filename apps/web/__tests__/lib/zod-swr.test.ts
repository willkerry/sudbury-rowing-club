import { waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { useZodSWR } from "@/lib/zod-swr";
import { renderHook } from "../__utils__/renderHook";

const testSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

const stringSchema = z.string();

const validData = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
};

const invalidData = {
  id: "invalid", // should be number
  name: "John Doe",
  email: "invalid-email", // should be valid email
};

describe("useZodSWR", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully fetch and validate data with correct schema", async () => {
    const mockFetcher = vi.fn().mockResolvedValue(validData);

    const { result } = renderHook(() =>
      useZodSWR(testSchema, ["test-key"], mockFetcher),
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(validData);
    expect(result.current.error).toBeNull();
    expect(result.current.isSuccess).toBe(true);
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it("should throw error when data does not match schema", async () => {
    const mockFetcher = vi.fn().mockResolvedValue(invalidData);

    const { result } = renderHook(() =>
      useZodSWR(testSchema, ["invalid-data-key"], mockFetcher),
    );

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Data do not match the schema.");
    expect(result.current.data).toBeUndefined();
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it("should handle fetcher errors", async () => {
    const fetchError = new Error("Network error");
    const mockFetcher = vi.fn().mockRejectedValue(fetchError);

    const { result } = renderHook(() =>
      useZodSWR(testSchema, ["error-key"], mockFetcher),
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(fetchError);
    expect(result.current.data).toBeUndefined();
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it("should handle null data without validation error", async () => {
    const mockFetcher = vi.fn().mockResolvedValue(null);

    const { result } = renderHook(() =>
      useZodSWR(testSchema, ["null-key"], mockFetcher),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it("should handle undefined data as an error", async () => {
    const mockFetcher = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useZodSWR(testSchema, ["undefined-key"], mockFetcher),
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it("should work with simple string schema", async () => {
    const testString = "Hello, World!";
    const mockFetcher = vi.fn().mockResolvedValue(testString);

    const { result } = renderHook(() =>
      useZodSWR(stringSchema, ["string-key"], mockFetcher),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe(testString);
    expect(result.current.error).toBeNull();
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it("should work with array schema", async () => {
    const arraySchema = z.array(testSchema);
    const arrayData = [validData, { ...validData, id: 2, name: "Jane Doe" }];
    const mockFetcher = vi.fn().mockResolvedValue(arrayData);

    const { result } = renderHook(() =>
      useZodSWR(arraySchema, ["array-key"], mockFetcher),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(arrayData);
    expect(result.current.error).toBeNull();
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it("should pass through additional react-query options", () => {
    const mockFetcher = vi.fn().mockResolvedValue(validData);

    const { result } = renderHook(() =>
      useZodSWR(testSchema, ["options-key"], mockFetcher, {
        enabled: false,
        staleTime: 5000,
      }),
    );

    // Should not fetch because enabled is false
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
    expect(mockFetcher).not.toHaveBeenCalled();
  });

  it("should return all useQuery properties", async () => {
    const mockFetcher = vi.fn().mockResolvedValue(validData);

    const { result } = renderHook(() =>
      useZodSWR(testSchema, ["properties-key"], mockFetcher),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Check that all expected useQuery properties are present
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("isSuccess");
    expect(result.current).toHaveProperty("isFetching");
    expect(result.current).toHaveProperty("refetch");
    expect(result.current).toHaveProperty("status");
  });

  it("should handle complex nested schemas", async () => {
    const nestedSchema = z.object({
      user: z.object({
        id: z.number(),
        profile: z.object({
          firstName: z.string(),
          lastName: z.string(),
          preferences: z.object({
            theme: z.enum(["light", "dark"]),
            notifications: z.boolean(),
          }),
        }),
      }),
      metadata: z.object({
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
    });

    const nestedData = {
      user: {
        id: 1,
        profile: {
          firstName: "John",
          lastName: "Doe",
          preferences: {
            theme: "dark" as const,
            notifications: true,
          },
        },
      },
      metadata: {
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-02T00:00:00Z",
      },
    };

    const mockFetcher = vi.fn().mockResolvedValue(nestedData);

    const { result } = renderHook(() =>
      useZodSWR(nestedSchema, ["nested-key"], mockFetcher),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(nestedData);
    expect(result.current.error).toBeNull();
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });
});
