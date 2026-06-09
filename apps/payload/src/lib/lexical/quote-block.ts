import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

export const QuoteBlock: Block = {
  interfaceName: "QuoteBlock",
  labels: { plural: "Quotes", singular: "Quote" },
  slug: "quote",
  fields: [
    {
      editor: lexicalEditor(),
      name: "body",
      required: true,
      type: "richText",
    },
    {
      name: "attribution",
      type: "text",
    },
  ],
};
