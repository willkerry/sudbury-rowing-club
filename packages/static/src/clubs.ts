import clubsData from "./data/clubs.json";

export type Club = {
  /** British Rowing's integer club ID. */
  id: number;
  /** The club's name. */
  name: string;
  /** The club's address. */
  address: string;
  /**
   * The URL of the club's blade image.
   * @deprecated Service no longer online. Use `newBladeUrl` instead.
   */
  bladeUrl: string | null;
  /** The club's boat code.
   * @example "SRC"
   */
  code: string;
  /** The club's alias codes (some high-falutin clubs have multiple codes)
   * @example ["SRC", "SAR"]
   */
  aliasCodes?: string[];
  /** The club's geographical coordinates. */
  geo: {
    lat: number;
    lng: number;
  } | null;
  /** The URL of the club's British Rowing page. */
  href: string;
  /** The URL of the club's new blade image. */
  newBladeUrl: string | null;
  /** The club's region. */
  region: string | null;
  /** The club's website URL. Beware of broken links. */
  website: string | null;
  /** The club's location (town/city and county). */
  location?: string | null;
  /** The club's nation (England, Scotland, Wales, etc.). */
  nation?: string | null;
};

export type ClubsSchema = Club[];

export const clubs: readonly Club[] = clubsData;
