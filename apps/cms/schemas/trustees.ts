import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const Trustees = defineType({
  name: "trustees",
  type: "document",
  title: "Trustees",
  icon: UsersIcon,
  fields: [
    defineField({ name: "firstName", type: "string", title: "First Name" }),
    defineField({ name: "surname", type: "string", title: "Surname" }),
    defineField({
      name: "reference",
      type: "reference",
      to: [{ type: "person" }],
    }),
  ],
  preview: {
    select: {
      firstName: "reference.firstName",
      surname: "reference.surname",
      media: "reference.image.image",
    },
    prepare(selection: { firstName: string; surname: string; media: any }) {
      const { firstName, surname, media } = selection;

      return {
        title: firstName + " " + surname,
        media,
      };
    },
  },
});

export default Trustees;
