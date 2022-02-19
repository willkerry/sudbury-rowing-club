// This is a build function that loads the contents of every file in every folder in the src directory, converts it from ISO-8859-1 to UTF-8 using iconv-lite, and then saves them to the output directory.

import fs from "fs";
import path from "path";
import iconv from "iconv-lite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, "src");
const outputDir = path.join(__dirname, ".output");

fs.mkdirSync(outputDir, { recursive: true });
fs.readdirSync(inputDir).forEach((folder) => {
  fs.readdirSync(path.join(inputDir, folder)).forEach((file) => {
    const inputFile = path.join(inputDir, folder, file);
    const outputFile = path.join(outputDir, folder, file);
    const input = fs.readFileSync(inputFile, { encoding: "binary" });
    const output = iconv.decode(input, "ISO-8859-1");
    if (!fs.existsSync(path.dirname(outputFile))) {
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    }
    fs.writeFileSync(outputFile, output, { encoding: "utf8" });
  });
});
