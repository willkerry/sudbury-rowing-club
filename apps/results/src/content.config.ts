import path from "node:path";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { listFolders, readFolder } from "./lib/archive.ts";
import { DATA_DIR } from "./lib/paths.ts";

const archiveLoader: Loader = {
  name: "results-archive",
  load: async ({ store, logger, watcher }) => {
    const loadFolder = async (folder: string) => {
      for (const page of await readFolder(folder)) {
        const { html, ...data } = page;

        store.set({ id: page.id, data, rendered: { html } });
      }
    };

    store.clear();

    const folders = await listFolders();

    await Promise.all(folders.map(loadFolder));

    logger.info(
      `Loaded ${store.keys().length} pages from ${folders.length} folders`,
    );

    watcher?.add(DATA_DIR);
    watcher?.on("all", async (_event, changed) => {
      if (!changed.startsWith(DATA_DIR)) return;

      const [folder] = path.relative(DATA_DIR, changed).split(path.sep);

      if (!folder) return;

      for (const id of store.keys()) {
        if (id.startsWith(`${folder}/`)) store.delete(id);
      }

      await loadFolder(folder).then(
        () => logger.info(`Reloaded ${folder}`),
        (error) => logger.error(`Couldn't reload ${folder}: ${error}`),
      );
    });
  },
};

const archive = defineCollection({
  loader: archiveLoader,
  schema: z.object({
    id: z.string(),
    folder: z.string(),
    file: z.string(),
    year: z.number().nullable(),
    kind: z.enum(["index", "event", "club", "division", "page"]),
    label: z.string(),
    empty: z.boolean(),
    style: z.string().nullable(),
  }),
});

export const collections = { archive };
