import type { Metadata } from "next";
import { fetchArticleCount, serverGetNArticles } from "@sudburyrc/api";
import { createMetaData } from "@/lib/create-metadata";
import Container from "@/components/layouts/container";
import NewsList from "@/components/news/news-list";
import Paginate from "@/components/news/paginate";
import Label from "@/components/stour/label";
import DateFormatter from "@/components/utils/date-formatter";

const POSTS_PER_PAGE = 30;

const fetchPageCount = async () =>
  Math.ceil((await fetchArticleCount()) / POSTS_PER_PAGE);

export const generateStaticParams = async () =>
  new Array(await fetchPageCount()).fill(0).map((_, i) => ({
    page: String(i + 1),
  }));

type Params = Awaited<ReturnType<typeof generateStaticParams>>[number];

export const generateMetadata = async ({
  params: { page },
}: {
  params: Params;
}): Promise<Metadata> =>
  createMetaData({
    title: `News | Page ${page} | Sudbury Rowing Club`,
    description: "News from Sudbury Rowing Club.",
  });

const fetchPagedArticles = async (page: number) => {
  const firstArticleNumber = page * POSTS_PER_PAGE - POSTS_PER_PAGE;
  const lastArticleNumber = page * POSTS_PER_PAGE;

  return serverGetNArticles(firstArticleNumber, lastArticleNumber);
};

const News = async ({ params: { page } }: { params: Params }) => {
  const pages = await fetchPageCount();
  const data = await fetchPagedArticles(Number(page));

  const showPrev = Number(page) > 1;
  const showNext = pages > Number(page);
  const previous = `/news/p/${Number(page) - 1}`;
  const next = `/news/p/${Number(page) + 1}`;

  return (
    <>
      <div className="flex items-center border-b border-t py-6">
        <Container>
          <h1>
            <Label className="max-w-prose">News Archive</Label>
          </h1>
          <p className="flex justify-between">
            <span>
              {data.length > 0 && (
                <>
                  From <DateFormatter dateString={data[0].date} /> to{" "}
                  <DateFormatter dateString={data[data.length - 1].date} />.
                </>
              )}
            </span>
            <span className="text-sm font-medium uppercase tracking-wider text-gray-600">
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
