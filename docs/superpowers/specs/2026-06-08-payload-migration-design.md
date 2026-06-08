# Sanity → Payload migration: design

Status: draft for review
Date: 2026-06-08
Author: Will (with Claude)

## 1. Purpose and scope

Move the Sudbury Rowing Club site off Sanity CMS and onto a self-hosted Payload CMS running on Cloudflare D1 (SQLite) + R2 (object storage). Migration is **incremental, per-collection**; consuming frontends will be re-implemented per slice to read from Payload and to push data fetches closer to consumers (no more page-level GROQ + prop drilling).

This spec covers:

- The umbrella sequencing (how the whole migration breaks into sub-projects).
- The reusable migration **harness** (Sanity export → transform → Payload Local API → R2).
- The first sub-project end-to-end: **Safety** (`safetyNotices` collection + `safetyStatus` global).

Subsequent sub-projects (Governance + People, Regatta, Landing + News + Members) get their own design docs when their turn comes. The harness is built once, here.

## 2. Sub-project decomposition

| # | Sub-project | Contents | Why this order |
|---|---|---|---|
| 0 | Foundations | Cleanup (`Trustees.1.ts`), regenerate stale schema migrations against `uuid` PK config, build the migration harness, PT→Lexical converter + custom Lexical blocks, asset uploader, Sanity export tooling | Prerequisite for everything. Built during sub-project 1. |
| 1 | **Safety** (this spec) | `safetyNotices`, `safetyStatus` | Smallest surface, single body field, no cross-refs, no slug FE concerns. Proves the harness end-to-end. |
| 2 | Governance + People | `people`, `officers`, `trustees`, `vicePresidents`, `governanceDocuments`, **new** `committees`. Decide `Governance` global vs `Trustees` collection; reconcile `Officers.occupant` (relationship) vs `Trustees`/`VicePresidents.person` + virtual `occupant` patterns. | Settles the `people` master used by news authors later. |
| 3 | Regatta | `regattas`, `regattaDocuments`, **possibly new** `archive`, `Regatta` global | Self-contained. Regatta micro-site moves wholesale. |
| 4 | Landing + News + Members | `Landing` global (mostly done), **new** `news`, **new** `members`, decide placement for `siteSettings.resourceGroup[]` (array on `Governance` global, or its own `resources` collection) | News is the largest and pulls on People (authors), Media (heroes) and PT→Lexical (bodies). Last because everything it needs has shipped. |

### Schemas dropped (not migrated)

- `author` — already deprecated in Sanity; news will reference `people` directly.
- `minutes` — no longer required.
- `forwarders` — no longer required.

### Cross-cutting decisions (resolved in their sub-project)

- `Governance` global vs `Trustees` collection — both currently exist with overlap; decide in sub-project 2.
- Role pattern inconsistency: `Officers.occupant` is a relationship; `Trustees`/`VicePresidents` use `person` + virtual `occupant` from `person.fullName`. Pick one; decide in sub-project 2.
- `siteSettings.resourceGroup[]` placement — global vs collection; decide in sub-project 4.

### Cross-cutting decisions (pinned now, applied in their sub-project)

