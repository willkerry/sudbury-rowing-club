import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/cloudflare.ts"],
  dts: true,
  sourcemap: true,
  minify: true,
  format: ["esm"],
});
