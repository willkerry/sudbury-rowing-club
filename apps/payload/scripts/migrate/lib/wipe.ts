import type { CollectionSlug, Payload } from "payload";

/**
 * Deletes every document in the given collection. Used for wipe-and-replay
 * during migration. Intentionally has no guard rail — call sites are
 * expected to know what they are doing. See spec §3.5 for the constraint
 * on versioned collections.
 *
 * Loops one delete-by-id at a time rather than a single `where: { id: { exists } }`
 * delete, because Payload's d1 adapter constructs an IN clause containing every
 * matching id and SQLite caps statement params at ~999. News + Media easily
 * exceed that.
 */
export async function wipe(
  payload: Payload,
  collection: CollectionSlug,
): Promise<number> {
  const BATCH = 100;
  let total = 0;
  while (true) {
    const batch = await payload.find({
      collection,
      depth: 0,
      limit: BATCH,
      pagination: false,
      sort: "id",
    });
    if (batch.docs.length === 0) break;
    for (const doc of batch.docs) {
      await payload.delete({ collection, id: doc.id });
      total++;
    }
    if (batch.docs.length < BATCH) break;
  }

  return total;
}
