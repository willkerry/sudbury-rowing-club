import type { CollectionConfig } from "payload";
import { slugFromTitle } from "../lib/slug-from-title";
import { webAppUrl } from "../lib/web-app";

export const News: CollectionConfig = {
  defaultSort: "-date",
  slug: "news",

  access: {
    read: () => true,
  },

  admin: {
    defaultColumns: ["title", "date", "author"],
    useAsTitle: "title",
    preview: (doc) =>
      typeof doc.slug === "string" ? webAppUrl(`/news/${doc.slug}`) : null,
  },

  fields: [
    {
      name: "title",
      required: true,
      type: "text",
    },
    {
      name: "author",
      relationTo: "people",
      type: "relationship",
      admin: {
        description: "Optional. Pick a name from the People list.",
        position: "sidebar",
      },
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
      admin: {
        description:
          "Short summary shown on the news index and in social previews. Plain text only.",
        position: "sidebar",
      },
    },
    {
      label: "Featured image",
      name: "featuredImage",
      relationTo: "media",
      type: "upload",
      admin: {
        description: "Hero image shown above the article and in cards.",
      },
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
    {
      index: true,
      name: "slug",
      required: true,
      type: "text",
      unique: true,
      admin: {
        description: "URL slug for /news/<slug>.",
        position: "sidebar",
        components: {
          afterInput: [
            {
              exportName: "default",
              path: "/components/SlugFromTitleButton.tsx",
            },
          ],
        },
      },
      hooks: {
        beforeValidate: [slugFromTitle],
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
