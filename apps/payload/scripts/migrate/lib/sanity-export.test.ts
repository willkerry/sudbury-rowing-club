import { describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createSanityExportReader, type SanityDoc } from "./sanity-export";

function fixtureDir(
  lines: string[],
  opts: {
    assets?: Record<
      string,
      { originalFilename: string; sha1hash: string; size: number }
    >;
    images?: string[];
    files?: string[];
  } = {},
): string {
  const dir = mkdtempSync(join(tmpdir(), "sanity-export-"));
  writeFileSync(join(dir, "data.ndjson"), lines.join("\n"));
  if (opts.assets) {
    writeFileSync(join(dir, "assets.json"), JSON.stringify(opts.assets));
  }
  if (opts.images?.length) {
    mkdirSync(join(dir, "images"), { recursive: true });
    for (const f of opts.images) {
      writeFileSync(join(dir, "images", f), Buffer.from([0x01]));
    }
  }
  if (opts.files?.length) {
    mkdirSync(join(dir, "files"), { recursive: true });
    for (const f of opts.files) {
      writeFileSync(join(dir, "files", f), Buffer.from([0x02]));
    }
  }

  return dir;
}

describe("createSanityExportReader", () => {
  it("yields documents of the requested _type", async () => {
    const dir = fixtureDir([
      JSON.stringify({ _id: "a", _type: "safety", title: "First" }),
      JSON.stringify({ _id: "b", _type: "other", title: "Skip" }),
      JSON.stringify({ _id: "c", _type: "safety", title: "Second" }),
    ]);
    const reader = createSanityExportReader(dir);

    const docs: SanityDoc[] = [];
    for await (const doc of reader.docsOfType("safety")) docs.push(doc);

    expect(docs.map((d) => d._id)).toEqual(["a", "c"]);
  });

  it("skips drafts.* documents by default", async () => {
    const dir = fixtureDir([
      JSON.stringify({ _id: "drafts.a", _type: "safety", title: "Draft" }),
      JSON.stringify({ _id: "b", _type: "safety", title: "Published" }),
    ]);
    const reader = createSanityExportReader(dir);

    const docs: SanityDoc[] = [];
    for await (const doc of reader.docsOfType("safety")) docs.push(doc);

    expect(docs.map((d) => d._id)).toEqual(["b"]);
  });

  it("resolves a legacy in-ndjson asset by _ref", async () => {
    const dir = fixtureDir(
      [
        JSON.stringify({
          _id: "image-abc-100x100-jpg",
          _type: "sanity.imageAsset",
          mimeType: "image/jpeg",
          originalFilename: "p.jpg",
          path: "images/proj/ds/abc-100x100.jpg",
          size: 1,
        }),
      ],
      { images: ["abc-100x100.jpg"] },
    );
    const reader = createSanityExportReader(dir);
    await reader.preload();

    const asset = reader.resolveAsset("image-abc-100x100-jpg");
    expect(asset?.originalFilename).toBe("p.jpg");
    expect(asset?.diskFilename).toBe("abc-100x100.jpg");
  });

  it("resolves an asset declared in assets.json", async () => {
    const dir = fixtureDir([], {
      files: ["def.pdf"],
      images: ["abc-100x100.jpg"],
      assets: {
        "file-def-pdf": {
          originalFilename: "p.pdf",
          sha1hash: "def",
          size: 99,
        },
        "image-abc-100x100-jpg": {
          originalFilename: "p.jpg",
          sha1hash: "abc",
          size: 42,
        },
      },
    });
    const reader = createSanityExportReader(dir);
    await reader.preload();

    const image = reader.resolveAsset("image-abc-100x100-jpg");
    expect(image?.diskFilename).toBe("abc-100x100.jpg");
    expect(image?.mimeType).toBe("image/jpeg");
    expect(image?._type).toBe("sanity.imageAsset");

    const file = reader.resolveAsset("file-def-pdf");
    expect(file?.diskFilename).toBe("def.pdf");
    expect(file?.mimeType).toBe("application/pdf");
    expect(file?._type).toBe("sanity.fileAsset");
  });

  it("skips assets.json entries with no matching on-disk file", async () => {
    const dir = fixtureDir([], {
      assets: {
        "image-orphan-100x100-jpg": {
          originalFilename: "x.jpg",
          sha1hash: "orphan",
          size: 1,
        },
      },
    });
    const reader = createSanityExportReader(dir);
    await reader.preload();

    expect(reader.resolveAsset("image-orphan-100x100-jpg")).toBeUndefined();
  });

  it("returns the singleton document by _id", async () => {
    const dir = fixtureDir([
      JSON.stringify({
        _id: "safetyStatus",
        _type: "safetyStatus",
        status: "green",
      }),
    ]);
    const reader = createSanityExportReader(dir);

    const doc = await reader.docById("safetyStatus");
    expect(doc?.status).toBe("green");
  });
});
