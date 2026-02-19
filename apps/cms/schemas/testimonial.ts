import { defineField } from "sanity";

const Testimonial = defineField({
  name: "testimonial",
  title: "Testimonial",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      description: "Leave blank to display testimonial as ‘Anonymous’.",
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "club",
      title: "Club",
      type: "string",
    }),
  ],
});

export default Testimonial;
