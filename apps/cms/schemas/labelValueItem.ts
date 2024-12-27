import { defineField } from "sanity";

const LabelValueItem = defineField({
  type: "object",
  name: "labelValueItem",
  options: {
    columns: 2,
  },
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "value", type: "string" }),
  ],
});

export default LabelValueItem;
