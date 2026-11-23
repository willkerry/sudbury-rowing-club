import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockEnable, mockEnv, mockRedirect, mockValidate } = vi.hoisted(() => ({
  mockEnable: vi.fn(),
  mockEnv: { SANITY_API_READ_TOKEN: "read-token" as string | undefined },
  mockRedirect: vi.fn((path: string) => {
    throw Object.assign(new Error("NEXT_REDIRECT"), { path });
  }),
  mockValidate: vi.fn(),
}));

vi.mock("@sanity/preview-url-secret", () => ({
  validatePreviewUrl: mockValidate,
}));
vi.mock("next/headers", () => ({
  draftMode: async () => ({ enable: mockEnable }),
}));
vi.mock("next/navigation", () => ({ redirect: mockRedirect }));
vi.mock("@/env", () => ({ env: mockEnv }));
vi.mock("@sudburyrc/api", () => ({
  sanityClient: { withConfig: (config: object) => ({ config }) },
}));

const { GET } = await import("./route");

const request = new Request(
  "https://sudburyrowingclub.org.uk/api/draft-mode/enable?sanity-preview-secret=abc&sanity-preview-pathname=/news",
);

beforeEach(() => {
  vi.clearAllMocks();
  mockEnv.SANITY_API_READ_TOKEN = "read-token";
});

describe("GET /api/draft-mode/enable", () => {
  it("refuses an invalid secret without enabling draft mode", async () => {
    mockValidate.mockResolvedValue({ isValid: false });

    const response = await GET(request);

    expect(response?.status).toBe(401);
    expect(mockEnable).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("refuses when no read token is configured", async () => {
    mockEnv.SANITY_API_READ_TOKEN = undefined;

    const response = await GET(request);

    expect(response?.status).toBe(501);
    expect(mockValidate).not.toHaveBeenCalled();
    expect(mockEnable).not.toHaveBeenCalled();
  });

  it("validates the secret with an uncached, token-bearing client", async () => {
    mockValidate.mockResolvedValue({ isValid: false });

    await GET(request);

    expect(mockValidate).toHaveBeenCalledWith(
      { config: { token: "read-token", useCdn: false } },
      request.url,
    );
  });

  it("enables draft mode and redirects to the previewed page", async () => {
    mockValidate.mockResolvedValue({ isValid: true, redirectTo: "/news" });

    await expect(GET(request)).rejects.toMatchObject({ path: "/news" });
    expect(mockEnable).toHaveBeenCalledOnce();
  });

  it.each(["//evil.example", "https://evil.example"])(
    "redirects home instead of to %s",
    async (redirectTo) => {
      mockValidate.mockResolvedValue({ isValid: true, redirectTo });

      await expect(GET(request)).rejects.toMatchObject({ path: "/" });
    },
  );
});
