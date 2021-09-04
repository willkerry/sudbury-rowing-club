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
