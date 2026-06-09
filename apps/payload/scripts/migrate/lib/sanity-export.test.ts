import { describe, expect, it } from "bun:test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createSanityExportReader, type SanityDoc } from "./sanity-export";

function fixtureDir(lines: string[]): string {
  const dir = mkdtempSync(join(tmpdir(), "sanity-export-"));
  writeFileSync(join(dir, "data.ndjson"), lines.join("\n"));

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

  it("resolves an asset by _ref", async () => {
    const dir = fixtureDir([
      JSON.stringify({
        _id: "image-abc-100x100-jpg",
        _type: "sanity.imageAsset",
        mimeType: "image/jpeg",
        originalFilename: "p.jpg",
        path: "images/proj/ds/abc-100x100.jpg",
        size: 1,
      }),
    ]);
    const reader = createSanityExportReader(dir);
    await reader.preload();

    const asset = reader.resolveAsset("image-abc-100x100-jpg");
    expect(asset?.originalFilename).toBe("p.jpg");
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
