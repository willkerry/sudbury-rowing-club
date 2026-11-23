import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type BundleSize = { gzip_bytes: number; raw_bytes: number };

export type Url = string | { url?: string; hostname?: string };

export type WranglerEntry = {
  bundle_size?: BundleSize;
  deployment_id?: string;
  deployment_urls?: Url[];
  preview_alias_url?: string;
  preview_url?: string;
  preview_urls?: Url[];
  timestamp?: string;
  type: string;
  version_id?: string;
  worker_name?: string | null;
};

export const wranglerEntries = (): WranglerEntry[] => {
  const dir = process.env.WRANGLER_OUTPUT_FILE_DIRECTORY;
  if (!(dir && existsSync(dir))) return [];

  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .flatMap((name) =>
      readFileSync(join(dir, name), "utf8")
        .split("\n")
        .filter(Boolean)
        .map((line): WranglerEntry => JSON.parse(line)),
    )
    .sort(
      (a, b) => Date.parse(a.timestamp ?? "0") - Date.parse(b.timestamp ?? "0"),
    );
};

const toUrl = (url: Url) =>
  typeof url === "string"
    ? url
    : (url.url ?? (url.hostname && `https://${url.hostname}`));

export const allUrls = (urls: Url[] | undefined) =>
  (urls ?? []).map(toUrl).filter((url) => url !== undefined);

export const isWorkersDev = (url: string) => url.includes(".workers.dev");

export const firstUrl = (urls: Url[] | undefined) => {
  const all = allUrls(urls);

  return all.find((url) => !isWorkersDev(url)) ?? all[0];
};
