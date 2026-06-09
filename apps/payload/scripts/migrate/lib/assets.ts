import type { Payload } from "payload";
import type { SanityAsset, SanityExportReader } from "./sanity-export";

export interface MediaRecord {
  alt?: string | null;
  id: number;
  sanityAssetId?: string | null;
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
    limit: 1,
    where: { sanityAssetId: { equals: asset._id } },
  });
  if (existing.docs[0]) return existing.docs[0] as MediaRecord;

  const data = await reader.readAssetBytes(asset);

  const created = await payload.create({
    collection: "media",
    data: {
      alt: asset.altText ?? asset.originalFilename ?? "",
      sanityAssetId: asset._id,
    } as never,
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
  if (!ref) return;
  const asset = reader.resolveAsset(ref);
  if (!asset) {
    console.warn(`[assets] no asset found in export for ref ${ref}`);

    return;
  }

  return await ensureMediaForSanityAsset(payload, reader, asset);
}
