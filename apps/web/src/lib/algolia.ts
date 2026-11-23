import { algoliasearch } from "algoliasearch";
import { liteClient } from "algoliasearch/lite";
import { env } from "@/env";

export const getServerClient = () =>
  algoliasearch(env.NEXT_PUBLIC_ALGOLIA_APP_ID, env.ALGOLIA_API_KEY);

export const getBrowserClient = () =>
  liteClient(
    env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
  );

export const SEARCH_INDEX_NAME = env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
export const OFFICERS_INDEX_NAME = "officers";
