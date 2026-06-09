import type { CollectionConfig } from "payload";

export const VicePresidents: CollectionConfig = {
  defaultSort: "occupant",
  slug: "vice-presidents",

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
          "Pick a name from the People list. If they aren't there yet, add them under People first.",
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
