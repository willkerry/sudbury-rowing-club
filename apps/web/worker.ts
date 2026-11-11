import { env } from "cloudflare:workers";
import type {
  ExecutionContext,
  ScheduledController,
} from "@cloudflare/workers-types";
import app from "vinext/server/app-router-entry";
import { pruneExpiredInflightContacts } from "@/lib/server/inflight-store";
import { verifyShareImage } from "@/lib/server/share-image-signature";
import { toShareImageParams } from "@/lib/share-image";

const WWW_PREFIX = "www.";
const OG_IMAGE_PATH = "/api/og";

const forwardShareImage = (request: Request, url: URL) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405 });
  }

  const image = verifyShareImage(url.searchParams, env.OG_IMAGE_SECRET);

  if (!image) {
    return new Response("Invalid share image signature", { status: 403 });
  }

  const target = new URL(OG_IMAGE_PATH, url.origin);
  target.search = toShareImageParams(image).toString();

  return env.OG.fetch(target.toString());
};

// vinext's entry only handles `fetch`; this adds the www-to-apex redirect for
// the custom domains, the OG image hand-off, and the cron trigger configured
// in wrangler.jsonc.
export default {
  fetch: (...args: Parameters<typeof app.fetch>) => {
    const [request] = args;
    const url = new URL(request.url);

    if (url.hostname.startsWith(WWW_PREFIX)) {
      url.hostname = url.hostname.slice(WWW_PREFIX.length);

      return Response.redirect(url.toString(), 308);
    }

    if (url.pathname === OG_IMAGE_PATH) return forwardShareImage(request, url);

    return app.fetch(...args);
  },
  scheduled: (
    _controller: ScheduledController,
    _env: unknown,
    ctx: ExecutionContext,
  ) => {
    ctx.waitUntil(
      pruneExpiredInflightContacts().then((deleted) => {
        console.log(`Pruned ${deleted} expired in-flight contact(s)`);
      }),
    );
  },
};
