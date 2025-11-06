import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

import { redirects as redirectsArray } from "./data/redirects.json" with {
  type: "json",
};

const config: NextConfig = {
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [createRemotePattern("cdn.sanity.io", "https")],
  },
  redirects: () => Promise.resolve(redirectsArray),
  reactStrictMode: true,
  serverExternalPackages: ["jsdom"],
};

export default withContentCollections(config);

function createRemotePattern(hostname: string, protocol: "http" | "https") {
  return { hostname, protocol };
}
