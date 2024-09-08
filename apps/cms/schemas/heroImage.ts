import { defineField } from "sanity";

const heroImage = defineField({
  name: "heroImage",
  type: "object",
  options: {
    collapsible: true,
  },
  fields: [
    defineField({ name: "image", type: "image" }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "subheading", type: "string" }),
  ],
});

export default heroImage;
