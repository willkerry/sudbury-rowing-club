import { UsersIcon } from "@sanity/icons";

export default {
  name: "trustees",
  type: "document",
  title: "Trustees",
  icon: UsersIcon,
  fields: [
    { name: "firstName", type: "string", title: "First Name" },
    { name: "surname", type: "string", title: "Surname" },
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
