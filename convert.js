// This is a build function that loads the contents of every file in every folder in the src directory, converts it from ISO-8859-1 to UTF-8 using iconv-lite, and then saves them to the output directory.

import fs from "fs";
import path from "path";
import iconv from "iconv-lite";
import { fileURLToPath } from "url";
import htmlMinify from "html-minifier";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, "src");
const outputDir = path.join(__dirname, ".output");

// Delete the output directory if it exists.
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true });
}

fs.mkdirSync(outputDir, { recursive: true });
fs.readdirSync(inputDir).forEach((folder) => {
  fs.readdirSync(path.join(inputDir, folder)).forEach((file) => {
    const inputFile = path.join(inputDir, folder, file);
    const outputFile = path.join(outputDir, folder, file);
    const input = fs.readFileSync(inputFile);

    // decode using a buffer
    const output = iconv.decode(Buffer.from(input), "iso-8859-1", {
      stripBOM: true,
    });

    if (!fs.existsSync(path.dirname(outputFile))) {
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    }

    // replace charset isntances of 'iso-8859-1' with 'utf-8'
    const no8859 = output.replace(/charset=iso-8859-1/g, "charset=utf-8");

    // strip BOM
    const noBOM = no8859.replace(/ï¿/g, "");

    // minify HTML – in a try catch to prevent errors from stopping the build
    let minified;
    try {
      minified = htmlMinify.minify(noBOM);
    } catch (e) {
      minified = noBOM;
    }

    // strip BOM ("ï¿") from the output
    fs.writeFileSync(outputFile, minified);
  });
});
