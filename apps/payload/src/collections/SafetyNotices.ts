import type { CollectionConfig } from "payload";
import { z } from "zod";
import { zv } from "../lib/zv";

export const SafetyNotices: CollectionConfig = {
  slug: "safetyNotices",

  admin: {
    defaultColumns: ["title", "pin", "date"],
    group: "Safety",
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
      name: "slug",
      required: true,
      type: "text",
      unique: true,
      admin: {
        description: "URL slug for /safety/<slug>. Auto-set on migration.",
        position: "sidebar",
      },
    },
    {
      name: "body",
      type: "richText",
    },
    {
      name: "document",
      type: "group",
      validate: ((
        value: { title?: string; document?: string } | null | undefined,
      ) => {
        if (!value) return true;
        const hasTitle = Boolean(value.title?.trim());
        const hasUpload = Boolean(value.document);
        if (hasTitle !== hasUpload) {
          return "Either fill in both a document title and a file, or leave both blank.";
        }

        return true;
      }) as never,
      admin: {
        description:
          "Optional attached document. Either fill in both fields or leave both empty.",
      },
      fields: [
        { name: "title", type: "text" },
        {
          name: "document",
          relationTo: "media",
          type: "upload",
        },
      ],
    },
    {
      label: "External link URL",
      name: "link",
      type: "text",
      validate: zv(
        z
          .url({ message: "This must be a valid URL." })
          .or(z.literal(""))
          .nullish(),
      ),
    },
    {
      defaultValue: false,
      label: "Pin to top",
      name: "pin",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "date",
      type: "date",
      admin: {
        description:
          "Displayed as the notice’s last updated date. Not necessarily the true last-updated date.",
        position: "sidebar",
      },
      defaultValue: () => new Date(),
    },
    {
      index: true,
      name: "sanityDocId",
      type: "text",
      admin: {
        description:
          "Original Sanity _id. FE fallback during cutover. Removable after.",
        hidden: true,
        position: "sidebar",
      },
    },
  ],

  labels: {
    plural: "Notices",
    singular: "Notice",
  },
};
