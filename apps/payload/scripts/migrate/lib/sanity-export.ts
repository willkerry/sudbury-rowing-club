import {
  createReadStream,
  existsSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import { extname, join } from "node:path";
import { createInterface } from "node:readline";

export interface SanityDoc {
  _id: string;
  _type: string;
  _updatedAt?: string;
  [key: string]: unknown;
}

export interface SanityAsset {
  _id: string;
  _type: "sanity.imageAsset" | "sanity.fileAsset";
  altText?: string;
  diskFilename: string;
  mimeType: string;
  originalFilename: string;
  size: number;
}

export interface SanityExportReader {
  allAssets: () => SanityAsset[];
  allDocs: () => AsyncIterable<SanityDoc>;
  docById: (id: string) => Promise<SanityDoc | undefined>;
  docsOfType: (type: string) => AsyncIterable<SanityDoc>;
  exportDir: string;
  preload: () => Promise<void>;
  readAssetBytes: (asset: SanityAsset) => Promise<Buffer>;
  resolveAsset: (ref: string) => SanityAsset | undefined;
}

const DEFAULT_EXPORT_DIR = ".sanity-export";

const MIME_TYPES: Record<string, string> = {
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const DISK_FILENAME_HASH_RE = /[-.]/;

function mimeFromName(name: string): string {
  return MIME_TYPES[extname(name).toLowerCase()] ?? "application/octet-stream";
}

export function createSanityExportReader(
  exportDir: string = DEFAULT_EXPORT_DIR,
): SanityExportReader {
  const ndjson = join(exportDir, "data.ndjson");
  if (!existsSync(ndjson)) {
    throw new Error(
      `Sanity export not found at ${ndjson}. Run "pnpm migrate:export-sanity" first.`,
    );
  }

  let assetsByRef: Map<string, SanityAsset> | undefined;

  async function* iterAll(): AsyncIterable<SanityDoc> {
    const stream = createReadStream(ndjson, { encoding: "utf-8" });
    const rl = createInterface({
      crlfDelay: Number.POSITIVE_INFINITY,
      input: stream,
    });
    for await (const line of rl) {
      if (!line.trim()) continue;
      yield JSON.parse(line) as SanityDoc;
    }
  }

  async function* docsOfType(type: string): AsyncIterable<SanityDoc> {
    for await (const doc of iterAll()) {
      if (doc._type !== type) continue;
      if (doc._id.startsWith("drafts.")) continue;
      yield doc;
    }
  }

  async function docById(id: string): Promise<SanityDoc | undefined> {
    for await (const doc of iterAll()) {
      if (doc._id === id) return doc;
    }

    return;
  }

  function discoverDiskFilenames(
    folder: "images" | "files",
  ): Map<string, string> {
    // Map of bare sha1 hash → on-disk filename.
    // Images: "<sha1>-<dims>.<ext>"; Files: "<sha1>.<ext>".
    const dir = join(exportDir, folder);
    if (!existsSync(dir)) return new Map();
    const map = new Map<string, string>();
    for (const name of readdirSync(dir)) {
      const hash = name.split(DISK_FILENAME_HASH_RE)[0];
      map.set(hash, name);
    }

    return map;
  }

  function fromAssetsJsonEntry(
    id: string,
    meta: { originalFilename?: string; sha1hash?: string; size?: number },
    imageDisk: Map<string, string>,
    fileDisk: Map<string, string>,
  ): SanityAsset | undefined {
    const kind = id.startsWith("image-")
      ? ("sanity.imageAsset" as const)
      : ("sanity.fileAsset" as const);
    const disk = (kind === "sanity.imageAsset" ? imageDisk : fileDisk).get(
      meta.sha1hash ?? "",
    );
    if (!(meta.sha1hash && disk)) return;
    const original = meta.originalFilename ?? disk;

    return {
      _id: id,
      _type: kind,
      diskFilename: disk,
      mimeType: mimeFromName(original),
      originalFilename: original,
      size: meta.size ?? 0,
    };
  }

  function loadAssetsJson(into: Map<string, SanityAsset>): void {
    const assetsJsonPath = join(exportDir, "assets.json");
    if (!existsSync(assetsJsonPath)) return;
    const imageDisk = discoverDiskFilenames("images");
    const fileDisk = discoverDiskFilenames("files");
    const raw = JSON.parse(readFileSync(assetsJsonPath, "utf-8")) as Record<
      string,
      { originalFilename?: string; sha1hash?: string; size?: number }
    >;
    for (const [id, meta] of Object.entries(raw)) {
      const asset = fromAssetsJsonEntry(id, meta, imageDisk, fileDisk);
      if (asset) into.set(id, asset);
    }
  }

  function fromNdjsonDoc(doc: SanityDoc): SanityAsset | undefined {
    const path = (doc.path as string | undefined) ?? "";
    const diskFilename = path.split("/").pop() ?? "";
    if (!diskFilename) return;
    const original =
      (doc.originalFilename as string | undefined) ?? diskFilename;

    return {
      _id: doc._id,
      _type: doc._type as "sanity.imageAsset" | "sanity.fileAsset",
      altText: doc.altText as string | undefined,
      diskFilename,
      mimeType: (doc.mimeType as string | undefined) ?? mimeFromName(original),
      originalFilename: original,
      size: (doc.size as number | undefined) ?? 0,
    };
  }

  async function mergeNdjsonAssets(
    into: Map<string, SanityAsset>,
  ): Promise<void> {
    for await (const doc of iterAll()) {
      if (
        doc._type !== "sanity.imageAsset" &&
        doc._type !== "sanity.fileAsset"
      ) {
        continue;
      }
      const asset = fromNdjsonDoc(doc);
      if (asset) into.set(doc._id, asset);
    }
  }

  async function preload(): Promise<void> {
    if (assetsByRef) return;
    assetsByRef = new Map();
    loadAssetsJson(assetsByRef);
    await mergeNdjsonAssets(assetsByRef);
  }

  function resolveAsset(ref: string): SanityAsset | undefined {
    if (!assetsByRef) {
      throw new Error("resolveAsset called before preload()");
    }

    return assetsByRef.get(ref);
  }

  function allAssets(): SanityAsset[] {
    if (!assetsByRef) {
      throw new Error("allAssets called before preload()");
    }

    return [...assetsByRef.values()];
  }

  async function readAssetBytes(asset: SanityAsset): Promise<Buffer> {
    const folder = asset._type === "sanity.imageAsset" ? "images" : "files";
    const filePath = join(exportDir, folder, asset.diskFilename);
    const { readFile } = await import("node:fs/promises");

    return readFile(filePath);
  }

  async function* allDocs(): AsyncIterable<SanityDoc> {
    for await (const doc of iterAll()) {
      if (doc._id.startsWith("drafts.")) continue;
      yield doc;
    }
  }

  return {
    allAssets,
    allDocs,
    docById,
    docsOfType,
    exportDir,
    preload,
    readAssetBytes,
    resolveAsset,
  };
}
