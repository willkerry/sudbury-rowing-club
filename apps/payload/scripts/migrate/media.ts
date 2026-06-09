import { ensureMediaForSanityAsset } from "./lib/assets";
import { getPayloadClient } from "./lib/payload-client";
import { createSanityExportReader } from "./lib/sanity-export";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const assets = reader.allAssets();
console.log(`[media] found ${assets.length} assets to consider`);

let uploaded = 0;
let skipped = 0;
let failed = 0;

for (const asset of assets) {
  try {
    const existing = await payload.find({
      collection: "media",
      limit: 1,
      where: { sanityAssetId: { equals: asset._id } },
    });
    if (existing.docs[0]) {
      skipped++;
      continue;
    }
    await ensureMediaForSanityAsset(payload, reader, asset);
    uploaded++;
    if (uploaded % 25 === 0) {
      console.log(
        `[media]   progress: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`,
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
  `[media] done: ${uploaded} uploaded, ${skipped} already present, ${failed} failed`,
);
process.exit(0);
