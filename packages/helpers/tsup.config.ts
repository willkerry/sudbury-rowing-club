import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/smartQuotes.ts"],
  dts: true,
  sourcemap: true,
  splitting: true,
  clean: true,
  minify: true,
  minifyWhitespace: true,
  format: ["esm"],
});
