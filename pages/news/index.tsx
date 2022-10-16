/* eslint-disable jsx-a11y/label-has-associated-control */
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import NewsList from "@/components/news/news-list";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";
import { serverIndex, browserIndex } from "@/lib/algolia";
import groq from "groq";
import { NextSeo } from "next-seo";

import type Post from "@/types/post";
import { NextPage, type GetStaticProps } from "next/types";
import Button from "@/components/stour/button";
import {
  FormEventHandler,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";
import { useRouter } from "next/router";
import { type SearchResponse } from "@algolia/client-search";
import { postFields } from "@/lib/queries";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";

type Props = {
  data: Post[];
};

export const getStaticProps: GetStaticProps = async () => {
  // Get the latest 30 posts for static generation
  const data = await sanityClient.fetch(groq`
    *[_type == "news" && !(_id in path("drafts.**"))] | order(date desc){
        _id,
        "slug": slug.current,
        title,
        excerpt,
        date,
        featuredImage {
          alt, 
          caption,
          "_id": @.image.asset->_id, 
          "lqip": @.image.asset->metadata.lqip, 
          "aspectRatio": @.image.asset->metadata.dimensions.aspectRatio
        },
      }[0...30]
   `);

  // Also, fetch the total number of posts from Sanity
  const sanityTotal = await sanityClient.fetch(groq`
    count(*[_type == "news" && !(_id in path("drafts.**"))])
  `);

  // Then fetch the number of posts on Algolia
  const algoliaTotal = await serverIndex
    .search("", { hitsPerPage: 0 })
    .then((r) => r.nbHits);

  // If the number of posts on Sanity does not equal the number of posts on
  // Algolia, reindex. (Obviously, this is not fault-proof, but it should ensure
  // that reindexing happens fairly regularly.)
  if (sanityTotal !== algoliaTotal) {
    const query = groq`*[_type == "news" && !(_id in path("drafts.**"))]{${postFields}}`;

    sanityClient.fetch(query).then((results) => {
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

const News: NextPage<Props> = ({ data }) => {
  const router = useRouter();
  const { q } = router.query;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [dirty, setDirty] = useState(false);
  const [results, setResults] = useState<SearchResponse<any>["hits"]>([]);
  const searchInputId = useId();

  const search = useCallback(async () => {
    if (!dirty) setDirty(true);
    router.push(`/news?q=${searchTerm}`, undefined, {
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
          images: [{ url: `${BASE_URL}/assets/og/news.png` }],
        }}
      />
      <div className="flex items-center py-6 border-t border-b">
        <Container className="grid items-center justify-between grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex items-center md:col-span-2">
            {activeSearchTerm && (
              <button
                type="button"
                className="py-3 pr-4 text-gray-400 hover:text-blue-600"
                onClick={() => cancelSearch()}
              >
                <ArrowUturnLeftIcon className="w-5 h-5" />
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
                      className={`transition-colors relative group inline-block hover:border-red-200 
                        hover:bg-red-50 hover:text-red-200 rounded border mb-px border-blue-200 
                        bg-blue-50 font-bold tracking-widest px-0.5 text-blue-400 uppercase text-xs`}
                      onClick={() => cancelSearch()}
                    >
                      <XMarkIcon className="absolute left-0 right-0 w-4 h-4 mx-auto text-red-600 transition-opacity opacity-0 stroke-red-600 group-hover:opacity-100" />
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
            className="flex items-center justify-center w-full mt-4"
            onSubmit={(e) => handleSubmit(e)}
          >
            <label htmlFor={searchInputId} className="sr-only">
              Search
            </label>
            <input
              id={searchInputId}
              type="search"
              name="q"
              className="w-full h-10 pl-3 m-0 rounded-r-none outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              type="submit"
              className="z-0 h-10 -ml-px border-l rounded-l-none"
              shadow={Boolean(searchTerm && searchTerm !== activeSearchTerm)}
              disabled={!searchTerm}
            >
              <span className="sr-only">Search</span>
              <MagnifyingGlassIcon className="w-4 h-4" />
            </Button>
          </form>
        </Container>
      </div>
      <Container className="my-10">
        <NewsList
          posts={activeSearchTerm ? results : data}
          hero={!activeSearchTerm}
          // Nasty ternary: Only 2 options:
          // - Empty string if search is active or fewer than 30 posts
          // - The more link if more than 30 posts
          more={activeSearchTerm || data?.length < 30 ? "" : "/news/p/2"}
        />
      </Container>
    </Layout>
  );
};

export default News;
