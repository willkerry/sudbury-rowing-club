import Container from "@/components/layouts/container";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import NewsList from "@/components/news/news-list";
import type { ArticleSummary } from "@/lib/queries/fetch-news-article";

const LatestNews = ({ news }: { news: ArticleSummary[] }) => (
  <section className="my-16">
    <Container>
      <h2>
        <Label>Latest News</Label>
      </h2>
      <p className="mb-12">
        For more updates, follow us on{" "}
        <Link href="https://facebook.com/sudburyrowing">Facebook</Link>.
      </p>
      <NewsList posts={news} hero />
      <div className="h-8" />
      <Link href="/news" arrow>
        See more news
      </Link>
    </Container>
  </section>
);

export default LatestNews;
