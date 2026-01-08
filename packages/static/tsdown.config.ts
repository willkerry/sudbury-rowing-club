import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/clubs.ts"],
  dts: true,
  sourcemap: true,
  minify: true,
  format: ["esm"],
  splitting: false,
});
