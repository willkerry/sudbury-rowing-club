import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import nunjucks from "nunjucks";

const REGATTA_WITH_FOUR_DIGIT_NUMBER_REGEX = /regatta\d{4}/;

const mapFilenameToItemStrings = async (
  filename: string,
  directory: string,
) => {
  const filePath = join(directory, filename);
  const stats = await stat(filePath);
  const isDirectory = stats.isDirectory();
  const isFile = stats.isFile();
  const isImage =
    filename.endsWith(".png") ||
    filename.endsWith(".jpg") ||
    filename.endsWith(".gif") ||
    filename.endsWith(".svg");
  const isLambda = filename.endsWith(".lambda");

  const isHidden = filename.startsWith(".") || filename.endsWith(".css");

  if (isHidden) {
    return;
  }

  if (isDirectory) {
    return `<li><a href="${filename}/_listing.html" class="folder">${filename}</a></li>`;
  }

  if (isFile) {
    if (isImage) {
      return `<li><a href="${filename}" class="file ${filename.split(".").pop()}">${filename}</a></li>`;
    }
    if (isLambda) {
      return `<li><a href="${filename}" class="lambda">${filename}</a></li>`;
    }

    return `<li><a href="${filename}" class="file">${filename}</a></li>`;
  }
};

const mapFilenamesToItemStrings = async (
  filenames: string[],
  directory: string,
) =>
  await Promise.all(
    filenames.map((filename) => mapFilenameToItemStrings(filename, directory)),
  );

export const createDirectoryListing = async (
  directory: string,
  title: string,
) => {
  const files = await readdir(directory);

  const isIndexListing = !!directory.match(
    REGATTA_WITH_FOUR_DIGIT_NUMBER_REGEX,
  );

  const [items, listingTemplate] = await Promise.all([
    mapFilenamesToItemStrings(files, directory),
    readFile("src/listing.njk", "utf-8"),
  ]);

  nunjucks.configure({
    autoescape: false,
    lstripBlocks: true,
    noCache: true,
    trimBlocks: true,
  });

  const head = `<link rel="stylesheet" href="${
    isIndexListing ? "../" : ""
  }style.css" />`;

  return nunjucks.renderString(listingTemplate, {
    title,
    items: items.filter((item) => item).join(""),
    head,
  });
};
