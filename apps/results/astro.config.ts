import { defineConfig } from "astro/config";
import { archiveAssets } from "./src/integrations/archive-assets.ts";

export default defineConfig({
  build: { format: "preserve", inlineStylesheets: "never" },
  integrations: [archiveAssets()],
  server: { port: 4322 },
  site: "https://results.sudburyrowingclub.org.uk",
  trailingSlash: "ignore",
  vite: {
    css: { transformer: "lightningcss" },
    build: { cssMinify: "lightningcss" },
  },
});
