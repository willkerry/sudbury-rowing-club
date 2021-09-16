module.exports = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 1024, 1280],
    domains: ["cdn.sanity.io"],
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
  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg?$/,
      oneOf: [
        {
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                prettier: false,
                svgo: true,
                svgoConfig: {
                  plugins: [{ removeViewBox: false }],
                },
                titleProp: true,
              },
            },
          ],
          issuer: {
            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
          },
        },
      ],
    });
    return config;
  },
};
