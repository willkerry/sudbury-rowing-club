import { defineField, defineType } from "sanity";

const Quote = defineType({
  name: "quote",
  title: "Blockquote",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      type: "richText",
    }),
    defineField({
      name: "attribution",
      type: "string",
    }),
  ],
});

export default Quote;
