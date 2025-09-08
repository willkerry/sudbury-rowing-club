import { Cache } from "../shared/cache";
import { serversideFetchCompetitions } from "./fetch-competitions";

const cache = new Cache({
  key: "competitions",
  ttl: 60 * 15,
  function: serversideFetchCompetitions,
  primaryKey: "id",
});

export const cachedFetchCompetitions = () => cache.get();
export const cachedFetchCompetitionBySlug = (slug: string) =>
  cache.getByPrimaryKey(slug);
export const cachedFetchRegions = async () =>
  Array.from(new Set((await cache.get()).map(({ region }) => region)));
