import { load } from "cheerio";
import type { ClubData, ClubEntry } from "../types";

const NBSP = /\u00a0/g;
const WHITESPACE = /\s+/g;
const ABSOLUTE_OR_FRAGMENT_HREF = /^(https?:|mailto:|tel:|#)/i;
const LEADING_SLASHES = /^\/+/;
const CLUB_PREFIX = /^.*club_/i;
const HTML_SUFFIX = /\.html$/i;

function cleanText(text: string | null | undefined): string {
  return (text ?? "").replace(NBSP, " ").replace(WHITESPACE, " ").trim();
}

function normaliseHref(href: string | undefined | null): string | null {
  if (!href) return null;
  if (ABSOLUTE_OR_FRAGMENT_HREF.test(href)) return href;
  const clean = href.replace(LEADING_SLASHES, "");

  return `/live/${clean}`;
}

/**
 * Parse a `club_<CODE>.html` page. The source shape is:
 *
 *   <CENTER><FONT SIZE=+2><A HREF=clubs.html>
 *     <img src="..." title="CODE"/>Full Club Name
 *   </A></FONT></CENTER>
 *   <TABLE>
 *     <TR>Event | Number | Short Description | First Race Time</TR>
 *     <TR>...</TR>
 *   </TABLE>
 */
export function parseClub(html: string, filename: string): ClubData {
  const $ = load(html);

  // Code: prefer the <img title="..."> in the hero; fall back to filename.
  const heroImg = $("center img").first();
  const titleAttr = heroImg.attr("title");
  const codeFromFilename = filename
    .replace(CLUB_PREFIX, "")
    .replace(HTML_SUFFIX, "");
  const code = (titleAttr ?? codeFromFilename).toUpperCase();

  // Name: the centered anchor containing the hero image. Strip the image
  // text (there is none) and trim whatever's left.
  const heroAnchor = heroImg.closest("a");
  const name = cleanText(heroAnchor.text());

  const bladeUrl = heroImg.attr("src") ?? null;

  const entries: ClubEntry[] = [];
  $("table tr").each((index, row) => {
    if (index === 0) return; // header row
    const cells = $(row).find("td");
    if (cells.length < 4) return;

    const eventCell = cells.eq(0);
    const eventLink = eventCell.find("a").first();

    entries.push({
      crewName: cleanText(cells.eq(2).text()),
      eventHref: normaliseHref(eventLink.attr("href")),
      eventName: cleanText(eventCell.text()),
      firstRaceTime: cleanText(cells.eq(3).text()) || null,
      number: cleanText(cells.eq(1).text()),
    });
  });

  return { code, name, bladeUrl, entries };
}
