"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

/**
 * Client component that tracks 404 page views in PostHog.
 * Captures the attempted URL path and any search parameters.
 */
export const Track404 = () => {
  const posthog = usePostHog();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const referrer =
      typeof document !== "undefined" ? document.referrer : undefined;

    posthog.capture("404_page_viewed", {
      attempted_path: pathname,
      full_url: `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
      is_internal_referrer: referrer?.includes("sudburyrowingclub.org.uk"),
      referrer: referrer || undefined,
      search_params: searchParams.toString() || undefined,
    });
  }, [pathname, searchParams, posthog]);

  return null;
};
