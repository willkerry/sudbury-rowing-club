import { getPayloadClient } from "./lib/payload-client";
import { createSanityExportReader } from "./lib/sanity-export";

const reader = createSanityExportReader();
const payload = await getPayloadClient();

const status = await reader.docById("safetyStatus");
if (!status) {
  console.warn(
    "[safety-status] no safetyStatus document in export — leaving global untouched",
  );
  process.exit(0);
}

const rawStatus = String(status.status ?? "neutral");
const validStatuses = ["neutral", "green", "amber", "red"] as const;
const safeStatus = (validStatuses as readonly string[]).includes(rawStatus)
  ? (rawStatus as (typeof validStatuses)[number])
  : "neutral";

await payload.updateGlobal({
  data: {
    description: (status.description as string) ?? "",
    display: Boolean(status.display ?? false),
    status: safeStatus,
  } as never,
  slug: "safetyStatus",
});

console.log(
  `[safety-status] applied status="${safeStatus}" display=${Boolean(status.display)}`,
);
process.exit(0);
