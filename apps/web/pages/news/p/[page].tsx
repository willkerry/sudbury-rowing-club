import { NextSeo } from "next-seo";
import type {
  GetStaticPaths,
  InferGetStaticPropsType,
  NextPage,
} from "next/types";
import type { ParsedUrlQuery } from "querystring";
import { fetchArticleCount, serverGetNArticles } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import NewsList from "@/components/news/news-list";
import Paginate from "@/components/news/paginate";
import Label from "@/components/stour/label";
import DateFormatter from "@/components/utils/date-formatter";

const POSTS_PER_PAGE = 30;

export const getStaticPaths: GetStaticPaths = async () => {
  const articleCount = await fetchArticleCount();
  const length = Math.ceil(articleCount / POSTS_PER_PAGE);

  return {
    paths: Array.from({ length }, (_, i) => ({
      params: { page: String(i + 1) },
    })),
    fallback: false,
  };
};

export const getStaticProps = async ({
  params,
}: {
  params: ParsedUrlQuery;
}) => {
  const articleCount = await fetchArticleCount();
  const pages = Math.ceil(articleCount / POSTS_PER_PAGE);

  const page = Number(params?.page);

  const firstArticleNumber = page * POSTS_PER_PAGE - POSTS_PER_PAGE;
  const lastArticleNumber = page * POSTS_PER_PAGE;

  const pageOfArticles = await serverGetNArticles(
    firstArticleNumber,
    lastArticleNumber,
  );

  return { props: { data: pageOfArticles, page: params?.page, pages } };
};

const News: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  data,
  page,
  pages,
}) => {
  const showPrev = Number(page) > 1;
  const showNext = pages > Number(page);
  const previous = `/news/p/${Number(page) - 1}`;
  const next = `/news/p/${Number(page) + 1}`;

  return (
    <Layout>
      <NextSeo
        title={`News | Page ${page} | Sudbury Rowing Club`}
        description="News from Sudbury Rowing Club."
        openGraph={{
          title: `News | Page ${page} | Sudbury Rowing Club`,
          description: "News from Sudbury Rowing Club.",
          images: [{ url: makeShareImageURL("News", true) }],
        }}
      />
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
    </Layout>
  );
};

export default News;
