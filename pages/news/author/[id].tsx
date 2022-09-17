import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import DateFormatter from "@/components/utils/date-formatter";
import sanityClient from "@/lib/sanity.server";
import groq from "groq";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";

export interface Author {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  firstName: string;
  surname: string;
}

export const AuthorArchive: React.FC<{ author: Author; feed: any[] }> = ({
  author,
  feed,
}: {
  author: Author;
  feed: any[];
}) => (
  <Layout>
    <NextSeo
      title={`Archive: ${author.firstName} ${author.surname}`}
      description={`Archive of all posts by ${author.firstName} ${author.surname}`}
    />
    <div className="flex items-center py-6 border-t border-b">
      <Container>
        <h1>
          <Label className="max-w-prose">Author Archive</Label>
        </h1>
        <p className="flex justify-between">
          <span>{`${author.firstName} ${author.surname}`}</span>
        </p>
      </Container>
    </div>
    <Container>
      <ul className="my-8">
        {feed.map((item) => (
          <li key={item._id} className="grid mb-2">
            <Link href={`/news/${item.slug.current}`}>{item.title}</Link>
            <Label className="text-xs">
              <DateFormatter dateString={item.date} format="short" />
            </Label>
          </li>
        ))}
      </ul>
    </Container>
  </Layout>
);

export default AuthorArchive;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const author: Author = await sanityClient.fetch(
    groq`*[_type == "author" && _id == $id][0]`,
    { id: params?.id }
  );
  const feed = await sanityClient.fetch(
    groq`*[_type == "news" && references($id)] | order(date desc) {_id,title,date,slug} `,
    { id: params?.id }
  );
  return { props: { author, feed } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await sanityClient.fetch(groq`*[_type == "author"]`);

  const ids: string[] = paths.map((author: Author) => author._id);
  return {
    paths: ids.map((id: string) => ({ params: { id } })),
    fallback: true,
  };
};
