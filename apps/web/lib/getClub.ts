import { clubs } from "@sudburyrc/static";
import { unique } from "radashi";
import { getHostname } from "./helpers/getHostname";

const SUFFIX_ALIASES = {
  " Rowing Club": [" Rowing Club", " RC"],
  " Boat Club": [" Boat Club", " BC"],
} as const;

const RC_REGEX = / RC$/;
const ROWING_CLUB_REGEX = / Rowing Club$/;
const BC_REGEX = / BC$/;
const BOAT_CLUB_REGEX = / Boat Club$/;

type Club = {
  id: number;
  name: string;
  href: string;
  bladeUrl?: string;
};

export const getClub = (name: string): Club | undefined => {
  if (!name) return;

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

  const foundClub = clubs.find((club) =>
    possibleNames.includes(club?.name.toLowerCase()),
  );

  if (!foundClub) return;

  return {
    id: foundClub.id,
    name: foundClub.name,
    href: foundClub.href,
    bladeUrl: foundClub.newBladeUrl ?? undefined,
  };
};

export const getClubByUrl = (url: string) => {
  const hostname = getHostname(url);

  const foundClub = clubs.find((club) => club.website?.includes(hostname));
  return foundClub;
};

export const getClubByCode = (code: string) => {
  const foundClub =
    clubs.find((club) => club.code === code) ??
    clubs.find((club) => club.aliasCodes?.includes(code));

  if (!foundClub) return;

  return {
    id: foundClub.id,
    name: foundClub.name,
    href: foundClub.href,
    bladeUrl: foundClub.newBladeUrl ?? undefined,
  };
};

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

export const getClubByBoatCode = (
  code: string,
  options?: { normaliseClubName?: "short" | "long" },
) => {
  const uppercaseCode = code.toUpperCase();

  const foundClub =
    clubs.find((club) => club.code === uppercaseCode) ??
    clubs.find((club) => club.aliasCodes?.includes(uppercaseCode));

  if (!foundClub) return;

  return {
    id: foundClub.id,
    name: normaliseClubName(foundClub.name, options?.normaliseClubName),
    href: foundClub.href,
    bladeUrl: foundClub.newBladeUrl ?? undefined,
  };
};
