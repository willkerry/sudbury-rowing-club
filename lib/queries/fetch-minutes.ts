import groq from "groq";
import { z } from "zod";
import sanityClient from "../sanity.server";

const query = groq`*[_type == "minutes" && !(_id in path("drafts.**"))] | order(date desc){
  _id,
  date,
  "file": file.asset->url,
  "committee": committee->title
}`;

const ZMinutes = z.object({
  _id: z.string(),

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
    })
  ),

  /**
   * Must be an absolute URL, generally to a PDF file
   */
  file: z.string().url(),

  /**
   * The name of the committee that the minutes are for
   *
   * @example "Executive"
   * @example "Social"
   */
  committee: z.string(),
});

const fetchMinutes = async () => {
  const response = await sanityClient.fetch(query);

  return z.array(ZMinutes).parse(response);
};

type Minutes = z.infer<typeof ZMinutes>;

export default fetchMinutes;
export type { Minutes };