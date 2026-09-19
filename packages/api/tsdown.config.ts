import MagicString from "magic-string";
import type { Plugin } from "rolldown";
import { defineConfig } from "tsdown";

const TEMPLATE_LITERAL = /`([^`]+)`/g;

/**
 * Rolldown plugin that collapses whitespace inside template literals.
 * GROQ queries are written as multi-line tagged templates for readability,
 * but the newlines and indentation are insignificant at runtime.
 *
 * Edits go through MagicString so the chunk's sourcemap stays accurate;
 * rewriting the code directly shifts every position after each query.
 */
function collapseTemplateLiterals(): Plugin {
  return {
    name: "collapse-template-literals",
    renderChunk(code) {
      const magic = new MagicString(code);

      for (const match of code.matchAll(TEMPLATE_LITERAL)) {
        const contents = match[1];
        const collapsed = contents.replace(/\n/g, " ").replace(/ +/g, " ");

        if (collapsed === contents) continue;

        const start = match.index + 1;
        magic.overwrite(start, start + contents.length, collapsed);
      }

      if (!magic.hasChanged()) return null;

      return {
        code: magic.toString(),
        map: magic.generateMap({ hires: true }),
      };
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
    "src/queries/fetch-locationforecast.ts",
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
