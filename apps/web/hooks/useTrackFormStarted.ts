import { usePostHog } from "posthog-js/react";
import { useEffect, useRef } from "react";

/**
 * Hook to track when a user first interacts with a form.
 * Fires once per form mount when any field becomes touched.
 *
 * Use with PostHog funnels:
 *   1. {formName}_started (this hook)
 *   2. {formName}_submitted (on form submit attempt)
 *   3. {formName}_success (on successful submission)
 *
 * Abandonment = started events without corresponding submitted events.
 */
export const useTrackFormStarted = (
  formName: string,
  hasTouchedFields: boolean,
) => {
  const posthog = usePostHog();
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTouchedFields && !hasTracked.current) {
      hasTracked.current = true;
      posthog.capture(`${formName}_started`);
    }
  }, [hasTouchedFields, formName, posthog]);
};
