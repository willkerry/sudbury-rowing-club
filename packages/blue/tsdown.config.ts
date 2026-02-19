import { defineConfig } from "tsdown";

export default defineConfig({
  dts: true,
  minify: true,
  entry: [
    "src/index.ts",
    "src/blue.ts",
    "src/crest.tsx",
    "src/social.tsx",
    "src/wordmark.tsx",
  ],
});
