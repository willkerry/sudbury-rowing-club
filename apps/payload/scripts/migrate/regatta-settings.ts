import { assetIdFrom } from "./lib/asset-ref";
import { ensureMediaForRef } from "./lib/assets";
import { getPayloadClient } from "./lib/payload-client";
import { toLexical } from "./lib/portable-text-to-lexical";
import { createSanityExportReader } from "./lib/sanity-export";

const REGATTA_SETTINGS_ID = "1af70bac-279d-486d-9c87-cfb4de0b6964";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const settings = await reader.docById(REGATTA_SETTINGS_ID);
if (!settings) {
  console.warn("[regatta-settings] regattaSettings missing in export");
  process.exit(0);
}

const resolveUpload = async (ref: string): Promise<string | undefined> => {
  const media = await ensureMediaForRef(payload, reader, ref);

  return media?.id;
};

const lp = (settings.landingPage as Record<string, unknown> | undefined) ?? {};

const sanityImages =
  (lp.images as
    | { _sanityAsset?: string; asset?: { _ref?: string } }[]
    | undefined) ?? [];
const images: { image: string }[] = [];
for (const img of sanityImages) {
  const id = await resolveUpload(assetIdFrom(img) ?? "");
  if (id) images.push({ image: id });
}

const description = await toLexical(lp.description, { resolveUpload });

// Events: array of event objects under regattaSettings.events.events.
// Sanity stores boat classes with unicode (× and −); Payload's select uses
// ASCII (x and -). Normalise to ASCII before insert.
const BOAT_CLASS_NORMALISE: Record<string, string> = {
  "1×": "1x",
  "2×": "2x",
  "2−": "2-",
  "4×+": "4x+",
  "4×−": "4x-",
};
function normaliseBoatClass(value: string): string {
  return BOAT_CLASS_NORMALISE[value] ?? value;
}
const sanityEvents =
  (settings.events as { events?: SanityEvent[] } | undefined)?.events ?? [];
const events = sanityEvents.map((e) => ({
  boatClasses: (e.boatClasses ?? []).map(normaliseBoatClass),
  categories: e.categories ?? undefined,
  course: e.course ?? undefined,
  description: e.description ?? undefined,
  gender: e.gender ?? undefined,
  prizes: e.prizes ?? undefined,
  title: e.title ?? "Untitled event",
}));

// Entries: only description maps cleanly; the wave matrix has no Payload home.
const sanityEntries =
  (settings.entries as { description?: unknown } | undefined) ?? {};
const entriesDescription = await toLexical(sanityEntries.description, {
  resolveUpload,
});

const sanityResults =
  (settings.results as
    | { description?: unknown; courseRecords?: { _sanityAsset?: string } }
    | undefined) ?? {};
const resultsDescription = await toLexical(sanityResults.description, {
  resolveUpload,
});
const courseRecordsId = await resolveUpload(
  assetIdFrom(sanityResults.courseRecords) ?? "",
);

const sanityCourse =
  (settings.courseMap as
    | {
        heading?: string;
        description?: unknown;
        map?: unknown;
        mapImage?: unknown;
      }
    | undefined) ?? {};
const courseDescription = await toLexical(sanityCourse.description, {
  resolveUpload,
});
const courseMapId = await resolveUpload(assetIdFrom(sanityCourse.map) ?? "");
const courseMapImageId = await resolveUpload(
  assetIdFrom(sanityCourse.mapImage) ?? "",
);

await payload.updateGlobal({
  data: {
    date: (settings.date as string | undefined) ?? undefined,
    course: {
      description: courseDescription,
      heading: sanityCourse.heading ?? "",
      map: courseMapId,
      mapImage: courseMapImageId,
    },
    description,
    entries: {
      description: entriesDescription,
    },
    events,
    images,
    tagline: (lp.tagline as string | undefined) ?? "",
    title: (settings.title as string | undefined) ?? "",
    results: {
      courseRecords: courseRecordsId,
      description: resultsDescription,
    },
  } as never,
  slug: "regatta",
});

console.log(
  `[regatta-settings] applied title="${settings.title}" events=${events.length} images=${images.length}`,
);
process.exit(0);

interface SanityEvent {
  boatClasses?: string[];
  categories?: string;
  course?: string;
  description?: string;
  gender?: string;
  prizes?: string;
  title?: string;
}
