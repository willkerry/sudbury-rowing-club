import { PostHog } from "posthog-node";
import invariant from "tiny-invariant";

let ph: PostHog | undefined;

export const getPostHogServer = () => {
  invariant(
    process.env.NEXT_PUBLIC_POSTHOG_KEY,
    "NEXT_PUBLIC_POSTHOG_KEY is not set",
  );

  if (!ph) {
    ph = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return ph;
};
