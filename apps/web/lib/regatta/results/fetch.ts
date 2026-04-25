/**
 * Fetches regatta HTML from the public GitHub mirror. The legacy Windows
 * scoring software uploads to Hostinger over FTP; a cron job mirrors that
 * directory into `willkerry/regatta-live-state` on GitHub; we consume
 * `raw.githubusercontent.com`.
 */

import { env } from "@/env";

const REPO = env.REGATTA_STATE_REPO ?? "willkerry/regatta-live-state";
const BRANCH = env.REGATTA_STATE_BRANCH ?? "main";

export const REGATTA_REVALIDATE_TAG = "regatta";

export type RegattaUpstream =
  | { status: "ok"; bytes: ArrayBuffer; contentType: string | null }
  | { status: "not-found" }
  | { status: "error"; upstreamStatus: number };

/**
 * Fetch a file from the regatta-live-state repo by its repo-relative path.
 * Returns raw bytes so the caller can decode with an appropriate charset –
 * the legacy software emits ISO-8859-1, not UTF-8.
 */
export async function fetchRegattaFile(
  relativePath: string,
): Promise<RegattaUpstream> {
  const upstream = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${relativePath}`;
  const res = await fetch(upstream, {
    next: { revalidate: 60, tags: [REGATTA_REVALIDATE_TAG] },
  });

  if (res.status === 404) return { status: "not-found" };
  if (!res.ok) return { status: "error", upstreamStatus: res.status };

  const bytes = await res.arrayBuffer();

  return {
    status: "ok",
    bytes,
    contentType: res.headers.get("content-type"),
  };
}

/**
 * Decode an HTML byte buffer into a string. The legacy software writes in
 * ISO-8859-1 (Windows-1252 adjacent).
 */
export function decodeHtml(bytes: ArrayBuffer, charset = "iso-8859-1"): string {
  return new TextDecoder(charset).decode(bytes);
}
