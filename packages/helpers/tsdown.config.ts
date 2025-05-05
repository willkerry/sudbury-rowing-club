import { defineConfig } from "tsdown";

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
  minify: true,
  format: ["esm"],
});
