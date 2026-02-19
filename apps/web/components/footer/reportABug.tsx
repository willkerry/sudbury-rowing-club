"use client";

import { useEffect, useState } from "react";
import { env } from "@/env";

const useLocale = () => Intl.DateTimeFormat().resolvedOptions().locale;

const useLanguage = () => {
  const [language, setLanguage] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLanguage(navigator.language);
  }, []);

  return language;
};

const useURL = () => {
  if (typeof window === "undefined") return "";

  return window.location.href;
};

export const ReportABug = () => {
  const locale = useLocale();
  const language = useLanguage();
  const url = useURL();

  const stringifiedMessage = JSON.stringify({
    locale,
    language,
    url,
    date: new Date().toISOString(),
    sha: env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  });

  const message = encodeURIComponent(stringifiedMessage);

  return (
    <a
      className="transition hover:text-black"
      href={`/bugs?message=${message}`}
      suppressHydrationWarning
    >
      Report a bug.
    </a>
  );
};
