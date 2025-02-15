import { defineField } from "sanity";

const Gallery = defineField({
  name: "gallery",
  title: "Photo provider",
  type: "object",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Provider name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      type: "url",
      title: "URL to photo provider",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "password",
      type: "string",
      title: "Password",
      description: "Leave blank if not required.",
    }),
  ],
});

export default Gallery;
