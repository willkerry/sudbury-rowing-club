import { defineArrayMember, defineField } from "sanity";

const Entries = defineField({
  type: "object",
  name: "entries",
  description: "Provide entry instructions",
  fields: [
    defineField({ name: "description", type: "richText" }),
    defineField({ name: "waves", title: "Wave matrix", type: "table" }),
    defineField({
      name: "wavesCaption",
      title: "Wave matrix caption",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "waveNames",
      type: "array",
      title: "Wave names",
      of: [defineArrayMember({ type: "string" })],
      description: "List of wave names",
      options: { layout: "tags" },
    }),
  ],
  options: {
    collapsible: true,
  },
});

export default Entries;
