import type { CollectionConfig } from "payload";

export const News: CollectionConfig = {
  defaultSort: "-date",
  slug: "news",

  access: {
    read: () => true,
  },

  admin: {
    defaultColumns: ["title", "date", "author"],
    useAsTitle: "title",
  },

  fields: [
    {
      name: "title",
      required: true,
      type: "text",
    },
    {
      index: true,
      name: "slug",
      required: true,
      type: "text",
      unique: true,
      admin: {
        description: "URL slug for /news/<slug>.",
        position: "sidebar",
      },
    },
    {
      name: "author",
      relationTo: "people",
      type: "relationship",
    },
    {
      name: "date",
      required: true,
      type: "date",
      admin: {
        description: "Original publication date.",
        position: "sidebar",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
    },
    {
      name: "featuredImage",
      relationTo: "media",
      type: "upload",
    },
    {
      name: "body",
      type: "richText",
    },
    {
      index: true,
      name: "sanityDocId",
      type: "text",
      admin: {
        description:
          "Original Sanity _id. FE fallback during cutover. Removable after.",
        hidden: true,
        position: "sidebar",
      },
    },
  ],

  labels: {
    plural: "Posts",
    singular: "Post",
  },

  versions: {
    drafts: true,
  },
};
