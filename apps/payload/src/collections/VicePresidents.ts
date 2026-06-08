import type { CollectionConfig } from "payload";

export const VicePresidents: CollectionConfig = {
  slug: "vice-presidents",

  access: {
    read: () => true,
  },

  admin: {
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
