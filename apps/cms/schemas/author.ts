import { EditIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const Author = defineType({
  icon: EditIcon,
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "person",
      to: [{ type: "person" }],
      type: "reference",
    } as const),
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
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
    prepare(selection) {
      const { name, surname } = selection;
      return {
        title: `${name} ${surname}`,
      };
    },
    select: {
      name: "firstName",
      surname: "surname",
    },
  },
});

export default Author;
