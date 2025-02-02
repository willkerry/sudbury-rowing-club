import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/clampString.ts",
    "src/getInitials.ts",
    "src/ordinal.ts",
    "src/smartQuotes.ts",
  ],
  dts: true,
  sourcemap: true,
  splitting: true,
  clean: true,
  minify: true,
  minifyWhitespace: true,
  format: ["esm"],
});
