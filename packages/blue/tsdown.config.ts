import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/blue.ts", "src/crest.tsx", "src/wordmark.tsx"],
  dts: true,
  minify: true,
});
