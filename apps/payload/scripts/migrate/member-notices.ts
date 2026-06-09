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

const before = await payload.find({ collection: "memberNotices", limit: 0 });
console.log(`[member-notices] wiping ${before.totalDocs} existing notices`);
await wipe(payload, "memberNotices");

const slugger = createSlugger();
let imported = 0;
let droppedDocs = 0;

const resolveUpload = async (ref: string): Promise<string | undefined> => {
  const media = await ensureMediaForRef(payload, reader, ref);

  return media?.id;
};

for await (const doc of reader.docsOfType("members")) {
  try {
    const data = await transform(doc);
    await payload.create({
      collection: "memberNotices",
      data: data as never,
    });
    imported++;
    console.log(`[member-notices]   ok: ${doc._id} ${doc.title}`);
  } catch (err) {
    console.error(
      `[member-notices] fail: ${doc._id} ${doc.title}: ${(err as Error).message}`,
    );
  }
}

console.log(
  `[member-notices] imported ${imported} notices (${droppedDocs} document refs dropped)`,
);
process.exit(0);

interface SanityFile {
  _sanityAsset?: string;
  asset?: { _ref?: string };
  title?: string;
}
interface SanityDocGroup {
  documents?: SanityFile[];
  title?: string;
}
interface PayloadDocGroup {
  files: { title?: string; file: string }[];
  title?: string;
}

async function resolveGroup(group: SanityDocGroup): Promise<PayloadDocGroup> {
  const files: PayloadDocGroup["files"] = [];
  for (const f of group.documents ?? []) {
    const fileId = await resolveUpload(assetIdFrom(f) ?? "");
    if (!fileId) {
      droppedDocs++;
      continue;
    }
    files.push({ file: fileId, title: f.title });
  }

  return { files, title: group.title };
}

async function transform(doc: SanityDoc) {
  const title = String(doc.title ?? "Untitled");
  const sanitySlug = doc.slug as { current?: string } | undefined;
  const slug = slugger(sanitySlug?.current?.trim() || title);

  const meta = (
    (doc.meta as { label?: string; value?: string }[] | undefined) ?? []
  )
    .filter((m) => m.label || m.value)
    .map((m) => ({
      label: m.label ?? "",
      value: m.value ?? "",
    }));

  const body = await portableTextToLexical(
    (doc.body as PortableTextNode[] | undefined) ?? [],
    { resolveUpload },
  );

  const sanityGroups = (doc.documents as SanityDocGroup[] | undefined) ?? [];
  const documents: PayloadDocGroup[] = [];
  for (const group of sanityGroups) {
    const resolved = await resolveGroup(group);
    if (resolved.files.length > 0 || resolved.title) {
      documents.push(resolved);
    }
  }

  return {
    sanityDocId: doc._id,
    title,
    slug,
    meta,
    body,
    documents,
    _status: "published" as const,
  };
}
