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
const RETURN_LINK_HTML = `<a class="return-link" href="https://sudburyrowingclub.org.uk/regatta/results/">View all results</a>`;

const STYLES = fs.readFileSync(path.join(cwd(), "src", "style.css"), "utf8");

/*
 * HELPER FUNCTIONS
 */

/** Changes the `charset` to utf-8 and remove the `ï¿` character. */
function modifyHtmlCharsetTag(str: string) {
  if (!str) throw new Error("Input is empty");
  return str.replace(/charset=iso-8859-1/g, "charset=utf-8").replace(/ï¿/g, "");
}

/** Add return link at the top of each page. */
function addReturnLink(str: string) {
  if (!str) throw new Error("Input is empty");
  return str.toString().replace(/<body>/, `<body>${RETURN_LINK_HTML}`);
}

/** Add viewport meta tag. */
function addVieportMetaTag(str: string) {
  if (!str) throw new Error("Input is empty");
  return str.toString().replace(/<head>/, `<head>${VIEWPORT_TAG}`);
}

function stripGeneratorMetaTags(html: string): string {
  // Match both uppercase and lowercase variations, with flexible spacing
  const generatorPattern =
    /<meta\s+(?:name|content)*?=['"]*?\s*?generator\s*?['"][\s\S]*?>/gi;

  return html.replace(generatorPattern, "");
}

// append a link, diorectly before the closing body tag, to the listing page
function addListingLink(html: string): string {
  return html.replace(
    /<\/body>/,
    '<a href="_listing.html" class="listing-link">Directory listing</a>\n</body>',
  );
}
function addStyleLinkTag(html: string): string {
  return html.replace(
    /<\/head>/,
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
    output = addReturnLink(output);
    output = addVieportMetaTag(output);
    output = addStyleLinkTag(output);

    output = stripGeneratorMetaTags(output);

    if (fileName.startsWith("index")) {
      output = addListingLink(output);
    }
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
