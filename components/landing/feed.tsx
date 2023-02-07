import DateFormatter from "@/components/utils/date-formatter";
import useBritishRowingFeed, {
  type BRArticle,
} from "@/hooks/useBritishRowingFeed";
import BritishRowing from "@/components/landing/sponsors/british-rowing";
import Label from "@/components/stour/label";
import cn from "classnames";
import Link from "@/components/stour/link";

const BRArticle = ({ article }: { article?: BRArticle }) => (
  <a
    href={article && article.link}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "border hover:border-blue-500 transition p-2 rounded grid gap-1.5 group",
      !article && "animate-pulse h-16 bg-gray-50"
    )}
  >
    {article && (
      <>
        <h3 className="text-sm font-medium leading-tight group-hover:text-blue-600">
          {article.title.rendered}
        </h3>

        <div className="flex gap-1 justify-between items-end">
          <DateFormatter
            className="text-xs font-medium text-gray-500 leading-none"
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
      <div className="mb-12 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {error && <div>Failed to load</div>}
        {!articles && [...Array(12)].map((_, i) => <BRArticle key={i} />)}

        {articles?.map((article) => (
          <BRArticle key={article.id} {...{ article }} />
        ))}
      </div>
    </>
  );
};

export default Feed;
