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

  // Sanity calls the quote text "text" on the testimonial object; Payload's
  // schema names the field "quote". Map accordingly.
  const testimonials = (
    (doc.testimonials as
      | { text?: string; name?: string; club?: string }[]
      | undefined) ?? []
  )
    .filter((t) => t.text?.trim())
    .map((t) => ({
      club: t.club?.trim() || undefined,
      name: t.name?.trim() || undefined,
      quote: t.text ?? "",
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
