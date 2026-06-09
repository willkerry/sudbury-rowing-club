import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";

export interface SanityDoc {
  _id: string;
  _type: string;
  _updatedAt?: string;
  [key: string]: unknown;
}

export interface SanityAsset extends SanityDoc {
  _type: "sanity.imageAsset" | "sanity.fileAsset";
  altText?: string;
  mimeType: string;
  originalFilename: string;
  path: string;
  size: number;
}

export interface SanityExportReader {
  docById: (id: string) => Promise<SanityDoc | undefined>;
  docsOfType: (type: string) => AsyncIterable<SanityDoc>;
  exportDir: string;
  preload: () => Promise<void>;
  readAssetBytes: (asset: SanityAsset) => Promise<Buffer>;
  resolveAsset: (ref: string) => SanityAsset | undefined;
}

const DEFAULT_EXPORT_DIR = ".sanity-export";

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

  async function preload(): Promise<void> {
    if (assetsByRef) return;
    assetsByRef = new Map();
    for await (const doc of iterAll()) {
      if (
        doc._type === "sanity.imageAsset" ||
        doc._type === "sanity.fileAsset"
      ) {
        assetsByRef.set(doc._id, doc as SanityAsset);
      }
    }
  }

  function resolveAsset(ref: string): SanityAsset | undefined {
    if (!assetsByRef) {
      throw new Error("resolveAsset called before preload()");
    }

    return assetsByRef.get(ref);
  }

  async function readAssetBytes(asset: SanityAsset): Promise<Buffer> {
    const folder = asset._type === "sanity.imageAsset" ? "images" : "files";
    const filename = asset.path.split("/").pop();
    if (!filename) throw new Error(`Bad asset path: ${asset.path}`);
    const filePath = join(exportDir, folder, filename);
    const { readFile } = await import("node:fs/promises");

    return readFile(filePath);
  }

  return {
    docsOfType,
    docById,
    preload,
    resolveAsset,
    readAssetBytes,
    exportDir,
  };
}
