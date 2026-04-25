import { load } from "cheerio";
import type { Division, IndexData, Race, Wave } from "../types";
import { parseBoat } from "./parse-boat";

const NBSP = /\u00a0/g;
const WHITESPACE = /\s+/g;
const ABSOLUTE_OR_FRAGMENT_HREF = /^(https?:|mailto:|tel:|#)/i;
const LEADING_SLASHES = /^\/+/;
const WAVE_LABEL = /^Wave\s+(\d+)\s+(\w+)/i;
const DIVISION_LABEL = /^Division\s+(\d+)/i;

function cleanText(text: string | null | undefined): string {
  return (text ?? "").replace(NBSP, " ").replace(WHITESPACE, " ").trim();
}

function normaliseHref(href: string | undefined | null): string | null {
  if (!href) return null;
  if (ABSOLUTE_OR_FRAGMENT_HREF.test(href)) return href;

  return `/live/${href.replace(LEADING_SLASHES, "")}`;
}

function boatFromCell(cell: ReturnType<ReturnType<typeof load>>) {
  const anchor = cell.find("a").first();

  return parseBoat({
    clubHref: normaliseHref(anchor.attr("href")),
    scratched: cell.hasClass("Scratched"),
    text: cell.text(),
    winner: cell.find("strong").length > 0,
  });
}

/**
 * Parse `index.html` – the full timetable grouped by Wave → Division → Race.
 *
 * The source shape is a single flat table whose rows fall into three kinds:
 *   - wave-header rows   (2 cells: time + "Wave N Colour" with colspan=7)
 *   - division-header rows (2 cells: time + "Division N" link with colspan=7)
 *   - race rows (class=ListA, 9 columns)
 *
 * We walk the table once, maintaining the "current wave" and "current
 * division" as we go, and attach race rows to the most recent division.
 */
type RowCells = ReturnType<ReturnType<typeof load>>;

function isHeaderRow(cells: RowCells): boolean {
  return cells.length === 2 && cells.eq(1).attr("colspan") === "7";
}

function parseWaveRow(label: string, time: string): Wave | null {
  const match = label.match(WAVE_LABEL);
  if (!match) return null;

  return {
    colour: match[2].toLowerCase(),
    number: Number.parseInt(match[1], 10),
    time,
    divisions: [],
  };
}

function parseDivisionRow(
  label: string,
  time: string,
  link: RowCells,
): Division | null {
  const match = label.match(DIVISION_LABEL);
  if (!match) return null;

  return {
    name: cleanText(link.text()) || label,
    number: Number.parseInt(match[1], 10),
    time,
    href: normaliseHref(link.attr("href")),
    races: [],
  };
}

function parseRaceRow(cells: RowCells): Race | null {
  const eventCell = cells.eq(3);
  const raceNo = cleanText(cells.eq(1).text());
  if (!raceNo) return null;

  return {
    raceNo,
    duration: cleanText(cells.eq(8).text()) || null,
    essex: boatFromCell(cells.eq(5)),
    eventHref: normaliseHref(eventCell.find("a").attr("href")),
    eventName: cleanText(eventCell.text()),
    round: cleanText(cells.eq(2).text()),
    suffolk: boatFromCell(cells.eq(4)),
    time: cleanText(cells.eq(0).text()) || null,
    verdict: cleanText(cells.eq(7).text()) || null,
    winnerText: cleanText(cells.eq(6).text()) || null,
  };
}

type WalkState = {
  waves: Wave[];
  currentWave: Wave | null;
  currentDivision: Division | null;
};

function handleHeaderRow(state: WalkState, cells: RowCells): void {
  const time = cleanText(cells.eq(0).text());
  const labelCell = cells.eq(1);
  const label = cleanText(labelCell.text());

  const wave = parseWaveRow(label, time);
  if (wave) {
    state.waves.push(wave);
    state.currentWave = wave;
    state.currentDivision = null;

    return;
  }

  const division = parseDivisionRow(label, time, labelCell.find("a").first());
  if (!division) return;

  if (!state.currentWave) {
    state.currentWave = {
      colour: "gray",
      number: state.waves.length + 1,
      time,
      divisions: [],
    };
    state.waves.push(state.currentWave);
  }
  state.currentWave.divisions.push(division);
  state.currentDivision = division;
}

function handleRaceRow(state: WalkState, cells: RowCells): void {
  if (!state.currentDivision || cells.length < 9) return;
  const race = parseRaceRow(cells);
  if (race) state.currentDivision.races.push(race);
}

export function parseIndex(html: string): IndexData {
  const $ = load(html);

  const title = cleanText($("title").first().text()) || "Sudbury Regatta";
  const subtitle = cleanText($("center i").first().text());

  const state: WalkState = {
    currentDivision: null,
    currentWave: null,
    waves: [],
  };

  $("table tr").each((_, row) => {
    const $row = $(row);
    const cells = $row.find("td");

    if (isHeaderRow(cells)) {
      handleHeaderRow(state, cells);

      return;
    }
    if ($row.hasClass("ListA")) {
      handleRaceRow(state, cells);
    }
  });

  const { waves } = state;

  return { title, subtitle, waves };
}
