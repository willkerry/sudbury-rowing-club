import type { Plugin } from "rolldown";
import { defineConfig } from "tsdown";

/**
 * Rolldown plugin that collapses whitespace inside template literals.
 * GROQ queries are written as multi-line tagged templates for readability,
 * but the newlines and indentation are insignificant at runtime.
 */
function collapseTemplateLiterals(): Plugin {
  return {
    name: "collapse-template-literals",
    renderChunk(code) {
      const collapsed = code.replace(
        /`([^`]+)`/g,
        (_, content: string) =>
          `\`${content.replace(/\n/g, " ").replace(/ +/g, " ")}\``,
      );

      return { code: collapsed };
    },
  };
}

export default defineConfig({
  dts: true,
  format: ["esm"],
  minify: true,
  plugins: [collapseTemplateLiterals()],
  sourcemap: true,
  entry: [
    "src/index.ts",
    "src/sanity/image-url-builder.ts",
    "src/sanity/client.ts",
    "src/shared/image.ts",
    "src/queries/typed-object.ts",
    "src/queries/cached-fetch-news.ts",
    "src/queries/fetch-archives.ts",
    "src/queries/fetch-authors.ts",
    "src/queries/fetch-competitions.ts",
    "src/queries/fetch-forecast.ts",
    "src/queries/fetch-governance.ts",
    "src/queries/fetch-landing-page.ts",
    "src/queries/fetch-minutes.ts",
    "src/queries/fetch-news-article.ts",
    "src/queries/fetch-notices.ts",
    "src/queries/fetch-officer-names.ts",
    "src/queries/fetch-regatta-settings.ts",
    "src/queries/fetch-regattas.ts",
    "src/queries/fetch-safety.ts",
  ],
  inputOptions: {
    resolve: {
      alias: {
        "node:fs": "fs",
        "node:os": "os",
        "node:path": "path",
      },
    },
  },
});
