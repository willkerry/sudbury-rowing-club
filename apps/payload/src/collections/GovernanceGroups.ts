import type { CollectionConfig } from "payload";

export const GovernanceGroups: CollectionConfig = {
  orderable: true,
  slug: "governanceGroups",
  versions: true,

  admin: {
    defaultColumns: ["title"],
    group: "Governance",
    hidden: true,
    useAsTitle: "title",
  },

  fields: [
    {
      name: "title",
      required: true,
      type: "text",
    },
    {
      index: true,
      name: "sanityDocId",
      type: "text",
      admin: {
        description: "Original Sanity _key on the parent resourceGroup.",
        hidden: true,
        position: "sidebar",
      },
    },
  ],

  labels: {
    plural: "Groups",
    singular: "Group",
  },
};
