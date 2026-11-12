import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rename,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import minifyHtml from "@minify-html/node";
import type { AstroIntegration } from "astro";
import {
  ARCHIVE_STYLE_DIR,
  ARCHIVE_STYLE_FILE,
  readArchiveStyle,
  scopeStylesheet,
} from "../lib/archive-styles.ts";
import { isHtmlFile, listFiles, listFolders } from "../lib/archive.ts";
import { DATA_DIR } from "../lib/paths.ts";

const isStaticFile = (file: string) =>
  !isHtmlFile(file) && file !== ARCHIVE_STYLE_FILE;

const collectStylesheets = async () => {
  const stylesheets = new Map<string, Uint8Array>();

  for (const folder of await listFolders()) {
    const style = await readArchiveStyle(folder);

    if (style && !stylesheets.has(style.hash)) {
      stylesheets.set(style.hash, scopeStylesheet(style.source, style.hash));
    }
  }

  return stylesheets;
};

const DOUBLED_EXTENSION_REGEX = /(\.htm)\.html$/i;

/** Astro appends `.html` to every page, so `X.HTM.html` goes back to its original `X.HTM`. */
const restoreExtensions = async (dir: string) => {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  const doubled = entries.filter(
    (entry) => entry.isFile() && DOUBLED_EXTENSION_REGEX.test(entry.name),
  );

  await Promise.all(
    doubled.map((entry) =>
      rename(
        path.join(entry.parentPath, entry.name),
        path.join(
          entry.parentPath,
          entry.name.replace(DOUBLED_EXTENSION_REGEX, "$1"),
        ),
      ),
    ),
  );

  return doubled.length;
};

const HTML_MINIFY_CONFIG = {
  // These archival documents predate strict markup; keep the structural tags
  // rather than relying on optional-tag omission.
  keep_closing_tags: true,
  keep_html_and_head_opening_tags: true,
  minify_css: true,
};

const minifyPages = async (dir: string) => {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  const pages = entries.filter(
    (entry) => entry.isFile() && isHtmlFile(entry.name),
  );

  await Promise.all(
    pages.map(async (entry) => {
      const file = path.join(entry.parentPath, entry.name);

      await writeFile(
        file,
        minifyHtml.minify(await readFile(file), HTML_MINIFY_CONFIG),
      );
    }),
  );

  return pages.length;
};

const STYLE_URL_REGEX = new RegExp(`^/${ARCHIVE_STYLE_DIR}/([0-9a-f]+)\\.css$`);

/** Serves the scoped stylesheets and a year's static files, which only exist in `dist/` after a build. */
const readDevAsset = async (requestUrl: string) => {
  const url = decodeURIComponent(requestUrl.split("?")[0] ?? "");
  const styleHash = url.match(STYLE_URL_REGEX)?.[1];

  if (styleHash) {
    const css = (await collectStylesheets()).get(styleHash);

    return css ? { type: "text/css", body: css } : null;
  }

  const [, folder, file, ...rest] = url.split("/");

  if (!(folder && file) || rest.length > 0 || !isStaticFile(file)) return null;

  try {
    return {
      type: undefined,
      body: await readFile(path.join(DATA_DIR, folder, file)),
    };
  } catch {
    return null;
  }
};

export const archiveAssets = (): AstroIntegration => ({
  name: "results-archive-assets",
  hooks: {
    "astro:server:setup": ({ server }) => {
      server.middlewares.use((req, res, next) => {
        readDevAsset(req.url ?? "").then((asset) => {
          if (!asset) return next();

          if (asset.type) res.setHeader("Content-Type", asset.type);
          res.end(asset.body);
        }, next);
      });
    },
    "astro:build:done": async ({ dir, logger }) => {
      const outDir = fileURLToPath(dir);
      const styleDir = path.join(outDir, ARCHIVE_STYLE_DIR);

      await mkdir(styleDir, { recursive: true });

      const stylesheets = await collectStylesheets();

      for (const [hash, css] of stylesheets) {
        await writeFile(path.join(styleDir, `${hash}.css`), css);
      }

      let copied = 0;

      for (const folder of await listFolders()) {
        for (const file of (await listFiles(folder)).filter(isStaticFile)) {
          await mkdir(path.join(outDir, folder), { recursive: true });
          await copyFile(
            path.join(DATA_DIR, folder, file),
            path.join(outDir, folder, file),
          );
          copied++;
        }
      }

      const restored = await restoreExtensions(outDir);
      const minified = await minifyPages(outDir);

      logger.info(
        `${stylesheets.size} scoped stylesheets, ${copied} static files, ${restored} .htm pages, ${minified} pages minified`,
      );
    },
  },
});
