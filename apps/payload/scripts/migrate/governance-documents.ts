import { assetIdFrom } from "./lib/asset-ref";
import { ensureMediaForRef } from "./lib/assets";
import { getPayloadClient } from "./lib/payload-client";
import { createSanityExportReader } from "./lib/sanity-export";
import { wipe } from "./lib/wipe";

const SITE_SETTINGS_ID = "siteSettings";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const before = {
  docs: (await payload.find({ collection: "governanceDocuments", limit: 0 }))
    .totalDocs,
  groups: (await payload.find({ collection: "governanceGroups", limit: 0 }))
    .totalDocs,
};
console.log(
  `[gov-docs] wiping ${before.groups} existing groups, ${before.docs} existing documents`,
);
// Wipe documents first (FK → groups), then groups.
await wipe(payload, "governanceDocuments");
await wipe(payload, "governanceGroups");

const settings = await reader.docById(SITE_SETTINGS_ID);
if (!settings) {
  console.warn(
    `[gov-docs] no siteSettings doc with _id="${SITE_SETTINGS_ID}" in export`,
  );
  process.exit(0);
}

const groups =
  (settings.governanceResources as
    | {
        _key?: string;
        groupTitle?: string;
        resources?: {
          _key?: string;
          name?: string;
          fileOrLink?: string;
          file?: { _sanityAsset?: string; asset?: { _ref?: string } };
          url?: string;
        }[];
      }[]
    | undefined) ?? [];

console.log(`[gov-docs] found ${groups.length} groups in siteSettings`);

let groupsImported = 0;
let docsImported = 0;
let docsDropped = 0;

for (const group of groups) {
  const groupTitle = String(group.groupTitle ?? "Untitled group");
  const created = await payload.create({
    collection: "governanceGroups",
    data: {
      sanityDocId: group._key,
      title: groupTitle,
    } as never,
  });
  groupsImported++;
  console.log(
    `[gov-docs]   group: ${created.id} ${groupTitle} (${group.resources?.length ?? 0} resources)`,
  );

  for (const item of group.resources ?? []) {
    try {
      const data = await transformResource(item, created.id as string);
      if (!data) {
        docsDropped++;
        console.warn(
          `[gov-docs]     drop: ${item._key} ${item.name}: no file or url`,
        );
        continue;
      }
      await payload.create({
        collection: "governanceDocuments",
        data: data as never,
      });
      docsImported++;
    } catch (err) {
      docsDropped++;
      console.error(
        `[gov-docs]     fail: ${item._key} ${item.name}: ${(err as Error).message}`,
      );
    }
  }
}

console.log(
  `[gov-docs] imported ${groupsImported} groups, ${docsImported} documents (${docsDropped} dropped)`,
);
process.exit(0);

async function transformResource(
  item: {
    _key?: string;
    name?: string;
    fileOrLink?: string;
    file?: { _sanityAsset?: string; asset?: { _ref?: string } };
    url?: string;
  },
  groupId: string,
) {
  const title = String(item.name ?? "Untitled");
  const url = item.url?.trim();
  const fileRef = assetIdFrom(item.file);

  if (fileRef) {
    const media = await ensureMediaForRef(payload, reader, fileRef);
    if (!media) return null;

    return {
      enabled: true,
      file: media.id,
      group: groupId,
      sanityDocId: item._key,
      title,
      type: "file" as const,
    };
  }

  if (url) {
    return {
      enabled: true,
      group: groupId,
      sanityDocId: item._key,
      title,
      type: "link" as const,
      url,
    };
  }

  return null;
}
