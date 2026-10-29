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
      readOnly: true,
      title: "Email",
      type: "string",
      deprecated: {
        reason:
          "Personal addresses are no longer used. Set the Email field on the officer role instead.",
      },
      hidden: ({ value }) => !value,
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
