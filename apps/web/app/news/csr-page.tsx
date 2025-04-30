"use client";

import Container from "@/components/layouts/container";
import NewsList from "@/components/news/news-list";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import Loading from "@/components/stour/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { browserIndex } from "@/lib/algolia";
import { SOCIALS } from "@/lib/constants";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import type { serverGetNArticles } from "@sudburyrc/api";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { Suspense, useState } from "react";

function getMoreUrl(activeSearchTerm: string, data: unknown[]) {
  if (activeSearchTerm) {
    return "";
  }
  if (data.length < 30) {
    return "";
  }
  return "/news/p/2";
}

type MinimalArticle = Awaited<ReturnType<typeof serverGetNArticles>>[number];

const search = async (term: string | null): Promise<MinimalArticle[]> => {
  if (!term) return new Promise((resolve) => resolve([]));

  return browserIndex.search<MinimalArticle>(term).then(({ hits }) => hits);
};

const NewsPage = ({
  articles,
}: {
  articles: MinimalArticle[];
}) => {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useQueryState("q");

  const {
    data: results,
    status,
    error,
  } = useQuery({
    enabled: !!searchTerm,
    queryKey: ["search", searchTerm],
    queryFn: () => search(searchTerm),
  });

  const cancelSearch = () => {
    setSearchTerm(null);
  };

  return (
    <>
      <div className="flex items-center border-t border-b py-6">
        <Container className="grid grid-cols-1 items-center justify-between gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex items-center md:col-span-2">
            {searchTerm && (
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
                  {status === "success" ? "Search Results" : "Latest News"}
                </Label>
              </h1>
              <p className="max-w-prose">
                {searchTerm ? (
                  <>
                    {status === "success" && "Showing results for"}
                    {status === "pending" && "Searching for"}
                    {status === "error" && "Error searching for"}{" "}
                    <button
                      type="button"
                      className={
                        "group relative mb-px inline-block rounded border border-blue-200 bg-blue-50 px-0.5 font-bold text-blue-400 text-xs uppercase tracking-widest transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-200"
                      }
                      onClick={() => cancelSearch()}
                    >
                      <XMarkIcon className="absolute right-0 left-0 mx-auto h-4 w-4 stroke-red-600 text-red-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      {searchTerm}
                    </button>
                  </>
                ) : (
                  <>
                    For more updates, follow us on{" "}
                    <Link href={SOCIALS.facebook.href}>
                      {SOCIALS.facebook.name}
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          </div>
          <form
            className="mt-4 flex w-full items-center justify-center"
            onSubmit={(e) => {
              e.preventDefault();
              setSearchTerm(searchInputValue);
            }}
          >
            <Input
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              type="search"
              name="q"
              inputClassName="rounded-r-none"
              aria-label="Search"
            />
            <Button
              type="submit"
              variant="secondary"
              className="-ml-px z-0 h-10 rounded-l-none border-l"
              disabled={!searchInputValue}
            >
              <span className="sr-only">Search</span>
              <MagnifyingGlassIcon className="h-4 w-4" />
            </Button>
          </form>
        </Container>
      </div>
      <Container className="my-10">
        <NewsList
          posts={searchTerm && results ? results : articles}
          hero={!searchTerm}
          more={getMoreUrl(searchTerm ?? "", articles)}
          status={status}
          error={error ?? undefined}
        />
      </Container>
    </>
  );
};

export const CSRNewsPage = ({
  articles,
}: {
  articles: Awaited<ReturnType<typeof serverGetNArticles>>;
}) => (
  <Suspense fallback={<Loading />}>
    <NewsPage articles={articles} />
  </Suspense>
);
