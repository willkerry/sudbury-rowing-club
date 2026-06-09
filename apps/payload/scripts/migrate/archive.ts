import { assetIdFrom } from "./lib/asset-ref";
import { ensureMediaForRef } from "./lib/assets";
import { getPayloadClient } from "./lib/payload-client";
import { createSanityExportReader, type SanityDoc } from "./lib/sanity-export";
import { wipe } from "./lib/wipe";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const before = await payload.find({ collection: "archive", limit: 0 });
console.log(`[archive] wiping ${before.totalDocs} existing items`);
await wipe(payload, "archive");

let imported = 0;

const resolveUpload = async (ref: string): Promise<string | undefined> => {
  const media = await ensureMediaForRef(payload, reader, ref);

  return media?.id;
};

for await (const doc of reader.docsOfType("archive")) {
  try {
    const data = await transform(doc);
    await payload.create({
      collection: "archive",
      data: data as never,
    });
    imported++;
  } catch (err) {
    console.error(
      `[archive] fail: ${doc._id} ${doc.title}: ${(err as Error).message}`,
    );
  }
}

console.log(`[archive] imported ${imported} items`);
process.exit(0);

async function transform(doc: SanityDoc) {
  const imageId = await resolveUpload(assetIdFrom(doc.image) ?? "");
  const loc = doc.location as { lat?: number; lng?: number } | undefined;

  return {
    alt: (doc.alt as string | undefined) ?? undefined,
    description: (doc.description as string | undefined) ?? undefined,
    image: imageId,
    range: (doc.range as number | undefined) ?? 0,
    sanityDocId: doc._id,
    title: String(doc.title ?? "Untitled"),
    year: (doc.year as string | undefined) ?? undefined,
    location: {
      lat: loc?.lat ?? undefined,
      lng: loc?.lng ?? undefined,
    },
  };
}
