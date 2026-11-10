import type {
  ExecutionContext,
  ScheduledController,
} from "@cloudflare/workers-types";
import app from "vinext/server/app-router-entry";
import { pruneExpiredInflightContacts } from "@/lib/server/inflight-store";

// vinext's entry only handles `fetch`; this adds the cron trigger configured
// in wrangler.jsonc.
export default {
  fetch: app.fetch,
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
