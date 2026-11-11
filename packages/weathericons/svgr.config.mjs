export default {
  jsxRuntime: "automatic",
  svgo: true,
  typescript: true,
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: { overrides: { removeViewBox: false } },
      },
      { name: "prefixIds" },
    ],
  },
};
