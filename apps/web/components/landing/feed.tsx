"use client";

import { useQuery } from "@tanstack/react-query";
import cn from "clsx";
import BritishRowing from "@/components/landing/sponsors/british-rowing";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import DateFormatter from "@/components/utils/date-formatter";
import { type BRArticle as BRArticleType } from "@/app/api/br-feed/route";
import Result from "../stour/result";

const BRArticle = ({ article }: { article?: BRArticleType }) => (
  <a
    href={article && article.link}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "group grid gap-1.5 rounded border p-2 transition-colors hover:border-blue-500",
      !article && "h-16 animate-pulse bg-gray-50",
    )}
  >
    {article && (
      <>
        <h3
          className="text-sm font-medium leading-tight transition-colors group-hover:text-blue-500"
          dangerouslySetInnerHTML={{ __html: article.title.rendered }}
        />

        <div className="flex items-end justify-between gap-1">
          <DateFormatter
            className="text-xs font-medium leading-none text-gray-500 transition-colors group-hover:text-gray-800"
            dateString={article.date}
          />
          <BritishRowing className="h-4" />
        </div>
      </>
    )}
  </a>
);

const Feed = () => {
  const { data: articles, error } = useQuery<BRArticleType[]>({
    queryKey: ["british-rowing-feed"],
    queryFn: () => fetch("/api/br-feed").then((res) => res.json()),
  });

  return (
    <>
      <h2>
        <Label>News from around the country</Label>
      </h2>
      <p className="mb-8">
        The latest updates from{" "}
        <Link href="https://britishrowing.org/">British Rowing</Link>.
      </p>
      {!error ? (
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!articles && [...Array(12)].map((_, i) => <BRArticle key={i} />)}

          {articles?.map((article) => (
            <BRArticle key={article.id} {...{ article }} />
          ))}
        </div>
      ) : (
        <div className="mb-12 rounded border px-4 py-8">
          <Result
            title="Unable to retrieve stories from British Rowing."
            message={error.message}
            variant="error"
          />
        </div>
      )}
    </>
  );
};

export default Feed;
