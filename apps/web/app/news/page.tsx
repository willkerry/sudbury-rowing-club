import { SEARCH_INDEX_NAME, getServerClient } from "@/lib/algolia";
import { createMetadata } from "@/lib/create-metadata";
import {
  fetchArticleCount,
  fetchNArticles,
  serverGetNArticles,
} from "@sudburyrc/api";
import { CSRNewsPage } from "./csr-page";

export const metadata = createMetadata({
  title: "News | Sudbury Rowing Club",
  description: "Latest news from Sudbury Rowing Club.",
  image: { title: "News" },
});

const fetchArticlesAndUpdateSearchIndex = async () => {
  try {
    const articles = await serverGetNArticles(0, 30);

    const sanityTotal = await fetchArticleCount();

    // Then fetch the number of posts on Algolia
    const algoliaTotal = await getServerClient()
      .searchSingleIndex({
        indexName: SEARCH_INDEX_NAME,
        searchParams: {
          query: "",
          hitsPerPage: 0,
        },
      })
      .then((r) => r.nbHits);

    // If the number of posts on Sanity does not equal the number of posts on
    // Algolia, reindex. (Obviously, this is not fault-proof, but it should ensure
    // that reindexing happens fairly regularly.)
    if (sanityTotal !== algoliaTotal) {
      const articles = await fetchNArticles(0, sanityTotal);
      // It's **essential** to assign the post _id to the Algolia objectID here,
      // otherwise Algolia will create thousands of duplicate records.
      const objects = articles.map((p) => ({ ...p, objectID: p._id }));

      await getServerClient().saveObjects({
        indexName: SEARCH_INDEX_NAME,
        objects,
      });
    }

    return articles;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const NewsPage = async () => {
  const articles = await fetchArticlesAndUpdateSearchIndex();

  return (
    <div>
      <CSRNewsPage articles={articles} />
    </div>
  );
};

export default NewsPage;
