import { defineField } from "sanity";

const Link = defineField({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
  ],
});

export default Link;
