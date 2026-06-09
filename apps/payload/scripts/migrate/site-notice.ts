import { getPayloadClient } from "./lib/payload-client";
import {
  type PortableTextNode,
  portableTextToLexical,
} from "./lib/portable-text-to-lexical";
import { createSanityExportReader } from "./lib/sanity-export";

const REGATTA_SETTINGS_ID = "1af70bac-279d-486d-9c87-cfb4de0b6964";

const reader = createSanityExportReader();
await reader.preload();

const payload = await getPayloadClient();

const settings = await reader.docById(REGATTA_SETTINGS_ID);
if (!settings?.note) {
  console.warn(
    "[site-notice] regattaSettings document or its note field missing — leaving global untouched",
  );
  process.exit(0);
}

const note = settings.note as {
  display?: boolean;
  label?: string;
  link?: string;
  text?: PortableTextNode[];
  type?: string;
  date?: string;
  includeTime?: boolean;
};

const validVariants = [
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
] as const;
const rawVariant = String(note.type ?? "primary");
const variant = (validVariants as readonly string[]).includes(rawVariant)
  ? (rawVariant as (typeof validVariants)[number])
  : "primary";

const body = await portableTextToLexical(note.text ?? [], {
  resolveUpload: async () => undefined,
});

await payload.updateGlobal({
  data: {
    body,
    date: (note.date as string | undefined) ?? undefined,
    display: Boolean(note.display ?? false),
    includeTime: Boolean(note.includeTime ?? false),
    label: (note.label as string | undefined) ?? "",
    link: (note.link as string | undefined) ?? "",
    variant,
  } as never,
  slug: "siteNotice",
});

console.log(
  `[site-notice] applied display=${Boolean(note.display)} variant=${variant} label="${note.label ?? ""}"`,
);
process.exit(0);
