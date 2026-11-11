import { defineField } from "sanity";

const heroImage = defineField({
  name: "heroImage",
  type: "object",
  fields: [
    defineField({ name: "image", type: "image" }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "subheading", type: "string" }),
  ],
  options: {
    collapsible: true,
  },
});

export default heroImage;
