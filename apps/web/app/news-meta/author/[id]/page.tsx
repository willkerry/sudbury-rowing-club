import Link from "next/link";
import { fetchAllAuthors, fetchAuthor } from "@sudburyrc/api";
import { createMetadata } from "@/lib/create-metadata";
import Container from "@/components/layouts/container";
import Label from "@/components/stour/label";
import DateFormatter from "@/components/utils/date-formatter";

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
    </>
  );
};

export default AuthorArchive;
