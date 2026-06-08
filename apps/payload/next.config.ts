import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ["jose", "pg-cloudflare"],
  images: {
    localPatterns: [
      {
        pathname: "/api/media/file/**",
      },
    ],
  },

  // Your Next.js config here
  webpack: (webpackConfig: any, { isServer }: { isServer: boolean }) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };

    // @payloadcms/plugin-cloud-storage's `utilities` barrel re-exports the
    // server-only `resolveSignedURLKey`, which is dragged into the admin client
    // bundle via the R2 client upload handler ('use client'). It imports
    // `payload/internal`, a server-only barrel that pulls in pino-pretty
    // (needs `worker_threads`) and undici (`node:`-scheme imports) — neither of
    // which resolve in a browser bundle. Webpack only tree-shakes in production,
    // so this only bites in dev. The helper never runs client-side, so stub the
    // subpath to an empty module for the client build.
    if (!isServer) {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "payload/internal$": false,
      };
    }

    return webpackConfig;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
