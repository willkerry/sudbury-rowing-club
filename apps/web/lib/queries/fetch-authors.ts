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
    firstName,
    surname,
    "articleCount": count(*[_type == "news" && references(^._id)])
} | order(articleCount desc, lastName asc, firstName asc)`;

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
  firstName: true,
  surname: true,
})
  .and(z.object({ articleCount: z.number() }))
  .array();

type Author = z.infer<typeof ZAuthorResponse>;
type AuthorsResponse = z.infer<typeof ZAllAuthorsResponse>;

const fetchAuthor = async (id: string) => {
  const response = await sanityClient.fetch(authorQuery, {
    id,
  });

  return ZAuthorResponse.parse(response);
};

const fetchAllAuthors = async () => {
  const response = await sanityClient.fetch(allAuthorsQuery);

  return ZAllAuthorsResponse.parse(response);
};

export default fetchAuthor;

export { fetchAuthor, fetchAllAuthors };
export type { Author, AuthorsResponse };
