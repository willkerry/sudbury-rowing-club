import { sift } from "radashi";
import type { Club, ClubLookup } from "@/lib/getClub";

export type ParsedClub = Club | { code: string };

export const isCompositeCrew = (club: string) => club.includes("/");

export const splitCompositeCrew = (clubCode: string) => clubCode.split("/");

export const getClubsFromCompositeCrewString = (
  clubCode: string,
  clubs: ClubLookup,
): ParsedClub[] =>
  splitCompositeCrew(clubCode).map(
    (code) => clubs.getClubByBoatCode(code) ?? { code },
  );

export const unpickCompositeCrewClubs = (parsedClub: ParsedClub[]) =>
  parsedClub.map((club) => ("name" in club ? club.name : club.code));

export const listFormatter = new Intl.ListFormat("en-GB", {
  style: "long",
  type: "conjunction",
});

export const formatClubAndCrewName = (
  parsedClub: ParsedClub[],
  verbose = false,
) => {
  const names = unpickCompositeCrewClubs(parsedClub);

  if (parsedClub.length > 1) {
    return verbose
      ? `a composite crew from ${listFormatter.format(names)}`
      : listFormatter.format(names);
  }

  return names[0] ?? "";
};

export function getBladeUrls(
  parsedClub: ParsedClub[],
  nullIfNotFound?: false,
): string[];
export function getBladeUrls(
  parsedClub: ParsedClub[],
  nullIfNotFound?: true,
): (string | null)[];
export function getBladeUrls(parsedClub: ParsedClub[], nullIfNotFound = false) {
  const bladeUrls = parsedClub.map((club) =>
    "bladeUrl" in club ? (club.bladeUrl ?? null) : null,
  );

  if (nullIfNotFound) return bladeUrls;

  return sift(bladeUrls);
}

export const extendEventName = (event: string): string =>
  // Mx === Mixed
  event
    .replace("Mx", "Mixed")
    // Eli === Elite
    .replace("Eli", "Elite")
    // Nov === Novice
    .replace("Nov", "Novice")
    // Mas === Masters
    .replace("Mas", "Masters")
    // W === Womens
    .replace("W", "Womens");
