/** This is a build function that loads the contents of every file in every 
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

// CONSTANTS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputDir = path.join(__dirname, "src");
const outputDir = path.join(__dirname, ".output");
const viewportTag = `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
const link =
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
const cssOptions = {
  level: { 1: { all: true }, 2: { all: true }, 3: { all: true } },
};
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true });
}

fs.mkdirSync(outputDir, { recursive: true });
fs.readdirSync(inputDir).forEach((folder) => {
  process.stdout.write(`Processing ${folder}...`);
  fs.readdirSync(path.join(inputDir, folder)).forEach((file) => {
    const inputFile = path.join(inputDir, folder, file);
    const outputFile = path.join(outputDir, folder, file);
    const input = fs.readFileSync(inputFile);

    const output = iconv.decode(Buffer.from(input), "iso-8859-1", {
      stripBOM: true,
    });

    if (!fs.existsSync(path.dirname(outputFile))) {
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    }

    if (
      file.endsWith(".html") ||
      file.endsWith(".htm") ||
      file.endsWith(".HTM")
    ) {
      const no8859 = output.replace(/charset=iso-8859-1/g, "charset=utf-8");
      const noBOM = no8859.replace(/ï¿/g, "");
      const tidied = tidy.tidy_html5(noBOM, {
        clean: true,
        indent: false,
        quiet: true,
        doctype: "html5",
        "drop-proprietary-attributes": true,
        "show-info": false,
        "show-warnings": false,
        "show-errors": 0,
      });

      // add return link to the top of every page
      const withLink = tidied.replace(/<body>/, `<body>${link}`);

      // add the viewport meta tag
      const withTag = withLink.replace(/<head>/, `<head>${viewportTag}`);

      // minify the HTML
      const minified = htmlMinify.minify(withTag, {
        collapseWhitespace: true,
        minifyCSS: true,
        removeRedundantAttributes: true,
      });

      fs.writeFileSync(outputFile, minified);
    } else if (file.endsWith(".css")) {
      // minify CSS
      const minified = new CleanCSS(cssOptions).minify(output).styles;
      // add the comment '/*! minified */' to the top of the file
      const withComment = `/*! minified */\n${minified}`;
      fs.writeFileSync(outputFile, withComment);
    } else {
      fs.writeFileSync(outputFile, output);
    }
  });
  process.stdout.write(` done.\n`);
});
