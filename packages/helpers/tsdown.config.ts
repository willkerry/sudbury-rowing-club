import { defineConfig } from "tsdown";

export default defineConfig({
  dts: true,
  format: ["esm"],
  minify: true,
  sourcemap: true,
  entry: [
    "src/index.ts",
    "src/clampString.ts",
    "src/getInitials.ts",
    "src/ordinal.ts",
    "src/smartQuotes.ts",
  ],
});
