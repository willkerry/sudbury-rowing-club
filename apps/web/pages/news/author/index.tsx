import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Label from "@/components/stour/label";
import { makeShareImageURL } from "@/lib/og-image";
import { fetchAllAuthors } from "@sudburyrc/api";
import cn from "clsx";
import type { InferGetStaticPropsType, NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";

export const getStaticProps = async () => {
  const authors = await fetchAllAuthors();

  let rank = 0;

  const authorsWithRank = authors.map((author, index) => {
    if (author.articleCount !== authors[index - 1]?.articleCount) {
      rank += 1;
    }

    return {
      ...author,
      rank,
    };
  });

  return {
    props: {
      authors: authorsWithRank,
    },
  };
};

const Authors: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  authors = [],
}) => (
  <Layout>
    <NextSeo
      title="Authors"
      description="List of contributing authors"
      openGraph={{
        title: "Authors",
        description: "List of contributing authors",
        images: [{ url: makeShareImageURL("Our authors", true) }],
      }}
    />
    <div className="flex items-center border-t border-b py-6">
      <Container>
        <h1>
          <Label className="max-w-prose">Author Archive</Label>
        </h1>
      </Container>
    </div>
    <Container>
      <ul className="mt-8 mb-16">
        {authors.map(
          ({ _id, firstName, surname, articleCount, rank }, index) => {
            const authorName = `${firstName} ${surname}`;
            const href = `/news/author/${_id}`;

            const firstOfRank = index === 0 || authors[index - 1].rank !== rank;

            return (
              <li
                key={_id}
                className={cn("mb-4 flex text-lg", firstOfRank && "pt-2")}
              >
                <div className="relative w-8">
                  {firstOfRank && (
                    <span className="disambiguate absolute inset-0 text-center font-medium text-blue-500 leading-none">
                      {rank}
                    </span>
                  )}
                </div>
                <Link {...{ href }} className="group leading-none">
                  <span className="text-gray-900 transition group-hover:text-blue-500">
                    {authorName}
                  </span>
                  <span className="ml-3 font-bold text-gray-500 text-xs uppercase tracking-widest transition group-hover:text-gray-400">
                    {articleCount}
                  </span>
                </Link>
              </li>
            );
          },
        )}
      </ul>
    </Container>
  </Layout>
);

export default Authors;
