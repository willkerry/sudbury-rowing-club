import type { GlobalConfig } from "payload";

export const Landing: GlobalConfig = {
  slug: "landing",

  fields: [
    {
      name: "title",
      type: "text",
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
      name: "hero",
      relationTo: "media",
      type: "upload",
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
  ],
};
