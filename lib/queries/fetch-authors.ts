import groq from "groq";
import { z } from "zod";
import sanityClient from "../sanity.server";

const authorQuery = groq`
*[_type == "author" && _id == $id][0]{
    _id,
    firstName, 
    surname, 
    "articles": *[_type == "news" && references(^._id)] | order(date desc) {
        _id,
        title,
        date,
        "slug": slug.current
    }
}`;

const allAuthorsQuery = groq`
*[_type == "author"]{
    _id,
}`;

const ZAuthorResponse = z.object({
  _id: z.string(),
  firstName: z.string(),
  surname: z.string(),
  articles: z.array(
    z.object({
      _id: z.string(),
      title: z.string(),
      date: z.string(),
      slug: z.string(),
    })
  ),
});

const ZAllAuthorsResponse = ZAuthorResponse.pick({
  _id: true,
}).array();

type Author = z.infer<typeof ZAuthorResponse>;
type AuthorsResponse = z.infer<typeof ZAllAuthorsResponse>;

const fetchAuthor = async <T extends string>(id: T) => {
  const response = await sanityClient.fetch(authorQuery, {
    id,
  });

  return ZAuthorResponse.parse(response) as Author & {
    _id: T;
  };
};

const fetchAllAuthors = async () => {
  const response = await sanityClient.fetch(allAuthorsQuery);

  return ZAllAuthorsResponse.parse(response);
};

export default fetchAuthor;

export { fetchAuthor, fetchAllAuthors };
export type { Author, AuthorsResponse };
