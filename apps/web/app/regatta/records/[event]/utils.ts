import { getClubByCode } from "@/lib/getClub";

export const isCompositeCrew = (club: string) => club.includes("/");

export const getClubsFromCompositeCrewString = (clubCode: string) => {
  const clubs = clubCode.split("/");

  return clubs.map((code) => getClubByCode(code) ?? { code });
};

export const unpickCompositeCrewClubs = (clubCode: string) => {
  const clubs = getClubsFromCompositeCrewString(clubCode);

  return clubs.map((club) => ("name" in club ? club.name : club.code));
};

export const listFormatter = new Intl.ListFormat("en-GB", {
  style: "long",
  type: "conjunction",
});

export const formatClubAndCrewName = (club: string, verbose = false) => {
  if (isCompositeCrew(club)) {
    return verbose
      ? `a composite crew from ${listFormatter.format(
          unpickCompositeCrewClubs(club),
        )}`
      : listFormatter.format(unpickCompositeCrewClubs(club));
  }

  return getClubByCode(club)?.name ?? club;
};

export const getBladeUrls = (clubCode: string) => {
  const clubs = getClubsFromCompositeCrewString(clubCode);

  return clubs
    .map((club) => ("bladeUrl" in club ? (club.bladeUrl ?? "") : ""))
    .filter(Boolean);
};

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
