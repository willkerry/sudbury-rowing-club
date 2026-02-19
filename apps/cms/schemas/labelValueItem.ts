import { defineField } from "sanity";

const LabelValueItem = defineField({
  name: "labelValueItem",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "value", type: "string" }),
  ],
  options: {
    columns: 2,
  },
});

export default LabelValueItem;
