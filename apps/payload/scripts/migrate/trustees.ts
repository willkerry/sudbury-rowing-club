import { getPayloadClient } from "./lib/payload-client";
import { resolveByDocId } from "./lib/refs";
import { createSanityExportReader } from "./lib/sanity-export";
import { wipe } from "./lib/wipe";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const before = await payload.find({ collection: "trustees", limit: 0 });
console.log(`[trustees] wiping ${before.totalDocs} existing trustees`);
await wipe(payload, "trustees");

let imported = 0;
let skipped = 0;

for await (const doc of reader.docsOfType("trustees")) {
  const personRef = (doc.reference as { _ref?: string } | undefined)?._ref;
  const display = `${doc.firstName ?? ""} ${doc.surname ?? ""}`.trim();

  if (!personRef) {
    skipped++;
    console.warn(
      `[trustees] skipping ${doc._id} (${display}): no person reference`,
    );
    continue;
  }

  const personId = await resolveByDocId(payload, "people", personRef);
  if (!personId) {
    skipped++;
    console.warn(
      `[trustees] skipping ${doc._id} (${display}): person ref ${personRef} not found in people`,
    );
    continue;
  }

  try {
    await payload.create({
      collection: "trustees",
      data: {
        person: personId,
      } as never,
    });
    imported++;
    console.log(`[trustees]   ok: ${doc._id} ${display}`);
  } catch (err) {
    console.error(
      `[trustees] fail: ${doc._id} ${display}: ${(err as Error).message}`,
    );
  }
}

console.log(`[trustees] imported ${imported} trustees (${skipped} skipped)`);
process.exit(0);
