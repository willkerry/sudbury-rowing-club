import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Label from "@/components/stour/label";
import Link from "next/link";
import { fetchAllAuthors } from "@/lib/queries/fetch-authors";
import cn from "classnames";
import { type InferGetStaticPropsType, type NextPage } from "next";
import { NextSeo } from "next-seo";

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
    <NextSeo title="Authors" description="List of contributing authors" />
    <div className="flex items-center py-6 border-t border-b">
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
                className={cn("flex mb-4 text-lg", firstOfRank && "pt-2")}
              >
                <div className="relative w-8">
                  {firstOfRank && (
                    <span className="absolute inset-0 text-center leading-none font-medium disambiguate text-blue-500">
                      {rank}
                    </span>
                  )}
                </div>
                <Link {...{ href }} className="group leading-none">
                  <span className="transition text-gray-900 group-hover:text-blue-500">
                    {authorName}
                  </span>
                  <span className="uppercase ml-3 text-gray-500 font-bold tracking-widest text-xs group-hover:text-gray-400 transition">
                    {articleCount}
                  </span>
                </Link>
              </li>
            );
          }
        )}
      </ul>
    </Container>
  </Layout>
);

export default Authors;
