import { EditIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const Author = defineType({
  name: "author",
  type: "document",
  title: "Author",
  icon: EditIcon,
  fields: [
    defineField({
      name: "person",
      type: "reference",
      to: [{ type: "person" }],
    } as const),
    defineField({
      name: "firstName",
      type: "string",
      title: "First Name",
      deprecated: {
        reason:
          "Use the First Name field on the referenced Person record instead.",
      },
    }),
    defineField({
      name: "surname",
      type: "string",
      deprecated: {
        reason:
          "Use the Surname field on the referenced Person record instead.",
      },
    }),
  ],
  preview: {
    select: {
      name: "firstName",
      surname: "surname",
    },
    prepare(selection) {
      const { name, surname } = selection;
      return {
        title: name + " " + surname,
      };
    },
  },
});

export default Author;
