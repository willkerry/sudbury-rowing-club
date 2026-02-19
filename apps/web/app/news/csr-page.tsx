"use client";

import type { serverGetNArticles } from "@sudburyrc/api";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, Undo2Icon, XIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { Suspense, useState } from "react";
import { Container } from "@/components/layouts/container";
import { NewsList } from "@/components/news/news-list";
import { Label } from "@/components/stour/label";
import { Link } from "@/components/stour/link";
import { Loading } from "@/components/stour/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBrowserClient, SEARCH_INDEX_NAME } from "@/lib/algolia";
import { SOCIALS } from "@/lib/constants";

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

  const { results } = await getBrowserClient().searchForHits<MinimalArticle>({
    requests: [
      {
        indexName: SEARCH_INDEX_NAME,
        query: term,
      },
    ],
  });

  return results[0]?.hits ?? [];
};

const NewsPage = ({ articles }: { articles: MinimalArticle[] }) => {
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
        <Container className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex items-center md:col-span-2">
            {searchTerm && (
              <button
                className="py-3 pr-4 text-gray-400 hover:text-blue-600"
                onClick={() => cancelSearch()}
                type="button"
              >
                <Undo2Icon aria-hidden className="h-4 w-4" />
                <span className="sr-only">Cancel search</span>
              </button>
            )}
            <div>
              <h1>
                <Label className="max-w-prose">
                  {status === "success" && !searchTerm
                    ? "Search Results"
                    : "Latest News"}
                </Label>
              </h1>
              <p className="max-w-prose">
                {searchTerm ? (
                  <>
                    {status === "success" && "Showing results for"}
                    {status === "pending" && "Searching for"}
                    {status === "error" && "Error searching for"}{" "}
                    <button
                      className={
                        "group relative mb-px inline-block rounded-sm border border-blue-200 bg-blue-50 px-0.5 font-bold text-blue-400 text-xs uppercase tracking-widest transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-200"
                      }
                      onClick={() => cancelSearch()}
                      type="button"
                    >
                      <XIcon
                        aria-hidden
                        className="absolute right-0 left-0 mx-auto h-4 w-4 stroke-red-600 text-red-600 opacity-0 transition-opacity group-hover:opacity-100"
                      />
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
            className="mt-4 flex w-full items-center justify-end"
            onSubmit={(e) => {
              e.preventDefault();
              setSearchTerm(searchInputValue.trim());
            }}
          >
            <Input
              aria-label="Search"
              autoComplete="off"
              inputClassName="rounded-r-none"
              name="q"
              onChange={(e) => setSearchInputValue(e.target.value)}
              type="search"
              value={searchInputValue}
            />
            <Button
              aria-label="Search"
              className="z-0 -ml-px h-10 rounded-l-none border-l"
              disabled={!searchInputValue}
              type="submit"
              variant="secondary"
            >
              <SearchIcon aria-hidden className="h-4 w-4" />
            </Button>
          </form>
        </Container>
      </div>
      <Container className="my-10">
        <NewsList
          error={error ?? undefined}
          hero={!searchTerm}
          more={getMoreUrl(searchTerm ?? "", articles)}
          posts={searchTerm && results ? results : articles}
          status={searchTerm ? status : "success"}
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
