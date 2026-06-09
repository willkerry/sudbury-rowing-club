import { getPayloadClient } from "./lib/payload-client";
import { createSanityExportReader, type SanityDoc } from "./lib/sanity-export";
import { wipe } from "./lib/wipe";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const before = await payload.find({ collection: "regattas", limit: 0 });
console.log(`[regattas] wiping ${before.totalDocs} existing regattas`);
await wipe(payload, "regattas");

let imported = 0;

for await (const doc of reader.docsOfType("regattas")) {
  try {
    const data = transform(doc);
    await payload.create({
      collection: "regattas",
      data: data as never,
    });
    imported++;
  } catch (err) {
    console.error(
      `[regattas] fail: ${doc._id} #${doc.number}: ${(err as Error).message}`,
    );
  }
}

console.log(`[regattas] imported ${imported} regattas`);
process.exit(0);

function transform(doc: SanityDoc) {
  const galleries = (
    (doc.galleries as
      | { name?: string; url?: string; password?: string }[]
      | undefined) ?? []
  )
    .filter((g) => g.name && g.url)
    .map((g) => ({
      name: g.name ?? "",
      password: g.password ?? undefined,
      url: g.url ?? "",
    }));

  const testimonials = (
    (doc.testimonials as
      | { quote?: string; name?: string; club?: string }[]
      | undefined) ?? []
  )
    .filter((t) => t.quote)
    .map((t) => ({
      club: t.club ?? undefined,
      name: t.name ?? undefined,
      quote: t.quote ?? "",
    }));

  return {
    date: (doc.date as string | undefined) ?? doc._updatedAt,
    galleries,
    number: doc.number as number,
    results: (doc.results as string | undefined) ?? undefined,
    sanityDocId: doc._id,
    testimonials,
  };
}
