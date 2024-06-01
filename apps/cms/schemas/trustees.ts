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
      to: [{ type: "person" } as const],
    }),
  ],
  preview: {
    select: {
      firstName: "reference.firstName",
      surname: "reference.surname",
      media: "reference.image.image",
    },
    prepare(selection) {
      const { firstName, surname, media } = selection;

      return {
        title: `${firstName} ${surname}`,
        media,
      };
    },
  },
});

export default Trustees;
