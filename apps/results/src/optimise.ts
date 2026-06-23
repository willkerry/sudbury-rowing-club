import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import minifyHtml from "@minify-html/node";
import browserslist from "browserslist";
import { consola } from "consola";
import { browserslistToTargets, transform } from "lightningcss";
import { OUTPUT_DIR } from "./convert.ts";

/*
 * Post-build optimisation pass.
 *
 * Runs over the generated `dist/` output once `generateResults()` has done its
 * HTML rewriting. Two Rust-backed tools do the work:
 *   - Lightning CSS lowers native nesting to flat selectors, adds vendor
 *     prefixes and minifies, all driven by the `browserslist` field in
 *     package.json.
 *   - minify-html minifies the markup (and any inline CSS) of every page.
 */

// Resolve the package.json `browserslist` query into Lightning CSS targets.
const targets = browserslistToTargets(browserslist());

const HTML_EXTENSIONS = new Set([".html", ".htm"]);

const HTML_MINIFY_CONFIG = {
  // These archival documents predate strict markup; keep the structural tags
  // rather than relying on optional-tag omission.
  keep_closing_tags: true,
  keep_html_and_head_opening_tags: true,
  minify_css: true,
};

const optimiseCss = (filePath: string, source: Buffer) =>
  transform({
    code: source,
    filename: filePath,
    minify: true,
    targets,
  }).code;

const optimiseFile = async (filePath: string) => {
  const extension = path.extname(filePath).toLowerCase();
  const isCss = extension === ".css";
  const isHtml = HTML_EXTENSIONS.has(extension);

  if (!(isCss || isHtml)) return false;

  const source = await readFile(filePath);

  try {
    const output = isCss
      ? optimiseCss(filePath, source)
      : minifyHtml.minify(source, HTML_MINIFY_CONFIG);
    await writeFile(filePath, output);

    return true;
  } catch (error) {
    consola.warn(
      `Skipped optimising ${path.relative(OUTPUT_DIR, filePath)}: ${error}`,
    );

    return false;
  }
};

export const optimiseOutput = async () => {
  const entries = await readdir(OUTPUT_DIR, {
    recursive: true,
    withFileTypes: true,
  });

  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name));

  const results = await Promise.all(files.map(optimiseFile));

  return results.filter(Boolean).length;
};
