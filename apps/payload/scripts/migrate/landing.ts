import { assetIdFrom } from "./lib/asset-ref";
import { ensureMediaForRef } from "./lib/assets";
import { getPayloadClient } from "./lib/payload-client";
import {
  type PortableTextNode,
  portableTextToLexical,
} from "./lib/portable-text-to-lexical";
import { createSanityExportReader } from "./lib/sanity-export";

const SITE_SETTINGS_ID = "siteSettings";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const settings = await reader.docById(SITE_SETTINGS_ID);
if (!settings) {
  console.warn(
    "[landing] siteSettings not in export; leaving global untouched",
  );
  process.exit(0);
}

const lp = (settings.landingPage as Record<string, unknown> | undefined) ?? {};

const resolveUpload = async (ref: string): Promise<string | undefined> => {
  const media = await ensureMediaForRef(payload, reader, ref);

  return media?.id;
};

const heroId = await resolveUpload(assetIdFrom(lp.heroImage) ?? "");

const sanityImages =
  (lp.images as
    | { _key?: string; _sanityAsset?: string; asset?: { _ref?: string } }[]
    | undefined) ?? [];
const images: { image: string }[] = [];
for (const img of sanityImages) {
  const id = await resolveUpload(assetIdFrom(img) ?? "");
  if (id) images.push({ image: id });
}

const description = await portableTextToLexical(
  (lp.description as PortableTextNode[] | undefined) ?? [],
  { resolveUpload },
);

await payload.updateGlobal({
  data: {
    description,
    hero: heroId,
    images,
    tagline: (lp.tagline as string | undefined) ?? "",
    title: (lp.title as string | undefined) ?? "",
  } as never,
  slug: "landing",
});

console.log(
  `[landing] applied hero=${heroId ? "✓" : "—"} images=${images.length} tagline=${Boolean(lp.tagline)}`,
);
process.exit(0);
