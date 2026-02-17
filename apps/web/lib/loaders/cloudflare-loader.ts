"use client";

import { cloudflareLoader as baseCloudflareLoader } from "@sudburyrc/images";
import type { ImageLoader } from "next/image";
import { whenEnv } from "../environment";

/**
 * Cloudflare image loader for Next.js Image components.
 * In development, returns the original src to avoid CORS issues.
 */
export const cloudflareLoader: ImageLoader = (props) =>
  whenEnv({
    ifPreview: () => baseCloudflareLoader(props),
    ifProd: () => baseCloudflareLoader(props),
    ifDev: () => props.src,
  });
