import TextPage from "@/components/layouts/text-page";
import { createMetadata } from "@/lib/create-metadata";
import { getCommitteeArchive } from "@/lib/get-committee-archive";
import { initialiseName } from "@/lib/helpers/initialiseName";
import Link from "next/link";
import { listify } from "radash";

export const metadata = createMetadata({
  title: "Committees",
  description: "List of Sudbury Rowing Club committees since 1874",
});

const committeeArchive = getCommitteeArchive();

const Archive = () => (
  <TextPage
    title="Committee Archive"
    className="grid grid-cols-2 gap-x-2 sm:grid-cols-3 md:grid-cols-4"
  >
    {committeeArchive.map(({ season, ...committee }) => (
      <div key={season}>
        <Link href={`committees/${season}`}>
          <h2 id={`season-${season}`}>{season}</h2>
        </Link>
        <ul className="mb-8 list-none pl-0">
          {listify(committee.committee, (key, office) => (
            <li className="mt-0 mb-2 pl-0" key={key}>
              <span className="block font-semibold text-gray-400 text-xs uppercase tracking-widest">
                {office?.displayName}
              </span>

              {office?.holders.map((name) => (
                <span className="block leading-snug" key={name}>
                  {initialiseName(name)}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </TextPage>
);

export default Archive;
