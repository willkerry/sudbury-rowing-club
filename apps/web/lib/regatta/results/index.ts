export { detectShape } from "./detect-shape";
export {
  decodeHtml,
  fetchRegattaFile,
  REGATTA_REVALIDATE_TAG,
  type RegattaUpstream,
} from "./fetch";
export { parseBoat } from "./parsers/parse-boat";
export { parseClub } from "./parsers/parse-club";
export { parseDivision } from "./parsers/parse-division";
export { parseIndex } from "./parsers/parse-index";
export {
  type TransformedRegattaDocument,
  transformRegattaHtml,
} from "./transform";
export type {
  Boat,
  ClubData,
  ClubEntry,
  Division,
  DivisionData,
  DivisionNavItem,
  IndexData,
  Race,
  RaceRound,
  Shape,
  Wave,
} from "./types";
