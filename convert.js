/* This is a build function that loads the contents of every file in every 
 * folder in the src directory, converts it from ISO-8859-1 to UTF-8 using 
 * iconv-lite, and then saves them to the output directory.
 */

import fs from "fs";
import path from "path";
import iconv from "iconv-lite";
import { fileURLToPath } from "url";
import htmlMinify from "html-minifier";
import CleanCSS from "clean-css";
import tidy from "tidy-html5";
import cliProgress from "cli-progress";

/*
 * CONSTANTS
 */

const _FILENAME = fileURLToPath(import.meta.url);
const _DIRNAME = path.dirname(_FILENAME);
const INPUT_DIR = path.join(_DIRNAME, "src");
const OUTPUT_DIR = path.join(_DIRNAME, ".output");
const VIEWPORT_TAG = `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
const RETURN_LINK_HTML =
  `<a style="
    position: fixed;
    top: 0;
    left: 0
    padding: 0.5em;
    background: #fff"
    href="https://sudburyrowingclub.org.uk/regatta/results/"
    >
      View all results
  </a>`;
const CLEAN_CSS_OPTIONS = {
  level: { 1: { all: true }, 2: { all: true }, 3: { all: true } },
};
const progress = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);


/*
 * HELPER FUNCTIONS
 */

/** Changes the `charset` to utf-8 and remove the `ï¿` character. */
function regCharClean(str) {
  if (!str) throw new Error("Input is empty");
  return str.replace(/charset=iso-8859-1/g, "charset=utf-8").replace(/ï¿/g, "");
}

/** Apply HTML5 Tidy 
 * 
 * @param {string} str - The HTML to tidy
 * @returns {string} - The tidied HTML
 */
function regTidy(str) {
  if (!str) throw new Error("Input is empty");
  // @ts-ignore
  return tidy.tidy_html5(str, {
    clean: true,
    indent: false,
    quiet: true,
    doctype: "html5",
    "drop-proprietary-attributes": true,
    "show-info": false,
    "show-warnings": false,
    "show-errors": 0,
  });
}

/** Add return link at the top of each page. */
function regAddLink(str) {
  if (!str) throw new Error("Input is empty");
  return str.toString().replace(/<body>/, `<body>${RETURN_LINK_HTML}`);
}

/** Add viewport meta tag. */
function regAddVieportMetaTag(str) {
  if (!str) throw new Error("Input is empty");
  return str.toString().replace(/<head>/, `<head>${VIEWPORT_TAG}`);
}

/** Minify the HMTL */
function regMinify(str) {
  return htmlMinify.minify(str, {
    collapseWhitespace: true,
    minifyCSS: true,
    removeRedundantAttributes: true,
  });
}


/** Minify the CSS */
function regMinifyCSS(str) {
  if (!str) throw new Error("Input is empty");
  const cleaned = new CleanCSS(CLEAN_CSS_OPTIONS).minify(str).styles;
  return `/*! minified */\n${cleaned}`;
}

/*
 * MAIN
 */

// If the output directory already exists, delete it.
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true });
}
// Create the output directory.
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Read the contents of the src directory and loop through subdirectory.
fs.readdirSync(INPUT_DIR).forEach((folder) => {
  process.stdout.write(`Processing ${folder}...\n`);

  // Loop through the files in the subdirectory.
  fs.readdirSync(path.join(INPUT_DIR, folder)).forEach((file) => {
    const inputFile = path.join(INPUT_DIR, folder, file);
    const outputFile = path.join(OUTPUT_DIR, folder, file);

    // Sequence number of file in files
    const fileNumber = fs.readdirSync(path.join(INPUT_DIR, folder)).indexOf(file);
    const fileCount = fs.readdirSync(path.join(INPUT_DIR, folder)).length;
    progress.start(fileCount, fileNumber);
    progress.increment();

    // Read file contents.
    const input = fs.readFileSync(inputFile);

    // Decode the file contents.
    let output = iconv.decode(Buffer.from(input), "iso-8859-1", { stripBOM: true, });

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
      output = regCharClean(output);
      output = regTidy(output)
      output = regAddLink(output);
      output = regAddVieportMetaTag(output);
      output = regMinify(output);
    }
    // If file is CSS, apply CSS transformations.
    else if (file.endsWith(".css")) {
      output = regMinifyCSS(output);
    }

    fs.writeFileSync(outputFile, output);

  });
  progress.stop();
  process.stdout.write(`\n`);
});
