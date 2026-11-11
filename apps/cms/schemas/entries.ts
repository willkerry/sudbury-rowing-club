import { defineArrayMember, defineField } from "sanity";

const Entries = defineField({
  description: "Provide entry instructions",
  name: "entries",
  type: "object",
  fields: [
    defineField({ name: "description", type: "richText" }),
    defineField({ name: "waves", title: "Wave matrix", type: "table" }),
    defineField({
      name: "wavesCaption",
      rows: 3,
      title: "Wave matrix caption",
      type: "text",
    }),
    defineField({
      description: "List of wave names",
      name: "waveNames",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      title: "Wave names",
      type: "array",
    }),
  ],
  options: {
    collapsible: true,
  },
});

export default Entries;
