import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Label from "@/components/stour/label";
import DateFormatter from "@/components/utils/date-formatter";
import { makeShareImageURL } from "@/lib/og-image";
import { fetchAuthor, fetchAllAuthors } from "@/lib/queries/fetch-authors";
import type { GetStaticPaths, InferGetStaticPropsType, NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await fetchAllAuthors();

  return {
    paths: paths.map(({ _id }) => ({
      params: {
        id: _id,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const author = await fetchAuthor(params?.id);

  return {
    props: {
      author,
    },
  };
};

export const AuthorArchive: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ author = null }) => (
  <Layout>
    <NextSeo
      title={`Archive: ${author?.firstName} ${author?.surname}`}
      description={`Archive of all posts by ${author?.firstName} ${author?.surname}`}
      openGraph={{
        title: `Archive: ${author?.firstName} ${author?.surname}`,
        description: `Archive of all posts by ${author?.firstName} ${author?.surname}`,
        images: [{ url: makeShareImageURL("Author archive", true) }],
      }}
    />
    <div className="flex items-center border-b border-t py-6">
      <Container>
        <h1>
          <Label className="max-w-prose">Author Archive</Label>
        </h1>
        <p className="flex justify-between">
          <span>{`${author?.firstName} ${author?.surname}`}</span>
        </p>
      </Container>
    </div>

    <Container>
      <div className="prose my-6 mr-auto">
        <ul className="pl-0">
          {author?.articles?.map(({ _id, slug, title, date }) => (
            <li key={_id} className="list-none pl-0 leading-tight">
              <Link href={`/news/${slug}`}>{title}</Link>
              <Label className="mt-1 block text-xs">
                <DateFormatter dateString={date} format="short" />
              </Label>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </Layout>
);

export default AuthorArchive;
