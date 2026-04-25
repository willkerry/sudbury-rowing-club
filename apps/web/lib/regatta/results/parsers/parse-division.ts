import { load } from "cheerio";
import type { DivisionData, DivisionNavItem, Race } from "../types";
import { parseBoat } from "./parse-boat";

const NBSP = /\u00a0/g;
const WHITESPACE = /\s+/g;
const ABSOLUTE_OR_FRAGMENT_HREF = /^(https?:|mailto:|tel:|#)/i;
const LEADING_SLASHES = /^\/+/;
const NEWLINE_SEPARATOR = "\n";

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

function parseTrophy(cell: ReturnType<ReturnType<typeof load>>): {
  trophy?: string;
  sponsor?: string;
} {
  // Replace <br> elements with a newline, then take .text() – cheerio decodes
  // entities (so &nbsp; becomes U+00A0, which cleanText collapses and trims),
  // which a raw html-string split doesn't do.
  const working = cell.clone();
  working.find("br").replaceWith(NEWLINE_SEPARATOR);
  const parts = working
    .text()
    .split(NEWLINE_SEPARATOR)
    .map(cleanText)
    .filter(Boolean);
  const [trophy, sponsor] = parts;

  return {
    sponsor: sponsor || undefined,
    trophy: trophy || undefined,
  };
}

/**
 * Parse a `division_<N>.html` page. The source shape is:
 *
 *   <CENTER><FONT>Single Division</FONT></CENTER>
 *   <TABLE>
 *     <TR>Time | Race | Round | Event | Suffolk | Essex | Winner | Verdict | Time | Trophy/Sponsor</TR>
 *     <TR class=ListA>  <!-- nav row: single cell colspan=10, 5 anchors + current <strong> -->
 *       <TD colspan=10><A><<</A> <A><</A> <A><strong>Division 8</strong></A> <A>></A> <A>>></A></TD>
 *     </TR>
 *     <TR class=ListA> ... race rows, 10 cells each ... </TR>
 *   </TABLE>
 */
export function parseDivision(html: string): DivisionData {
  const $ = load(html);

  const title = cleanText($("body > center").eq(1).text()) || "Division";

  const rows = $("tr.ListA");
  const navRow = rows.first();

  const nav: DivisionNavItem[] = [];
  let divisionName = "";

  navRow.find("a").each((_, el) => {
    const $a = $(el);
    const strongText = cleanText($a.find("strong").text());
    const isCurrent = strongText.length > 0;
    const label = isCurrent ? strongText : cleanText($a.text());
    nav.push({
      label,
      current: isCurrent,
      href: normaliseHref($a.attr("href")),
      title: $a.attr("title") ?? null,
    });
    if (isCurrent) divisionName = strongText;
  });

  const races: Race[] = [];
  rows.each((index, row) => {
    if (index === 0) return; // skip nav row
    const cells = $(row).find("td");
    if (cells.length < 9) return;

    const hasTrophy = cells.length >= 10;
    const trophyParsed = hasTrophy ? parseTrophy(cells.eq(9)) : {};

    const eventCell = cells.eq(3);

    races.push({
      duration: cleanText(cells.eq(8).text()) || null,
      essex: boatFromCell(cells.eq(5)),
      eventHref: normaliseHref(eventCell.find("a").attr("href")),
      eventName: cleanText(eventCell.text()),
      raceNo: cleanText(cells.eq(1).text()),
      round: cleanText(cells.eq(2).text()),
      sponsor: trophyParsed.sponsor,
      suffolk: boatFromCell(cells.eq(4)),
      time: cleanText(cells.eq(0).text()) || null,
      trophy: trophyParsed.trophy,
      verdict: cleanText(cells.eq(7).text()) || null,
      winnerText: cleanText(cells.eq(6).text()) || null,
    });
  });

  return {
    title,
    name: divisionName || title,
    nav,
    races,
  };
}
