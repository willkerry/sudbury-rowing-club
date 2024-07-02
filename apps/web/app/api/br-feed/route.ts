import { NextResponse } from "next/server";
import { z } from "zod";

export const revalidate = 60 * 60 * 24;

const QUERY_URL =
  "https://www.britishrowing.org/wp-json/wp/v2/posts?_fields=id,title,date,link&per_page=12";

const schema = z.array(
  z.object({
    id: z.number(),
    title: z.object({
      rendered: z.string(),
    }),
    date: z.coerce.date(),
    link: z.string(),
  }),
);

export type BRArticle = z.infer<typeof schema>[number];

export const GET = async () => {
  const response = await fetch(QUERY_URL);

  if (!response.ok) {
    return new NextResponse("Server error: BR API request failed", {
      status: 500,
    });
  }

  const json = await response.json();

  const feed = schema.safeParse(json);

  if (!feed.success) {
    return new NextResponse(
      "Server error: unparseable response provided by BR API",
      { status: 500 },
    );
  }

  return new NextResponse(JSON.stringify(feed.data));
};
