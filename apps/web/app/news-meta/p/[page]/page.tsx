import {
  type ArticleSummary,
  fetchArticleCount,
  serverGetNArticles,
} from "@sudburyrc/api";
import type { Metadata } from "next";
import { Container } from "@/components/layouts/container";
import { NewsList } from "@/components/news/news-list";
import { Paginate } from "@/components/news/paginate";
import { Label } from "@/components/stour/label";
import { DateFormatter } from "@/components/utils/date-formatter";
import { createMetadata } from "@/lib/create-metadata";

const POSTS_PER_PAGE = 30;

const fetchPageCount = async () =>
  Math.ceil((await fetchArticleCount()) / POSTS_PER_PAGE);

export const generateStaticParams = async () =>
  new Array(await fetchPageCount()).fill(0).map((_, i) => ({
    page: String(i + 1),
  }));

type Params = Awaited<ReturnType<typeof generateStaticParams>>[number];

export const generateMetadata = async (props: {
  params: Promise<Params>;
}): Promise<Metadata> =>
  createMetadata({
    description: "News from Sudbury Rowing Club.",
    title: `News | Page ${(await props.params).page} | Sudbury Rowing Club`,
    image: {
      subtitle: `Page ${(await props.params).page}`,
      title: "News Archive",
    },
  });

const fetchPagedArticles = (page: number) => {
  const firstArticleNumber = page * POSTS_PER_PAGE - POSTS_PER_PAGE;
  const lastArticleNumber = page * POSTS_PER_PAGE;

  return serverGetNArticles(firstArticleNumber, lastArticleNumber);
};

const DateRange = ({ articles }: { articles: ArticleSummary[] }) => {
  const start = articles[0]?.date;
  const end = articles.at(-1)?.date;

  if (!start) return;
  if (!end) return;

  return (
    <span>
      From <DateFormatter dateString={start} /> to{" "}
      <DateFormatter dateString={end} />.
    </span>
  );
};

const News = async (props: { params: Promise<Params> }) => {
  const { page } = await props.params;

  const [pages, data] = await Promise.all([
    fetchPageCount(),
    fetchPagedArticles(Number(page)),
  ]);

  const showPrev = Number(page) > 1;
  const showNext = pages > Number(page);
  const previous = `/news/p/${Number(page) - 1}`;
  const next = `/news/p/${Number(page) + 1}`;

  return (
    <>
      <div className="flex items-center border-t border-b py-6">
        <Container>
          <h1>
            <Label className="max-w-prose">News Archive</Label>
          </h1>
          <p className="flex justify-between">
            <DateRange articles={data} />

            <span className="font-medium text-gray-600 text-sm uppercase tracking-wider">
              Page {page} of {pages}
            </span>
          </p>
        </Container>
      </div>
      <Container className="my-10">
        {data.length > 0 ? (
          <NewsList posts={data} />
        ) : (
          <p>There’s no more news.</p>
        )}

        <Paginate
          page={Number(page)}
          pages={pages}
          {...{ showPrev, showNext, previous, next }}
        />
      </Container>
    </>
  );
};

export default News;
