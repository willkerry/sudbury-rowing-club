import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

export const NoteBlock: Block = {
  interfaceName: "NoteBlock",
  labels: { plural: "Notes", singular: "Note" },
  slug: "note",
  fields: [
    {
      defaultValue: "primary",
      name: "variant",
      required: true,
      type: "select",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
      ],
    },
    {
      editor: lexicalEditor(),
      name: "body",
      required: true,
      type: "richText",
    },
  ],
};
