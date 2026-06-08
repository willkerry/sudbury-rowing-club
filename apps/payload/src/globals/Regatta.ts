import type { GlobalConfig } from "payload";

export const Regatta: GlobalConfig = {
  label: "Settings",
  slug: "regatta",

  admin: {
    group: "Regatta",
  },

  fields: [
    {
      name: "title",
      type: "text",
    },
    {
      name: "date",
      type: "date",
    },
    {
      name: "tagline",
      type: "text",
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "images",
      type: "array",
      fields: [
        {
          name: "image",
          relationTo: "media",
          type: "upload",
        },
      ],
    },

    {
      name: "events",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "gender",
          type: "text",
        },
        {
          name: "prizes",
          type: "text",
        },
        {
          name: "course",
          type: "radio",
          options: [
            {
              label: "350m",
              value: "350m",
            },
            {
              label: "650m",
              value: "650m",
            },
          ],
        },
        {
          name: "categories",
          type: "textarea",
        },
        {
          hasMany: true,
          name: "boatClasses",
          type: "select",
          options: [
            {
              label: "8+",
              value: "8+",
            },
            {
              label: "4+",
              value: "4+",
            },
            {
              label: "4×−",
              value: "4x-",
            },
            {
              label: "4×+",
              value: "4x+",
            },
            {
              label: "2+",
              value: "2+",
            },
            {
              label: "2−",
              value: "2-",
            },
            {
              label: "2×",
              value: "2x",
            },
            {
              label: "1×",
              value: "1x",
            },
          ],
        },
      ],
    },

    {
      name: "entries",
      type: "group",
      fields: [
        {
          name: "description",
          type: "richText",
        },
        // work out how to represent the wave matrix
      ],
    },

    {
      name: "results",
      type: "group",
      fields: [
        {
          name: "description",
          type: "richText",
        },
        {
          name: "courseRecords",
          relationTo: "media",
          type: "upload",
        },
      ],
    },

    {
      name: "course",
      type: "group",
      fields: [
        { name: "heading", type: "text" },
        {
          name: "description",
          type: "richText",
        },
        {
          name: "map",
          relationTo: "media",
          type: "upload",
        },
        {
          name: "mapImage",
          relationTo: "media",
          type: "upload",
        },
      ],
    },
  ],
};
