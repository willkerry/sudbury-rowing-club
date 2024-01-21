import { Fragment } from "react";
import TextPage from "@/components/layouts/text-page";
import committees from "@/data/officer-archive.json";

type Position = keyof (typeof committees)[0];

const POSITION_NAMES: {
  [key in Position]: {
    singular: string;
    plural: string;
  };
} = {
  president: { singular: "President", plural: "Presidents" },
  captain: { singular: "Captain", plural: "Captains" },
  chair: { singular: "Chair", plural: "Chairs" },
  secretary: { singular: "Secretary", plural: "Secretaries" },
  treasurer: { singular: "Treasurer", plural: "Treasurers" },
  viceCaptains: { singular: "Vice Captain", plural: "Vice Captains" },
  ladiesCaptain: { singular: "Ladies Captain", plural: "Ladies Captains" },
  ladiesSecretary: {
    singular: "Ladies Secretary",
    plural: "Ladies Secretaries",
  },
  ladiesViceCaptain: {
    singular: "Ladies Vice Captain",
    plural: "Ladies Vice Captains",
  },
  season: { singular: "Season", plural: "Seasons" },
};

const initialiseName = (name: string) => {
  const names = name.split(" ");
  const surname = names.pop()?.replace("+", " ");

  const initials = names.map((name) => name[0]).join(" ");
  return `${initials} ${surname}`;
};

const Archive = () => (
  <TextPage title="Committee Archive">
    {committees.map(({ season, ...committee }) => {
      if (!Object.values(committee).some((x) => x.length)) return null;

      return (
        <Fragment key={season[0]}>
          <a href={`#season-${season[0]}`}>
            <h2 id={`season-${season[0]}`}>{season[0]}</h2>
          </a>
          <ul className="mb-8 list-none pl-0">
            {Object.entries(committee).map(([position, occupants]) => {
              if (position === "season") return null;
              if (!occupants.length) return null;

              const isPlural = occupants.length > 1;
              const positionName = isPlural
                ? POSITION_NAMES[position as Position].plural
                : POSITION_NAMES[position as Position].singular;

              return (
                <li className="my-0 pl-0" key={position}>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {positionName}
                  </span>

                  {occupants.map((name) => (
                    <span className="block" key={name}>
                      {initialiseName(name)}
                    </span>
                  ))}
                </li>
              );
            })}
          </ul>
        </Fragment>
      );
    })}
  </TextPage>
);

export default Archive;
