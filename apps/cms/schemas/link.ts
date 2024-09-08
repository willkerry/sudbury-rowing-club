import { defineField } from "sanity";

const Link = defineField({
  name: "link",
  type: "object",
  title: "Link",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "url",
      type: "url",
      title: "URL",
    }),
  ],
});

export default Link;
