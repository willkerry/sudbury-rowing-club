import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import NewsList from "@/components/news/news-list";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import { Button } from "@/components/ui/button";
import { browserIndex, serverIndex } from "@/lib/algolia";
import { makeShareImageURL } from "@/lib/og-image";
import type { SearchResponse } from "@algolia/client-search";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import {
  fetchArticleCount,
  fetchNArticles,
  serverGetNArticles,
} from "@sudburyrc/api";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import type { InferGetStaticPropsType, NextPage } from "next/types";
/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  type FormEventHandler,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";

function getMoreUrl(activeSearchTerm: string, data: any[]) {
  if (activeSearchTerm) {
    return "";
  }
  if (data.length < 30) {
    return "";
  }
  return "/news/p/2";
}

export const getStaticProps = async () => {
  const data = await serverGetNArticles(0, 30);

  const sanityTotal = await fetchArticleCount();

  // Then fetch the number of posts on Algolia
  const algoliaTotal = await serverIndex
    .search("", { hitsPerPage: 0 })
    .then((r) => r.nbHits);

  // If the number of posts on Sanity does not equal the number of posts on
  // Algolia, reindex. (Obviously, this is not fault-proof, but it should ensure
  // that reindexing happens fairly regularly.)
  if (sanityTotal !== algoliaTotal) {
    fetchNArticles(0, sanityTotal).then((results) => {
      // It's **essential** to assign the post _id to the Algolia objectID here,
      // otherwise Algolia will create thousands of duplicate records.
      const records = results.map((p: any) => ({ ...p, objectID: p._id }));
      serverIndex.saveObjects(records);
    });
  }

  return {
    props: { data },
  };
};

const News: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  data,
}) => {
  const router = useRouter();
  const { q } = router.query;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [dirty, setDirty] = useState(false);
  const [results, setResults] = useState<SearchResponse<any>["hits"]>([]);
  const searchInputId = useId();

  const search = useCallback(() => {
    if (!dirty) setDirty(true);
    router.push(`/news?q=${encodeURIComponent(searchTerm)}`, undefined, {
      shallow: true,
    });
    setActiveSearchTerm(searchTerm);
  }, [searchTerm, dirty, router]);

  const handleSubmit: FormEventHandler = (e) => {
    e?.preventDefault();
    search();
  };

  const cancelSearch = useCallback(() => {
    setSearchTerm("");
    setActiveSearchTerm("");
    setDirty(false);
    router.push("/news", undefined, {
      shallow: true,
    });
  }, [router]);

  useEffect(() => {
    if (q) {
      setSearchTerm(q as string);
      setActiveSearchTerm(q as string);
    } else {
      setSearchTerm("");
      setActiveSearchTerm("");
    }
  }, [q]);

  useEffect(() => {
    if (activeSearchTerm) {
      browserIndex
        .search(activeSearchTerm)
        .then((response) => setResults(response.hits));
    }
  }, [activeSearchTerm]);

  return (
    <Layout>
      <NextSeo
        title="News | Sudbury Rowing Club"
        description="Latest news from Sudbury Rowing Club."
        openGraph={{
          title: "Latest News",
          description: "Latest news from Sudbury Rowing Club.",
          images: [{ url: makeShareImageURL("News", true) }],
        }}
      />
      <div className="flex items-center border-t border-b py-6">
        <Container className="grid grid-cols-1 items-center justify-between gap-4 md:grid-cols-3 sm:grid-cols-2">
          <div className="flex items-center md:col-span-2">
            {activeSearchTerm && (
              <button
                type="button"
                className="py-3 pr-4 text-gray-400 hover:text-blue-600"
                onClick={() => cancelSearch()}
              >
                <ArrowUturnLeftIcon aria-hidden className="h-5 w-5" />
                <span className="sr-only">Cancel search</span>
              </button>
            )}
            <div>
              <h1>
                <Label className="max-w-prose">
                  {activeSearchTerm ? "Search Results" : "Latest News"}
                </Label>
              </h1>
              <p className="max-w-prose">
                {activeSearchTerm ? (
                  <>
                    Showing results for{" "}
                    <button
                      type="button"
                      className="group relative mb-px inline-block rounded border border-blue-200 bg-blue-50 px-0.5 font-bold text-blue-400 text-xs uppercase tracking-widest transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-200"
                      onClick={() => cancelSearch()}
                    >
                      <XMarkIcon className="absolute right-0 left-0 mx-auto h-4 w-4 stroke-red-600 text-red-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      {activeSearchTerm}
                    </button>
                  </>
                ) : (
                  <>
                    For more updates, follow us on{" "}
                    <Link href="https://facebook.com/sudburyrowing">
                      Facebook
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          </div>
          <form
            className="mt-4 flex w-full items-center justify-center"
            onSubmit={(e) => handleSubmit(e)}
          >
            <label htmlFor={searchInputId} className="sr-only">
              Search
            </label>
            <input
              id={searchInputId}
              type="search"
              name="q"
              className="m-0 h-10 w-full rounded-r-none pl-3 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              type="submit"
              variant="secondary"
              className="-ml-px z-0 h-10 rounded-l-none border-l"
              shadow={Boolean(searchTerm && searchTerm !== activeSearchTerm)}
              disabled={!searchTerm}
            >
              <span className="sr-only">Search</span>
              <MagnifyingGlassIcon className="h-4 w-4" />
            </Button>
          </form>
        </Container>
      </div>
      <Container className="my-10">
        <NewsList
          posts={activeSearchTerm ? results : data}
          hero={!activeSearchTerm}
          more={getMoreUrl(activeSearchTerm, data)}
        />
      </Container>
    </Layout>
  );
};

export default News;
