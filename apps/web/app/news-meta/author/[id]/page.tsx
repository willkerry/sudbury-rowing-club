import { fetchAllAuthors, fetchAuthor } from "@sudburyrc/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { Label } from "@/components/stour/label";
import { DateFormatter } from "@/components/utils/date-formatter";
import { createMetadata } from "@/lib/create-metadata";

type AuthorPageParams = { id: string };
type AuthorPageParamObject = { params: Promise<AuthorPageParams> };

export const generateStaticParams = async (): Promise<AuthorPageParams[]> => {
  const authors = await fetchAllAuthors();

  return authors.map(({ _id }) => ({ id: _id }));
};

export const generateMetadata = async ({ params }: AuthorPageParamObject) => {
  const author = await fetchAuthor((await params).id);

  if (!author) return {};

  return createMetadata({
    description: `Archive of all posts by ${author?.firstName} ${author?.surname}`,
    image: { color: "light" },
    title: `${author?.firstName} ${author?.surname}`,
  });
};

const AuthorArchive = async ({ params }: AuthorPageParamObject) => {
  const author = await fetchAuthor((await params).id);

  if (!author) return notFound();

  return (
    <>
      <div className="flex items-center border-t border-b py-6">
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
              <li className="list-none pl-0" key={_id}>
                <Link className="block leading-none" href={`/news/${slug}`}>
                  {title}
                </Link>

                <DateFormatter
                  className="font-medium text-sm"
                  dateString={date}
                  format="short"
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
