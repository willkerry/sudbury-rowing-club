import { getPayloadClient } from "./lib/payload-client";
import { resolveByDocId } from "./lib/refs";
import { createSanityExportReader } from "./lib/sanity-export";
import { wipe } from "./lib/wipe";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const before = await payload.find({ collection: "vice-presidents", limit: 0 });
console.log(`[vps] wiping ${before.totalDocs} existing vice-presidents`);
await wipe(payload, "vice-presidents");

let imported = 0;
let skipped = 0;

for await (const doc of reader.docsOfType("vicePresidents")) {
  const personRef = (doc.reference as { _ref?: string } | undefined)?._ref;
  const display = `${doc.firstName ?? ""} ${doc.surname ?? ""}`.trim();

  if (!personRef) {
    skipped++;
    console.warn(`[vps] skipping ${doc._id} (${display}): no person reference`);
    continue;
  }

  const personId = await resolveByDocId(payload, "people", personRef);
  if (!personId) {
    skipped++;
    console.warn(
      `[vps] skipping ${doc._id} (${display}): person ref ${personRef} not found in people`,
    );
    continue;
  }

  try {
    await payload.create({
      collection: "vice-presidents",
      data: {
        person: personId,
      } as never,
    });
    imported++;
    console.log(`[vps]   ok: ${doc._id} ${display}`);
  } catch (err) {
    console.error(
      `[vps] fail: ${doc._id} ${display}: ${(err as Error).message}`,
    );
  }
}

console.log(`[vps] imported ${imported} vice-presidents (${skipped} skipped)`);
process.exit(0);
