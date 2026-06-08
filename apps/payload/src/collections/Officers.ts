import type { CollectionConfig } from "payload";

export const Officers: CollectionConfig = {
  orderable: true,
  slug: "officers",

  access: {
    read: () => true,
  },

  admin: {
    group: "Governance",
    useAsTitle: "role",
  },

  fields: [
    {
      name: "role",
      required: true,
      type: "text",
    },
    {
      name: "occupant",
      relationTo: "people",
      type: "relationship",
    },
    {
      name: "description",
      type: "textarea",
    },
  ],
};
