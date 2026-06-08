import type { CollectionConfig } from "payload";

export const Trustees: CollectionConfig = {
  slug: "trustees",

  access: {
    read: () => true,
  },

  admin: {
    useAsTitle: "occupant",
  },

  fields: [
    {
      name: "person",
      relationTo: "people",
      required: true,
      type: "relationship",
    },

    {
      name: "occupant",
      type: "text",
      virtual: "person.fullName",
      admin: {
        hidden: true,
      },
    },
  ],
};
