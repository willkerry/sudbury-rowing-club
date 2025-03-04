import type { Record } from "../transformRecords";
import { formatClubAndCrewName, getBladeUrls } from "./utils";

const RecordHolder = ({ record }: { record: Record }) => {
  const bladeUrls = getBladeUrls(record.club);

  const year = record.year.getFullYear();
  const club = formatClubAndCrewName(record.club);

  const crew = record.club.concat(record.name && ` ${record.name}`);

  const clubAndCrew = club.concat(` (${crew})`);

  return (
    <li className="p-0">
      {bladeUrls.map((url) => (
        <img
          src={url}
          className="mr-2 inline-block h-6 w-12"
          loading="lazy"
          alt=""
          key={url}
        />
      ))}

      <span>
        {clubAndCrew}, {year}
      </span>
    </li>
  );
};

export const RecordHolderList = ({ records }: { records: Record[] }) => (
  <ul className="not-prose mb-12 grid grid-cols-1 justify-items-center gap-3">
    {records.map((record) => (
      <RecordHolder key={`${record.club}-${record.year}`} record={record} />
    ))}
  </ul>
);
