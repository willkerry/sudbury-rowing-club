import clubs from "@/data/clubs.json";
import { unique } from "radash";

const SUFFIX_ALIASES = {
  " Rowing Club": [" Rowing Club", " RC"],
  " Boat Club": [" Boat Club", " BC"],
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

        if (!containsAliasable) return acc.map((v) => v.toLowerCase());

        return acc.concat(
          aliases.map((alias) => {
            const withSuffix = name.replace(alias, suffix);
            const withAlias = name.replace(suffix, alias);

            if (withSuffix !== name) return withSuffix.toLowerCase();
            if (withAlias !== name) return withAlias.toLowerCase();
            return name.toLowerCase();
          }),
        );
      },
      [name],
    ),
  );

  return clubs.find((club) => possibleNames.includes(club?.name.toLowerCase()));
};

export const getClubByCode = (code: string): Club | undefined =>
  clubs.find((club) => club?.code === code);
