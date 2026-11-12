import type { NextConfig } from "next";

import { redirects as redirectsArray } from "./data/redirects.json" with { type: "json" };

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 31536000,
    qualities: [75, 60],
    remotePatterns: [createRemotePattern("cdn.sanity.io", "https")],
  },
  redirects: () => Promise.resolve(redirectsArray),
};

export default config;

function createRemotePattern(hostname: string, protocol: "http" | "https") {
  return { hostname, protocol };
}
