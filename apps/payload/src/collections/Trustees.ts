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
      admin: {
        description:
          "Pick from the People collection. Add a Person record first if they aren't already there.",
      },
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
