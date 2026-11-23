import { getClubLookup } from "@/lib/getClub";
import { getClubsFromCompositeCrewString } from "./[event]/utils";
import recordJson from "./records.json";
import { type Record, RecordSchema } from "./transformRecords";

/** Records with their clubs resolved. Server-only: it loads club data. */
export const transformRecords = async (
  records: typeof recordJson,
): Promise<Record[]> => {
  const clubs = await getClubLookup();

  return RecordSchema.array()
    .parse(records)
    .map((record) => ({
      ...record,
      parsedClub: getClubsFromCompositeCrewString(record.club, clubs),
    }));
};

export const getResultBySlug = async (eventSlug: string): Promise<Record[]> =>
  (await transformRecords(recordJson)).filter(
    (record) => record.slug === eventSlug,
  );
