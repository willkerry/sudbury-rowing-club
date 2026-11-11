import type { Club } from "@sudburyrc/static/clubs";

/** Served from the Worker's static assets; see `clubsDataAsset` in vite.config.ts. */
export const CLUBS_ASSET_PATH = "/data/clubs.json";

let clubsPromise: Promise<readonly Club[]> | undefined;

const fetchClubsAsset = async (): Promise<readonly Club[]> => {
  const { env } = await import("cloudflare:workers");
  const response = await env.ASSETS.fetch(
    new URL(CLUBS_ASSET_PATH, "https://assets.local"),
  );

  if (!response.ok) {
    throw new Error(`Could not load club data (${response.status})`);
  }

  return response.json();
};

const importClubsData = async (): Promise<readonly Club[]> =>
  (await import("@sudburyrc/static/clubs.json")).default as Club[];

/**
 * Club data, loaded once per server instance. Production reads the static
 * asset so the data stays out of the Worker bundle; dev and tests import it.
 */
export const loadClubs = (): Promise<readonly Club[]> => {
  clubsPromise ??=
    // biome-ignore lint/suspicious/noUndeclaredEnvVars: Vite build-time constant, not a runtime env var
    (import.meta.env.DEV ? importClubsData() : fetchClubsAsset()).catch(
      (error: unknown) => {
        clubsPromise = undefined;
        throw error;
      },
    );

  return clubsPromise;
};
