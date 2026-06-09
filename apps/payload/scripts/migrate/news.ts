import { assetIdFrom } from "./lib/asset-ref";
import { ensureMediaForRef } from "./lib/assets";
import { getPayloadClient } from "./lib/payload-client";
import {
  type PortableTextNode,
  portableTextToLexical,
} from "./lib/portable-text-to-lexical";
import { resolveByDocId } from "./lib/refs";
import { createSanityExportReader, type SanityDoc } from "./lib/sanity-export";
import { createSlugger } from "./lib/slug";
import { wipe } from "./lib/wipe";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

// Build a Sanity-author-id → Sanity-person-id map up front so we can do a
// single Payload lookup per news post rather than two hops at insertion.
const authorToPerson = new Map<string, string>();
for await (const doc of reader.docsOfType("author")) {
  const personRef = (doc.person as { _ref?: string } | undefined)?._ref;
  if (personRef) authorToPerson.set(doc._id, personRef);
}
console.log(`[news] loaded ${authorToPerson.size} author→person mappings`);

const before = await payload.find({ collection: "news", limit: 0 });
console.log(`[news] wiping ${before.totalDocs} existing posts`);
await wipe(payload, "news");

const slugger = createSlugger();
let imported = 0;
let noAuthor = 0;
let noHero = 0;
let authorOrphan = 0;

const resolveUpload = async (ref: string): Promise<string | undefined> => {
  const media = await ensureMediaForRef(payload, reader, ref);

  return media?.id;
};

for await (const doc of reader.docsOfType("news")) {
  try {
    const data = await transform(doc);
    if (!data.author) noAuthor++;
    if (!data.featuredImage) noHero++;

    await payload.create({
      collection: "news",
      data: data as never,
    });
    imported++;
    if (imported % 25 === 0) {
      console.log(`[news]   progress: ${imported} imported`);
    }
  } catch (err) {
    console.error(
      `[news] fail: ${doc._id} ${doc.title}: ${(err as Error).message}`,
    );
  }
}

console.log(
  `[news] imported ${imported} posts (${noAuthor} no-author, ${noHero} no-hero, ${authorOrphan} author refs dropped)`,
);
process.exit(0);

async function transform(doc: SanityDoc) {
  const title = String(doc.title ?? "Untitled");

  const sanitySlug = doc.slug as { current?: string } | undefined;
  const slugSource = sanitySlug?.current?.trim() || title;
  const slug = slugger(slugSource);

  const authorRef = (doc.author as { _ref?: string } | undefined)?._ref;
  let authorPayloadId: string | undefined;
  if (authorRef) {
    const personRef = authorToPerson.get(authorRef);
    if (personRef) {
      authorPayloadId = await resolveByDocId(payload, "people", personRef);
      if (!authorPayloadId) {
        authorOrphan++;
        console.warn(
          `[news] ${doc._id} ${title}: author ${authorRef} → person ${personRef} did not resolve to any people record`,
        );
      }
    } else {
      authorOrphan++;
      console.warn(
        `[news] ${doc._id} ${title}: author ${authorRef} has no person link in Sanity`,
      );
    }
  }

  const featuredImageId = await resolveUpload(
    assetIdFrom(doc.featuredImage) ?? "",
  );

  const body = await portableTextToLexical(
    (doc.body as PortableTextNode[] | undefined) ?? [],
    { resolveUpload },
  );

  return {
    sanityDocId: doc._id,
    title,
    slug,
    author: authorPayloadId,
    date:
      (doc.date as string | undefined) ??
      doc._updatedAt ??
      new Date().toISOString(),
    excerpt: (doc.excerpt as string | undefined) ?? undefined,
    featuredImage: featuredImageId,
    body,
    _status: "published" as const,
  };
}
