import { BookIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const News = defineType({
  icon: BookIcon,
  name: "news",
  title: "News",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      options: { source: "title" },
      title: "Slug",
      type: "slug",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      to: [{ type: "author" } as const],
      type: "reference",
    }),
    defineField({ name: "excerpt", rows: 3, title: "Excerpt", type: "text" }),
    defineField({
      name: "date",
      title: "Original publication date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "body", title: "Body", type: "richText" }),
    defineField({
      name: "featuredImage",
      title: "Featured image",
      type: "figure",
    }),
  ],
  orderings: [
    {
      by: [{ direction: "desc", field: "date" }],
      name: "dateDesc",
      title: "Publication Date, New",
    },
    {
      by: [{ direction: "desc", field: "slug" }],
      name: "slugAsc",
      title: "Slug",
    },
  ],
  preview: {
    select: {
      media: "featuredImage.image",
      subtitle: "body",
      title: "title",
    },
  },
});

export default News;
