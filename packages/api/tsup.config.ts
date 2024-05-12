import * as fs from "fs";
import { defineConfig } from "tsup";
import * as path from "path";

// const outputFilePath = "dist/index.mjs"; // Replace with your output
const outpurDirectory = "dist";
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
    // Find the paths of all .mjs files in the output directory (recursively)
    const outputFiles = await fs.promises.readdir(outpurDirectory);
    const mjsFiles = outputFiles.filter((file) => file.endsWith(".mjs"));

    // Loop through each .mjs file and modify its contents
    for (const mjsFile of mjsFiles) {
      const outputFilePath = path.join(outpurDirectory, mjsFile);

      const sourceCode = fs.readFileSync(outputFilePath, "utf-8");

      // find old file size
      const oldFileSizeInBytes = fs.statSync(outputFilePath).size;
      const oldFileSizeInKilobytes = oldFileSizeInBytes / 1000.0;

      const modifiedCode = sourceCode
        .replace(
          /`([^`]+)`/g,
          // Replace all newlines with spaces
          (_, p1) => "`" + p1.replace(/\n/g, " ") + "`",
          // Any time more than one space is found, replace with a single space
        )
        .replace(/ +/g, " ");

      fs.writeFileSync(outputFilePath, modifiedCode, "utf-8");

      // Find new file size
      const stats = fs.statSync(outputFilePath);
      const fileSizeInBytes = stats.size;
      const fileSizeInKilobytes = fileSizeInBytes / 1000.0;

      console.log(
        `File: ${outputFilePath}: ${oldFileSizeInKilobytes} KB -> ${fileSizeInKilobytes} KB`,
      );
    }

    return new Promise((resolve) => resolve());
  },
});
