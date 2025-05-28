import { algoliasearch } from "algoliasearch";
import { liteClient } from "algoliasearch/lite";
import invariant from "tiny-invariant";

invariant(
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  "Missing Algolia index name environment variable",
);

export const getServerClient = () => {
  invariant(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    "Missing Algolia App ID environment variable",
  );
  invariant(
    process.env.ALGOLIA_API_KEY,
    "Missing Algolia API key environment variable",
  );

  return algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY,
  );
};

export const getBrowserClient = () => {
  invariant(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    "Missing Algolia App ID environment variable",
  );
  invariant(
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
