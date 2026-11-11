"use client";

import { useEffect } from "react";

type AutoRedirectProps = {
  /**
   * The URL to redirect to
   */
  url: string | URL;
  /**
   * The delay in milliseconds before redirecting
   * @default 2000
   */
  delay?: number;
};

export const AutoRedirect = ({ url, delay = 2000 }: AutoRedirectProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.replace(url);
    }, delay);

    return () => clearTimeout(timer);
  }, [url, delay]);

  return null;
};
