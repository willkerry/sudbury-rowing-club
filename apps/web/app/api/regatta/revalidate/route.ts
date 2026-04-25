/**
 * Webhook endpoint hit by GitHub when a new commit lands on the
 * regatta-live-state repo. Verifies the HMAC-SHA256 signature GitHub signs
 * the payload with, then punches the "regatta" cache tag so the next
 * request to /live/* fetches fresh upstream content.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { env } from "@/env";
import { REGATTA_REVALIDATE_TAG } from "@/lib/regatta/results";

export async function POST(req: NextRequest) {
  const secret = env.REGATTA_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Not configured", { status: 500 });
  }

  const signature = req.headers.get("x-hub-signature-256");
  if (!signature) {
    return new Response("Missing signature", { status: 401 });
  }

  const body = await req.text();
  const expected = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;

  const received = Buffer.from(signature);
  const computed = Buffer.from(expected);
  if (
    received.length !== computed.length ||
    !timingSafeEqual(received, computed)
  ) {
    return new Response("Bad signature", { status: 401 });
  }

  if (req.headers.get("x-github-event") !== "push") {
    return new Response("Ignored", { status: 200 });
  }

  // Next 16 requires a cacheLife profile; "default" is fine here –
  // the route's own `revalidate` setting drives ongoing freshness, this
  // call just triggers an immediate re-fetch on the next request.
  revalidateTag(REGATTA_REVALIDATE_TAG, "default");

  return Response.json({ at: Date.now(), revalidated: true });
}
