import assert from "node:assert";
import { algoliasearch } from "algoliasearch";
import { liteClient } from "algoliasearch/lite";

assert(
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  "Missing Algolia index name environment variable",
);

export const getServerClient = () => {
  assert(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    "Missing Algolia App ID environment variable",
  );
  assert(
    process.env.ALGOLIA_API_KEY,
    "Missing Algolia API key environment variable",
  );

  return algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY,
  );
};

export const getBrowserClient = () => {
  assert(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    "Missing Algolia App ID environment variable",
  );
  assert(
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
    "Missing Algolia search key environment variable",
  );

  return liteClient(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
  );
};

export const SEARCH_INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
export const OFFICERS_INDEX_NAME = "officers";
