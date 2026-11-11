import { defineField, defineType } from "sanity";

const OEmbed = defineType({
  name: "oembed",
  title: "OEmbed",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "URL",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export default OEmbed;
