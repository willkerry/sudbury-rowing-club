import type { CollectionConfig } from "payload";
import { z } from "zod";
import { zv } from "../lib/zv";

export const Regattas: CollectionConfig = {
  defaultSort: "-number",
  slug: "regattas",

  admin: {
    defaultColumns: ["number", "date"],
    group: "Regatta",
    useAsTitle: "number",
  },

  fields: [
    {
      name: "number",
      required: true,
      type: "number",
    },
    {
      name: "date",
      required: true,
      type: "date",
    },
    {
      name: "results",
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
        description: "Link to results",
      },
    },

    {
      name: "galleries",
      type: "array",
      fields: [
        {
          name: "name",
          required: true,
          type: "text",
        },
        {
          name: "url",
          required: true,
          type: "text",
          validate: zv(
            z.url({ message: "This must be a valid URL." }).nullable(),
          ),
        },
        {
          name: "password",
          type: "text",
        },
      ],
    },
    {
      labels: { plural: "Testimonials", singular: "Testimonial" },
      name: "testimonials",
      type: "array",
      fields: [
        {
          name: "quote",
          required: true,
          type: "textarea",
        },
        {
          name: "name",
          type: "text",
        },
        {
          name: "club",
          type: "text",
        },
      ],
    },
    {
      index: true,
      name: "sanityDocId",
      type: "text",
      admin: {
        description: "Original Sanity _id. Migration helper.",
        hidden: true,
        position: "sidebar",
      },
    },
  ],
};
