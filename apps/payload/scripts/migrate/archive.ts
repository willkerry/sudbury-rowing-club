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

  if (imageId) {
    await backfillMediaText(imageId, {
      alt: (doc.alt as string | undefined)?.trim(),
      caption: (doc.description as string | undefined)?.trim(),
    });
  }

  return {
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

/**
 * Push the archive item's alt and description over to the linked Media
 * record if it doesn't already have its own. The Media.alt is required
 * and gets a filename auto-default at upload time; we treat alt that
 * equals the filename as "no real alt" and overwrite it.
 */
async function backfillMediaText(
  mediaId: string,
  fromArchive: { alt?: string; caption?: string },
): Promise<void> {
  if (!(fromArchive.alt || fromArchive.caption)) return;

  const media = await payload.findByID({ collection: "media", id: mediaId });
  const currentAlt = typeof media.alt === "string" ? media.alt.trim() : "";
  const currentCaption =
    typeof media.caption === "string" ? media.caption.trim() : "";
  const filename =
    typeof media.filename === "string" ? media.filename : undefined;
  const isAutoAlt = currentAlt === "" || currentAlt === filename;

  const updates: { alt?: string; caption?: string } = {};
  if (fromArchive.alt && isAutoAlt) updates.alt = fromArchive.alt;
  if (fromArchive.caption && !currentCaption) {
    updates.caption = fromArchive.caption;
  }

  if (Object.keys(updates).length === 0) return;

  await payload.update({
    collection: "media",
    data: updates as never,
    id: mediaId,
  });
}
