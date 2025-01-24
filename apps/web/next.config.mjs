import createNextIntlPlugin from "next-intl/plugin";
// @ts-check
import { withContentCollections } from "@content-collections/next";
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
  redirects: () => new Promise((resolve) => resolve(redirectsArray)),
  reactStrictMode: true,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withContentCollections(config));

/**
 * @param {string} hostname
 * @param {'http'|'https'} protocol
 */
function createRemotePattern(hostname, protocol) {
  return { hostname, protocol };
}
