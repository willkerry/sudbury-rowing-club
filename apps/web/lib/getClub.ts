import type { Club as ClubRecord } from "@sudburyrc/static/clubs";
import { unique } from "radashi";
import { loadClubs } from "./clubs-data";
import { getHostname } from "./helpers/getHostname";

const SUFFIX_ALIASES = {
  " Boat Club": [" Boat Club", " BC"],
  " Rowing Club": [" Rowing Club", " RC"],
} as const;

const RC_REGEX = / RC$/;
const ROWING_CLUB_REGEX = / Rowing Club$/;
const BC_REGEX = / BC$/;
const BOAT_CLUB_REGEX = / Boat Club$/;

export type Club = {
  id: number;
  name: string;
  href: string;
  bladeUrl?: string;
};

const toClub = (club: ClubRecord, name = club.name): Club => ({
  bladeUrl: club.newBladeUrl ?? undefined,
  href: club.href,
  id: club.id,
  name,
});

const getPossibleNames = (name: string) =>
  unique(
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

const normaliseClubName = (
  name: string,
  format: "short" | "long" | undefined,
): string => {
  if (format === "long") {
    return name
      .replace(RC_REGEX, " Rowing Club")
      .replace(BC_REGEX, " Boat Club");
  }
  if (format === "short") {
    return name
      .replace(ROWING_CLUB_REGEX, " RC")
      .replace(BOAT_CLUB_REGEX, " BC");
  }
  return name;
};

/** Synchronous club lookups over an already-loaded club list. */
export const createClubLookup = (clubs: readonly ClubRecord[]) => {
  const findByCode = (code: string) =>
    clubs.find((club) => club.code === code) ??
    clubs.find((club) => club.aliasCodes?.includes(code));

  return {
    getClub: (name: string): Club | undefined => {
      if (!name) return;

      const possibleNames = getPossibleNames(name);
      const foundClub = clubs.find((club) =>
        possibleNames.includes(club?.name.toLowerCase()),
      );

      return foundClub && toClub(foundClub);
    },

    getClubByBoatCode: (
      code: string,
      options?: { normaliseClubName?: "short" | "long" },
    ): Club | undefined => {
      const foundClub = findByCode(code.toUpperCase());

      return (
        foundClub &&
        toClub(
          foundClub,
          normaliseClubName(foundClub.name, options?.normaliseClubName),
        )
      );
    },

    getClubByCode: (code: string): Club | undefined => {
      const foundClub = findByCode(code);

      return foundClub && toClub(foundClub);
    },

    getClubById: (id: number): Club | undefined => {
      const foundClub = clubs.find((club) => club.id === id);

      return foundClub && toClub(foundClub);
    },

    getClubByUrl: (url: string) => {
      const hostname = getHostname(url);

      return clubs.find((club) => club.website?.includes(hostname));
    },
  };
};

export type ClubLookup = ReturnType<typeof createClubLookup>;

export const getClubLookup = async (): Promise<ClubLookup> =>
  createClubLookup(await loadClubs());
