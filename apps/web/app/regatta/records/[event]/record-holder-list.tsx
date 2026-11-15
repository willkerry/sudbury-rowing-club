import { Blade } from "@/components/stour/blade";
import type { Record } from "../transformRecords";
import { formatClubAndCrewName, getBladeUrls } from "./utils";

const RecordHolder = ({
  record,
  status,
}: {
  record: Record;
  status?: "Set" | "Equalled";
}) => {
  const bladeUrls = getBladeUrls(record.parsedClub);
  const crew = record.club.concat(record.name && ` ${record.name}`);

  return (
    <li className="flex items-center gap-3">
      {bladeUrls.length > 0 && (
        <div className="flex shrink-0 items-center gap-2">
          {bladeUrls.map((url) => (
            <Blade
              className="h-6 w-12"
              height={24}
              key={url}
              src={url}
              width={48}
            />
          ))}
        </div>
      )}

      <div className="min-w-0">
        <div className="font-medium text-gray-900">
          {formatClubAndCrewName(record.parsedClub)}
        </div>
        <div className="text-sm text-gray-500 tabular-nums">
          {crew} · {status && `${status} `}
          {record.year.getFullYear()}
        </div>
      </div>
    </li>
  );
};

export const RecordHolderList = ({ records }: { records: Record[] }) => (
  <ul className="not-prose mb-12 grid grid-cols-1 gap-4">
    {records.map((record, index) => (
      <RecordHolder
        key={`${record.club}-${record.year}`}
        record={record}
        status={
          records.length > 1 ? (index === 0 ? "Set" : "Equalled") : undefined
        }
      />
    ))}
  </ul>
);
