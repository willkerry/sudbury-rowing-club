import { EditIcon } from "@sanity/icons";

export default {
  name: "author",
  type: "document",
  title: "Author",
  icon: EditIcon,
  fields: [
    { name: "firstName", type: "string", title: "First Name" },
    { name: "surname", type: "string" },
    { name: "bio", type: "text", rows: 3 },
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
