/**
 * Raw pass-through proxy for regatta HTML.
 *
 * Serves the unmodified bytes of a file in the regatta-live-state repo. Kept
 * available at `/live/raw/*` as a fallback for the operator ("did my upload
 * arrive intact?") and for our own debugging. End users are served the
 * shell-wrapped, sanitised version at `/live/*` instead.
 */

import type { NextRequest } from "next/server";
import { env } from "@/env";

const REPO = env.REGATTA_STATE_REPO ?? "willkerry/regatta-live-state";
const BRANCH = env.REGATTA_STATE_BRANCH ?? "main";

const MIME: Record<string, string> = {
  css: "text/css; charset=iso-8859-1",
  gif: "image/gif",
  htm: "text/html; charset=iso-8859-1",
  html: "text/html; charset=iso-8859-1",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  pdf: "application/pdf",
  png: "image/png",
  svg: "image/svg+xml",
  txt: "text/plain; charset=utf-8",
  webp: "image/webp",
  xml: "application/xml; charset=utf-8",
};

function mimeFor(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";

  return MIME[ext] ?? "application/octet-stream";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await params;
  const relative = path.length === 0 ? "index.html" : path.join("/");
  const upstream = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${relative}`;

  const upstreamRes = await fetch(upstream, {
    next: { revalidate: 60, tags: ["regatta"] },
  });

  if (upstreamRes.status === 404) {
    return new Response("Not found", { status: 404 });
  }
  if (!upstreamRes.ok) {
    return new Response("Upstream error", { status: 502 });
  }

  return new Response(upstreamRes.body, {
    status: 200,
    headers: {
      "cache-control": "public, s-maxage=60, stale-while-revalidate=600",
      "content-type": mimeFor(relative),
      "x-regatta-source": `${REPO}@${BRANCH}`,
    },
  });
}
