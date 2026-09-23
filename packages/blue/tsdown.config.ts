import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { defineConfig } from "tsdown";
import { blue } from "./src/blue.ts";

const stops = Object.entries(blue)
  .map(([stop, hex]) => `  --color-blue-${stop}: ${hex};`)
  .join("\n");

const paletteCss = `@theme {
${stops}
}
`;

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
  hooks: {
    "build:done": ({ options }) =>
      writeFile(join(options.outDir, "blue.css"), paletteCss),
  },
});
