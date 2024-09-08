import { defineArrayMember, defineField } from "sanity";

const RegattaLandingPage = defineField({
  type: "object",
  name: "regattaLandingPage",
  title: "Landing Page",
  description: "Content displayed on the main regatta landing page.",

  options: {
    collapsible: true,
  },
  fields: [
    defineField({ name: "tagline", type: "text", rows: 2 }),
    defineField({ name: "description", type: "richText" }),
    defineField({
      name: "heroImage",
      type: "heroImage",
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

export default RegattaLandingPage;
