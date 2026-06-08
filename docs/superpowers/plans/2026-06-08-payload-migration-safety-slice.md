# Payload Migration — Safety Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the Sudbury Rowing Club's Safety feature (notices collection + status global) from Sanity to Payload, building the reusable migration harness in the process so subsequent collections can re-use it.

**Architecture:** Bun-run TypeScript scripts under `apps/payload/scripts/migrate/` read from a Sanity dataset export, transform each document through hand-rolled converters (Portable Text → Lexical, asset → R2 Media), and upsert via Payload's Local API against the local miniflare-backed D1 + R2 bindings. Wipe-and-replay per collection.

**Tech Stack:** Payload CMS 3.85 (D1 + R2 + Lexical), Bun (script runtime + test runner), `@sanity/cli` (dataset export), wrangler (binding emulation), TypeScript 5.7.

**Spec:** [`docs/superpowers/specs/2026-06-08-payload-migration-design.md`](../specs/2026-06-08-payload-migration-design.md)

---

## File map

**Modified:**
- `apps/payload/src/collections/Media.ts` — add `sanityAssetId` field
- `apps/payload/src/collections/SafetyNotices.ts` — add `slug`/`sanityDocId` + tweaks
- `apps/payload/src/payload.config.ts` — register custom Lexical blocks
- `apps/payload/package.json` — devDeps + `migrate:*` scripts
- `apps/payload/.gitignore` — ignore `.sanity-export/`

**Created:**
- `apps/payload/src/lib/lexical/quote-block.ts`
- `apps/payload/src/lib/lexical/note-block.ts`
- `apps/payload/src/lib/lexical/oembed-block.ts`
- `apps/payload/scripts/sanity-export.ts`
- `apps/payload/scripts/migrate/lib/payload-client.ts`
- `apps/payload/scripts/migrate/lib/sanity-export.ts`
- `apps/payload/scripts/migrate/lib/wipe.ts`
- `apps/payload/scripts/migrate/lib/slug.ts`
- `apps/payload/scripts/migrate/lib/assets.ts`
- `apps/payload/scripts/migrate/lib/portable-text-to-lexical.ts`
- `apps/payload/scripts/migrate/lib/portable-text-to-lexical.test.ts`
- `apps/payload/scripts/migrate/safety.ts`
- `apps/payload/scripts/migrate/safety-status.ts`
- `apps/payload/scripts/migrate/all.ts`

**Deleted:**
- `apps/payload/src/collections/Trustees.1.ts`
- `apps/payload/src/migrations/*` (regenerated in Task 2)

---

## Task 1: Remove stale duplicate collection file

**Files:**
- Delete: `apps/payload/src/collections/Trustees.1.ts`

- [ ] **Step 1: Verify the file is unused**

```bash
grep -rn "Trustees\.1" /Users/will/Developer/sudbury-rowing-club/apps/payload/src
```

Expected: zero matches (the active import in `payload.config.ts` is `./collections/Trustees`).

- [ ] **Step 2: Delete the file**

```bash
rm /Users/will/Developer/sudbury-rowing-club/apps/payload/src/collections/Trustees.1.ts
```

- [ ] **Step 3: Run type-check from the monorepo root**

```bash
cd /Users/will/Developer/sudbury-rowing-club && pnpm --filter @sudburyrc/payload exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/src/collections/Trustees.1.ts
git commit -m "chore(payload): remove stale Trustees.1.ts duplicate"
```

---

## Task 2: Regenerate schema migrations on UUID PK config

The `idType: "uuid"` config was added after the existing migrations were generated, so the migrations still use integer PKs. With no production data yet, we wipe and regenerate. **Verification of the regenerated SQL is the load-bearing step.**

**Files:**
- Delete: `apps/payload/src/migrations/20250929_111647.{json,ts}`
- Delete: `apps/payload/src/migrations/20260607_163441.{json,ts}`
- Delete: `apps/payload/src/migrations/index.ts`
- Recreated by `payload migrate:create`: `apps/payload/src/migrations/<timestamp>.{json,ts}` + `index.ts`

- [ ] **Step 1: Clear the local D1 state and existing migrations**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
rm -rf .wrangler/state/v3/d1
rm src/migrations/2025*.{json,ts}
rm src/migrations/2026*.{json,ts}
rm src/migrations/index.ts
```

- [ ] **Step 2: Generate the initial migration**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm payload migrate:create --name initial
```

Expected: a new `src/migrations/<timestamp>_initial.ts` plus `<timestamp>_initial.json` and a fresh `index.ts` re-exporting it.

- [ ] **Step 3: Verify TEXT primary keys in the generated SQL**

```bash
grep -nE '"(id)" (text|integer)' /Users/will/Developer/sudbury-rowing-club/apps/payload/src/migrations/*_initial.ts | head -40
```

Expected: every `id` column should be `text`, not `integer`. If any `id` columns show `integer`, **stop and investigate** — `idType: "uuid"` is not being honoured. Likely fix: confirm `db: sqliteD1Adapter({ ..., idType: "uuid" })` is on the latest `@payloadcms/db-d1-sqlite` (3.85.0 supports it).

- [ ] **Step 4: Run the migration locally to confirm it applies clean**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm payload migrate
```

Expected: "Migration created successfully" or equivalent, no errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/src/migrations
git commit -m "chore(payload): regenerate initial migration with uuid PKs"
```

---

## Task 3: Add `sanityAssetId` field to Media

**Files:**
- Modify: `apps/payload/src/collections/Media.ts`
- Generated: a new migration in `apps/payload/src/migrations/`

- [ ] **Step 1: Update the Media collection**

Replace `apps/payload/src/collections/Media.ts` with:

```ts
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      required: true,
      type: "text",
    },
    {
      name: "caption",
      type: "textarea",
    },
    {
      name: "sanityAssetId",
      type: "text",
      index: true,
      admin: {
        hidden: true,
        description:
          "Original Sanity asset id. Migration uses this for idempotency. Safe to clear once Sanity is gone.",
      },
    },
  ],
  upload: {
    crop: false,
    focalPoint: false,
  },
};
```

- [ ] **Step 2: Regenerate Payload types**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm generate:types:payload
```

Expected: `apps/web/types/payload-types.ts` updated; `Media` interface now includes `sanityAssetId?: string | null`.

- [ ] **Step 3: Generate the schema migration**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm payload migrate:create --name add_media_sanity_asset_id
```

Expected: a new `src/migrations/<timestamp>_add_media_sanity_asset_id.ts` adding the column and an index.

- [ ] **Step 4: Apply migration locally**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm payload migrate
```

Expected: applies cleanly.

- [ ] **Step 5: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/src/collections/Media.ts apps/payload/src/migrations apps/web/types/payload-types.ts
git commit -m "feat(payload): add sanityAssetId to Media for migration idempotency"
```

---

## Task 4: Add custom Lexical blocks (Quote, Note, Oembed) + register on editor

