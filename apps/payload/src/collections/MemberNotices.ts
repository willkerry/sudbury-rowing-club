import type { CollectionConfig } from "payload";
import { slugFromTitle } from "../lib/slug-from-title";

export const MemberNotices: CollectionConfig = {
  slug: "memberNotices",

  access: {
    read: () => true,
  },

  admin: {
    defaultColumns: ["title", "updatedAt"],
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
        description: "URL slug for /members/<slug>.",
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
    {
      labels: { plural: "Items", singular: "Item" },
      name: "meta",
      type: "array",
      admin: {
        description: "Key/value metadata shown alongside the notice.",
      },
      fields: [
        { name: "label", type: "text" },
        { name: "value", type: "text" },
      ],
    },
    {
      name: "body",
      type: "richText",
    },
    {
      labels: { plural: "Groups", singular: "Group" },
      name: "documents",
      type: "array",
      admin: {
        description: "Optional grouped file attachments.",
      },
      fields: [
        { name: "title", type: "text" },
        {
          name: "files",
          type: "array",
          fields: [
            { name: "title", type: "text" },
            {
              name: "file",
              relationTo: "media",
              type: "upload",
            },
          ],
        },
      ],
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
    plural: "Notices",
    singular: "Notice",
  },

  versions: {
    drafts: true,
  },
};
