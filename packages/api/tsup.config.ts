import * as fs from "fs";
import { defineConfig } from "tsup";

const outputFilePath = "dist/index.mjs"; // Replace with your output

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/sanity/image-url-builder.ts",
    "src/sanity/client.ts",
    "src/queries/cached-fetch-news.ts",
    "src/queries/fetch-archives.ts",
    "src/queries/fetch-authors.ts",
    "src/queries/fetch-competitions.ts",
    "src/queries/fetch-forecast.ts",
    "src/queries/fetch-governance.ts",
    "src/queries/fetch-minutes.ts",
    "src/queries/fetch-news-article.ts",
    "src/queries/fetch-notices.ts",
    "src/queries/fetch-officer-names.ts",
    "src/queries/fetch-regatta-settings.ts",
    "src/queries/fetch-regattas.ts",
    "src/queries/fetch-safety.ts",
  ],
  dts: true,
  sourcemap: true,
  splitting: true,
  minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  format: ["esm"],

  onSuccess: async () => {
    const sourceCode = fs.readFileSync(outputFilePath, "utf-8");

    const modifiedCode = sourceCode
      .replace(
        /`([^`]+)`/g,
        // Replace all newlines with spaces
        (_, p1) => "`" + p1.replace(/\n/g, " ") + "`",
        // Any time more than one space is found, replace with a single space
      )
      .replace(/ +/g, " ");

    fs.writeFileSync(outputFilePath, modifiedCode, "utf-8");

    // Now also print the size of the file
    const stats = fs.statSync(outputFilePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInKilobytes = fileSizeInBytes / 1000.0;

    console.log(`\nFile size: ${fileSizeInKilobytes} KB\n`);

    return new Promise((resolve) => resolve());
  },
});
