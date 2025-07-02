import BritishRowing from "@/components/landing/sponsors/logos/british-rowing";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import DateFormatter from "@/components/utils/date-formatter";
import {
  type BRArticle,
  fetchBritishRowingFeed,
} from "@/lib/server/fetchBritishRowingFeed";
import cn from "clsx";

const BritishRowingArticle = ({ article }: { article?: BRArticle }) => (
  <a
    href={article?.link}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "group grid gap-1.5 rounded-sm border p-2 transition-colors",
      {
        "hover:border-blue-500": article,
        "h-16 animate-pulse bg-gray-50": !article,
      },
    )}
  >
    {article && (
      <>
        <h3 className="font-medium text-sm leading-tight transition-colors group-hover:text-blue-500">
          {article.title.rendered}
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

export const Feed = async ({ skeleton }: { skeleton?: boolean }) => {
  if (skeleton) return <PresentationalFeed skeleton />;

  return <PresentationalFeed articles={await fetchBritishRowingFeed()} />;
};
