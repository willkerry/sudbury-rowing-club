import BritishRowing from "@/components/landing/sponsors/british-rowing";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import DateFormatter from "@/components/utils/date-formatter";
import useBritishRowingFeed, {
  type BRArticle as BRArticleType,
} from "@/hooks/useBritishRowingFeed";
import cn from "clsx";
import Result from "../stour/result";

const BRArticle = ({ article }: { article?: BRArticleType }) => (
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
        <h3
          className="font-medium text-sm leading-tight transition-colors group-hover:text-blue-500"
          dangerouslySetInnerHTML={{ __html: article.title.rendered }}
        />

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

const Feed = () => {
  const { data: articles, error } = useBritishRowingFeed();

  return (
    <>
      <h2>
        <Label>News from around the country</Label>
      </h2>
      <p className="mb-8">
        The latest updates from{" "}
        <Link href="https://britishrowing.org/">British Rowing</Link>.
      </p>
      {error ? (
        <div className="mb-12 rounded border px-4 py-8">
          <Result
            title="Unable to retrieve stories from British Rowing."
            message={error.message}
            variant="error"
          />
        </div>
      ) : (
        <div className="mb-12 grid gap-4 lg:grid-cols-3 sm:grid-cols-2">
          {!articles && [...Array(12)].map((_, i) => <BRArticle key={i} />)}

          {articles?.map((article) => (
            <BRArticle key={article.id} {...{ article }} />
          ))}
        </div>
      )}
    </>
  );
};

export default Feed;
