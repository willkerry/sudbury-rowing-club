import { MdRssFeed } from "react-icons/md/";

export default {
  name: "news",
  type: "document",
  title: "News",
  icon: MdRssFeed,
  fields: [
    { name: "title", type: "string", title: "Title" },
    { name: "slug", type: "slug", title: "Slug" },
    { name: "author", type: "reference", to: [{ type: "author" }] },
    { name: "excerpt", type: "text", title: "Excerpt", rows: 3 },
    { name: "date", type: "date", title: "Original publication date" },
    { name: "body", type: "richText", title: "Body" },
    { name: "featuredImage", type: "figure", title: "Featured image" },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "body",
      media: "featuredImage.image",
    },
  },
  orderings: [
    {
      title: "Publication Date, New",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Slug",
      name: "slugAsc",
      by: [{ field: "slug", direction: "desc" }],
    },
  ],
};
