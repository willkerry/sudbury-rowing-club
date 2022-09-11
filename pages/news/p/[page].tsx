import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import NewsList from "@/components/news/news-list";
import Label from "@/components/stour/label";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";
import groq from "groq";
import { NextSeo } from "next-seo";

import Paginate from "@/components/news/paginate";
import DateFormatter from "@/components/utils/date-formatter";
import type Post from "@/types/post";
import { GetStaticPaths, type GetStaticProps } from "next/types";

type Props = { data: Post[]; page: number; pages: number };

const posts = 30;

export const getStaticPaths: GetStaticPaths = async () => {
  const count = await sanityClient.fetch(
    groq`count(*[_type == "news" && !(_id in path("drafts.**"))])`
  );
  const length = Math.ceil(count / posts);
  return {
    paths: Array.from({ length }, (_, i) => ({
      params: { page: String(i + 1) },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pages = Math.ceil(
    (await sanityClient.fetch(
      groq`count(*[_type == "news" && !(_id in path("drafts.**"))])`
    )) / posts
  );
  const data = await sanityClient.fetch(
    groq`
    *[_type == "news" && !(_id in path("drafts.**"))] | order(date desc){
        _id,
        "slug": slug.current,
        title,
        excerpt,
        date,
        featuredImage {
          alt, 
          caption,
          "_id": @.image.asset->_id, 
          "lqip": @.image.asset->metadata.lqip, 
          "aspectRatio": @.image.asset->metadata.dimensions.aspectRatio
        },
      }[$first...$last]
   `,
    {
      first: Number(params?.page) * posts - posts,
      last: Number(params?.page) * posts,
    }
  );
  return { props: { data, page: params?.page, pages } };
};

const News = ({ data, page, pages }: Props) => {
  const showPrev = Number(page) > 1;
  const showNext = pages > Number(page);
  const previous =
    Number(page) === 2 ? "/news/" : `/news/p/${Number(page) - 1}`;
  const next = `/news/p/${Number(page) + 1}`;

  return (
    <Layout>
      <NextSeo
        title={`News | Page ${page} | Sudbury Rowing Club`}
        description="News from Sudbury Rowing Club."
        openGraph={{
          title: `News | Page ${page} | Sudbury Rowing Club`,
          description: "News from Sudbury Rowing Club.",
          images: [{ url: `${BASE_URL}/assets/og/news.png` }],
        }}
      />
      <div className="flex items-center py-6 border-t border-b">
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
            <span className="text-sm font-medium tracking-wider text-gray-600 uppercase">
              Page {page} of {pages}
            </span>
          </p>
        </Container>
      </div>
      <Container className="my-10">
        <Paginate
          page={Number(page)}
          {...{ showPrev, showNext, previous, next }}
        />

        {data.length > 0 ? (
          <NewsList posts={data} />
        ) : (
          <p>There’s no more news.</p>
        )}

        <Paginate
          page={Number(page)}
          {...{ showPrev, showNext, previous, next }}
        />
      </Container>
    </Layout>
  );
};

export default News;
