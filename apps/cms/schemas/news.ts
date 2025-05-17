import { BookIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const News = defineType({
  name: "news",
  type: "document",
  title: "News",
  icon: BookIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" } as const],
    }),
    defineField({ name: "excerpt", type: "text", title: "Excerpt", rows: 3 }),
    defineField({
      name: "date",
      type: "date",
      title: "Original publication date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "body", type: "richText", title: "Body" }),
    defineField({
      name: "featuredImage",
      type: "figure",
      title: "Featured image",
    }),
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
});

export default News;
