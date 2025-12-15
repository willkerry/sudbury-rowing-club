import { usePostHog } from "posthog-js/react";
import { useEffect, useRef } from "react";

type LoadStatus = "pending" | "success" | "error";

type TrackLoadTimeOptions = {
  /** The event name to capture on success */
  successEvent: string;
  /** The event name to capture on error */
  errorEvent: string;
  /** Additional properties to include with the success event */
  successProperties?: Record<string, unknown>;
  /** The error object (if status is "error") */
  error?: Error | null;
};

/**
 * Hook to track the load time of an async operation and report it to PostHog.
 * Captures timing from when the hook is first called until status changes to success or error.
 */
export const useTrackLoadTime = (
  status: LoadStatus,
  options: TrackLoadTimeOptions,
) => {
  const posthog = usePostHog();
  const loadStartTime = useRef(performance.now());
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;

    const loadDurationMs = Math.round(
      performance.now() - loadStartTime.current,
    );

    if (status === "success") {
      hasTracked.current = true;

      posthog.capture(options.successEvent, {
        load_duration_ms: loadDurationMs,
        ...options.successProperties,
      });
    }

    if (status === "error") {
      hasTracked.current = true;

      posthog.capture(options.errorEvent, {
        load_duration_ms: loadDurationMs,
        error_message: options.error?.message,
      });
    }
  }, [status, options, posthog]);
};
