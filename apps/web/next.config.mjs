// @ts-check

import redirects from "./data/redirects.json" assert { type: "json" };
const { redirects: redirectsArray } = redirects;

/** @type {import('next').NextConfig} */
const config = {
  images: {
    minimumCacheTTL: 31536000,

    remotePatterns: [
      createRemotePattern("cdn.sanity.io", "https"),
      createRemotePattern("clubimages.britishrowing.org", "https"),
    ],
  },
  swcMinify: true,
  redirects: () => new Promise((resolve) => resolve(redirectsArray)),
};

export default config;

/**
 * @param {string} hostname
 * @param {'http'|'https'} protocol
 */
function createRemotePattern(hostname, protocol) {
  return { hostname, protocol };
}
