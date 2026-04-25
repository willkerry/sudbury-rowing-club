import type { Shape } from "./types";

const DIVISION_FILE = /^division_\d+\.html$/i;
const CLUB_FILE = /^club_[A-Z0-9]+\.html$/i;

/**
 * Classify an upstream file by its name. The legacy scoring software has
 * emitted these exact patterns for years, so filename-based detection is
 * both reliable and cheap. Anything unrecognised (event brackets,
 * ancillary files like GeneralStyle.css or favicon.ico) returns "other"
 * and flows through the generic transform-and-display fallback.
 */
export function detectShape(relativePath: string): Shape {
  const file = relativePath.split("/").pop() ?? "";

  if (file === "index.html" || file === "") return "index";
  if (DIVISION_FILE.test(file)) return "division";
  if (CLUB_FILE.test(file)) return "club";

  return "other";
}
