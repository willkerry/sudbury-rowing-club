import { defineConfig } from "tsdown";

export default defineConfig({
  dts: true,
  entry: ["src/index.ts", "src/cloudflare.ts"],
  format: ["esm"],
  minify: true,
  sourcemap: true,
});