These three blocks are the Sanity custom Portable Text types (`quote`, `note`, `oembed`) that need first-class representation in Lexical so the migration can produce them and the editor can edit them. Each lives in its own file.

**Files:**
- Create: `apps/payload/src/lib/lexical/quote-block.ts`
- Create: `apps/payload/src/lib/lexical/note-block.ts`
- Create: `apps/payload/src/lib/lexical/oembed-block.ts`
- Modify: `apps/payload/src/payload.config.ts`

- [ ] **Step 1: Create the Quote block**

`apps/payload/src/lib/lexical/quote-block.ts`:

```ts
import type { Block } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export const QuoteBlock: Block = {
  slug: "quote",
  interfaceName: "QuoteBlock",
  labels: { singular: "Quote", plural: "Quotes" },
  fields: [
    {
      name: "body",
      type: "richText",
      editor: lexicalEditor(),
      required: true,
    },
    {
      name: "attribution",
      type: "text",
    },
  ],
};
```

- [ ] **Step 2: Create the Note block**

`apps/payload/src/lib/lexical/note-block.ts`:

```ts
import type { Block } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export const NoteBlock: Block = {
  slug: "note",
  interfaceName: "NoteBlock",
  labels: { singular: "Note", plural: "Notes" },
  fields: [
    {
      name: "variant",
      type: "select",
      defaultValue: "primary",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
      ],
      required: true,
    },
    {
      name: "body",
      type: "richText",
      editor: lexicalEditor(),
      required: true,
    },
  ],
};
```

- [ ] **Step 3: Create the Oembed block**

`apps/payload/src/lib/lexical/oembed-block.ts`:

```ts
import type { Block } from "payload";

export const OembedBlock: Block = {
  slug: "oembed",
  interfaceName: "OembedBlock",
  labels: { singular: "Embed", plural: "Embeds" },
  fields: [
    {
      name: "url",
      type: "text",
      required: true,
      admin: {
        description: "URL of the embeddable resource (YouTube, Vimeo, etc.)",
      },
    },
  ],
};
```

- [ ] **Step 4: Register the blocks on the editor**

Replace the `editor: lexicalEditor(),` line in `apps/payload/src/payload.config.ts` and add the imports. Find the existing line (around line 77) and the existing import block (around line 4-26).

Add to imports:

```ts
import {
  BlocksFeature,
  lexicalEditor,
  UploadFeature,
} from "@payloadcms/richtext-lexical";
import { NoteBlock } from "./lib/lexical/note-block";
import { OembedBlock } from "./lib/lexical/oembed-block";
import { QuoteBlock } from "./lib/lexical/quote-block";
```

(Note: `lexicalEditor` was previously imported solo from the same package — combine into one import.)

Replace `editor: lexicalEditor(),` with:

```ts
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({ blocks: [QuoteBlock, NoteBlock, OembedBlock] }),
      UploadFeature({ collections: { media: {} } }),
    ],
  }),
```

- [ ] **Step 5: Regenerate types and migration**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm generate:types:payload
pnpm payload migrate:create --name add_lexical_blocks
pnpm payload migrate
```

Expected: types include `QuoteBlock`, `NoteBlock`, `OembedBlock`; migration creates the supporting tables for blocks within rich-text fields.

- [ ] **Step 6: Smoke check — start the admin**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm dev
```

Open `http://localhost:3000/admin`, navigate to a collection with a richText field (e.g. Safety Notices), and confirm the block insert menu now lists Quote, Note, and Embed. Stop the dev server.

- [ ] **Step 7: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/src/lib/lexical apps/payload/src/payload.config.ts apps/payload/src/migrations apps/web/types/payload-types.ts
git commit -m "feat(payload): add Quote/Note/Oembed Lexical blocks for migration"
```

---

## Task 5: SafetyNotices schema tweaks

**Files:**
- Modify: `apps/payload/src/collections/SafetyNotices.ts`
- Generated: a new migration

- [ ] **Step 1: Update SafetyNotices**

Replace `apps/payload/src/collections/SafetyNotices.ts` with:

```ts
import type { CollectionConfig } from "payload";
import { z } from "zod";
import { zv } from "../lib/zv";

export const SafetyNotices: CollectionConfig = {
  slug: "safetyNotices",

  admin: {
    group: "Safety",
    useAsTitle: "title",
    defaultColumns: ["title", "pin", "date"],
  },

  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "URL slug for /safety/<slug>. Auto-set on migration.",
      },
    },
    {
      name: "body",
      type: "richText",
    },
    {
      name: "document",
      type: "group",
      admin: {
        description:
          "Optional attached document. Either fill in both fields or leave both empty.",
      },
      fields: [
        { name: "title", type: "text" },
        {
          name: "document",
          relationTo: "media",
          type: "upload",
        },
      ],
      validate: ((value: { title?: string; document?: string } | null | undefined) => {
        if (!value) return true;
        const hasTitle = Boolean(value.title?.trim());
        const hasUpload = Boolean(value.document);
        if (hasTitle !== hasUpload) {
          return "Either fill in both a document title and a file, or leave both blank.";
        }

        return true;
      }) as never,
    },
    {
      label: "External link URL",
      name: "link",
      type: "text",
      validate: zv(z.url({ message: "This must be a valid URL." }).nullable()),
    },
    {
      label: "Pin to top",
      name: "pin",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "date",
      type: "date",
      defaultValue: () => new Date(),
      admin: {
        description:
          "Displayed as the notice's last updated date. Not necessarily the true last-updated date.",
        position: "sidebar",
      },
    },
    {
      name: "sanityDocId",
      type: "text",
      index: true,
      admin: {
        position: "sidebar",
        hidden: true,
        description:
          "Original Sanity _id. FE fallback during cutover. Removable after.",
      },
    },
  ],

  labels: {
    plural: "Notices",
    singular: "Notice",
  },
};
```

- [ ] **Step 2: Regenerate types and migration**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm generate:types:payload
pnpm payload migrate:create --name safety_notices_fields
pnpm payload migrate
```

Expected: migration adds `slug` (UNIQUE indexed), `sanityDocId` indexed columns; alters `title` to NOT NULL (which is safe because there are no rows yet).

- [ ] **Step 3: Smoke check**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm dev
```

Open the admin, create a test Safety Notice, confirm:
- Title is required (red error if blank).
- Slug is required.
- Pin and date appear in the sidebar.
- Document group rejects "title only" and "file only".

Delete the test record and stop the dev server.

- [ ] **Step 4: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/src/collections/SafetyNotices.ts apps/payload/src/migrations apps/web/types/payload-types.ts
git commit -m "feat(payload): tighten SafetyNotices schema and add slug"
```

---

## Task 6: Add dev deps, npm scripts, and `.gitignore` entry

**Files:**
- Modify: `apps/payload/package.json`
- Modify: `apps/payload/.gitignore` (create if missing)

