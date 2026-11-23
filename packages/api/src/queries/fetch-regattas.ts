import groq from "groq";
import { z } from "zod";
import { sanityFetch } from "../sanity/client";

const regattasQuery = groq`
    *[_type == "regattas"] | order(date desc) {
        _id,
        date,
        number,
        results,
        testimonials
    }
`;

const ZTestimonial = z.object({
  _key: z.string(),
  club: z.string().default(""),
  name: z.string().default(""),
  text: z.string(),
});

const ZRegatta = z.object({
  _id: z.string(),
  date: z.string(),
  number: z.number(),
  results: z.string(),
  testimonials: z.array(ZTestimonial).nullable(),
});

const fetchRegattas = async () =>
  sanityFetch(regattasQuery, z.array(ZRegatta).parse);

type Regatta = z.infer<typeof ZRegatta>;
type Testimonial = z.infer<typeof ZTestimonial>;

export type { Regatta, Testimonial };
export { fetchRegattas };
