import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/blue.ts", "src/crest.tsx", "src/wordmark.tsx"],
  dts: true,
  sourcemap: true,
  splitting: true,
  clean: true,
  minify: true,
  minifyWhitespace: true,
  format: ["esm"],
});
