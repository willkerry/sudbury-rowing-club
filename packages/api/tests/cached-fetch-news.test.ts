import { afterEach, describe, expect, it, vi } from "vitest";

vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test1234");
vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");

const { fetchAllArticles } = vi.hoisted(() => ({
  fetchAllArticles: vi.fn(),
}));

vi.mock("../src/queries/fetch-news-article", async (importOriginal) => ({
  ...(await importOriginal()),
  fetchAllArticles,
}));

const { configureDraftMode, resetDraftMode } =
  await import("../src/sanity/client");
const { serverGetArticleBySlug } =
  await import("../src/queries/cached-fetch-news");

afterEach(() => {
  resetDraftMode();
  vi.clearAllMocks();
});

const article = (title: string) => ({ slug: "regatta-report", title });

describe("serverGetArticleBySlug", () => {
  it("keeps draft articles out of the cache public requests share", async () => {
    fetchAllArticles.mockResolvedValue([article("Published")]);
    expect(await serverGetArticleBySlug("regatta-report")).toMatchObject({
      title: "Published",
    });

    configureDraftMode({
      isEnabled: async () => true,
      studioUrl: "https://edit.example.org",
      token: "secret-token",
    });
    fetchAllArticles.mockResolvedValue([article("Draft")]);
    expect(await serverGetArticleBySlug("regatta-report")).toMatchObject({
      title: "Draft",
    });

    resetDraftMode();
    expect(await serverGetArticleBySlug("regatta-report")).toMatchObject({
      title: "Published",
    });
    expect(fetchAllArticles).toHaveBeenCalledTimes(2);
  });
});
