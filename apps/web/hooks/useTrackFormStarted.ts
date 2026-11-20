import { usePostHog } from "posthog-js/react";
import { useRef } from "react";

/**
 * Returns a callback that tracks when a user first interacts with a form.
 * Pass it to the form's `listeners`; it fires once per form mount.
 *
 * Use with PostHog funnels:
 *   1. {formName}_started (this hook)
 *   2. {formName}_submitted (on form submit attempt)
 *   3. {formName}_success (on successful submission)
 *
 * Abandonment = started events without corresponding submitted events.
 */
export const useTrackFormStarted = (formName: string) => {
  const posthog = usePostHog();
  const hasTracked = useRef(false);

  return () => {
    if (hasTracked.current) return;

    hasTracked.current = true;
    posthog.capture(`${formName}_started`);
  };
};
