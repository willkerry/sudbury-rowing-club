import type { Boat } from "../types";

const CATEGORY_SUFFIX = /\(([A-Z]{1,3})\)\s*$/;
const NUM_COMMA_REST = /^(\d+)\s*,\s*(.+)$/;
const WHITESPACE = /\s+/g;
const NBSP = /\u00a0/g;

type ParseBoatInput = {
  /**
   * Raw text from the table cell, e.g. " 29, HUN-MANCHETT",
   * "152, SRC/KRC-MOULE", " 40, DEB-STREAT-2 (F)".
   */
  text: string;
  /** Whether the source cell carried class="Scratched". */
  scratched?: boolean;
  /** Whether the source cell's boat name was wrapped in <STRONG>. */
  winner?: boolean;
  /** href of the club-page link inside the cell. */
  clubHref?: string | null;
};

/**
 * Parse a crew-cell text into a structured Boat. Returns null for input that
 * doesn't look like a crew entry (empty, a header, a stray comment).
 */
export function parseBoat({
  text,
  scratched = false,
  winner = false,
  clubHref = null,
}: ParseBoatInput): Boat | null {
  const clean = text.replace(NBSP, " ").replace(WHITESPACE, " ").trim();
  if (!clean) return null;

  let category: string | null = null;
  let core = clean;
  const catMatch = clean.match(CATEGORY_SUFFIX);
  if (catMatch) {
    category = catMatch[1];
    core = clean.slice(0, catMatch.index).trim();
  }

  const match = core.match(NUM_COMMA_REST);
  if (!match) {
    // Not a "num, CLUB-NAME" shape – surface the whole string as the name.
    return {
      club: "",
      crewName: core,
      num: null,
      category,
      winner,
      scratched,
      clubHref,
    };
  }

  const num = Number.parseInt(match[1], 10);
  const rest = match[2];
  const dash = rest.indexOf("-");
  const clubPart = dash === -1 ? rest : rest.slice(0, dash);
  const crewName = dash === -1 ? "" : rest.slice(dash + 1).trim();

  // Composite crews: "SRC/KRC" → primary "SRC", aliased ["KRC"].
  const [primary, ...aliased] = clubPart
    .split("/")
    .map((c) => c.trim())
    .filter(Boolean);

  return {
    aliasedClubs: aliased.length > 0 ? aliased : undefined,
    club: primary ?? "",
    num: Number.isNaN(num) ? null : num,
    crewName,
    category,
    winner,
    scratched,
    clubHref,
  };
}
