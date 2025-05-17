import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "tsup";

const outpurDirectory = "dist";
export default defineConfig({
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
  clean: true,
  dts: true,
  sourcemap: true,
  splitting: true,
  minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  format: ["esm"],
  onSuccess: async () => {
    const outputFiles = await fs.promises.readdir(outpurDirectory);
    const mjsFiles = outputFiles.filter((file) => file.endsWith(".mjs"));

    for (const mjsFile of mjsFiles) {
      const outputFilePath = path.join(outpurDirectory, mjsFile);
      const sourceCode = fs.readFileSync(outputFilePath, "utf-8");
      const oldFileSize = fs.statSync(outputFilePath).size / 1000.0;

      const modifiedCode = sourceCode
        .replace(/`([^`]+)`/g, (_, p1) => `\`${p1.replace(/\n/g, " ")}\``)
        .replace(/ +/g, " ");

      fs.writeFileSync(outputFilePath, modifiedCode, "utf-8");

      const newFileSize = fs.statSync(outputFilePath).size / 1000.0;

      console.log(
        `File: ${outputFilePath}: ${oldFileSize} KB -> ${newFileSize} KB`,
      );
    }

    return new Promise((resolve) => resolve());
  },
});
