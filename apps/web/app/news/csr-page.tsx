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
import type { SearchResponse } from "@algolia/client-search";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import type { serverGetNArticles } from "@sudburyrc/api";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type FormEventHandler,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";

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

const NewsPage = ({
  articles,
}: {
  articles: MinimalArticle[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams?.get("q");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [dirty, setDirty] = useState(false);
  const [results, setResults] = useState<
    SearchResponse<MinimalArticle>["hits"]
  >([]);

  const search = useCallback(async () => {
    if (!dirty) setDirty(true);
    router.push(`/news?q=${encodeURIComponent(searchTerm)}`);
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
    router.push("/news");
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
        .search<MinimalArticle>(activeSearchTerm)
        .then((response) => setResults(response.hits));
    }
  }, [activeSearchTerm]);

  return (
    <>
      <div className="flex items-center border-b border-t py-6">
        <Container className="grid grid-cols-1 items-center justify-between gap-4 sm:grid-cols-2 md:grid-cols-3">
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
                      className={`group relative mb-px inline-block rounded 
                        border border-blue-200 bg-blue-50 px-0.5 text-xs font-bold 
                        uppercase tracking-widest text-blue-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-200`}
                      onClick={() => cancelSearch()}
                    >
                      <XMarkIcon className="absolute left-0 right-0 mx-auto h-4 w-4 stroke-red-600 text-red-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      {activeSearchTerm}
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
            onSubmit={(e) => handleSubmit(e)}
          >
            <Input
              type="search"
              name="q"
              inputClassName="rounded-r-none"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              type="submit"
              variant="secondary"
              className="z-0 -ml-px h-10 rounded-l-none border-l"
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
          posts={activeSearchTerm ? results : articles}
          hero={!activeSearchTerm}
          more={getMoreUrl(activeSearchTerm, articles)}
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
