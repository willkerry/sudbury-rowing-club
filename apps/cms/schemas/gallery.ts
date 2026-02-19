import { defineField } from "sanity";

const Gallery = defineField({
  name: "gallery",
  title: "Photo provider",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Provider name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL to photo provider",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      description: "Leave blank if not required.",
      name: "password",
      title: "Password",
      type: "string",
    }),
  ],
});

export default Gallery;
