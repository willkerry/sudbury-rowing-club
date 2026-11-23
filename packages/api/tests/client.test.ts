import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { z } from "zod";

vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test1234");
vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");

type ClientModule = typeof import("../src/sanity/client");
let api: ClientModule;

beforeAll(async () => {
  api = await import("../src/sanity/client");
});

afterEach(() => {
  api.resetDraftMode();
  vi.restoreAllMocks();
});

const configure = (enabled: boolean) =>
  api.configureDraftMode({
    isEnabled: async () => enabled,
    studioUrl: "https://edit.example.org",
    token: "secret-token",
  });

describe("getClient", () => {
  it("uses the public client before draft mode is configured", async () => {
    expect(await api.getClient()).toBe(api.sanityClient);
    expect(await api.isDraftMode()).toBe(false);
  });

  it("uses the public client when the request isn't in draft mode", async () => {
    configure(false);

    expect(await api.getClient()).toBe(api.sanityClient);
  });

  it("uses an uncached, token-bearing drafts client in draft mode", async () => {
    configure(true);

    const client = await api.getClient();
    const config = client.config();

    expect(client).not.toBe(api.sanityClient);
    expect(config.perspective).toBe("drafts");
    expect(config.useCdn).toBe(false);
    expect(config.token).toBe("secret-token");
    expect(config.stega.enabled).toBe(true);
  });

  it("leaves the public client without a token or drafts", async () => {
    configure(true);
    await api.getClient();

    const config = api.sanityClient.config();

    expect(config.token).toBeUndefined();
    expect(config.useCdn).toBe(true);
    expect(config.perspective).not.toBe("drafts");
  });
});

describe("sanityFetch", () => {
  const ZDoc = z.object({
    status: z.enum(["green", "red"]),
    title: z.string(),
  });

  type Config = { perspective?: unknown; stega: { enabled?: boolean } };

  const mockFetch = (respond: (config: Config) => unknown) =>
    vi
      .spyOn(Object.getPrototypeOf(api.sanityClient), "fetch")
      .mockImplementation(async function (this: typeof api.sanityClient) {
        return respond(this.config() as Config);
      });

  it("parses public results and lets validation errors through", async () => {
    const fetch = mockFetch(() => ({ status: "amber", title: "Live" }));

    await expect(api.sanityFetch("*", ZDoc.parse)).rejects.toThrow();
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("returns a valid draft as is", async () => {
    configure(true);
    mockFetch(() => ({ status: "red", title: "Draft" }));

    expect(await api.sanityFetch("*", ZDoc.parse)).toEqual({
      status: "red",
      title: "Draft",
    });
  });

  it("retries a draft without stega when encoding breaks validation", async () => {
    configure(true);
    mockFetch((config) =>
      config.stega.enabled
        ? { status: "red​", title: "Draft" }
        : { status: "red", title: "Draft" },
    );

    expect(await api.sanityFetch("*", ZDoc.parse)).toEqual({
      status: "red",
      title: "Draft",
    });
  });

  it("falls back to the published document when a draft is incomplete", async () => {
    configure(true);
    mockFetch((config) =>
      config.perspective === "drafts"
        ? { status: "red" }
        : { status: "green", title: "Published" },
    );

    expect(await api.sanityFetch("*", ZDoc.parse)).toEqual({
      status: "green",
      title: "Published",
    });
  });
});
