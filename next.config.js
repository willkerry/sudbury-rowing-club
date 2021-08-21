module.exports = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 1024, 1280],
  },
  async redirects() {
    return [
      {
        source: "/results",
        destination: "/regatta/results",
        permanent: true,
      },
      {
        source: "/how-to-contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/history",
        destination: "/about/history",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/",
        permanent: true,
      },
      {
        source: "/course",
        destination: "/regatta/course",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/about/club-officers",
        destination: "/governance",
      },
    ];
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({});
