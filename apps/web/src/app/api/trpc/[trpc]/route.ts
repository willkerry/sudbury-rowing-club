import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { trackServerException } from "@/lib/server/track";
import {
  getCacheHeaders,
  getProcedureCacheSeconds,
} from "@/lib/trpc/cache-control";
import { withEdgeCache } from "@/lib/trpc/edge-cache";
import { createTRPCContext } from "@/lib/trpc/init";
import { appRouter } from "@/lib/trpc/router";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
    onError: ({ error }) => trackServerException(error),
    responseMeta: ({ eagerGeneration, errors, info, type }) => {
      const headers = getCacheHeaders({
        cacheSeconds: (info?.calls ?? []).map((call) =>
          getProcedureCacheSeconds(call.procedure?._def.meta),
        ),
        eagerGeneration,
        hasErrors: errors.length > 0,
        type,
      });

      return headers ? { headers } : {};
    },
  });

const cachedHandler = withEdgeCache(handler);

export { cachedHandler as GET, handler as POST };
