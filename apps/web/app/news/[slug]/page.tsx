import { Metadata } from "next";
import { ArrowUpRightIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import {
  type Article,
  serverGetAllSlugs,
  serverGetArticleBySlug,
  urlFor,
} from "@sudburyrc/api";
import { createMetadata } from "@/lib/create-metadata";
import PostBody from "@/components/news/post-body";
import PostHeader from "@/components/news/post-header";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import DateFormatter from "@/components/utils/date-formatter";

export const generateStaticParams = async () => {
  const paths = await serverGetAllSlugs();

  return paths.map((slug) => ({ slug }));
};

type Params = {
  params: Awaited<ReturnType<typeof generateStaticParams>>[number];
};

const coverImage = (image: Article["featuredImage"]) => {
  if (!image) return undefined;

  return urlFor(image).width(1200).url();
};

export const generateMetadata = async ({
  params,
}: Params): Promise<Metadata> => {
  const post = await serverGetArticleBySlug(params?.slug);

  return {
    ...createMetadata({
      title: post.title,
      description: post.excerpt || "",
      ...(post.author && {
        author: `${post.author.firstName} ${post.author.surname}`,
      }),
      type: "article",
      publishedTime: post.date,
      image: post.featuredImage
        ? coverImage(post.featuredImage)
        : {
            color: "light",
            title: post.title,
            subtitle: new Date(post.date).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          },
    }),
  };
};

const Post = async ({ params }: Params) => {
  const post = await serverGetArticleBySlug(params?.slug);

  return (
    <>
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
                  <ArrowUpRightIcon aria-hidden className="inline h-4 w-4" />
                  <span className="sr-only">
                    View all articles by {post.author?.firstName}{" "}
                    {post.author?.surname}
                  </span>
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
          href={`https://edit.sudburyrowingclub.org.uk/structure/news;news;${post._id}`}
        >
          <span className="sr-only">Edit this article</span>
          <PencilSquareIcon aria-hidden className="inline h-4 w-4" />
        </Link>
      </div>
    </>
  );
};

export default Post;
