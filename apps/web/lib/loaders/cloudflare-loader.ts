"use client";

import type { ImageLoader } from "next/image";

const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

export const cloudflareLoader: ImageLoader = ({
  src,
  width,
  quality,
}: { src: string; width: number; quality?: number }) => {
  if (process.env.NODE_ENV === "development") {
    return src;
  }

  const params = [`width=${width}`];

  if (quality) {
    params.push(`quality=${quality}`);
  }

  const paramsString = params.join(",");

  return `https://cdn.sudburyrowingclub.org.uk/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
};
