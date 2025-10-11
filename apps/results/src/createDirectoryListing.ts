import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import nunjucks from "nunjucks";

const REGATTA_WITH_FOUR_DIGIT_NUMBER_REGEX = /regatta\d{4}/;

// takes a directory path and returns formatted HTML string
export const createDirectoryListing = async (
  directory: string,
  title: string,
) => {
  const files = await readdir(directory);

  const isIndexListing = !!directory.match(
    REGATTA_WITH_FOUR_DIGIT_NUMBER_REGEX,
  );

  const items = files.map(async (file) => {
    const filePath = join(directory, file);
    const stats = await stat(filePath);
    const isDirectory = stats.isDirectory();
    const isFile = stats.isFile();
    const isImage =
      file.endsWith(".png") ||
      file.endsWith(".jpg") ||
      file.endsWith(".gif") ||
      file.endsWith(".svg");
    const isLambda = file.endsWith(".lambda");

    const isHidden = file.startsWith(".") || file.endsWith(".css");

    if (isHidden) {
      return;
    }

    if (isDirectory) {
      return `<li><a href="${file}/_listing.html" class="folder">${file}</a></li>`;
    }

    if (isFile) {
      if (isImage) {
        return `<li><a href="${file}" class="file ${file.split(".").pop()}">${file}</a></li>`;
      }
      if (isLambda) {
        return `<li><a href="${file}" class="lambda">${file}</a></li>`;
      }

      return `<li><a href="${file}" class="file">${file}</a></li>`;
    }
  });

  const listingTemplate = await readFile("src/listing.njk", "utf-8");

  nunjucks.configure({
    autoescape: false,
    noCache: true,
    lstripBlocks: true,
    trimBlocks: true,
  });

  const head = `<link rel="stylesheet" href="${
    isIndexListing ? "../" : ""
  }style.css" />`;

  return nunjucks.renderString(listingTemplate, {
    title,
    items: (await Promise.all(items)).filter((item) => item).join(""),
    head,
  });
};
