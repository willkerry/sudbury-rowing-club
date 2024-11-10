import Container from "@/components/layouts/container";
import Label from "@/components/stour/label";
import DateFormatter from "@/components/utils/date-formatter";
import { createMetadata } from "@/lib/create-metadata";
import { fetchAllAuthors, fetchAuthor } from "@sudburyrc/api";
import Link from "next/link";

export const generateStaticParams = async () => {
  const authors = await fetchAllAuthors();

  return authors.map(({ _id }) => ({ id: _id }));
};

type Params = {
  params: Awaited<ReturnType<typeof generateStaticParams>>[number];
};

export const generateMetadata = async ({ params }: Params) => {
  const author = await fetchAuthor(params?.id);

  return createMetadata({
    title: `${author?.firstName} ${author?.surname}`,
    description: `Archive of all posts by ${author?.firstName} ${author?.surname}`,
    image: { color: "light" },
  });
};

const AuthorArchive = async ({ params }: Params) => {
  const author = await fetchAuthor(params?.id);

  return (
    <>
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
              <li key={_id} className="list-none pl-0">
                <Link href={`/news/${slug}`} className="block leading-none">
                  {title}
                </Link>

                <DateFormatter
                  dateString={date}
                  format="short"
                  className="text-sm font-medium"
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
};

export default AuthorArchive;
