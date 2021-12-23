import { MdSupervisorAccount } from "react-icons/md";

export default {
  name: "trustees",
  type: "document",
  title: "Trustees",
  icon: MdSupervisorAccount,
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
