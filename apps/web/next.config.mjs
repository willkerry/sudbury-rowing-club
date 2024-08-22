// @ts-check

import redirects from "./data/redirects.json" assert { type: "json" };
const { redirects: redirectsArray } = redirects;

/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        hostname: "cdn.sanity.io",
        protocol: "https",
      },
      {
        hostname: "clubimages.britishrowing.org",
        protocol: "https",
      },
    ],
  },
  swcMinify: true,
  redirects: () => new Promise((resolve) => resolve(redirectsArray)),
};

export default config;
