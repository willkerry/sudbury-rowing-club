// @vitest-environment node
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { unstable_readConfig } from "wrangler";
import { z } from "zod";
import { clientSchema, serverSchema } from "./env.schema";

const client = z.object(clientSchema);

const VALID_PUBLIC_ENV = {
  NEXT_PUBLIC_ALGOLIA_APP_ID: "29FJURULSW",
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME: "news",
  NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: "00e0a3d56005e16db7f6bc784430d3d7",
  NEXT_PUBLIC_MAPTILER_KEY: "q3gbdmFDPGft7ylWLC6u",
  NEXT_PUBLIC_POSTHOG_HOST: "https://eu.i.posthog.com",
  NEXT_PUBLIC_POSTHOG_KEY: "phc_example",
  NEXT_PUBLIC_SANITY_DATASET: "production",
  NEXT_PUBLIC_SANITY_PROJECT_ID: "gvxge7ps",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "0x4AAAAAAABEmh64tTgJ_7WE",
};

describe("clientSchema", () => {
  it("accepts bare values", () => {
    expect(client.safeParse(VALID_PUBLIC_ENV).success).toBe(true);
  });

  it("rejects a missing value", () => {
    const { NEXT_PUBLIC_POSTHOG_KEY: _, ...env } = VALID_PUBLIC_ENV;

    expect(client.safeParse(env).success).toBe(false);
  });

  it.each([
    ["NEXT_PUBLIC_SANITY_PROJECT_ID", '"gvxge7ps"'],
    ["NEXT_PUBLIC_SANITY_DATASET", "'production'"],
    ["NEXT_PUBLIC_ALGOLIA_APP_ID", "29FJURULSW\n"],
    ["NEXT_PUBLIC_POSTHOG_HOST", "eu.i.posthog.com"],
    ["NEXT_PUBLIC_MAPTILER_KEY", ""],
  ])("rejects %s set to %j", (key, value) => {
    expect(
      client.safeParse({ ...VALID_PUBLIC_ENV, [key]: value }).success,
    ).toBe(false);
  });
});

describe("wrangler.jsonc secrets.required", () => {
  it("lists exactly the server secrets env.ts validates", () => {
    const config = unstable_readConfig({
      config: fileURLToPath(new URL("./wrangler.jsonc", import.meta.url)),
    });

    expect([...(config.secrets?.required ?? [])].sort()).toEqual(
      Object.keys(serverSchema).sort(),
    );
  });
});