- [ ] **Step 1: Add devDeps**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm add -D -w=false @sanity/client@^6 @types/bun@latest slugify@^1.6
```

(Bun is assumed already installed globally — `bun --version` should succeed. If you prefer it as a devDep too, add `bun-types` instead of `@types/bun`.)

Expected: `package.json` devDependencies extended.

- [ ] **Step 2: Add migration scripts**

Add the following entries to the `scripts` block of `apps/payload/package.json`:

```jsonc
"migrate:export-sanity": "bun run scripts/sanity-export.ts",
"migrate:safety":         "bun run scripts/migrate/safety.ts",
"migrate:safety-status":  "bun run scripts/migrate/safety-status.ts",
"migrate:all":            "bun run scripts/migrate/all.ts",
"migrate:test":           "bun test scripts/migrate"
```

- [ ] **Step 3: Add `.sanity-export/` to `.gitignore`**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
[ -f .gitignore ] || touch .gitignore
echo "" >> .gitignore
echo "# Sanity dataset exports (large; pulled fresh per cutover)" >> .gitignore
echo ".sanity-export/" >> .gitignore
```

- [ ] **Step 4: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/package.json apps/payload/.gitignore pnpm-lock.yaml
git commit -m "chore(payload): add migration deps and scripts"
```

---

## Task 7: `payload-client.ts` — bootstrap with miniflare bindings

**Files:**
- Create: `apps/payload/scripts/migrate/lib/payload-client.ts`

- [ ] **Step 1: Implement the bootstrap**

`apps/payload/scripts/migrate/lib/payload-client.ts`:

```ts
import { getPlatformProxy } from "wrangler";
import { getPayload, type Payload } from "payload";
import config from "../../../src/payload.config";

let cached: Payload | undefined;

/**
 * Returns a Payload instance bound to the local wrangler-emulated D1 + R2.
 * Cached so successive calls within one process re-use the same instance.
 */
export async function getPayloadClient(): Promise<Payload> {
  if (cached) return cached;
  await getPlatformProxy({ environment: process.env.CLOUDFLARE_ENV });
  cached = await getPayload({ config });

  return cached;
}
```

- [ ] **Step 2: Smoke test it**

Create a temporary file `apps/payload/scripts/migrate/_smoke.ts`:

```ts
import { getPayloadClient } from "./lib/payload-client";

const payload = await getPayloadClient();
const result = await payload.find({ collection: "users", limit: 1 });
console.log(JSON.stringify({ ok: true, count: result.totalDocs }));
process.exit(0);
```

Run:

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
bun run scripts/migrate/_smoke.ts
```

Expected: prints `{"ok":true,"count":0}` (or some count). If `getPlatformProxy` complains under Bun, fall back to running with `tsx`:

```bash
pnpm exec tsx scripts/migrate/_smoke.ts
```

If `tsx` works but `bun` doesn't, change the npm scripts in Task 6 to use `tsx` for the wrapper. Document the choice in `apps/payload/scripts/migrate/README.md` (one-liner).

