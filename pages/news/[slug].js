import { useRouter } from "next/router";
import PropTypes from "prop-types";
import ErrorPage from "next/error";
import { ArticleJsonLd, NextSeo } from "next-seo";
import Container from "../../components/container";
import PostBody from "../../components/post-body";
import PostHeader from "../../components/post-header";
import Layout from "../../components/layout";
import PostTitle from "../../components/post-title";
import {
  BASE_URL,
  LOGO,
  PROJECT_NAME,
  HOME_OG_IMAGE_URL,
} from "@/lib/constants";
import Label from "@/components/stour/label";
import DateFormatter from "@/components/date-formatter";
import sanityClient from "@/lib/sanity.server";
import { postQuery, postSlugsQuery } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";

export default function Post({ post }) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  // Turns featuredImage object into a useful URL. Making it a function, not a variable might be a bad idea, but attempts at a component-level variable led to build failures.
  const CoverImage = (image) => {
    if (image === null || image === undefined) return HOME_OG_IMAGE_URL;
    return urlFor(image).width(1200).url();
  };

  return post === undefined ? (
    "Loading..."
  ) : (
    <Layout>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
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
              images={[CoverImage(post.featuredImage)]}
              datePublished={post.date}
              publisherName={PROJECT_NAME}
              publisherLogo={LOGO}
              description={post.excerpt}
            />

            <PostHeader
              title={post.title}
              featuredImage={post.featuredImage && post.featuredImage}
              date={post.date}
              alt={post.featuredImage && post.featuredImage.alt}
              caption={post.featuredImage && post.featuredImage.caption}
              lqip={post.featuredImage && post.featuredImage.lqip}
            />
            {post.body && <PostBody content={post.body} />}

            <div className="flex flex-wrap mx-auto my-12 border rounded max-w-prose">
              {post.author && (
                <div className="p-4">
                  <Label className="text-xs">Author</Label>
                  <div className="text-sm font-medium">
                    {`${post.author.firstName} ${post.author.surname}`}
                  </div>
                </div>
              )}
              <div className="p-4">
                <Label className="text-xs">Published</Label>
                <div className="text-sm font-medium">
                  <DateFormatter dateString={post.date} />
                </div>
              </div>
            </div>
          </article>
        )}
      </Container>
    </Layout>
  );
}
Post.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    slug: PropTypes.string.isRequired,
    featuredImage: PropTypes.shape({
      _id: PropTypes.string,
      alt: PropTypes.string,
      lqip: PropTypes.string,
      aspectRatio: PropTypes.number,
      caption: PropTypes.string,
    }),
    date: PropTypes.string.isRequired,
    body: PropTypes.arrayOf(PropTypes.object),
    author: PropTypes.shape({
      firstName: PropTypes.string,
      surname: PropTypes.string,
    }),
  }).isRequired,
};

export async function getStaticProps({ params }) {
  const post = await sanityClient.fetch(postQuery, {
    slug: params.slug,
  });

  return {
    props: { post },
  };
}

export async function getStaticPaths() {
  const paths = await sanityClient.fetch(postSlugsQuery);

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

/* export async function getStaticProps({ params }) {
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
 */
