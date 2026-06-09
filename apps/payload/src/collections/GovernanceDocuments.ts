import type { CollectionConfig } from "payload";
import { z } from "zod";
import { zv } from "@/lib/zv";

export const GovernanceDocuments: CollectionConfig = {
  orderable: true,
  slug: "governanceDocuments",

  versions: true,

  admin: {
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
      admin: { position: "sidebar" },
      defaultValue: "file",
      name: "type",
      required: true,
      type: "radio",
      options: [
        { label: "File", value: "file" },
        { label: "Link", value: "link" },
        { label: "Document", value: "document" },
      ],
    },
    {
      name: "group",
      relationTo: "governanceGroups",
      type: "relationship",
      admin: {
        description:
          "Which grouping the document appears under. Leave blank to leave ungrouped.",
        position: "sidebar",
      },
    },
    {
      defaultValue: true,
      name: "enabled",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
    },

    {
      name: "file",
      relationTo: "media",
      type: "upload",
      admin: {
        condition: (data) => data?.type === "file",
      },
    },
    {
      label: "Link",
      name: "url",
      type: "text",
      validate: zv(
        z
          .union([
            z.url({ message: "Must be a full URL or a /site-relative path." }),
            z.string().regex(/^(\/|mailto:|tel:|#)/, {
              message: "Must be a full URL or a /site-relative path.",
            }),
            z.literal(""),
          ])
          .nullish(),
      ),
      admin: {
        condition: (data) => data?.type === "link",
      },
    },
    {
      name: "richText",
      type: "richText",
      admin: {
        condition: (data) => data?.type === "document",
      },
    },
    {
      index: true,
      name: "sanityDocId",
      type: "text",
      admin: {
        description: "Original Sanity _key. Migration helper.",
        hidden: true,
        position: "sidebar",
      },
    },
  ],

  labels: {
    plural: "Documents",
    singular: "Document",
  },
};
