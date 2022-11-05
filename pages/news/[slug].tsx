import { useRouter } from "next/router";
import { ArticleJsonLd, NextSeo } from "next-seo";
import Container from "@/components/layouts/container";
import PostBody from "@/components/news/post-body";
import PostHeader from "@/components/news/post-header";
import Layout from "@/components/layouts/layout";
import {
  BASE_URL,
  LOGO,
  PROJECT_NAME,
  HOME_OG_IMAGE_URL,
} from "@/lib/constants";
import Label from "@/components/stour/label";
import DateFormatter from "@/components/utils/date-formatter";
import sanityClient from "@/lib/sanity.server";
import { postQuery, postSlugsQuery } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";

import type PostType from "@/types/post";
import { GetStaticPaths, GetStaticProps } from "next/types";
import Link from "@/components/stour/link";
import { ArrowUpRightIcon, PencilSquareIcon } from "@heroicons/react/20/solid";

export default function Post({ post }: { post: PostType }) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug)
    <Layout>
      <Container>
        <h1>404 - Page Not Found</h1>
      </Container>
    </Layout>;

  const CoverImage = (image: PostType["featuredImage"]) => {
    if (!image) return HOME_OG_IMAGE_URL;

    return urlFor(image).width(1200).url();
  };
  return post === undefined ? (
    "Loading..."
  ) : (
    <Layout>
      <Container>
        {router.isFallback ? (
          <h1>Loading…</h1>
        ) : (
          <article className="mb-32">
            <NextSeo
              title={post.title}
              description={post.excerpt}
              openGraph={{
                title: post.title,
                description: post.excerpt,
                url: BASE_URL + router.asPath,
                type: "article",
                article: {
                  publishedTime: post.date,
                },
                images: [
                  {
                    url: CoverImage(post.featuredImage),
                  },
                ],
              }}
            />
            <ArticleJsonLd
              url={BASE_URL + router.asPath}
              title={post.title}
              authorName={`${post.author?.firstName} ${post.author?.surname}`}
              images={[CoverImage(post.featuredImage)]}
              datePublished={post.date}
              publisherName={PROJECT_NAME}
              publisherLogo={LOGO}
              description={post.excerpt}
            />

            <PostHeader
              title={post.title}
              featuredImage={post.featuredImage}
              date={post.date}
              alt={post.featuredImage?.alt}
              caption={post.featuredImage?.caption}
              lqip={post.featuredImage?.lqip}
            />
            {post.body && <PostBody content={post.body} />}

            <div className="flex justify-between px-5 pt-3 pb-4 mx-auto my-12 border rounded max-w-prose">
              <div className="flex gap-8">
                {post.author && (
                  <div>
                    <Label className="text-xs">Author</Label>
                    <div className="text-sm font-medium">
                      {`${post.author?.firstName} ${post.author?.surname}`}
                      <Link href={`/news/author/${post.author?._id}`}>
                        <ArrowUpRightIcon className="inline w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-xs">Published</Label>
                  <div className="text-sm font-medium">
                    <DateFormatter dateString={post.date} />
                  </div>
                </div>
              </div>
              <Link
                href={`https://edit.sudburyrowingclub.org.uk/desk/news;${post._id}`}
              >
                <span className="sr-only">Edit this article</span>
                <PencilSquareIcon className="inline w-4 h-4" />
              </Link>
            </div>
          </article>
        )}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await sanityClient.fetch(postQuery, {
    slug: params?.slug,
  });
  return { props: { post } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await sanityClient.fetch(postSlugsQuery);
  return {
    paths: paths.map((slug: string) => ({ params: { slug } })),
    fallback: true,
  };
};
