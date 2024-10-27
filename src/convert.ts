import fs from "node:fs";
import path from "node:path";
import tidy from "tidy-html5";
import cliProgress from "cli-progress";
import { createDirectoryListing } from "./createDirectoryListing";
import { cwd } from "node:process";

/*
 * CONSTANTS
 */

export const TEMP = ".temp";

const INPUT_DIR = path.join(cwd(), "data");
const OUTPUT_DIR = path.join(cwd(), TEMP);
const VIEWPORT_TAG = `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
const RETURN_LINK_HTML = `<a style="
    position: fixed;
    top: 0;
    left: 0
    padding: 0.5em;
    background: #fff"
    href="https://sudburyrowingclub.org.uk/regatta/results/"
    >
      View all results
  </a>`;

const progress = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);

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
    '<a href="_listing.html" style="margin: 2em auto 0 auto; display: block; width: 100%; text-align: center; font-size: 0.8em;">Directory listing</a>\n</body>',
  );
}

/*
 * MAIN
 */
export const generateResults = async () => {
  // If the output directory already exists, delete it.
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }

  // Create the output directory.
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const paths: string[] = [];

  // Read the contents of the src directory and loop through subdirectory.
  for (const folder of fs.readdirSync(INPUT_DIR)) {
    process.stdout.write(`Processing ${folder}...\n`);

    paths.push(folder);

    // Loop through the files in the subdirectory.
    for (const file of fs.readdirSync(path.join(INPUT_DIR, folder))) {
      const inputFile = path.join(INPUT_DIR, folder, file);
      const outputFile = path.join(OUTPUT_DIR, folder, file);

      // Sequence number of file in files
      const fileNumber = fs
        .readdirSync(path.join(INPUT_DIR, folder))
        .indexOf(file);
      const fileCount = fs.readdirSync(path.join(INPUT_DIR, folder)).length;
      progress.start(fileCount, fileNumber);
      progress.increment();

      // Read file contents.
      const input = fs.readFileSync(inputFile);

      let output = input.toString("latin1");

      // If the output directory doesn't exist, create it.
      if (!fs.existsSync(path.dirname(outputFile))) {
        fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      }

      // If file is HTML, apply HTML transformations.
      if (
        file.endsWith(".html") ||
        file.endsWith(".htm") ||
        file.endsWith(".HTM")
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

        output = stripGeneratorMetaTags(output);

        if (file.startsWith("index")) {
          output = addListingLink(output);
        }
      }

      fs.writeFileSync(outputFile, output);
    }

    const listingHTML = await createDirectoryListing(
      path.join("data", folder),
      folder,
    );
    fs.writeFileSync(
      path.join(OUTPUT_DIR, folder, "_listing.html"),
      listingHTML,
    );

    progress.stop();
    process.stdout.write("\n");
  }

  const indexHTML = await createDirectoryListing(
    OUTPUT_DIR,
    "Sudbury Regatta Results",
  );

  fs.writeFileSync(path.join(OUTPUT_DIR, "index.html"), indexHTML);
};

export const cleanResults = async () => {
  // If the output directory already exists, delete it.
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
};
