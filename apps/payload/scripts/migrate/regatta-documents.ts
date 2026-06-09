import { assetIdFrom } from "./lib/asset-ref";
import { ensureMediaForRef } from "./lib/assets";
import { getPayloadClient } from "./lib/payload-client";
import { createSanityExportReader } from "./lib/sanity-export";
import { wipe } from "./lib/wipe";

const REGATTA_SETTINGS_ID = "1af70bac-279d-486d-9c87-cfb4de0b6964";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const settings = await reader.docById(REGATTA_SETTINGS_ID);
if (!settings) {
  console.warn("[regatta-documents] regattaSettings missing in export");
  process.exit(0);
}

const ci = settings.competitorInformation as
  | { documents?: { _key?: string; title?: string; _sanityAsset?: string }[] }
  | undefined;
const sanityDocs = ci?.documents ?? [];
// regattaSettings.competitorInformation.description is intentionally dropped —
// the user has decided regattaDocuments supersedes the competitorInformation
// concept as a whole. The free-text description has no destination.

const before = await payload.find({
  collection: "regattaDocuments",
  limit: 0,
});
console.log(
  `[regatta-documents] wiping ${before.totalDocs} existing documents`,
);
await wipe(payload, "regattaDocuments");

let imported = 0;
let dropped = 0;

for (const doc of sanityDocs) {
  const ref = assetIdFrom(doc) ?? "";
  if (!ref) {
    dropped++;
    console.warn(
      `[regatta-documents] drop: ${doc._key} ${doc.title}: no file ref`,
    );
    continue;
  }
  const media = await ensureMediaForRef(payload, reader, ref);
  if (!media) {
    dropped++;
    console.warn(
      `[regatta-documents] drop: ${doc._key} ${doc.title}: media not resolved`,
    );
    continue;
  }
  try {
    await payload.create({
      collection: "regattaDocuments",
      data: {
        enabled: true,
        file: media.id,
        sanityDocId: doc._key,
        title: String(doc.title ?? "Untitled"),
      } as never,
    });
    imported++;
  } catch (err) {
    dropped++;
    console.error(
      `[regatta-documents] fail: ${doc._key} ${doc.title}: ${(err as Error).message}`,
    );
  }
}

console.log(
  `[regatta-documents] imported ${imported} documents (${dropped} dropped)`,
);
process.exit(0);
