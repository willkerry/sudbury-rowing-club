import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import NewsList from "@/components/news/news-list";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";
import groq from "groq";
import { NextSeo } from "next-seo";

import type Post from "@/types/post";
import { type GetStaticProps } from "next/types";

type Props = {
  data: Post[];
};

// Get URL query string

export const getStaticProps: GetStaticProps = async () => {
  const data = await sanityClient.fetch(groq`
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
      }[0...30]
   `);

  return {
    props: { data },
  };
};

const News = ({ data }: Props) => (
  <Layout>
    <NextSeo
      title="News | Sudbury Rowing Club"
      description="Latest news from Sudbury Rowing Club."
      openGraph={{
        title: "Latest News",
        description: "Latest news from Sudbury Rowing Club.",
        images: [{ url: `${BASE_URL}/assets/og/news.png` }],
      }}
    />
    <div className="flex items-center py-6 border-t border-b">
      <Container>
        <h1>
          <Label className="max-w-prose">Latest News</Label>
        </h1>
        <p className="max-w-prose">
          For more updates, follow us on{" "}
          <Link href="https://facebook.com/sudburyrowing">Facebook</Link>.
        </p>
      </Container>
    </div>
    <Container className="my-10">
      <NewsList posts={data} hero more={data?.length === 30 ? "/news/p/2" : ""} />
    </Container>
  </Layout>
);

export default News;
