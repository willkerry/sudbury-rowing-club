import type { Instrumentation } from "next";
import { whenEnv } from "@/lib/environment";

export const register = () => {};

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
) =>
  whenEnv({
    ifPreview: () => undefined,
    ifProd: async () => {
      const { getPostHogServer } = await import("./posthog-server");
      const posthog = await getPostHogServer();

      const sessionId = request.headers["x-posthog-session-id"];
      const distinctId = request.headers["x-posthog-distinct-id"];

      posthog.captureException(error, distinctId as string | undefined, {
        $session_id: sessionId,
      });
    },
    ifDev: () => undefined,
  });
