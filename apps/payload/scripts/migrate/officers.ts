import { getPayloadClient } from "./lib/payload-client";
import { resolveByDocId } from "./lib/refs";
import { createSanityExportReader, type SanityDoc } from "./lib/sanity-export";
import { wipe } from "./lib/wipe";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const before = await payload.find({ collection: "officers", limit: 0 });
console.log(`[officers] wiping ${before.totalDocs} existing officers`);
await wipe(payload, "officers");

const all: SanityDoc[] = [];
for await (const doc of reader.docsOfType("officers")) all.push(doc);

// Sort by Sanity's orderRank so Payload's orderable index follows the
// editorial order from Sanity (Payload assigns _order on insertion).
all.sort((a, b) =>
  String(a.orderRank ?? "").localeCompare(String(b.orderRank ?? "")),
);

let imported = 0;
let vacant = 0;
let nameOnly = 0;

for (const doc of all) {
  try {
    const data = await transform(doc);
    if (data.occupant === undefined && !doc.vacant) {
      // No occupant, not marked vacant, and Sanity had a name override —
      // we drop the override (Payload Officers has no nameOverride field).
      // Log so it's visible.
      if (doc.name) {
        nameOnly++;
        console.warn(
          `[officers] dropping name-override on ${doc._id} ${doc.role}: ${doc.name}`,
        );
      }
    }
    if (data.occupant === undefined && doc.vacant) vacant++;

    await payload.create({
      collection: "officers",
      data: data as never,
    });
    imported++;
    console.log(`[officers]   ok: ${doc._id} ${data.role}`);
  } catch (err) {
    console.error(
      `[officers] fail: ${doc._id} ${doc.role}: ${(err as Error).message}`,
    );
  }
}

console.log(
  `[officers] imported ${imported} officers (${vacant} vacant, ${nameOnly} name-override dropped)`,
);
process.exit(0);

async function transform(doc: SanityDoc) {
  const occupantRef = (doc.occupant as { _ref?: string } | undefined)?._ref;
  const occupantId = await resolveByDocId(payload, "people", occupantRef);
  if (occupantRef && !occupantId) {
    console.warn(
      `[officers] ${doc._id} ${doc.role}: occupant ref ${occupantRef} did not resolve to any people record`,
    );
  }

  return {
    description: (doc.description as string | undefined) ?? undefined,
    occupant: occupantId,
    role: String(doc.role ?? "Untitled role"),
  };
}
