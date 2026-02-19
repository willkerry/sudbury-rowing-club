import { PostHog } from "posthog-node";
import { env } from "@/env";

let ph: PostHog | undefined;

export const getPostHogServer = () => {
  if (!ph) {
    ph = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
      flushAt: 1,
      flushInterval: 0,
      host: env.NEXT_PUBLIC_POSTHOG_HOST,
    });
  }

  return ph;
};
