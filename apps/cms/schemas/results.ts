import { defineField } from "sanity";

const Results = defineField({
  description: "Control how regatta results are displayed.",
  name: "results",
  type: "object",
  fields: [
    defineField({ name: "description", type: "richText" }),
    defineField({ name: "courseRecords", type: "file" }),
  ],
  options: {
    collapsible: true,
  },
});

export default Results;
