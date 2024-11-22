import { Feed } from "@/components/landing/feed";

export const revalidate = 60 * 60 * 24;

const BritishRowingFeedPage = async () => <Feed />;

export default BritishRowingFeedPage;
