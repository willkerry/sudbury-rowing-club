import { NewsList } from "@/components/news/news-list";
import { Label } from "@/components/stour/label";
import Link from "@/components/stour/link";
import { SOCIALS } from "@/lib/constants";
import { fetchLandingPage } from "@sudburyrc/api";

const LandingNewsPage = async () => {
  const { news } = await fetchLandingPage();

  return (
    <>
      <h2>
        <Label>Latest News</Label>
      </h2>
      <p className="mb-12">
        For more updates, follow us on{" "}
        <Link href={SOCIALS.facebook.href}>{SOCIALS.facebook.name}</Link>.
      </p>
      <NewsList posts={news} hero />
      <div className="h-8" />
      <Link href="/news" arrow>
        See more news
      </Link>
    </>
  );
};

export default LandingNewsPage;
