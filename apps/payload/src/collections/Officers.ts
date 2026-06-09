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
      admin: {
        description:
          "Person currently in this role. Leave blank if the position is vacant.",
      },
    },
    {
      label: "Role description",
      name: "description",
      type: "textarea",
      admin: {
        description:
          "What this officer is responsible for. Shown on the governance page.",
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
