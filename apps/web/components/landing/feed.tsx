import BritishRowing from "@/components/landing/sponsors/british-rowing";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import DateFormatter from "@/components/utils/date-formatter";
import cn from "clsx";
import type { BRArticle } from "@/lib/server/fetchBritishRowingFeed";

const BritishRowingArticle = ({
  article,
}: {
  article?: BRArticle;
}) => (
  <a
    href={article?.link}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "group grid gap-1.5 rounded border p-2 transition-colors hover:border-blue-500",
      !article && "h-16 animate-pulse bg-gray-50",
    )}
  >
    {article && (
      <>
        <h3 className="text-sm font-medium leading-tight transition-colors group-hover:text-blue-500">
          {article.title.rendered}
        </h3>

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

const Feed = async ({
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

export default Feed;
