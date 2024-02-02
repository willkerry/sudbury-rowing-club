import { EditIcon } from "@sanity/icons";
import { defineField, DocumentDefinition } from "sanity";

const Author: DocumentDefinition = {
  name: "author",
  type: "document",
  title: "Author",
  icon: EditIcon,
  deprecated: {
    reason: "News pieces can now be directly accredited to Person records.",
  },
  fields: [
    // Reading comments in Sanity’s declaration files, it seems that narrowing
    // based on the type property doesn’t work in VS Code.
    {
      name: "person",
      description:
        "Deprecated Author records must be linked to a Person record.",
      type: "reference",
      to: [{ type: "person" }],
    },
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
};

export default Author;
