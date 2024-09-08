import { defineArrayMember, defineField } from "sanity";

const CompetitorInformation = defineField({
  name: "competitorInformation",
  type: "object",
  description: "Documents and information",
  fields: [
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({
      name: "documents",
      type: "array",
      of: [
        defineArrayMember({
          type: "file",
          name: "file",
          fields: [defineField({ name: "title", type: "string" })],
        }),
      ],
    }),
  ],
  options: {
    collapsible: true,
  },
});

export default CompetitorInformation;
