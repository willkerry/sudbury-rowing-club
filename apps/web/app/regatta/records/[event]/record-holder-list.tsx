import Image from "next/image";
import { cloudflareLoader } from "@/lib/loaders/cloudflare-loader";
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
        <Image
          src={url}
          className="mr-2 inline-block h-6 w-12"
          loading="lazy"
          alt=""
          key={url}
          width={48}
          height={24}
          loader={cloudflareLoader}
        />
      ))}

      <span>
        {clubAndCrew}, {year}
      </span>
    </li>
  );
};

export const RecordHolderList = ({ records }: { records: Record[] }) => (
  <ul className="not-prose mb-12 grid grid-cols-1 gap-3">
    {records.map((record) => (
      <RecordHolder key={`${record.club}-${record.year}`} record={record} />
    ))}
  </ul>
);
