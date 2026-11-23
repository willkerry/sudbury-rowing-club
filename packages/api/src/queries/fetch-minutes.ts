import groq from "groq";
import { z } from "zod";
import { sanityFetch } from "../sanity/client";

const query = groq`*[_type == "minutes"] | order(date desc){
  _id,
  date,
  "public": defined(public),
  "file": select(
    public => file.asset->url,
    null
  ),
  "committee": committee->title
}`;

const ZMinutes = z.object({
  _id: z.string(),

  /**
   * The name of the committee that the minutes are for
   *
   * @example "Executive"
   * @example "Social"
   */
  committee: z.string(),

  /**
   * Formatted as `D Mmm YYYY`
   *
   * @example "1 Jan 2021"
   * @example "31 Dec 2020"
   */
  date: z.string().transform((date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  ),

  /**
   * Must be an absolute URL, generally to a PDF file
   */
  file: z.string().url().nullable(),

  /**
   * Whether the minutes are public or not
   */
  public: z.boolean(),
});

const fetchMinutes = async () => sanityFetch(query, z.array(ZMinutes).parse);

type Minutes = z.infer<typeof ZMinutes>;

export type { Minutes };
export { fetchMinutes };