- **`People` and `Users` stay separate.** `Users` is the auth collection (password/sessions); `People` is the editorial/biographical record. Most people never authenticate (deceased members, elderly VPs, historical Trustees) and most have no email on file. Where someone is both — e.g. a current officer who also edits content — they get one `People` row and one `Users` row linked by `Users.person → People` (nullable for system/admin accounts that don't represent a real person, but normally populated). Editor self-service for "edit my bio" operates on the linked `People` row, not the `Users` row. Implementation in sub-project 2.

## 2a. Versioning policy

Payload's per-collection versioning is cheap and the admin history UI is genuinely useful. Default position:

| Collection / global | Versions | Drafts | Reason |
|---|---|---|---|
| `RegattaDocuments` | on (already) | – | Annual reissue; old packs are valid historical artefacts. |
| `GovernanceDocuments` | on (already) | – | Annual/periodic reissue; legal interest in prior wording. |
| `Regatta` global | on (new) | on (new) | Snapshot of each year's config — what races, what entries, what course. Drafts let editorial stage changes before the event. |
| `Officers` | on (new) | – | "Who was chair in 2018?" answerable from the admin. |
| `Trustees`, `VicePresidents` | on (new) | – | Board composition over time. |
| `Committees` (new) | on | – | Same. |
| `Landing` global | on (new) | on (new) | Roll back homepage tweaks; stage seasonal changes. |
| `News` (new) | – | on | No supersession — each post is its own historical record. Drafts let posts be staged. |
| Resources placement (TBD sub-project 4) | on | – | As with governance docs. |
| `People` | off | – | Personal records, not editorial. Versioning a name is noise. |
| `Media` | off | – | Versioning binaries is messy; Cloudflare handles transform variants. |
| `SafetyNotices` | off | – | Supersession is the model; old notices are misleading if visible. Drafts add unwanted friction in an urgency-driven workflow. |
| `SafetyStatus` global | off | – | Status is an *as of now* signal; history is meaningless. |
| `Users` | off | – | Auth records; versioning passwords/sessions is hostile. |

**Migration guard rail.** Wipe-and-replay deletes `_versions` rows alongside the main rows. That's fine for cutover — there is no history to preserve from Sanity — but **a versioned collection must never be wipe-and-replayed after its FE has gone live**, or all editorial history accrued since cutover is lost. Operationally: once a collection's FE switches to Payload, its migration script is retired (or guarded with an env-gated `MIGRATION_ALLOW_DESTRUCTIVE=1` check).

## 3. Migration harness (foundations)

Built during the Safety slice because Safety needs every piece.

### 3.1 Source of truth: Sanity dataset export

- `scripts/sanity-export.ts` shells out to `pnpm dlx @sanity/cli@latest dataset export <dataset> .sanity-export/` using `SANITY_AUTH_TOKEN` from `.env.local`.
- Output: `.sanity-export/data.ndjson` (one JSON doc per line) plus `images/` and `files/` directories containing the original binaries. Gitignored.
- Default export bundles assets — no separate fetch step. Bytes are byte-identical to Sanity originals; no re-encoding.
- One source of truth per run. Deterministic locally; re-pulled immediately before each production cutover.

### 3.2 Directory layout

```
apps/payload/scripts/
├── sanity-export.ts                  # Wraps `sanity dataset export`
└── migrate/
    ├── lib/
    │   ├── payload-client.ts         # Bootstraps Payload with local wrangler bindings
    │   ├── sanity-export.ts          # Reads data.ndjson, yields docs by _type
    │   ├── portable-text-to-lexical.ts
    │   ├── portable-text-to-lexical.test.ts
    │   ├── assets.ts                 # `ensureMediaForSanityAsset`
    │   └── wipe.ts                   # Generic per-collection truncate
    ├── safety.ts
    ├── safety-status.ts
    └── all.ts                        # Orchestrator (topological order)
```

### 3.3 Runtime: Bun + wrangler

- Migration scripts run with `bun run scripts/migrate/<collection>.ts`. Bun's Node-compat is sufficient for Payload's Local API and `wrangler`'s `getPlatformProxy()`. If `getPlatformProxy` ever misbehaves under Bun, fall back to `tsx` for the wrapper only; transforms stay Bun-native.
- Payload's own CLI (`payload migrate`, `payload generate:types`) stays on Node — hard requirement from Payload's bin.

### 3.4 Bootstrapping Payload with miniflare bindings

```ts
// scripts/migrate/lib/payload-client.ts
import { getPlatformProxy } from "wrangler";
import { getPayload } from "payload";
import config from "../../../src/payload.config";

export async function getPayloadClient() {
  await getPlatformProxy({ environment: process.env.CLOUDFLARE_ENV });
  return getPayload({ config });
}
```

The existing `payload.config.ts` already calls `getCloudflareContextFromWrangler()` when not running in production, so importing the config wires the bindings through.

### 3.5 Per-script lifecycle: wipe-and-replay

```ts
const payload = await getPayloadClient();
await wipe(payload, "safetyNotices");
for await (const doc of readSanityDocs("safety")) {
  await payload.create({ collection: "safetyNotices", data: await transform(doc, payload, ctx) });
}
```

Three rules:

1. **Wipe is per-collection.** A `safety.ts` run never touches `media` (other collections still depend on those uploads). Assets dedup separately.
2. **Order matters for cross-refs.** `all.ts` runs scripts in topological order (Media first; People before News; etc.).
3. **Assets are idempotent.** `ensureMediaForSanityAsset` does a `sanityAssetId` lookup before uploading. Re-runs don't re-upload.

**Important constraint for versioned collections** (see §2a): a wipe deletes `_versions` rows too. Once a collection's FE has gone live on Payload, its migration script is retired or env-gated. The Safety slice doesn't hit this — `SafetyNotices` and `SafetyStatus` are unversioned — but it bites from sub-project 2 onwards.

### 3.6 Asset migration (`lib/assets.ts`)

```ts
export async function ensureMediaForSanityAsset(payload, sanityRef) {
  const assetDoc = findAssetInExport(sanityRef);                // from data.ndjson
  const existing = await payload.find({
    collection: "media",
    where: { sanityAssetId: { equals: assetDoc._id } },
    limit: 1,
  });
  if (existing.docs[0]) return existing.docs[0];

  const filePath = path.join(".sanity-export", path.basename(assetDoc.path));
  const buffer = await fs.promises.readFile(filePath);

  return payload.create({
    collection: "media",
    data: { alt: assetDoc.altText ?? "", sanityAssetId: assetDoc._id },
    file: {
      name: assetDoc.originalFilename,
      data: buffer,
      mimetype: assetDoc.mimeType,
      size: assetDoc.size,
    },
  });
}
```

Payload's R2 storage plugin (already wired) handles the actual R2 write. We never call the R2 API directly. Locally the writes go to miniflare's R2 emulator at `.wrangler/state/v3/r2/`.

Sanity hotspot/crop is dropped — those live per-usage, not per-asset. Cloudflare Image Resizing at render time (`packages/images/src/cloudflare.ts`) replaces them for almost all cases. The migration logs a warning when it sees hotspot/crop data so we can audit.

### 3.7 Portable Text → Lexical converter

Hand-rolled in `lib/portable-text-to-lexical.ts`. Bun unit tests cover every block/mark type.

| PT block/mark | Lexical target |
|---|---|
| `block` style `normal` | `paragraph` |
| `block` style `h2`/`h3`/`h4` | `heading` h2/h3/h4 |
| `block` with `listItem: "bullet"` or `"number"` | `list` / `listitem` |
| Mark `strong`, `em` | `text` with format bitmask |
| Mark `link` | `link` node |
| `figure` block | Lexical `upload` node → Media id (via `ensureMediaForSanityAsset`) |
| `quote` block (custom: body + attribution) | Custom Lexical block `quote` with `body: RichTextChildren`, `attribution: string` |
| `note` block (custom: variant + body) | Custom Lexical block `note` with `variant`, `body: RichTextChildren` |
| `oembed` block (custom: url) | Custom Lexical block `oembed` with `url: string` |

Unknown blocks → log a warning with the doc `_id` and emit a plain paragraph of the text content; nothing silently disappears.

Custom blocks live in `apps/payload/src/lib/lexical/{quote,note,oembed}-block.ts` and are registered on the editor:

```ts
lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    BlocksFeature({ blocks: [QuoteBlock, NoteBlock, OembedBlock] }),
  ],
})
```

### 3.8 npm scripts (added to `apps/payload/package.json`)

```jsonc
"scripts": {
  "migrate:export-sanity": "bun run scripts/sanity-export.ts",
  "migrate:safety":         "bun run scripts/migrate/safety.ts",
  "migrate:safety-status":  "bun run scripts/migrate/safety-status.ts",
  "migrate:all":            "bun run scripts/migrate/all.ts",
  "migrate:test":           "bun test scripts/migrate"
}
```

### 3.9 Production cutover

**Out of scope for this spec.** Locally the harness writes to miniflare bindings only. Production cutover will be designed in its own slice; expected shape is `wrangler d1 execute --remote` ergonomics plus a typed-confirmation prompt and a freshly re-pulled dataset export immediately before the run.

## 4. Foundations work (executed first, during the Safety slice)

In order:

1. Delete `apps/payload/src/collections/Trustees.1.ts`.
2. Delete stale schema migrations under `apps/payload/src/migrations/` and clear local D1 (`rm -rf apps/payload/.wrangler/state/v3/d1`).
3. Run `pnpm --filter @sudburyrc/payload payload migrate:create` and verify the regenerated SQL uses `TEXT PRIMARY KEY` (not `INTEGER`). If it doesn't, fix the adapter config before any data-migration code is written.
4. Add `sanityAssetId` (text, hidden, indexed) to the `Media` collection.
5. Implement custom Lexical blocks (`quote`, `note`, `oembed`) and register them on the editor in `payload.config.ts`.
6. Implement the harness modules under `scripts/migrate/lib/`:
   - `payload-client.ts`
   - `sanity-export.ts`
   - `assets.ts`
   - `portable-text-to-lexical.ts` (+ `*.test.ts`)
   - `wipe.ts`
7. Implement `scripts/sanity-export.ts` and the package.json scripts.

## 5. Safety slice (sub-project 1)

### 5.1 Schema changes — `SafetyNotices`

| Field | Current | Change | Why |
|---|---|---|---|
| `title` | `text` | `required: true`; set as `admin.useAsTitle` | Title isn't optional in any Sanity record and the admin list needs something to show. |
| `body` | `richText` | Editor configured with the custom blocks (`quote`, `note`, `oembed`) and upload | Defaults won't render the migrated custom blocks. |
| `pin` | `checkbox` | Move to `admin.position: "sidebar"`, add `defaultValue: false` | Matches `date`; one less decision in the editor flow. |
| `document` | `group { title, document: upload }` | Group-level validate: either both fields populated or both empty | Currently the group can be half-filled. |
| `link` | `text` (URL-validated) | Rename label to "External link URL" | Disambiguate from in-page anchor. |
| `date` | `date` (sidebar) | Add `defaultValue: () => new Date()` | Editors forget it on first save. |
| `slug` | – | **Add** (text, indexed, required) | Replaces using the UUID as the URL slug. Migrated from `slugify(title)` with dedup. |
| `sanityDocId` | – | **Add** (text, hidden, indexed) | Re-run idempotency aid + FE fallback during cutover window. Removable after. |

### 5.2 Schema changes — `SafetyStatus` global

No schema changes. Four-state `radio` and `display` toggle already match Sanity behaviour.

### 5.3 Transform — `safety` → `safetyNotices`

```ts
async function transform(doc, payload, ctx) {
  let documentMediaId;
  if (doc.document?.asset?._ref) {
    const asset = ctx.resolveAsset(doc.document.asset._ref);
    const media = await ensureMediaForSanityAsset(payload, asset);
    documentMediaId = media.id;
  }

  return {
    id: doc._id,                                            // preserved
    sanityDocId: doc._id,
    slug: ctx.uniqueSlug(slugify(doc.title)),
    title: doc.title,
    body: await portableTextToLexical(doc.body, { payload, resolveAsset: ctx.resolveAsset }),
    pin: doc.pin ?? false,
    document: documentMediaId
      ? { title: doc.document?.title ?? doc.title, document: documentMediaId }
      : undefined,
    link: doc.link?.url,
    date: doc.date ?? doc._updatedAt,
  };
}
```

`ctx` provides:

- `resolveAsset(ref)` — lookup in `data.ndjson`.
- `uniqueSlug(base)` — tracks slugs emitted this run, appends `-2`, `-3` on collision.

### 5.4 Transform — `safetyStatus` → `safetyStatus` global

```ts
const status = readSanityDoc("safetyStatus");               // singleton, _id === "safetyStatus"
await payload.updateGlobal({
  slug: "safetyStatus",
  data: {
    status: status.status,
    description: status.description,
    display: status.display ?? false,
  },
});
```

### 5.5 Frontend cutover (out of scope to implement, in scope to spec the contract)

- `/safety` list (Server Component):
  `payload.find({ collection: "safetyNotices", sort: ["-pin", "-date"], depth: 2 })`
  `depth: 2` resolves `document.document` so card components get `url`/`filename` directly.
- `/safety/[slug]` detail (Server Component):
  `payload.find({ collection: "safetyNotices", where: { slug: { equals: slug } }, limit: 1, depth: 2 })`
  Fallback during cutover window: `where: { sanityDocId: { equals: slug } }`. Remove after.
- `SafetyStatus`: `payload.findGlobal({ slug: "safetyStatus" })` directly in the status banner Server Component.
- Body render: `RichText` from `@payloadcms/richtext-lexical/react` with custom renderers registered for `quote`, `note`, `oembed`.

This pushes fetches to the consumers, removing the page-level GROQ + prop drilling pattern.

### 5.6 Definition of done

- [ ] `Trustees.1.ts` deleted.
- [ ] Schema migrations regenerated against empty D1 with `uuid` PKs verified.
- [ ] Foundations harness in place (`payload-client`, `sanity-export`, `assets`, `portable-text-to-lexical` + tests, `wipe`).
- [ ] Custom Lexical blocks registered (`quote`, `note`, `oembed`) plus upload.
- [ ] `Media.sanityAssetId` added. `SafetyNotices` gets `slug` + `sanityDocId` plus the small field tweaks in §5.1.
- [ ] `bun run migrate:export-sanity && bun run migrate:safety && bun run migrate:safety-status` produces a populated local DB that round-trips through the admin without errors.
- [ ] FE `/safety` and `/safety/[slug]` render from Payload (Will's work).
- [ ] Spot-check: `count(SafetyNotices in Payload) === count(safety docs in Sanity excluding drafts.*)`; each notice's body renders without console warnings; each `document` upload opens.

## 6. Risks and open questions

- **Bun + `getPlatformProxy`.** Bun-Node compat is good in practice but `getPlatformProxy` opens a child wrangler process. Fall back to `tsx` for the bootstrap if needed.
- **Asset corpus size.** First export tells us. If a run takes more than a minute or two, add a concurrency cap (e.g. `p-limit` at 4) to the asset upload loop. Start sequential.
- **Hotspot/crop loss.** Logged per-occurrence so we can audit. Cloudflare Image Resizing at render time replaces them for almost all cases.
- **PT→Lexical fidelity.** The converter is the riskiest piece. Mitigation: unit tests covering every block/mark type before the safety script runs.

## 7. What this spec does not cover

- Sub-projects 2–4 (Governance + People, Regatta, Landing + News + Members) — each gets its own spec.
- Production cutover mechanics.
- Frontend implementation details beyond the data-contract sketch in §5.5.
- Removal of the Sanity Studio app (`apps/cms`) — happens after all sub-projects are complete.
