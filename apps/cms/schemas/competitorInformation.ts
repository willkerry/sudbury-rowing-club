import { defineArrayMember, defineField } from "sanity";

const CompetitorInformation = defineField({
  description: "Documents and information",
  name: "competitorInformation",
  type: "object",
  fields: [
    defineField({ name: "description", rows: 4, type: "text" }),
    defineField({
      name: "documents",
      type: "array",
      of: [
        defineArrayMember({
          fields: [defineField({ name: "title", type: "string" })],
          name: "file",
          type: "file",
        }),
      ],
    }),
  ],
  options: {
    collapsible: true,
  },
});

export default CompetitorInformation;
