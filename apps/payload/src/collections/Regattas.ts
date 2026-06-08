import type { CollectionConfig } from "payload";
import { z } from "zod";
import { zv } from "../lib/zv";

export const Regattas: CollectionConfig = {
  slug: "regattas",

  admin: {
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

      validate: zv(z.url({ message: "This must be a valid URL." }).nullable()),
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
  ],
};
