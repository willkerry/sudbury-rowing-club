import { Cache } from "../shared/cache";
import { serversideFetchCompetitions } from "./fetch-competitions";

const cache = new Cache({
  function: serversideFetchCompetitions,
  key: "competitions",
  primaryKey: "id",
  ttl: 60 * 15,
});

export const cachedFetchCompetitions = () => cache.get();
export const cachedFetchCompetitionBySlug = (slug: string) =>
  cache.getByPrimaryKey(slug);
export const cachedFetchRegions = async () =>
  Array.from(new Set((await cache.get()).map(({ region }) => region)));