- [ ] **Step 3: Delete the smoke file and commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
rm scripts/migrate/_smoke.ts
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/scripts
git commit -m "feat(payload): add payload-client bootstrap for migration scripts"
```

---

## Task 8: `lib/sanity-export.ts` — NDJSON reader

**Files:**
- Create: `apps/payload/scripts/migrate/lib/sanity-export.ts`

- [ ] **Step 1: Write the failing tests**

Create `apps/payload/scripts/migrate/lib/sanity-export.test.ts`:

```ts
import { describe, expect, it } from "bun:test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  createSanityExportReader,
  type SanityDoc,
} from "./sanity-export";

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
        originalFilename: "p.jpg",
        mimeType: "image/jpeg",
        size: 1,
        path: "images/proj/ds/abc-100x100.jpg",
      }),
    ]);
    const reader = createSanityExportReader(dir);
    await reader.preload();

    const asset = reader.resolveAsset("image-abc-100x100-jpg");
    expect(asset?.originalFilename).toBe("p.jpg");
  });

  it("returns the singleton document by _id", async () => {
    const dir = fixtureDir([
      JSON.stringify({ _id: "safetyStatus", _type: "safetyStatus", status: "green" }),
    ]);
    const reader = createSanityExportReader(dir);

    const doc = await reader.docById("safetyStatus");
    expect(doc?.status).toBe("green");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
bun test scripts/migrate/lib/sanity-export.test.ts
```

Expected: 4 failures (module not found).

- [ ] **Step 3: Implement the reader**

`apps/payload/scripts/migrate/lib/sanity-export.ts`:

```ts
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
  originalFilename: string;
  mimeType: string;
  size: number;
  path: string;
  altText?: string;
}

export interface SanityExportReader {
  docsOfType: (type: string) => AsyncIterable<SanityDoc>;
  docById: (id: string) => Promise<SanityDoc | undefined>;
  preload: () => Promise<void>;
  resolveAsset: (ref: string) => SanityAsset | undefined;
  readAssetBytes: (asset: SanityAsset) => Promise<Buffer>;
  exportDir: string;
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
    const rl = createInterface({ input: stream, crlfDelay: Number.POSITIVE_INFINITY });
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

    return undefined;
  }

  async function preload(): Promise<void> {
    if (assetsByRef) return;
    assetsByRef = new Map();
    for await (const doc of iterAll()) {
      if (doc._type === "sanity.imageAsset" || doc._type === "sanity.fileAsset") {
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

  return { docsOfType, docById, preload, resolveAsset, readAssetBytes, exportDir };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
bun test scripts/migrate/lib/sanity-export.test.ts
```

Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/scripts/migrate/lib/sanity-export.ts apps/payload/scripts/migrate/lib/sanity-export.test.ts
git commit -m "feat(payload): add Sanity NDJSON export reader"
```

---

## Task 9: `lib/wipe.ts` — per-collection truncate

**Files:**
- Create: `apps/payload/scripts/migrate/lib/wipe.ts`

- [ ] **Step 1: Implement**

`apps/payload/scripts/migrate/lib/wipe.ts`:

```ts
import type { CollectionSlug, Payload } from "payload";

/**
 * Deletes every document in the given collection. Used for wipe-and-replay
 * during migration. Intentionally has no guard rail — call sites are
 * expected to know what they are doing. See spec §3.5 for the constraint
 * on versioned collections.
 */
export async function wipe(payload: Payload, collection: CollectionSlug): Promise<number> {
  const result = await payload.delete({
    collection,
    where: { id: { exists: true } },
  });

  return result.docs.length;
}
```

- [ ] **Step 2: Smoke test inline**

Create a temporary `apps/payload/scripts/migrate/_wipe-smoke.ts`:

```ts
import { getPayloadClient } from "./lib/payload-client";
import { wipe } from "./lib/wipe";

const payload = await getPayloadClient();
const seed = await payload.create({
  collection: "safetyNotices",
  data: { title: "temp", slug: "temp", date: new Date().toISOString() },
});
console.log("seeded:", seed.id);
const deleted = await wipe(payload, "safetyNotices");
console.log("deleted:", deleted);
const remaining = await payload.find({ collection: "safetyNotices", limit: 0 });
console.log("remaining:", remaining.totalDocs);
process.exit(0);
```

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
bun run scripts/migrate/_wipe-smoke.ts
```

Expected: `seeded: <uuid>`, `deleted: 1`, `remaining: 0`.

- [ ] **Step 3: Delete smoke file and commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
rm scripts/migrate/_wipe-smoke.ts
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/scripts/migrate/lib/wipe.ts
git commit -m "feat(payload): add wipe() helper for per-collection migration reset"
```

---

## Task 10: `lib/slug.ts` — unique slug generator

**Files:**
- Create: `apps/payload/scripts/migrate/lib/slug.ts`
- Create: `apps/payload/scripts/migrate/lib/slug.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// apps/payload/scripts/migrate/lib/slug.test.ts
import { describe, expect, it } from "bun:test";
import { createSlugger } from "./slug";

describe("createSlugger", () => {
  it("slugifies titles", () => {
    const s = createSlugger();
    expect(s("Hello, World!")).toBe("hello-world");
  });

  it("dedupes by appending -2, -3, ...", () => {
    const s = createSlugger();
    expect(s("Notice")).toBe("notice");
    expect(s("Notice")).toBe("notice-2");
    expect(s("Notice")).toBe("notice-3");
  });

  it("falls back to a placeholder for empty results", () => {
    const s = createSlugger();
    expect(s("???")).toMatch(/^notice-/);
  });
});
```

- [ ] **Step 2: Run tests, verify failure**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
bun test scripts/migrate/lib/slug.test.ts
```

Expected: 3 failures (module not found).

- [ ] **Step 3: Implement**

```ts
// apps/payload/scripts/migrate/lib/slug.ts
import slugify from "slugify";

export type Slugger = (input: string) => string;

export function createSlugger(): Slugger {
  const used = new Map<string, number>();
  let placeholderCount = 0;

  return (input: string) => {
    const base = slugify(input, { lower: true, strict: true, trim: true });
    const candidate = base || `notice-${++placeholderCount}`;
    const count = used.get(candidate) ?? 0;
    used.set(candidate, count + 1);

    return count === 0 ? candidate : `${candidate}-${count + 1}`;
  };
}
```

- [ ] **Step 4: Run tests, verify pass**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
bun test scripts/migrate/lib/slug.test.ts
```

Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/scripts/migrate/lib/slug.ts apps/payload/scripts/migrate/lib/slug.test.ts
git commit -m "feat(payload): add unique-slug generator"
```

---

## Task 11: `lib/assets.ts` — Sanity asset → Payload Media (idempotent)

**Files:**
- Create: `apps/payload/scripts/migrate/lib/assets.ts`

This module is integration-heavy; we test it via the end-to-end run in Task 17, not in isolation.

- [ ] **Step 1: Implement**

The generated `payload-types.ts` lives in `apps/web/types/`, not in the Payload app — that's an artefact of the current `typescript.outputFile` config. Rather than reach across the app boundary, the migration scripts use Payload's inference and a slim local return type.

`apps/payload/scripts/migrate/lib/assets.ts`:

```ts
import type { Payload } from "payload";
import type { SanityAsset, SanityExportReader } from "./sanity-export";

export interface MediaRecord {
  id: string;
  sanityAssetId?: string | null;
  alt?: string | null;
}

/**
 * Look up or create a Media record for a Sanity asset. Idempotent via the
 * `sanityAssetId` column. Reads bytes from the on-disk export and uploads
 * through Payload, which routes to R2 via the storage plugin.
 */
export async function ensureMediaForSanityAsset(
  payload: Payload,
  reader: SanityExportReader,
  asset: SanityAsset,
): Promise<MediaRecord> {
  const existing = await payload.find({
    collection: "media",
    where: { sanityAssetId: { equals: asset._id } },
    limit: 1,
  });
  if (existing.docs[0]) return existing.docs[0] as MediaRecord;

  const data = await reader.readAssetBytes(asset);

  const created = await payload.create({
    collection: "media",
    data: {
      alt: asset.altText ?? asset.originalFilename ?? "",
      sanityAssetId: asset._id,
    } as never, // typed off-app; the runtime shape is correct
    file: {
      name: asset.originalFilename,
      data,
      mimetype: asset.mimeType,
      size: asset.size,
    },
  });

  return created as MediaRecord;
}

/**
 * Convenience: resolve a Sanity asset reference (e.g. "image-abc-100x100-jpg")
 * and ensure a Media record for it. Returns undefined when the reference
 * cannot be found in the export (logged as a warning).
 */
export async function ensureMediaForRef(
  payload: Payload,
  reader: SanityExportReader,
  ref: string | undefined | null,
): Promise<MediaRecord | undefined> {
  if (!ref) return undefined;
  const asset = reader.resolveAsset(ref);
  if (!asset) {
    console.warn(`[assets] no asset found in export for ref ${ref}`);

    return undefined;
  }

  return ensureMediaForSanityAsset(payload, reader, asset);
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm exec tsc --noEmit
```

Expected: no errors. (Some IDE highlight may flag the `payload-types` path; the import path matches what `generate:types:payload` outputs.)

- [ ] **Step 3: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/scripts/migrate/lib/assets.ts
git commit -m "feat(payload): add Sanity-asset → Payload Media uploader"
```

---

## Task 12: PT → Lexical converter — paragraphs, headings, marks, lists

We build the converter incrementally, one block/mark family per task, each fronted by tests.

**Files:**
- Create: `apps/payload/scripts/migrate/lib/portable-text-to-lexical.ts`
- Create: `apps/payload/scripts/migrate/lib/portable-text-to-lexical.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// apps/payload/scripts/migrate/lib/portable-text-to-lexical.test.ts
import { describe, expect, it } from "bun:test";
import { portableTextToLexical } from "./portable-text-to-lexical";

const stubCtx = { resolveUpload: async () => undefined };

describe("portableTextToLexical — text content", () => {
  it("converts a simple paragraph", async () => {
    const out = await portableTextToLexical(
      [
        {
          _type: "block",
          style: "normal",
          children: [{ _type: "span", text: "Hello", marks: [] }],
          markDefs: [],
        },
      ],
      stubCtx,
    );

    const para = out.root.children[0] as { type: string; children: { text: string }[] };
    expect(para.type).toBe("paragraph");
    expect(para.children[0].text).toBe("Hello");
  });

  it("converts heading styles", async () => {
    const out = await portableTextToLexical(
      [
        { _type: "block", style: "h2", children: [{ _type: "span", text: "Two", marks: [] }], markDefs: [] },
        { _type: "block", style: "h3", children: [{ _type: "span", text: "Three", marks: [] }], markDefs: [] },
        { _type: "block", style: "h4", children: [{ _type: "span", text: "Four", marks: [] }], markDefs: [] },
      ],
      stubCtx,
    );

    const tags = (out.root.children as { tag: string }[]).map((c) => c.tag);
    expect(tags).toEqual(["h2", "h3", "h4"]);
  });

  it("applies bold and italic via the format bitmask", async () => {
    const out = await portableTextToLexical(
      [
        {
          _type: "block",
          style: "normal",
          markDefs: [],
          children: [
            { _type: "span", text: "bold", marks: ["strong"] },
            { _type: "span", text: " plus italic", marks: ["em"] },
            { _type: "span", text: " both", marks: ["strong", "em"] },
          ],
        },
      ],
      stubCtx,
    );

    const spans = (out.root.children[0] as { children: { format: number }[] }).children;
    // Lexical text format bits: bold=1, italic=2
    expect(spans[0].format).toBe(1);
    expect(spans[1].format).toBe(2);
    expect(spans[2].format).toBe(3);
  });

  it("converts link marks to link nodes", async () => {
    const out = await portableTextToLexical(
      [
        {
          _type: "block",
          style: "normal",
          markDefs: [{ _key: "k1", _type: "link", href: "https://example.com" }],
          children: [{ _type: "span", text: "click", marks: ["k1"] }],
        },
      ],
      stubCtx,
    );

    const link = (out.root.children[0] as { children: { type: string; fields: { url: string } }[] })
      .children[0];
    expect(link.type).toBe("link");
    expect(link.fields.url).toBe("https://example.com");
  });

  it("groups consecutive list items into a list node", async () => {
    const out = await portableTextToLexical(
      [
        {
          _type: "block",
          style: "normal",
          listItem: "bullet",
          level: 1,
          markDefs: [],
          children: [{ _type: "span", text: "one", marks: [] }],
        },
        {
          _type: "block",
          style: "normal",
          listItem: "bullet",
          level: 1,
          markDefs: [],
          children: [{ _type: "span", text: "two", marks: [] }],
        },
        {
          _type: "block",
          style: "normal",
          markDefs: [],
          children: [{ _type: "span", text: "after", marks: [] }],
        },
      ],
      stubCtx,
    );

    expect((out.root.children[0] as { type: string }).type).toBe("list");
    expect((out.root.children[0] as { children: unknown[] }).children).toHaveLength(2);
    expect((out.root.children[1] as { type: string }).type).toBe("paragraph");
  });
});
```

- [ ] **Step 2: Run tests, verify failure**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
bun test scripts/migrate/lib/portable-text-to-lexical.test.ts
```

Expected: 5 failures (module not found).

- [ ] **Step 3: Implement core converter (text/heading/marks/lists)**

`apps/payload/scripts/migrate/lib/portable-text-to-lexical.ts`:

```ts
export interface PortableTextSpan {
  _type: "span";
  text: string;
  marks: string[];
}

export interface PortableTextMarkDef {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

export interface PortableTextBlock {
  _type: "block";
  style?: string;
  listItem?: "bullet" | "number";
  level?: number;
  children: PortableTextSpan[];
  markDefs: PortableTextMarkDef[];
}

export type PortableTextNode = PortableTextBlock | { _type: string; [key: string]: unknown };

export interface ConvertContext {
  /** Resolve a Sanity asset reference to a Payload Media id (for upload nodes). */
  resolveUpload: (ref: string) => Promise<string | undefined>;
}

interface LexicalText {
  type: "text";
  text: string;
  format: number;
  detail: number;
  mode: "normal";
  style: "";
  version: 1;
}

interface LexicalLink {
  type: "link";
  fields: { linkType: "custom"; newTab: boolean; url: string };
  children: LexicalText[];
  format: "";
  indent: 0;
  version: 2;
  direction: "ltr";
}

type LexicalInline = LexicalText | LexicalLink;

interface LexicalParagraph {
  type: "paragraph";
  children: LexicalInline[];
  format: "";
  indent: 0;
  version: 1;
  direction: "ltr";
  textFormat: 0;
}

interface LexicalHeading {
  type: "heading";
  tag: "h2" | "h3" | "h4";
  children: LexicalInline[];
  format: "";
  indent: 0;
  version: 1;
  direction: "ltr";
}

interface LexicalListItem {
  type: "listitem";
  value: number;
  children: LexicalInline[];
  format: "";
  indent: 0;
  version: 1;
  direction: "ltr";
}

interface LexicalList {
  type: "list";
  tag: "ul" | "ol";
  listType: "bullet" | "number";
  start: 1;
  children: LexicalListItem[];
  format: "";
  indent: 0;
  version: 1;
  direction: "ltr";
}

type LexicalBlock = LexicalParagraph | LexicalHeading | LexicalList | LexicalCustomBlock | LexicalUpload;

interface LexicalCustomBlock {
  type: "block";
  fields: Record<string, unknown> & { blockType: string };
  format: "";
  version: 2;
}

interface LexicalUpload {
  type: "upload";
  relationTo: "media";
  value: string;
  fields: null;
  format: "";
  version: 3;
}

export interface LexicalRoot {
  root: {
    type: "root";
    children: LexicalBlock[];
    format: "";
    indent: 0;
    version: 1;
    direction: "ltr";
  };
}

const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 2;

function text(value: string, format = 0): LexicalText {
  return {
    type: "text",
    text: value,
    format,
    detail: 0,
    mode: "normal",
    style: "",
    version: 1,
  };
}

function emptyParagraph(): LexicalParagraph {
  return {
    type: "paragraph",
    children: [text("")],
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    textFormat: 0,
  };
}

function markFormat(marks: string[]): number {
  let f = 0;
  if (marks.includes("strong")) f |= FORMAT_BOLD;
  if (marks.includes("em")) f |= FORMAT_ITALIC;

  return f;
}

function spansToInline(block: PortableTextBlock): LexicalInline[] {
  const out: LexicalInline[] = [];
  for (const span of block.children) {
    const linkMarkKey = span.marks.find((m) =>
      block.markDefs.some((d) => d._key === m && d._type === "link"),
    );
    const inlineFormat = markFormat(span.marks);
    const node = text(span.text, inlineFormat);
    if (linkMarkKey) {
      const def = block.markDefs.find((d) => d._key === linkMarkKey) as
        | { href?: string }
        | undefined;
      out.push({
        type: "link",
        fields: { linkType: "custom", newTab: false, url: def?.href ?? "" },
        children: [node],
        format: "",
        indent: 0,
        version: 2,
        direction: "ltr",
      });
    } else {
      out.push(node);
    }
  }

  return out;
}

function blockToTopLevel(block: PortableTextBlock): LexicalParagraph | LexicalHeading {
  const children = spansToInline(block);
  if (block.style === "h2" || block.style === "h3" || block.style === "h4") {
    return {
      type: "heading",
      tag: block.style,
      children,
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
    };
  }

  return {
    type: "paragraph",
    children,
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    textFormat: 0,
  };
}

function buildList(blocks: PortableTextBlock[], kind: "bullet" | "number"): LexicalList {
  return {
    type: "list",
    tag: kind === "bullet" ? "ul" : "ol",
    listType: kind,
    start: 1,
    children: blocks.map((b, i) => ({
      type: "listitem",
      value: i + 1,
      children: spansToInline(b),
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
    })),
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
  };
}

export async function portableTextToLexical(
  nodes: PortableTextNode[] | undefined | null,
  ctx: ConvertContext,
): Promise<LexicalRoot> {
  void ctx; // used by figure/custom-block branches added in later tasks
  const out: LexicalBlock[] = [];
  if (!nodes || nodes.length === 0) {
    return { root: { type: "root", children: [emptyParagraph()], format: "", indent: 0, version: 1, direction: "ltr" } };
  }

  let i = 0;
  while (i < nodes.length) {
    const n = nodes[i];

    if (n._type === "block") {
      const block = n as PortableTextBlock;

      if (block.listItem === "bullet" || block.listItem === "number") {
        const kind = block.listItem;
        const group: PortableTextBlock[] = [];
        while (i < nodes.length) {
          const next = nodes[i];
          if (next._type !== "block") break;
          const nb = next as PortableTextBlock;
          if (nb.listItem !== kind) break;
          group.push(nb);
          i++;
        }
        out.push(buildList(group, kind));
        continue;
      }

      out.push(blockToTopLevel(block));
      i++;
      continue;
    }

    // Non-block nodes handled in later tasks; for now skip unknown.
    console.warn(`[pt2lex] unknown node type ${n._type} — skipped`);
    i++;
  }

  if (out.length === 0) out.push(emptyParagraph());

  return {
    root: {
      type: "root",
      children: out,
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
    },
  };
}
```

- [ ] **Step 4: Run tests, verify pass**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
bun test scripts/migrate/lib/portable-text-to-lexical.test.ts
```

Expected: 5 passing.

- [ ] **Step 5: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/scripts/migrate/lib/portable-text-to-lexical.ts apps/payload/scripts/migrate/lib/portable-text-to-lexical.test.ts
git commit -m "feat(payload): PT→Lexical for paragraphs, headings, marks, lists"
```

---

## Task 13: PT → Lexical — figure block (upload node)

**Files:**
- Modify: `apps/payload/scripts/migrate/lib/portable-text-to-lexical.ts`
- Modify: `apps/payload/scripts/migrate/lib/portable-text-to-lexical.test.ts`

- [ ] **Step 1: Add the failing test**

Append to `portable-text-to-lexical.test.ts`:

```ts
describe("portableTextToLexical — figure", () => {
  it("converts a figure block to an upload node using the resolver", async () => {
    const ctx = {
      resolveUpload: async (ref: string) =>
        ref === "image-abc-100x100-jpg" ? "media-uuid-1" : undefined,
    };
    const out = await portableTextToLexical(
      [
        {
          _type: "figure",
          image: { _type: "image", asset: { _type: "reference", _ref: "image-abc-100x100-jpg" } },
          altText: "Some alt",
        },
      ],
      ctx,
    );
    const upload = out.root.children[0] as { type: string; relationTo: string; value: string };
    expect(upload.type).toBe("upload");
    expect(upload.relationTo).toBe("media");
    expect(upload.value).toBe("media-uuid-1");
  });

  it("emits a warning paragraph when the figure can't be resolved", async () => {
    const ctx = { resolveUpload: async () => undefined };
    const out = await portableTextToLexical(
      [{ _type: "figure", image: { asset: { _ref: "missing" } } }],
      ctx,
    );
    expect((out.root.children[0] as { type: string }).type).toBe("paragraph");
  });
});
```

- [ ] **Step 2: Run tests, verify failure**

```bash
bun test scripts/migrate/lib/portable-text-to-lexical.test.ts
```

Expected: the two new tests fail.

- [ ] **Step 3: Implement**

In `portable-text-to-lexical.ts`, replace the `// Non-block nodes handled in later tasks…` branch with:

```ts
    if (n._type === "figure") {
      const fig = n as { image?: { asset?: { _ref?: string } } };
      const ref = fig.image?.asset?._ref;
      const mediaId = ref ? await ctx.resolveUpload(ref) : undefined;
      if (mediaId) {
        out.push({
          type: "upload",
          relationTo: "media",
          value: mediaId,
          fields: null,
          format: "",
          version: 3,
        });
      } else {
        console.warn(`[pt2lex] figure with unresolved ref ${ref ?? "(none)"} — skipped`);
        out.push(emptyParagraph());
      }
      i++;
      continue;
    }

    // Non-block nodes handled in later tasks; for now skip unknown.
    console.warn(`[pt2lex] unknown node type ${n._type} — skipped`);
    i++;
```

- [ ] **Step 4: Run tests, verify pass**

```bash
bun test scripts/migrate/lib/portable-text-to-lexical.test.ts
```

Expected: 7 passing.

- [ ] **Step 5: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/scripts/migrate/lib/portable-text-to-lexical.ts apps/payload/scripts/migrate/lib/portable-text-to-lexical.test.ts
git commit -m "feat(payload): PT→Lexical figure → upload node"
```

---

## Task 14: PT → Lexical — quote/note/oembed custom blocks

**Files:**
- Modify: `apps/payload/scripts/migrate/lib/portable-text-to-lexical.ts`
- Modify: `apps/payload/scripts/migrate/lib/portable-text-to-lexical.test.ts`

- [ ] **Step 1: Add the failing tests**

```ts
describe("portableTextToLexical — custom blocks", () => {
  const ctx = { resolveUpload: async () => undefined };

  it("converts a quote block", async () => {
    const out = await portableTextToLexical(
      [
        {
          _type: "quote",
          body: [
            { _type: "block", style: "normal", markDefs: [], children: [{ _type: "span", text: "Wisdom", marks: [] }] },
          ],
          attribution: "A. Person",
        },
      ],
      ctx,
    );
    const block = out.root.children[0] as { type: string; fields: { blockType: string; attribution: string } };
    expect(block.type).toBe("block");
    expect(block.fields.blockType).toBe("quote");
    expect(block.fields.attribution).toBe("A. Person");
  });

  it("converts a note block", async () => {
    const out = await portableTextToLexical(
      [
        {
          _type: "note",
          type: "warning",
          body: [
            { _type: "block", style: "normal", markDefs: [], children: [{ _type: "span", text: "Heads up", marks: [] }] },
          ],
        },
      ],
      ctx,
    );
    const block = out.root.children[0] as { fields: { blockType: string; variant: string } };
    expect(block.fields.blockType).toBe("note");
    expect(block.fields.variant).toBe("warning");
  });

  it("converts an oembed block", async () => {
    const out = await portableTextToLexical(
      [{ _type: "oembed", url: "https://youtube.com/watch?v=abc" }],
      ctx,
    );
    const block = out.root.children[0] as { fields: { blockType: string; url: string } };
    expect(block.fields.blockType).toBe("oembed");
    expect(block.fields.url).toBe("https://youtube.com/watch?v=abc");
  });
});
```

- [ ] **Step 2: Run tests, verify failure**

```bash
bun test scripts/migrate/lib/portable-text-to-lexical.test.ts
```

Expected: three new failures.

- [ ] **Step 3: Implement**

Insert ahead of the `figure` branch (so quote/note/oembed match before the unknown-block fallback):

```ts
    if (n._type === "quote") {
      const q = n as { body?: PortableTextNode[]; attribution?: string };
      const inner = await portableTextToLexical(q.body ?? [], ctx);
      out.push({
        type: "block",
        fields: { blockType: "quote", body: inner, attribution: q.attribution ?? "" },
        format: "",
        version: 2,
      });
      i++;
      continue;
    }

    if (n._type === "note") {
      const nt = n as { type?: string; body?: PortableTextNode[] };
      const inner = await portableTextToLexical(nt.body ?? [], ctx);
      const variant = (nt.type as "primary" | "success" | "warning" | "error") ?? "primary";
      out.push({
        type: "block",
        fields: { blockType: "note", variant, body: inner },
        format: "",
        version: 2,
      });
      i++;
      continue;
    }

    if (n._type === "oembed") {
      const oe = n as { url?: string };
      out.push({
        type: "block",
        fields: { blockType: "oembed", url: oe.url ?? "" },
        format: "",
        version: 2,
      });
      i++;
      continue;
    }
```

- [ ] **Step 4: Run tests, verify pass**

```bash
bun test scripts/migrate/lib/portable-text-to-lexical.test.ts
```

Expected: 10 passing.

- [ ] **Step 5: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/scripts/migrate/lib/portable-text-to-lexical.ts apps/payload/scripts/migrate/lib/portable-text-to-lexical.test.ts
git commit -m "feat(payload): PT→Lexical custom blocks (quote, note, oembed)"
```

---

## Task 15: PT → Lexical — explicit warning for unknown blocks

**Files:**
- Modify: `apps/payload/scripts/migrate/lib/portable-text-to-lexical.ts`
- Modify: `apps/payload/scripts/migrate/lib/portable-text-to-lexical.test.ts`

- [ ] **Step 1: Add the failing test**

```ts
describe("portableTextToLexical — fallbacks", () => {
  const ctx = { resolveUpload: async () => undefined };

  it("warns and emits a paragraph for an unknown block type", async () => {
    const warn = console.warn;
    const calls: string[] = [];
    console.warn = (m: string) => calls.push(m);
    try {
      const out = await portableTextToLexical(
        [{ _type: "mysterious", text: "..." }],
        ctx,
      );
      expect((out.root.children[0] as { type: string }).type).toBe("paragraph");
      expect(calls.some((c) => c.includes("mysterious"))).toBe(true);
    } finally {
      console.warn = warn;
    }
  });
});
```

- [ ] **Step 2: Run tests, verify failure or check current behaviour**

```bash
bun test scripts/migrate/lib/portable-text-to-lexical.test.ts
```

The current fallback path skips (no paragraph emitted), so the test will fail.

- [ ] **Step 3: Update the fallback**

Replace the final fallback with:

```ts
    console.warn(`[pt2lex] unknown node type "${n._type}" — emitted empty paragraph`);
    out.push(emptyParagraph());
    i++;
```

- [ ] **Step 4: Run tests, verify pass**

```bash
bun test scripts/migrate/lib/portable-text-to-lexical.test.ts
```

Expected: 11 passing.

- [ ] **Step 5: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/scripts/migrate/lib/portable-text-to-lexical.ts apps/payload/scripts/migrate/lib/portable-text-to-lexical.test.ts
git commit -m "feat(payload): PT→Lexical emits paragraph + warning for unknown blocks"
```

---

## Task 16: `scripts/sanity-export.ts` — CLI wrapper

**Files:**
- Create: `apps/payload/scripts/sanity-export.ts`

- [ ] **Step 1: Implement**

```ts
// apps/payload/scripts/sanity-export.ts
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";

const dataset = process.env.SANITY_DATASET ?? process.env.SANITY_STUDIO_DATASET ?? "production";
const projectId = process.env.SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID;
const token = process.env.SANITY_AUTH_TOKEN;
const outputDir = ".sanity-export";

if (!projectId) {
  console.error("Missing SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID).");
  process.exit(1);
}
if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN. Create one in https://manage.sanity.io with read access.");
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const args = ["dlx", "@sanity/cli@latest", "dataset", "export", dataset, outputDir, "--overwrite"];
const env = { ...process.env, SANITY_AUTH_TOKEN: token, SANITY_PROJECT_ID: projectId };

console.log(`[sanity-export] exporting dataset "${dataset}" → ${outputDir}/`);
const child = spawn("pnpm", args, { stdio: "inherit", env });
child.on("exit", (code) => process.exit(code ?? 1));
```

- [ ] **Step 2: Run it**

Ensure `apps/payload/.env.local` (or your environment) has `SANITY_AUTH_TOKEN` and `SANITY_PROJECT_ID` set.

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm migrate:export-sanity
```

Expected: `.sanity-export/data.ndjson` plus `images/` and `files/` directories populated. Wall time depends on the dataset; expect under 2 minutes.

- [ ] **Step 3: Verify the export**

```bash
ls -la /Users/will/Developer/sudbury-rowing-club/apps/payload/.sanity-export
wc -l /Users/will/Developer/sudbury-rowing-club/apps/payload/.sanity-export/data.ndjson
grep -c '"_type":"safety"' /Users/will/Developer/sudbury-rowing-club/apps/payload/.sanity-export/data.ndjson
grep -c '"_type":"safetyStatus"' /Users/will/Developer/sudbury-rowing-club/apps/payload/.sanity-export/data.ndjson
```

Expected: directory exists; data.ndjson is a non-trivial number of lines; safety count matches your expected number of notices; safetyStatus count is 1.

- [ ] **Step 4: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/scripts/sanity-export.ts
git commit -m "feat(payload): add sanity dataset export wrapper"
```

---

## Task 17: `safety-status.ts` — migrate the singleton global

**Files:**
- Create: `apps/payload/scripts/migrate/safety-status.ts`

- [ ] **Step 1: Implement**

```ts
// apps/payload/scripts/migrate/safety-status.ts
import { getPayloadClient } from "./lib/payload-client";
import { createSanityExportReader } from "./lib/sanity-export";

const reader = createSanityExportReader();
const payload = await getPayloadClient();

const status = await reader.docById("safetyStatus");
if (!status) {
  console.warn("[safety-status] no safetyStatus document in export — leaving global untouched");
  process.exit(0);
}

const rawStatus = String(status.status ?? "neutral");
const validStatuses = ["neutral", "green", "amber", "red"] as const;
const safeStatus = (validStatuses as readonly string[]).includes(rawStatus)
  ? (rawStatus as (typeof validStatuses)[number])
  : "neutral";

await payload.updateGlobal({
  slug: "safetyStatus",
  data: {
    status: safeStatus,
    description: (status.description as string) ?? "",
    display: Boolean(status.display ?? false),
  } as never,
});

console.log(`[safety-status] applied status="${safeStatus}" display=${Boolean(status.display)}`);
process.exit(0);
```

- [ ] **Step 2: Run**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm migrate:safety-status
```

Expected: log line confirming what was applied.

- [ ] **Step 3: Verify in admin**

```bash
pnpm dev
```

Open `/admin/globals/safetyStatus` and confirm the status/description/display match what Sanity Studio shows. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/scripts/migrate/safety-status.ts
git commit -m "feat(payload): migrate SafetyStatus global"
```

---

## Task 18: `safety.ts` — migrate the SafetyNotices collection

**Files:**
- Create: `apps/payload/scripts/migrate/safety.ts`

- [ ] **Step 1: Implement**

```ts
// apps/payload/scripts/migrate/safety.ts
import { ensureMediaForRef } from "./lib/assets";
import { getPayloadClient } from "./lib/payload-client";
import { portableTextToLexical } from "./lib/portable-text-to-lexical";
import {
  createSanityExportReader,
  type SanityDoc,
} from "./lib/sanity-export";
import { createSlugger } from "./lib/slug";
import { wipe } from "./lib/wipe";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const before = await payload.find({ collection: "safetyNotices", limit: 0 });
console.log(`[safety] wiping ${before.totalDocs} existing safetyNotices`);
await wipe(payload, "safetyNotices");

const slugger = createSlugger();
let imported = 0;

const resolveUpload = async (ref: string) => {
  const media = await ensureMediaForRef(payload, reader, ref);

  return media?.id;
};

for await (const doc of reader.docsOfType("safety")) {
  const data = await transform(doc, { resolveUpload });
  await payload.create({ collection: "safetyNotices", data: data as never });
  imported++;
}

console.log(`[safety] imported ${imported} notices`);
process.exit(0);

async function transform(
  doc: SanityDoc,
  ctx: { resolveUpload: (ref: string) => Promise<string | undefined> },
) {
  const title = String(doc.title ?? "Untitled");
  const slug = slugger(title);

  const sanityDoc = doc.document as
    | { title?: string; asset?: { _ref?: string } }
    | undefined;
  const documentMediaId = await ctx.resolveUpload(sanityDoc?.asset?._ref ?? "");

  const sanityLink = doc.link as { url?: string } | undefined;

  const body = await portableTextToLexical(
    (doc.body as Parameters<typeof portableTextToLexical>[0]) ?? [],
    ctx,
  );

  return {
    id: doc._id,
    sanityDocId: doc._id,
    slug,
    title,
    body,
    pin: Boolean(doc.pin ?? false),
    document:
      documentMediaId
        ? {
            title: sanityDoc?.title ?? title,
            document: documentMediaId,
          }
        : undefined,
    link: sanityLink?.url ?? undefined,
    date: (doc.date as string | undefined) ?? doc._updatedAt ?? new Date().toISOString(),
  };
}
```

- [ ] **Step 2: Run**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm migrate:safety
```

Expected: console output `[safety] wiping 0 existing safetyNotices` then `[safety] imported N notices` matching the count from Task 16 Step 3. Watch for `[pt2lex]` warnings — investigate each one. A small number for legitimately unknown block types is OK; many warnings means the converter is missing a case.

- [ ] **Step 3: Verify in admin**

```bash
pnpm dev
```

Open `/admin/collections/safetyNotices` and:
- Count matches.
- Open the most recent notice and confirm body renders without console errors.
- Confirm the `document` upload opens when clicked.
- Confirm `slug` is populated.
- Stop the dev server.

- [ ] **Step 4: Spot-check a body round-trips**

In the admin, edit one notice, change a single word in the body, save, refresh. Confirm the edit persists and no Lexical schema errors appear in the browser console.

- [ ] **Step 5: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/scripts/migrate/safety.ts
git commit -m "feat(payload): migrate SafetyNotices from Sanity"
```

---

## Task 19: `all.ts` orchestrator + end-to-end smoke

**Files:**
- Create: `apps/payload/scripts/migrate/all.ts`

- [ ] **Step 1: Implement**

```ts
// apps/payload/scripts/migrate/all.ts
import { spawnSync } from "node:child_process";

// Ordered: assets-bearing collections first (none in this slice), then content.
const scripts = [
  "scripts/migrate/safety-status.ts",
  "scripts/migrate/safety.ts",
];

for (const script of scripts) {
  console.log(`\n── running ${script} ──`);
  const result = spawnSync("bun", ["run", script], { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`${script} failed with exit code ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

console.log("\n[all] done");
```

- [ ] **Step 2: Full end-to-end run from a clean state**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload

# Optional reset to prove it works from zero:
rm -rf .wrangler/state/v3/d1 .wrangler/state/v3/r2
pnpm payload migrate

pnpm migrate:export-sanity
pnpm migrate:all
```

Expected: clean exit; no failures; notice count and status as expected.

- [ ] **Step 3: Run the harness test suite once more**

```bash
cd /Users/will/Developer/sudbury-rowing-club/apps/payload
pnpm migrate:test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
cd /Users/will/Developer/sudbury-rowing-club
git add apps/payload/scripts/migrate/all.ts
git commit -m "feat(payload): add migration orchestrator for the Safety slice"
```

---

## Done criteria (from spec §5.6)

- [x] `Trustees.1.ts` deleted — Task 1.
- [x] Schema migrations regenerated against empty D1 with `uuid` PKs verified — Task 2.
- [x] Harness in place (`payload-client`, `sanity-export`, `assets`, `portable-text-to-lexical` + tests, `wipe`) — Tasks 7–15.
- [x] Custom Lexical blocks registered (`quote`, `note`, `oembed`) plus upload — Task 4.
- [x] `Media.sanityAssetId` added; `SafetyNotices` has `slug` + `sanityDocId` plus tweaks — Tasks 3, 5.
- [x] `bun run migrate:export-sanity && bun run migrate:safety && bun run migrate:safety-status` populates the local DB; round-trips through the admin — Tasks 16–19.
- [ ] FE `/safety` and `/safety/[slug]` render from Payload — **out of scope, Will's work**.
- [x] Spot-checks: counts match, bodies render, uploads open — Task 18 Steps 3–4.
