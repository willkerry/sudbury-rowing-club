import { getPostHogServer } from "@/app/posthog-server";
import { whenEnv } from "../environment";

/**
 * Captures a server-side PostHog event in production only.
 * Uses "server" as the distinctId to separate from user analytics.
 */
export const trackServerEvent = (
  event: string,
  properties?: Record<string, unknown>,
) =>
  whenEnv({
    ifPreview: () => undefined,
    ifProd: () => {
      const posthog = getPostHogServer();

      posthog.capture({
        distinctId: "server",
        event,
        properties,
      });
    },
    ifDev: () => undefined,
  });

/**
 * Captures a server-side exception in production only.
 */
export const trackServerException = (error: unknown) => {
  whenEnv({
    ifPreview: () => undefined,
    ifProd: () => {
      const posthog = getPostHogServer();

      posthog.captureException(error, "server");
    },
    ifDev: () => undefined,
  });
};
