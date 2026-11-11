import { defineField, defineType } from "sanity";

const Figure = defineType({
  name: "figure",
  title: "Figure",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
    defineField({
      description:
        "Describe the image for users who cannot see it (e.g. due to visual impairment). This is a very important accessibility provision, so please don’t skip it. ",
      name: "alt",
      title: "Alternative text",
      type: "string",
    }),
    defineField({
      description:
        "Optionally provide a supporting caption for all users. (e.g. subjects’ names or the location).",
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
});

export default Figure;
