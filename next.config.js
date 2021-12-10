module.exports = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  swcMinify: true,
  /* webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: { svgoConfig: { plugins: { removeViewBox: false } } },
        },
      ],
    });

    return config;
  }, */
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
      {
        source: "/contact/:slug(\\S+)",
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
