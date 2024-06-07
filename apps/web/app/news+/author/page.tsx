import Link from "next/link";
import cn from "clsx";
import { fetchAllAuthors } from "@sudburyrc/api";
import { createMetaData } from "@/lib/create-metadata";
import Container from "@/components/layouts/container";
import Label from "@/components/stour/label";

export const metadata = createMetaData({
  title: "Authors",
  description: "List of contributing authors",
  image: { title: "Our authors" },
});

const fetchAndRankAuthors = async () => {
  const authors = await fetchAllAuthors();

  let rank = 0;

  return authors.map((author, index) => {
    if (author.articleCount !== authors[index - 1]?.articleCount) {
      rank += 1;
    }

    return {
      ...author,
      rank,
    };
  });
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
        <ul className="mb-16 mt-8">
          {authors.map(
            ({ _id, firstName, surname, articleCount, rank }, index) => {
              const authorName = `${firstName} ${surname}`;
              const href = `/news+/author/${_id}`;

              const firstOfRank =
                index === 0 || authors[index - 1].rank !== rank;

              return (
                <li
                  key={_id}
                  className={cn("mb-4 flex text-lg", firstOfRank && "pt-2")}
                >
                  <div className="relative w-8">
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
                    <span className="ml-3 text-xs font-bold uppercase tracking-widest text-gray-500 transition group-hover:text-gray-400">
                      {articleCount}
                    </span>
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
