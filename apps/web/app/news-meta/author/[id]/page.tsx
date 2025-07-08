import { Container } from "@/components/layouts/container";
import { Label } from "@/components/stour/label";
import { DateFormatter } from "@/components/utils/date-formatter";
import { createMetadata } from "@/lib/create-metadata";
import { fetchAllAuthors, fetchAuthor } from "@sudburyrc/api";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    title: `${author?.firstName} ${author?.surname}`,
    description: `Archive of all posts by ${author?.firstName} ${author?.surname}`,
    image: { color: "light" },
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
              <li key={_id} className="list-none pl-0">
                <Link href={`/news/${slug}`} className="block leading-none">
                  {title}
                </Link>

                <DateFormatter
                  dateString={date}
                  format="short"
                  className="font-medium text-sm"
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
