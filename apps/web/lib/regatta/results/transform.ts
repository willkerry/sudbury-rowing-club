/**
 * Generic HTML-to-HTML transform applied to any upstream regatta file that
 * isn't claimed by a structured parser. Strips executable markup, rewrites
 * retired British Rowing blade-image URLs, and keeps internal links scoped
 * to /live/*. This is the resilient fallback floor – if a structured
 * parser fails, its page falls back to content produced by this function.
 */

import { clubs } from "@sudburyrc/static";
import { load } from "cheerio";
import DOMPurify from "isomorphic-dompurify";

/**
 * Retired British Rowing blade-image URLs mapped to their current
 * replacements, plus an id-keyed fallback for when the software
 * constructs the URL slightly differently.
 */
const EXACT_BLADE_URL_MAP = new Map<string, string>();
const BLADE_URL_BY_ID = new Map<number, string>();
for (const club of clubs) {
  if (club.newBladeUrl) {
    if (club.bladeUrl) EXACT_BLADE_URL_MAP.set(club.bladeUrl, club.newBladeUrl);
    BLADE_URL_BY_ID.set(club.id, club.newBladeUrl);
  }
}

const CLUB_IMAGES_HOST = /clubimages\.britishrowing\.org/i;
const BLADE_ID_QUERY = /\bid=(\d+)\b/i;
const ABSOLUTE_OR_FRAGMENT_HREF = /^(https?:|mailto:|tel:|#)/i;
const LEADING_SLASHES = /^\/+/;

function rewriteBladeUrl(src: string): string | null {
  const exact = EXACT_BLADE_URL_MAP.get(src);
  if (exact) return exact;

  if (CLUB_IMAGES_HOST.test(src)) {
    const match = src.match(BLADE_ID_QUERY);
    if (match) {
      const id = Number.parseInt(match[1], 10);
      const mapped = BLADE_URL_BY_ID.get(id);
      if (mapped) return mapped;
    }
  }

  return null;
}

export type TransformedRegattaDocument = {
  title: string;
  body: string;
};

export function transformRegattaHtml(html: string): TransformedRegattaDocument {
  const $ = load(html);

  $(
    "script, link[rel='stylesheet'], link[rel='icon'], style, iframe, object, embed, form, meta[http-equiv]",
  ).remove();

  $("*").each((_, el) => {
    if (el.type !== "tag") return;
    for (const attr of Object.keys(el.attribs)) {
      if (attr.toLowerCase().startsWith("on")) $(el).removeAttr(attr);
    }
  });

  $("img").each((_, el) => {
    const src = $(el).attr("src") ?? "";
    const mapped = rewriteBladeUrl(src);
    if (mapped) {
      $(el).attr("src", mapped);
      $(el).attr("loading", "lazy");
      $(el).attr("decoding", "async");
    }
  });

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    if (!href) return;
    if (ABSOLUTE_OR_FRAGMENT_HREF.test(href)) return;
    const clean = href.replace(LEADING_SLASHES, "");
    $(el).attr("href", `/live/${clean}`);
  });

  const title = $("title").first().text().trim() || "Live results";
  const body = $("body").html() ?? "";

  const sanitised = DOMPurify.sanitize(body, {
    FORBID_ATTR: ["style"],
    FORBID_TAGS: ["script", "style", "iframe", "form", "object", "embed"],
  });

  return { title, body: sanitised };
}
