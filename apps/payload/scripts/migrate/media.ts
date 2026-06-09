import { ensureMediaForSanityAsset } from "./lib/assets";
import { collectCaptions } from "./lib/captions";
import { getPayloadClient } from "./lib/payload-client";
import { createSanityExportReader } from "./lib/sanity-export";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

console.log("[media] scanning documents for figure-block captions");
const captions = await collectCaptions(reader);
console.log(`[media]   collected ${captions.size} captioned assets`);

const assets = reader.allAssets();
console.log(`[media] found ${assets.length} assets to consider`);

let uploaded = 0;
let skipped = 0;
let captioned = 0;
let backfilled = 0;
let failed = 0;

for (const asset of assets) {
  try {
    const existing = await payload.find({
      collection: "media",
      limit: 1,
      where: { sanityAssetId: { equals: asset._id } },
    });
    const caption = captions.get(asset._id);

    if (existing.docs[0]) {
      skipped++;
      const existingCaption = existing.docs[0].caption as string | undefined;
      if (caption && !existingCaption?.trim()) {
        await payload.update({
          collection: "media",
          data: { caption } as never,
          id: existing.docs[0].id as string,
        });
        backfilled++;
      }
      continue;
    }

    await ensureMediaForSanityAsset(payload, reader, asset, { caption });
    uploaded++;
    if (caption) captioned++;
    if (uploaded % 25 === 0) {
      console.log(
        `[media]   progress: ${uploaded} uploaded (${captioned} with caption), ${skipped} skipped (${backfilled} caption-backfilled), ${failed} failed`,
      );
    }
  } catch (err) {
    failed++;
    console.error(
      `[media] fail: ${asset._id} (${asset.originalFilename}): ${(err as Error).message}`,
    );
  }
}

console.log(
  `[media] done: ${uploaded} uploaded (${captioned} with caption), ${skipped} already present (${backfilled} caption-backfilled), ${failed} failed`,
);
process.exit(0);
