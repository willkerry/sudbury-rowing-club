import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: [
      // Workers-only module; tests load data through the dev-mode paths.
      {
        find: "cloudflare:workers",
        replacement: fileURLToPath(
          new URL("./test-utils/cloudflare-workers.ts", import.meta.url),
        ),
      },
      // `next` isn't installed; vinext's Vite plugin normally does this.
      { find: /^next\/(.*)$/, replacement: "vinext/shims/$1" },
    ],
  },
  test: {
    environment: "jsdom",
    coverage: {
      enabled: true,
      reporter: ["text", "json", "html"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "type?(s)/**",
        "next/**",
        "data/**",
        "**/*config**",
        "**/constants*",
        "**/*.tsx",
        "**/*[S|s]chema*",
      ],
    },
  },
});
