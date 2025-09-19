import type { Instrumentation } from "next";
import type { PostHog } from "posthog-node";

export const register = () => {};

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
) => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getPostHogServer } = require("./app/posthog-server");
    const posthog: PostHog = await getPostHogServer();

    const sessionId = request.headers["x-posthog-session-id"];
    const distinctId = request.headers["x-posthog-distinct-id"];

    posthog.captureException(error, distinctId as string | undefined, {
      $session_id: sessionId,
    });
  }
};
