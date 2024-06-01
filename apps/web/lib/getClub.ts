import clubs from "@/data/clubs.json";
import { unique } from "radash";

const SUFFIX_ALIASES = {
  "Rowing Club": ["Rowing Club", "RC"],
  "Boat Club": ["Boat Club", "BC"],
} as const;

type Club = {
  name: string;
  href: string;
  bladeUrl?: string;
};

export const getClub = (name: string): Club | undefined => {
  if (!name) return undefined;

  const possibleNames = unique(
    Object.entries(SUFFIX_ALIASES).reduce(
      (acc, [suffix, aliases]) => {
        const containsAliasable = aliases.some((alias) => name.includes(alias));

        if (!containsAliasable) return acc;

        acc.push(
          ...aliases.map((alias) => {
            const withSuffix = name.replace(alias, suffix);
            const withAlias = name.replace(suffix, alias);

            if (withSuffix !== name) return withSuffix;
            if (withAlias !== name) return withAlias;
            return name;
          }),
        );

        return acc;
      },
      [name],
    ),
  );

  return clubs.find((club) => possibleNames.includes(club?.name));
};
