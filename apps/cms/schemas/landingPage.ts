import { defineArrayMember, defineField } from "sanity";

const LandingPage = defineField({
  description: "Content displayed on the main landing page.",
  name: "landingPage",
  title: "Landing Page",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "tagline", rows: 2, type: "text" }),
    defineField({ name: "description", type: "richText" }),
    defineField({ name: "heroImage", type: "image" }),
    defineField({
      name: "note",
      type: "note",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [
        defineArrayMember({
          name: "image",
          type: "image",

          fields: [
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
      ],
      options: {
        layout: "grid",
      },
    }),
  ],
  options: {
    collapsible: true,
  },
});

export default LandingPage;
