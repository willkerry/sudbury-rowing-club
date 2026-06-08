import type { CollectionConfig } from "payload";
import { z } from "zod";
import { zv } from "../lib/zv";

export const SafetyNotices: CollectionConfig = {
  slug: "safetyNotices",

  admin: {
    group: "Safety",
  },

  fields: [
    {
      name: "title",
      type: "text",
    },
    {
      name: "body",
      type: "richText",
    },
    {
      label: "Pin to top",
      name: "pin",
      type: "checkbox",
    },
    {
      name: "document",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "document",
          relationTo: "media",
          type: "upload",
        },
      ],
    },
    {
      name: "link",
      type: "text",
      validate: zv(z.url({ message: "This must be a valid URL." }).nullable()),
    },
    {
      name: "date",
      type: "date",
      admin: {
        description:
          "Displayed as the notice’s last updated date. Is not necessarily the same as the true last updated date.",
        position: "sidebar",
      },
    },
  ],

  labels: {
    plural: "Notices",
    singular: "Notice",
  },
};
