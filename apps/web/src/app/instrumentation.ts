import type { Instrumentation } from "next";
import { whenEnv } from "@/lib/environment";

export const register = () => {};

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
) =>
  whenEnv({
    ifDev: () => undefined,
    ifPreview: () => undefined,
    ifProd: async () => {
      const { getPostHogServer } = await import("./posthog-server");
      const posthog = await getPostHogServer();

      const header = (name: string) => {
        const value = request.headers[name];

        return typeof value === "string" ? value : undefined;
      };

      posthog.captureException(error, {
        distinctId: header("x-posthog-distinct-id"),
        properties: { $session_id: header("x-posthog-session-id") },
      });
    },
  });
