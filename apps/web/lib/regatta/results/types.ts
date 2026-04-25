/**
 * Structured types produced by the regatta-results parsers and consumed by
 * the bespoke page components. The shapes mirror the upstream HTML's
 * semantics, not its markup.
 */

export type Shape = "index" | "division" | "club" | "other";

export type Boat = {
  /** Bib / entry number. */
  num: number | null;
  /** Primary club code, e.g. "SRC". */
  club: string;
  /**
   * Secondary club codes for composite crews. The upstream text format is
   * `SRC/KRC-MOULE` – all codes after the first end up here.
   */
  aliasedClubs?: string[];
  /** Crew / rower surname, e.g. "MOULE" or "STREAT-2". */
  crewName: string;
  /** Category suffix if present, e.g. "F" from "(F)". */
  category: string | null;
  /** True if wrapped in <STRONG> in the source (= winner of a finished race). */
  winner: boolean;
  /** True if the cell had class="Scratched". */
  scratched: boolean;
  /** Link to the boat's club page in /live/*, or null. */
  clubHref: string | null;
};

export type RaceRound = "Q" | "S" | "F" | string;

export type Race = {
  raceNo: string;
  time: string | null;
  round: RaceRound;
  eventName: string;
  eventHref: string | null;
  suffolk: Boat | null;
  essex: Boat | null;
  /** Human text of the winner cell; redundant with boat.winner but preserved. */
  winnerText: string | null;
  verdict: string | null;
  duration: string | null;
  trophy?: string;
  sponsor?: string;
};

export type Wave = {
  number: number;
  colour: "red" | "green" | "blue" | string;
  time: string;
  divisions: Division[];
};

export type Division = {
  number: number;
  name: string;
  time: string;
  href: string | null;
  races: Race[];
};

export type IndexData = {
  title: string;
  subtitle: string;
  waves: Wave[];
};

export type DivisionNavItem = {
  label: string;
  href: string | null;
  title: string | null;
  current: boolean;
};

export type DivisionData = {
  title: string;
  name: string;
  nav: DivisionNavItem[];
  races: Race[];
};

export type ClubEntry = {
  eventName: string;
  eventHref: string | null;
  number: string;
  crewName: string;
  firstRaceTime: string | null;
};

export type ClubData = {
  code: string;
  /** Name as parsed from the page (may differ from our registry). */
  name: string;
  /** Blade src as parsed from the page (may be a retired URL). */
  bladeUrl: string | null;
  entries: ClubEntry[];
};
