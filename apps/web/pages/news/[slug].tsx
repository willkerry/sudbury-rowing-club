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
import type {
  GetStaticPaths,
  InferGetStaticPropsType,
  NextPage,
} from "next/types";
import Link from "@/components/stour/link";
import { ArrowUpRightIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import { ParsedUrlQuery } from "querystring";
import {
  serverGetAllSlugs,
  serverGetArticleBySlug,
  urlFor,
  type Article,
} from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";

export const getStaticProps = async ({
  params,
}: {
  params: ParsedUrlQuery;
}) => ({
  props: { post: await serverGetArticleBySlug(params?.slug as string) },
});

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await serverGetAllSlugs();
  return {
    paths: paths.map((slug: string) => ({ params: { slug } })),
    fallback: true,
  };
};

const coverImage = (image: Article["featuredImage"]) => {
  if (!image) return HOME_OG_IMAGE_URL;

  return urlFor(image).width(1200).url();
};

const Post: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  post,
}) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug)
    <Layout>
      <Container>
        <h1>404 - Page Not Found</h1>
      </Container>
    </Layout>;

  return (
    <Layout>
      <Container>
        {router.isFallback ? (
          <h1>Loading…</h1>
        ) : (
          <article className="mb-32">
            <NextSeo
              title={post.title}
              description={post.excerpt || ""}
              openGraph={{
                title: post.title,
                description: post.excerpt || "",
                url: BASE_URL + router.asPath,
                type: "article",
                article: {
                  publishedTime: post.date,
                },
                images: [
                  {
                    url: post.featuredImage
                      ? coverImage(post.featuredImage)
                      : makeShareImageURL(post.title, true, {
                          variant: "light",
                          subtitle: new Date(post.date).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          ),
                        }),
                  },
                ],
              }}
            />
            <ArticleJsonLd
              url={BASE_URL + router.asPath}
              title={post.title}
              authorName={`${post.author?.firstName} ${post.author?.surname}`}
              images={[coverImage(post.featuredImage)]}
              datePublished={post.date}
              publisherName={PROJECT_NAME}
              publisherLogo={LOGO}
              description={post.excerpt || ""}
            />

            <PostHeader
              title={post.title}
              featuredImage={post.featuredImage}
              date={post.date}
            />
            {post.body && <PostBody content={post.body} />}

            <div className="mx-auto my-12 flex max-w-prose justify-between rounded border bg-gray-50 px-3 pb-3 pt-2">
              <div className="flex gap-8">
                {post.author && (
                  <div>
                    <Label className="text-xs">Author</Label>
                    <div className="text-sm font-medium">
                      {`${post.author?.firstName} ${post.author?.surname}`}
                      <Link href={`/news/author/${post.author?._id}`}>
                        <ArrowUpRightIcon className="inline h-4 w-4" />
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
                <PencilSquareIcon className="inline h-4 w-4" />
              </Link>
            </div>
          </article>
        )}
      </Container>
    </Layout>
  );
};

export default Post;
