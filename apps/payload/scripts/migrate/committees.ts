import { getPayloadClient } from "./lib/payload-client";
import { resolveByDocId } from "./lib/refs";
import { createSanityExportReader } from "./lib/sanity-export";
import { wipe } from "./lib/wipe";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const before = await payload.find({ collection: "committees", limit: 0 });
console.log(`[committees] wiping ${before.totalDocs} existing committees`);
await wipe(payload, "committees");

let imported = 0;
let droppedMembers = 0;

for await (const doc of reader.docsOfType("committees")) {
  const memberRefs = (doc.members as { _ref?: string }[] | undefined) ?? [];

  const resolvedMembers: string[] = [];
  for (const m of memberRefs) {
    const id = await resolveByDocId(payload, "officers", m._ref);
    if (id) {
      resolvedMembers.push(id);
    } else {
      droppedMembers++;
      console.warn(
        `[committees] ${doc._id} ${doc.title}: member ref ${m._ref} not found in officers`,
      );
    }
  }

  try {
    await payload.create({
      collection: "committees",
      data: {
        description: (doc.description as string | undefined) ?? undefined,
        members: resolvedMembers,
        sanityDocId: doc._id,
        title: String(doc.title ?? "Untitled committee"),
      } as never,
    });
    imported++;
    console.log(
      `[committees]   ok: ${doc._id} ${doc.title} (${resolvedMembers.length} members)`,
    );
  } catch (err) {
    console.error(
      `[committees] fail: ${doc._id} ${doc.title}: ${(err as Error).message}`,
    );
  }
}

console.log(
  `[committees] imported ${imported} committees (${droppedMembers} member refs dropped)`,
);
process.exit(0);
