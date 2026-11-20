"use client";

import { useIsClient } from "@/hooks/useIsClient";

const getMessage = () =>
  encodeURIComponent(
    JSON.stringify({
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
      language: navigator.language,
      url: window.location.href,
      date: new Date().toISOString(),
    }),
  );

export const ReportABug = () => {
  const isClient = useIsClient();

  return (
    <a
      className="transition hover:text-black"
      href={isClient ? `/bugs?message=${getMessage()}` : "/bugs"}
    >
      Report a bug.
    </a>
  );
};
