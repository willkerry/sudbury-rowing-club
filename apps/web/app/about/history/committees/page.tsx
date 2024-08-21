import TextPage from "@/components/layouts/text-page";
import committees from "@/data/officer-archive.json";
import { createMetadata } from "@/lib/create-metadata";
import { listify } from "radash";

export const metadata = createMetadata({
  title: "Committees",
  description: "List of Sudbury Rowing Club committees since 1874",
});

type Position = keyof (typeof committees)[0];

const POSITION_NAMES = new Map<Position, [string, string]>([
  ["president", ["President", "Presidents"]],
  ["captain", ["Captain", "Captains"]],
  ["chair", ["Chair", "Chairs"]],
  ["secretary", ["Secretary", "Secretaries"]],
  ["treasurer", ["Treasurer", "Treasurers"]],
  ["viceCaptains", ["Vice Captain", "Vice Captains"]],
  ["ladiesCaptain", ["Ladies Captain", "Ladies Captains"]],
  ["ladiesSecretary", ["Ladies Secretary", "Ladies Secretaries"]],
  ["ladiesViceCaptain", ["Ladies VC", "Ladies VCs"]],
  ["season", ["Season", "Seasons"]],
]);

const initialiseName = (name: string) => {
  const names = name.split(" ");
  const surname = names.pop()?.replace("+", " ");

  const initials = names.map((name) => name[0]).join(" ");
  return `${initials} ${surname}`;
};

const Archive = () => (
  <TextPage
    title="Committee Archive"
    className="grid grid-cols-2 gap-x-2 sm:grid-cols-3 md:grid-cols-4"
  >
    {committees.map(({ season: [season], ...committee }) => {
      if (!Object.values(committee).some((x) => x?.length)) return null;

      return (
        <div key={season}>
          <a href={`#season-${season}`}>
            <h2 id={`season-${season}`}>{season}</h2>
          </a>
          <ul className="mb-8 list-none pl-0">
            {listify(committee, (position, occupants) => {
              if (!occupants?.length) return null;

              const isPlural = occupants.length > 1;
              const positionName =
                POSITION_NAMES.get(position)?.[isPlural ? 1 : 0];

              return (
                <li className="mb-2 mt-0 pl-0" key={position}>
                  <span className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                    {positionName}
                  </span>

                  {occupants.map((name) => (
                    <span className="block leading-snug" key={name}>
                      {initialiseName(name)}
                    </span>
                  ))}
                </li>
              );
            })}
          </ul>
        </div>
      );
    })}
  </TextPage>
);

export default Archive;
