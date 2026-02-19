import { defineField, defineType } from "sanity";

const Person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    defineField({ name: "firstName", title: "First name", type: "string" }),
    defineField({ name: "surname", title: "Surname", type: "string" }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),

    defineField({ name: "bio", rows: 3, type: "text" }),
    defineField({ name: "image", title: "Image", type: "figure" }),
  ],
  preview: {
    prepare(selection) {
      const { name, surname, media } = selection;
      return {
        title: `${name} ${surname}`,
        media,
      };
    },
    select: {
      media: "image.image",
      name: "firstName",
      surname: "surname",
    },
  },
});

export default Person;
