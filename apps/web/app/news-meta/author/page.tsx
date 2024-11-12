import Container from "@/components/layouts/container";
import Label from "@/components/stour/label";
import { createMetadata } from "@/lib/create-metadata";
import { fetchAllAuthors } from "@sudburyrc/api";
import cn from "clsx";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Authors",
  description: "List of contributing authors",
  image: { title: "Our authors" },
});

const fetchAndRankAuthors = async () => {
  const authors = await fetchAllAuthors();

  let rank = 0;

  return authors
    .map((author, index) => {
      if (author.articleCount !== authors[index - 1]?.articleCount) {
        rank += 1;
      }

      return {
        ...author,
        rank,
      };
    })
    .sort((a, b) => a.rank - b.rank || a.surname.localeCompare(b.surname));
};

const Authors = async () => {
  const authors = await fetchAndRankAuthors();

  return (
    <>
      <div className="flex items-center border-b border-t py-6">
        <Container>
          <h1>
            <Label className="max-w-prose">Author Archive</Label>
          </h1>
        </Container>
      </div>

      <Container>
        <ul className="pb-16 mt-8">
          {authors.map(
            ({ _id, firstName, surname, articleCount, rank }, index) => {
              const authorName = `${firstName} ${surname}`;
              const href = `/news-meta/author/${_id}`;

              const firstOfRank =
                index === 0 || authors[index - 1].rank !== rank;

              return (
                <li
                  key={_id}
                  className={cn("mb-4 flex text-lg", firstOfRank && "pt-2")}
                >
                  <div className="relative w-6">
                    {firstOfRank && (
                      <span className="disambiguate absolute inset-0 text-center font-medium leading-none text-blue-500">
                        {rank}
                      </span>
                    )}
                  </div>
                  <Link {...{ href }} className="group leading-none">
                    <span className="text-gray-900 transition group-hover:text-blue-500">
                      {authorName}
                    </span>

                    {firstOfRank && (
                      <span className="ml-3 text-sm mb-0.5 font-semibold uppercase tracking-widest text-gray-500 transition group-hover:text-gray-700">
                        {articleCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            },
          )}
        </ul>
      </Container>
    </>
  );
};

export default Authors;
