import { defineArrayMember, defineField } from "sanity";

const LandingPage = defineField({
  type: "object",
  name: "landingPage",
  title: "Landing Page",
  description: "Content displayed on the main landing page.",
  options: {
    collapsible: true,
  },
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "tagline", type: "text", rows: 2 }),
    defineField({ name: "description", type: "richText" }),
    defineField({
      name: "note",
      type: "note",
    }),
    defineField({
      name: "images",
      type: "array",
      options: {
        layout: "grid",
      },
      of: [
        defineArrayMember({
          name: "image",
          type: "image",

          fields: [
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
            }),
          ],
        }),
      ],
    }),
  ],
});

export default LandingPage;
