import { TrophyIcon } from "lucide-react";
import Link from "next/link";
import { ClubTag } from "@/components/regatta/results/club-tag";
import type { Boat, Race, RaceRound } from "@/lib/regatta/results";
import { cn } from "@/lib/utils";

const ROUND_STYLES: Record<RaceRound, string> = {
  F: "bg-amber-200 text-amber-900",
  Q: "bg-gray-100 text-gray-700",
  S: "bg-sky-100 text-sky-900",
};

const ROUND_TITLES: Record<RaceRound, string> = {
  F: "Final",
  Q: "Heat",
  S: "Semi",
};

const RoundChip = ({ round }: { round: RaceRound }) => (
  <span
    className={cn(
      "inline-grid h-5 w-5 place-items-center rounded font-semibold text-[11px]",
      ROUND_STYLES[round] ?? "bg-gray-100 text-gray-700",
    )}
    title={ROUND_TITLES[round] ?? round}
  >
    {round || "–"}
  </span>
);

const BoatCell = ({ boat }: { boat: Boat | null }) => {
  if (!boat) return <span className="text-gray-400">—</span>;

  const codes = [boat.club, ...(boat.aliasedClubs ?? [])].filter(Boolean);

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        boat.scratched && "text-gray-500 line-through opacity-70",
      )}
    >
      <span className="flex shrink-0 items-center gap-1">
        {codes.map((code, index) => (
          <ClubTag
            code={code}
            href={index === 0 ? boat.clubHref : null}
            key={code}
            linked={index > 0}
            size="inline"
          />
        ))}
      </span>

      <span className="min-w-0 truncate">
        {boat.num !== null && (
          <span className="mr-1.5 font-mono text-gray-600 text-xs">
            {boat.num}
          </span>
        )}
        <span
          className={cn(
            boat.winner ? "font-semibold text-gray-900" : "text-gray-700",
          )}
        >
          {boat.crewName}
        </span>
        {boat.category && (
          <span className="ml-1.5 inline-block rounded-sm bg-gray-100 px-1 text-[10px] text-gray-700">
            {boat.category}
          </span>
        )}
      </span>
    </div>
  );
};

/**
 * Column layout shared by the race-row and its header. The header in the
 * parent table must match these columns in the same order.
 */
export const RaceRow = ({
  race,
  primary,
}: {
  race: Race;
  primary: "time" | "race-no";
}) => {
  const primaryValue = primary === "time" ? (race.time ?? "") : race.raceNo;
  const secondaryValue = primary === "time" ? race.raceNo : (race.time ?? "");
  const scratched =
    race.suffolk?.scratched === true || race.essex?.scratched === true;
  const trophyTooltip = race.trophy
    ? `${race.trophy}${race.sponsor ? ` / ${race.sponsor}` : ""}`
    : null;

  return (
    <tr
      className={cn(
        "border-gray-100 border-b align-middle hover:bg-gray-50",
        scratched && "opacity-70",
      )}
    >
      <td className="whitespace-nowrap py-2 pr-3 font-mono text-gray-800 text-sm">
        {primaryValue}
      </td>
      <td className="whitespace-nowrap py-2 pr-3 font-mono text-gray-500 text-xs">
        {secondaryValue}
      </td>
      <td className="py-2 pr-3">
        <RoundChip round={race.round} />
      </td>
      <td className="py-2 pr-3">
        <span className="inline-flex items-center gap-1.5">
          {race.eventHref ? (
            <Link
              className="text-blue-600 hover:underline"
              href={race.eventHref}
            >
              {race.eventName}
            </Link>
          ) : (
            <span className="text-gray-800">{race.eventName}</span>
          )}
          {race.trophy && trophyTooltip && (
            <TrophyIcon
              aria-label={trophyTooltip}
              className="h-3.5 w-3.5 shrink-0 text-amber-600"
            />
          )}
        </span>
      </td>
      <td className="min-w-0 py-2 pr-3">
        <BoatCell boat={race.suffolk} />
      </td>
      <td className="min-w-0 py-2 pr-3">
        <BoatCell boat={race.essex} />
      </td>
      <td className="whitespace-nowrap py-2 pr-3 text-gray-700 text-sm">
        {race.verdict}
      </td>
      <td className="whitespace-nowrap py-2 font-mono text-gray-600 text-xs">
        {race.duration}
      </td>
    </tr>
  );
};

export const RaceTableHead = ({
  primaryLabel,
  secondaryLabel,
}: {
  primaryLabel: string;
  secondaryLabel: string;
}) => (
  <thead>
    <tr className="border-gray-300 border-b text-gray-600 text-xs uppercase tracking-wider">
      <th className="py-2 pr-3 text-left font-semibold">{primaryLabel}</th>
      <th className="py-2 pr-3 text-left font-semibold">{secondaryLabel}</th>
      <th className="py-2 pr-3 text-left font-semibold">Rd</th>
      <th className="py-2 pr-3 text-left font-semibold">Event</th>
      <th className="py-2 pr-3 text-left font-semibold">Suffolk</th>
      <th className="py-2 pr-3 text-left font-semibold">Essex</th>
      <th className="py-2 pr-3 text-left font-semibold">Verdict</th>
      <th className="py-2 text-left font-semibold">Time</th>
    </tr>
  </thead>
);
