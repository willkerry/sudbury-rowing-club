import type { CollectionConfig } from "payload";

export const Committees: CollectionConfig = {
  defaultSort: "title",
  slug: "committees",

  versions: true,

  access: {
    read: () => true,
  },

  admin: {
    defaultColumns: ["title", "description"],
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
      name: "description",
      type: "textarea",
    },
    {
      hasMany: true,
      name: "members",
      relationTo: "officers",
      type: "relationship",
      admin: {
        description:
          "Officers sitting on this committee. Their photos and names come from the linked Person record.",
      },
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
