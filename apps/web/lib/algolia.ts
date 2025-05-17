import algoliasearch, {
  type SearchClient,
  type SearchIndex,
} from "algoliasearch";
import litealgoliasearch, {
  type SearchClient as BrowserSearchClient,
  type SearchIndex as BrowserSearchIndex,
} from "algoliasearch/lite";

if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID)
  throw new Error("Missing Algolia App ID environment variable");
if (!process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY)
  throw new Error("Missing Algolia search key environment variable");
if (!process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME)
  throw new Error("Missing Algolia index name environment variable");

export const serverClient: SearchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY as string,
);
export const browserClient: BrowserSearchClient = litealgoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
);

export const serverIndex: SearchIndex = serverClient.initIndex(
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
);
export const browserIndex: BrowserSearchIndex = browserClient.initIndex(
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
);

export const serverIndexOfficers: SearchIndex =
  serverClient.initIndex("officers");
export const browserIndexOfficers: BrowserSearchIndex =
  browserClient.initIndex("officers");
