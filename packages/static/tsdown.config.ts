import { defineConfig } from "tsdown";

export default defineConfig({
  dts: true,
  entry: ["src/index.ts", "src/clubs.ts"],
  format: ["esm"],
  minify: true,
  sourcemap: true,
});
