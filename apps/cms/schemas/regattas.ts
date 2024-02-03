import { CalendarIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const Regattas = defineType({
  name: "regattas",
  title: "Regattas",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "number",
      title: "Number",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "results", title: "Link to results", type: "url" }),
    defineField({
      name: "galleries",
      title: "Links to photos",
      type: "array",

      of: [
        defineArrayMember({
          name: "gallery",
          title: "Photo provider",
          type: "object",
          fields: [
            {
              name: "name",
              type: "string",
              title: "Provider name",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              type: "url",
              title: "URL to photo provider",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "password",
              type: "string",
              title: "Password",
              description: "Leave blank if not required.",
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Praise for the regatta",
      type: "array",
      of: [
        defineArrayMember({
          name: "testimonial",
          title: "Testimonial",
          type: "object",
          fields: [
            {
              name: "text",
              type: "text",
              title: "Text",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "name",
              type: "string",
              title: "Name",
              description: "Leave blank to display testimonial as ‘Anonymous’.",
            },
            {
              name: "club",
              type: "string",
              title: "Club",
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "number",
      subtitle: "date",
    },
  },
});

export default Regattas;
