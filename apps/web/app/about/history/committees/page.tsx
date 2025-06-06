import TextPage from "@/components/layouts/text-page";
import { createMetadata } from "@/lib/create-metadata";
import { getCommitteeArchive } from "@/lib/get-committee-archive";
import { slug } from "github-slugger";
import Link from "next/link";
import { listify } from "radash";
import { InitialisedName } from "./InitialiseName";

export const metadata = createMetadata({
  title: "Committees",
  description: "List of Sudbury Rowing Club committees since 1874",
});

const committeeArchive = getCommitteeArchive();

const Archive = () => (
  <TextPage
    title="Committee archive"
    prose={false}
    className="prose flex max-w-full flex-wrap"
  >
    {committeeArchive.map(({ season, ...committee }) => (
      <div key={season} className="w-40">
        <Link href={`committees/${slug(season)}`}>
          <h2 id={`season-${season}`}>{season}</h2>
        </Link>
        <ul className="mb-8 list-none pl-0">
          {listify(committee.committee, (key, office) => (
            <li className="mt-0 mb-2 pl-0" key={key}>
              <span className="block font-semibold text-gray-400 text-xs uppercase tracking-widest">
                {office?.displayName}
              </span>

              {office?.holders.map((name) => (
                <InitialisedName name={name} key={name} />
              ))}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </TextPage>
);

export default Archive;
