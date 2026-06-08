import type { CollectionConfig } from "payload";
import { z } from "zod";
import { zv } from "@/lib/zv";

export const GovernanceDocuments: CollectionConfig = {
  orderable: true,
  slug: "governanceDocuments",

  versions: true,

  admin: {
    group: "Governance",
    useAsTitle: "title",
  },

  fields: [
    {
      name: "title",
      required: true,
      type: "text",
    },
    {
      hasMany: true,
      name: "type",
      type: "select",
      options: [
        {
          label: "File",
          value: "file",
        },
        {
          label: "Link",
          value: "link",
        },
        {
          label: "Document",
          value: "document",
        },
      ],
    },
    {
      defaultValue: true,
      name: "enabled",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
    },

    {
      name: "file",
      relationTo: "media",
      type: "upload",
      admin: {
        condition: (data) => data?.type === "file",
      },
    },
    {
      label: "Link",
      name: "url",
      type: "text",
      validate: zv(z.url({ message: "This must be a valid URL." }).nullable()),
      admin: {
        condition: (data) => data?.type === "link",
      },
    },
    {
      name: "richText",
      type: "richText",
      admin: {
        condition: (data) => data?.type === "document",
      },
    },
  ],

  labels: {
    plural: "Documents",
    singular: "Document",
  },
};
