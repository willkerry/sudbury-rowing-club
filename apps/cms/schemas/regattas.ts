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
          title: "Photo provider",
          type: "gallery",
        }),
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Praise for the regatta",
      type: "array",
      of: [defineArrayMember({ type: "testimonial" })],
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
