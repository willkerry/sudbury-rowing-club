import type {
  ExecutionContext,
  ScheduledController,
} from "@cloudflare/workers-types";
import app from "vinext/server/app-router-entry";
import { pruneExpiredInflightContacts } from "@/lib/server/inflight-store";

const WWW_PREFIX = "www.";

// vinext's entry only handles `fetch`; this adds the www-to-apex redirect for
// the custom domains and the cron trigger configured in wrangler.jsonc.
export default {
  fetch: (...args: Parameters<typeof app.fetch>) => {
    const [request] = args;
    const url = new URL(request.url);

    if (url.hostname.startsWith(WWW_PREFIX)) {
      url.hostname = url.hostname.slice(WWW_PREFIX.length);

      return Response.redirect(url.toString(), 308);
    }

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
