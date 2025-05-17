import { defineField, defineType } from "sanity";

const OEmbed = defineType({
  name: "oembed",
  title: "OEmbed",
  type: "object",
  fields: [
    defineField({
      name: "url",
      type: "string",
      title: "URL",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export default OEmbed;
