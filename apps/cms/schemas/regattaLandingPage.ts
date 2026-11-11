import { defineArrayMember, defineField } from "sanity";

const RegattaLandingPage = defineField({
  description: "Content displayed on the main regatta landing page.",
  name: "regattaLandingPage",
  title: "Landing Page",
  type: "object",
  fields: [
    defineField({ name: "tagline", rows: 2, type: "text" }),
    defineField({ name: "description", type: "richText" }),
    defineField({
      name: "heroImage",
      type: "heroImage",
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

export default RegattaLandingPage;
