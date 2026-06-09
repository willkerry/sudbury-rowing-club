import type { CollectionConfig } from "payload";

export const Officers: CollectionConfig = {
  orderable: true,
  slug: "officers",
  versions: true,

  access: {
    read: () => true,
  },

  admin: {
    defaultColumns: ["role", "occupant"],
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
    {
      index: true,
      name: "sanityDocId",
      type: "text",
      admin: {
        description:
          "Original Sanity _id. Used to re-link cross-references during migration. Removable post-cutover.",
        hidden: true,
        position: "sidebar",
      },
    },
  ],
};
