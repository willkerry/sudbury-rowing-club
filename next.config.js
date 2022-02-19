const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const config = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/results/:id*",
        destination: "https://results.sudburyrowingclub.org.uk/:id*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/results",
        destination: "/regatta/results",
        permanent: true,
      },
      // {
      //   source: "/results/:slug*",
      //   destination: "https://results.sudburyrowingclub.org.uk/:slug*",
      //   permanent: true,
      // },
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
      {
        source: "/contact/:slug((?!how-to-find-us$).*)",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/about/club-officers",
        destination: "/governance",
        permanent: true,
      },
      /* {
        // move plain HTML results to a dedicated subdomain (eventually)
        source: "/results/:slug*",
        destination: "https://results.sudburyrowingclub.org.uk/:slug*",
        permanent: true,
      }, */
    ];
  },
};

module.exports = withBundleAnalyzer(config);
