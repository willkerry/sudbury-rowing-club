import { assetIdFrom } from "./lib/asset-ref";
import { ensureMediaForRef } from "./lib/assets";
import { getPayloadClient } from "./lib/payload-client";
import {
  type PortableTextNode,
  portableTextToLexical,
} from "./lib/portable-text-to-lexical";
import { createSanityExportReader, type SanityDoc } from "./lib/sanity-export";
import { createSlugger } from "./lib/slug";
import { wipe } from "./lib/wipe";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const before = await payload.find({ collection: "safetyNotices", limit: 0 });
console.log(`[safety] wiping ${before.totalDocs} existing safetyNotices`);
await wipe(payload, "safetyNotices");

const slugger = createSlugger();
let imported = 0;

const resolveUpload = async (ref: string): Promise<string | undefined> => {
  const media = await ensureMediaForRef(payload, reader, ref);

  return media?.id;
};

for await (const doc of reader.docsOfType("safety")) {
  const data = await transform(doc);
  try {
    await payload.create({
      collection: "safetyNotices",
      data: data as never,
    });
    imported++;
    console.log(`[safety]   ok: ${doc._id} ${doc.title}`);
  } catch (err) {
    console.error(
      `[safety] fail: ${doc._id} ${doc.title}: ${(err as Error).message}`,
    );
    console.error(
      `[safety]   body json: ${JSON.stringify(data.body).slice(0, 400)}`,
    );
  }
}

console.log(`[safety] imported ${imported} notices`);
process.exit(0);

async function transform(doc: SanityDoc) {
  const title = String(doc.title ?? "Untitled");
  const slug = slugger(title);

  const sanityDoc = doc.document as
    | { title?: string; asset?: { _ref?: string }; _sanityAsset?: string }
    | undefined;
  const documentMediaId = await resolveUpload(assetIdFrom(sanityDoc) ?? "");

  const sanityLink = doc.link as { url?: string } | undefined;

  const body = await portableTextToLexical(
    (doc.body as PortableTextNode[] | undefined) ?? [],
    { resolveUpload },
  );

  return {
    id: doc._id,
    sanityDocId: doc._id,
    slug,
    title,
    body,
    date:
      (doc.date as string | undefined) ??
      doc._updatedAt ??
      new Date().toISOString(),
    document: documentMediaId
      ? {
          document: documentMediaId,
          title: sanityDoc?.title ?? title,
        }
      : undefined,
    link: sanityLink?.url ?? undefined,
    pin: Boolean(doc.pin ?? false),
  };
}
