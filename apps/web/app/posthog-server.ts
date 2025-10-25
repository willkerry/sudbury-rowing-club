import { PostHog } from "posthog-node";
import { env } from "@/env";

let ph: PostHog | undefined;

export const getPostHogServer = () => {
  if (!ph) {
    ph = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return ph;
};
