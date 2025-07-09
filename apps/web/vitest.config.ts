import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    coverage: {
      enabled: true,
      exclude: [
        ...coverageConfigDefaults.exclude,
        "type?(s)/**",
        "next/**",
        "data/**",
        "**\/*config**",
        "**\/constants*",
        "**\/*.tsx",
        "**\/*[S|s]chema*",
      ],
      reporter: ["text", "json", "html"],
    },
  },
});
