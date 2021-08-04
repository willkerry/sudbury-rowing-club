module.exports = {
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
