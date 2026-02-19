import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";

const regattasQuery = groq`
    *[_type == "regattas" && !(_id in path("drafts.**"))] | order(date desc) {
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
  z.array(ZRegatta).parse(await sanityClient.fetch(regattasQuery));

type Regatta = z.infer<typeof ZRegatta>;
type Testimonial = z.infer<typeof ZTestimonial>;

export { fetchRegattas };
export type { Regatta, Testimonial };
