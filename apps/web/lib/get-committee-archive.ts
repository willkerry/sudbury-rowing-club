import committees from "@/data/officer-archive.json";

type Position = keyof (typeof committees)[0];

export const POSITION_NAMES = new Map<Position, [string, string]>([
  ["president", ["President", "Presidents"]],
  ["captain", ["Captain", "Captains"]],
  ["chair", ["Chair", "Chairs"]],
  ["secretary", ["Secretary", "Secretaries"]],
  ["treasurer", ["Treasurer", "Treasurers"]],
  ["viceCaptains", ["Vice-captain", "Vice-captains"]],
  ["ladiesCaptain", ["Ladies Captain", "Ladies Captains"]],
  ["ladiesSecretary", ["Ladies Secretary", "Ladies Secretaries"]],
  ["ladiesViceCaptain", ["Ladies VC", "Ladies VCs"]],
  ["season", ["Season", "Seasons"]],
]);

const getSingularOrPluralPositionName = (position: Position, count: number) =>
  POSITION_NAMES.get(position)?.[count > 1 ? 1 : 0] || position;

type CommitteeOffice = {
  holders: string[];
  displayName: string;
};

const getCommitteeOffice = (
  position: Position,
  holders: string[] | null,
): CommitteeOffice | undefined => {
  if (!holders) return undefined;
  if (!holders.length) return undefined;

  return {
    holders,
    displayName: getSingularOrPluralPositionName(position, holders.length),
  };
};

export const getCommitteeArchive = (): {
  season: string;
  committee: Record<Position, CommitteeOffice | undefined>;
}[] =>
  committees
    .map(({ season: [season], ...committee }) => {
      if (!Object.values(committee).some((x) => x?.length)) return null;

      return {
        season,
        committee: Object.fromEntries(
          Object.entries(committee)
            .map(([position, holders]) => {
              if (!holders?.length) return [undefined, undefined];

              return [
                position,
                getCommitteeOffice(position as Position, holders),
              ];
            })
            .filter(([position]) => position !== undefined),
        ),
      };
    })
    .filter((committee) => committee !== null);
