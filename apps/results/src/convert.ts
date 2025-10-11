import path from "node:path";
import { cwd } from "node:process";
import fs from "fs-extra";
// @ts-expect-error
import tidy from "tidy-html5";
import { createDirectoryListing } from "./createDirectoryListing";

/*
 * CONSTANTS
 */

export const TEMP = ".temp";

export const INPUT_DIR = path.join(cwd(), "data");
const OUTPUT_DIR = path.join(cwd(), TEMP);

const VIEWPORT_TAG = `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
const RETURN_LINK_HTML = `<a href="https://sudburyrowingclub.org.uk/regatta/results/">View all results</a>`;
const LISTING_LINK_HTML = `<a href="_listing.html">Directory listing</a>`;

const STYLES = fs.readFileSync(path.join(cwd(), "src", "style.css"), "utf8");

/*
 * HELPER FUNCTIONS
 */

const CHARSET_REGEX = /charset=iso-8859-1/g;
const HYPHEN_CHARACTER_REGEX = /ï¿/g;

/** Changes the `charset` to utf-8 and remove the `ï¿` character. */
function modifyHtmlCharsetTag(str: string) {
  if (!str) throw new Error("Input is empty");
  return str
    .replace(CHARSET_REGEX, "charset=utf-8")
    .replace(HYPHEN_CHARACTER_REGEX, "");
}

const OPENING_HEAD_TAG_REGEX = /<head>/;

/** Add viewport meta tag. */
function addVieportMetaTag(str: string) {
  if (!str) throw new Error("Input is empty");
  return str
    .toString()
    .replace(OPENING_HEAD_TAG_REGEX, `<head>${VIEWPORT_TAG}`);
}

const GENERATOR_META_TAG_REGEX =
  /<meta\s+(?:name|content)*?=['"]*?\s*?generator\s*?['"][\s\S]*?>/gi;

function stripGeneratorMetaTags(html: string): string {
  // Match both uppercase and lowercase variations, with flexible spacing
  const generatorPattern = GENERATOR_META_TAG_REGEX;

  return html.replace(generatorPattern, "");
}

const CLOSING_BODY_TAG_REGEX = /<\/body>/;

// append a link, diorectly before the closing body tag, to the listing page
function addListingLink(html: string, fileName: string): string {
  const returnLink =
    fileName !== "index.html" ? `<a href="./index.html">Return</a>` : "";

  return html.replace(
    CLOSING_BODY_TAG_REGEX,
    `<footer class="generated-footer">
    ${returnLink}
    ${LISTING_LINK_HTML} ${RETURN_LINK_HTML}</footer>\n</body>`,
  );
}
const CLOSING_HEAD_TAG_REGEX = /<\/head>/;

function addStyleLinkTag(html: string): string {
  return html.replace(
    CLOSING_HEAD_TAG_REGEX,
    `<link rel="stylesheet" href="../style.css">\n</head>`,
  );
}

const convertFile = async (
  fileName: string,
  inputFile: string,
  outputFile: string,
) => {
  // Read file contents.
  const input = await fs.readFile(inputFile);

  let output = input.toString("latin1");

  // If the output directory doesn't exist, create it.
  await fs.ensureDir(path.dirname(outputFile));

  // If file is HTML, apply HTML transformations.
  if (
    fileName.endsWith(".html") ||
    fileName.endsWith(".htm") ||
    fileName.endsWith(".HTM")
  ) {
    output = modifyHtmlCharsetTag(output);
    output =
      tidy
        .tidy_html5(output, {
          clean: true,
          quiet: true,
          doctype: "html5",
          "quote-ampersand": false,
          "drop-proprietary-attributes": true,
          "show-info": false,
          "show-warnings": false,
          "show-errors": 0,
        })
        ?.toString() ?? output;
    output = addVieportMetaTag(output);
    output = addStyleLinkTag(output);

    output = stripGeneratorMetaTags(output);

    output = addListingLink(output, fileName);
  }

  await fs.writeFile(outputFile, output);
};

const convertDirectory = async (folder: string) => {
  const files = await fs.readdir(path.join(INPUT_DIR, folder));

  await Promise.all(
    files.map((file) =>
      convertFile(
        file,
        path.join(INPUT_DIR, folder, file),
        path.join(OUTPUT_DIR, folder, file),
      ),
    ),
  );
};

/*
 * MAIN
 */
export const generateResults = async () => {
  // If the output directory already exists, delete it.
  await fs.remove(OUTPUT_DIR);

  // Create the output directory.
  await fs.ensureDir(OUTPUT_DIR);

  const paths: string[] = [];

  const folders = await fs.readdir(INPUT_DIR);

  await Promise.all(
    folders.map((folder) => {
      paths.push(folder);
      return convertDirectory(folder);
    }),
  );

  // Now go through the generated folders and create a directory listing for each.
  await Promise.all(
    paths.map(async (folder) =>
      fs.writeFileSync(
        path.join(OUTPUT_DIR, folder, "_listing.html"),
        await createDirectoryListing(path.join(OUTPUT_DIR, folder), folder),
      ),
    ),
  );

  const indexHTML = await createDirectoryListing(
    OUTPUT_DIR,
    "Sudbury Regatta Results",
  );

  await fs.writeFile(path.join(OUTPUT_DIR, "index.html"), indexHTML);
  await fs.writeFile(path.join(OUTPUT_DIR, "style.css"), STYLES);
};

export const cleanResults = () => fs.remove(OUTPUT_DIR);
