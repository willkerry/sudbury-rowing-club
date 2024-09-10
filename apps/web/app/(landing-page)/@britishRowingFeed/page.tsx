import Feed from "@/components/landing/feed";
import { fetchBritishRowingFeed } from "@/lib/server/fetchBritishRowingFeed";

export const revalidate = 60 * 60 * 24;

const BritishRowingFeedPage = async () => {
  const articles = await fetchBritishRowingFeed();

  return <Feed articles={articles} />;
};

export default BritishRowingFeedPage;
