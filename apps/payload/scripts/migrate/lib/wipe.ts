import type { CollectionSlug, Payload } from "payload";

/**
 * Deletes every document in the given collection. Used for wipe-and-replay
 * during migration. Intentionally has no guard rail — call sites are
 * expected to know what they are doing. See spec §3.5 for the constraint
 * on versioned collections.
 */
export async function wipe(
  payload: Payload,
  collection: CollectionSlug,
): Promise<number> {
  const result = await payload.delete({
    collection,
    where: { id: { exists: true } },
  });

  return result.docs.length;
}
