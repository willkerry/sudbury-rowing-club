import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  dts: true,
  sourcemap: true,
  splitting: true,
  minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  format: ["esm"],
});
