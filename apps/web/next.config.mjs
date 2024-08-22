// @ts-check

import { redirects } from "./data/redirects.json";

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
  redirects: () => new Promise((resolve) => resolve(redirects)),
};

export default config;
