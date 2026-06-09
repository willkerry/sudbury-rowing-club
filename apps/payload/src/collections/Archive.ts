import type { CollectionConfig } from "payload";

export const Archive: CollectionConfig = {
  defaultSort: "-year",
  slug: "archive",

  versions: true,

  access: {
    read: () => true,
  },

  admin: {
    defaultColumns: ["title", "year", "range"],
    useAsTitle: "title",
  },

  fields: [
    {
      name: "title",
      required: true,
      type: "text",
    },
    {
      name: "year",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          displayFormat: "yyyy",
          pickerAppearance: "monthOnly",
        },
      },
    },
    {
      defaultValue: 0,
      name: "range",
      type: "number",
      admin: {
        description:
          "How fuzzy the year is. Larger values widen the 'circa' window shown on the page.",
        position: "sidebar",
      },
    },
    {
      name: "image",
      relationTo: "media",
      type: "upload",
      admin: {
        description:
          "Alt text and caption live on the Media record itself, not here.",
      },
    },
    {
      name: "location",
      type: "group",
      admin: {
        description: "Approximate map point (WGS-84).",
      },
      fields: [
        { label: "Latitude", name: "lat", type: "number" },
        { label: "Longitude", name: "lng", type: "number" },
      ],
    },
    {
      index: true,
      name: "sanityDocId",
      type: "text",
      admin: {
        description: "Original Sanity _id. Migration helper.",
        hidden: true,
        position: "sidebar",
      },
    },
  ],

  labels: {
    plural: "Archive",
    singular: "Archive item",
  },
};
