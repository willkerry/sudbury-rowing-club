import { defineField } from "sanity";

const Testimonial = defineField({
  name: "testimonial",
  title: "Testimonial",
  type: "object",
  fields: [
    defineField({
      name: "text",
      type: "text",
      title: "Text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      description: "Leave blank to display testimonial as ‘Anonymous’.",
    }),
    defineField({
      name: "club",
      type: "string",
      title: "Club",
    }),
  ],
});

export default Testimonial;
