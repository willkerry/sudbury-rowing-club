import type { Article } from "@sudburyrc/api";
import { PostPreview } from "@/components/news/post-preview";
import { getBrowserClient } from "@/lib/algolia";

export type SquadLatestNewsProps = {
  similarQuery: string;
};

export const SquadLatestNews = async ({
  similarQuery,
}: SquadLatestNewsProps) => {
  const client = getBrowserClient();

  const squadNews = await client.searchForHits<Article>({
    requests: [
      {
        indexName: "news",
        similarQuery,
      },
    ],
  });

  const latestThreeNews = squadNews.results?.[0]?.hits
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 3);

  return (
    <div className="not-prose">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {latestThreeNews.map((hit) => (
          <PostPreview post={hit} key={hit._id} />
        ))}
      </div>
    </div>
  );
};
