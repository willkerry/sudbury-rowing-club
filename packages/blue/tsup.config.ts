import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  sourcemap: true,
  splitting: false,
  clean: true,
  minify: true,
  minifyWhitespace: true,
  format: ["esm"],
});
