import { ensureMediaForRef } from "./lib/assets";
import { getPayloadClient } from "./lib/payload-client";
import { createSanityExportReader, type SanityDoc } from "./lib/sanity-export";
import { wipe } from "./lib/wipe";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const before = await payload.find({ collection: "people", limit: 0 });
console.log(`[people] wiping ${before.totalDocs} existing people`);
await wipe(payload, "people");

let imported = 0;

for await (const doc of reader.docsOfType("person")) {
  try {
    const data = await transform(doc);
    await payload.create({
      collection: "people",
      data: data as never,
    });
    imported++;
    console.log(`[people]   ok: ${doc._id} ${data.firstName} ${data.lastName}`);
  } catch (err) {
    console.error(
      `[people] fail: ${doc._id} ${doc.firstName} ${doc.surname}: ${(err as Error).message}`,
    );
  }
}

console.log(`[people] imported ${imported} people`);
process.exit(0);

async function transform(doc: SanityDoc) {
  const figure = doc.image as
    | { image?: { asset?: { _ref?: string } }; altText?: string }
    | undefined;
  const imageMediaId = await ensureMediaForRef(
    payload,
    reader,
    figure?.image?.asset?._ref ?? null,
  ).then((media) => media?.id);

  const firstName = String(doc.firstName ?? "").trim() || "Unknown";
  const lastName = String(doc.surname ?? "").trim() || "Unknown";

  return {
    sanityDocId: doc._id,
    firstName,
    lastName,
    bio: (doc.bio as string | undefined) ?? undefined,
    email: String(doc.email ?? "").trim() || undefined,
    image: imageMediaId,
  };
}
