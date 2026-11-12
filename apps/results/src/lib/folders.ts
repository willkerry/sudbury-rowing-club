import { type CollectionEntry, getCollection } from "astro:content";

export type ArchiveEntry = CollectionEntry<"archive">;

export interface ArchiveFolder {
  name: string;
  label: string;
  year: number | null;
  pages: ArchiveEntry[];
  /** Pages with content, for listings and counts; empty ones still build at their URLs. */
  listed: ArchiveEntry[];
  index: ArchiveEntry | undefined;
}

// The root redirects to the club site's results page, so in-app links use this.
export const ALL_REGATTAS_URL = "/all";

export const pageUrl = (entry: ArchiveEntry) =>
  encodeURI(`/${entry.data.folder}/${entry.data.file}`);

// Astro reads a trailing `/index` as the directory, so these get their own route.
export const isDirectoryIndex = (entry: ArchiveEntry) =>
  entry.id === `${entry.data.folder}/index`;

export const listingUrl = (folder: string) => `/${folder}/_listing.html`;

export const folderUrl = (folder: ArchiveFolder) =>
  folder.index ? pageUrl(folder.index) : listingUrl(folder.name);

const collator = new Intl.Collator("en-GB", {
  numeric: true,
  sensitivity: "base",
});

export const byLabel = (a: ArchiveEntry, b: ArchiveEntry) =>
  collator.compare(a.data.label, b.data.label);

export const getFolders = async (): Promise<ArchiveFolder[]> => {
  const entries = await getCollection("archive");
  const folders = new Map<string, ArchiveFolder>();

  for (const entry of entries) {
    const { folder, year, kind } = entry.data;
    const existing = folders.get(folder) ?? {
      name: folder,
      label: year ? String(year) : folder,
      year,
      pages: [],
      listed: [],
      index: undefined,
    };

    existing.pages.push(entry);

    if (!entry.data.empty) existing.listed.push(entry);

    if (isDirectoryIndex(entry) || (kind === "index" && !existing.index)) {
      existing.index = entry;
    }

    folders.set(folder, existing);
  }

  return [...folders.values()].sort(
    (a, b) =>
      (b.year ?? -1) - (a.year ?? -1) || collator.compare(a.name, b.name),
  );
};

export const getFolder = async (name: string) =>
  (await getFolders()).find((folder) => folder.name === name);
