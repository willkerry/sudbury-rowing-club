import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "../../components/container";
import PostBody from "../../components/post-body";
import PostHeader from "../../components/post-header";
import Layout from "../../components/layout";
import { getPostBySlug, getAllPosts } from "../../lib/api";
import PostTitle from "../../components/post-title";
import {
  BASE_URL,
  PROJECT_NAME,
  LOGO,
  HOME_OG_IMAGE_URL,
} from "../../lib/constants";
import markdownToHtml from "../../lib/markdownToHtml";
import { NextSeo } from "next-seo";
import { ArticleJsonLd } from "next-seo";
import Label from "@/components/stour/label";
import { format, formatDistance } from "date-fns";
import { enGBLocale } from "date-fns/locale/en-GB";
import Link from "@/components/stour/link";

export default function Post({ post, morePosts, preview }) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  const shareImage = post.coverImage
    ? BASE_URL + post.coverImage
    : HOME_OG_IMAGE_URL;
  return (
    <Layout preview={preview}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <NextSeo
                title={post.title}
                description={post.description}
                openGraph={{
                  title: post.title,
                  description: post.description,
                  url: BASE_URL + router.asPath,
                  type: "article",
                  article: {
                    publishedTime: post.date,
                  },
                  images: [
                    {
                      url: shareImage,
                    },
                  ],
                }}
              />
              <ArticleJsonLd
                url={BASE_URL + router.asPath}
                title={post.title}
                images={[shareImage]}
                datePublished={post.date}
                publisherName={PROJECT_NAME}
                publisherLogo={LOGO}
                description={post.description}
              />
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />

              <div className="flex flex-wrap mx-auto my-12 border rounded max-w-prose">
                {post.author && (
                  <div className="p-4">
                    <Label className="text-xs">Author</Label>
                    <div className="text-sm font-medium">{post.author}</div>
                  </div>
                )}
                <div className="p-4">
                  <Label className="text-xs">Published</Label>
                  <div className="text-sm font-medium">
                    {format(new Date(post.date), "d MMM yyyy")}
                    {" (" +
                      formatDistance(new Date(post.date), new Date(), {
                        addSuffix: true,
                      }) +
                      ")"}
                  </div>
                </div>
              </div>
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
    "excerpt",
  ]);

  const content = await markdownToHtml(post.content || "");

  const regexHtmlTags = /(<([^>]+)>)/gi;
  const firstParagraph = content.match(/(^.*?)((<p[^>]*>.*?<\/p>\s*){1})/gi);
  const firstParagraphString = firstParagraph && firstParagraph.toString();
  const description = post.excerpt
    ? post.excerpt
    : firstParagraphString && firstParagraphString.length < 300
    ? firstParagraphString.replace(/(<([^>]+)>)/gi, "")
    : !firstParagraphString
    ? ""
    : content.split(". ")[0].replace(regexHtmlTags, "") + ".";

  return {
    props: {
      post: {
        ...post,
        content,
        description,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
