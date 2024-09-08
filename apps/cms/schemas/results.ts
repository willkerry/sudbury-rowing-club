import { defineField } from "sanity";

const Results = defineField({
  type: "object",
  name: "results",
  description: "Control how regatta results are displayed.",
  fields: [
    defineField({ name: "description", type: "richText" }),
    defineField({ name: "courseRecords", type: "file" }),
  ],
  options: {
    collapsible: true,
  },
});

export default Results;
