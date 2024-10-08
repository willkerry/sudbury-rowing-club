import { defineField, defineType } from "sanity";

const Person = defineType({
  name: "person",
  type: "document",
  title: "Person",
  fields: [
    defineField({ name: "firstName", type: "string", title: "First name" }),
    defineField({ name: "surname", type: "string", title: "Surname" }),
    defineField({
      name: "email",
      type: "string",
      title: "Email",
      validation: (Rule) => Rule.email(),
    }),

    defineField({ name: "bio", type: "text", rows: 3 }),
    defineField({ name: "image", type: "figure", title: "Image" }),
  ],
  preview: {
    select: {
      name: "firstName",
      surname: "surname",
      media: "image.image",
    },
    prepare(selection) {
      const { name, surname, media } = selection;
      return {
        title: `${name} ${surname}`,
        media,
      };
    },
  },
});

export default Person;
