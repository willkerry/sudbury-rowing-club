"use client";

import cn from "clsx";
import { BritishRowing } from "@/components/icons/organisations/british-rowing";
import { Label } from "@/components/stour/label";
import { Link } from "@/components/stour/link";
import { ErrorAlert } from "@/components/ui/error";
import { DateFormatter } from "@/components/utils/date-formatter";
import type { BRArticle } from "@/lib/server/fetchBritishRowingFeed";
import { trpc } from "@/lib/trpc/client";

const BritishRowingArticle = ({ article }: { article?: BRArticle }) => (
  <a
    className={cn(
      "group grid gap-1.5 rounded-sm border p-2 transition-colors",
      {
        "h-16 animate-pulse bg-gray-50": !article,
        "hover:border-blue-500": article,
      },
    )}
    href={article?.link}
    rel="noopener noreferrer"
    target="_blank"
  >
    {article && (
      <>
        <h3 className="font-medium text-sm leading-tight transition-colors group-hover:text-blue-500">
          {article.title}
        </h3>

        <div className="flex items-end justify-between gap-1">
          <DateFormatter
            className="font-medium text-gray-500 text-xs leading-none transition-colors group-hover:text-gray-800"
            dateString={article.date}
          />
          <BritishRowing className="h-4" />
        </div>
      </>
    )}
  </a>
);

const PresentationalFeed = ({
  articles,
  skeleton,
}:
  | { articles: BRArticle[]; skeleton?: undefined }
  | { articles?: undefined; skeleton: true }) => (
  <>
    <h2>
      <Label>News from around the country</Label>
    </h2>
    <p className="mb-8">
      The latest updates from{" "}
      <Link href="https://britishrowing.org/">British Rowing</Link>.
    </p>

    <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skeleton
        ? [...Array(12)].map((_, i) => <BritishRowingArticle key={i} />)
        : articles.map((article) => (
            <BritishRowingArticle key={article.id} {...{ article }} />
          ))}
    </div>
  </>
);

export const Feed = () => {
  const { data, status, error } = trpc.content.feed.useQuery();

  if (status === "pending") return <PresentationalFeed skeleton />;
  if (status === "error") return <ErrorAlert className="my-12" error={error} />;

  return <PresentationalFeed articles={data} />;
};
