import type { CollectionConfig } from "payload";

export const Trustees: CollectionConfig = {
  defaultSort: "occupant",
  slug: "trustees",

  access: {
    read: () => true,
  },

  admin: {
    defaultColumns: ["occupant"],
    group: "Governance",
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
