import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import { ratelimiter } from "@/lib/rate-limiter";

export const createTRPCContext = cache((opts: { headers: Headers }) => {
  return { headers: opts.headers };
});

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    transformer: superjson,
  });

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;
export const publicProcedure = t.procedure;

const rateLimitMiddleware = t.middleware(async ({ ctx, next }) => {
  const ip = ctx.headers.get("x-forwarded-for");

  if (!ip) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No IP address in request",
    });
  }

  const { success } = await ratelimiter.limit(ip);

  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate limit exceeded",
    });
  }

  return next({ ctx });
});

export const rateLimitedProcedure = publicProcedure.use(rateLimitMiddleware);
