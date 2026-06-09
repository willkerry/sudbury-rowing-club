import type { Payload } from "payload";

/**
 * Resolve a Sanity _id to the corresponding Payload id for collections that
 * store the original _id in a `sanityDocId` field. Returns undefined when
 * no match is found (caller should decide whether to skip or fail).
 */
export async function resolveByDocId(
  payload: Payload,
  collection: "people",
  sanityRef: string | undefined | null,
): Promise<string | undefined> {
  if (!sanityRef) return;
  const found = await payload.find({
    collection,
    limit: 1,
    where: { sanityDocId: { equals: sanityRef } },
  });

  return (found.docs[0]?.id as string | undefined) ?? undefined;
}
