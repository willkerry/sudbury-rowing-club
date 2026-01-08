"use client";

import { cloudflareLoader as baseCloudflareLoader } from "@sudburyrc/images";
import type { ImageLoader } from "next/image";
import { env } from "@/env";

/**
 * Cloudflare image loader for Next.js Image components.
 * In development, returns the original src to avoid CORS issues.
 */
export const cloudflareLoader: ImageLoader = (props) => {
  if (env.NODE_ENV === "development") {
    return props.src;
  }

  return baseCloudflareLoader(props);
};
