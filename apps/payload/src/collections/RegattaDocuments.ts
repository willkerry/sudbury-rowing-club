import type { CollectionConfig } from "payload";

export const RegattaDocuments: CollectionConfig = {
  orderable: true,
  slug: "regattaDocuments",

  versions: true,

  admin: {
    group: "Regatta",
    useAsTitle: "title",
  },

  fields: [
    {
      name: "title",
      required: true,
      type: "text",
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
    },
  ],

  labels: {
    plural: "Documents",
    singular: "Document",
  },
};
